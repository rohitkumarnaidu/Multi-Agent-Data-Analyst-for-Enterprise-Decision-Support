import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import RobustScaler, OrdinalEncoder, OneHotEncoder
from category_encoders import TargetEncoder
from statsmodels.stats.outliers_influence import variance_inflation_factor
import sklearn

# Ensure pandas output for sklearn >= 1.2
sklearn.set_config(transform_output="pandas")

# Paths
base_dir = r"c:\PROJECTS\Datasphere\Multi-Agent Data Analyst for Enterprise Decision Support"
data_dir = os.path.join(base_dir, "data")
reports_dir = os.path.join(base_dir, "reports")
os.makedirs(reports_dir, exist_ok=True)
models_dir = os.path.join(base_dir, "models")
os.makedirs(models_dir, exist_ok=True)

input_file = os.path.join(data_dir, "cleaned_enterprise_multiagent_decision_support.csv")

print("Loading dataset...")
df = pd.read_csv(input_file, low_memory=False)

# 1. Negative Value Validation (Clip KPIs)
if 'KPI_Current_Value' in df.columns:
    df['KPI_Current_Value'] = df['KPI_Current_Value'].clip(lower=0)

# 2. Extract Target and Drop Leaky/Useless Features
target_col = 'SLA_Breached'
y = df[target_col].astype(int)

# Leaky and Useless
drop_cols = [
    target_col, 'Decision_Outcome', 'Agent_Accuracy_Feedback', 'Report_Summary_Text', 
    'Confidence_Score', 'Record_ID', 'Is_Duplicate', 'Timestamp', 'Transaction_Date',
    'Total_Tokens' # known perfect collinearity
]
X = df.drop(columns=[col for col in drop_cols if col in df.columns])

print("Performing train/validation/test split...")
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# 3. Iterative VIF Multicollinearity Fix (Only on X_train)
print("Performing VIF analysis...")
def calculate_vif(df_num):
    vif_data = pd.DataFrame()
    vif_data["feature"] = df_num.columns
    # Ensure all data is numeric and handle NaNs for VIF calculation
    df_clean = df_num.fillna(df_num.median())
    vif_data["VIF"] = [variance_inflation_factor(df_clean.values, i) for i in range(df_clean.shape[1])]
    return vif_data

numeric_cols_for_vif = X_train.select_dtypes(include=[np.number]).columns.tolist()
# Remove boolean or pseudo-categorical columns from VIF check
vif_cols = [c for c in numeric_cols_for_vif if X_train[c].nunique() > 2]

vif_drops = []
iteration = 0
while True:
    iteration += 1
    # Sample to speed up VIF
    sample_df = X_train[vif_cols].sample(n=min(5000, len(X_train)), random_state=42)
    vif_df = calculate_vif(sample_df)
    max_vif = vif_df['VIF'].max()
    if max_vif > 10:
        worst_feature = vif_df.loc[vif_df['VIF'] == max_vif, 'feature'].values[0]
        vif_cols.remove(worst_feature)
        vif_drops.append({"feature": worst_feature, "VIF": max_vif, "iteration": iteration})
        print(f"Dropped {worst_feature} (VIF: {max_vif:.2f})")
    else:
        break

# Drop VIF features from all datasets
dropped_vif_features = [d['feature'] for d in vif_drops]
X_train = X_train.drop(columns=dropped_vif_features)
X_val = X_val.drop(columns=dropped_vif_features)
X_test = X_test.drop(columns=dropped_vif_features)

with open(os.path.join(reports_dir, "vif_report.md"), "w") as f:
    f.write("# VIF Multicollinearity Report\n\n")
    if not vif_drops:
        f.write("No features had VIF > 10.\n")
    for d in vif_drops:
        f.write(f"- Iteration {d['iteration']}: Removed `{d['feature']}` (VIF = {d['VIF']:.2f})\n")

# 4. Feature Type Detection
print("Detecting feature types...")
numeric_features = X_train.select_dtypes(include=[np.number]).columns.tolist()
categorical_features = X_train.select_dtypes(include=['object', 'string', 'category']).columns.tolist()

binary_features = []
low_cardinality_features = []
high_cardinality_features = []

for col in categorical_features:
    unique_count = X_train[col].nunique()
    if unique_count == 2:
        binary_features.append(col)
    elif unique_count < 10:
        low_cardinality_features.append(col)
    else:
        high_cardinality_features.append(col)

with open(os.path.join(reports_dir, "encoding_report.md"), "w") as f:
    f.write("# Categorical Encoding Strategy\n\n")
    f.write("## Binary (OrdinalEncoder)\n" + "".join([f"- {c}\n" for c in binary_features]) + "\n")
    f.write("## Low-Cardinality (OneHotEncoder)\n" + "".join([f"- {c}\n" for c in low_cardinality_features]) + "\n")
    f.write("## High-Cardinality (TargetEncoder)\n" + "".join([f"- {c}\n" for c in high_cardinality_features]) + "\n")

with open(os.path.join(reports_dir, "scaling_report.md"), "w") as f:
    f.write("# Scaling Strategy\n\n")
    f.write("## Numerical (RobustScaler)\n" + "".join([f"- {c}\n" for c in numeric_features]) + "\n")

# 5. Build Pipeline
print("Building scikit-learn Pipeline...")
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', RobustScaler())
])

binary_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ordinal', OrdinalEncoder())
])

low_card_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

high_card_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('target', TargetEncoder()) # Automatically handles unknown
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('bin', binary_transformer, binary_features),
        ('low_card', low_card_transformer, low_cardinality_features),
        ('high_card', high_card_transformer, high_cardinality_features)
    ],
    remainder='passthrough'
)

pipeline = Pipeline(steps=[('preprocessor', preprocessor)])

# 6. Fit and Transform
print("Fitting pipeline on Training data ONLY...")
X_train_transformed = pipeline.fit_transform(X_train, y_train)

print("Transforming Validation and Test data...")
X_val_transformed = pipeline.transform(X_val)
X_test_transformed = pipeline.transform(X_test)

# Add target back
X_train_transformed[target_col] = y_train.values
X_val_transformed[target_col] = y_val.values
X_test_transformed[target_col] = y_test.values

# 7. Save Outputs
print("Saving transformed datasets...")
X_train_transformed.to_csv(os.path.join(data_dir, "train.csv"), index=False)
X_val_transformed.to_csv(os.path.join(data_dir, "validation.csv"), index=False)
X_test_transformed.to_csv(os.path.join(data_dir, "test.csv"), index=False)

print("Saving pipeline object...")
joblib_path = os.path.join(models_dir, "preprocessing_pipeline.joblib")
joblib.dump(pipeline, joblib_path)

feature_meta = {
    "numeric": numeric_features,
    "binary": binary_features,
    "low_cardinality": low_cardinality_features,
    "high_cardinality": high_cardinality_features,
    "dropped_vif": dropped_vif_features
}
with open(os.path.join(reports_dir, "feature_metadata.json"), "w") as f:
    json.dump(feature_meta, f, indent=2)

print("Enterprise Preprocessing Pipeline v2 Complete.")
