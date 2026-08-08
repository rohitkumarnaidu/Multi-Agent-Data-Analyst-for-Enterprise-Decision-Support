# Developer Guide

## How to build a new agent
To add a new agent to the orchestration graph:

1. **Create the Node:**
   Create a new Python file in `backend/agents/nodes/`. Inherit from `BaseEnterpriseAgent`:
   ```python
   class MyNewAgent(BaseEnterpriseAgent):
       def __init__(self):
           super().__init__("my_new_agent")

       def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
           # Do work
           return {"narrative": "Updated narrative"}
   ```

2. **Register the Node:**
   In `backend/agents/graph.py`, import and register your agent:
   ```python
   registry.register(MyNewAgent())
   ```

3. **Wire the Graph:**
   Add conditional edges to `intent_router` and structural edges to the `workflow` definition in `graph.py` to route traffic to and from your node.
