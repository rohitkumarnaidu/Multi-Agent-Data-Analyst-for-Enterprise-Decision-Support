# Phase 3G: Statistical Insights

## Findings
1. **Normality Assumptions Fail:** Features like `KPI_Current_Value` (Skew: `3.52`, Kurtosis: `13.92`) massively violate Shapiro-Wilk assumptions of normality.
2. **Non-parametric necessity:** Any univariate feature selection must rely on Mann-Whitney U testing rather than T-Tests, as the variance and distribution assumptions do not hold.
3. **Outlier Distributions:** Isolation Forests (5% contamination) isolated highly diverse rows, indicating outliers exist multi-dimensionally rather than purely univariately (e.g. low tokens but extremely high processing time).
4. **Coefficient of Variation (CV):** `Deviation_Percentage` holds a CV of `7422.43`, indicating the standard deviation vastly overwhelms the mean (`0.0015`), proving the variance is extreme and highly unstructured.

## Target Significance
Features like `Requires_Human_Review` are statistically dependent on the target variable based on Mutual Information scoring (`0.0017`), while continuous financial outputs exhibit total statistical independence (`~0.0`) from SLA breaches.
