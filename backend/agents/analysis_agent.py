"""
Analysis Agent — Multi-Agent Data Analyst
==========================================
Deterministic computational core. Computes statistical metrics, aggregations,
rankings, percentage distributions, and generates Plotly-compatible Chart Specifications.

Per Master Plan Section 5.3 & ADR Rule:
  - ZERO LLM calls (Pure Python, Pandas, NumPy)
  - All numbers in the system originate from this node
  - Generates InsightSkeleton + ChartSpec
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, List, Tuple
from pydantic import BaseModel, Field

from backend.api_contract import ChartSpec


class MetricSummary(BaseModel):
    """Structured summary of a numeric measure."""
    metric_name: str
    mean: float
    sum: float
    min: float
    max: float
    median: float
    count: int


class InsightSkeleton(BaseModel):
    """
    Deterministic container for all numbers and facts computed from the data.
    The Narrative Agent is strictly forbidden from stating numbers not in this skeleton.
    """
    total_records: int
    primary_metric: str
    primary_value: float
    top_entity: Optional[str] = None
    top_entity_value: Optional[float] = None
    bottom_entity: Optional[str] = None
    bottom_entity_value: Optional[float] = None
    breakdown: Dict[str, float] = Field(default_factory=dict)
    summary_stats: Dict[str, MetricSummary] = Field(default_factory=dict)
    time_trend: Optional[str] = None  # "increasing", "decreasing", "stable"
    key_findings: List[str] = Field(default_factory=list)


class AnalysisAgent:
    """
    Executes pure deterministic analysis on query result DataFrames.
    """

    def analyze(self, df: pd.DataFrame, question: str, sql_used: str) -> Tuple[InsightSkeleton, Optional[ChartSpec]]:
        """
        Main analysis entry point.
        """
        if df.empty:
            return InsightSkeleton(
                total_records=0,
                primary_metric="None",
                primary_value=0.0,
                key_findings=["No records matched the specified query criteria."]
            ), None

        num_records = len(df)
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()

        # ── 1. Calculate Summary Statistics ──
        summary_stats = {}
        for col in numeric_cols:
            summary_stats[col] = MetricSummary(
                metric_name=col,
                mean=round(float(df[col].mean()), 4),
                sum=round(float(df[col].sum()), 4),
                min=round(float(df[col].min()), 4),
                max=round(float(df[col].max()), 4),
                median=round(float(df[col].median()), 4),
                count=int(df[col].count())
            )

        # ── 2. Determine Primary Dimension & Primary Metric ──
        primary_dim = categorical_cols[0] if categorical_cols else None
        primary_metric = numeric_cols[0] if numeric_cols else "record_count"

        # ── 3. Build Breakdown & Key Findings ──
        breakdown = {}
        top_entity = None
        top_val = None
        bottom_entity = None
        bottom_val = None
        findings = []

        if primary_dim and primary_metric and primary_metric in df.columns:
            sorted_df = df.sort_values(by=primary_metric, ascending=False)
            for _, row in sorted_df.iterrows():
                dim_label = str(row[primary_dim])
                val = round(float(row[primary_metric]), 4)
                breakdown[dim_label] = val

            top_row = sorted_df.iloc[0]
            top_entity = str(top_row[primary_dim])
            top_val = round(float(top_row[primary_metric]), 4)

            bottom_row = sorted_df.iloc[-1]
            bottom_entity = str(bottom_row[primary_dim])
            bottom_val = round(float(bottom_row[primary_metric]), 4)

            findings.append(f"{primary_metric} peaked at {top_val:,.2f} for '{top_entity}'.")
            if num_records > 1:
                findings.append(f"Lowest {primary_metric} was {bottom_val:,.2f} for '{bottom_entity}'.")
                spread = top_val - bottom_val
                findings.append(f"Spread between top and bottom is {spread:,.2f}.")
        elif numeric_cols:
            val = round(float(df[numeric_cols[0]].iloc[0]), 4)
            findings.append(f"{numeric_cols[0]} value: {val:,.2f}")

        # Primary value
        primary_val = top_val if top_val is not None else (summary_stats[primary_metric].mean if primary_metric in summary_stats else float(num_records))

        # Check for temporal trend
        trend = None
        if any(t_col in [c.lower() for c in df.columns] for t_col in ["quarter", "month", "year", "date"]):
            if primary_metric in df.columns and len(df) >= 3:
                vals = df[primary_metric].values
                if vals[-1] > vals[0] * 1.05:
                    trend = "increasing"
                elif vals[-1] < vals[0] * 0.95:
                    trend = "decreasing"
                else:
                    trend = "stable"
                findings.append(f"Observed trend is {trend} over the tracked timeframe.")

        skeleton = InsightSkeleton(
            total_records=num_records,
            primary_metric=primary_metric,
            primary_value=primary_val,
            top_entity=top_entity,
            top_entity_value=top_val,
            bottom_entity=bottom_entity,
            bottom_entity_value=bottom_val,
            breakdown=breakdown,
            summary_stats=summary_stats,
            time_trend=trend,
            key_findings=findings
        )

        # ── 4. Generate Plotly-Compatible Chart Specification ──
        chart_spec = self._generate_chart_spec(df, primary_dim, primary_metric, question)

        return skeleton, chart_spec

    def _generate_chart_spec(self, df: pd.DataFrame, dim: Optional[str], metric: Optional[str], question: str) -> Optional[ChartSpec]:
        """
        Builds declarative Plotly-compatible chart specification.
        """
        if df.empty or len(df) == 1:
            return None

        # Detect Time Series
        is_time_series = any(c.lower() in ["quarter", "month", "year", "transaction_date", "date"] for c in df.columns)

        if is_time_series and metric:
            time_col = [c for c in df.columns if c.lower() in ["quarter", "month", "year", "transaction_date", "date"]][0]
            sorted_df = df.sort_values(by=time_col)
            return ChartSpec(
                chart_type="line",
                title=f"{metric.replace('_', ' ').title()} Over Time",
                data={
                    "x": sorted_df[time_col].astype(str).tolist(),
                    "y": [round(float(v), 2) for v in sorted_df[metric]],
                    "type": "scatter",
                    "mode": "lines+markers",
                    "name": metric
                },
                layout={"xaxis": {"title": time_col}, "yaxis": {"title": metric.replace('_', ' ').title()}}
            )

        # Categorical Comparison (Bar Chart)
        if dim and metric:
            sorted_df = df.sort_values(by=metric, ascending=False).head(12)
            
            # Use Pie chart if <= 5 categories and metric represents a total or share
            if len(sorted_df) <= 5 and any(term in metric.lower() for term in ["count", "sum", "total", "volume", "share"]):
                return ChartSpec(
                    chart_type="pie",
                    title=f"Distribution of {metric.replace('_', ' ').title()} by {dim}",
                    data={
                        "labels": sorted_df[dim].astype(str).tolist(),
                        "values": [round(float(v), 2) for v in sorted_df[metric]],
                        "type": "pie",
                        "hole": 0.4
                    },
                    layout={"showlegend": True}
                )

            return ChartSpec(
                chart_type="bar",
                title=f"{metric.replace('_', ' ').title()} by {dim}",
                data={
                    "x": sorted_df[dim].astype(str).tolist(),
                    "y": [round(float(v), 2) for v in sorted_df[metric]],
                    "type": "bar",
                    "marker": {"color": "#2563eb"}
                },
                layout={"xaxis": {"title": dim}, "yaxis": {"title": metric.replace('_', ' ').title()}}
            )

        # Fallback table view
        return ChartSpec(
            chart_type="table",
            title="Query Result Details",
            data={
                "headers": df.columns.tolist(),
                "rows": df.head(15).values.tolist()
            }
        )


# Singleton instance
analysis_agent = AnalysisAgent()
