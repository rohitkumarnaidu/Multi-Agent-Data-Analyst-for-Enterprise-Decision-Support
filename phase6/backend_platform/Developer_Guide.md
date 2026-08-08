# Developer Guide

## Modifying Graph Topology
Do not edit `router.py` intent returns unless you have registered a corresponding intent agent in `graph.py` inside the conditional edges map.

## Security
If you create a new agent, it **must** inherit from `BaseEnterpriseAgent` to inherit the Prompt Injection and PII masking hooks. Do not bypass the `execute()` envelope.
