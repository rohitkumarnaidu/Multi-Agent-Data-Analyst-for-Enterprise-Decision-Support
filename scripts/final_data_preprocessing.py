import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import RobustScaler, StandardScaler

# Paths
base_dir = r"c:\PROJECTS\Datasphere\Multi-Agent Data Analyst for Enterprise Decision Support"
data_dir = os.path.join(base_dir, "data")
reports_dir = os.path.join(base_dir, "reports")
os.makedirs(reports_dir, exist_ok=True)

input_file = os.path.join(data_dir, "cleaned_enterprise_multiagent_decision_support.csv")
final_dataset = os.path.join(data_dir, "final_cleaned_dataset.csv")
master_dataset = os.path.join(data_dir, "master_cleaned_dataset.csv")

print("Loading dataset...")
df = pd.read_csv(input_file, low_memory=False)

# TASK 6: VALIDATE NEGATIVE VALUES
print("Fixing negative values...")
if 'KPI_Current_Value' in df.columns:
    df['KPI_Current_Value'] = df['KPI_Current_Value'].clip(lower=0)

# TASK 4: HANDLE MISSING VALUES
print("Handling missing values...")
if 'Agent_Accuracy_Feedback' in df.columns:
    df['Has_Feedback'] = df['Agent_Accuracy_Feedback'].notna().astype(int)
    median_val = df['Agent_Accuracy_Feedback'].median()
    df['Agent_Accuracy_Feedback'].fillna(median_val, inplace=True)
else:
    df['Has_Feedback'] = 1

# TASK 2: REMOVE USELESS FEATURES
print("Removing useless features...")
useless_cols = ['Record_ID', 'Is_Duplicate', 'Timestamp', 'Transaction_Date']
dropped_useless = [col for col in useless_cols if col in df.columns]
for col in df.columns:
    if df[col].nunique() <= 1 and col not in dropped_useless:
        dropped_useless.append(col)

# Actually drop them from both master and final later, or just drop now
df.drop(columns=dropped_useless, inplace=True, errors='ignore')

with open(os.path.join(reports_dir, "feature_selection.md"), "w") as f:
    f.write("# Feature Selection Report\n\n")
    f.write("## Removed Useless Features\n")
    for col in dropped_useless:
        f.write(f"- `{col}` (Zero variance, constant, or raw identifier)\n")

# TASK 3: FIX MULTICOLLINEARITY
print("Fixing multicollinearity...")
multicollin_cols = []
if 'Total_Tokens' in df.columns:
    df.drop(columns=['Total_Tokens'], inplace=True)
    multicollin_cols.append('Total_Tokens')

# Quick correlation check for numeric columns
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr_matrix = df[numeric_cols].corr().abs()
upper_tri = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
to_drop = [column for column in upper_tri.columns if any(upper_tri[column] > 0.95)]
for col in to_drop:
    if col in df.columns:
        df.drop(columns=[col], inplace=True)
        multicollin_cols.append(col)

with open(os.path.join(reports_dir, "preprocessing_report.md"), "w") as f:
    f.write("# Preprocessing Report\n\n")
    f.write("## Multicollinearity Fixes\n")
    for col in multicollin_cols:
        f.write(f"- Dropped `{col}` due to extremely high correlation (multicollinearity).\n")

# TASK 5 & 8: HANDLE OUTLIERS & SCALING
print("Scaling and Outliers...")
features_to_robust_scale = [
    'Transaction_Amount_USD', 'Revenue_Impact_USD', 'Cost_Savings_Potential_USD', 
    'Processing_Time_Sec', 'Input_Tokens', 'Output_Tokens', 'KPI_Current_Value', 
    'KPI_Target_Value', 'Deviation_Percentage', 'Anomaly_Score', 'Data_Quality_Score'
]
robust_scaler = RobustScaler()
scaled_cols = []
for col in features_to_robust_scale:
    if col in df.columns:
        df[col] = robust_scaler.fit_transform(df[[col]])
        scaled_cols.append(col)

with open(os.path.join(reports_dir, "scaling_report.md"), "w") as f:
    f.write("# Scaling Report\n\n")
    f.write("## RobustScaler Applied\n")
    f.write("The following financial and token features were scaled using RobustScaler to mitigate the effect of extreme outliers without discarding anomalies:\n")
    for col in scaled_cols:
        f.write(f"- `{col}`\n")

with open(os.path.join(reports_dir, "outlier_report.md"), "w") as f:
    f.write("# Outlier Report\n\n")
    f.write("Outliers were handled via RobustScaler rather than row deletion, preserving enterprise anomalies for fraud and anomaly detection models.\n")

# TASK 1: REMOVE DATA LEAKAGE
print("Removing data leakage...")
# Keep the current state as the Master dataset
df.to_csv(master_dataset, index=False)

leaky_cols = ['Agent_Accuracy_Feedback', 'Report_Summary_Text', 'Confidence_Score']
leaky_dropped = [col for col in leaky_cols if col in df.columns]
df_ml = df.drop(columns=leaky_dropped, errors='ignore')

with open(os.path.join(reports_dir, "leakage_report.md"), "w") as f:
    f.write("# Data Leakage Report\n\n")
    f.write("## Target Variable\n")
    f.write("The primary predictive targets are `Decision_Outcome` and `SLA_Breached`.\n\n")
    f.write("## Removed Leaky Features\n")
    for col in leaky_dropped:
        f.write(f"- `{col}`: Generated post-decision, causing target leakage in predictive models.\n")

# TASK 9: VALIDATE FINAL DATASET
print("Validating final dataset...")
assert df_ml.isnull().sum().sum() == 0, f"Found {df_ml.isnull().sum().sum()} missing values!"
assert df_ml.duplicated().sum() == 0, f"Found {df_ml.duplicated().sum()} duplicate rows!"

# TASK 10: SAVE OUTPUTS
print("Saving final dataset...")
df_ml.to_csv(final_dataset, index=False)
print("Done!")
