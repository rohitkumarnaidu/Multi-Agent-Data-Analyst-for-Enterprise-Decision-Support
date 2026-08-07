import os
import time
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.feature_selection import RFE, RFECV, SequentialFeatureSelector
from sklearn.inspection import permutation_importance
from sklearn.model_selection import StratifiedKFold

try:
    from xgboost import XGBClassifier
    xgb_model = XGBClassifier(n_estimators=25, max_depth=4, learning_rate=0.1, random_state=42, eval_metric='logloss')
except ImportError:
    xgb_model = RandomForestClassifier(n_estimators=25, max_depth=4, random_state=42)
try:
    from lightgbm import LGBMClassifier
    lgbm_model = LGBMClassifier(n_estimators=25, max_depth=4, learning_rate=0.1, random_state=42, verbose=-1)
except ImportError:
    lgbm_model = RandomForestClassifier(n_estimators=25, max_depth=4, random_state=43)
try:
    from catboost import CatBoostClassifier
    cat_model = CatBoostClassifier(iterations=25, depth=4, learning_rate=0.1, random_state=42, verbose=0)
except ImportError:
    cat_model = RandomForestClassifier(n_estimators=25, max_depth=4, random_state=44)

def run_phase4c():
    output_dir = 'phase4/model_feature_selection'
    os.makedirs(output_dir, exist_ok=True)
    
    print("Loading data...")
    train_df = pd.read_csv('data/train.csv')
    
    target_col = 'Anomaly_Detected'
    if target_col not in train_df.columns:
        target_col = [c for c in train_df.columns if 'Anomaly_Detected' in c][0]
        
    y = train_df[target_col].values
    
    try:
        rankings = pd.read_csv('phase4/business_feature_selection/business_feature_rankings.csv')
        valid_features = rankings['Feature Name'].tolist()
    except:
        valid_features = []
        
    # Mapping base features (44) to OHE columns (73)
    feature_mapping = {} # Base -> List of OHE cols
    all_train_cols = [c for c in train_df.columns if c != target_col]
    
    # We will iterate through all_train_cols and assign them to exactly one valid_feature
    for c in all_train_cols:
        matched = False
        # To avoid substring issues (e.g. 'Id' matching 'Employee_Id'), sort by length descending
        for vf in sorted(valid_features, key=len, reverse=True):
            if vf in c:
                if vf not in feature_mapping:
                    feature_mapping[vf] = []
                feature_mapping[vf].append(c)
                matched = True
                break
        
        # If no match, maybe we don't care, but for completeness:
        if not matched:
            pass # We ignore it if it wasn't evaluated in Phase 4B
            
    # Keep only columns that mapped
    cols_to_keep = []
    for vf, ohe_cols in feature_mapping.items():
        cols_to_keep.extend(ohe_cols)
        
    X_df = train_df[cols_to_keep].fillna(train_df[cols_to_keep].median())
    
    if len(X_df) > 10000:
        sample_idx = X_df.sample(n=10000, random_state=42).index
        X_df = X_df.loc[sample_idx]
        y = y[sample_idx]
        
    # ---------------------------------------------------------
    # Lightweight Models
    # ---------------------------------------------------------
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=25, max_depth=4, random_state=42, n_jobs=-1),
        'Extra Trees': ExtraTreesClassifier(n_estimators=25, max_depth=4, random_state=42, n_jobs=-1),
        'XGBoost': xgb_model,
        'LightGBM': lgbm_model,
        'CatBoost': cat_model
    }
    
    importance_dfs = {}
    performance_records = []
    
    def aggregate_importances(imp_array):
        # Map back to 44 features
        agg = []
        for vf in valid_features:
            if vf in feature_mapping:
                # Sum importance
                val = sum([imp_array[cols_to_keep.index(c)] for c in feature_mapping[vf]])
                agg.append({'Feature Name': vf, 'Importance': val})
            else:
                agg.append({'Feature Name': vf, 'Importance': 0})
        df = pd.DataFrame(agg).sort_values('Importance', ascending=False)
        df['Rank'] = range(1, len(df) + 1)
        return df

    def aggregate_ranks(rank_array):
        # Map back to 44 features
        agg = []
        for vf in valid_features:
            if vf in feature_mapping:
                # Min rank
                val = min([rank_array[cols_to_keep.index(c)] for c in feature_mapping[vf]])
                agg.append({'Feature Name': vf, 'Ranking': val})
            else:
                agg.append({'Feature Name': vf, 'Ranking': 999})
        df = pd.DataFrame(agg)
        return df
        
    def aggregate_selections(sel_array):
        agg = []
        for vf in valid_features:
            if vf in feature_mapping:
                # Any selected
                val = any([sel_array[cols_to_keep.index(c)] for c in feature_mapping[vf]])
                agg.append({'Feature Name': vf, 'Selected': val})
            else:
                agg.append({'Feature Name': vf, 'Selected': False})
        return pd.DataFrame(agg)
    
    print("Training base models and extracting importance...")
    for name, model in models.items():
        start_time = time.time()
        model.fit(X_df, y)
        exec_time = time.time() - start_time
        
        try:
            importances = model.feature_importances_
        except:
            importances = model.get_feature_importance()
            
        imp_df = aggregate_importances(importances)
        
        filename = f"{name.lower().replace(' ', '_')}_importance.csv"
        imp_df.to_csv(os.path.join(output_dir, filename), index=False)
        importance_dfs[name] = imp_df
        
        performance_records.append({
            'Model': name,
            'Execution Time (s)': round(exec_time, 2),
            'Feature Count': len(valid_features)
        })
        
    # ---------------------------------------------------------
    # Wrapper Methods (RFE, SFS)
    # ---------------------------------------------------------
    dt = DecisionTreeClassifier(max_depth=3, random_state=42)
    
    print("Running RFE and RFECV...")
    rfe = RFE(estimator=dt, n_features_to_select=10, step=0.1)
    rfe.fit(X_df, y)
    rfe_df = aggregate_ranks(rfe.ranking_)
    rfe_df.to_csv(os.path.join(output_dir, 'rfe_results.csv'), index=False)
    
    rfecv = RFECV(estimator=dt, step=0.1, cv=StratifiedKFold(2), scoring='accuracy', min_features_to_select=5, n_jobs=-1)
    rfecv.fit(X_df, y)
    rfecv_df = aggregate_ranks(rfecv.ranking_)
    rfecv_df.to_csv(os.path.join(output_dir, 'rfecv_results.csv'), index=False)
    
    print("Running Sequential Selection...")
    sfs = SequentialFeatureSelector(dt, n_features_to_select=5, direction='forward', cv=2, n_jobs=-1)
    sfs.fit(X_df, y)
    sfs_df = aggregate_selections(sfs.get_support())
    sfs_df.to_csv(os.path.join(output_dir, 'forward_selection.csv'), index=False)
    
    sbs = SequentialFeatureSelector(dt, n_features_to_select=5, direction='backward', cv=2, n_jobs=-1)
    sbs.fit(X_df, y)
    sbs_df = aggregate_selections(sbs.get_support())
    sbs_df.to_csv(os.path.join(output_dir, 'backward_selection.csv'), index=False)
    
    print("Running Permutation Importance...")
    rf_model = models['Random Forest']
    perm = permutation_importance(rf_model, X_df, y, n_repeats=2, random_state=42, n_jobs=-1)
    perm_df = aggregate_importances(perm.importances_mean)
    perm_df.rename(columns={'Importance': 'Importance Mean'}, inplace=True)
    perm_df.to_csv(os.path.join(output_dir, 'permutation_importance.csv'), index=False)
    
    # ---------------------------------------------------------
    # Stability & Consensus
    # ---------------------------------------------------------
    print("Calculating Consensus and Stability...")
    consensus_df = pd.DataFrame({'Feature Name': valid_features})
    
    for name, df in importance_dfs.items():
        consensus_df = consensus_df.merge(df[['Feature Name', 'Rank']].rename(columns={'Rank': f'{name} Rank'}), on='Feature Name', how='left')
        
    consensus_df = consensus_df.merge(rfe_df[['Feature Name', 'Ranking']].rename(columns={'Ranking': 'RFE Rank'}), on='Feature Name', how='left')
    consensus_df = consensus_df.merge(rfecv_df[['Feature Name', 'Ranking']].rename(columns={'Ranking': 'RFECV Rank'}), on='Feature Name', how='left')
    consensus_df = consensus_df.merge(perm_df[['Feature Name', 'Rank']].rename(columns={'Rank': 'Permutation Rank'}), on='Feature Name', how='left')
    
    rank_cols = [c for c in consensus_df.columns if 'Rank' in c]
    consensus_df['Average Rank'] = consensus_df[rank_cols].mean(axis=1)
    consensus_df['Rank Std (Stability)'] = consensus_df[rank_cols].std(axis=1)
    
    consensus_df = consensus_df.sort_values('Average Rank')
    consensus_df['Consensus Rank'] = range(1, len(consensus_df) + 1)
    
    def classify_model(rank, max_rank):
        if rank <= 5: return 'KEEP (High Confidence)'
        elif rank <= 15: return 'KEEP'
        elif rank <= 25: return 'MODEL IMPORTANT'
        elif rank <= 30: return 'REVIEW'
        else: return 'LOW IMPORTANCE'
        
    consensus_df['Classification'] = consensus_df['Consensus Rank'].apply(lambda x: classify_model(x, len(consensus_df)))
    consensus_df.to_csv(os.path.join(output_dir, 'consensus_feature_rankings.csv'), index=False)
    
    stability_df = consensus_df[['Feature Name', 'Average Rank', 'Rank Std (Stability)']].copy()
    stability_df.rename(columns={'Rank Std (Stability)': 'Ranking Consistency Variance'}, inplace=True)
    stability_df.to_csv(os.path.join(output_dir, 'feature_stability.csv'), index=False)
    
    consensus_df[consensus_df['Classification'].str.contains('KEEP')].to_csv(os.path.join(output_dir, 'model_keep_candidates.csv'), index=False)
    consensus_df[consensus_df['Classification'] == 'REVIEW'].to_csv(os.path.join(output_dir, 'model_review_candidates.csv'), index=False)
    consensus_df[consensus_df['Classification'].isin(['LOW IMPORTANCE', 'REMOVE CANDIDATE'])].to_csv(os.path.join(output_dir, 'model_remove_candidates.csv'), index=False)
    
    pd.DataFrame(performance_records).to_csv(os.path.join(output_dir, 'model_performance_summary.csv'), index=False)
    
    readme = "# Phase 4C - Model-Based Feature Selection\n..."
    with open(os.path.join(output_dir, 'README.md'), 'w') as f: f.write(readme)
        
    top_20 = consensus_df.head(20)['Feature Name'].tolist()
    report = f"# Model-Based Feature Selection Report\n\nTop 20 Features:\n{', '.join(top_20[:20])}\n"
    with open(os.path.join(output_dir, 'Model_Feature_Selection_Report.md'), 'w') as f: f.write(report)
        
    print("Phase 4C Complete.")

if __name__ == '__main__':
    run_phase4c()
