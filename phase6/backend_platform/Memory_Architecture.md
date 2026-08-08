# Memory Architecture

## LangGraph native Checkpointing
`SqliteSaver` intercepts and saves the `EnterpriseAgentState` continuously across graph nodes.

## Long-Term Store
`SQLiteSessionStore` maintains conversation metadata, extracted intent chains, and summary logic independently of the raw state object to prevent token overflow.

## Memory Manager
The `MemoryManager` node executes after `KnowledgeAgent` to compress state and synchronize with the SQLite database.
