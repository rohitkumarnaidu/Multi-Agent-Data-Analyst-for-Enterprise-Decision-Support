"""
Dashboard KPIs API — Enterprise Decision Support Platform
==========================================================
Serves business KPIs, alerts, and pre-computed chart data
from the enterprise_data DuckDB table.
"""
from fastapi import APIRouter
from agents.data_agent import data_agent
import structlog
import pandas as pd
import numpy as np

logger = structlog.get_logger("enterprise_backend.api.dashboard")
router = APIRouter()


def _safe_float(df, col, default=0.0):
    try:
        return round(float(df.iloc[0][col]), 2) if not df.empty else default
    except Exception:
        return default


def _safe_int(df, col, default=0):
    try:
        return int(df.iloc[0][col]) if not df.empty else default
    except Exception:
        return default


@router.get("/dashboard/kpis")
async def get_dashboard_kpis():
    """Compute business KPIs from enterprise_data."""
    try:
        engine = data_agent.engine
        rev = engine.execute_query(
            "SELECT SUM(Revenue_Impact_USD) as total_revenue, "
            "AVG(Revenue_Impact_USD) as avg_revenue, "
            "COUNT(*) as total_transactions FROM enterprise_data"
        )
        savings = engine.execute_query(
            "SELECT SUM(Cost_Savings_Potential_USD) as total_savings "
            "FROM enterprise_data WHERE Decision_Outcome='Auto-Resolved'"
        )
        sla = engine.execute_query(
            "SELECT AVG(CAST(SLA_Breached AS INT))*100 as sla_breach_rate FROM enterprise_data"
        )
        anomaly = engine.execute_query(
            "SELECT AVG(CAST(Anomaly_Detected AS INT))*100 as anomaly_rate FROM enterprise_data"
        )
        risk = engine.execute_query(
            "SELECT Risk_Level, COUNT(*) as count FROM enterprise_data GROUP BY Risk_Level ORDER BY count DESC"
        )
        depts = engine.execute_query(
            "SELECT COUNT(DISTINCT Department) as dept_count FROM enterprise_data"
        )
        growth = engine.execute_query(
            "SELECT Quarter, SUM(Revenue_Impact_USD) as revenue FROM enterprise_data GROUP BY Quarter ORDER BY Quarter"
        )
        conf = engine.execute_query(
            "SELECT AVG(Confidence_Score)*100 as avg_confidence FROM enterprise_data"
        )
        txn_amt = engine.execute_query(
            "SELECT SUM(Transaction_Amount_USD) as total_spend, AVG(Transaction_Amount_USD) as avg_spend FROM enterprise_data"
        )
        agents_count = engine.execute_query(
            "SELECT COUNT(DISTINCT Assigned_Agent) as agent_count FROM enterprise_data"
        )

        return {
            "total_revenue": _safe_float(rev, "total_revenue"),
            "avg_revenue": _safe_float(rev, "avg_revenue"),
            "total_transactions": _safe_int(rev, "total_transactions"),
            "total_savings": _safe_float(savings, "total_savings"),
            "total_spend": _safe_float(txn_amt, "total_spend"),
            "avg_spend": _safe_float(txn_amt, "avg_spend"),
            "sla_breach_rate": _safe_float(sla, "sla_breach_rate"),
            "anomaly_rate": _safe_float(anomaly, "anomaly_rate"),
            "risk_distribution": risk.replace({np.nan: None, pd.NA: None}).to_dict(orient="records") if not risk.empty else [],
            "department_count": _safe_int(depts, "dept_count"),
            "agent_count": _safe_int(agents_count, "agent_count"),
            "quarterly_revenue": growth.replace({np.nan: None, pd.NA: None}).to_dict(orient="records") if not growth.empty else [],
            "forecast_accuracy": _safe_float(conf, "avg_confidence"),
        }
    except Exception as e:
        logger.error("Failed to compute KPIs", error=str(e))
        return {"error": str(e)}


