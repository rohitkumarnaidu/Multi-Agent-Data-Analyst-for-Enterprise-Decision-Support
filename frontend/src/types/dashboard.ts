// Dashboard KPI and Chart Types

export interface DashboardKPIs {
  total_revenue: number;
  avg_revenue: number;
  total_transactions: number;
  total_savings: number;
  sla_breach_rate: number;
  anomaly_rate: number;
  risk_distribution: Array<{ Risk_Level: string; count: number }>;
  department_count: number;
  quarterly_revenue: Array<{ Quarter: string; revenue: number }>;
  forecast_accuracy: number;
}

export interface DashboardAlert {
  type: 'sla' | 'anomaly' | 'risk' | 'approval' | 'fraud';
  title: string;
  count: number;
  severity: 'critical' | 'warning' | 'info';
  department?: string;
}

export interface DashboardAlerts {
  sla_violations: number;
  anomalies_detected: number;
  high_risk_count: number;
  pending_approvals: number;
  top_risk_departments: Array<{ Department: string; count: number }>;
  alerts: DashboardAlert[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardCharts {
  revenue_by_quarter: Array<{ Quarter: string; revenue: number }>;
  department_performance: Array<{ Department: string; revenue: number; savings: number }>;
  risk_heatmap: Array<{ Department: string; Risk_Level: string; count: number }>;
  customer_segments: Array<{ Customer_Segment: string; count: number }>;
  anomaly_trend: Array<{ Quarter: string; anomaly_rate: number }>;
  top_regions: Array<{ Region: string; revenue: number }>;
  sla_by_department: Array<{ Department: string; breach_rate: number }>;
  decision_outcomes: Array<{ Decision_Outcome: string; count: number }>;
}
