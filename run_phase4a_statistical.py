import pandas as pd
import numpy as np
import os
import json
import warnings
from scipy.stats import entropy, chi2_contingency, f_oneway
from sklearn.feature_selection import mutual_info_classif, mutual_info_regression
from statsmodels.stats.outliers_influence import variance_inflation_factor

warnings.filterwarnings('ignore')

target_col = 'Anomaly_Detected'
output_dir = 'phase4/statistical_feature_selection'
os.makedirs(output_dir, exist_ok=True)

print('Loading datasets...')
# Use master_cleaned_dataset for 1-to-1 mapping with feature_scorecard
df = pd.read_parquet('data/master_cleaned_dataset.parquet')

# Simulate train/val split for PSI (80/20)
train_df = df.sample(frac=0.8, random_state=42)
val_df = df.drop(train_df.index)

scorecard_path = 'feature_selection_preparation/feature_scorecard.csv'
if os.path.exists(scorecard_path):
    scorecard_df = pd.read_csv(scorecard_path)
    scorecard_map = scorecard_df.set_index('Feature Name')['Business Score'].to_dict()
    ml_score_map = scorecard_df.set_index('Feature Name')['ML Score'].to_dict()
else:
    scorecard_map = {}
    ml_score_map = {}

features = [c for c in train_df.columns if c != target_col and c != 'Record_ID' and 'Timestamp' not in c and 'Date' not in c]
num_features = len(features)

# Identify numeric and categorical features
numeric_cols = train_df[features].select_dtypes(include=[np.number]).columns.tolist()
cat_cols = train_df[features].select_dtypes(exclude=[np.number]).columns.tolist()

is_target_categorical = train_df[target_col].dtype == 'object' or train_df[target_col].dtype == 'bool' or train_df[target_col].nunique() < 20

print('1. Computing Variance & Near Zero Variance...')
var_data = []
for col in numeric_cols:
    v = train_df[col].var()
    nzv = 'Yes' if v < 0.01 else 'No'
    var_data.append({'Feature': col, 'Variance': v, 'Near Zero Variance': nzv})
pd.DataFrame(var_data).to_csv(os.path.join(output_dir, 'variance_report.csv'), index=False)

print('2-5. Computing Correlations (Pearson, Spearman, Kendall)...')
sample_size = min(10000, len(train_df))
train_sample = train_df.sample(n=sample_size, random_state=42)

corr_data = []
for col in numeric_cols:
    if not is_target_categorical or train_df[target_col].dtype in ['int64', 'float64', 'bool']:
        p_corr = train_df[col].corr(train_df[target_col], method='pearson')
        s_corr = train_sample[col].corr(train_sample[target_col].astype(float), method='spearman')
        k_corr = train_sample[col].corr(train_sample[target_col].astype(float), method='kendall')
    else:
        p_corr, s_corr, k_corr = np.nan, np.nan, np.nan
        
    corr_data.append({'Feature': col, 'Pearson': p_corr, 'Spearman': s_corr, 'Kendall': k_corr})
pd.DataFrame(corr_data).to_csv(os.path.join(output_dir, 'correlation_report.csv'), index=False)

print('6. Computing Mutual Information, Entropy & Info Gain...')
mi_data = []
ent_data = []
y_sample = train_sample[target_col].astype(str) if is_target_categorical else train_sample[target_col]

for col in features:
    value_counts = train_df[col].value_counts(normalize=True, dropna=False)
    ent = entropy(value_counts)
    missing_pct = train_df[col].isnull().mean() * 100
    unique_ratio = train_df[col].nunique() / len(train_df)
    
    if col in numeric_cols:
        x_sample = train_sample[[col]].fillna(train_sample[col].median())
    else:
        x_sample = train_sample[[col]].fillna('MISSING').astype(str)
        from sklearn.preprocessing import OrdinalEncoder
        x_sample = OrdinalEncoder().fit_transform(x_sample)
        
    if is_target_categorical:
        mi = mutual_info_classif(x_sample, y_sample, random_state=42)[0]
    else:
        mi = mutual_info_regression(x_sample, y_sample, random_state=42)[0]
        
    mi_data.append({'Feature': col, 'Mutual Information': mi, 'Information Gain': mi})
    ent_data.append({'Feature': col, 'Entropy': ent, 'Missing %': missing_pct, 'Unique Ratio': unique_ratio})

pd.DataFrame(mi_data).to_csv(os.path.join(output_dir, 'mutual_information.csv'), index=False)
pd.DataFrame(ent_data).to_csv(os.path.join(output_dir, 'entropy_report.csv'), index=False)

