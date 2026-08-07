"""
Logistic Regression Baseline — Multi-Agent Data Analyst
=======================================================
Provides a simple baseline to compare against the XGBoost model,
proving the value of the non-linear tree model.
Per Metrics doc Section 5.
"""

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.preprocessing import StandardScaler


def train_and_evaluate_baseline(X_train, X_test, y_train, y_test) -> dict:
    """
    Trains a Logistic Regression baseline and evaluates it.
    Returns a dictionary of metrics for comparison.
    """
    print("[Baseline] Training Logistic Regression...")
    
    # Scale features for Logistic Regression (important for convergence and fair comparison)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Handle class imbalance identically to XGBoost
    model = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    preds = model.predict(X_test_scaled)
    probs = model.predict_proba(X_test_scaled)[:, 1]
    
    metrics = {
        "Accuracy": round(accuracy_score(y_test, preds), 4),
        "Precision": round(precision_score(y_test, preds, zero_division=0), 4),
        "Recall": round(recall_score(y_test, preds, zero_division=0), 4),
        "F1": round(f1_score(y_test, preds, zero_division=0), 4),
        "ROC_AUC": round(roc_auc_score(y_test, probs), 4)
    }
    
    print(f"[Baseline] Metrics: {metrics}")
    return metrics
