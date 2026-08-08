import json
import time
import psutil
import os
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OrdinalEncoder, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, HistGradientBoostingClassifier
from sklearn.naive_bayes import GaussianNB
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

def test_models():
    train_df = pd.read_csv('phase5/production_dataset/production_train.csv')
    val_df = pd.read_csv('phase5/production_dataset/production_validation.csv')
    
    with open('phase5/production_dataset/training_dataset_metadata.json') as f:
        meta = json.load(f)
    
    target_col = meta.get('target', 'SLA_Breached')
    features = [c for c in train_df.columns if c != target_col]
    
    cat_cols = train_df[features].select_dtypes(include=['object', 'category', 'string', 'bool']).columns.tolist()
    num_cols = [c for c in features if c not in cat_cols]
    
    print(f"Features: {len(features)} (Categorical: {len(cat_cols)}, Numerical: {len(num_cols)})")
    
    X_train, y_train = train_df[features], train_df[target_col].values
    X_val, y_val = val_df[features], val_df[target_col].values
    
    # Preprocessors
    cat_transformer = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    num_transformer = StandardScaler()
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_transformer, num_cols),
            ('cat', cat_transformer, cat_cols)
        ]
    )
    
    models = {
        'Logistic_Regression': LogisticRegression(random_state=42, max_iter=1000),
        'Decision_Tree': DecisionTreeClassifier(random_state=42),
        'Random_Forest': RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1),
        'Extra_Trees': ExtraTreesClassifier(n_estimators=50, random_state=42, n_jobs=-1),
        'XGBoost': XGBClassifier(n_estimators=50, random_state=42, eval_metric='logloss', n_jobs=-1),
        'LightGBM': LGBMClassifier(n_estimators=50, random_state=42, verbose=-1, n_jobs=-1),
        'CatBoost': CatBoostClassifier(iterations=50, random_state=42, verbose=0, thread_count=-1),
        'HistGradientBoosting': HistGradientBoostingClassifier(random_state=42, max_iter=50, early_stopping=False),
        'Naive_Bayes': GaussianNB()
    }
    
    for name, model in models.items():
        pipe = Pipeline([
            ('preprocessor', preprocessor),
            ('clf', model)
        ])
        t0 = time.time()
        pipe.fit(X_train, y_train)
        t_fit = time.time() - t0
        
        t0 = time.time()
        preds = pipe.predict(X_val)
        probs = pipe.predict_proba(X_val)[:, 1] if hasattr(pipe, 'predict_proba') else pipe.decision_function(X_val)
        t_pred = time.time() - t0
        
        print(f"[{name}] Fit: {t_fit:.3f}s | Predict: {t_pred:.3f}s | Pred shape: {preds.shape} | Probs range: [{probs.min():.4f}, {probs.max():.4f}]")

if __name__ == '__main__':
    test_models()
