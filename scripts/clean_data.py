"""
Data Cleaning Pipeline — Multi-Agent Data Analyst
==================================================
Follows the Master Plan Section 9.2 rules:
  - Missing values: reported and logged, never silently dropped
  - Outliers: flagged with a boolean column, original values KEPT queryable
  - Duplicates: flagged, not silently deleted
  - Feature engineering: domain-derived features per Section 9.3

Outputs:
  - Cleaned CSV: data/cleaned_enterprise_multiagent_decision_support.csv
  - Missing value report: outputs/missing_value_report.json
  - Cleaning log: outputs/cleaning_log.json
"""

import pandas as pd
import numpy as np
import json
import os
import warnings
from datetime import datetime

warnings.simplefilter(action='ignore', category=FutureWarning)

# ── Paths (relative to project root) ──
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_PATH = os.path.join(PROJECT_ROOT, 'data', 'raw', 'enterprise_multiagent_decision_support.csv')
OUTPUT_PATH = os.path.join(PROJECT_ROOT, 'data', 'cleaned_enterprise_multiagent_decision_support.csv')
OUTPUTS_DIR = os.path.join(PROJECT_ROOT, 'outputs')
MISSING_REPORT_PATH = os.path.join(OUTPUTS_DIR, 'missing_value_report.json')
CLEANING_LOG_PATH = os.path.join(OUTPUTS_DIR, 'cleaning_log.json')


def generate_missing_value_report(df: pd.DataFrame) -> dict:
    """Generate a missing-value report BEFORE any imputation (Master Plan rule)."""
    report = {}
    for col in df.columns:
        null_count = int(df[col].isnull().sum())
        if null_count > 0:
            report[col] = {
                "null_count": null_count,
                "null_percentage": round(null_count / len(df) * 100, 2),
                "dtype": str(df[col].dtype),
                "total_rows": len(df)
            }
    return report


def classify_columns(df: pd.DataFrame) -> dict:
    """Classify columns into identifiers, dimensions, measures, booleans, text."""
    classification = {
        "identifiers": [],
        "dimensions": [],
        "measures": [],
        "booleans": [],
        "text": [],
        "datetime": []
    }

    for col in df.columns:
        dtype = df[col].dtype

        # Explicit known classifications
        if col in ['Record_ID', 'Employee_ID_Handler']:
            classification["identifiers"].append(col)
        elif col in ['Transaction_Date', 'Timestamp']:
            classification["datetime"].append(col)
        elif col in ['Anomaly_Detected', 'SLA_Breached', 'Requires_Human_Review']:
            classification["booleans"].append(col)
        elif col == 'Report_Summary_Text':
            classification["text"].append(col)
        elif dtype in ['int64', 'float64']:
            classification["measures"].append(col)
        elif dtype == 'object' or dtype.name == 'string':
            if df[col].nunique() <= 25:
                classification["dimensions"].append(col)
            else:
                classification["text"].append(col)
        elif dtype == 'bool':
            classification["booleans"].append(col)

    return classification


