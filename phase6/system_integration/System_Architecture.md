# System Architecture Version 1.0

## High-Level Architecture
Dataphere 26 operates on a decoupled, microservices-oriented architecture designed for scale, resilience, and rapid AI capabilities.

### 1. Presentation Layer (Frontend)
* **Framework**: React 18, TypeScript, Vite
* **State Management**: Zustand
* **Routing**: React Router v6
* **Styling**: Tailwind CSS + Shadcn UI
* **Features**: Role-based routing, real-time SSE chart rendering, robust form handling.

### 2. Application/API Layer (Backend)
* **Framework**: FastAPI (Python 3.11)
* **Agentic Framework**: LangGraph + LangChain
* **Concurrency**: Asyncio + Uvicorn
* **Responsibilities**: Authentication, session handling, LLM orchestration, model serving.

### 3. Data & ML Layer
* **Vector Store**: ChromaDB (Hybrid search via Embeddings + BM25)
* **Relational Store**: PostgreSQL (Users, Sessions, Audit logs)
* **Cache/Message Broker**: Redis (Rate limiting, Session caching)
* **Machine Learning**: CatBoost / Scikit-Learn (Anomaly Detection, Forecasting)

### 4. Infrastructure & Deployment
* **Containerization**: Docker & Docker Compose
* **Orchestration**: Kubernetes ready (Helm charts included in Phase 5)
* **CI/CD**: GitHub Actions (Lint, Test, Build, Push)