print('7. Computing Chi-Square (Categorical vs Target)...')
chi_data = []
if is_target_categorical:
    for col in cat_cols:
        crosstab = pd.crosstab(train_df[col], train_df[target_col])
        if crosstab.size > 0:
            chi2, p, dof, ex = chi2_contingency(crosstab)
            chi_data.append({'Feature': col, 'Chi-Square': chi2, 'p-value': p})
pd.DataFrame(chi_data).to_csv(os.path.join(output_dir, 'chi_square.csv'), index=False)

print('8. Computing ANOVA F-Test (Numeric vs Target)...')
anova_data = []
if is_target_categorical:
    groups = train_df[target_col].unique()
    for col in numeric_cols:
        group_data = [train_df[train_df[target_col] == g][col].dropna() for g in groups]
        if len(group_data) > 1 and all(len(g) > 1 for g in group_data):
            f_stat, p = f_oneway(*group_data)
            anova_data.append({'Feature': col, 'F-Statistic': f_stat, 'p-value': p})
pd.DataFrame(anova_data).to_csv(os.path.join(output_dir, 'anova.csv'), index=False)

print('9. Computing VIF (Multicollinearity)...')
# We take a sample and select only numeric columns without NaNs
vif_sample = train_sample[numeric_cols].fillna(train_sample[numeric_cols].median())
vif_data = []
if len(vif_sample) > 0 and len(numeric_cols) > 1:
    for i, col in enumerate(numeric_cols):
        try:
            vif = variance_inflation_factor(vif_sample.values, i)
        except:
            vif = np.nan
        vif_data.append({'Feature': col, 'VIF': vif})
pd.DataFrame(vif_data).to_csv(os.path.join(output_dir, 'vif_report.csv'), index=False)

print('10. Computing PSI (Feature Stability)...')
def calculate_psi(expected, actual, buckets=10):
    if len(expected.unique()) <= buckets or expected.dtype == 'object' or expected.dtype == 'bool':
        expected_percents = expected.value_counts(normalize=True)
        actual_percents = actual.value_counts(normalize=True)
        expected_percents, actual_percents = expected_percents.align(actual_percents, fill_value=0.0001)
    else:
        # Numeric
        e_min, e_max = expected.min(), expected.max()
        breakpoints = np.linspace(e_min, e_max, buckets + 1)
        expected_percents = np.histogram(expected, breakpoints)[0] / len(expected)
        actual_percents = np.histogram(actual, breakpoints)[0] / len(actual)
        expected_percents = np.where(expected_percents == 0, 0.0001, expected_percents)
        actual_percents = np.where(actual_percents == 0, 0.0001, actual_percents)
        
    psi_value = np.sum((expected_percents - actual_percents) * np.log(expected_percents / actual_percents))
    return psi_value

psi_data = []
for col in features:
    try:
        e = train_df[col].dropna()
        a = val_df[col].dropna()
        if len(e) > 0 and len(a) > 0:
            psi = calculate_psi(e, a)
        else:
            psi = np.nan
    except:
        psi = np.nan
    psi_data.append({'Feature': col, 'PSI': psi})

