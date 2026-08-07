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

## 🔜 Phase 3: LangGraph Multi-Agent Architecture
- Design 8-node specialized agent network.
- Implement intent classification and SQL-to-NL capabilities.
- Integrate RAG (ChromaDB + BM25).

## 🔜 Phase 4: UI / UX & Final Integration
- Build Streamlit application.
- Containerize application (Docker).
- Final end-to-end testing against the 23-test Golden Suite.
