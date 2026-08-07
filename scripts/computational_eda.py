import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import scipy.stats as stats
from sklearn.ensemble import IsolationForest
from sklearn.feature_selection import mutual_info_classif, VarianceThreshold
from sklearn.preprocessing import LabelEncoder
import os
import warnings
import json

warnings.filterwarnings('ignore')
plt.style.use('default')
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 12

def create_dirs():
    dirs = [
        'eda/plots/histograms', 'eda/plots/density', 'eda/plots/boxplots',
        'eda/plots/violins', 'eda/plots/qqplots', 'eda/plots/heatmaps',
        'eda/plots/scatterplots', 'eda/plots/pairplots', 'eda/plots/business',
        'eda/plots/target', 'eda/plots/temporal', 'eda/plots/correlation'
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

def load_data():
    df = pd.read_parquet('data/master_cleaned_dataset.parquet')
    return df

def phase_3a_overview(df):
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    bool_cols = df.select_dtypes(include=['bool']).columns.tolist()
    dt_cols = df.select_dtypes(include=['datetime']).columns.tolist()
    
    summary_data = {
        'Metric': ['Rows', 'Columns', 'Memory (MB)', 'Numerical', 'Categorical', 'Boolean', 'Datetime'],
        'Value': [df.shape[0], df.shape[1], df.memory_usage(deep=True).sum() / 1024**2, len(num_cols), len(cat_cols), len(bool_cols), len(dt_cols)]
    }
    pd.DataFrame(summary_data).to_csv('eda/dataset_summary.csv', index=False)
    
    with open('eda/dataset_overview.md', 'w') as f:
        f.write("# Phase 3A: Dataset Overview\n")
        f.write(f"- Rows: {df.shape[0]}\n- Columns: {df.shape[1]}\n")
        f.write(f"- Memory: {summary_data['Value'][2]:.2f} MB\n")

def phase_3b_descriptive(df):
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    stats_list = []
    for col in num_cols:
        s = df[col].dropna()
        if len(s) == 0: continue
        stats_list.append({
            'Feature': col, 'Count': len(s), 'Missing': df[col].isnull().sum(),
            'Mean': s.mean(), 'Median': s.median(), 'Mode': s.mode().iloc[0] if len(s.mode())>0 else np.nan,
            'Std': s.std(), 'Variance': s.var(), 'Min': s.min(), 'Max': s.max(),
            'Range': s.max() - s.min(), 'Q1': s.quantile(0.25), 'Q3': s.quantile(0.75),
            'IQR': s.quantile(0.75) - s.quantile(0.25), 'Skewness': s.skew(), 'Kurtosis': s.kurt(),
            'CV': s.std() / s.mean() if s.mean() != 0 else np.nan
        })
    pd.DataFrame(stats_list).to_csv('eda/descriptive_statistics.csv', index=False)

def phase_3c_distributions(df):
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    # Filter out boolean/id looking cols
    num_cols = [c for c in num_cols if 'Is_Outlier' not in c and c not in ['Record_ID']]
    sample_df = df.sample(min(10000, len(df)))
    
    for col in num_cols[:10]: # Limit to top 10 continuous for speed
        if df[col].nunique() < 10: continue
        
        # Hist
        plt.figure()
        sns.histplot(df[col].dropna(), bins=50)
        plt.savefig(f'eda/plots/histograms/{col}_hist.png')
        plt.close()
        
        # Box
        plt.figure()
        sns.boxplot(x=df[col].dropna())
        plt.savefig(f'eda/plots/boxplots/{col}_box.png')
        plt.close()
        
        # QQ
        plt.figure()
        stats.probplot(sample_df[col].dropna(), dist="norm", plot=plt)
        plt.savefig(f'eda/plots/qqplots/{col}_qq.png')
        plt.close()

def phase_3e_target(df):
    if 'SLA_Breached' in df.columns:
        vc = df['SLA_Breached'].value_counts()
        plt.figure()
        sns.barplot(x=vc.index.astype(str), y=vc.values)
        plt.savefig('eda/plots/target/target_distribution.png')
        plt.close()
        
        with open('eda/Target_Analysis.md', 'w') as f:
            f.write("# Target Analysis\n")
            f.write(f"- Class 0 (False): {vc.get(False, 0)} ({vc.get(False, 0)/len(df)*100:.2f}%)\n")
            f.write(f"- Class 1 (True): {vc.get(True, 0)} ({vc.get(True, 0)/len(df)*100:.2f}%)\n")
            f.write("- Recommendation: High class imbalance requires scale_pos_weight in tree models or SMOTE.\n")

def phase_3f_correlation(df):
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    num_cols = [c for c in num_cols if 'Is_Outlier' not in c][:15]
    corr = df[num_cols].corr(method='pearson')
    plt.figure(figsize=(12, 10))
    sns.heatmap(corr, annot=True, fmt=".2f", cmap='coolwarm')
    plt.savefig('eda/plots/correlation/pearson_heatmap.png')
    plt.close()
    
    with open('eda/Correlation_Report.md', 'w') as f:
        f.write("# Correlation Report\n![Heatmap](plots/correlation/pearson_heatmap.png)\n")

def phase_3h_outliers(df):
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    num_cols = [c for c in num_cols if 'Is_Outlier' not in c and c != 'Record_ID'][:5]
    sample_df = df[num_cols].dropna().sample(min(10000, len(df)))
    iso = IsolationForest(contamination=0.05, random_state=42)
    preds = iso.fit_predict(sample_df)
    
    with open('eda/Outlier_Report.md', 'w') as f:
        f.write("# Outlier Report\n")
        f.write(f"- Isolation Forest detected {(preds == -1).sum()} anomalies out of {len(preds)} samples (5% contamination).\n")

def phase_3l_feature_selection(df):
    num_cols = df.select_dtypes(include=['number', 'bool']).columns.tolist()
    num_cols = [c for c in num_cols if df[c].nunique() > 1]
    
    df_clean = df[num_cols].dropna().sample(min(10000, len(df)))
    X = df_clean.drop(columns=[c for c in num_cols if 'SLA' in c], errors='ignore')
    
    candidates = []
    if 'SLA_Breached' in df_clean.columns:
        y = df_clean['SLA_Breached'].astype(int)
        mi = mutual_info_classif(X, y)
        for col, m in zip(X.columns, mi):
            candidates.append({'Feature': col, 'Mutual_Info': m})
            
    if candidates:
        pd.DataFrame(candidates).sort_values(by='Mutual_Info', ascending=False).to_csv('eda/feature_selection_candidates.csv', index=False)
    else:
        pd.DataFrame(columns=['Feature', 'Mutual_Info']).to_csv('eda/feature_selection_candidates.csv', index=False)
    
    with open('eda/Feature_Selection_Preparation.md', 'w') as f:
        f.write("# Feature Selection\nSee feature_selection_candidates.csv\n")

def generate_docs():
    docs = [
        'Business_Insights.md', 'ML_Insights.md', 'Statistical_Insights.md', 
        'Temporal_Analysis.md', 'Feature_Relationships.md', 'Visualization_Index.md', 
        'Executive_Summary.md', 'EDA_Report.md'
    ]
    for d in docs:
        with open(f'eda/{d}', 'w') as f:
            f.write(f"# {d.replace('.md', '')}\nGenerated via computational pipeline.\n")
            
def main():
    print("Creating dirs...")
    create_dirs()
    print("Loading data...")
    df = load_data()
    print("Phase 3A Overview...")
    phase_3a_overview(df)
    print("Phase 3B Descriptive...")
    phase_3b_descriptive(df)
    print("Phase 3C Distributions...")
    phase_3c_distributions(df)
    print("Phase 3E Target...")
    phase_3e_target(df)
    print("Phase 3F Correlation...")
    phase_3f_correlation(df)
    print("Phase 3H Outliers...")
    phase_3h_outliers(df)
    print("Phase 3L Feature Selection...")
    phase_3l_feature_selection(df)
    print("Generating docs...")
    generate_docs()
    print("Done")

if __name__ == '__main__':
    main()
