# End-to-End Data Cleaning Process for Enterprise Decision Support Dataset

This guide details the complete, step-by-step process required to clean the `enterprise_multiagent_decision_support.csv` dataset. You can follow these steps manually in a Jupyter Notebook or a Python script to demonstrate exactly how the data was prepared for analysis.

## Phase 1: Setup and Initial Profiling

Before altering any data, we need to load it and understand where the missing values are.

### 1. Import Libraries and Load Data
```python
import pandas as pd

# Load the raw dataset
df = pd.read_csv('raw/enterprise_multiagent_decision_support.csv')
print(f"Initial Dataset Shape: {df.shape}")
```

### 2. Identify Missing Values
Check which columns contain `NaN` (null) values:
```python
# Print columns with missing values and their counts
missing_data = df.isnull().sum()
print(missing_data[missing_data > 0])
```
*Observation:* You will notice that `Agent_Accuracy_Feedback` and `Employee_ID_Handler` have over 140,000 missing values. Metrics like `Processing_Time_Sec` and `Cost_Savings_Potential_USD` have around 4,000 to 5,000 missing values.

---

## Phase 2: Step-by-Step Data Cleaning

### Step 1: Handle "Missing Not At Random" (Intentional Nulls)
In this dataset, not every AI query is escalated to a human. Therefore, if a human didn't review it, the `Agent_Accuracy_Feedback` and `Employee_ID_Handler` fields are left blank. We should not delete these rows; instead, we fill them with logical defaults.

```python
# Replace missing feedback score with 0
df['Agent_Accuracy_Feedback'] = df['Agent_Accuracy_Feedback'].fillna(0)

# Replace missing handler ID with 'Auto-Resolved'
df['Employee_ID_Handler'] = df['Employee_ID_Handler'].fillna('Auto-Resolved')
```

### Step 2: Fill Categorical Missing Data
Some text and categorical fields (like `Customer_Segment` and `Region`) have missing values. We will standardize these by filling them with an `'Unknown'` placeholder.

```python
# Fill missing text fields with 'Unknown' or 'No Summary Available'
df['Customer_Segment'] = df['Customer_Segment'].fillna('Unknown')
df['Region'] = df['Region'].fillna('Unknown')
df['Report_Summary_Text'] = df['Report_Summary_Text'].fillna('No Summary Available')
```

### Step 3: Impute Missing Numerical Metrics
For continuous numerical columns (e.g., `Processing_Time_Sec`, `Cost_Savings_Potential_USD`, `KPI_Current_Value`), deleting rows with missing data would cause us to lose valuable information. 
Instead, we **impute** (fill) the missing values using the **median** of the column. We use the median rather than the mean because the median is resistant to extreme outliers.

```python
# List of numerical columns with missing data
numerical_cols = [
    'Processing_Time_Sec', 
    'KPI_Current_Value', 
    'Cost_Savings_Potential_USD', 
    'Data_Quality_Score'
]

# Fill missing values with the median of each respective column
for col in numerical_cols:
    median_value = df[col].median()
    df[col] = df[col].fillna(median_value)
```

### Step 4: Standardize Date and Time Formats
Machine learning models and time-series analysis require dates to be in a proper `datetime` format, rather than plain text (strings).

```python
# Convert text to datetime objects
df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'])
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
```

### Step 5: Remove Duplicates
To ensure our models don't overfit on repeated data, we drop any rows that are exact duplicates of one another.

```python
# Drop identical rows and check the new shape
df = df.drop_duplicates()
print(f"Dataset Shape after dropping duplicates: {df.shape}")
```

---

## Phase 3: Validation and Export

### 1. Validate the Cleaning Process
Verify that there are absolutely no missing values left in the dataset.
```python
# This should print an empty series if everything is cleaned
missing_after = df.isnull().sum()
print(missing_after[missing_after > 0]) 
```

### 2. Save the Final Cleaned Dataset
Export the perfectly formatted dataset to a new CSV file so it can be ingested by your analytics dashboards or machine learning models.
```python
df.to_csv('cleaned_enterprise_multiagent_decision_support.csv', index=False)
print("Data cleaning successfully completed and saved!")
```
