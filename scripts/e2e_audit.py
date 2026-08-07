import os
import pandas as pd
import duckdb
import yaml
import json
from pathlib import Path

def e2e_audit():
    print("=== STEP 1: PROJECT DISCOVERY ===")
    base_dir = Path("c:/PROJECTS/Datasphere/Multi-Agent Data Analyst for Enterprise Decision Support")
    
    # Check artifacts
    artifacts = [
        "data/schema_report.json",
        "data/cleaning_log.md",
        "semantic/metrics.yaml",
        "data/README.md",
        "data/master_cleaned_dataset.parquet",
        "scripts/data_engineering.py"
    ]
    for a in artifacts:
        p = base_dir / a
        print(f"[{'PASS' if p.exists() else 'FAIL'}] {a} exists.")
        
    print("\n=== STEP 2: REQUIREMENT TRACEABILITY ===")
    df = pd.read_parquet(base_dir / "data/master_cleaned_dataset.parquet")
    print(f"Row count (DATA-003/004 retention): {len(df)}")
    
    with open(base_dir / "data/schema_report.json", "r") as f:
        schema = json.load(f)
    print(f"Schema columns generated: {len(schema)}")
    
    with open(base_dir / "semantic/metrics.yaml", "r") as f:
        metrics = yaml.safe_load(f)["metrics"]
    
    conn = duckdb.connect()
    conn.register("dataset", df)
    
    print("\n=== DUCKDB SEMANTIC METRICS EXECUTION ===")
    for m in metrics:
        try:
            res = conn.execute(f"SELECT {m['sql']} as val FROM dataset").fetchone()
            print(f"[PASS] Metric {m['name']} executes successfully: {res[0]}")
        except Exception as e:
            print(f"[FAIL] Metric {m['name']}: {e}")

    print("\n=== SOURCE CODE AUDIT ===")
    # Simple check for code existence
    code_path = base_dir / "scripts/data_engineering.py"
    with open(code_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    print(f"data_engineering.py size: {len(code)} bytes.")
    if "def run_data_engineering():" in code:
        print("[PASS] Modularity found.")
    else:
        print("[FAIL] Missing main function.")
        
    print("Done gathering audit evidence.")

if __name__ == "__main__":
    e2e_audit()
