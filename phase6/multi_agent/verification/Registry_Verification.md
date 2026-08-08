# Registry Verification

## AgentRegistry
- **Pattern:** Singleton exposed via `registry`.
- **Registration:** Nodes are registered at module load time in `graph.py`.
- **Lookup:** `registry.get()` safely raises a ValueError if an agent does not exist.
- **Health:** `registry.check_health()` correctly enumerates loaded agents.

**Result:** **PASSED**
