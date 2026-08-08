# Memory Architecture
**Generated:** 2026-08-08 05:46:59  

---

## 1. Storage & Persistence
- **LangGraph Checkpointer:** Uses `SqliteSaver` (for MVP) or `AsyncPostgresSaver` (production) to persist the state of the graph after every node execution.
- **Thread ID:** Every conversation maps to a unique `thread_id`. The checkpointer loads the state associated with this thread to provide continuous memory.

## 2. Memory Types
| Type | Scope | Implementation |
|---|---|---|
| **Conversation Memory** | Single Thread | Raw LangGraph state (`messages` list). |
| **Session Memory** | Web Session | JWT token maps to active `thread_id`s in the database. |
| **Long-term Memory** | User Account | Extracted user preferences stored in a separate RDBMS table (e.g., "User prefers summary over detailed tables"). |
| **Feedback Memory** | System-wide | Thumbs up/down reactions on responses are logged to a Feedback DB for future RLHF. |

## 3. Context Window Management
To prevent blowing out the LLM context window:
- The `messages` list is pruned.
- An automatic summarization node runs when token count > 8000. It replaces the oldest 10 messages with a 1-paragraph summary, retaining the most recent 3 messages verbatim.
