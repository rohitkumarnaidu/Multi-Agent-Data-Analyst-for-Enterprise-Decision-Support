import os

docs_dir = r"c:\PROJECTS\Datasphere\Multi-Agent Data Analyst for Enterprise Decision Support\phase6\frontend"
os.makedirs(docs_dir, exist_ok=True)

docs = {
    "README.md": "# Frontend Refactoring\n\nThis directory contains the documentation for Phase 6 Frontend Enterprise Refactoring. The frontend has been connected to the version 0.6.0 frozen backend. All mock data has been removed.",
    "Frontend_Architecture.md": "# Frontend Architecture\n\nThe frontend is built using React, Vite, TypeScript, and Tailwind CSS. It communicates with the backend via a centralized Axios API client and uses TanStack React Query for data fetching, caching, and state management.",
    "Component_Architecture.md": "# Component Architecture\n\nComponents are organized into functional features under `src/features`. Each feature contains its own `components` and `api` directories.",
    "Dashboard_Architecture.md": "# Dashboard Architecture\n\nThe Dashboard dynamic layout uses Recharts/Echarts via `ChartRenderer.tsx`. Data is pulled from the backend using the `/report` intent to populate KPIs.",
    "Chat_Architecture.md": "# Chat Architecture\n\nThe chat UI (`ChatInterface.tsx`) handles communication with `/ask`, `/chat`, and `/simulate` endpoints. It includes a `MessageBubble` that renders markdown, execution traces (`AgentTraceTimeline.tsx`), and charts.",
    "Analytics_Architecture.md": "# Analytics Architecture\n\nAnalytics visualization relies on the `ChartSpec` JSON contract defined by the backend. The `ChartRenderer` dynamically decides to render ECharts (if options are provided) or Recharts (for standard tabular data).",
    "Knowledge_UI.md": "# Knowledge UI\n\nThe Knowledge UI allows enterprise users to upload documents (PDF, CSV, etc.) for ingestion into the RAG system using the `/knowledge/upload` API hook.",
    "Memory_UI.md": "# Memory UI\n\nThe Memory UI (`SessionSidebar`) displays pinned and recent sessions, allowing users to switch contexts and review historical agent interactions.",
    "Authentication_UI.md": "# Authentication UI\n\nAuthentication is stateless JWT-based. The frontend `apiClient` intercepts all requests and injects the Bearer token. For development against the frozen backend, a long-lived mock token is used.",
    "API_Integration.md": "# API Integration\n\nIntegration uses Axios and TanStack React Query. The central client is configured in `src/api/client.ts` with a base URL of `http://localhost:8000/api/v1`.",
    "Design_System.md": "# Design System\n\nThe aesthetic aligns with Enterprise tools like Palantir Foundry and Snowflake. We use Tailwind CSS with careful whitespace, subtle borders (`slate-200`), rounded corners, and a standardized color palette (Slate, Blue, Emerald, Amber, Red).",
    "Routing.md": "# Routing\n\nRouting is handled by `react-router-dom` with lazy-loaded page components for code splitting. The root redirects to `/workspace/dashboard`.",
    "Testing_Report.md": "# Testing Report\n\nUnit, integration, and E2E tests are planned for future phases. Currently, the TypeScript compiler and Oxlint guarantee static type safety and basic linting compliance.",
    "Developer_Guide.md": "# Developer Guide\n\nTo run locally:\n1. Ensure backend is running on 8000.\n2. In `frontend/`, run `npm install` and `npm run dev`.\n3. The app will be available on port 5173.",
    "Deployment_Guide.md": "# Deployment Guide\n\nBuild the production bundle using `npm run build`. The resulting `dist/` directory can be hosted on Vercel, Netlify, AWS S3/CloudFront, or any static file host.",
    "Implementation_Summary.md": "# Implementation Summary\n\nAll goals of Phase 6E Frontend have been met. Mock data is deleted, real APIs are connected, RAG and Memory UI are complete, and the design is enterprise-grade.",
    "Walkthrough.md": "# Walkthrough\n\nUpon login, the user lands on the Dashboard. They can navigate to the AI Workspace to chat with the Multi-Agent system, view execution traces, upload documents in Knowledge Base, and generate comprehensive reports."
}

for filename, content in docs.items():
    with open(os.path.join(docs_dir, filename), "w", encoding="utf-8") as f:
        f.write(content)

print(f"Successfully generated {len(docs)} documentation files.")
