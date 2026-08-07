import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import RobustScaler, OrdinalEncoder, OneHotEncoder, TargetEncoder
from sklearn.base import BaseEstimator, TransformerMixin
import sklearn
from custom_transformers import ColumnDropper

base_dir = r"c:\PROJECTS\Datasphere\Multi-Agent Data Analyst for Enterprise Decision Support"
data_dir = os.path.join(base_dir, "data")
models_dir = os.path.join(base_dir, "models")
input_file = os.path.join(data_dir, "cleaned_enterprise_multiagent_decision_support.csv")

df = pd.read_csv(input_file, low_memory=False)

if 'KPI_Current_Value' in df.columns:
    df['KPI_Current_Value'] = df['KPI_Current_Value'].clip(lower=0)

target_col = 'SLA_Breached'
y = df[target_col].astype(int)

sklearn.set_config(transform_output="pandas")
columns_to_drop = [
    target_col, 'Decision_Outcome', 'Agent_Accuracy_Feedback', 'Report_Summary_Text', 
    'Confidence_Score', 'Record_ID', 'Is_Duplicate', 'Timestamp', 'Transaction_Date',
    'Total_Tokens', 'Year', 'Quarter', 'Processing_Time_Sec', 'Output_Tokens', 
    'Input_Tokens', 'KPI_Current_Value', 'Num_Agents_Involved', 'Data_Quality_Score', 
    'Transaction_Amount_USD'
]

print("Performing split...")
# X must be the raw dataframe
X = df.drop(columns=[target_col])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Figure out the features AFTER dropping
X_train_dropped = X_train.drop(columns=[c for c in columns_to_drop if c in X_train.columns])

numeric_features = X_train_dropped.select_dtypes(include=[np.number]).columns.tolist()
categorical_features = X_train_dropped.select_dtypes(include=['object', 'string', 'category']).columns.tolist()

binary_features = []
low_cardinality_features = []
high_cardinality_features = []
for col in categorical_features:
    uc = X_train_dropped[col].nunique()
    if uc == 2:
        binary_features.append(col)
    elif uc < 10:
        low_cardinality_features.append(col)
    else:
        high_cardinality_features.append(col)

# 2. Configure Robust Transformers
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', RobustScaler())
])

binary_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ordinal', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1))
])

low_card_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

high_card_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    # Scikit-learn native TargetEncoder handles K-Fold automatically and maps unknown to global mean
    ('target', TargetEncoder())
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('bin', binary_transformer, binary_features),
        ('low_card', low_card_transformer, low_cardinality_features),
        ('high_card', high_card_transformer, high_cardinality_features)
    ],
    remainder='drop' # Explicitly drop any extraneous columns passed during inference
)

# 3. Assemble Final Master Pipeline
pipeline = Pipeline(steps=[
    ('dropper', ColumnDropper(drop_cols=columns_to_drop)),
    ('preprocessor', preprocessor)
])

print("Fitting Master Pipeline...")
pipeline.fit(X_train, y_train)

print("Exporting Pipeline...")
joblib_path = os.path.join(models_dir, "preprocessing_pipeline.joblib")
joblib.dump(pipeline, joblib_path)

print("V3 Pipeline Construction Complete.")
