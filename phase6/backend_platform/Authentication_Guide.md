# Authentication Guide

## JWT Mechanism
Uses `python-jose` for JWT validation via `OAuth2PasswordBearer`.
Endpoints require `get_current_user` dependency.

## Role-Based Access Control (RBAC)
The `/knowledge/upload` endpoint enforces a `require_admin` dependency which checks that `current_user['role'] == 'admin'`.
