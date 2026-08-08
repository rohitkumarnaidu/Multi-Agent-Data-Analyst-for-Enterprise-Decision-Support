"""
Models API — Enterprise Decision Support Platform
===================================================
Exposes ML champion model metadata, metrics, and model comparison.
"""
import os
import json
import glob
from fastapi import APIRouter
from services.ml_loader import ml_service
import structlog

logger = structlog.get_logger("enterprise_backend.api.models")
router = APIRouter()

PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))


def _find_model_metadata():
    """Search for model metadata in standard locations."""
    search_paths = [
        os.path.join(PROJECT_ROOT, "models", "champion_model_metadata.json"),
        os.path.join(PROJECT_ROOT, "models", "model_metadata.json"),
        os.path.join(PROJECT_ROOT, "phase5", "champion_metadata.json"),
        os.path.join(PROJECT_ROOT, "outputs", "model_metadata.json"),
    ]
    for p in search_paths:
        if os.path.exists(p):
            with open(p, "r") as f:
                return json.load(f)
    # Search recursively for any model metadata
    for pattern in ["**/champion*metadata*.json", "**/model*metadata*.json"]:
        matches = glob.glob(os.path.join(PROJECT_ROOT, pattern), recursive=True)
        if matches:
            with open(matches[0], "r") as f:
                return json.load(f)
    return None


def _find_evaluation_results():
    """Search for model evaluation/comparison results."""
    search_paths = [
        os.path.join(PROJECT_ROOT, "phase5", "model_evaluation_results.json"),
        os.path.join(PROJECT_ROOT, "models", "evaluation_results.json"),
        os.path.join(PROJECT_ROOT, "outputs", "model_comparison.json"),
    ]
    for p in search_paths:
        if os.path.exists(p):
            with open(p, "r") as f:
                return json.load(f)
    for pattern in ["**/model*evaluation*.json", "**/model*comparison*.json"]:
        matches = glob.glob(os.path.join(PROJECT_ROOT, pattern), recursive=True)
        if matches:
            with open(matches[0], "r") as f:
                return json.load(f)
    return None


@router.get("/champion")
async def get_champion_model():
    """Return champion model information and metrics."""
    metadata = _find_model_metadata()
    if metadata:
        return metadata

    # Fallback: use ml_service metadata
    if ml_service.metadata:
        return {
            "name": ml_service.metadata.get("champion_model", "Stacking Ensemble"),
            "type": ml_service.metadata.get("model_type", "Ensemble"),
            "version": "1.0.0",
            "training_date": ml_service.metadata.get("training_date", "2025-12-30"),
            "dataset_size": ml_service.metadata.get("dataset_size", 200000),
            "metrics": {
                "accuracy": ml_service.metadata.get("accuracy", 0.0),
                "precision": ml_service.metadata.get("precision", 0.0),
                "recall": ml_service.metadata.get("recall", 0.0),
                "f1_score": ml_service.metadata.get("f1_score", 0.0),
                "roc_auc": ml_service.metadata.get("roc_auc", 0.0),
                "training_time_sec": ml_service.metadata.get("training_time", 0.0),
                "prediction_time_ms": ml_service.metadata.get("prediction_time_ms", 0.0),
                "threshold": ml_service.metadata.get("threshold", 0.5),
            },
            "feature_importance": ml_service.metadata.get("feature_importance", []),
            "business_score": ml_service.metadata.get("business_score", 0.0),
        }

    # Minimal fallback
    return {
        "name": "Stacking Ensemble (Phase 5C Certified)",
        "type": "Ensemble",
        "version": "1.0.0",
        "training_date": "2025-12-30",
        "dataset_size": 200000,
        "metrics": {
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "f1_score": 0.0,
            "roc_auc": 0.0,
            "training_time_sec": 0.0,
            "prediction_time_ms": 0.0,
            "threshold": 0.5,
        },
        "feature_importance": [],
        "note": "Model artifacts not yet deployed. Metrics will populate after model training.",
    }


@router.get("/comparison")
async def get_model_comparison():
    """Return comparison of all trained models."""
    results = _find_evaluation_results()
    if results:
        return results

    # Provide structure even without data
    return {
        "models": [
            {"name": "XGBoost", "type": "Gradient Boosting", "is_champion": False, "metrics": {}},
            {"name": "Random Forest", "type": "Ensemble", "is_champion": False, "metrics": {}},
            {"name": "Gradient Boost", "type": "Gradient Boosting", "is_champion": False, "metrics": {}},
            {"name": "Stacking Ensemble", "type": "Ensemble", "is_champion": True, "metrics": {}},
            {"name": "Logistic Regression", "type": "Linear", "is_champion": False, "metrics": {}},
            {"name": "Isolation Forest", "type": "Anomaly Detection", "is_champion": False, "metrics": {}},
        ],
        "note": "Detailed metrics will populate after model evaluation pipeline completes.",
    }