@router.get("/dashboard/alerts")
async def get_dashboard_alerts():
    """Return business alerts from enterprise_data."""
    try:
        engine = data_agent.engine
        sla = engine.execute_query(
            "SELECT COUNT(*) as cnt FROM enterprise_data WHERE SLA_Breached = true"
        )
        anomalies = engine.execute_query(
            "SELECT COUNT(*) as cnt FROM enterprise_data WHERE Anomaly_Detected = true"
        )
        high_risk = engine.execute_query(
            "SELECT COUNT(*) as cnt FROM enterprise_data WHERE Risk_Level = 'High'"
        )
        pending = engine.execute_query(
            "SELECT COUNT(*) as cnt FROM enterprise_data WHERE Requires_Human_Review = true"
        )
        top_risk_depts = engine.execute_query(
            "SELECT Department, COUNT(*) as count FROM enterprise_data "
            "WHERE Risk_Level = 'High' GROUP BY Department ORDER BY count DESC LIMIT 5"
        )

        alerts = []
        sla_count = _safe_int(sla, "cnt")
        if sla_count > 0:
            alerts.append({"type": "sla", "title": "SLA Violations Detected", "count": sla_count, "severity": "critical"})
        anomaly_count = _safe_int(anomalies, "cnt")
        if anomaly_count > 0:
            alerts.append({"type": "anomaly", "title": "Anomalies Detected", "count": anomaly_count, "severity": "warning"})
        risk_count = _safe_int(high_risk, "cnt")
        if risk_count > 0:
            alerts.append({"type": "risk", "title": "High Risk Transactions", "count": risk_count, "severity": "critical"})
        approval_count = _safe_int(pending, "cnt")
        if approval_count > 0:
            alerts.append({"type": "approval", "title": "Pending Human Approvals", "count": approval_count, "severity": "info"})

        return {
            "sla_violations": sla_count,
            "anomalies_detected": anomaly_count,
            "high_risk_count": risk_count,
            "pending_approvals": approval_count,
            "top_risk_departments": top_risk_depts.replace({np.nan: None, pd.NA: None}).to_dict(orient="records") if not top_risk_depts.empty else [],
            "alerts": alerts,
        }
    except Exception as e:
        logger.error("Failed to compute alerts", error=str(e))
        return {"error": str(e)}


@router.get("/dashboard/charts")
async def get_dashboard_charts():
    """Return pre-computed chart data for the executive dashboard."""
    try:
        engine = data_agent.engine
        rev_quarter = engine.execute_query(
            "SELECT Quarter, SUM(Revenue_Impact_USD) as revenue FROM enterprise_data GROUP BY Quarter ORDER BY Quarter"
        )
        dept_perf = engine.execute_query(
            "SELECT Department, SUM(Revenue_Impact_USD) as revenue, SUM(Cost_Savings_Potential_USD) as savings "
            "FROM enterprise_data GROUP BY Department ORDER BY revenue DESC"
        )
        risk_heat = engine.execute_query(
            "SELECT Department, Risk_Level, COUNT(*) as count "
            "FROM enterprise_data GROUP BY Department, Risk_Level ORDER BY Department, Risk_Level"
        )
        cust_seg = engine.execute_query(
            "SELECT Customer_Segment, COUNT(*) as count FROM enterprise_data "
            "WHERE Customer_Segment IS NOT NULL GROUP BY Customer_Segment ORDER BY count DESC"
        )
        anomaly_trend = engine.execute_query(
            "SELECT Quarter, AVG(CAST(Anomaly_Detected AS INT))*100 as anomaly_rate "
            "FROM enterprise_data GROUP BY Quarter ORDER BY Quarter"
        )
        top_regions = engine.execute_query(
            "SELECT Region, SUM(Revenue_Impact_USD) as revenue FROM enterprise_data "
            "WHERE Region IS NOT NULL GROUP BY Region ORDER BY revenue DESC"
        )
        sla_dept = engine.execute_query(
            "SELECT Department, AVG(CAST(SLA_Breached AS INT))*100 as breach_rate "
            "FROM enterprise_data GROUP BY Department ORDER BY breach_rate DESC"
        )
        decisions = engine.execute_query(
            "SELECT Decision_Outcome, COUNT(*) as count FROM enterprise_data "
            "GROUP BY Decision_Outcome ORDER BY count DESC"
        )

        def to_records(df):
            return df.replace({np.nan: None, pd.NA: None}).to_dict(orient="records") if not df.empty else []

        return {
            "revenue_by_quarter": to_records(rev_quarter),
            "department_performance": to_records(dept_perf),
            "risk_heatmap": to_records(risk_heat),
            "customer_segments": to_records(cust_seg),
            "anomaly_trend": to_records(anomaly_trend),
            "top_regions": to_records(top_regions),
            "sla_by_department": to_records(sla_dept),
            "decision_outcomes": to_records(decisions),
        }
    except Exception as e:
        logger.error("Failed to compute chart data", error=str(e))
        return {"error": str(e)}
