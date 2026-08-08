# 🏛️ Multi-Agent Enterprise Architecture

## 1. High-Level System Design

The architecture is divided into three primary tiers: the React Frontend, the FastAPI Backend, and the LangGraph Multi-Agent Orchestration layer.

```mermaid
flowchart LR
    subgraph Frontend [Presentation Layer - React/TS]
        UI[Enterprise Dashboard]
        Chat[Chat Interface]
        Viz[Data Visualizations]
    end

    subgraph Backend [API Layer - FastAPI]
        Router[API Router]
        Memory[Session Memory]
    end

    subgraph Orchestration [Intelligence Layer - LangGraph]
        Orch[Orchestrator]
        DataAg[Data Agent]
        RAG[Knowledge Agent]
        ML[Anomaly Agent]
        Narrative[Narrative Agent]
    end
    
    subgraph Storage [Data Layer]
        DuckDB[(DuckDB)]
        Chroma[(ChromaDB)]
    end

    UI & Chat & Viz <-->|REST / WebSockets| Router
    Router <--> Memory
    Router <--> Orch
    
    Orch --> DataAg & RAG & ML
    DataAg <--> DuckDB
    RAG <--> Chroma
```

## 2. The Multi-Agent Workflow

Our state machine guarantees that LLMs are used strictly for **reasoning and synthesis**, while hard mathematics and data extraction are handled by **deterministic engines** (DuckDB, Pandas, XGBoost).

```mermaid
sequenceDiagram
    participant User
    participant Orchestrator
    participant DataAgent
    participant MLEngine
    participant Narrative
    participant Validator

    User->>Orchestrator: "Why did IT SLA breaches spike?"
    Orchestrator->>DataAgent: Extract IT SLA breach metrics (SQL)
    DataAgent-->>Orchestrator: Returns 25% spike in Q3
    Orchestrator->>MLEngine: Analyze risk factors for IT breaches
    MLEngine-->>Orchestrator: Identifies high server load as root cause
    Orchestrator->>Narrative: Synthesize findings
    Narrative->>Validator: Draft: "IT SLA breached due to server load (25% spike)."
    Validator-->>Validator: Fact-check metrics against DataAgent output
    Validator->>User: Final verified insights & visualizations
```

## 3. Data & ML Pipeline (Phases 1-2)

The system relies on a strictly defined data engineering pipeline to ensure the ML models and data agents have clean, normalized data before analytics begin.

```mermaid
graph TD
    Raw[Raw CSV Data] --> Dropper[Column Dropper]
    Dropper --> Imputer[SimpleImputer]
    
    Imputer --> Num[Numeric Features]
    Imputer --> Cat[Categorical Features]
    
    Num --> Scaler[RobustScaler]
    Cat --> Encoder[Target/OneHot/Ordinal Encoder]
    
    Scaler --> Clean[Cleaned Matrix]
    Encoder --> Clean
    
    Clean --> Train[XGBoost Training]
    Clean --> DuckDB[DuckDB Analytics Engine]
```

## 4. Key Architectural Principles
- **Zero LLM Math:** All quantitative aggregations occur in DuckDB.
- **Auditability:** Every agent action is logged and tracked in the `Session Memory`.
- **Stateless AI, Stateful Backend:** The agents are stateless functions; context is injected dynamically per turn by the FastAPI backend.
