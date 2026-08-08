"""
Data Explorer API — Enterprise Decision Support Platform
=========================================================
Provides data schema introspection, preview, statistics,
ad-hoc SQL execution, and data quality metrics.
"""
import re
import time
import json
import os
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from agents.data_agent import data_agent
import pandas as pd
import numpy as np
import structlog

logger = structlog.get_logger("enterprise_backend.api.data_explorer")
router = APIRouter()


@router.get("/schema")
async def get_data_schema():
    """Return column definitions for enterprise_data."""
    try:
        schema_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "schema_report.json")
        schema_path = os.path.normpath(schema_path)
        if os.path.exists(schema_path):
            with open(schema_path, "r") as f:
                return json.load(f)

        # Fallback: query DuckDB directly
        engine = data_agent.engine
        desc = engine.execute_query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='enterprise_data'")
        return desc.to_dict(orient="records") if not desc.empty else []
    except Exception as e:
        logger.error("Schema fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preview")
async def get_data_preview(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    """Return paginated rows from enterprise_data."""
    try:
        engine = data_agent.engine
        total_df = engine.execute_query("SELECT COUNT(*) as total FROM enterprise_data")
        total_rows = int(total_df.iloc[0]["total"]) if not total_df.empty else 0

        df = engine.execute_query(f"SELECT * FROM enterprise_data LIMIT {limit} OFFSET {offset}")
        return {
            "columns": df.columns.tolist() if not df.empty else [],
            "rows": df.replace({np.nan: None, pd.NA: None}).to_dict(orient="records") if not df.empty else [],
            "total_rows": total_rows,
            "page": offset // limit + 1,
            "page_size": limit,
        }
    except Exception as e:
        logger.error("Preview fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics")
async def get_data_statistics():
    """Return per-column statistics."""
    try:
        engine = data_agent.engine
        df = engine.execute_query("SELECT * FROM enterprise_data LIMIT 10000")
        if df.empty:
            return []

        stats = []
        for col in df.columns:
            col_data = df[col]
            entry = {
                "column_name": col,
                "type": str(col_data.dtype),
                "count": int(col_data.count()),
                "null_count": int(col_data.isna().sum()),
                "null_pct": round(float(col_data.isna().mean()) * 100, 2),
                "unique_count": int(col_data.nunique()),
            }
            if col_data.dtype in ("float64", "int64"):
                def _safe_stat(val):
                    f = float(val)
                    return round(f, 4) if not np.isnan(f) else None
                entry["mean"] = _safe_stat(col_data.mean()) if col_data.count() > 0 else None
                entry["median"] = _safe_stat(col_data.median()) if col_data.count() > 0 else None
                entry["min"] = _safe_stat(col_data.min()) if col_data.count() > 0 else None
                entry["max"] = _safe_stat(col_data.max()) if col_data.count() > 0 else None
                entry["std"] = _safe_stat(col_data.std()) if col_data.count() > 1 else None
            else:
                vc = col_data.value_counts().head(5)
                entry["top_values"] = [{"value": str(k), "count": int(v)} for k, v in vc.items()]
            stats.append(entry)
        return stats
    except Exception as e:
        logger.error("Statistics fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


class SQLQueryRequest(BaseModel):
    sql: str


@router.post("/query")
async def execute_sql_query(request: SQLQueryRequest):
    """Execute a read-only SQL query against DuckDB."""
    sql = request.sql.strip()

    # Security: reject non-SELECT queries
    forbidden = re.compile(r"\b(DROP|INSERT|DELETE|UPDATE|ALTER|CREATE|TRUNCATE|GRANT|REVOKE)\b", re.IGNORECASE)
    if forbidden.search(sql):
        raise HTTPException(status_code=400, detail="Only SELECT queries are allowed.")

    if not sql.upper().startswith(("SELECT", "WITH")):
        raise HTTPException(status_code=400, detail="Query must start with SELECT or WITH.")

    try:
        engine = data_agent.engine
        start = time.time()
        df = engine.execute_query(sql)
        elapsed = round((time.time() - start) * 1000, 2)
        return {
            "columns": df.columns.tolist() if not df.empty else [],
            "rows": df.head(500).replace({np.nan: None, pd.NA: None}).to_dict(orient="records") if not df.empty else [],
            "row_count": len(df),
            "execution_time_ms": elapsed,
            "sql": sql,
        }
    except Exception as e:
        logger.error("Query execution failed", error=str(e), sql=sql)
        raise HTTPException(status_code=400, detail=f"Query error: {str(e)}")


@router.get("/quality")
async def get_data_quality():
    """Return data quality metrics."""
    try:
        engine = data_agent.engine
        total_df = engine.execute_query("SELECT COUNT(*) as total FROM enterprise_data")
        total_rows = int(total_df.iloc[0]["total"]) if not total_df.empty else 0

        df = engine.execute_query("SELECT * FROM enterprise_data LIMIT 10000")
        if df.empty:
            return {"total_rows": 0, "total_columns": 0, "duplicate_count": 0, "completeness_pct": 0, "columns": []}

        total_cols = len(df.columns)
        dup_count = int(df.duplicated().sum())
        completeness = round(float(1 - df.isna().mean().mean()) * 100, 2)

        col_quality = []
        for col in df.columns:
            missing_pct = round(float(df[col].isna().mean()) * 100, 2)
            outlier_count = 0
            if df[col].dtype in ("float64", "int64") and df[col].count() > 10:
                q1 = df[col].quantile(0.25)
                q3 = df[col].quantile(0.75)
                iqr = q3 - q1
                outlier_count = int(((df[col] < q1 - 1.5 * iqr) | (df[col] > q3 + 1.5 * iqr)).sum())
            quality_score = round(100 - missing_pct - min(outlier_count / max(len(df), 1) * 100, 20), 2)
            col_quality.append({
                "column_name": col,
                "missing_pct": missing_pct,
                "outlier_count": outlier_count,
                "quality_score": max(quality_score, 0),
            })

        return {
            "total_rows": total_rows,
            "total_columns": total_cols,
            "duplicate_count": dup_count,
            "completeness_pct": completeness,
            "columns": col_quality,
        }
    except Exception as e:
        logger.error("Quality fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))
