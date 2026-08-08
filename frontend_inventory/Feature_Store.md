# Data Layer & Enterprise Feature Store Inventory

This document covers the **Enterprise Datasets Hub** (`/workspace/datasets`), **Knowledge Base** (`/workspace/knowledge`), and **Feature Store** (`/workspace/feature-store`).

---

## 1. Enterprise Datasets Catalog ([DatasetsPage.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/pages/DatasetsPage.tsx))

### Primary Datasets Managed:
1. **`enterprise_logistics_transactions`** (200,000 Rows | 24 Columns | Parquet / DuckDB)
   * **Domain**: Supply Chain & Delivery Fulfillment.
   * **Attributes**: `order_id`, `carrier_id`, `distance_km`, `package_weight_kg`, `transit_time_hrs`, `sla_breached`, `weather_severity`, `handling_fee_usd`.
   * **Data Quality Score**: `98.4%` (0.2% nulls in weather metrics).
2. **`customer_order_telemetry`** (1,450,000 Rows | 18 Columns | Parquet)
   * **Domain**: Customer Returns & Order Frequency.
   * **Attributes**: `customer_id`, `order_timestamp`, `order_value_usd`, `return_initiated`, `discount_applied_pct`.
   * **Data Quality Score**: `99.1%`.
3. **`carrier_performance_index`** (4,200 Rows | 12 Columns | DuckDB View)
   * **Domain**: Partner Carrier Benchmarks & Historic SLA Compliance.
   * **Attributes**: `carrier_id`, `carrier_tier`, `on_time_pct`, `cost_per_km`, `active_fleet_count`.

---

## 2. Interactive Data Lineage DAG ([DataLineageCanvas.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/data/DataLineageCanvas.tsx))

Visualizes end-to-end data transformation pipeline using interactive canvas nodes:
* **Raw Ingestion Sources**: S3 Data Lake, PostgreSQL OLTP, Kafka Telemetry Stream.
* **Transformations (dbt & DuckDB)**: Data cleaning, deduplication, schema normalization.
* **Semantic Layer**: Business metric aggregation views.
* **Feature Store Tables**: Materialized offline/online feature tables.
* **Downstream Consumers**: LightGBM Classifier, Multi-Agent Analytics Graph, Executive Reports.

---

## 3. Knowledge Base & Semantic Metric Glossary ([KnowledgePage.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/pages/KnowledgePage.tsx))

### Standardized Enterprise Metric Glossary:
* **`SLA_Breach_Rate`**:
  * **Formula**: `COUNT(CASE WHEN actual_delivery > promised_delivery THEN 1 END) / COUNT(total_orders) * 100`
  * **Owner**: VP of Logistics Operations.
  * **Semantic Category**: Supply Chain & SLA.
* **`Gross_Margin_Leakage`**:
  * **Formula**: `SUM(order_gmv - base_cogs - expedited_freight_cost - compensation_vouchers)`
  * **Owner**: Corporate Financial Controller.
  * **Semantic Category**: Revenue & Profitability.
* **Vector Embeddings Store**:
  * **Collections**: `enterprise_contract_clauses`, `carrier_sla_agreements_v2`.
  * **Embedding Model**: `text-embedding-3-large` (3,072 dimensions).
  * **Total Documents Indexed**: `14,820` semantic chunks.

---

## 4. Feature Store Registry ([FeatureStorePage.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/pages/FeatureStorePage.tsx))

| Feature Name | Entity Key | Data Type | Computation Formula / Source | Update Freq | Drift Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `carrier_historical_breach_rate` | `carrier_id` | `FLOAT64` | `AVG(sla_breached) OVER (PARTITION BY carrier_id ORDER BY timestamp ROWS 500 PRECEDING)` | Hourly | Stable (PSI: 0.02) |
| `route_congestion_index` | `route_id` | `FLOAT32` | `weather_severity * 0.4 + transit_traffic_factor * 0.6` | 15 Minutes | Stable (PSI: 0.04) |
| `order_value_to_weight_ratio` | `order_id` | `FLOAT64` | `order_value_usd / NULLIF(package_weight_kg, 0)` | Real-Time | Stable (PSI: 0.01) |
| `expedited_handling_flag` | `order_id` | `INT8` | `CASE WHEN handling_code IN ('EXP', 'PRIORITY') THEN 1 ELSE 0 END` | Batch | Stable (PSI: 0.00) |
| `driver_experience_years` | `driver_id` | `FLOAT32` | `DATEDIFF('year', hire_date, CURRENT_DATE)` | Daily | Stable (PSI: 0.01) |

---

## 5. Feature Metadata & Governance Controls
* **Feature Versioning**: `v1.0.0` through `v2.1.0` with instant rollback capabilities.
* **Transformation Code Viewer**: In-line syntax-highlighted Python/SQL definition for every feature.
* **Data Drift Alerting**: Continuous Population Stability Index (PSI) monitoring with automated Slack/PagerDuty alerts if PSI exceeds $0.20$.
