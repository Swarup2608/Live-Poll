# Loopballot Backend — Implementation Plan

**Status: Ready for review**

## Context

The Loopballot frontend (`client/`) is a fully-built Next.js UI for a live event polling app (Slido/Mentimeter-style), but every page runs on hardcoded demo data and local React state — there is no auth, no persistence, no real-time sync, and not a single `fetch()` call in the codebase (confirmed by grep). Buttons like "Save poll," "Create event," "Delete room," and the login form are wired to nothing. A minimal Express scaffold already exists at `server/` (health check, CORS, helmet, rate limiting, error handling — committed, treat as fixed) but has no routes, database, auth, or real-time layer yet.

The goal: design and build the real backend this app needs, end to end — turning every page from a static mockup into a working product, including the piece that actually differentiates this app (the live control-room ↔ audience ↔ projector sync engine).

**Decisions confirmed with the user:**

| Decision | Choice |
|---|---|
| Scope | Full roadmap — auth → core CRUD → live engine → Q&A → analytics → billing/teams → hardening, not just an MVP slice |
| Team model | Multi-tenant organizations — events belong to an org with member roles (Owner/Admin/Editor/Viewer) and org-level billing |
| Server language | TypeScript — migrate `server/server.js` as part of Phase 0 |

---

## 1. Data Model (Postgres + Prisma)

Relational DB because the core integrity requirements — no double voting, one upvote per attendee per question, FK-consistent agenda/poll/room chains — are exactly what relational unique constraints and transactions are built for. `uuid` PKs everywhere except the 6-digit public `room_code`. Enums are Postgres native enums; timestamps `timestamptz`.

### users
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| name | text | |
| email | citext unique | login identity |
| password_hash | text, nullable | null if OAuth-only |
| google_id | text, nullable | |
| website | text | |
| avatar_url | text | |
| notify | boolean | |
| preferred_theme | enum | light / dark / midnight / professional / disco / shootout / sea / grayscale / sunset / forest — matches `ThemeContext.tsx`'s `THEMES` exactly |
| created_at / updated_at | timestamptz | |

### organizations
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| name | text | |
| current_plan_id | enum | starter / team / enterprise |
| stripe_customer_id | text | |
| stripe_subscription_id | text | |
| created_at / updated_at | timestamptz | |

### organization_members
| Field | Type | Notes |
|---|---|---|
| org_id, user_id | uuid fk | composite key once active |
| role | enum | Owner / Admin / Editor / Viewer |
| invited_email | text | |
| status | enum | invited / active |
| created_at | timestamptz | |

### events
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| organization_id | uuid fk | |
| name | text | |
| date | date | |
| start_time | time | |
| format | enum | inperson / virtual / hybrid |
| accent_color | text | |
| logo_url | text | |
| status | enum | draft / upcoming / live / past — derived/cached, recomputed on read |
| created_at / updated_at | timestamptz | |

### rooms
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| event_id | uuid fk, unique | 1:1 with event |
| room_code | char(6), unique, indexed | numeric, regenerable |
| require_name | boolean | |
| lock_room_after_start | boolean | |
| require_approval_for_questions | boolean | |
| allow_anonymous_questions | boolean | |
| logo_url | text, nullable | overrides event logo |
| accent_color | text, nullable | overrides event accent |
| is_locked | boolean | |
| active_agenda_item_id | uuid fk, nullable | |
| active_item_state | jsonb | `{locked, revealed, timerEndsAt, timerDurationSec}` |
| created_at / updated_at | timestamptz | |

> **Live-state policy:** `active_item_state` is written-through to Postgres on discrete events (lock/unlock, reveal/hide, agenda advance, timer start/stop) — **never on per-second ticks**. The timer's source of truth is `timerEndsAt` (absolute timestamp); every client computes `remaining = timerEndsAt - now()` independently, which is what makes it survive refresh without write-amplification. A hot in-memory/Redis copy is used by the real-time layer for actual per-connection reads (§2).

### agenda_items
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| room_id | uuid fk | agenda is scoped to the room/session, not the event |
| kind | enum | poll / qa |
| position | int | full-array renumber on reorder — simplicity wins over fractional indexing at this scale |
| poll_id | uuid fk, nullable, unique | |
| qa_config | jsonb | e.g. `{title}`, placeholder for future per-item overrides |
| created_at / updated_at | timestamptz | |

