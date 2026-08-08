# Walkthrough: System Integration

## User Journey
1. **Login**: User authenticates via JWT.
2. **Dashboard**: Views real KPIs queried from DuckDB.
3. **Workspace**: Opens the chat interface.
4. **Knowledge Upload**: Uploads a PDF; backend embeds into ChromaDB.
5. **Chat**: Asks a complex question; LangGraph routes to RAG, Data, and Analysis agents.
6. **Report**: Synthesizes a Business Report and generates charts.
7. **Export**: Downloads the final PDF.
8. **Logout**: Session is persisted in SQLite for future reload.
