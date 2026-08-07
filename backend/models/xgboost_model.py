"""
XGBoost Anomaly/Risk Engine — Multi-Agent Data Analyst
======================================================
Trains an XGBoost classifier to predict high-risk queries.
Per Master Plan Section 7.1: Since the raw data lacks a balanced natural label,
we run an unsupervised Isolation Forest first to generate algorithmically-derived
risk flags, then train XGBoost against those flags for explainability and speed.

Usage:
    from backend.models.xgboost_model import train_pipeline, predict_risk
"""

import json
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import xgboost as xgb
import matplotlib.pyplot as plt
import seaborn as sns

from backend.config import settings
from data.loaders.csv_loader import load_dataset, MEASURE_COLUMNS, BOOLEAN_COLUMNS

MODEL_PATH = settings.OUTPUTS_PATH / "sla_breach_model.json"
METRICS_PATH = settings.OUTPUTS_PATH / "model_metrics.json"
IMPORTANCE_PATH = settings.OUTPUTS_PATH / "feature_importance.json"
CONFUSION_MATRIX_PATH = settings.OUTPUTS_PATH / "confusion_matrix.png"


def prepare_features(df: pd.DataFrame, is_training: bool = True) -> tuple:
    """
    Selects and prepares features for the model.
    Uses continuous measures and booleans as features.
    
    If is_training=True, generates synthetic risk labels via Isolation Forest,
    and returns (X, y, feature_names).
    If is_training=False, returns (X, feature_names).
    """
    print("[XGBoost] Preparing features...")
    
    # 1. Select numeric features (exclude target-leaking or irrelevant IDs)
    valid_measures = [c for c in MEASURE_COLUMNS if c in df.columns and c not in ["Record_ID", "Anomaly_Score", "Data_Quality_Score"]]
    valid_bools = [c for c in BOOLEAN_COLUMNS if c in df.columns and c not in ["Anomaly_Detected", "SLA_Breached"]]
    
    features = valid_measures + valid_bools
    
    X = df[features].copy()
    
    # Fill nulls with medians
    X = X.fillna(X.median())
    
    # Convert booleans to int
    for col in valid_bools:
        X[col] = X[col].astype(int)
        
    feature_names = X.columns.tolist()
    
    if not is_training:
        return X, feature_names
        
    # 2. Unsupervised Anomaly Detection (Isolation Forest)
    # Target: Top 2% most anomalous records become our "High Risk / SLA Breach" proxy
    print("[XGBoost] Running Isolation Forest to generate risk labels...")
    iso = IsolationForest(contamination=0.02, random_state=42, n_jobs=-1)
    
    # IsolationForest returns -1 for anomaly, 1 for normal
    preds = iso.fit_predict(X)
    y = (preds == -1).astype(int)
    
    print(f"[XGBoost] Generated labels: {y.sum()} anomalies out of {len(y)} records")
    return X, y, feature_names


def time_based_split(X: pd.DataFrame, y: np.ndarray, df: pd.DataFrame, test_size=0.2):
    """
    Per Master Plan 7.2: Time-based split to prevent future leakage.
    Sorts by Transaction_Date before splitting.
    """
    if "Transaction_Date" in df.columns:
        indices = df.sort_values("Transaction_Date").index
        X_sorted = X.loc[indices]
        y_sorted = y[indices]
    else:
        # Fallback if no date
        X_sorted = X
        y_sorted = y
        
    split_idx = int(len(X) * (1 - test_size))
    
    X_train = X_sorted.iloc[:split_idx]
    y_train = y_sorted[:split_idx]
    X_test = X_sorted.iloc[split_idx:]
    y_test = y_sorted[split_idx:]
    
    return X_train, X_test, y_train, y_test


def train_model(X_train, y_train) -> xgb.XGBClassifier:
    """Train the XGBoost classifier."""
    print("[XGBoost] Training model...")
    
    # Handle class imbalance based on generated labels
    pos_count = y_train.sum()
    neg_count = len(y_train) - pos_count
    scale_pos_weight = neg_count / pos_count if pos_count > 0 else 1.0
    
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    return model


