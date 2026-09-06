# CaseBound — Frontend Engineering Rules

> **Mandatory first condition for every code change:** Read and follow this `CODE_STRUCTURE_RULE.md` before editing code. If a change conflicts with it, update this document first in the same pull request and explain the architectural decision in `CODE_CHANGE_TRACK.md`.

This document is the implementation contract for the CaseBound React Native app. It turns the product design in `DAILY_DETECTIVE_README.md` into code-organization and state-management rules.

## 1. Architectural decisions

- Use **React Native + TypeScript**. New application code belongs in `src/`; avoid adding feature logic to `App.js`.
- CaseBound is **landscape-only**. Enforce this in Android/iOS native configuration, not per screen in JavaScript. Design and test every screen in landscape; do not add portrait layouts or runtime orientation-lock libraries unless the product direction changes and this rule is revised first.
- Use **Redux Toolkit (RTK)** for shared client/game state. Do not use Redux directly or handwritten action types.
- Use **RTK Query** for API requests, caching, invalidation, and loading/error state. Do not mirror server data in ordinary Redux slices.
- Keep the backend authoritative for cases, solutions, score, XP, streaks, level, rank, and submission time. The app may display these values, never calculate the final versions.
- Keep transient UI state local to a component unless two or more independently mounted screens need it.
- Organize by feature/domain, not by file type alone.

## 2. Target folder structure

```text
src/
├── app/
│   ├── store.ts                 # configureStore and typed exports
│   ├── rootReducer.ts
│   └── hooks.ts                 # useAppDispatch/useAppSelector
├── api/
│   ├── baseApi.ts               # RTK Query base API + auth-aware base query
│   └── endpoints/               # endpoint modules injected into baseApi
├── features/
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── authSelectors.ts
│   │   ├── auth.types.ts
│   │   └── auth.storage.ts
│   ├── investigation/
│   │   ├── investigationSlice.ts
│   │   ├── investigationSelectors.ts
│   │   ├── investigation.types.ts
│   │   └── components/
│   ├── notes/
│   │   ├── notesSlice.ts
│   │   └── notesSelectors.ts
│   ├── preferences/
│   │   └── preferencesSlice.ts
│   └── session/
│       └── sessionSlice.ts
├── screens/
│   ├── home/
│   ├── case/
│   ├── deduction/
│   ├── result/
│   ├── leaderboard/
│   └── profile/
├── components/
│   ├── ui/                      # reusable, domain-neutral primitives
│   └── game/                    # reusable detective-specific presentation
├── navigation/
│   ├── RootNavigator.tsx
│   └── navigation.types.ts
├── theme/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── index.ts
├── types/
│   ├── api.ts                   # API response contracts
│   └── domain.ts                # Case, Evidence, Suspect etc.
├── lib/                         # framework configuration and pure integrations
├── utils/                       # pure generic helpers only
└── test/                        # test helpers, fixtures and mocks
```

Rules:

- A screen composes feature components; it must not contain business rules or raw API calls.
- `components/ui` must not import from `features`, `screens`, or `navigation`.
- A feature may import `app`, `api`, `components`, `theme`, `types`, `lib`, and `utils`; never another feature's private files. Export intentional public APIs through that feature's `index.ts` when cross-feature sharing is required.
- Use kebab-free names: `CaseHeader.tsx`, `investigationSlice.ts`, `useCaseTimer.ts`.

## 3. State ownership rules

| State | Owner | Examples |
|---|---|---|
| Remote/server state | RTK Query cache | daily case, profile, leaderboard, investigation result |
| Cross-screen local game state | Redux slice | selected suspect/method/motive, opened evidence, draft notes |
| App session state | Redux slice + secure persistence | auth status, access token metadata |
| Local visual state | Component state | modal open, active tab, input focus, animation values |
| Navigation state | React Navigation | route, params, back stack |

Never place the following in a client slice as a source of truth: solution, correctness, final score, XP award, streak result, level, leaderboard rank, or server timestamps.

## 4. Redux store and required slices

```ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    investigation: investigationReducer,
    notes: notesReducer,
    preferences: preferencesReducer,
    session: sessionReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: true }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### `authSlice`

Owns authenticated/anonymous state and safe token metadata only. Persist credentials with a secure device storage adapter, never plain AsyncStorage. A logout must reset the Redux store and RTK Query cache.

### `investigationSlice`

Owns exactly one active investigation draft:

```ts
type InvestigationState = {
  investigationId: string | null;
  caseId: string | null;
  status: 'idle' | 'in_progress' | 'submitting' | 'submitted';
  startedAtClient: string | null;
  selectedSuspectId: string | null;
  selectedMethodId: string | null;
  selectedMotiveId: string | null;
  viewedEvidenceIds: string[];
  requestedHintIds: string[];
};
```

- The server still records the authoritative start time and hint usage.
- Reducers must be simple intent updates: `started`, `suspectSelected`, `methodSelected`, `motiveSelected`, `evidenceViewed`, `reset`.
- A successful server submission changes status to `submitted`; it does not calculate outcome locally.
- Clear this slice after a finished result is safely displayed or when a different daily case begins.

### `notesSlice`

Owns a local case-scoped draft notebook. Shape: `Record<caseId, { text: string; updatedAt: string }>`.
Persist only this explicitly approved non-sensitive state. Syncing notes to a future backend is an API feature, not a reducer concern.

### `preferencesSlice`

Owns non-game settings: color preference, sound/haptic toggles, onboarding completion, and selected timezone display preference. Do not store player statistics here.

### `sessionSlice`

Owns bootstrapping state such as `isHydrated`, `appState`, and one-time migration flags. It must not duplicate auth data.

## 5. RTK Query endpoint rules

- Define `baseApi` once with tag types: `DailyCase`, `Case`, `Investigation`, `Profile`, `Stats`, `Leaderboard`, `History`, `Achievements`.
- Add endpoints through `baseApi.injectEndpoints`; keep each domain's endpoint file near that feature.
- Queries provide precise tags. Mutations invalidate only affected tags.
- Use generated hooks inside screens/feature containers, not reusable presentational components.
- Submit mutations use the server-issued `investigationId` and handle an idempotent response as success.

Suggested endpoints:

```text
getDailyCase                 GET  /daily-case
getCase                      GET  /cases/:id
startInvestigation           POST /investigations/start
requestHint                  POST /investigations/:id/hint
submitInvestigation          POST /investigations/:id/submit
getMyProfile/getMyStats      GET  /users/me, /users/me/stats
getWeeklyLeaderboard         GET  /leaderboard/weekly
getHistory                   GET  /history
```

## 6. Game-flow contract

```text
Home query → start mutation → save investigation draft → investigate
→ submit mutation → invalidate Profile/Stats/Leaderboard/History/DailyCase
→ render server result → reset draft at the appropriate lifecycle boundary
```

- Never pass full case objects or deduction choices through navigation params. Pass IDs only.
- The case API must never expose solution fields. Type contracts for playable case payloads must exclude them.
- The submit button must be disabled while the request is in flight, but duplicate submissions must also be harmless server-side.
- Client timers are presentation only. The API result determines time bonus and score.

## 7. Component and TypeScript rules

- Use named exports; reserve default exports for a screen only when navigation requires it.
- Props and public types are explicitly declared. Do not use `any`; use `unknown` and narrow safely when needed.
- Keep components focused: render data and emit callbacks. Put transformations in selectors or pure helpers.
- Use `createSelector` for derived Redux data; never derive values repeatedly in multiple screens.
- Use `StyleSheet.create` or the project’s single approved styling system. Centralize tokens in `theme/`; no arbitrary repeated color or spacing literals.
- Use `FlashList`/`FlatList` for dynamic evidence, suspect, timeline, and leaderboard collections; do not map large lists into a `ScrollView`.

## 8. Error, loading, and empty-state rules

Every remote screen implements loading, retryable error, empty, and ready states. Mutation errors show a user-safe message, retain the deduction draft, and never expose server internals.

Use one normalized error mapper in `lib/` so API failures have consistent messages. `401` triggers the approved refresh/logout flow once; do not implement token refresh separately in each endpoint.

## 9. Persistence, privacy, and security

- Persist only auth credentials in secure storage and explicitly approved user preferences/notes in AsyncStorage.
- Never log access tokens, refresh tokens, deductions, or API bodies in production.
- `.env` is never committed. Commit `.env.example` with variable names only.
- Validate all externally sourced data at the API boundary. Assume the device is untrusted.
- Do not add client-side score, XP, streak, or answer-validation utilities. Those belong to the NestJS game engine.

## 10. Dependency governance

- Before installing, upgrading, or replacing any package, verify that it is actively maintained, not deprecated, compatible with the installed React Native, React, TypeScript, Android Gradle Plugin, and iOS/CocoaPods versions, and appropriate for the target platform.
- Prefer an official React Native package or a widely maintained library with clear React Native support. Do not add packages solely for a small helper that can be implemented safely in the project.
- Check existing dependencies first. Reuse a suitable installed, supported package instead of adding an overlapping library.
- Use a compatible version range and inspect peer dependencies before installation. Never bypass peer-dependency conflicts with `--force` or `--legacy-peer-deps` without documenting the reason, risk, and removal plan in `CODE_CHANGE_TRACK.md`.
- After dependency changes, update the lockfile, run the relevant tests/build, and record the package name, version, purpose, compatibility decision, and verification in `CODE_CHANGE_TRACK.md`.
- Do not introduce packages with known critical security advisories, abandoned maintainers, or deprecated APIs unless there is no viable alternative and the exception is explicitly approved and tracked.

## 11. Testing requirements

- Reducer tests: investigation selections/reset, notes updates, preferences persistence behavior.
- Selector tests: readiness to submit and derived investigation progress.
- RTK Query tests: correct endpoint request, tags, invalidation, and idempotent submit response.
- Screen tests: loading/error/ready states and a complete Home → Investigate → Submit → Result path with mocked API responses.
- Add a regression test whenever a scoring, state-reset, duplicate-submit, or authentication bug is fixed.

## 12. Pull-request checklist

- [ ] The owner of each new state value follows section 3.
- [ ] Remote data uses RTK Query; no duplicate slice cache was created.
- [ ] No game reward or solution logic runs on the device.
- [ ] Endpoint tags invalidate affected screens after a mutation.
- [ ] Screens handle loading, error, empty, and ready states.
- [ ] No `any`, secrets, debug logs, or raw magic design values were introduced.
- [ ] Any dependency change meets the dependency-governance rules and is documented in the code change tracker.
- [ ] Tests cover new reducer/selector/API behavior.
- [ ] The change keeps the MVP vertical slice playable.
- [ ] A major behavior, architecture, API contract, state shape, dependency, migration, or known limitation is recorded in `doc/CODE_CHANGE_TRACK.md`.
