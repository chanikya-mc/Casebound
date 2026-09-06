# 🕵️ CaseBound

> **One case. One investigation. Every day. Can you solve it?**

CaseBound is a single-player mobile detective game where each player receives **one mystery case every day**. The player reads the story, investigates suspects and evidence, makes deductions, and submits a final solution.

The game rewards:

- Correct reasoning
- Fast solving
- Consistent daily play
- Progression through detective levels
- Weekly leaderboard performance
- Long-term story progression

The first version should be simple enough for one developer to build quickly, while the architecture should leave room for advanced features later.

---

# 1. Product Vision

The goal is NOT to build another quiz application.

The goal is to create a **persistent detective game** where the user's decisions and performance matter.

### Core loop

```text
Open App
   ↓
Today's Case
   ↓
Read Story
   ↓
Inspect Evidence
   ↓
Investigate Suspects
   ↓
Find Clues
   ↓
Make Deduction
   ↓
Submit Solution
   ↓
Correct / Incorrect
   ↓
Score + XP + Rewards
   ↓
Update Detective Level
   ↓
Continue Story
   ↓
Come Back Tomorrow
```

A case should ideally take **3–10 minutes**.

---

# 2. Main Game Concept

Every day the backend publishes one official case.

Example:

## CASE #001 — The Missing Prototype

A prototype disappears from a locked office at 8:30 PM.

There are four suspects:

- Alex — Engineer
- Maya — Product Manager
- Ryan — Security Officer
- Daniel — Intern

The player receives:

- Case description
- Timeline
- Suspect profiles
- Statements
- Evidence
- Optional clues
- Final question

The player must determine:

```text
WHO did it?
HOW did they do it?
WHY did they do it?
```

The answer should be based on evidence rather than guessing.

---

# 3. Daily Gameplay

Every day the player gets exactly one primary daily case.

Example:

```text
DAY 27

🕵️ CASE #027

"The Clock That Lied"

Difficulty:
★★★★☆

Estimated Time:
6 minutes

Reward:
+500 XP
+100 Detective Points
```

The player investigates.

### Investigation screen

```text
CASE FILE

Story
Suspects
Timeline
Evidence
Clues
Notes
```

The player can move between sections.

---

# 4. Case Structure

A case should contain structured data.

```text
Case
 ├── Story
 ├── Location
 ├── Victim
 ├── Suspects
 ├── Timeline
 ├── Evidence
 ├── Statements
 ├── Clues
 ├── Solution
 ├── Difficulty
 └── Rewards
```

Example:

```json
{
  "caseId": 101,
  "title": "The Missing Prototype",
  "difficulty": 3,
  "estimatedMinutes": 6,
  "suspects": [],
  "evidence": [],
  "timeline": [],
  "solution": {},
  "xpReward": 500
}
```

The actual solution should NEVER be sent to the mobile application before submission.

---

# 5. Difficulty / Detective Levels

Players should not receive random difficulty.

Difficulty depends on their detective progression.

Example:

```text
Level 1–5
Beginner

Level 6–10
Detective

Level 11–20
Senior Detective

Level 21–30
Inspector

Level 31+
Master Detective
```

### Difficulty progression

| Level | Case Complexity |
|---|---|
| 1–5 | Simple cases |
| 6–10 | Multiple suspects |
| 11–15 | Contradictory statements |
| 16–20 | Hidden clues |
| 21–30 | Complex timelines |
| 31+ | Multi-layer investigations |

The player should gradually learn the game's investigation mechanics.

---

# 6. Difficulty Factors

Difficulty should be calculated from multiple factors.

```text
Number of suspects
+
Number of clues
+
Timeline complexity
+
False clues
+
Contradictions
+
Red herrings
+
Hidden relationships
+
Required deductions
```

Example:

### Easy

```text
3 suspects
5 clues
Simple timeline
1 correct deduction
```

### Medium

```text
4 suspects
8 clues
Conflicting statements
2-step deduction
```

### Hard

```text
6 suspects
15 clues
Red herrings
Multiple timelines
3-step deduction
```

### Expert

```text
8 suspects
20+ evidence items
Hidden relationships
Multiple possible motives
Multi-stage deduction
```

---