def evaluate_model(model, X_test, y_test, baseline_metrics=None) -> dict:
    """Evaluate and save metrics and confusion matrix."""
    print("[XGBoost] Evaluating model...")
    
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]
    
    metrics = {
        "Accuracy": round(accuracy_score(y_test, preds), 4),
        "Precision": round(precision_score(y_test, preds, zero_division=0), 4),
        "Recall": round(recall_score(y_test, preds, zero_division=0), 4),
        "F1": round(f1_score(y_test, preds, zero_division=0), 4),
        "ROC_AUC": round(roc_auc_score(y_test, probs), 4)
    }
    
    if baseline_metrics:
        metrics["Baseline_Comparison"] = baseline_metrics
        
    # Save metrics
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
        
    # Confusion Matrix
    cm = confusion_matrix(y_test, preds)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix: Predicted Risk Flags')
    plt.ylabel('Actual (Isolation Forest)')
    plt.xlabel('Predicted (XGBoost)')
    plt.tight_layout()
    plt.savefig(CONFUSION_MATRIX_PATH)
    plt.close()
    
    return metrics


def save_feature_importance(model, feature_names):
    """Extract and save top 10 feature importances."""
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    top_10 = {}
    for i in range(min(10, len(feature_names))):
        top_10[feature_names[indices[i]]] = float(importances[indices[i]])
        
    with open(IMPORTANCE_PATH, "w") as f:
        json.dump(top_10, f, indent=2)
        
    return top_10


def train_pipeline(df: pd.DataFrame = None):
    """End-to-end training pipeline."""
    if df is None:
        df = load_dataset()
        
    # 1. Prepare features and labels
    X, y, feature_names = prepare_features(df, is_training=True)
    
    # 2. Split
    X_train, X_test, y_train, y_test = time_based_split(X, y, df)
    print(f"[XGBoost] Train size: {len(X_train)}, Test size: {len(X_test)}")
    
    # 3. Train Baseline (if available)
    baseline_metrics = None
    try:
        from backend.models.baseline import train_and_evaluate_baseline
        baseline_metrics = train_and_evaluate_baseline(X_train, X_test, y_train, y_test)
    except ImportError:
        pass
        
    # 4. Train XGBoost
    model = train_model(X_train, y_train)
    
    # 5. Evaluate
    metrics = evaluate_model(model, X_test, y_test, baseline_metrics)
    
    # 6. Feature Importance
    top_10 = save_feature_importance(model, feature_names)
    
    # 7. Save model
    model.save_model(str(MODEL_PATH))
    print(f"[XGBoost] Training complete. Metrics saved to {METRICS_PATH}")
    
    return model, metrics, top_10


# ── Inference Methods ──

def load_trained_model():
    """Load the persisted XGBoost model."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run train_pipeline() first.")
    
    model = xgb.XGBClassifier()
    model.load_model(str(MODEL_PATH))
    return model


def predict_risk(model, df_record: pd.DataFrame) -> dict:
    """
    Score a single record or small batch.
    Returns risk score (0-1), flag, and top contributing features.
    """
    X, feature_names = prepare_features(df_record, is_training=False)
    
    probs = model.predict_proba(X)[:, 1]
    preds = model.predict(X)
    
    # Load importance to get top features (proxy for SHAP for speed)
    if IMPORTANCE_PATH.exists():
        with open(IMPORTANCE_PATH, "r") as f:
            top_features_dict = json.load(f)
            top_features = list(top_features_dict.keys())[:3]
    else:
        top_features = []
        
    results = []
    for i in range(len(preds)):
        results.append({
            "risk_score": float(probs[i]),
            "is_high_risk": bool(preds[i]),
            "driving_features": top_features
        })
        
    return results if len(results) > 1 else results[0]


def run_proactive_scan(model, df: pd.DataFrame, top_n: int = 5) -> list:
    """
    Scans the entire dataset and returns the highest risk records.
    Used by the Streamlit Anomaly Panel (Master Plan 8.1).
    """
    X, _ = prepare_features(df, is_training=False)
    probs = model.predict_proba(X)[:, 1]
    
    # Add probs to dataframe to sort
    df_scored = df.copy()
    df_scored["Risk_Score"] = probs
    
    # Get highest risk records
    top_anomalies = df_scored.sort_values("Risk_Score", ascending=False).head(top_n)
    
    results = []
    for _, row in top_anomalies.iterrows():
        results.append({
            "Record_ID": row.get("Record_ID", "Unknown"),
            "Department": row.get("Department", "Unknown"),
            "Assigned_Agent": row.get("Assigned_Agent", "Unknown"),
            "Risk_Score": float(row["Risk_Score"])
        })
        
    return results

if __name__ == "__main__":
    train_pipeline()
