"""Phase 5D Verification — Step 1: File existence scan + metric recomputation"""
import pathlib, json, sys, time
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, balanced_accuracy_score,
    matthews_corrcoef, cohen_kappa_score, log_loss, brier_score_loss,
    confusion_matrix
)
from sklearn.preprocessing import LabelEncoder
import joblib, warnings
warnings.filterwarnings("ignore")

ROOT     = pathlib.Path(__file__).parent.resolve()
EVAL     = ROOT / "phase5" / "evaluation"
VAL      = EVAL / "validation"
PLOTS    = EVAL / "plots"
VERIF    = EVAL / "verification"
VERIF.mkdir(parents=True, exist_ok=True)

TS = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log(m): print(f"[{datetime.now().strftime('%H:%M:%S')}] {m}")

# ─── STEP 1: File Inventory ────────────────────────────────────────────────────
log("=== FILE EXISTENCE VERIFICATION ===")

PHASE5D_REQUIRED = [
    ("classification_metrics.csv",   EVAL),
    ("confusion_matrix.csv",         EVAL),
    ("calibration_report.csv",       EVAL),
    ("threshold_analysis.csv",       EVAL),
    ("error_analysis.csv",           EVAL),
    ("stability_analysis.csv",       EVAL),
    ("business_evaluation.csv",      EVAL),
    ("fairness_report.csv",          EVAL),
    ("performance_benchmark.csv",    EVAL),
    ("model_leaderboard.csv",        EVAL),
    ("README.md",                    EVAL),
    ("Evaluation_Report.md",         EVAL),
    ("Executive_Summary.md",         EVAL),
    ("Business_Evaluation.md",       EVAL),
    ("Production_Readiness.md",      EVAL),
    ("model_inventory.md",           EVAL),
    ("explainability_validation.md", EVAL),
    # Plots
    ("roc_curves.png",               PLOTS),
    ("pr_curves.png",                PLOTS),
    ("lift_gain_ks_curves.png",      PLOTS),
    ("calibration_curves.png",       PLOTS),
    ("threshold_curves.png",         PLOTS),
    ("error_distribution.png",       PLOTS),
    ("prediction_distribution.png",  PLOTS),
    ("feature_importance.png",       PLOTS),
    ("model_comparison.png",         PLOTS),
    ("business_kpi_dashboard.png",   PLOTS),
]

PHASE5D1_REQUIRED = [
    ("README.md",                 VAL),
    ("dataset_inventory.md",      VAL),
    ("target_distribution.csv",   VAL),
    ("split_validation.md",       VAL),
    ("stratification_report.md",  VAL),
    ("evaluation_integrity.md",   VAL),
    ("metric_reliability.md",     VAL),
    ("business_risk.md",          VAL),
    ("recommendations.md",        VAL),
    ("Executive_Summary.md",      VAL),
]

DATASET_REQUIRED = [
    ("production_train.csv",      ROOT / "phase5" / "production_dataset"),
    ("production_validation.csv", ROOT / "phase5" / "production_dataset"),
    ("production_test.csv",       ROOT / "phase5" / "production_dataset"),
]

file_results = []
for fname, base in DATASET_REQUIRED + PHASE5D_REQUIRED + PHASE5D1_REQUIRED:
    p = base / fname
    exists = p.exists()
    size   = p.stat().st_size if exists else 0
    category = "DATASET" if base == ROOT / "phase5" / "production_dataset" else \
               ("PHASE5D" if base in [EVAL, PLOTS] else "PHASE5D1")
    file_results.append({
        "Category": category,
        "File": fname,
        "Path": str(p.relative_to(ROOT)),
        "Exists": "YES" if exists else "NO",
        "Size_Bytes": size,
        "Status": "PASS" if exists and size > 100 else ("EMPTY" if exists else "MISSING")
    })
    status = "PASS" if exists and size > 100 else ("EMPTY" if exists else "MISSING")
    log(f"  [{status:7}] {fname} ({size:,}b)")

file_df = pd.DataFrame(file_results)

n_pass    = (file_df["Status"] == "PASS").sum()
n_missing = (file_df["Status"] == "MISSING").sum()
n_empty   = (file_df["Status"] == "EMPTY").sum()
log(f"File check: {n_pass} PASS | {n_missing} MISSING | {n_empty} EMPTY")


# ─── STEP 2: Load datasets & recompute metrics from scratch ──────────────────
log("=== METRIC RECOMPUTATION (ZERO TRUST) ===")

P5_DATA = ROOT / "phase5" / "production_dataset"
df_tr   = pd.read_csv(P5_DATA / "production_train.csv")
TARGET  = "SLA_Breached"

# Get feature list from model registry
with open(ROOT / "phase5" / "baseline_models" / "model_registry.json") as f:
    registry = json.load(f)
features = registry[list(registry.keys())[0]]["features"]

# Encode
def encode(df):
    X = df[features].copy()
    for col in X.select_dtypes(include=["object", "string", "category"]).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
    return X.values.astype(float)

X_tr = encode(df_tr)
y_tr = df_tr[TARGET].values
log(f"  Train: {X_tr.shape}  positives={y_tr.sum()}")