> Reconciles the two shapes currently duplicated in the frontend (`event-builder`'s authoring shape with a `subtitle` string vs. `control-room`'s runtime shape with `options[]`/`voteCount`). Canonical model: this table holds identity/ordering only; poll fields live on `polls`. The builder's `subtitle` ("Multiple choice · 3 options") is **computed at read time** from the joined poll — never stored — so it can't drift from the real config, a real bug class in the current pure-frontend implementation.

### polls
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| question | text | |
| type | enum | mc / rating / open |
| rating_scale | smallint, nullable | 5 or 10 |
| allow_vote_changes_before_lock | boolean | |
| show_live_results | boolean | |
| multi_select | boolean | mc only |
| anonymous | boolean | |
| time_limit_sec | smallint, nullable | null = "none," else 15/30/60 |
| created_at / updated_at | timestamptz | |

### poll_options
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| poll_id | uuid fk | |
| text | text | |
| position | smallint | |

> Kept as a real table, not JSON, because options need stable ids referenced by `votes`, indexed `GROUP BY` aggregation for tallies, and referential integrity against deleted options.

### votes
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| poll_id | uuid fk | |
| attendee_session_id | uuid fk | |
| option_id | uuid fk, nullable | mc |
| rating_value | smallint, nullable | rating |
| open_text | text, nullable | open |
| submitted_at / updated_at | timestamptz | |

> Double-vote prevention: `UNIQUE(poll_id, attendee_session_id, option_id)` for multi-select; app-enforced "exactly one vote row per (poll_id, attendee_session_id)" for non-multi-select, checked inside a row-locked/serializable transaction at submit time — not check-then-insert, which races under retry. Percentages are **always** computed server-side via `GROUP BY`, never trusted from the client.

### questions
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| room_id | uuid fk | room-scoped — matches control-room's single moderation queue, not tied to one agenda item |
| text | text | |
| votes | int | denormalized upvote count, kept in sync with `question_upvotes` |
| pinned / hidden | boolean | |
| approved | boolean | defaults false if `room.require_approval_for_questions` |
| anonymous | boolean | display-only flag |
| author_session_id | uuid fk | always populated even when `anonymous`, so moderation/abuse handling is still possible |
| created_at / updated_at | timestamptz | |

### question_upvotes
| Field | Type | Notes |
|---|---|---|
| question_id, attendee_session_id | uuid fk | **composite PK** — this *is* the one-per-session enforcement |
| created_at | timestamptz | |

> A duplicate insert fails at the DB level and is treated as an idempotent no-op, not an error — client retries after reconnect shouldn't surface failures.

### attendee_sessions
| Field | Type | Notes |
|---|---|---|
| id | uuid, issued as signed cookie/JWT value | |
| room_id | uuid fk | |
| display_name | text, nullable | only if `require_name` |
| device_fingerprint | text, nullable | secondary signal only |
| created_at / last_seen_at | timestamptz | heartbeat |
| reconnect_token | text | separate secret from session id, used by `ReconnectingOverlay`'s resume flow |

> No `users` account — this is the anti-abuse identity for audience members, who never sign up. Live presence (attendee count) is **not** a persisted table — it's computed from active Socket.IO connections per room to avoid write churn on a number that only matters transiently; `last_seen_at` is only the degraded-mode fallback.

### uploads
| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| owner_type | enum | user / room |
| owner_id | uuid | |
| storage_key / url | text | |
| content_type / size_bytes | | |
| created_at | timestamptz | |

### invoices
| Field | Type | Notes |
|---|---|---|
| id | text | Stripe invoice id |
| organization_id | uuid fk | |
| period_label / amount_cents / currency / status / hosted_invoice_url | | mirrored from Stripe webhooks |
| created_at | timestamptz | |

> Card data (`card_brand`, `card_last4`) copied only from Stripe's PaymentMethod object via webhook — **raw PAN/CVC never touch this server**, replacing the current mock UI in `account-settings/page.tsx` that fakes local card storage.

**Analytics:** no dedicated table for v1. Summary stats/exports are computed on read from `votes` / `questions` / `question_upvotes` / `attendee_sessions` so they can never drift from raw data. Add an `event_summary_cache` jsonb snapshot (written once when a room transitions to "ended") only later if read performance demands it — not needed at initial scale.

---

## 2. Technology Choices

**Database + ORM — PostgreSQL + Prisma.** Relational integrity (votes → options → polls → agenda → rooms → events, unique constraints for anti-double-voting) is the core requirement; Prisma is ESM/TypeScript-friendly and gives migrations plus generated types across the whole API surface.

