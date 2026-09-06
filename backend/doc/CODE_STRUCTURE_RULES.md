# CaseBound Backend Code Structure Rules

> **Required before every backend change:** Read this document, [`SECURITY_RULES.md`](SECURITY_RULES.md), and [`BACKEND_LEARNING_RULES.md`](BACKEND_LEARNING_RULES.md). The backend uses NestJS, TypeScript, MongoDB, and Mongoose.

## 1. Architecture principles

- Organize by business domain (feature/module), not by technical file type across the entire application.
- A NestJS module owns one bounded responsibility and exposes only intentional providers to other modules.
- Controllers handle HTTP concerns only. Services hold business rules. Mongoose schemas/repositories handle persistence. DTOs validate API input and define API contracts.
- Keep MongoDB documents, request DTOs, response DTOs, and domain/business objects separate. Never return a Mongoose document or database-only field directly from a controller.
- The API is server-authoritative: clients never decide ownership, roles, scores, rewards, user IDs, or security state.
- Prefer explicit, readable code and small functions over generic abstractions introduced before they are needed.

## 2. Target folder structure

```text
src/
├── main.ts                         # app bootstrap and global HTTP security
├── app.module.ts                   # root composition only; no business logic
├── app.controller.ts               # temporary root/status endpoint only
├── common/                         # reusable, framework-neutral/shared code
│   ├── constants/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   ├── types/
│   └── utils/
├── config/                         # typed configuration factories and validation
├── health/                         # liveness/readiness endpoints
├── auth/                           # OTP, sessions, JWT, guards, current-user decorator
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                          # user profile and user data access
│   ├── dto/
│   ├── schemas/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── cases/                          # daily game case content
│   ├── dto/
│   ├── schemas/
│   ├── cases.controller.ts
│   ├── cases.service.ts
│   └── cases.module.ts
├── submissions/                    # deductions, answers, scoring submission flow
│   ├── dto/
│   ├── schemas/
│   ├── submissions.controller.ts
│   ├── submissions.service.ts
│   └── submissions.module.ts
└── leaderboard/                    # read models/ranking endpoints
```

Create a module directory only when it owns real domain behaviour. Do not create empty `helpers`, `managers`, `services`, or global `models` folders.

## 3. Responsibility boundaries

| Layer | Must do | Must not do |
| --- | --- | --- |
| Controller | Route, request DTO, auth decorators/guards, status code, call service, return response DTO | Query MongoDB, calculate scores, generate tokens, trust client ownership fields |
| DTO | Define and validate request/response contract | Contain database calls or business logic |
| Service | Business workflow, authorization decisions, transaction/consistency orchestration | Read raw Express request objects or format HTTP responses |
| Schema | MongoDB field definitions, indexes, defaults, simple document invariants | Accept unvalidated request objects or expose password/token fields |
| Guard | Authentication/authorization gate using verified identity | Put feature business logic in the guard |
| `common/` | Reusable code used by multiple modules | Become a dumping ground for feature-specific code |

## 4. Module and dependency rules

- `AppModule` imports feature modules and global infrastructure only. It must not contain feature providers, schemas, controllers, or database queries.
- A feature may import `common` and `config`. It may use another feature only through that feature's explicitly exported service or public interface.
- Never import another module's schema/model directly to bypass its service. For example, `submissions` calls `CasesService`; it does not inject the `Case` model.
- Avoid circular dependencies. Do not use `forwardRef()` as a default solution; extract a smaller shared module or revise ownership first.
- Export only providers that are intentionally part of a module's public API.
- Use dependency injection. Do not create services manually with `new` outside unit tests.

## 5. HTTP API rules