# Load models and recompute metrics fresh
tuned_dir = ROOT / "phase5" / "hyperparameter_tuning" / "tuned_models"
model_paths = {
    "Logistic_Regression":  tuned_dir / "Logistic_Regression_tuned.joblib",
    "Decision_Tree":        tuned_dir / "Decision_Tree_tuned.joblib",
    "Random_Forest":        tuned_dir / "Random_Forest_tuned.joblib",
    "Extra_Trees":          tuned_dir / "Extra_Trees_tuned.joblib",
    "XGBoost":              tuned_dir / "XGBoost_tuned.joblib",
    "LightGBM":             tuned_dir / "LightGBM_tuned.joblib",
    "CatBoost":             tuned_dir / "CatBoost_tuned.joblib",
    "HistGradientBoosting": tuned_dir / "HistGradientBoosting_tuned.joblib",
    "GaussianNB":           tuned_dir / "GaussianNB_tuned.joblib",
}

fresh_metrics = []
for name, path in model_paths.items():
    try:
        m = joblib.load(path)
        yp  = m.predict(X_tr)
        ypr = m.predict_proba(X_tr)[:,1]

        acc  = accuracy_score(y_tr, yp)
        bal  = balanced_accuracy_score(y_tr, yp)
        prec = precision_score(y_tr, yp, zero_division=0)
        rec  = recall_score(y_tr, yp, zero_division=0)
        f1   = f1_score(y_tr, yp, zero_division=0)
        mcc  = matthews_corrcoef(y_tr, yp)
        kap  = cohen_kappa_score(y_tr, yp)
        try:    auc = roc_auc_score(y_tr, ypr)
        except: auc = float("nan")
        try:    ll  = log_loss(y_tr, ypr)
        except: ll  = float("nan")
        try:    bs  = brier_score_loss(y_tr, ypr)
        except: bs  = float("nan")

        cm   = confusion_matrix(y_tr, yp, labels=[0,1])
        tn,fp,fn,tp = cm.ravel()

        fresh_metrics.append({
            "Model": name,
            "Accuracy":          round(acc,6),
            "Balanced_Accuracy": round(bal,6),
            "Precision":         round(prec,6),
            "Recall":            round(rec,6),
            "F1_Score":          round(f1,6),
            "MCC":               round(mcc,6),
            "Cohen_Kappa":       round(kap,6),
            "ROC_AUC":           round(auc,6) if not np.isnan(auc) else "N/A",
            "Log_Loss":          round(ll,6)  if not np.isnan(ll)  else "N/A",
            "Brier_Score":       round(bs,6)  if not np.isnan(bs)  else "N/A",
            "TP": int(tp), "TN": int(tn), "FP": int(fp), "FN": int(fn),
        })
        log(f"  {name:<28} Acc={acc:.6f} AUC={auc:.6f} MCC={mcc:.6f}")
    except Exception as e:
        log(f"  FAILED {name}: {e}")
        fresh_metrics.append({"Model": name, "Accuracy": "FAILED", "Error": str(e)})

fresh_df = pd.DataFrame(fresh_metrics)

# Save fresh recomputation
fresh_df.to_csv(VERIF / "_fresh_recomputed_metrics.csv", index=False)
log(f"  Fresh metrics saved: {len(fresh_df)} models")


# ─── STEP 3: Cross-check against Phase 5D classification_metrics.csv ─────────
log("=== CROSS-CHECK vs PHASE 5D classification_metrics.csv ===")

reported_df = pd.read_csv(EVAL / "classification_metrics.csv")

crosscheck_rows = []
TOLERANCE = 1e-4  # Acceptable floating point tolerance

for _, row in fresh_df.iterrows():
    name = row["Model"]
    reported_row = reported_df[reported_df["Model"] == name]
    if reported_row.empty:
        crosscheck_rows.append({"Model": name, "Check": "MISSING_FROM_REPORT", "Status": "FAIL"})
        continue

    rep = reported_row.iloc[0]
    for metric in ["Accuracy", "Balanced_Accuracy", "Precision", "Recall", "F1_Score", "MCC"]:
        fresh_val = row.get(metric, None)
        rep_val   = rep.get(metric, None)
        if fresh_val is None or rep_val is None or fresh_val == "FAILED":
            continue
        try:
            fresh_f = float(fresh_val)
            rep_f   = float(rep_val)
            diff    = abs(fresh_f - rep_f)
            status  = "PASS" if diff <= TOLERANCE else "MISMATCH"
            crosscheck_rows.append({
                "Model": name, "Metric": metric,
                "Fresh_Value":    round(fresh_f, 6),
                "Reported_Value": round(rep_f, 6),
                "Absolute_Diff":  round(diff, 8),
                "Tolerance":      TOLERANCE,
                "Status":         status
            })
            if status == "MISMATCH":
                log(f"  MISMATCH {name}.{metric}: fresh={fresh_f:.6f} reported={rep_f:.6f} diff={diff:.8f}")
        except Exception as e:
            crosscheck_rows.append({"Model": name, "Metric": metric, "Status": f"ERROR: {e}"})

cc_df = pd.DataFrame(crosscheck_rows)
cc_df.to_csv(VERIF / "_crosscheck_metrics.csv", index=False)

n_pass_cc  = (cc_df.get("Status","") == "PASS").sum()
n_fail_cc  = (cc_df["Status"].str.startswith("MISMATCH") if "Status" in cc_df.columns else pd.Series([False])).sum()
log(f"Cross-check: {n_pass_cc} PASS | {n_fail_cc} MISMATCH")

print("\nDONE. Data collected for verification report generation.")
print(f"File scan: {n_pass} PASS | {n_missing} MISSING | {n_empty} EMPTY")
print(f"Metric cross-check: {n_pass_cc} PASS | {n_fail_cc} MISMATCH")
