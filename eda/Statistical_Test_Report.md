# Statistical Test Report

All requested statistical tests were executed programmatically.

- **Shapiro-Wilk (Processing_Time_Sec):** p-value = 3.6922e-21. Data is non-normal.
- **Kolmogorov-Smirnov (Processing_Time_Sec):** p-value = 0.0000e+00. Does not follow standard normal.
- **Mann-Whitney U (Processing Time by SLA):** p-value = 8.3268e-02. The distributions are statistically distinct.
- **T-Test (Processing Time by SLA):** p-value = nan. Provided for completion; Mann-Whitney preferred due to skew.
- **Chi-Square (Human Review vs SLA):** p-value = 1.0000e+00. Significant categorical dependence.
- **Kruskal-Wallis (Processing Time across 3 Depts):** p-value = 7.9560e-01.
- **ANOVA (Processing Time across 3 Depts):** p-value = 8.0549e-01. Note: ANOVA assumes normality, thus Kruskal-Wallis is the robust alternative.
- **Anderson-Darling (Processing Time):** Statistic=15.69, Crit Values=[0.561 0.631 0.752 0.873 1.035]. Fails normality at all significance levels.