print('11. Aggregating Feature Statistics and Rankings...')
stats_df = pd.DataFrame({'Feature Name': features})
stats_df = stats_df.merge(pd.DataFrame(var_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(var_data)>0 else stats_df
stats_df = stats_df.merge(pd.DataFrame(corr_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(corr_data)>0 else stats_df
stats_df = stats_df.merge(pd.DataFrame(mi_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(mi_data)>0 else stats_df
stats_df = stats_df.merge(pd.DataFrame(chi_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(chi_data)>0 else stats_df
stats_df = stats_df.merge(pd.DataFrame(anova_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(anova_data)>0 else stats_df
stats_df = stats_df.merge(pd.DataFrame(vif_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(vif_data)>0 else stats_df
stats_df = stats_df.merge(pd.DataFrame(ent_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(ent_data)>0 else stats_df
stats_df = stats_df.merge(pd.DataFrame(psi_data).rename(columns={'Feature': 'Feature Name'}), on='Feature Name', how='left') if len(psi_data)>0 else stats_df

rankings = []
for idx, row in stats_df.iterrows():
    f = row['Feature Name']
    mi_score = row.get('Mutual Information', 0)
    p_corr = abs(row.get('Pearson', 0)) if pd.notnull(row.get('Pearson')) else 0
    vif = row.get('VIF', 1.0)
    psi = row.get('PSI', 0.0)
    missing = row.get('Missing %', 0)
    
    # Use previous ML score and adjust with rigorous stats
    base_ml = ml_score_map.get(f, 5)
    
    ml_score = base_ml
    if mi_score > 0.05: ml_score += 1
    if p_corr > 0.1: ml_score += 1
    if vif > 10: ml_score -= 3
    if missing > 50: ml_score -= 2
    if psi > 0.1: ml_score -= 2 # Unstable
    if row.get('Near Zero Variance') == 'Yes': ml_score -= 4
    
    ml_score = max(1, min(10, ml_score))
    bus_score = scorecard_map.get(f, 5)
    overall = (ml_score * 0.7) + (bus_score * 0.3)
    
    leakage_risk = 'SAFE'
    classification = 'KEEP'
    
    if p_corr > 0.95 or mi_score > 0.5:
        classification = 'REMOVE CANDIDATE'
    elif row.get('Near Zero Variance') == 'Yes':
        classification = 'LOW VALUE'
    elif vif > 10:
        classification = 'REDUNDANT'
    elif missing > 90:
        classification = 'REMOVE CANDIDATE'
    elif overall >= 7.5 and psi <= 0.05 and vif < 5:
        classification = 'KEEP (High Confidence)'
    elif overall < 4:
        classification = 'REVIEW'
        
    rankings.append({
        'Feature Name': f,
        'Variance': row.get('Variance'),
        'Correlation': p_corr,
        'Mutual Information': mi_score,
        'Information Gain': mi_score,
        'Entropy': row.get('Entropy'),
        'VIF': vif,
        'Business Score': bus_score,
        'ML Score': ml_score,
        'Overall Statistical Score': round(overall, 2),
        'Classification': classification
    })

rankings_df = pd.DataFrame(rankings)
stats_df.to_csv(os.path.join(output_dir, 'feature_statistics.csv'), index=False)
rankings_df.to_csv(os.path.join(output_dir, 'feature_rankings.csv'), index=False)

print('12. Generating subsets and summary...')
rankings_df[rankings_df['Classification'].str.contains('KEEP')].to_csv(os.path.join(output_dir, 'keep_candidates.csv'), index=False)
rankings_df[rankings_df['Classification'] == 'REVIEW'].to_csv(os.path.join(output_dir, 'review_candidates.csv'), index=False)
rankings_df[rankings_df['Classification'] == 'REDUNDANT'].to_csv(os.path.join(output_dir, 'redundant_features.csv'), index=False)
rankings_df[rankings_df['Classification'] == 'REMOVE CANDIDATE'].to_csv(os.path.join(output_dir, 'remove_candidates.csv'), index=False)

readme = f'''# Phase 4A - Statistical Feature Selection

## Overview
This directory contains the statistical evidence for all features generated by the Enterprise ML Review Board. 

### Methods Used
- Variance & Near Zero Variance
- Correlations (Pearson, Spearman, Kendall)
- Mutual Information & Entropy
- Chi-Square & ANOVA F-Test
- VIF (Variance Inflation Factor)
- Feature Stability (PSI)

No features have been permanently removed. All features are categorized into KEEP, REVIEW, REDUNDANT, LOW VALUE, or REMOVE CANDIDATE based strictly on their computed statistical profile.
'''
with open(os.path.join(output_dir, 'README.md'), 'w', encoding='utf-8') as f:
    f.write(readme)

keep_cnt = len(rankings_df[rankings_df['Classification'].str.contains('KEEP')])
rev_cnt = len(rankings_df[rankings_df['Classification'] == 'REVIEW'])
red_cnt = len(rankings_df[rankings_df['Classification'] == 'REDUNDANT'])
rem_cnt = len(rankings_df[rankings_df['Classification'] == 'REMOVE CANDIDATE'])
low_cnt = len(rankings_df[rankings_df['Classification'] == 'LOW VALUE'])

summary = f'''# Phase 4A: Statistical Feature Selection Summary

## Final Classification Counts
- **KEEP / KEEP (High Confidence):** {keep_cnt}
- **REVIEW:** {rev_cnt}
- **REDUNDANT:** {red_cnt}
- **REMOVE CANDIDATE:** {rem_cnt}
- **LOW VALUE:** {low_cnt}

## Methodological Notes
- **Multicollinearity (VIF):** Computed across numeric predictors. Features with VIF > 10 are flagged as REDUNDANT.
- **Leakage (Correlation/MI):** Very high correlation (>0.95) or Mutual Information (>0.5) against the target triggers a REMOVE CANDIDATE / REVIEW flag.
- **Stability (PSI):** Population Stability Index was computed between random train/val splits. High PSI reduces the overall ML score.
- **Overall Score:** Weighted average of derived ML statistical strength and Business relevance.

## Next Steps
The project is ready for Business Feature Selection and SHAP-based Model Selection in subsequent phases. Use `feature_rankings.csv` as the foundation for those steps.
'''
with open(os.path.join(output_dir, 'statistical_summary.md'), 'w', encoding='utf-8') as f:
    f.write(summary)

print('Phase 4A complete.')
