import pandas as pd
import numpy as np
import yaml
import duckdb
import json
from pathlib import Path
from sklearn.feature_selection import mutual_info_classif, mutual_info_regression

def run_audit():
    base_dir = Path("c:/PROJECTS/Datasphere/Multi-Agent Data Analyst for Enterprise Decision Support")
    data_dir = base_dir / "data"
    parquet_file = data_dir / "master_cleaned_dataset.parquet"
    metrics_yaml_path = base_dir / "semantic" / "metrics.yaml"
    
    print("=== LOADING DATASET ===")
    df = pd.read_parquet(parquet_file)
    print(f"Loaded {len(df)} rows, {len(df.columns)} columns")
    
    print("\n=== VERIFYING ENGINEERED FEATURES ===")
    
    # Null propagation & Division by zero
    print("Tokens_Per_Second nulls:", df['Tokens_Per_Second'].isnull().sum())
    print("Tokens_Per_Second infs:", np.isinf(df['Tokens_Per_Second']).sum())
    
    print("Complexity_Per_Agent nulls:", df['Complexity_Per_Agent'].isnull().sum())
    print("Complexity_Per_Agent infs:", np.isinf(df['Complexity_Per_Agent']).sum())
    
    # Date ordering in rolling windows
    # Check if Rolling average used strict temporal ordering
    print("Rolling Average Check:")
    print("Any negative processing time (duration check)?", (df['Start_Timestamp'] > df['Timestamp']).any())
    
    print("\n=== VERIFYING SEMANTIC METRICS (DUCKDB) ===")
    with open(metrics_yaml_path, "r") as f:
        metrics = yaml.safe_load(f)["metrics"]
        
    conn = duckdb.connect()
    # Register dataframe as a view
    conn.register("dataset", df)
    
    for metric in metrics:
        name = metric["name"]
        sql_expr = metric["sql"]
        try:
            # Just test the aggregation over the whole dataset
            query = f"SELECT {sql_expr} as val FROM dataset"
            res = conn.execute(query).fetchone()
            print(f"[PASS] Metric '{name}': {res[0]}")
        except Exception as e:
            print(f"[FAIL] Metric '{name}': {e}")
            
    print("\n=== DATASET CORRELATION & MULTICOLLINEARITY ===")
    numeric_df = df.select_dtypes(include=[np.number]).fillna(0) # Simple fill for correlation
    # Target: SLA_Breached
    if 'SLA_Breached' in df.columns:
        correlations = numeric_df.corrwith(df['SLA_Breached'].astype(int)).sort_values(ascending=False)
        print("Top 5 Correlations with SLA_Breached:")
        print(correlations.head(5))
        print(correlations.tail(5))
        
    print("\n=== PREDICTIVE VALUE (MUTUAL INFORMATION) ===")
    if 'SLA_Breached' in df.columns:
        # Sample for speed
        sample_df = df.sample(min(10000, len(df)))
        num_sample = sample_df.select_dtypes(include=[np.number]).fillna(0)
        target = sample_df['SLA_Breached'].astype(int)
        
        # exclude target itself
        features = [c for c in num_sample.columns if c != 'SLA_Breached']
        X = num_sample[features]
        mi_scores = mutual_info_classif(X, target)
        mi_series = pd.Series(mi_scores, index=features).sort_values(ascending=False)
        print("Top 5 Mutual Info scores with SLA_Breached:")
        print(mi_series.head(5))
        

if __name__ == "__main__":
    run_audit()
