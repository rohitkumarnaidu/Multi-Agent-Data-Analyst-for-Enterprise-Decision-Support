# Project Roadmap

## ✅ Phase 1: Data Preparation & Preprocessing (Completed)
- Clean the initial 200,000-row enterprise operations dataset.
- Perform Zero-Trust Enterprise Data Audits.
- Eradicate leakage, multicollinearity, and inference vulnerabilities.
- Export production-ready scikit-learn `Pipeline`.

## ⏳ Phase 2: Feature Engineering & Model Training (Next)
- Train base XGBoost and LightGBM models on `train.csv`.
- Implement hyperparameter tuning.
- Evaluate on `validation.csv` and `test.csv`.
- Export champion `.joblib` model for inference.

## ✅ Phase 3: Exploratory Data Analysis (Completed)
- Rendered exhaustive visualizations (Histograms, Pairplots, Boxplots) via Pandas/Seaborn.
- Programmatically computed non-parametric tests (Kruskal-Wallis, Mann-Whitney).
- Extracted business insights through Mutual Information scoring and Temporal Aggregation.
- Generated comprehensive Verification Audit documentation suite.

### PHASE 4: ENTERPRISE FEATURE SELECTION [COMPLETED]
- [x] Phase 4A: Statistical Feature Selection (Variance, Correlation, Information Theory, ANOVA, VIF).
- [x] Phase 4B: Business Feature Selection (Domain Logic, Executive Needs, Dashboards, AI Agents).
- [x] Phase 4C: Model-Based Feature Selection (Wrapper Methods, Intrinsic Importance).
- [x] Phase 4D: Explainability Validation (SHAP, LIME).
- [x] Phase 4E: Final Enterprise Feature Set Aggregation.

### PHASE 5: MODEL TRAINING & HYPERPARAMETER TUNING [ACTIVE]
- Implement intent classification and SQL-to-NL capabilities.
- Integrate RAG (ChromaDB + BM25).

## 🔜 Phase 5: UI / UX & Final Integration
- Build Streamlit application.
- Containerize application (Docker).
- Final end-to-end testing against the 23-test Golden Suite.
