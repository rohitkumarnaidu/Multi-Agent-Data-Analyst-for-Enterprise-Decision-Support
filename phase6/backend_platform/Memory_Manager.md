# Memory Manager

## Purpose
Mitigate LLM context window limits by managing exactly what is passed down to Intent Agents (Data, Simulation, Report). 

## Sync
Writes directly to `sqlite3` using `json` encoded dictionaries per `session_id`. Extracts the final `intent` computed for long-term behavioral analytics.