**Real-time — Socket.IO.** Requirements are per-room broadcast (agenda / lock / reveal / tallies / timer / Q&A / presence) plus reconnect/session-resumption — and the frontend already has a `ReconnectingOverlay` component and a `simulateDisconnect` stub expecting exactly this UX. Socket.IO's "rooms" primitive maps 1:1 onto `room_code`, and its built-in reconnection/backoff events (`reconnect_attempt` / `reconnect` / `disconnect`) drive the overlay directly.
- Raw WebSocket would mean hand-rolling all of that.
- SSE is one-directional and doesn't fit since attendees also send votes/questions/upvotes over the same low-latency path.
- Polling is explicitly too slow for "sub-second sync" requirements like live tallies and the countdown timer.
- Single Socket.IO room per session: `room:{roomCode}`, role-filtered event handling rather than separate host/audience channels (payloads are small/low-frequency enough that this is simpler).
- Scaling: default in-memory adapter is single-instance only; add `@socket.io/redis-adapter` in Phase 6 if horizontal scaling is actually needed — not before.

**Auth — two distinct systems:**
- *Host accounts:* JWT access token (~15 min) + rotating httpOnly refresh cookie (~30 days). `argon2id` preferred for password hashing. OAuth via Google authorization-code flow. Express `requireAuth` middleware reads `Authorization: Bearer`; frontend gets real route guards for the first time via a `/auth/me` check.
- *Attendee sessions:* no accounts. A signed httpOnly room-scoped cookie/JWT (`roomId` + `sessionId` claims) issued on `POST /rooms/:code/join`, also passed to the Socket.IO handshake (`socket.handshake.auth.token`) so votes/upvotes/questions are attributable without ever asking for a password or email.

**File/logo storage — S3-compatible object storage (S3 or Cloudflare R2), presigned uploads.** Replaces the current `URL.createObjectURL` fakes in `room-settings`/`account-settings`. Client requests a presigned PUT via `POST /uploads/presign`, uploads directly to storage, then `POST /uploads/:id/confirm` persists the row — binary bytes never pass through Express's `express.json({ limit: "100kb" })` parser.

**Validation — Zod.** Shared schemas validate both REST bodies and Socket.IO event payloads (the latter need it just as much — e.g. rejecting a malformed `submitVote` payload from a compromised client).

**Payments — Stripe (Elements/PaymentIntents).** Server only ever stores what Stripe's API returns (`paymentMethodId`, `card_brand`, `card_last4`) — never raw digits. This fully replaces the current mock card-collection code in `account-settings/page.tsx`, which must not be "sanitized" but removed outright.

**Presence/hot live-state cache — Redis, deferred.** For initial scale (thousands, not hundreds of thousands, of concurrent attendees) an in-process `Map` for hot room state plus Socket.IO's in-memory adapter is sufficient; add Redis when load testing (Phase 6) shows a real need.

**QR payload — signed, versioned token.** Replaces the current bare `\d{6}` regex extraction (today any 6 digits in any scanned QR works — trivial to spoof/enumerate). New format: `https://loopballot.app/j/{roomCode}?t={hmacToken}` where the token is an HMAC over `roomCode + expiryWindow`; the join page verifies via `POST /rooms/lookup-qr` before navigating. Manual code entry is unaffected.

---

## 3. API Surface

Base path `/api/v1`, mounted as a new router under the existing `server.ts` (preserve `/health`, the 404 handler, and the production error-hiding behavior exactly as committed — new routes/middleware are added, not reordered ahead of the existing helmet/cors/rate-limit/body-parser stack).

