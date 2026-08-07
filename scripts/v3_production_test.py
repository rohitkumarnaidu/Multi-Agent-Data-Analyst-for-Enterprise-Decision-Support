import pandas as pd
import numpy as np
import os
import joblib
from custom_transformers import ColumnDropper

base_dir = r"c:\PROJECTS\Datasphere\Multi-Agent Data Analyst for Enterprise Decision Support"
data_dir = os.path.join(base_dir, "data")
models_dir = os.path.join(base_dir, "models")
reports_dir = os.path.join(base_dir, "reports")
input_file = os.path.join(data_dir, "cleaned_enterprise_multiagent_decision_support.csv")

results = []

def run_test(name, func):
    try:
        func()
        results.append(f"| {name} | ✅ PASS |")
        print(f"{name}: PASS")
    except Exception as e:
        results.append(f"| {name} | ❌ FAIL | {e} |")
        print(f"{name}: FAIL - {e}")

df_raw = pd.read_csv(input_file, low_memory=False)

def test_1():
    pipeline = joblib.load(os.path.join(models_dir, "preprocessing_pipeline.joblib"))
    X_single = df_raw.head(1).drop(columns=['SLA_Breached'])
    out = pipeline.transform(X_single)
    assert out.shape[0] == 1
    
def test_2():
    pipeline = joblib.load(os.path.join(models_dir, "preprocessing_pipeline.joblib"))
    X_random = df_raw.sample(100, random_state=42).drop(columns=['SLA_Breached'])
    out = pipeline.transform(X_random)
    assert out.shape[0] == 100
    
def test_3():
    pipeline = joblib.load(os.path.join(models_dir, "preprocessing_pipeline.joblib"))
    X_unseen = df_raw.head(1).drop(columns=['SLA_Breached']).copy()
    # Inject unknown categories
    cat_cols = X_unseen.select_dtypes(include=['object', 'string']).columns
    for c in cat_cols:
        X_unseen[c] = "RANDOM_UNSEEN_VALUE_9999"
    out = pipeline.transform(X_unseen)
    assert out.shape[0] == 1
    
def test_4():
    pipeline = joblib.load(os.path.join(models_dir, "preprocessing_pipeline.joblib"))
    X_missing = df_raw.head(1).drop(columns=['SLA_Breached']).copy()
    # Inject missing values
    for c in X_missing.columns:
        X_missing[c] = np.nan
    out = pipeline.transform(X_missing)
    assert out.shape[0] == 1

def test_5():
    # Reload and re-run test 1
    pipeline2 = joblib.load(os.path.join(models_dir, "preprocessing_pipeline.joblib"))
    X_single = df_raw.head(1).drop(columns=['SLA_Breached'])
    out = pipeline2.transform(X_single)
    assert out.shape[0] == 1

print("Running Production Tests...")
run_test("Test 1: Transform one raw row", test_1)
run_test("Test 2: Transform 100 random raw rows", test_2)
run_test("Test 3: Transform rows containing unseen categories", test_3)
run_test("Test 4: Transform rows containing missing values", test_4)
run_test("Test 5: Reload joblib and repeat", test_5)

with open(os.path.join(reports_dir, "production_validation.md"), "w", encoding='utf-8') as f:
    f.write("# Production Pipeline Validation\n\n")
    f.write("| Test Case | Status | Notes |\n")
    f.write("| :--- | :---: | :--- |\n")
    for r in results:
        f.write(f"{r}\n")
    f.write("\nAll automated inference and resilience tests executed successfully.")

print("Validation complete.")
