import pandas as pd
import os
import warnings

# Suppress pandas FutureWarnings for inplace/fillna
warnings.simplefilter(action='ignore', category=FutureWarning)

def clean_dataset(input_filepath, output_filepath):
    print(f"Loading data from {input_filepath}...")
    df = pd.read_csv(input_filepath)
    
    initial_rows = len(df)
    print(f"Initial row count: {initial_rows}")

    print("Step 1: Handling missing feedback and handler IDs...")
    # These are missing intentionally because not every query requires human review
    df['Agent_Accuracy_Feedback'] = df['Agent_Accuracy_Feedback'].fillna(0)
    df['Employee_ID_Handler'] = df['Employee_ID_Handler'].fillna('Auto-Resolved')

    print("Step 2: Filling missing categorical text fields...")
    # Fill categorical missing fields with an 'Unknown' placeholder
    df['Customer_Segment'] = df['Customer_Segment'].fillna('Unknown')
    df['Region'] = df['Region'].fillna('Unknown')
    df['Report_Summary_Text'] = df['Report_Summary_Text'].fillna('No Summary Available')

    print("Step 3: Imputing missing numerical values with the median...")
    # These are continuous variables; using median prevents outliers from skewing the fill value
    num_cols = [
        'Processing_Time_Sec', 
        'KPI_Current_Value', 
        'Cost_Savings_Potential_USD', 
        'Data_Quality_Score'
    ]
    for col in num_cols:
        if df[col].isnull().sum() > 0:
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)
            
    print("Step 4: Capping extreme outliers...")
    # Cap extreme anomalies at the 99th percentile to protect ML models
    p99 = df['Processing_Time_Sec'].quantile(0.99)
    df.loc[df['Processing_Time_Sec'] > p99, 'Processing_Time_Sec'] = p99

    print("Step 5: Standardizing categorical text fields...")
    # Strip whitespace and enforce consistent casing
    df['Department'] = df['Department'].str.strip().str.title()
    df['Region'] = df['Region'].str.strip().str.title()

    print("Step 6: Fixing Date & Time formatting...")
    df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'])
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    print("Step 7: Dropping irrelevant columns...")
    if 'Record_ID' in df.columns:
        df = df.drop(columns=['Record_ID'])

    print("Step 8: Removing duplicated rows...")
    df = df.drop_duplicates()
    final_rows = len(df)
    
    print(f"Dropped {initial_rows - final_rows} duplicate rows.")

    print(f"Step 9: Saving cleaned dataset to {output_filepath}...")
    df.to_csv(output_filepath, index=False)
    print("Done! Data cleaning completed successfully.")

if __name__ == "__main__":
    # Define input and output paths
    input_file = os.path.join('raw', 'enterprise_multiagent_decision_support.csv')
    output_file = os.path.join('cleaned_enterprise_multiagent_decision_support.csv')
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found. Please run this from the project root.")
    else:
        clean_dataset(input_file, output_file)
