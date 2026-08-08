# Troubleshooting Guide

## Common Issues
- **Agent Timeout**: Increase the LLM timeout in `.env` if the Analysis agent is processing large datasets.
- **Memory Missing**: Ensure the `SESSION_ID` is correctly passed from the frontend to retrieve the SQLite context.
- **Authentication Failure**: Verify JWT secret rotation has not invalidated active tokens.
