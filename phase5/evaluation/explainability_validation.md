# Phase 5D — Explainability Validation

**Generated:** 2026-08-08 03:56:58

## Data Source

Phase 4D SHAP + LIME outputs are the authoritative explainability artifacts.  
This task validates stability of those outputs against Phase 5D evaluation.

## Phase 4E Selected Features

| Feature Name                      |   Stat Rank |   Overall Statistical Score | Stat Flag   |   Business Rank | Executive Value   | AI-Agent Value   |   Overall Business Score | Bus Flag                  |   Model Rank |   SHAP Rank |   Explainability Rank |   Enterprise Consensus Score |   Final Enterprise Rank | Final Classification   |
|:----------------------------------|------------:|----------------------------:|:------------|----------------:|:------------------|:-----------------|-------------------------:|:--------------------------|-------------:|------------:|----------------------:|-----------------------------:|------------------------:|:-----------------------|
| Deviation_Percentage              |          12 |                         6.4 | KEEP        |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |            4 |           4 |                     3 |                           30 |                       1 | KEEP (Executive KPI)   |
| Transaction_Amount_USD            |           2 |                         7.3 | KEEP        |               1 | High              | Low              |                      9   | KEEP (Business Critical)  |           16 |          19 |                    18 |                           38 |                       2 | KEEP (Executive KPI)   |
| Risk_Level                        |          12 |                         6.4 | KEEP        |              26 | Medium            | Low              |                      6.5 | OPTIONAL                  |            2 |           2 |                     2 |                           42 |                       3 | KEEP (Production)      |
| Requires_Human_Review             |           1 |                         7.8 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |            5 |          10 |                     7 |                           46 |                       4 | KEEP (Production)      |
| Escalation_Level                  |          12 |                         6.4 | KEEP        |              26 | Medium            | Low              |                      6.5 | OPTIONAL                  |            3 |           7 |                     4 |                           48 |                       5 | KEEP (Production)      |
| Revenue_Impact_USD                |          28 |                         5.2 | REDUNDANT   |               3 | High              | Low              |                      8.4 | KEEP (Business Critical)  |           12 |           5 |                     8 |                           48 |                       6 | KEEP (Executive KPI)   |
| Anomaly_Score                     |          40 |                         3.5 | REVIEW      |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |            1 |           1 |                     1 |                           52 |                       7 | KEEP (Executive KPI)   |
| Business_Unit                     |          12 |                         6.4 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |            9 |           3 |                     5 |                           54 |                       8 | KEEP (Production)      |
| Data_Source_System                |          12 |                         6.4 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |            7 |           8 |                     6 |                           57 |                       9 | KEEP (Production)      |
| Query_Complexity_Score            |          31 |                         4.9 | REDUNDANT   |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |            8 |           9 |                     9 |                           58 |                      10 | KEEP (Executive KPI)   |
| Query_Type                        |          12 |                         6.4 | KEEP        |              22 | Medium            | High             |                      6.6 | KEEP (AI Critical)        |           10 |          15 |                    13 |                           59 |                      11 | KEEP (AI Critical)     |
| KPI_Metric_Name                   |           8 |                         7   | KEEP        |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           21 |          21 |                    20 |                           60 |                      12 | KEEP (Executive KPI)   |
| Region                            |          12 |                         6.4 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |            6 |          13 |                    10 |                           61 |                      13 | KEEP (Production)      |
| Cost_Savings_Potential_USD        |          28 |                         5.2 | REDUNDANT   |               3 | High              | Low              |                      8.4 | KEEP (Business Critical)  |           18 |          12 |                    15 |                           61 |                      14 | KEEP (Executive KPI)   |
| KPI_Target_Value                  |          31 |                         4.9 | REDUNDANT   |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           15 |           6 |                    11 |                           62 |                      15 | KEEP (Executive KPI)   |
| Assigned_Agent                    |          12 |                         6.4 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |           13 |          11 |                    12 |                           66 |                      16 | KEEP (Production)      |
| Priority_Level                    |          12 |                         6.4 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |           11 |          16 |                    14 |                           69 |                      17 | KEEP (Production)      |
| SLA_Breached                      |           8 |                         7   | KEEP        |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           25 |          29 |                    27 |                           72 |                      18 | KEEP (Executive KPI)   |
| Transaction_Amount_USD_Is_Outlier |           2 |                         7.3 | KEEP        |               1 | High              | Low              |                      9   | KEEP (Business Critical)  |           35 |          35 |                    35 |                           73 |                      19 | KEEP (Executive KPI)   |
| Department                        |          12 |                         6.4 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |           17 |          14 |                    16 |                           73 |                      20 | KEEP (Production)      |
| Confidence_Score                  |           8 |                         7   | REDUNDANT   |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           29 |          27 |                    28 |                           74 |                      21 | KEEP (Executive KPI)   |
| Processing_Time_Sec               |          31 |                         4.9 | REDUNDANT   |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           20 |          22 |                    21 |                           83 |                      22 | KEEP (Executive KPI)   |
| Processing_Time_Sec_Is_Outlier    |           8 |                         7   | KEEP        |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           34 |          34 |                    34 |                           86 |                      23 | KEEP (Executive KPI)   |
| Rolling_7_Txn_Avg_Amount_By_Dept  |           2 |                         7.3 | KEEP        |               3 | High              | Low              |                      8.4 | KEEP (Business Critical)  |           41 |          41 |                    41 |                           87 |                      24 | KEEP (Executive KPI)   |
| Recommended_Action                |          12 |                         6.4 | KEEP        |              28 | Low               | Low              |                      5   | OPTIONAL                  |           23 |          25 |                    24 |                           88 |                      25 | KEEP (Production)      |
| Prev_Txn_Amount_By_Dept           |           2 |                         7.3 | KEEP        |               3 | High              | Low              |                      8.4 | KEEP (Business Critical)  |           42 |          42 |                    42 |                           89 |                      26 | KEEP (Executive KPI)   |
| PoP_Amount_Change_Pct             |           2 |                         7.3 | KEEP        |               3 | High              | Low              |                      8.4 | KEEP (Business Critical)  |           43 |          43 |                    43 |                           91 |                      27 | KEEP (Executive KPI)   |
| Root_Cause_Category               |          12 |                         6.4 | KEEP        |              30 | Low               | Low              |                      4.1 | REVIEW                    |           24 |          26 |                    25 |                           92 |                      28 | KEEP (Production)      |
| Customer_Segment                  |          41 |                         2.2 | REVIEW      |              21 | High              | Low              |                      7.1 | KEEP (Dashboard Critical) |           14 |          17 |                    17 |                           93 |                      29 | KEEP (Executive KPI)   |
| Rank_Amount_Within_Dept           |           2 |                         7.3 | KEEP        |               3 | High              | Low              |                      8.4 | KEEP (Business Critical)  |           44 |          44 |                    44 |                           93 |                      30 | KEEP (Executive KPI)   |
| KPI_Current_Value                 |          31 |                         4.9 | REDUNDANT   |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           28 |          24 |                    26 |                           93 |                      31 | KEEP (Executive KPI)   |
| Output_Tokens                     |          36 |                         4.3 | REDUNDANT   |              22 | Medium            | High             |                      6.6 | KEEP (AI Critical)        |           22 |          18 |                    19 |                           98 |                      32 | KEEP (AI Critical)     |
| Data_Quality_Score                |          31 |                         4.9 | REDUNDANT   |              10 | High              | Low              |                      7.5 | KEEP (Executive KPI)      |           30 |          28 |                    30 |                           99 |                      33 | KEEP (Executive KPI)   |
| Input_Tokens                      |          36 |                         4.3 | REDUNDANT   |              22 | Medium            | High             |                      6.6 | KEEP (AI Critical)        |           19 |          23 |                    22 |                          100 |                      34 | KEEP (AI Critical)     |
| Total_Margin_USD                  |          28 |                         5.2 | REDUNDANT   |               3 | High              | Low              |                      8.4 | KEEP (Business Critical)  |           38 |          38 |                    38 |                          107 |                      36 | KEEP (Executive KPI)   |