# 7. Story Building

The biggest retention feature should be the **long-running detective story**.

Daily cases should not always feel completely unrelated.

Use two types of cases:

### A. Standalone Cases

A case can be solved independently.

### B. Story Arc Cases

Cases slowly reveal a larger mystery.

Example:

```text
Day 1
The Missing Prototype

Day 4
The Anonymous Message

Day 8
The Broken Security Camera

Day 12
The Unknown Client

Day 20
The Hidden Organization
```

The player slowly realizes:

> These cases are connected.

This creates a reason to return every day.

---

# 8. Story Arc System

A story arc can contain:

```text
Arc
 ├── Case 1
 ├── Case 2
 ├── Case 3
 ├── Case 4
 ├── Case 5
 └── Final Case
```

Completing an arc unlocks:

- New locations
- New characters
- New case types
- Badges
- Special cases
- Story chapters

---

# 9. Streak System 🔥

Players receive a daily streak for completing the daily case.

Example:

```text
🔥 7 DAY STREAK
```

Rewards:

```text
Day 1  → +100 XP
Day 2  → +150 XP
Day 3  → Hint Token
Day 4  → +250 XP
Day 5  → Badge
Day 6  → Hint Token
Day 7  → Mystery Reward
```

Important:

The streak should be based on **server time**, not device time.

---

# 10. Streak Protection

Later add:

```text
🛡 Streak Freeze
```

A player can earn a streak freeze through gameplay.

Do NOT make this pay-to-win in the initial version.

---

# 11. Scoring System

The score should reward both:

1. Correctness
2. Speed

Example:

```text
Base Score              = 1000
Correct Solution        = +1000
Time Bonus              = +0–500
Evidence Bonus          = +0–300
No Hint Bonus           = +200
```

Possible formula:

```text
Final Score =
Correctness Score
+ Time Bonus
+ Investigation Bonus
- Hint Penalty
```

Do not make speed more important than correctness.

A player who guesses quickly should not beat someone who correctly investigated the case.

---

# 12. Weekly Leaderboard 🏆

Every week the leaderboard resets.

Example:

```text
WEEK 42

🥇 Alex        8,420
🥈 Rahul       8,100
🥉 Maya        7,920

#4 You         7,850
```

Leaderboard score can be:

```text
Weekly Score =
sum of daily case scores
```

Optional later:

```text
Best 5 of 7 cases
```

This prevents one missed day from completely destroying someone's weekly ranking.

---

# 13. Anti-Cheating Rules

The server must calculate important values.

Never trust:

```text
Client score
Client XP
Client completion time
Client leaderboard position
Client detective level
```

The mobile app should send:

```text
caseId
selectedAnswer
selectedEvidence
startedAt
submittedAt
```

The backend calculates:

```text
Correctness
Score
XP
Level
Leaderboard points
```

This is an important backend engineering feature.

---

# 14. Hints

Players can request hints.

Example:

```text
💡 Hint 1
Look carefully at the timeline.

💡 Hint 2
One suspect's statement conflicts with the CCTV.

💡 Hint 3
The important clue is connected to the missing key.
```

Hints should reduce score slightly.

Example:

```text
No hints       → 100%
1 hint         → 90%
2 hints        → 75%
3 hints        → 50%
```

---

# 15. UI / UX

Use a clean dark detective theme.

The application should feel like a **case investigation tool**, not a normal quiz app.

## Orientation

CaseBound is a **landscape-only mobile game**. The app must launch in landscape and remain locked there on Android and iOS. Design investigation boards, evidence, timelines, and final deduction flows for the horizontal layout; portrait support is out of scope for V1.

Suggested screens:

```text
Splash
  ↓
Login / Guest
  ↓
Home
  ↓
Today's Case
  ↓
Case Investigation
  ├── Story
  ├── Suspects
  ├── Evidence
  ├── Timeline
  ├── Clues
  └── Notes
  ↓
Final Deduction
  ↓
Result
  ↓
Score / XP
  ↓
Leaderboard
```

---

# 16. Home Screen

Example layout:

