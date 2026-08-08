# Multi-Agent Architecture
**Generated:** 2026-08-08 05:46:59  

---

## 1. LangGraph State Schema
```python
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    intent: str
    sql_query: Optional[str]
    query_results: Optional[list[dict]]
    ml_predictions: Optional[dict]
    rag_context: Optional[list[Document]]
    draft_response: Optional[str]
    validation_status: str
    errors: list[str]
```

## 2. Agent Node Definitions

| Agent | Responsibility | Inputs | Outputs | Failure Handling |
|---|---|---|---|---|
| **Intent Router** | Classifies user intent (Data, ML, RAG, Chat) | User Message | `intent` | Fallback to RAG/Chat |
| **Data Agent** | Generates DuckDB SQL queries | `messages`, `schema` | `sql_query`, `query_results` | Retry up to 3x on SQL errors |
| **Analysis Agent** | Interfaces with frozen XGBoost models | `query_results` | `ml_predictions` | Return error message to state |
| **Simulation Agent** | Runs "what-if" scenarios by altering ML inputs | User constraints | `ml_predictions` (simulated) | Reject invalid constraints |
| **Narrative Agent** | Converts raw data/predictions to business language | `query_results`, `ml_predictions` | `draft_response` | Fallback to raw data display |
| **Report Agent** | Compiles multi-step analyses into markdown reports | `messages`, `context`| `draft_response` (long-form) | N/A |
| **Validator Agent** | Zero-trust check of the `draft_response` against data | `draft_response`, data | `validation_status` | Return to Narrative Agent with critique |

## 3. Inter-Agent Communication
Agents do not call each other directly. They are nodes in a directed cyclic graph (LangGraph). They communicate purely by updating keys in the `AgentState`. The edges dictate the flow (e.g., Narrative Agent always proceeds to Validator Agent).
