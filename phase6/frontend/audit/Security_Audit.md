# Security Audit

### Authentication
- Uses standard Bearer token header injection in `axios` interceptors.
- Note: A mock JWT token is currently hardcoded into the build because the v0.6.0 backend lacks a `/auth/token` issuing endpoint. However, the architecture to handle dynamic tokens is fully in place.

### Data Privacy
- No sensitive user data is cached in `localStorage` beyond UI preferences.
- XSS Protection: Built-in React escaping, plus `react-markdown` sanitization controls.