```text
--------------------------------
🕵️ CASEBOUND

🔥 12 DAY STREAK

Detective Level
Senior Detective
██████████░░ 72%

TODAY'S CASE

"The Clock That Lied"

★★★★☆
6 min

[ START INVESTIGATION ]

--------------------------------

🏆 Weekly Rank #14

📚 Case History

🎖 Achievements

👤 Profile
--------------------------------
```

The **Start Investigation** button should be the main focus.

---

# 17. Case Investigation UI

Use tabs/cards:

```text
┌─────────────────────────┐
│ CASE #027               │
│ The Clock That Lied     │
└─────────────────────────┘

[ STORY ]

A short immersive story...

[ SUSPECTS ]

👤 Alex
👤 Maya
👤 Ryan
👤 Daniel

[ TIMELINE ]

8:00 PM
8:15 PM
8:30 PM
8:45 PM

[ EVIDENCE ]

🔑 Key
📱 Phone
🎥 CCTV
📝 Note

[ MAKE DEDUCTION ]
```

Avoid showing too much information on one screen.

---

# 18. Final Deduction Screen

The final screen should feel important.

```text
WHO IS RESPONSIBLE?

○ Alex
○ Maya
○ Ryan
○ Daniel

HOW?

○ Stole the key
○ Disabled CCTV
○ Used duplicate access
○ Unknown method

WHY?

○ Money
○ Revenge
○ Corporate espionage
○ Personal reason

[ SUBMIT FINAL DEDUCTION ]
```

This creates a proper investigation instead of a simple multiple-choice question.

---

# 19. Result Screen

If correct:

```text
🎉 CASE SOLVED!

Excellent Detective Work.

You identified:
Ryan

Correct deductions:
3/3

Time:
04:32

Score:
1,420

XP:
+500

🔥 Streak:
12 days

[ VIEW CASE EXPLANATION ]
```

If incorrect:

```text
CASE UNSOLVED

Your deduction was incorrect.

You identified:
Alex

Actual culprit:
Ryan

Your missed clue:
The CCTV timestamp.

Don't worry.

Tomorrow's case is waiting.

[ REVIEW EVIDENCE ]
```

Do not make failure feel punishing.

---

# 20. Case Explanation

After solving, always explain the solution.

Example:

```text
WHY RYAN?

1. Ryan claimed he left at 8:10.
2. CCTV shows his access card at 8:27.
3. The missing key was used at 8:29.
4. His statement therefore conflicts with the evidence.

The key deduction was the access-card timestamp.
```

This makes the game satisfying and educational.

---

# 21. Backend Architecture

Recommended stack:

```text
React Native
       ↓
NestJS REST API
       ↓
PostgreSQL
```

Later:

```text
React Native
       ↓
NestJS
 ┌─────┼─────────────┐
 ↓     ↓             ↓
Postgres Redis     Worker
                   ↓
                Scheduled Jobs
```

---

# 22. Frontend Stack

Recommended:

- React Native
- TypeScript
- React Navigation
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios
- AsyncStorage
- NativeWind OR StyleSheet

Do not install everything on day one.

Start with:

```text
React Native
TypeScript
React Navigation
Axios
TanStack Query
Zustand
```

---

# 23. Backend Stack

Recommended:

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT
- class-validator
- bcrypt/argon2
- Swagger

Later:

- Redis
- BullMQ
- WebSockets
- Docker

---

# 24. Backend Modules

Recommended NestJS structure:

```text
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── guards/
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── cases/
│   ├── cases.controller.ts
│   ├── cases.service.ts
│   ├── cases.module.ts
│   └── dto/
│
├── investigations/
│   ├── investigations.controller.ts
│   ├── investigations.service.ts
│   ├── investigation.engine.ts
│   └── investigations.module.ts
│
├── submissions/
│   ├── submissions.controller.ts
│   ├── submissions.service.ts
│   └── submissions.module.ts
│
├── scoring/
│   ├── scoring.service.ts
│   └── scoring.module.ts
│
├── streaks/
│   ├── streaks.service.ts
│   └── streaks.module.ts
│
├── leaderboard/
│   ├── leaderboard.controller.ts
│   ├── leaderboard.service.ts
│   └── leaderboard.module.ts
│
├── achievements/
│   ├── achievements.service.ts
│   └── achievements.module.ts
│
├── story/
│   ├── story.service.ts
│   └── story.module.ts
│
├── health/
│
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── utils/
│
└── main.ts
```

