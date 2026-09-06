# CaseBound Frontend Documentation

This document is the frontend-only implementation guide for CaseBound. It
describes the React Native app, its screens, state, and the API boundary. It
does not define backend implementation, database schema, scoring, or answer
validation. Those belong in a future backend document.

For shared product rules, see [DAILY_DETECTIVE_README.md](DAILY_DETECTIVE_README.md).
For required code conventions, see [CODE_STRUCTURE_RULE.md](CODE_STRUCTURE_RULE.md).

## Scope

The mobile client provides a landscape-first detective experience:

```text
Launch -> Home -> Start investigation -> Investigate -> Submit -> Result
                                      |
                                      +-> Profile / Leaderboard / History
```

The frontend is responsible for presentation, navigation, interaction state,
local notes, accessible loading/error states, and sending player intent to the
API. It is not authoritative for game results.

## Current Project

| Area | Current state |
| --- | --- |
| Framework | React Native 0.79.7 with React 19 |
| Language | JavaScript today; new application code should migrate to TypeScript |
| Entry point | `index.js` registers the native module `MyApp` |
| Root UI | `App.js` is still the React Native starter screen |
| Orientation | Android and iOS are configured for landscape only |
| Product name | CaseBound |

Keep the internal native module name `MyApp` unchanged until a separately
planned and tested native rename migration.

## MVP Screens

| Screen | Player purpose | Required frontend behavior |
| --- | --- | --- |
| App bootstrap | Restore the session and preferences | Show a safe loading state before routes render. |
| Home | Discover today's case and player progress | Load the daily case, streak, and summary; make Start Investigation prominent. |
| Case briefing | Read the premise | Render case title, difficulty, estimated time, and story. |
| Investigation | Review evidence and make a deduction | Switch among Story, Suspects, Evidence, Timeline, Clues, and Notes while preserving the draft. |
| Final deduction | Choose suspect, method, and motive | Validate required choices locally; submit only after all selections are present. |
| Result | See the authoritative outcome | Render the API result and case explanation without locally recalculating it. |
| Leaderboard | Compare weekly progress | Render ranking, current-player position, loading, empty, and retry states. |
| Profile/history | Review progress | Display server-provided player stats and completed cases. |

All screens must work in both permitted landscape directions and at tablet-like
widths. Long evidence, suspects, timelines, and leaderboard lists use a
virtualized list rather than a large `ScrollView`.

## Target Application Structure

Create this structure incrementally; do not create empty folders merely to
match it.

```text
src/
  app/                 # providers and store setup
  api/                 # shared API client and RTK Query base API
  features/            # feature state, endpoint definitions, feature UI
    auth/
    case/
    investigation/
    leaderboard/
    notes/
    preferences/
    profile/
    session/
  screens/             # route-level composition only
    home/
    case/
    deduction/
    result/
    leaderboard/
    profile/
  components/
    ui/                # domain-neutral primitives
    game/              # reusable detective-game presentation
  navigation/
  theme/
  types/
  lib/                 # framework integrations, error mapping, storage adapters
  utils/               # pure generic helpers
  test/                # fixtures, mocks, and test helpers
```

A screen composes feature components and must not contain raw API calls or
game rules. Components in `components/ui` cannot import a feature, screen, or
navigation module. Cross-feature use must go through the exporting feature's
public `index.ts`.

## State Ownership

| State | Owner | Examples |
| --- | --- | --- |
| Server data | RTK Query cache | Daily case, profile, leaderboard, history, result |
| Active investigation draft | Redux slice | Selected deductions, opened evidence, requested hints |
| Local notes | Redux slice with approved persistence | Case-scoped note text and update time |
| Session | Redux slice plus secure storage | Authentication status and token metadata |
| Visual state | Component state | Active tab, modal visibility, focus, animation values |
| Navigation | React Navigation | Route and ID-only route parameters |

Never treat client state as the source of truth for a solution, correctness,
score, XP, streak, level, rank, completion time, or server timestamp.

The active-investigation state should contain only one draft:

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

## API Boundary

The frontend assumes an API with these contracts. Endpoint paths are planned
contracts, not an implementation of the backend.

```text
GET   /daily-case
GET   /cases/:id
POST  /investigations/start
POST  /investigations/:id/hint
POST  /investigations/:id/submit
GET   /users/me
GET   /users/me/stats
GET   /leaderboard/weekly
GET   /history
```

Only IDs travel through navigation. The playable case payload must never
include solution or scoring-rule fields. Starting, requesting a hint, and
submitting are server-backed actions; the UI sends the player selection and
renders the returned result.

After a successful submission, invalidate the daily case, investigation,
profile, stats, leaderboard, and history cache entries. Keep the draft on a
retryable failure. Disable the submit control while the request is running,
but assume the server handles an accidental duplicate safely.

## Frontend Flow

```text
Home loads daily case
  -> player starts investigation
  -> API returns investigation ID
  -> store the local draft and open the investigation
  -> player reviews case data and selects deductions
  -> submit selections with investigation ID
  -> API returns authoritative result
  -> refresh affected cached data
  -> show result, then clear the draft at the appropriate lifecycle boundary
```

The on-device timer is presentation only. Do not calculate time bonuses,
scores, XP, or correctness on the client.

## UX, Error Handling, and Privacy

- Use a dark, clean investigation-board visual style and retain one obvious
  primary action per screen.
- Every remote screen needs loading, retryable error, empty, and ready states.
- Map API errors through one shared error mapper. Never display server internals.
- Store credentials only through a secure device-storage adapter. Persist only
  approved non-sensitive preferences and notes in AsyncStorage.
- Do not log access tokens, refresh tokens, deduction choices, or API bodies in
  production.
- Keep `.env` out of version control; commit an `.env.example` containing names
  only.

## Implementation Order

1. Replace the starter `App.js` UI with the TypeScript app shell, landscape-safe
   layout, theme tokens, and temporary local screen wiring.
2. Add navigation and the Home -> Investigation -> Deduction -> Result route
   flow using mock data.
3. Add Redux Toolkit and RTK Query only after dependency compatibility review.
4. Implement API client, typed contracts, loading/error states, and the daily
   case/start/submit flow.
5. Add profile, leaderboard, history, local notes, and preferences.
6. Add reducer, selector, API, and screen-flow tests as each feature arrives.

Before adding or changing a dependency, follow the compatibility and tracking
rules in `CODE_STRUCTURE_RULE.md`. Record every major implementation decision
in `CODE_CHANGE_TRACK.md`.

## Backend Handoff Boundary

The future backend document should define authentication, database models,
server-time rules, daily publication, case-content administration, validation,
scoring, XP, streaks, leaderboards, idempotency, and endpoint request/response
schemas. The frontend document intentionally references those only as contracts.
