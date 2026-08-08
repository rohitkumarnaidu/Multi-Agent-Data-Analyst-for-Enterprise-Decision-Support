# Security Framework

## Agent Hooks
The `BaseEnterpriseAgent` now acts as a secure boundary for all node executions. Every execution traverses four security checkpoints.

### 1. Prompt Injection (`_check_prompt_injection`)
Intercepts malicious context manipulation before it reaches the core LLM execution loop.

### 2. Input Sanitization (`_sanitize_input`)
Strips malformed JSON, SQL injection vectors, or overly large payloads from the state.

### 3. PII Masking (`_mask_pii`)
Automatically detects and hashes/redacts sensitive enterprise data before it is processed.

### 4. Output Validation (`_validate_output_safety`)
Verifies that the generated payload is safe to transmit to the next node or to the end user.

*Note: These are structural hooks (stubs) in Phase 6B. Implementation logic will be injected during Phase 6D (API Security).*
