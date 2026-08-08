# Authentication UI

Authentication is stateless JWT-based. The frontend `apiClient` intercepts all requests and injects the Bearer token. For development against the frozen backend, a long-lived mock token is used.