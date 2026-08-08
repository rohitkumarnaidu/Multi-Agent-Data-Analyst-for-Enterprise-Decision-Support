# Risk Assessment

### High Risks
- **Lack of E2E Tests**: Refactoring complex UI states without regression tests poses a risk to continuous delivery.

### Medium Risks
- **ECharts Dependency Size**: The charting libraries are large (1.14MB uncompressed). While code-split, this could affect slow-network enterprise clients.
- **Hardcoded JWT**: The hardcoded token will expire or need manual rotation until a backend `/auth` endpoint is deployed.
