# Overall System Architecture
**Generated:** 2026-08-08 05:46:59  
**Role:** Enterprise AI Platform Architecture Team

---

## 1. High-Level Architecture Flow

The system follows a strict, unidirectional flow from user request to response, coordinated by the FastAPI gateway and LangGraph orchestrator.

```mermaid
graph TD
    User([User]) -->|HTTPS/WSS| React[React Frontend]
    React -->|REST / WebSocket| FastAPI[FastAPI Backend Gateway]
    
    FastAPI -->|Invoke| LangGraph[LangGraph Orchestrator]
    
    subgraph Multi-Agent Pipeline
        LangGraph -->|State| Router[Intent Router]
        Router --> Data[Data Agent]
        Router --> Analysis[Analysis Agent]
        Router --> Sim[Simulation Agent]
        Router --> Narrative[Narrative Agent]
        Router --> Report[Report Agent]
        
        Data -.-> DuckDB[(DuckDB)]
        Analysis -.-> ML[Frozen ML Models]
        Narrative -.-> Validator[Validator Agent]
        Report -.-> Validator
    end
    
    LangGraph -->|Search Context| RAG[RAG Layer]
    LangGraph -->|Read/Write State| Memory[Memory Layer]
    
    RAG -.-> ChromaDB[(ChromaDB)]
    Memory -.-> Redis[(Redis / SQLite)]
    
    Validator -->|Validated Output| FastAPI
    FastAPI -->|JSON / Stream| React
```

## 2. Core Architectural Principles
- **Immutability of ML Artifacts:** The backend accesses Phase 1-5 artifacts in read-only mode.
- **Stateful Agents:** LangGraph manages the global state. Agents are stateless functions that operate on and mutate the LangGraph state.
- **Streaming First:** WebSockets allow token-by-token streaming of agent thoughts and RAG context to the UI.
- **Zero-Trust Validation:** The Validator Agent intercepts all outputs destined for the user to prevent hallucinations and check against policies.
