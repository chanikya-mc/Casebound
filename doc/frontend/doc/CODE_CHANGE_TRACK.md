# CaseBound — Code Change Tracker

This is the durable handoff record for humans and future AI development tools. Read it with `CODE_STRUCTURE_RULE.md` before making changes.

## Non-negotiable update rule

For every **major** code change, append an entry here in the same change set. Major means any change to architecture, feature flow, API contract, Redux/RTK Query state, navigation, database/backend contract, authentication, persistence, dependencies, game rules, or a known limitation/workaround.

Do not rewrite old entries. Add a new dated entry that explains what superseded them. Keep entries factual and concise.

## Entry template

```md
## YYYY-MM-DD — Short change title

- **Area:** Feature/module affected.
- **What changed:** Concrete implementation summary.
- **Flow:** Input/event → state/API → resulting UI or side effect.
- **Contracts:** API payloads, types, persisted data, or navigation params changed (or `None`).
- **Must not break:** Invariants and dependent behavior that require regression coverage.
- **Verification:** Commands/tests/manual path run; or `Not run` with reason.
- **Follow-up:** Remaining work, risk, or `None`.
```

## 2026-09-06 — Project identity and engineering handoff rules

- **Area:** Application metadata and project documentation.
- **What changed:** The user-facing game name is now **CaseBound**. Android and iOS display labels plus React Native app metadata were updated. The npm package name is `casebound`. The internal React Native module/project identifier remains `MyApp` to avoid a high-risk native project rename; it is not user-facing.
- **Flow:** Installed app → Android `app_name` / iOS `CFBundleDisplayName` → displays `CaseBound`. JavaScript still registers and launches the existing `MyApp` native module.
- **Contracts:** No API, Redux, navigation, or persisted-data contract changed.
- **Must not break:** `app.json.name`, `index.js`, Android `MainActivity.getMainComponentName()`, and iOS `AppDelegate` must continue to use the same internal module name until a dedicated native rename migration is planned and tested.
- **Verification:** Documentation and metadata reviewed; JSON metadata parsed successfully. Native builds not run.
- **Follow-up:** Before implementing features, migrate application code from JavaScript to the TypeScript/Redux Toolkit structure in `CODE_STRUCTURE_RULE.md` and record each major slice/API/navigation change here.

## 2026-09-06 — Landscape-only game orientation

- **Area:** Native Android/iOS application configuration and UI product constraints.
- **What changed:** CaseBound is locked to landscape. Android `MainActivity` uses `android:screenOrientation="sensorLandscape"`, allowing both horizontal device directions without permitting portrait; iOS declares only left and right landscape interface orientations.
- **Flow:** App launch → native activity/view controller orientation policy → CaseBound opens and remains horizontal before React Native renders its first screen.
- **Contracts:** No API, Redux, navigation, or persisted-data contract changed.
- **Must not break:** Do not add a runtime orientation package, per-screen orientation override, or portrait-only screen without a deliberate product decision and a native configuration update. All new screens must be tested in both permitted landscape directions and with a keyboard where inputs are present.
- **Verification:** Android manifest and iOS plist reviewed; `git diff --check` must pass. Native emulator/device builds are still required before release.
- **Follow-up:** Build the app shell and Home screen with landscape-first responsive layout, safe-area handling, and tablet-width behavior.

## 2026-09-06 — Dependency governance rule

- **Area:** Engineering standards and package management.
- **What changed:** Added mandatory package-selection rules: use maintained, non-deprecated packages compatible with the installed stack; check existing dependencies before adding another library; validate peer dependencies; test and document every dependency change.
- **Flow:** Proposed package → maintenance/compatibility/security review → install or reuse → lockfile update → relevant verification → tracker entry.
- **Contracts:** No runtime API, Redux, navigation, or persisted-data contract changed.
- **Must not break:** Do not force-install incompatible peer dependencies or add duplicate/abandoned packages. A package change must preserve Android and iOS build compatibility.
- **Verification:** Documentation reviewed; `git diff --check` must pass.
- **Follow-up:** When adding Redux Toolkit, React Navigation, or any future dependency, create a dedicated tracker entry with exact versions and build/test results.
