# Architecture Audit

### Client-Side State Management
- TanStack Query is used exclusively for remote state (caching, deduping, background updates).
- React Context (`WorkspaceContext.tsx`) manages localized client state (sidebar toggle, theme).

### Component Tree
- `EnterpriseLayout` abstracts global elements (Header, Sidebar).
- Lazy loading is utilized on all top-level routes to ensure minimal initial bundle sizes.
