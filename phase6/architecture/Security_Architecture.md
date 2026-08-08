# Security Architecture
**Generated:** 2026-08-08 05:46:59  

---

## 1. Data Security & Injection Prevention
- **Prompt Injection:** All user inputs pass through a lightweight classifier to detect jailbreaks before entering the LangGraph state.
- **SQL Injection (DuckDB):** The Data Agent generates SQL, but DuckDB is mounted in **READ-ONLY** mode. `DROP`, `DELETE`, `UPDATE`, and `INSERT` commands will physically fail at the engine level.
- **PII Masking:** Any sensitive columns identified in Phase 2 are dropped or masked before they reach the Narrative Agent.

## 2. Authentication & Authorization
- **Auth:** JWT-based authentication via OAuth2PasswordBearer in FastAPI.
- **RBAC:** Roles (`user`, `admin`, `auditor`). The Intent Router denies access to system-level metrics (e.g., Audit logs) if the user lacks the `admin` role.

## 3. Operations Security
- **Secrets Management:** LLM API keys and JWT secrets loaded strictly via `.env` files and `python-dotenv`. NEVER hardcoded.
- **Rate Limiting:** IP and token-based rate limiting via FastAPI middleware to prevent LLM DDOS attacks.
