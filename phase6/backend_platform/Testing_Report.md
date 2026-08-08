# Testing Report

## Coverage
- `test_session_store`: Passed. SQLite update/get assertions hold.
- `test_pii_masking`: Passed. SSN and EMAIL properly redacted.
- `test_prompt_injection`: Passed. `SecurityException` triggered correctly on adversarial payloads.
- `test_sql_injection`: Passed. Heuristics capture raw payload drops.
- `test_api_chat_auth`: Passed. HTTP 401 returns on anonymous access.

**Overall Test Execution:** Clean, robust assertions covering integration layers.
