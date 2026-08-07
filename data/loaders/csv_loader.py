"""
CSV Data Loader — Multi-Agent Data Analyst
============================================
Schema-aware data loading with type enforcement.
Provides functions used by every agent and the DuckDB layer.

Usage:
    from data.loaders.csv_loader import load_dataset, get_schema_summary
    df = load_dataset()
    schema = get_schema_summary(df)
"""

import json
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Optional


# ── Column Type Maps ──
DATETIME_COLUMNS = ["Transaction_Date", "Timestamp"]

BOOLEAN_COLUMNS = [
    "Anomaly_Detected", "SLA_Breached", "Requires_Human_Review",
    "Outlier_Processing_Time_Sec", "Outlier_Transaction_Amount_USD",
    "Outlier_Revenue_Impact_USD", "Outlier_Cost_Savings_Potential_USD",
    "Outlier_Input_Tokens", "Outlier_Output_Tokens",
    "Is_Duplicate", "Human_Bottleneck", "False_Confidence_Flag",
]

IDENTIFIER_COLUMNS = ["Record_ID", "Employee_ID_Handler"]

DIMENSION_COLUMNS = [
    "Department", "Business_Unit", "Region", "Data_Source_System",
    "Assigned_Agent", "Query_Type", "KPI_Metric_Name",
    "Root_Cause_Category", "Recommended_Action",
    "Priority_Level", "Risk_Level", "Escalation_Level",
    "Decision_Outcome", "Customer_Segment",
]

MEASURE_COLUMNS = [
    "Num_Agents_Involved", "Query_Complexity_Score", "Input_Tokens",
    "Output_Tokens", "Processing_Time_Sec", "KPI_Current_Value",
    "KPI_Target_Value", "Deviation_Percentage", "Transaction_Amount_USD",
    "Revenue_Impact_USD", "Cost_Savings_Potential_USD", "Anomaly_Score",
    "Confidence_Score", "Data_Quality_Score", "Agent_Accuracy_Feedback",
    "Token_Efficiency", "Total_Tokens", "Cost_Per_Token",
    "Accuracy_Deviation", "Hour", "Day_of_Week", "Month", "Quarter", "Year",
]

TEXT_COLUMNS = ["Report_Summary_Text"]


def load_dataset(path: Optional[str] = None, nrows: Optional[int] = None) -> pd.DataFrame:
    """
    Load the enterprise dataset with correct type enforcement.

    Args:
        path: Path to CSV file. If None, uses the default cleaned CSV path.
        nrows: Optional limit on rows to load (for testing/rehearsal).

    Returns:
        pd.DataFrame with enforced dtypes.
    """
    if path is None:
        # Import here to avoid circular dependency
        from backend.config import settings
        path = str(settings.DATA_PATH)

    print(f"[CSV_LOADER] Loading data from {path}...")
    df = pd.read_csv(path, nrows=nrows)

    # ── Enforce datetime types ──
    for col in DATETIME_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")

    # ── Enforce boolean types ──
    for col in BOOLEAN_COLUMNS:
        if col in df.columns:
            # Handle string "True"/"False" and actual bools
            if df[col].dtype == "object":
                df[col] = df[col].map({"True": True, "False": False, True: True, False: False})
            df[col] = df[col].astype(bool)

    # ── Enforce numeric types ──
    for col in MEASURE_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    print(f"[CSV_LOADER] Loaded: {len(df):,} rows x {len(df.columns)} columns")
    return df


