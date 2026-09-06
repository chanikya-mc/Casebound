# CaseBound Security Rules

> **Mandatory:** Read this document before adding or changing authentication, API, data access, storage, external integrations, or logging. Security requirements are acceptance criteria, not cleanup work.

## 1. Non-negotiable principles

- Treat every client, request, token, URL parameter, header, file, webhook, and third-party response as untrusted.
- The backend is the only authority for identity, permissions, case content, scores, rewards, and any other sensitive decision. The client may request and display data; it must never be trusted to decide it.
- Apply least privilege, deny by default, and validate at every trust boundary.
- Never commit, hard-code, log, screenshot, or send in chat any secret: API key, password, token, private key, connection string, signing key, or production data.
- Use the approved secret manager or environment configuration. Add local secret files to `.gitignore`; provide only a redacted `.env.example`.
- Security bugs, exposed secrets, and suspected token misuse must be reported immediately and credentials rotated. Removing a leaked secret from Git does not make it safe.

## 2. Identity, tokens, and sessions

- Use short-lived access tokens. Validate signature, algorithm allow-list, issuer, audience, expiry, not-before, subject, and token type before accepting a token.
- Do not accept `alg: none`, infer authorization from unverified JWT payloads, or use a token issued for one audience/service at another service.
- Keep authorization claims minimal; do not place passwords, secrets, sensitive personal data, or mutable permissions in a token. Re-check current permissions server-side for sensitive operations.
- Use refresh tokens only where required. Make them longer-lived than access tokens, rotate them on use, detect reuse, revoke them on logout/password reset/compromise, and bind them to a session/device where feasible.
- Never put tokens in URLs, query strings, route parameters, analytics, crash reports, or logs. Send access tokens only in the `Authorization: Bearer` header over TLS.
- Do not expose privileged API keys to mobile/web clients. A public client cannot safely keep a secret.
- Every service gets its own machine identity and narrowly scoped credential/audience. Do not share user tokens, service tokens, signing keys, or broad API keys between services. Prefer workload identity or short-lived client-credential tokens, with rotation and revocation.

## 3. Authorization and data access

- Authenticate first, then authorize every protected endpoint and every object. A valid token alone is never permission to access another user's resource (prevent IDOR/BOLA).
- Derive the acting user and tenant from verified server-side identity, never from `userId`, `role`, `tenantId`, `ownerId`, score, or permission fields supplied in the request body.
- Enforce ownership, tenant boundaries, and role/permission checks in the service/data-access layer, not only in UI routes or controller decorators.
- Use explicit allow-lists for roles, operations, sortable fields, filters, upload types, redirect hosts, and outbound destinations.
- Administrative operations require stronger authorization, audit logging, and where appropriate step-up authentication.

## 4. API and input safety

- Define an explicit request DTO/schema for every endpoint. Reject unknown fields, validate type/format/range/length/enums, and transform only after validation.
- Protect against mass assignment: map approved DTO fields to domain models explicitly; never spread request bodies into persistence updates.
- Use parameterized queries or ORM query bindings only. Never concatenate untrusted input into SQL, NoSQL filters, shell commands, file paths, HTML, templates, or dynamic code.
- Keep object identifiers and pagination bounded. Apply request body, file size, nesting, array length, timeout, and rate limits.
- Validate uploaded files by allow-listed type, signature/content, size, and storage path; generate server-side filenames; do not execute or directly serve untrusted uploads.
- Use TLS for all environments handling real data. Configure CORS as a precise allow-list; do not use `*` with credentials. Add CSRF protection when cookie-based authentication is used.
- Return safe, consistent errors to clients. Do not reveal stack traces, internal IDs, query details, credentials, or whether an account exists when that enables enumeration.

## 5. Client rules

- Store credentials only in OS-backed secure storage (Keychain/Keystore). Never use AsyncStorage, local storage, Redux persistence, source code, build configuration, logs, clipboard, or deep links for tokens.
- Keep access tokens out of application state where possible; if state needs authentication information, store only safe metadata such as authenticated status and expiry.
- Clear secure storage, in-memory state, API caches, and queued requests on logout, account switch, or credential invalidation.
- Treat all API responses and deep-link data as untrusted. Validate before rendering or navigating. Avoid rendering untrusted HTML; if unavoidable, sanitize with an approved, tested sanitizer.
- Do not rely on hidden screens, disabled buttons, client-side roles, or obfuscated code for authorization. Server enforcement is mandatory.

## 6. NestJS baseline

- Enable a global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`; use explicit DTOs and validation decorators for all input.
- Protect routes by default with authentication guards. Mark only intentionally public endpoints with an explicit `@Public()` mechanism and review each exception.
- Add authorization guards/policies for roles, ownership, and tenant access. Controller checks alone are insufficient for reusable service methods.
- Set secure HTTP headers with Helmet, narrowly configured CORS, body-size limits, rate limiting (especially auth and reset routes), and production-safe exception filtering.
- Load secrets through configuration validation at startup. Fail closed when mandatory configuration is absent; never use development signing keys or permissive CORS in production.
- Redact `authorization`, `cookie`, `set-cookie`, passwords, tokens, API keys, and sensitive request fields from logs and error reporting.

## 7. Delivery and incident response

- Review dependency changes; pin/lock dependencies, run vulnerability checks in CI, and update promptly for relevant security fixes.
- Require security-focused review for authentication, authorization, crypto, data export, payments, uploads, webhooks, external calls, and infrastructure changes.
- Add tests for unauthenticated access, wrong-role access, cross-user/tenant access, malformed/extra payload fields, expired/invalid/wrong-audience tokens, and rate limits for every sensitive endpoint.
- Log security-relevant events with non-sensitive context: login failures, token/session revocation, permission denials, privilege changes, exports, and administrative actions. Protect logs and define retention.
- If a secret or token is exposed: revoke/rotate it, invalidate affected sessions, assess access logs and scope, remove it from systems, and document the incident. Do not merely replace the visible value.

## Pull-request checklist

- [ ] No secrets, tokens, credentials, production data, or privileged client keys were added.
- [ ] Endpoint input uses an explicit allow-listed DTO/schema with limits.
- [ ] Authentication and object-level authorization are enforced server-side.
- [ ] Tokens have correct issuer, audience, type, expiry, and minimal scopes.
- [ ] Errors and logs redact sensitive values.
- [ ] New sensitive behaviour has negative security tests.
- [ ] Service integrations use a separate least-privilege identity/token where applicable.