| Resource | Endpoints |
|---|---|
| **Auth** | `POST /auth/signup` · `/auth/login` · `/auth/logout` · `/auth/refresh` · `GET /auth/google` · `GET /auth/google/callback` · `POST /auth/forgot-password` · `/auth/reset-password` · `GET /auth/me` |
| **Account/org** | `GET\|PATCH /account` · `POST /account/password` · `POST /account/avatar` · `GET /account/plan` · `POST /account/plan` · `GET\|POST /account/payment-method` · `GET /account/invoices[/:id/download]` · `GET /account/team` · `POST /account/team/invite` · `PATCH\|DELETE /account/team/:memberId` |
| **Events** | `GET /events?status=upcoming\|past` · `POST /events` · `GET\|PATCH\|DELETE /events/:id` · `GET /account/overview` (dashboard aggregate stats: votesCast, avgParticipationPct, participationBars[5], questionsAnsweredOnAirPct, last 30 days) |
| **Rooms** | `GET /rooms/:roomCode` (public join-flow lookup, minimal fields only) · `POST /rooms/lookup-qr` · `GET\|PATCH /events/:eventId/room` · `POST /events/:eventId/room/regenerate-code` · `DELETE /events/:eventId/room` · `GET /rooms/:roomCode/state` (rehydration: active item, lock/reveal state, timer via `timerEndsAt`, attendee count — called once before a client subscribes to the socket) |
| **Agenda** | `GET\|POST /rooms/:roomId/agenda` · `PATCH /agenda-items/:id` · `PUT /rooms/:roomId/agenda/reorder` · `DELETE /agenda-items/:id` |
| **Polls** | `POST /polls` · `GET\|PATCH\|DELETE /polls/:id` · `GET /polls/:id/results` (server-aggregated) |
| **Votes** | `POST /polls/:id/votes` · `DELETE /polls/:id/votes` (retract, only if allowed and unlocked) |
| **Questions** | `GET\|POST /rooms/:roomId/questions` (response filtered by role) · `PATCH /questions/:id` (host only) · `POST\|DELETE /questions/:id/upvote` |
| **Uploads** | `POST /uploads/presign` · `POST /uploads/:id/confirm` |
| **Summary/export** | `GET /events/:id/summary` · `GET /events/:id/summary.csv` · `GET /events/:id/summary.pdf` (server-rendered, replacing client `window.print()` so exports are consistent regardless of requester) |
| **Join lifecycle** | `POST /rooms/:roomCode/join` · `POST /rooms/:roomCode/reconnect` |

### Real-time contract (Socket.IO, namespace `/`, room `room:{roomCode}`)

Client connects with `auth: { sessionToken }` (host access token, attendee session JWT, or a read-only projector token minted via `POST /rooms/:code/projector-token`).

| Direction | Events |
|---|---|
| **Client → server** | `room:join` · `host:advanceAgenda` · `host:lockVoting`/`unlockVoting` · `host:revealResults`/`hideResults` · `host:startTimer` · `host:pinQuestion`/`approveQuestion`/`hideQuestion` · `attendee:submitVote` · `attendee:submitQuestion` · `attendee:upvoteQuestion` · `presence:heartbeat` |
| **Server → client** | `agenda:changed` · `voting:locked`/`unlocked` · `results:revealed`/`hidden` · `tallies:updated` (debounced under load) · `timer:started`/`stopped` · `question:created`/`updated`/`upvoted` · `presence:count` (throttled ≤1/sec) · `room:locked`/`deleted` · `session:invalidated` |

All broadcasts fire from the service layer **after** a successful DB write (host socket handlers call the same service function the REST endpoint would), so REST and socket paths can never diverge, and hosts have a manual-refetch fallback if the socket drops.

---

## 4. Phased Build Order

**Phase 0 — Foundations, TypeScript migration, auth**
Convert `server/server.js` → `server/src/server.ts` (preserve behavior exactly: helmet, cors allowlist, rate limiter, `/health`, JSON body parser, 404/error handler), add `tsconfig.json`, build/dev scripts (`tsx watch` for dev, `tsc` for prod build). Add Prisma + Postgres, migrations for `users`/`organizations`/`organization_members`. Auth endpoints, `requireAuth` middleware, Google OAuth. Frontend: wire `/login` handlers, add route guards, `/auth/me` on load.

**Phase 1 — Core content CRUD**
`events`, `rooms`, `agenda_items`, `polls`, `poll_options` tables + full REST CRUD, room code generation, presigned uploads wired into room-settings/account-settings. Frontend: replace hardcoded arrays in `dashboard`, `event-builder`, `poll-editor`, `room-settings`; wire the currently-dead "Save poll," "Create event," "Delete room" buttons.

**Phase 2 — Live session engine** *(highest complexity/value)*
Unblocks `/control-room`, `/join*`, `/projector` going from static to live. Socket.IO server, room channel model, host/attendee/projector auth handshake, `attendee_sessions`/`votes`/join+reconnect endpoints, server-authoritative timer, lock/reveal/agenda-advance broadcasts, tally aggregation, transactional double-vote prevention, signed QR payloads, `ReconnectingOverlay` wired to real socket lifecycle. Also: build the rating and open-text voting UI on `/join/poll` (currently only MC exists client-side) since the API will support all three types.