def get_schema_summary(df: pd.DataFrame) -> dict:
    """
    Generate a schema summary for the Data Agent's LLM context.

    Returns a dict with column metadata: name, type, unique count,
    null count, min/max for numerics, sample values for categoricals.
    """
    schema = {"total_rows": len(df), "total_columns": len(df.columns), "columns": {}}

    for col in df.columns:
        col_info = {
            "dtype": str(df[col].dtype),
            "null_count": int(df[col].isnull().sum()),
            "null_pct": round(df[col].isnull().sum() / len(df) * 100, 2),
            "unique_count": int(df[col].nunique()),
        }

        # Add numeric stats
        if df[col].dtype in ["int64", "float64", "int32", "float32"]:
            col_info["min"] = round(float(df[col].min()), 4) if not df[col].isnull().all() else None
            col_info["max"] = round(float(df[col].max()), 4) if not df[col].isnull().all() else None
            col_info["mean"] = round(float(df[col].mean()), 4) if not df[col].isnull().all() else None

        # Add categorical samples
        elif df[col].dtype == "object" or df[col].dtype.name == "category":
            top_values = df[col].value_counts().head(5).index.tolist()
            col_info["sample_values"] = top_values

        # Add boolean distribution
        elif df[col].dtype == "bool":
            col_info["true_count"] = int(df[col].sum())
            col_info["false_count"] = int((~df[col]).sum())
            col_info["true_pct"] = round(df[col].sum() / len(df) * 100, 2)

        schema["columns"][col] = col_info

    return schema


def get_schema_for_llm(df: pd.DataFrame) -> str:
    """
    Generate a concise schema description string suitable for LLM prompts.
    Used by the Data Agent to understand the table structure.
    """
    lines = [
        f"Table: enterprise_data ({len(df):,} rows, {len(df.columns)} columns)",
        "",
        "IDENTIFIERS:",
    ]
    for col in IDENTIFIER_COLUMNS:
        if col in df.columns:
            lines.append(f"  - {col} (string, {df[col].nunique()} unique)")

    lines.append("\nDATETIME:")
    for col in DATETIME_COLUMNS:
        if col in df.columns:
            lines.append(f"  - {col} (datetime, range: {df[col].min()} to {df[col].max()})")

    lines.append("\nDIMENSIONS (categorical):")
    for col in DIMENSION_COLUMNS:
        if col in df.columns:
            values = df[col].dropna().unique()
            if len(values) <= 10:
                lines.append(f"  - {col} ({len(values)} values: {sorted(values[:10])})")
            else:
                lines.append(f"  - {col} ({len(values)} unique values)")

    lines.append("\nMEASURES (numeric):")
    for col in MEASURE_COLUMNS:
        if col in df.columns:
            lines.append(
                f"  - {col} (float, range: {df[col].min():.2f} to {df[col].max():.2f}, "
                f"mean: {df[col].mean():.2f})"
            )

    lines.append("\nBOOLEANS:")
    for col in BOOLEAN_COLUMNS:
        if col in df.columns:
            true_pct = df[col].sum() / len(df) * 100
            lines.append(f"  - {col} (bool, {true_pct:.1f}% true)")

    lines.append("\nTEXT:")
    for col in TEXT_COLUMNS:
        if col in df.columns:
            lines.append(f"  - {col} (string, {df[col].nunique()} unique values)")

    return "\n".join(lines)


def get_column_classification() -> dict:
    """
    Load the column classification from the outputs directory.
    Falls back to hardcoded classification if file doesn't exist.
    """
    from backend.config import settings
    class_path = settings.OUTPUTS_PATH / "column_classification.json"

    if class_path.exists():
        with open(class_path, "r") as f:
            return json.load(f)

    # Fallback: hardcoded classification
    return {
        "identifiers": IDENTIFIER_COLUMNS,
        "dimensions": DIMENSION_COLUMNS,
        "measures": MEASURE_COLUMNS,
        "booleans": BOOLEAN_COLUMNS,
        "text": TEXT_COLUMNS,
        "datetime": DATETIME_COLUMNS,
    }


def get_reference_date(df: pd.DataFrame) -> str:
    """
    Get the reference date (max Transaction_Date) for resolving
    relative time phrases like 'last quarter', 'this month'.
    Per Master Plan Section 9.4.
    """
    if "Transaction_Date" in df.columns:
        max_date = df["Transaction_Date"].max()
        return str(max_date.date()) if pd.notna(max_date) else "2025-12-30"
    return "2025-12-30"
