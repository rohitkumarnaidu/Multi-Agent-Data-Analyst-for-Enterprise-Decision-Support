# Configuration Baseline

**Baseline Version:** 6.2.0
**Phase:** 6B
**Component:** Multi-Agent Core

## Configuration Details
- **Retry Policy:** max_attempts=3, initial_interval=1s, backoff_factor=2
- **DI Provider:** `get_agent_registry()`
- **Supported Intents:** "data", "simulation", "report", "risk", "narrative"

This configuration baseline is locked. Phase 6C will inherit these settings automatically.
