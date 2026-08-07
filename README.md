# Multi-Agent Data Analyst for Enterprise Decision Support

> **DATASPHERE 26 · Track 06 — Generative AI & Agentic AI**
>
> An intelligent multi-agent system that understands natural language business questions, retrieves and analyzes enterprise AI operations data, generates visualizations, and provides explainable, actionable insights — all without requiring technical expertise from the user.

---

## 🏗️ Architecture

An **8-node LangGraph** state graph orchestrating specialized agents:

```
Question → Orchestrator → [Knowledge/Anomaly/Simulation/Data] → Analysis → Narrative → Validator → [Human Approval] → Response
```

| Node | Role | LLM? |
|---|---|---|
| **Orchestrator** | Intent classification + routing | Yes |
| **Knowledge (RAG)** | Agentic hybrid retrieval (ChromaDB + BM25) | Yes |
| **Data** | NL-to-SQL via DuckDB | Yes |
| **Analysis** | Deterministic metric computation | **No** |
| **Anomaly/Risk** | XGBoost-powered risk scoring | **No** |
| **Simulation** | What-if scenario recomputation | Partial |
| **Narrative** | Plain-English summaries + recommendations | Yes |
| **Validator** | Cross-check numbers, assign confidence | Yes |

**Key principle:** Numbers come from code, never from the LLM. The Narrative node only describes values the Analysis node already computed.

---

## 📂 Project Structure

```
├── backend/                 # Core application
│   ├── agents/              # 7 specialized agent modules
│   ├── db/                  # DuckDB data loader
│   ├── models/              # XGBoost/LightGBM model
│   ├── orchestration/       # LangGraph graph definition
│   ├── semantic/            # RAG system (ChromaDB + BM25)
│   ├── main.py              # FastAPI entry point
│   └── requirements.txt     # Backend dependencies
├── streamlit_app/           # Streamlit chat UI
│   ├── app.py               # Main application
│   └── requirements.txt     # Frontend dependencies
├── data/
│   ├── raw/                 # Original dataset
│   ├── loaders/             # Data loading utilities
│   └── cleaned_*.csv        # Cleaned dataset
├── eval/                    # Golden test suite (23 tests)
├── scripts/                 # Data cleaning, deck generation
├── notebooks/               # EDA notebooks
├── outputs/                 # Model metrics, predictions, reports
├── presentations/           # Pitch decks
├── docs/                    # Planning & architecture docs
└── docker-compose.yml       # Container orchestration
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- [Ollama](https://ollama.ai/) with `gemma3:12b` or `deepseek-r1`
- Groq API key (free tier: [console.groq.com](https://console.groq.com))

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/rohitkumarnaidu/Multi-Agent-Data-Analyst-for-Enterprise-Decision-Support.git
cd Multi-Agent-Data-Analyst-for-Enterprise-Decision-Support

# 2. Create virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# 3. Install dependencies
pip install -r backend/requirements.txt
pip install -r streamlit_app/requirements.txt

# 4. Set up environment variables
copy .env.example .env
# Edit .env with your API keys

# 5. Run data cleaning
python scripts/clean_data.py

# 6. Start the application
streamlit run streamlit_app/app.py
```

### Docker (Alternative)

```bash
docker-compose up --build
```

---

## 📊 Dataset

**Enterprise Multi-Agent Decision Support Log** — 200,000 rows tracking AI agent performance across 7 departments:

- **37 columns** covering agent operations, KPIs, financials, anomalies, and risk
- **7 AI agents**: Finance, ITOps, Marketing, SupplyChain, Sales, HR, CustomerService
- **3 years** of transaction data (2023–2025)
- **Natural label**: `SLA_Breached` (binary) for supervised ML

---

## 🧪 Evaluation

### Model-Level (XGBoost)
Accuracy, Precision, Recall, F1, ROC-AUC on held-out test split.

### Pipeline-Level (Golden Test Suite)
23 questions testing routing accuracy, groundedness, safety, simulation, and memory.
Target: ≥ 21/23 pass rate, 100% on safety tests.

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Orchestration | LangGraph |
| LLM (Cloud) | Groq (Llama 3.1 70B) |
| LLM (Local) | Ollama (Gemma 4 12B / DeepSeek R1) |
| Vector Store | ChromaDB |
| Data Engine | pandas + DuckDB |
| ML Model | XGBoost |
| Live UI | Streamlit + Plotly |
| Dashboard | Power BI Desktop |
| PDF Export | WeasyPrint / ReportLab |

---

## 👥 Team

DATASPHERE 26 — Track 06 Submission

---

## 📄 License

This project was developed for the DATASPHERE 26 Datathon competition.
