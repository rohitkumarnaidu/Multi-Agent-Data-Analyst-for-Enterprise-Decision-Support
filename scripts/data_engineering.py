import pandas as pd
import numpy as np
import json
import os
import yaml
from pathlib import Path

def run_data_engineering():
    print("Starting Data & Feature Engineering Phase...")
    
    # Setup paths
    base_dir = Path("c:/PROJECTS/Datasphere/Multi-Agent Data Analyst for Enterprise Decision Support")
    data_dir = base_dir / "data"
    raw_file = data_dir / "raw" / "enterprise_multiagent_decision_support.csv"
    schema_report_path = data_dir / "schema_report.json"
    cleaning_log_path = data_dir / "cleaning_log.md"
    readme_path = data_dir / "README.md"
    semantic_dir = base_dir / "semantic"
    semantic_dir.mkdir(parents=True, exist_ok=True)
    metrics_yaml_path = semantic_dir / "metrics.yaml"
    output_parquet = data_dir / "master_cleaned_dataset.parquet"
    
    # 1. Load the dataset
    print(f"Loading data from {raw_file}")
    df = pd.read_csv(raw_file)
    initial_row_count = len(df)
    
    cleaning_log = ["# Data Cleaning Log\n"]
    
    # 2. Type Correction (DATA-002)
    print("Applying type corrections...")
    df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'], errors='coerce')
    df['Timestamp'] = pd.to_datetime(df['Timestamp'], errors='coerce')
    
    # Categorical string columns normalization
    cat_cols = ['Department', 'Business_Unit', 'Region', 'Data_Source_System', 'Assigned_Agent', 
                'Query_Type', 'KPI_Metric_Name', 'Root_Cause_Category', 'Recommended_Action', 
                'Priority_Level', 'Risk_Level', 'Escalation_Level', 'Decision_Outcome', 'Customer_Segment']
    for c in cat_cols:
        if c in df.columns:
            df[c] = df[c].astype(str).str.strip().str.title()
            # Restore NaN where it was originally missing, since astype(str) converts NaN to "Nan"
            df[c] = df[c].replace(["Nan", "None", ""], np.nan)
            
    # 3. Missing Value Handling (DATA-003)
    print("Handling missing values...")
    missing_stats = []
    excluded_columns = []
    for col in df.columns:
        null_count = df[col].isnull().sum()
        missing_pct = (null_count / initial_row_count) * 100
        is_excluded = missing_pct > 40
        if is_excluded:
            excluded_columns.append(col)
        missing_stats.append({
            "Column": col,
            "Missing Count": null_count,
            "Missing %": f"{missing_pct:.2f}%",
            "Excluded from Default Charts": "Yes" if is_excluded else "No"
        })
    
    missing_df = pd.DataFrame(missing_stats)
    cleaning_log.append("## Missing Value Report\n")
    cleaning_log.append(missing_df.to_markdown(index=False))
    cleaning_log.append(f"\n\n**Note**: Columns with >40% missing values ({', '.join(excluded_columns)}) are flagged for exclusion from default charts, but have NOT been removed from the dataset to preserve queryability.\n")
    
    # 4. Duplicate Detection (DATA-004)
    print("Detecting duplicates...")
    duplicate_count = df.duplicated().sum()
    cleaning_log.append("## Duplicate Detection\n")
    cleaning_log.append(f"- **Exact Duplicate Rows**: {duplicate_count}\n")
    cleaning_log.append("- **Policy Action**: Duplicates were flagged but NOT deleted automatically to prevent silent row loss. If deletion is required, it must be performed explicitly downstream.\n")
    
    # 5. Outlier Flagging (DATA-005)
    print("Flagging outliers...")
    outlier_stats = {}
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        mean = df[col].mean()
        std = df[col].std()
        if pd.notnull(mean) and pd.notnull(std) and std > 0:
            lower_bound = mean - 3 * std
            upper_bound = mean + 3 * std
            outliers = ((df[col] < lower_bound) | (df[col] > upper_bound)).sum()
            outlier_stats[col] = int(outliers)
            # Add an explicit flag column for major metrics
            if col in ['Transaction_Amount_USD', 'Processing_Time_Sec']:
                df[f'{col}_Is_Outlier'] = ((df[col] < lower_bound) | (df[col] > upper_bound))
    
    cleaning_log.append("## Outlier Detection (>3 Std Dev)\n")
    for col, count in outlier_stats.items():
        if count > 0:
            cleaning_log.append(f"- **{col}**: {count} outliers flagged. (Not removed).\n")
            
    # 7. Date Constant (Task 7)
    max_date = df['Timestamp'].max()
    cleaning_log.append("## Time Context\n")
    cleaning_log.append(f"- **As Of Date**: {max_date}\n")
    cleaning_log.append("This constant should be used by downstream agents for relative time phrases (e.g. 'last month').\n")
    
    # 6 & 9. Column Classification & PII (DATA-006 & DATA-009)
    print("Classifying columns...")
    schema = []
    pii_keywords = ['name', 'email', 'phone', 'id', 'agent', 'employee']
    
    for col in df.columns:
        dtype = str(df[col].dtype)
        cardinality = df[col].nunique()
        
        # Heuristic Classification
        classification = "dimension" # default
        if cardinality > 0.8 * len(df) and ('str' in dtype or 'object' in dtype):
            classification = "identifier"
        elif pd.api.types.is_numeric_dtype(df[col]):
            classification = "measure"
            if cardinality < 20 and 'Score' not in col: # categorical numeric
                classification = "dimension"
        
        # Force some known ones
        col_lower = col.lower()
        if 'id' in col_lower and 'handler' in col_lower:
            classification = "identifier"
        if col == 'Record_ID':
            classification = "identifier"
        if 'date' in col_lower or 'timestamp' in col_lower:
            classification = "dimension"
            
        # PII Flag
        is_pii = False
        if classification == "identifier" and any(k in col_lower for k in pii_keywords):
            is_pii = True
            
        schema.append({
            "column_name": col,
            "inferred_type": dtype,
            "null_count": int(df[col].isnull().sum()),
            "cardinality": int(cardinality),
            "classification": classification,
            "is_pii": is_pii,
            "outlier_count": outlier_stats.get(col, 0)
        })
        
    with open(schema_report_path, "w") as f:
        json.dump(schema, f, indent=4)
        
    # Write cleaning log
    with open(cleaning_log_path, "w") as f:
        f.write("\n".join(cleaning_log))
        
    # 8. Feature Engineering (DATA-007)
    print("Engineering features...")
    
    # Duration / Temporal Features
    df['Start_Timestamp'] = df['Timestamp'] - pd.to_timedelta(df['Processing_Time_Sec'].fillna(0), unit='s')
    df['Day_Of_Week'] = df['Timestamp'].dt.day_name()
    df['Is_Weekend'] = df['Timestamp'].dt.dayofweek >= 5
    
    # Business & AI Features
    df['Total_Margin_USD'] = df['Revenue_Impact_USD'].fillna(0) + df['Cost_Savings_Potential_USD'].fillna(0)
    df['Tokens_Per_Second'] = (df['Input_Tokens'] + df['Output_Tokens']) / df['Processing_Time_Sec'].replace(0, np.nan)
    df['Complexity_Per_Agent'] = df['Query_Complexity_Score'] / df['Num_Agents_Involved'].replace(0, np.nan)
    
    # Rolling Average Helper
    # Sort by Timestamp first
    df = df.sort_values('Timestamp')
    df['Rolling_7_Txn_Avg_Amount_By_Dept'] = df.groupby('Department')['Transaction_Amount_USD'].transform(lambda x: x.rolling(7, min_periods=1).mean())
    
    # Period-over-Period (Row-over-Row) Helper
    df['Prev_Txn_Amount_By_Dept'] = df.groupby('Department')['Transaction_Amount_USD'].shift(1)
    df['PoP_Amount_Change_Pct'] = (df['Transaction_Amount_USD'] - df['Prev_Txn_Amount_By_Dept']) / df['Prev_Txn_Amount_By_Dept'].replace(0, np.nan)
    
    # Top-N Rank Helper
    df['Rank_Amount_Within_Dept'] = df.groupby('Department')['Transaction_Amount_USD'].rank(method='dense', ascending=False)
    
    print("Testing Feature Engineering (Manual Check on 2 rows):")
    test_rows = df[df['Department'] == df['Department'].iloc[0]].head(2)
    print(test_rows[['Timestamp', 'Transaction_Amount_USD', 'Prev_Txn_Amount_By_Dept', 'PoP_Amount_Change_Pct', 'Rolling_7_Txn_Avg_Amount_By_Dept', 'Rank_Amount_Within_Dept']])
    
    # 9. Semantic Metrics YAML (DATA-008)
    print("Writing semantic metrics...")
    metrics = {
        "metrics": [
            {
                "name": "total_revenue",
                "sql": "SUM(Revenue_Impact_USD)",
                "allowed_dimensions": ["Department", "Region", "Transaction_Date", "Business_Unit"],
                "description": "Total revenue impact in USD"
            },
            {
                "name": "total_transaction_amount",
                "sql": "SUM(Transaction_Amount_USD)",
                "allowed_dimensions": ["Department", "Region", "Transaction_Date", "Customer_Segment"],
                "description": "Gross transaction amount before savings or revenue impact"
            },
            {
                "name": "average_processing_time",
                "sql": "AVG(Processing_Time_Sec)",
                "allowed_dimensions": ["Department", "Assigned_Agent", "Transaction_Date"],
                "description": "Average query processing time in seconds"
            },
            {
                "name": "total_cost_savings",
                "sql": "SUM(Cost_Savings_Potential_USD)",
                "allowed_dimensions": ["Department", "Region", "Transaction_Date"],
                "description": "Total potential cost savings identified in USD"
            },
            {
                "name": "average_query_complexity",
                "sql": "AVG(Query_Complexity_Score)",
                "allowed_dimensions": ["Department", "Assigned_Agent", "Transaction_Date", "Query_Type"],
                "description": "Average complexity score of processed queries"
            },
            {
                "name": "sla_breach_rate",
                "sql": "SUM(CAST(SLA_Breached AS INTEGER)) * 1.0 / COUNT(*)",
                "allowed_dimensions": ["Department", "Assigned_Agent", "Region", "Transaction_Date"],
                "description": "Percentage of queries that breached SLA"
            },
            {
                "name": "average_data_quality",
                "sql": "AVG(Data_Quality_Score)",
                "allowed_dimensions": ["Data_Source_System", "Transaction_Date", "Department"],
                "description": "Average score representing incoming data quality"
            },
            {
                "name": "anomaly_rate",
                "sql": "SUM(CAST(Anomaly_Detected AS INTEGER)) * 1.0 / COUNT(*)",
                "allowed_dimensions": ["Department", "Region", "Transaction_Date"],
                "description": "Percentage of transactions flagged as anomalies"
            },
            {
                "name": "total_margin",
                "sql": "SUM(Total_Margin_USD)",
                "allowed_dimensions": ["Department", "Region", "Transaction_Date"],
                "description": "Combined value of Revenue Impact and Cost Savings (Engineered Feature)"
            },
            {
                "name": "average_tokens_per_second",
                "sql": "AVG(Tokens_Per_Second)",
                "allowed_dimensions": ["Assigned_Agent", "Department", "Transaction_Date"],
                "description": "Efficiency metric: Total tokens processed per second of processing time"
            }
        ]
    }
    
    with open(metrics_yaml_path, "w") as f:
        yaml.dump(metrics, f, sort_keys=False)
        
    # 10. Write cleaned dataset
    print(f"Writing cleaned dataset to {output_parquet}")
    df.to_parquet(output_parquet, index=False)
    
    # 11. Write README.md
    readme_content = f"""# Data & Feature Engineering Phase Summary

## Overview
This directory contains the cleaned dataset and associated metadata artifacts produced during the Data & Feature Engineering Phase. 

## Cleaned Dataset
- **File**: `master_cleaned_dataset.parquet`
- **Rows**: {len(df)}
- **Columns**: {len(df.columns)}

## Artifacts Produced
1. **`schema_report.json`**: Machine-readable schema scan with inferred types, null counts, cardinalities, business classifications (`identifier`, `measure`, `dimension`), and PII flags.
2. **`cleaning_log.md`**: Human-readable report detailing missing value percentages, duplicate counts, outlier flags, and the global "As Of Date" for relative time phrases.
3. **`../semantic/metrics.yaml`**: The semantic layer defining 10 core business metrics with their SQL expressions and allowed dimensions.

## Key Findings & Corrections
- **Type Correction**: Dates were parsed, and string categories were normalized (title case, whitespace stripped).
- **Missing Values**: Columns exceeding 40% missing values (e.g., `Agent_Accuracy_Feedback`, `Employee_ID_Handler`) are flagged in the cleaning log but retained for queryability. No rows were dropped.
- **Duplicates**: {duplicate_count} exact duplicates were detected and logged, but retained to prevent silent data loss.
- **Outliers**: Outliers (>3 Std Dev) in numeric columns are flagged in the schema report and with boolean flag columns (e.g., `Transaction_Amount_USD_Is_Outlier`), but were not removed.
- **PII**: Columns containing identifiable information are flagged as `is_pii: true` in the schema report.

## Engineered Features
Several domain and AI-specific features were added:
- **Temporal**: `Start_Timestamp`, `Day_Of_Week`, `Is_Weekend`
- **Business**: `Total_Margin_USD`
- **AI/Interaction**: `Tokens_Per_Second`, `Complexity_Per_Agent`
- **Helpers**: Rolling averages, period-over-period changes, and top-N ranks were computed partitioned by `Department`.

## Uncertainties / Next Steps
- Duplicate resolution strategy needs to be defined by downstream owners.
- Imputation strategies for heavily missing columns should be considered during model training.
"""
    with open(readme_path, "w") as f:
        f.write(readme_content)
        
    print("Data & Feature Engineering Phase complete.")

if __name__ == "__main__":
    run_data_engineering()
