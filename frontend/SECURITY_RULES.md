# Frontend Security Rules

This file is the frontend working copy of the mandatory cross-stack policy in [`../doc/SECURITY_RULES.md`](../doc/SECURITY_RULES.md). When rules conflict, the shared policy wins.

## Credentials and API calls

- Never hard-code or commit API keys, access tokens, refresh tokens, passwords, private URLs, or service credentials. A mobile/web bundle is public; it cannot protect a secret.
- Store user credentials only in OS-backed secure storage (iOS Keychain / Android Keystore through an approved library). Never use AsyncStorage, Redux persistence, logs, analytics, crash reports, clipboard, screenshots, URLs, or deep links.
- Keep tokens out of Redux and component state where possible. Store safe session metadata only. On logout or account switch, clear secure storage, in-memory auth data, API caches, and queued requests.
- Send tokens only in an HTTPS `Authorization: Bearer` header. Never add them to query strings, routes, telemetry, or error messages.
- Do not embed privileged third-party keys in the app. Use a backend proxy/service integration with its own restricted server-side credential.

## Trust boundaries

- The app never determines permissions, ownership, score, rewards, or final case outcome. Treat server values as authoritative and require the backend to enforce every authorization decision.
- Treat API responses, user text, notifications, QR/deep-link parameters, and remote configuration as untrusted. Validate types and allow-list navigation targets before use.
- Do not render untrusted HTML. If unavoidable, use a reviewed sanitizer and disable unsafe URL schemes and script execution.
- Do not expose sensitive information in UI, console output, error boundaries, analytics, or crash reporting. Redact tokens, emails, identifiers, and request headers where appropriate.

## Release checklist

- [ ] No secret or token is present in source, configuration, fixtures, screenshots, or logs.
- [ ] Secure storage is used for credentials and cleared on logout.
- [ ] API client uses HTTPS and never logs authorization data.
- [ ] UI protections are backed by server-side authorization.
- [ ] Deep links and external URLs are allow-listed and validated.
- [ ] Production error/analytics reporting redacts sensitive data.

