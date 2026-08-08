# Phase 5D — Model Inventory

**Generated:** 2026-08-08 03:56:58

## Individual Tuned Models

| Model                | Class                          |   File_KB | Status   |
|:---------------------|:-------------------------------|----------:|:---------|
| Logistic_Regression  | LogisticRegression             |       1.1 | LOADED   |
| Decision_Tree        | DecisionTreeClassifier         |       1.5 | LOADED   |
| Random_Forest        | RandomForestClassifier         |      56.9 | LOADED   |
| Extra_Trees          | ExtraTreesClassifier           |     121.7 | LOADED   |
| XGBoost              | XGBClassifier                  |      77.3 | LOADED   |
| LightGBM             | LGBMClassifier                 |      36.1 | LOADED   |
| CatBoost             | CatBoostClassifier             |      81.3 | LOADED   |
| HistGradientBoosting | HistGradientBoostingClassifier |     121.5 | LOADED   |
| GaussianNB           | GaussianNB                     |       1.8 | LOADED   |

## Ensemble Models

| Model           | Class   |   File_KB | Status                                                                 |
|:----------------|:--------|----------:|:-----------------------------------------------------------------------|
| Hard_Voting     | object  |         0 | FAILED: module '__main__' has no attribute 'HardVotingEnsemble'        |
| Soft_Voting     | object  |         0 | FAILED: module '__main__' has no attribute 'SoftVotingEnsemble'        |
| Weighted_Voting | object  |         0 | FAILED: module '__main__' has no attribute 'WeightedVotingEnsemble'    |
| Stacking        | object  |         0 | FAILED: module '__main__' has no attribute 'StackingEnsemble'          |
| Blending        | object  |         0 | FAILED: module '__main__' has no attribute 'BlendingEnsemble'          |
| Dynamic_Conf    | object  |         0 | FAILED: module '__main__' has no attribute 'DynamicConfidenceEnsemble' |

## Dataset Summary

| Split | Rows | Breaches | Breach Rate |
|---|---|---|---|
| Train | 140,000 | 1 | 0.0007% |
| Validation | 30,000 | 0 | 0.0000% |
| Test | 30,000 | 0 | 0.0000% |
