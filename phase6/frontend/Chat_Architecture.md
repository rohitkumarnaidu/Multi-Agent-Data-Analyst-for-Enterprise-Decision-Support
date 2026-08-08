# Chat Architecture

The chat UI (`ChatInterface.tsx`) handles communication with `/ask`, `/chat`, and `/simulate` endpoints. It includes a `MessageBubble` that renders markdown, execution traces (`AgentTraceTimeline.tsx`), and charts.