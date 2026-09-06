# CaseBound Game Backend

NestJS 11 API using MongoDB through Mongoose. Read [`doc/SECURITY_RULES.md`](doc/SECURITY_RULES.md) before changing API, auth, configuration, or data-access code.

## Prerequisites

- Node.js 22 (the current workspace version is suitable)
- MongoDB running locally, or an approved MongoDB connection URI

## Setup and commands

Run these commands from the repository root:

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
npm.cmd run start:dev
```

The API starts at `http://localhost:3000`; use `GET /health` to confirm the service and MongoDB are available.

Other common commands:

```powershell
npm.cmd run build       # compile to dist/
npm.cmd run start       # run the compiled application
npm.cmd run lint        # format/lint source files
npm.cmd run test        # run unit tests
```

## Included baseline

- Environment configuration validated at startup; no production fallback credentials
- MongoDB connection through `MongooseModule`
- `GET /health` endpoint
- Helmet, explicit CORS origins, DTO validation, unknown-field rejection, request-size limits, and API throttling

Never commit `.env`; it is intentionally ignored by the root `.gitignore`.