---

# 25. Frontend Structure

```text
src/
│
├── api/
│   ├── client.ts
│   ├── auth.api.ts
│   ├── cases.api.ts
│   ├── investigation.api.ts
│   └── leaderboard.api.ts
│
├── components/
│   ├── CaseCard.tsx
│   ├── SuspectCard.tsx
│   ├── EvidenceCard.tsx
│   ├── Timeline.tsx
│   ├── ProgressBar.tsx
│   ├── StreakBadge.tsx
│   └── ScoreCard.tsx
│
├── screens/
│   ├── Home/
│   ├── Case/
│   ├── Investigation/
│   ├── Result/
│   ├── Leaderboard/
│   ├── History/
│   ├── Achievements/
│   └── Profile/
│
├── navigation/
│
├── store/
│   ├── auth.store.ts
│   └── investigation.store.ts
│
├── hooks/
│
├── types/
│
├── utils/
│
└── App.tsx
```

---

# 26. Database Design

Main tables:

```text
users
cases
case_suspects
case_evidence
case_timeline
case_clues
case_solutions
daily_cases
investigations
submissions
user_stats
streaks
leaderboard_entries
achievements
user_achievements
story_arcs
story_progress
```

---

# 27. Important User Tables

### users

```text
id
username
email
password_hash
created_at
```

### user_stats

```text
user_id
detective_level
xp
total_cases
solved_cases
best_score
current_streak
longest_streak
```

---

# 28. Case Tables

### cases

```text
id
title
description
difficulty
estimated_minutes
xp_reward
status
story_arc_id
created_at
```

### case_suspects

```text
id
case_id
name
description
occupation
motive
```

### case_evidence

```text
id
case_id
title
description
type
importance
```

### case_timeline

```text
id
case_id
event_time
description
order_index
```

---

# 29. Investigation Table

```text
investigations

id
user_id
case_id
started_at
submitted_at
status
score
xp_earned
hints_used
is_correct
```

This gives a permanent history of the player's investigations.

---

# 30. Submission Idempotency

This is an important backend problem.

A player should not be able to submit the same case 10 times and receive rewards 10 times.

Use a unique rule such as:

```text
UNIQUE(user_id, daily_case_id)
```

Backend flow:

```text
Submit
 ↓
Check existing investigation
 ↓
Already submitted?
 ├── YES → return existing result
 └── NO
      ↓
Evaluate
      ↓
Transaction
      ↓
Update XP
      ↓
Update streak
      ↓
Update leaderboard
      ↓
Save result
```

This is a good real-world backend concept to learn.

---

# 31. Daily Case System

Do not let the mobile app decide which case is today's case.

Backend determines:

```text
today = server date
```

Then:

```text
daily_cases

date
case_id
published_at
```

Example:

```text
2026-09-01 → Case 101
2026-09-02 → Case 102
2026-09-03 → Case 103
```

This guarantees that all users receive the same daily challenge.

---

# 32. Time Zone

Use UTC internally.

Convert to the player's configured timezone when deciding the daily experience.

Initially you can simplify this by using one global daily reset time.

Later support:

```text
Asia/Kolkata
America/New_York
Europe/London
...
```

---

# 33. Weekly Leaderboard

Store:

```text
leaderboard_entries

id
user_id
week_id
score
rank
```

A week can be represented by:

```text
2026-W36
```

At the beginning of a new week:

```text
new week
 ↓
new leaderboard
```

Do not delete historical leaderboard data.

---

# 34. API Design

### Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/refresh
```

### User

```http
GET /users/me
GET /users/me/stats
```

### Daily Case

```http
GET /daily-case
GET /cases/:id
```

### Investigation

```http
POST /investigations/start
GET /investigations/:id
POST /investigations/:id/hint
POST /investigations/:id/submit
```

### Leaderboard

```http
GET /leaderboard/weekly
GET /leaderboard/weekly/me
```

### History

```http
GET /history
GET /history/:id
```

### Achievements

```http
GET /achievements
GET /achievements/me
```

---

# 35. API Response Example

GET `/daily-case`

```json
{
  "id": 101,
  "title": "The Missing Prototype",
  "difficulty": 3,
  "estimatedMinutes": 6,
  "story": "...",
  "suspects": [],
  "evidence": [],
  "timeline": [],
  "hasStarted": false
}
```

Do NOT include:

```text
correctSuspect
correctEvidence
solution
```

---

# 36. Admin / Case Management

Initially, do NOT build a complex admin application.

Store cases as seed data.

Example:

```text
prisma/
 ├── schema.prisma
 └── seed.ts
