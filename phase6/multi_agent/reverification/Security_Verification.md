# Security Verification

## Framework Hooks
The base agent implementation in `backend/agents/base.py` enforces a rigid lifecycle:
1. `_check_prompt_injection`
2. `_sanitize_input`
3. `_mask_pii`
4. `execute()`
5. `_validate_output_safety`

## Evaluation
- The order of execution is correct.
- Security hooks are guaranteed to run regardless of the underlying agent subclass.
- Exceptions thrown in security hooks will trigger the native Retry Policy if applicable.

**Result:** **PASSED**
