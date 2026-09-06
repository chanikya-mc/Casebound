# Backend Security Rules (NestJS)

This file is the backend working copy of the mandatory cross-stack policy in [`../../doc/SECURITY_RULES.md`](../../doc/SECURITY_RULES.md). When rules conflict, the shared policy wins.

## Required for every API

- Protect endpoints by default. An endpoint may be public only when deliberately annotated and documented.
- Authenticate, then perform role, ownership, and tenant checks for the exact resource. Never authorize from request-supplied IDs, roles, or permissions.
- Use an explicit DTO for path, query, and body input. Enable global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` and bound all collections, strings, pagination, and file sizes.
- Map DTOs to persistence fields explicitly. Never use `...req.body` or an untrusted object in create/update/query operations.
- Use parameterized ORM/database APIs. Never construct SQL/NoSQL queries, commands, paths, URLs, or templates by concatenating request data.
- Validate every JWT's allowed algorithm, signature, issuer, audience, expiry, not-before, subject, and token type. Use short-lived access tokens.
- Put `userId`, `tenantId`, and authorization scope into server-derived context only. Re-check mutable permissions against the database/policy layer for sensitive actions.
- Configure Helmet, restricted CORS, body limits, rate limits, safe production error handling, TLS, and redacted structured logging.

## Service-to-service authentication

- Give each calling service a separate identity, audience, credential, and minimum scope. Never forward a user bearer token as a general service credential.
- Prefer short-lived workload/client-credential tokens. Rotate and revoke credentials; store them only in the approved secret manager/configuration system.
- Verify the caller identity, intended audience, scopes, and request authorization at the receiving service.

## Forbidden patterns

- Hard-coded JWT secrets, database URLs, API keys, passwords, or fallback production secrets.
- `@Public()` as a convenience, wildcard production CORS, `alg: none`, unverified JWT decoding for authorization, or logging headers/cookies/request bodies by default.
- Returning stack traces or internal database details to clients.
- Trusting a client-submitted price, score, owner, role, tenant, status, or entitlement.

Before merging, complete the shared policy's pull-request checklist and add negative tests for invalid token, wrong user/tenant/role, and malicious/extra payloads.
