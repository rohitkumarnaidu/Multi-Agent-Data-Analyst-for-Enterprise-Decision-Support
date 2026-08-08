# Risk Assessment

## Threat Modeling

### Prompt Injection
**Risk:** High
**Mitigation:** The `BaseEnterpriseAgent` includes a mandatory `_check_prompt_injection()` hook before any agent processes input.
**Residual Risk:** Very Low

### Data Leakage (PII)
**Risk:** High
**Mitigation:** Mandatory `_mask_pii()` hook executes prior to processing.
**Residual Risk:** Very Low

### Infinite Agent Loops
**Risk:** Medium
**Mitigation:** LangGraph topology strictly forbids backward edges.
**Residual Risk:** None

### Memory Leaks
**Risk:** Low
**Mitigation:** `AgentRegistry` is a Factory. FastAPI dependency injection guarantees instances are garbage-collected per request.
**Residual Risk:** None