**Phase 3 — Q&A**
`questions`/`question_upvotes` tables, submit/approve/pin/hide + real-time events, idempotent upvote-once enforcement. Evaluate Redis for presence/hot-state here only if needed.

**Phase 4 — Analytics & export**
Server-aggregated summary endpoint, CSV export, server-rendered PDF export, `/account/overview` dashboard stats.

**Phase 5 — Org, billing, team**
Stripe customer/subscription/webhook integration → `invoices` table, team invite/role endpoints, full removal of the mock raw-card UI in `account-settings/page.tsx`.

**Phase 6 — Hardening & deploy**
Per-route rate-limit tuning (stricter on auth/vote/upvote), load testing to 1,000+ concurrent attendees (decide if Redis adapter is actually needed), reconnect/session-resumption stress testing, structured logging + error monitoring (respecting the existing prod error-hiding convention), CORS/env review for prod domains, Postgres backup/retention policy, orphaned-upload cleanup.

Each phase is independently demoable against the existing frontend. Phase order front-loads the live-session engine right after minimal CRUD since it's the part that actually differentiates this product.

---

## 5. Key Risks / Edge Cases

- **Double voting** — transactional uniqueness, not check-then-insert (races under client retries).
- **Double upvoting** — DB-level composite PK failure treated as idempotent no-op.
- **Timer sync** — persist only `timerEndsAt` (absolute), never "seconds remaining"; every client derives its own countdown; server enforces lock-on-expiry authoritatively.
- **Reconnect at scale** — `reconnect_token` (separate from raw session id) lets a dropped client resume without re-voting; client always resyncs full state via `GET /rooms/:code/state` before resubscribing — never assumes continuity.
- **1,000+ concurrent attendees** — throttle presence broadcasts (≤1/sec) and debounce live-tally broadcasts (aggregate over ~250–500ms windows) rather than one message per vote.
- **QR spoofing/enumeration** — closed by the signed/expiring token format, without breaking manual code entry.
- **Payment data** — Stripe Elements/PaymentIntents only; the mock raw-card collection in `account-settings/page.tsx` is removed, not adapted.
- **`server.ts` conventions** — `/health`, the 404 handler, and prod error-hiding must survive the TS migration byte-for-byte in behavior; new middleware is appended after the existing security stack, never reordered ahead of it.

---

## Critical Files

- `server/server.js` → migrates to `server/src/server.ts` (Phase 0)
- `server/.env.example` → extend with `DATABASE_URL`, JWT secrets, Stripe keys, S3/R2 config, QR HMAC secret
- `client/src/app/control-room/page.tsx`, `poll-editor/page.tsx`, `event-builder/page.tsx`, `room-settings/page.tsx`, `account-settings/page.tsx` — pages with dead buttons/hardcoded data to wire up
- `client/src/components/QrScanner.tsx`, `ReconnectingOverlay.tsx`, `ThemeContext.tsx` — components with real-time/reconnect/theme-persistence implications

---

## Verification

- **Phase 0** — `npm run dev` in `server/` boots on TS without errors; `/health` still returns 200 with the same shape; signup/login/refresh work end-to-end via `curl`; expired/invalid tokens are rejected by `requireAuth`.
- **Phase 1** — create an event → room → agenda item → poll via REST, confirm they appear correctly ordered on `GET /rooms/:roomId/agenda`; confirm dashboard/event-builder/poll-editor pages render real data instead of hardcoded arrays.
- **Phase 2** *(critical path)* — open `/control-room`, `/join` (as attendee), and `/projector` simultaneously in three browser sessions against the same room code; advance the agenda from control-room and confirm both other views update within ~1s; submit votes from multiple attendee sessions and confirm tallies match a direct DB query; kill the attendee socket mid-session and confirm `ReconnectingOverlay` appears and reconnect resumes without a duplicate vote.
- **Phase 3** — submit a question from one attendee session, confirm it appears in control-room's moderation queue live; approve/pin/hide from control-room and confirm the audience queue updates; confirm a second upvote attempt from the same session is a no-op, not an error.
- **Phase 4** — compare `/event-summary` page output and CSV/PDF export against a direct aggregate SQL query for the same event.
- **Phase 5** — run a full Stripe test-mode subscription flow (test card via Stripe test PaymentMethod) and confirm no raw card data appears in server logs or the database.
- **Phase 6** — load-test a single room to 1,000+ simulated concurrent socket connections; confirm presence/tally broadcast rates stay throttled and the server doesn't degrade.