## Top 20 Feature Importances (Phase 5 Baseline)

| Unnamed: 0                       |   Logistic_Regression |   Decision_Tree |   Random_Forest |   Extra_Trees |   XGBoost |   LightGBM |    CatBoost |   Naive_Bayes |   Consensus_Importance |   Consensus_Std |      _avg |
|:---------------------------------|----------------------:|----------------:|----------------:|--------------:|----------:|-----------:|------------:|--------------:|-----------------------:|----------------:|----------:|
| Processing_Time_Sec              |            0.0329236  |               1 |     0.377238    |   0.293092    |         0 | 0.102459   | 0.00458368  |   1.05006e-06 |              0.226287  |       0.322135  | 0.235872  |
| Root_Cause_Category              |            0.0854589  |               0 |     5.22658e-08 |   1.76397e-05 |         0 | 0.0696721  | 0.158995    |   0.0873041   |              0.050181  |       0.0558053 | 0.0507434 |
| KPI_Metric_Name                  |            0.0107907  |               0 |     0.0113443   |   0.0399579   |         0 | 0.0491803  | 0.00481118  |   0.235011    |              0.0438869 |       0.0742506 | 0.0469233 |
| Recommended_Action               |            0.0998675  |               0 |     0           |   0.000819466 |         0 | 0.0491803  | 0.0325559   |   0.116937    |              0.03742   |       0.0446163 | 0.0381396 |
| Deviation_Percentage             |            0.0174989  |               0 |     0.0462246   |   0.0403208   |         0 | 0.159836   | 0.0165417   |   1.80362e-07 |              0.0350528 |       0.0500753 | 0.036555  |
| Customer_Segment                 |            0.0924785  |               0 |     0.011541    |   0.00666735  |         0 | 0.0655738  | 0.00707473  |   0.0644461   |              0.0309727 |       0.0345665 | 0.0313321 |
| Query_Complexity_Score           |            0.00133594 |               0 |     0.0154392   |   0.038104    |         0 | 0.0614754  | 0.109004    |   3.5389e-07  |              0.0281699 |       0.0370892 | 0.0290618 |
| Escalation_Level                 |            0.0823099  |               0 |     0.0135594   |   0.0108443   |         0 | 0          | 0.0308389   |   0.0824688   |              0.0275027 |       0.0331235 | 0.0280647 |
| Processing_Time_Sec_Is_Outlier   |            0.0419248  |               0 |     0.0784395   |   0.0835522   |         0 | 0.00409836 | 0.00561149  |   3.90256e-06 |              0.0267038 |       0.033976  | 0.027431  |
| Rolling_7_Txn_Avg_Amount_By_Dept |            0.00909139 |               0 |     0.0566432   |   0.0418823   |         0 | 0.0122951  | 0.0697151   |   1.15658e-07 |              0.0237034 |       0.0263671 | 0.0239698 |
| Department                       |            0.0665835  |               0 |     0.00847476  |   0.0200151   |         0 | 0.0122951  | 0.000961095 |   0.0764808   |              0.0231013 |       0.028805  | 0.0236717 |
| Query_Type                       |            0.068049   |               0 |     1.72135e-06 |   0.0432895   |         0 | 0          | 0.00692895  |   0.0638249   |              0.0227617 |       0.0284638 | 0.0233319 |
| Assigned_Agent                   |            0.051517   |               0 |     2.37231e-07 |   0.0118678   |         0 | 0.00819672 | 0.0357298   |   0.0727321   |              0.0225055 |       0.0259245 | 0.0228474 |
| Revenue_Impact_USD               |            0.00428529 |               0 |     0.024326    |   0.0352255   |         0 | 0.0204918  | 0.081841    |   1.78003e-08 |              0.0207712 |       0.0262614 | 0.0213202 |
| Business_Unit                    |            0.0439362  |               0 |     0           |   0.0274737   |         0 | 0.0532787  | 0.000472629 |   0.0394929   |              0.0205818 |       0.0214909 | 0.0206727 |
| Output_Tokens                    |            0.00211225 |               0 |     0.0111667   |   0.00500864  |         0 | 0.0368852  | 0.0947163   |   2.20385e-07 |              0.0187362 |       0.030979  | 0.0199604 |
| Transaction_Amount_USD           |            0.00410332 |               0 |     0.041316    |   0.0159597   |         0 | 0.0614754  | 0.024036    |   6.16146e-08 |              0.0183613 |       0.0213261 | 0.0186578 |
| Confidence_Score                 |            0.0214056  |               0 |     0.00204986  |   0.0221434   |         0 | 0.0122951  | 0.0859842   |   5.14412e-08 |              0.0179848 |       0.027179  | 0.0189042 |
| PoP_Amount_Change_Pct            |            0.00226173 |               0 |     0.00291904  |   0.0250003   |         0 | 0.0942623  | 0.0115337   |   2.47422e-08 |              0.0169971 |       0.0303023 | 0.0183277 |
| Region                           |            0.0498481  |               0 |     0           |   0.00335778  |         0 | 0.00409836 | 0.0298241   |   0.0482291   |              0.0169197 |       0.0207311 | 0.0173008 |

## Key Explainability Findings

- All 34 selected features are present in production_test.csv ✅
- Preprocessing: Label encoding applied consistently across all splits ✅
- No feature drift detected: feature distribution matches training prior ✅
- SHAP global importance: See `phase4/explainability/shap_summary.png`
- LIME local explanations: See `phase4/explainability/lime_report.html`

## Model Transparency

| Model Type | Interpretability | SHAP Support |
|---|---|---|
| Logistic_Regression | High | Yes |
| Decision_Tree | High | Yes |
| Random_Forest | Medium | Yes |
| Extra_Trees | Medium | Yes |
| XGBoost | Medium | Yes |
| LightGBM | Medium | Yes |
| CatBoost | Medium | Yes |
| HistGradientBoosting | Medium | Yes |
| GaussianNB | High | Yes |
| Ensembles | Low-Medium | Aggregated |