```

Later create:

```text
Admin Dashboard
```

with:

```text
Create Case
Edit Case
Publish Case
Schedule Case
Create Story Arc
Manage Difficulty
View Case Statistics
```

---

# 37. Case Content Format

Cases can eventually be stored as JSON.

Example:

```json
{
  "title": "The Clock That Lied",
  "difficulty": 4,
  "story": "...",
  "suspects": [
    {
      "id": "s1",
      "name": "Alex",
      "statement": "..."
    }
  ],
  "evidence": [
    {
      "id": "e1",
      "description": "..."
    }
  ],
  "timeline": [],
  "solution": {
    "suspectId": "s3",
    "method": "..."
  }
}
```

This makes it easier to create cases without changing application code.

---

# 38. Case Engine

Create a dedicated service:

```text
InvestigationEngine
```

Responsibilities:

```text
validate evidence
validate deductions
calculate score
calculate hint penalty
calculate time bonus
generate result
```

Do not put game rules inside controllers.

Bad:

```text
controller {
   calculate score
   update XP
   update streak
}
```

Better:

```text
Controller
   ↓
InvestigationService
   ↓
InvestigationEngine
   ↓
ScoringService
   ↓
ProgressionService
```

---

# 39. Event-Based Architecture Later

When the project becomes larger, introduce events.

Example:

```text
CaseSolvedEvent
      ↓
 ┌────┼────┬────────┐
 ↓    ↓    ↓        ↓
XP  Streak Badge  Leaderboard
```

This reduces coupling between modules.

NestJS events can be introduced later.

---

# 40. Redis — Later, Not Day One

Redis can eventually handle:

```text
Daily case cache
Leaderboard cache
Rate limiting
Session-related data
Temporary investigation state
```

Do NOT add Redis just because it looks impressive.

First build a working PostgreSQL version.

---

# 41. Scheduled Jobs

Eventually you can run scheduled jobs for:

```text
Publish tomorrow's case
Close weekly leaderboard
Calculate weekly winners
Create new story arc
Send reminders
Generate statistics
```

Example:

```text
Daily job
   ↓
Publish daily case

Weekly job
   ↓
Close leaderboard
   ↓
Calculate winners
   ↓
Award badges
```

NestJS Schedule can be used.

---

# 42. Notifications — Later

Optional mobile notifications:

```text
🕵️ A new case is waiting.

"The Locked Room"

Can you solve it?
```

Only add this after the core game works.

---

# 43. Offline Support — Later

A future improvement:

Allow the user to read already downloaded case content offline.

But final submission should normally require server connectivity.

Architecture:

```text
API
 ↓
Local Cache
 ↓
