# Phase 5D — Evaluation Report

**Generated:** 2026-08-08 03:56:58

## Classification Metrics

| Model                |   Accuracy |   Balanced_Accuracy |   Precision |   Recall |   F1_Score |   F1_Weighted |   ROC_AUC |   PR_AUC |       MCC |   Cohen_Kappa |   Log_Loss |   Brier_Score |   Latency_ms_per_sample |
|:---------------------|-----------:|--------------------:|------------:|---------:|-----------:|--------------:|----------:|---------:|----------:|--------------:|-----------:|--------------:|------------------------:|
| Logistic_Regression  |   0.012479 |            0.506236 |       7e-06 |        1 |    1.4e-05 |      0.024636 |  0.509332 |  7e-06   |  0.0003   |       0       |  35.4902   |      0.987414 |                  0.0008 |
| Decision_Tree        |   0.781486 |            0.390746 |       0     |        0 |    0       |      0.877335 |  0.390746 |  7e-06   | -0.001413 |      -1.4e-05 |   7.87605  |      0.218514 |                  0.0022 |
| Random_Forest        |   0.999993 |            0.5      |       0     |        0 |    0       |      0.999989 |  0.660105 |  1.3e-05 |  0        |       0       |   0.034581 |      0.001361 |                  0.0094 |
| Extra_Trees          |   0.999993 |            0.5      |       0     |        0 |    0       |      0.999989 |  0.556733 |  1.1e-05 |  0        |       0       |   0.027242 |      0.002013 |                  0.0101 |
| XGBoost              |   0.999993 |            0.5      |       0     |        0 |    0       |      0.999989 |  0.5      |  7e-06   |  0        |       0       |   9.2e-05  |      7e-06    |                  0.0033 |
| LightGBM             |   0.999993 |            0.5      |       0     |        0 |    0       |      0.999989 |  0.697334 |  1.9e-05 |  0        |       0       |   0.000156 |      7e-06    |                  0.005  |
| CatBoost             |   0.999993 |            0.5      |       0     |        0 |    0       |      0.999989 |  0.550333 |  1.6e-05 |  0        |       0       |   0.008208 |      0.000112 |                  0.0049 |
| HistGradientBoosting |   0.999993 |            0.5      |       0     |        0 |    0       |      0.999989 |  0.36782  |  7e-06   |  0        |       0       |   0.008779 |      0.000142 |                  0.0186 |
| GaussianNB           |   0.999993 |            0.5      |       0     |        0 |    0       |      0.999989 |  0.5      |  7e-06   |  0        |       0       |   0.000257 |      7e-06    |                  0.0017 |

## Leaderboard

|   Rank | Model                |   Composite_Score | Role      |
|-------:|:---------------------|------------------:|:----------|
|      1 | XGBoost              |            0.8464 | CHAMPION  |
|      2 | LightGBM             |            0.8336 | RUNNER-UP |
|      3 | CatBoost             |            0.818  | BACKUP    |
|      4 | GaussianNB           |            0.8045 |           |
|      5 | HistGradientBoosting |            0.7818 |           |
|      6 | Extra_Trees          |            0.7575 |           |
|      7 | Random_Forest        |            0.754  |           |
|      8 | Logistic_Regression  |            0.6    |           |
|      9 | Decision_Tree        |            0.4072 |           |

## Stability

| Model                |   Acc_Mean |   Acc_Std | Stability   |
|:---------------------|-----------:|----------:|:------------|
| Logistic_Regression  |   0.012497 |  0.00028  | HIGH        |
| Decision_Tree        |   0.781504 |  0.001152 | HIGH        |
| Random_Forest        |   0.999994 |  6e-06    | HIGH        |
| Extra_Trees          |   0.999994 |  6e-06    | HIGH        |
| XGBoost              |   0.999994 |  6e-06    | HIGH        |
| LightGBM             |   0.999994 |  6e-06    | HIGH        |
| CatBoost             |   0.999994 |  6e-06    | HIGH        |
| HistGradientBoosting |   0.999994 |  6e-06    | HIGH        |
| GaussianNB           |   0.999994 |  6e-06    | HIGH        |

## Business KPIs

| Model                |   SLA_Detection_Rate_Pct |   Cost_Savings_vs_Baseline_USD |   ROI_vs_Baseline_Pct |
|:---------------------|-------------------------:|-------------------------------:|----------------------:|
| Logistic_Regression  |                      100 |                          87350 |                  1.25 |
| Decision_Tree        |                        0 |                        5469950 |                 78.14 |
| Random_Forest        |                        0 |                        6999500 |                 99.99 |
| Extra_Trees          |                        0 |                        6999500 |                 99.99 |
| XGBoost              |                        0 |                        6999500 |                 99.99 |
| LightGBM             |                        0 |                        6999500 |                 99.99 |
| CatBoost             |                        0 |                        6999500 |                 99.99 |
| HistGradientBoosting |                        0 |                        6999500 |                 99.99 |
| GaussianNB           |                        0 |                        6999500 |                 99.99 |