- Use plural, noun-based, versioned routes: `/api/v1/users`, `/api/v1/cases/today`, `/api/v1/auth/request-otp`.
- Use `POST` for commands/creation, `GET` for reads, `PATCH` for partial updates, and `DELETE` only for intentional deletions.
- Put request DTOs in `<feature>/dto/`: `request-otp.dto.ts`, `verify-otp.dto.ts`, `update-user.dto.ts`.
- Validate body, query, and route parameters with DTOs. The global `ValidationPipe` rejects unknown fields; do not turn that off per route.
- Controller responses must be intentionally shaped. Exclude internal fields such as OTP hashes, session IDs, tokens, audit fields, and provider metadata.
- Use standard NestJS exceptions (`BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `ConflictException`). Do not return `{ error: ... }` objects with a `200` status for failures.
- Pagination, search, sorting, and filtering inputs require DTO validation, fixed maximum limits, and allow-listed sort/filter fields.

## 6. MongoDB and Mongoose rules

- Put schemas in `<feature>/schemas/<entity>.schema.ts`; use singular PascalCase schema classes such as `User` and `OtpChallenge`.
- Every user-owned document must include an owner/user reference. Query ownership in the database filter, not after loading an arbitrary document.
- Add indexes deliberately: unique index on normalized user email; expiry/TTL index for OTP challenges; compound indexes only for proven query paths.
- Normalize identifiers before storage and lookup. Store email as a trimmed, lowercase value; validate it before querying.
- Store only the hash of an OTP or refresh token. Never persist plaintext credentials, OTPs, access tokens, or API keys.
- Use `select: false` for sensitive fields and explicitly select them only inside the service operation that needs them.
- Whitelist update fields. Never pass a DTO or `req.body` directly to `create`, `updateOne`, `findOneAndUpdate`, or `set`.
- Use MongoDB transactions only when a workflow modifies multiple documents and requires atomic consistency; keep them short.

## 7. Authentication and authorization layout

- Keep authentication code in `auth/`; user profile/data logic remains in `users/`.
- Auth flow: controller accepts validated input → auth service calls the OTP delivery/verification provider → user service creates or retrieves the user → auth service issues a session/token.
- OTP delivery must be an injectable provider interface. Start with a development console provider, then replace it with a Brevo provider without changing controller logic.
- Guards validate identity; services enforce resource ownership and permissions.
- Do not return whether an email exists from the request-OTP endpoint. Reveal account data only after successful verification and authorization.

## 8. Names, imports, and TypeScript

- Use kebab-case filenames: `request-otp.dto.ts`, `current-user.decorator.ts`, `users.service.spec.ts`.
- Use PascalCase classes/interfaces/enums, camelCase variables/functions, and UPPER_SNAKE_CASE only for true constants.
- One primary class per file. Keep public types next to their feature unless genuinely shared.
- Prefer path-relative imports within a feature and avoid deep imports into another feature's private folders.
- Keep TypeScript strict. Do not add `any`, broad type assertions, `@ts-ignore`, or disabled lint rules to bypass errors.
- Add comments only for decisions or constraints that are not clear from the code; do not narrate obvious code.

## 9. Testing and delivery

- Put unit tests beside source files: `auth.service.spec.ts`. Keep API/end-to-end tests in `test/` when introduced.
- Test services independently by mocking external providers and data models. Do not send real emails, SMS, or use production credentials in tests.
- For every protected endpoint, test invalid input, no identity, wrong user/tenant, expired/invalid OTP/token, and expected success.
- Run `npm.cmd run build` before considering a step complete. Run relevant tests and lint before merging.
- Update this document in the same change when architecture or module boundaries intentionally change.

## 10. Feature implementation checklist

- [ ] The feature has a single, clear module owner.
- [ ] Routes, DTOs, service logic, schemas, and public response shape are separated.
- [ ] Inputs are validated and persistence updates are allow-listed.
- [ ] Sensitive data is never exposed or logged.
- [ ] Authentication and object-level authorization are server-side.
- [ ] Required indexes and expiration behaviour are defined.
- [ ] Negative security tests and successful-path tests are included.
- [ ] The feature follows the manual learning workflow unless direct implementation was explicitly requested.