def clean_dataset(input_filepath: str, output_filepath: str) -> dict:
    """
    Full cleaning pipeline. Returns a cleaning log dict.
    """
    log = {
        "started_at": datetime.now().isoformat(),
        "input_file": input_filepath,
        "output_file": output_filepath,
        "steps": []
    }

    # ── Load ──
    print(f"Loading data from {input_filepath}...")
    df = pd.read_csv(input_filepath)
    initial_rows = len(df)
    initial_cols = len(df.columns)
    print(f"  Loaded: {initial_rows:,} rows × {initial_cols} columns")
    log["initial_shape"] = {"rows": initial_rows, "columns": initial_cols}

    # ── Step 1: Generate missing-value report BEFORE any changes ──
    print("Step 1: Generating missing-value report (pre-imputation)...")
    missing_report = generate_missing_value_report(df)
    os.makedirs(OUTPUTS_DIR, exist_ok=True)
    with open(MISSING_REPORT_PATH, 'w') as f:
        json.dump(missing_report, f, indent=2)
    print(f"  Missing-value report saved to {MISSING_REPORT_PATH}")
    print(f"  Columns with nulls: {list(missing_report.keys())}")
    log["steps"].append({
        "step": 1,
        "action": "missing_value_report",
        "columns_with_nulls": list(missing_report.keys()),
        "report_file": MISSING_REPORT_PATH
    })

    # ── Step 2: Type correction ──
    print("Step 2: Type corrections...")
    df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'], errors='coerce')
    df['Timestamp'] = pd.to_datetime(df['Timestamp'], errors='coerce')

    # Ensure booleans are actual bools
    for bool_col in ['Anomaly_Detected', 'SLA_Breached', 'Requires_Human_Review']:
        if bool_col in df.columns:
            df[bool_col] = df[bool_col].astype(bool)

    log["steps"].append({"step": 2, "action": "type_correction",
                         "datetime_cols": ["Transaction_Date", "Timestamp"],
                         "bool_cols": ["Anomaly_Detected", "SLA_Breached", "Requires_Human_Review"]})

    # ── Step 3: Handle missing values (logged, not silent) ──
    print("Step 3: Handling missing values (with logging)...")
    imputation_log = {}

    # Agent_Accuracy_Feedback: 72% null — intentionally missing (no human review happened)
    if df['Agent_Accuracy_Feedback'].isnull().sum() > 0:
        df['Agent_Accuracy_Feedback'] = df['Agent_Accuracy_Feedback'].fillna(np.nan)
        imputation_log['Agent_Accuracy_Feedback'] = "kept as NaN — intentionally missing when no human review"

    # Employee_ID_Handler: 72% null — same reason
    if df['Employee_ID_Handler'].isnull().sum() > 0:
        df['Employee_ID_Handler'] = df['Employee_ID_Handler'].fillna('N/A_Auto_Resolved')
        imputation_log['Employee_ID_Handler'] = "filled with 'N/A_Auto_Resolved' — no human handler for auto-resolved queries"

    # Customer_Segment: 52% null
    if df['Customer_Segment'].isnull().sum() > 0:
        df['Customer_Segment'] = df['Customer_Segment'].fillna('Unknown')
        imputation_log['Customer_Segment'] = "filled with 'Unknown' -- segment not captured for internal queries"

    # Region: 2% null
    if df['Region'].isnull().sum() > 0:
        df['Region'] = df['Region'].fillna('Unknown')
        imputation_log['Region'] = "filled with 'Unknown' -- region not captured"

    # Processing_Time_Sec: 2% null
    if df['Processing_Time_Sec'].isnull().sum() > 0:
        median_val = df['Processing_Time_Sec'].median()
        df['Processing_Time_Sec'] = df['Processing_Time_Sec'].fillna(median_val)
        imputation_log['Processing_Time_Sec'] = f"filled with median ({median_val:.3f})"

    # KPI_Current_Value: 2% null
    if df['KPI_Current_Value'].isnull().sum() > 0:
        median_val = df['KPI_Current_Value'].median()
        df['KPI_Current_Value'] = df['KPI_Current_Value'].fillna(median_val)
        imputation_log['KPI_Current_Value'] = f"filled with median ({median_val:.3f})"

    # Cost_Savings_Potential_USD: 2.5% null
    if df['Cost_Savings_Potential_USD'].isnull().sum() > 0:
        median_val = df['Cost_Savings_Potential_USD'].median()
        df['Cost_Savings_Potential_USD'] = df['Cost_Savings_Potential_USD'].fillna(median_val)
        imputation_log['Cost_Savings_Potential_USD'] = f"filled with median ({median_val:.3f})"

    # Data_Quality_Score: 3% null
    if df['Data_Quality_Score'].isnull().sum() > 0:
        median_val = df['Data_Quality_Score'].median()
        df['Data_Quality_Score'] = df['Data_Quality_Score'].fillna(median_val)
        imputation_log['Data_Quality_Score'] = f"filled with median ({median_val:.3f})"

    # Report_Summary_Text: 3% null
    if df['Report_Summary_Text'].isnull().sum() > 0:
        df['Report_Summary_Text'] = df['Report_Summary_Text'].fillna('No Summary Available')
        imputation_log['Report_Summary_Text'] = "filled with 'No Summary Available'"

    print(f"  Imputation actions: {json.dumps(imputation_log, indent=4)}")
    log["steps"].append({"step": 3, "action": "missing_value_handling", "imputations": imputation_log})

    # ── Step 4: Standardize categorical text ──
    print("Step 4: Standardizing categorical text fields...")
    text_cols_to_standardize = ['Department', 'Business_Unit', 'Region', 'Data_Source_System',
                                 'Assigned_Agent', 'Query_Type', 'KPI_Metric_Name',
                                 'Root_Cause_Category', 'Recommended_Action',
                                 'Priority_Level', 'Risk_Level', 'Escalation_Level',
                                 'Decision_Outcome']
    for col in text_cols_to_standardize:
        if col in df.columns and df[col].dtype == 'object':
            df[col] = df[col].str.strip()
    log["steps"].append({"step": 4, "action": "text_standardization",
                         "columns": text_cols_to_standardize})

    # ── Step 5: Outlier flagging (NOT capping — Master Plan rule) ──
    print("Step 5: Flagging outliers (keeping original values queryable)...")
    outlier_cols = ['Processing_Time_Sec', 'Transaction_Amount_USD', 'Revenue_Impact_USD',
                    'Cost_Savings_Potential_USD', 'Input_Tokens', 'Output_Tokens']
    outlier_counts = {}
    for col in outlier_cols:
        if col in df.columns and df[col].dtype in ['int64', 'float64']:
            q1 = df[col].quantile(0.25)
            q3 = df[col].quantile(0.75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            flag_col = f"Outlier_{col}"
            df[flag_col] = (df[col] < lower) | (df[col] > upper)
            count = int(df[flag_col].sum())
            outlier_counts[col] = count
            print(f"  {col}: {count:,} outliers flagged ({count/len(df)*100:.1f}%)")

    log["steps"].append({"step": 5, "action": "outlier_flagging", "outlier_counts": outlier_counts})

    # ── Step 6: Duplicate check (flag, not delete) ──
    print("Step 6: Checking for duplicates...")
    # Exclude Record_ID for duplicate detection (it's always unique)
    check_cols = [c for c in df.columns if c != 'Record_ID' and not c.startswith('Outlier_')]
    df['Is_Duplicate'] = df.duplicated(subset=check_cols, keep='first')
    dup_count = int(df['Is_Duplicate'].sum())
    print(f"  Duplicates found: {dup_count:,}")
    log["steps"].append({"step": 6, "action": "duplicate_check", "duplicates_flagged": dup_count})

    # ── Step 7: Feature Engineering (Master Plan Section 9.3) ──
    print("Step 7: Engineering domain features...")

    # Token Efficiency: Output_Tokens / Processing_Time_Sec
    df['Token_Efficiency'] = df['Output_Tokens'] / df['Processing_Time_Sec'].replace(0, np.nan)
    df['Token_Efficiency'] = df['Token_Efficiency'].fillna(0).round(4)

    # Total Tokens
    df['Total_Tokens'] = df['Input_Tokens'] + df['Output_Tokens']

    # Cost Per Token
    df['Cost_Per_Token'] = df['Transaction_Amount_USD'] / df['Total_Tokens'].replace(0, np.nan)
    df['Cost_Per_Token'] = df['Cost_Per_Token'].fillna(0).round(4)

    # Human Bottleneck Flag (requires human review = True)
    df['Human_Bottleneck'] = df['Requires_Human_Review'].astype(bool)

    # False Confidence Flag: High confidence but anomaly detected or SLA breached
    df['False_Confidence_Flag'] = (
        (df['Confidence_Score'] >= 0.8) &
        (df['SLA_Breached'] | df['Anomaly_Detected'])
    )

    # Accuracy Deviation: abs(KPI_Current_Value - KPI_Target_Value) / KPI_Target_Value
    df['Accuracy_Deviation'] = np.where(
        df['KPI_Target_Value'] != 0,
        ((df['KPI_Current_Value'] - df['KPI_Target_Value']) / df['KPI_Target_Value'].abs()).round(4),
        0
    )

    # Time-based features
    df['Hour'] = df['Timestamp'].dt.hour
    df['Day_of_Week'] = df['Timestamp'].dt.dayofweek
    df['Month'] = df['Transaction_Date'].dt.month
    df['Quarter'] = df['Transaction_Date'].dt.quarter
    df['Year'] = df['Transaction_Date'].dt.year

    engineered_features = ['Token_Efficiency', 'Total_Tokens', 'Cost_Per_Token',
                           'Human_Bottleneck', 'False_Confidence_Flag', 'Accuracy_Deviation',
                           'Hour', 'Day_of_Week', 'Month', 'Quarter', 'Year']
    print(f"  Added {len(engineered_features)} features: {engineered_features}")
    log["steps"].append({"step": 7, "action": "feature_engineering",
                         "new_features": engineered_features})

    # ── Step 8: Column classification ──
    print("Step 8: Classifying columns...")
    classification = classify_columns(df)
    print(f"  Identifiers: {classification['identifiers']}")
    print(f"  Datetime: {classification['datetime']}")
    print(f"  Dimensions: {len(classification['dimensions'])} columns")
    print(f"  Measures: {len(classification['measures'])} columns")
    print(f"  Booleans: {classification['booleans']}")
    print(f"  Text: {classification['text']}")
    log["steps"].append({"step": 8, "action": "column_classification",
                         "classification": classification})

    # ── Step 9: Resolve "today" for relative time ──
    max_date = df['Transaction_Date'].max()
    print(f"Step 9: 'Today' resolved to max date in dataset: {max_date}")
    log["reference_date"] = str(max_date)

    # ── Step 10: Save ──
    print(f"Step 10: Saving cleaned dataset to {output_filepath}...")
    final_rows = len(df)
    final_cols = len(df.columns)
    df.to_csv(output_filepath, index=False)
    print(f"  Final: {final_rows:,} rows × {final_cols} columns")

    log["final_shape"] = {"rows": final_rows, "columns": final_cols}
    log["completed_at"] = datetime.now().isoformat()

    # Save cleaning log
    with open(CLEANING_LOG_PATH, 'w') as f:
        json.dump(log, f, indent=2, default=str)
    print(f"  Cleaning log saved to {CLEANING_LOG_PATH}")

    # Save column classification
    class_path = os.path.join(OUTPUTS_DIR, 'column_classification.json')
    with open(class_path, 'w') as f:
        json.dump(classification, f, indent=2)
    print(f"  Column classification saved to {class_path}")

    print("\n[OK] Data cleaning completed successfully!")
    return log


if __name__ == "__main__":
    if not os.path.exists(INPUT_PATH):
        print(f"Error: Input file not found at {INPUT_PATH}")
        print("Make sure you're running from the project root or the file exists.")
    else:
        clean_dataset(INPUT_PATH, OUTPUT_PATH)