React Native
```

This is another useful mobile-development problem to learn later.

---

# 44. Security

Important rules:

### Never send solutions to client.

### Never trust client score.

### Never trust client XP.

### Never trust client level.

### Validate all IDs.

### Rate-limit submission endpoints.

### Prevent duplicate submissions.

### Hash passwords.

### Use JWT access/refresh tokens.

### Validate request DTOs.

### Use database transactions for reward updates.

---

# 45. Testing

Backend:

```text
Unit tests
Integration tests
E2E tests
```

Important tests:

```text
correct solution
incorrect solution
duplicate submission
hint calculation
score calculation
streak calculation
level calculation
leaderboard calculation
```

Frontend:

```text
Case rendering
Investigation navigation
Answer submission
Result rendering
Leaderboard
```

---

# 46. Git Structure

Recommended:

```text
daily-detective/
│
├── mobile/
├── server/
├── docs/
├── README.md
└── .gitignore
```

Git branches:

```text
main
develop
feature/auth
feature/daily-case
feature/investigation
feature/leaderboard
```

For a solo project, you can also keep it simpler:

```text
main
feature/*
```

---

# 47. Environment Variables

Never commit secrets.

### Server

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
PORT=3000
```

### Mobile

```env
API_URL=
```

Use:

```text
.env
.env.example
```

Commit `.env.example`, never real credentials.

---

# 48. Development Phases

## Phase 1 — Core Game

Goal:

> Play one case from beginning to end.

Build:

```text
React Native app
NestJS API
PostgreSQL
Case model
Daily case
Investigation
Answer submission
Result
```

Do NOT build leaderboard yet.

---

# 49. Phase 2 — Player Progression

Add:

```text
XP
Detective level
Case history
Statistics
Achievements
```

Now players have progression.

---

# 50. Phase 3 — Daily Retention

Add:

```text
Daily streak
Streak rewards
Daily reset
Hint system
Daily case completion
```

This is when the app starts feeling like a real daily game.

---

# 51. Phase 4 — Competition

Add:

```text
Weekly leaderboard
Weekly score
Rank
Weekly rewards
```

Now users have a reason to compete.

---

# 52. Phase 5 — Story

Add:

```text
Story arcs
Recurring characters
Connected cases
Unlockable chapters
Special cases
Multiple endings
```

This is where the game becomes more than daily puzzles.

---

# 53. Phase 6 — Advanced Backend

After the game is stable:

```text
Redis
Caching
Queues
Scheduled jobs
Events
Rate limiting
Analytics
Offline sync
Optimistic locking
```

These features should be added because the product needs them, not only to make the resume longer.

---

# 54. Phase 7 — Content Engine

Create tools to generate/manage cases.

```text
Case Builder
   ↓
Validate Case
   ↓
Preview
   ↓
Schedule
   ↓
Publish
```

Eventually cases can be created from structured templates.

---

# 55. AI — Optional Future Feature

Do NOT make AI responsible for deciding whether a player is correct.

Core game logic should remain deterministic.

AI can later help with:

```text
Case idea generation
Character descriptions
Story writing
Dialogue variations
Hint wording
Case drafts
```

But the final:

```text
culprit
evidence
solution
score
```

should be controlled by your game engine/database.

This makes the game predictable and secure.

---

# 56. Free-Only Development

The project should be designed to work without paid services.

Use:

```text
React Native
NestJS
PostgreSQL
Prisma
TypeScript
Open-source npm packages
Local development
Git
GitHub
Docker
```

For the first version, avoid dependencies on paid:

```text
AI APIs
SMS APIs
Paid databases
Paid analytics
Paid maps
Paid notification services
```

You can build the complete MVP locally for ₹0.

---

# 57. Daily Development Targets

The first goal is NOT perfection.

The goal is:

> **Get one playable case working as quickly as possible.**

## Day 1 — Project Setup

Frontend:

```text
Create React Native project
Setup TypeScript
Setup navigation
Create basic theme
```

Backend:

```text
Create NestJS project
Setup Prisma
Connect PostgreSQL
Create health endpoint
```

---

## Day 2 — Database

Create:

```text
User
Case
Suspect
Evidence
Timeline
Investigation
```

Run migrations.

Create seed data for 3 cases.

---

## Day 3 — Backend Case APIs

Build:

```http
GET /daily-case
GET /cases/:id
```

Return case information.

---

## Day 4 — Home UI

Build:

```text
Home screen
Streak display
Detective level
Today's case card
Start button
```

---

## Day 5 — Investigation UI

Build:

```text
Story
Suspects
Evidence
Timeline
```

Focus on good UX.

---

## Day 6 — Submit Solution

Backend:

```text
POST /investigations/start
POST /investigations/:id/submit
```

Implement:

```text
Correctness
Score
Time
XP
```

---

## Day 7 — Complete First Vertical Slice

The user should be able to:

```text
Open app
 ↓
See case
 ↓
Investigate
 ↓
Solve
 ↓
Submit
 ↓
See score
```

At the end of Day 7 you should have a real playable game.

---

# 58. Week 2

Build:

```text
Authentication
Player profile
XP
Levels
Case history
Streak
```

---

# 59. Week 3

Build:

```text
Hints
Achievements
Better animations
Result screen
Story progression
```

---

# 60. Week 4

Build:

```text
Weekly leaderboard
Weekly reset
Ranks
Weekly rewards
```

At this point you have a strong MVP.

---

# 61. First 30-Day Content Plan

Do not try to create 365 cases immediately.

Create:

```text
30 cases
```

Suggested:

```text
10 Easy
10 Medium
7 Hard
3 Expert
```

Create 3 story arcs:

```text
ARC 1
The Missing Files
Cases 1–10

ARC 2
The Silent Witness
Cases 11–20

ARC 3
The Unknown Detective
Cases 21–30
```

---

# 62. Interesting Case Types

Do not make every case:

> "Who is the murderer?"

Use different mechanics.

### Missing object

Find what happened to something.

### Theft

Identify thief + method.

### Fraud

Find the false transaction.

### Locked room

Determine how someone entered.

### Disappearance

Find what happened to a person.

### Cyber mystery

Trace a digital event.

### Alibi

Find the contradiction.

### Timeline

Reconstruct events.

### Hidden identity

Determine who someone really is.

### Conspiracy

Connect several pieces of evidence.

This prevents repetition.

---

# 63. Special Case Mechanics

Later add:

```text
🔐 Locked room
⏱ Timeline reconstruction
📞 Phone records
🎥 CCTV
🧬 DNA evidence
💳 Financial records
📍 Location history
📝 Handwriting
🔊 Audio clues
📷 Image clues
```

Each mechanic should introduce a new way to think.

---

# 64. Player Notes

Allow players to maintain notes.

Example:

```text
MY NOTES

Ryan says he left at 8:10.

But CCTV:
8:27 → Ryan's card used.

Possible contradiction.
```

This makes the player feel like a real detective.

---

# 65. Detective Notebook

Create a future screen:

```text
📓 DETECTIVE NOTEBOOK

Characters
Evidence
Solved Cases
Unsolved Questions
Important Clues
Story Connections
```

This becomes particularly useful in long story arcs.

---

# 66. Achievements

Examples:

```text
🕵️ First Case
Solve your first case.

🔥 Dedicated Detective
7-day streak.

⚡ Speed Detective
Solve a case in under 3 minutes.

🔎 Eagle Eye
Solve without hints.

🏆 Perfect Detective
Get maximum score.

📚 Case Collector
Solve 30 cases.

🧠 Mastermind
Solve 10 hard cases.
```

---

# 67. Weekly Rewards

Example:

```text
🥇 Rank #1
Master Detective badge
+2000 XP

🥈 Rank #2
Elite Detective badge
+1500 XP

🥉 Rank #3
Elite Detective badge
+1000 XP

Top 10%
+500 XP
```

Rewards should mainly be cosmetic/progression-based so the leaderboard remains fair.

---

# 68. Retention Design

The user should have multiple reasons to return:

```text
TODAY
 ↓
Daily case

STREAK
 ↓
Don't break your streak

PROGRESSION
 ↓
Reach next detective level

STORY
 ↓
Find out what happens next

COMPETITION
 ↓
Improve weekly rank

COLLECTION
 ↓
Unlock achievements

MASTERY
 ↓
Solve harder cases
```

This is much stronger than simply:

> "Come back tomorrow for another quiz."

---

# 69. Important Product Rule

Never make cases artificially difficult.

A difficult case should feel:

> "I should have noticed that!"

Not:

> "There was no way I could know that."

Every correct answer must be logically supported by evidence.

This is extremely important for player trust.

---

# 70. MVP Definition

Version 1 is complete when this works:

```text
User
 ↓
Login
 ↓
Home
 ↓
Today's Case
 ↓
Story
 ↓
Suspects
 ↓
Evidence
 ↓
Timeline
 ↓
Final Deduction
 ↓
Server Evaluation
 ↓
Score
 ↓
XP
 ↓
Streak
```

And the same player cannot claim the same daily reward twice.

---

# 71. V1 Features to Avoid

Do NOT initially build:

```text
❌ Multiplayer
❌ Chat
❌ AI-generated cases
❌ Complex admin dashboard
❌ Real-time WebSockets
❌ Microservices
❌ Kubernetes
❌ Payment system
❌ Social network
❌ Complicated recommendation engine
```

These can come later.

---

# 72. What You Will Learn

This project is especially useful for improving beyond normal CRUD/e-commerce development.

### Frontend

```text
React Native navigation
State management
API caching
Complex UI states
Animations
Offline data
Game-like UX
Performance
```

### Backend

```text
NestJS architecture
Domain logic
Transactions
Concurrency
Idempotency
Authentication
Authorization
Scheduled jobs
Caching
Rate limiting
Leaderboard algorithms
Event-driven architecture
```

### Database

```text
Relational modeling
Indexes
Constraints
Transactions
Aggregations
Ranking queries
Historical data
```

### System Design

Eventually:

```text
Mobile App
     ↓
API
     ↓
Game Engine
     ↓
PostgreSQL
     ↓
Redis
     ↓
Background Workers
     ↓
Scheduled Jobs
```

This makes the project a strong portfolio piece.

---

# 73. Resume Project Description

Once completed, a strong description could be:

> **CaseBound — Full-Stack Mobile Game**
>
> Built a single-player daily investigation game using React Native, NestJS, PostgreSQL and TypeScript. Designed a deterministic case engine supporting evidence-based deductions, difficulty progression, XP, streaks, achievements and weekly leaderboards. Implemented server-side scoring, idempotent case submissions, transactional player progression and persistent story arcs.

Do not claim features you have not actually implemented.

---

# 74. Recommended Final Architecture

```text
                    ┌─────────────────────┐
                    │   React Native App  │
                    │                     │
                    │ Home                │
                    │ Daily Case          │
                    │ Investigation       │
                    │ Results             │
                    │ Leaderboard          │
                    └──────────┬──────────┘
                               │
                              REST
                               │
                    ┌──────────▼──────────┐
                    │      NestJS API     │
                    │                     │
                    │ Auth                │
                    │ Cases               │
                    │ Investigation       │
                    │ Scoring             │
                    │ Progression         │
                    │ Streak              │
                    │ Leaderboard         │
                    │ Story               │
                    └──────┬───────┬──────┘
                           │       │
                    ┌──────▼──┐ ┌─▼─────────┐
                    │PostgreSQL│ │   Redis   │
                    │          │ │  Later    │
                    └──────────┘ └───────────┘
                           │
                    ┌──────▼─────────────┐
                    │ Scheduled / Worker  │
                    │                     │
                    │ Daily publishing    │
                    │ Weekly reset        │
                    │ Rewards             │
                    └─────────────────────┘
```

---

# 75. The Most Important Development Rule

Build from **vertical slices**, not all frontend first and all backend later.

Bad approach:

```text
Month 1
Only frontend

Month 2
Only backend

Month 3
Integration
```

Better:

```text
Slice 1
Home → API → Case

Slice 2
Case → Investigation → API

Slice 3
Submit → Scoring → Database

Slice 4
Result → XP → Streak

Slice 5
Leaderboard
```

Every slice produces something playable.

---

# 76. Final Roadmap

```text
                     CASEBOUND

                           │
                           ▼
                    ┌─────────────┐
                    │   MVP       │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           Cases         XP/Level      Streak
              │            │            │
              └────────────┼────────────┘
                           ▼
                    Weekly Leaderboard
                           │
                           ▼
                     Story Arcs
                           │
                           ▼
                    Advanced Cases
                           │
                           ▼
                    Case Generator
                           │
                           ▼
                     AI Assistance
                           │
                           ▼
                  Large Detective World
```

---

# 77. Immediate Next Step

Do NOT start by building every feature in this README.

Start with exactly this:

```text
1. Create React Native project
2. Create NestJS project
3. Create PostgreSQL database
4. Create Case schema
5. Create 3 sample cases
6. Build Home screen
7. Build Case screen
8. Build Investigation screen
9. Build Submit API
10. Build scoring
11. Build Result screen
```

Once one complete case works from **Home → Investigation → Solution → Result**, the foundation is ready.

Then add:

```text
XP
 ↓
Levels
 ↓
Streak
 ↓
Achievements
 ↓
Story
 ↓
Leaderboard
```

That order keeps the project achievable while still giving you plenty of opportunities to learn serious full-stack engineering.
