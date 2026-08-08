# Release Notes

## Version 6.2.0 (Phase 6B)

### Added
- Enterprise-grade LangGraph Orchestration.
- Extensible Dependency Injection factory for agents.
- 7 core specialized agents wrapped in a secure `BaseEnterpriseAgent`.
- Complete state telemetry generation (UUID, Latency, Failure Reasons).
- Robust structural security checks for prompt injections and PII.

### Removed
- Static singletons have been removed to enable FastAPI multi-tenancy.

### Changed
- State arrays natively flatten parallel executions to preserve chronological trace ordering.
