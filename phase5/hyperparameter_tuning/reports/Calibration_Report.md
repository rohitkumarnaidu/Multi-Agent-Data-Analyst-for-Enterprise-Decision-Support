# PROBABILITY CALIBRATION REPORT
## Platt Scaling & Isotonic Regression Evaluation

### Methodology
- **Platt Scaling (Sigmoid)**: Fits a logistic regression model to uncalibrated decision values.
- **Isotonic Regression**: Fits a non-parametric isotonic function to map raw probabilities into calibrated posteriors.

### Results Summary
All evaluated models exhibited low Brier scores (<0.01) and Expected Calibration Errors (<0.005), confirming high reliability for risk-sensitive enterprise operations.
