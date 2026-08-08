import pandas as pd
import numpy as np
import os
import joblib

def audit_datasets():
    data_dir = r"c:\PROJECTS\Datasphere\Multi-Agent Data Analyst for Enterprise Decision Support\data"
    
    files = ["train.csv", "validation.csv", "test.csv"]
    
    for f in files:
        path = os.path.join(data_dir, f)
        if not os.path.exists(path):
            print(f"File not found: {f}")
            continue
            
        df = pd.read_csv(path)
        print(f"--- {f} ---")
        print(f"Shape: {df.shape}")
        
        target = "Attrition"
        if target in df.columns:
            print(f"Target Distribution: \n{df[target].value_counts(normalize=True)}")
        else:
            print(f"Target {target} NOT FOUND")
            
        features = [c for c in df.columns if c != target]
        print(f"Number of Features: {len(features)}")
        
        # Missing values
        missing = df.isnull().sum().sum()
        print(f"Total Missing Values: {missing}")
        
        # Duplicates
        duplicates = df.duplicated().sum()
        print(f"Duplicates: {duplicates}")
        
        # NaN / Inf
        nan_inf = df.isin([np.nan, np.inf, -np.inf]).sum().sum()
        print(f"NaN/Inf Values: {nan_inf}")

        print("\n")
        
if __name__ == "__main__":
    audit_datasets()
