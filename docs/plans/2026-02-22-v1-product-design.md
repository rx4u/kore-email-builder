# Kore Email Builder v1.0 — Product Design Document

**Date:** 2026-02-22
**Status:** Approved
**Author:** Product / Claude Code

---

## Overview

Kore Email Builder v1.0 transforms the existing drag-and-drop prototype into a full-stack internal email builder SaaS. It ships 20 new email blocks (modern design, media, interactive, internal-comms), a Supabase-powered backend for auth/storage/collaboration, a DnD and properties panel overhaul, and Gmail-optimized export.

**Goal:** Make it the best tool for internal SaaS teams writing product updates, release notes, sprint digests, feature announcements, and deprecation notices — with a design quality ceiling that matches Vercel, Linear, and Stripe's emails.

**Future:** Single workspace now → multi-tenant public SaaS later.

---

## Market Research Summary

### Competitive Gap

| Tool | Technical Blocks | Collaboration | Internal-Comms Focus |
|---|---|---|---|
| Beefree | None | Real-time co-edit | No |
| Stripo | None | Async comments | No |
| Chamaileon | None | Best-in-class (4-stage pipeline) | No |
| Litmus | None | Preview commenting | No |
| Mailchimp/HubSpot | None | Minimal | No |
| **Kore v1.0** | **20 blocks incl. Changelog, Deprecation, Metrics** | **Preview link + comments + versions** | **Yes — primary focus** |

**Unique position:** No competitor builds specifically for internal product/engineering team communication. Kore owns this space.

### Key Research Findings

**Design trends (2025):**
- Dark-first emails (Vercel, Linear, Raycast) — `#0a0a0a` backgrounds, white text
- Bento grid layouts replacing single-column stacks
- Large display type (48–72px) for heroes
- GIF product demos (2–4s, 15fps, first frame = clean screenshot)
- Card-based content with border + border-radius (no box-shadow in email)
- Pill/tag navigation above headlines

**Internal comms block gaps (no competitor has):**
- Changelog block (version + categorized changes)
- Deprecation notice (sunset date + migration path)
- Metrics snapshot (big number stat cards)
- Known issues (severity-tagged list)
- Roadmap preview (Now/Next/Later)

**Interactive email (Gmail reality):**
- AMP: skipped (requires Google sender registration — not worth it)
- Link-based interactivity works everywhere: NPS, polls, RSVP via tokenized URLs
- Animated GIFs: universal animation format — 15fps, <500KB, meaningful first frame

**Gmail compatibility non-negotiables:**
- All CSS inlined (Juice.js)
- Table-based layout (never div/flex/grid for structure)
- `bgcolor` attribute + `style` on every major `<td>` (dual coverage for Outlook)
- Max 102KB HTML (Gmail clips above this)
- Absolute image URLs, no data URIs

---

## Architecture

### Stack

```
Frontend: React 18 + Vite + TypeScript (existing, extended)
Backend:  Express.js API (Node)
Database: Supabase (PostgreSQL + Auth + Storage)
CSS:      Juice.js (CSS inliner on export)
Email:    Resend API (test sends)
Deploy:   Vercel (frontend) + Railway or Fly.io (Express API)
```

### System Diagram

```
Browser (React/Vite)
  ├── Supabase Auth (Google OAuth + email/password)
  ├── Supabase DB (drafts, templates, versions, responses, tokens)
  ├── Supabase Storage (images, GIFs, logos)
  └── Express API
        ├── /preview/:token  → serve rendered HTML (public, no auth)
        ├── /r/:token/:value → record interactive response (public)
        ├── /export          → inline CSS via Juice.js, return HTML
        └── /send-test       → send via Resend API
```

### Database Schema

```sql
-- Auth (managed by Supabase Auth)
users (id uuid, email, name, avatar_url, role, created_at)
  role: 'author' | 'reviewer' | 'admin'

-- Single workspace
workspace (id uuid, name, settings_jsonb, created_at)

-- Email drafts
emails (
  id uuid PRIMARY KEY,
  workspace_id uuid,
  author_id uuid REFERENCES users,
  subject text,
  blocks_jsonb jsonb,        -- full EmailState as JSON
  status text,               -- 'draft' | 'in_review' | 'approved' | 'sent'
  created_at timestamptz,
  updated_at timestamptz
)

-- Version history (auto-saved snapshots)
email_versions (
  id uuid PRIMARY KEY,
  email_id uuid REFERENCES emails,
  blocks_jsonb jsonb,
  saved_by uuid REFERENCES users,
  label text,                -- optional: "After PM review", "Final"
  created_at timestamptz
)

-- Shared templates
templates (
  id uuid PRIMARY KEY,
  workspace_id uuid,
  name text,
  description text,
  blocks_jsonb jsonb,
  is_global boolean,         -- admin-curated shared templates
  created_by uuid REFERENCES users,
  created_at timestamptz
)

-- Interactive block responses (NPS, poll, RSVP)
responses (
  id uuid PRIMARY KEY,
  email_id uuid REFERENCES emails,
  block_id text,             -- block's id within the email
  recipient_token text,      -- unique per export/send
  response_type text,        -- 'nps' | 'poll' | 'rsvp' | 'rating'
  value text,                -- score, option_id, 'yes'/'no'
  created_at timestamptz
)

-- Shareable preview tokens
preview_tokens (
  id uuid PRIMARY KEY,
  email_id uuid REFERENCES emails,
  token text UNIQUE,         -- UUID, used in /preview/:token URL
  expires_at timestamptz,    -- 7 days from creation
  view_count integer DEFAULT 0,
  created_at timestamptz
)

-- Preview comments (from reviewers via share link)
comments (
  id uuid PRIMARY KEY,
  email_id uuid,
  token_id uuid REFERENCES preview_tokens,
  author_name text,          -- no auth required on preview
  content text,
  resolved boolean DEFAULT false,
  created_at timestamptz
)
```

---

## New Block Library (20 blocks)

### Group 1 — Modern Design Blocks

| Block | Key Props |
|---|---|
| **Hero** | title, subtitle, cta_text, cta_url, bg_color, text_color, badge_text, display_size (48/64/72px) |
| **Bento Grid** | 3 cells: 1 large (60%) + 2 small (40%). Each cell: title, description, icon, bg_color, link |
| **Feature Row** | image_url, image_position (left/right), title, description, cta_text, cta_url. Alternates on add |
| **Pull Quote** | quote_text, author_name, author_title, accent_color, font_size |
| **Announcement Banner** | icon, headline, bg_color, text_color. Full-width strip |
| **Card Grid** | columns (2/3), cards[]: {icon, title, description, link} |
| **Comparison Table** | columns[], rows[]: {label, values[]: 'yes'/'no'/'partial'/'text'} |

### Group 2 — Media Blocks

| Block | Key Props |
|---|---|
| **GIF Demo** | gif_url (Supabase Storage), caption, cta_text, cta_url, show_outlook_warning |
| **Video Thumbnail** | video_url (Loom/YouTube), thumbnail_url (auto-fetched or uploaded), caption, duration_label |
| **Hero Image** | image_url, alt_text, link_url, max_width |

### Group 3 — Interactive Blocks (link-based)

All interactive blocks generate tokenized URLs at export time. Responses recorded at `/r/:token/:block_id/:value`.

| Block | Key Props | Output |
|---|---|---|
| **NPS Rating** | question_text, low_label, high_label, color_gradient | 0–10 colored cells, each a unique link |
| **Star Rating** | question_text, max_stars (5) | 5 star images, each a unique link |
| **Quick Poll** | question_text, options[]: {id, label} | Pill buttons, each a unique link |
| **RSVP Block** | event_title, event_date, event_location, yes_label, no_label | Two styled CTA buttons |
| **Feedback Prompt** | question_text, options: emoji/label pairs | Emoji row, each a unique link |

### Group 4 — Internal Comms Blocks

| Block | Key Props |
|---|---|
| **Changelog** | version, date, sections[]: {type: 'feature'/'fix'/'breaking'/'deprecated', items[]: string} |
| **Deprecation Notice** | feature_name, deprecated_date, eol_date, migration_path, severity: 'warning'/'critical', cta_text, cta_url |
| **Metrics Snapshot** | metrics[]: {value, label, delta, delta_direction: 'up'/'down'/'neutral'} |
| **Known Issues** | issues[]: {severity: 'p1'/'p2'/'p3', title, status: 'investigating'/'in_progress'/'fixed', link} |
| **Roadmap Preview** | items[]: {label, status: 'now'/'next'/'later', description} |
| **Team Attribution** | teams[]: {name, role, avatar_url} |
| **Incident Retro** | incident_id, date, duration, impact, root_cause, fix_applied, action_items[]: string |

---

## Collaboration & Workflow

### Roles

| Role | Permissions |
|---|---|
| **Author** | Create/edit/delete own drafts, submit for review, view own response data |
| **Reviewer** | View all drafts, comment on previews, approve/reject submissions |
| **Admin** | All above + manage templates, manage users, view all response data |

### Draft Lifecycle

```
[Draft] → (Author submits) → [In Review] → (Reviewer approves) → [Approved] → (Author marks sent) → [Sent/Archived]
                                         ↓
                                  (Reviewer rejects with comment)
                                         ↓
                                      [Draft] (with rejection note)
```

### Shareable Preview

- Author clicks **Share** → generates UUID preview token (7-day expiry)
- Reviewer opens `/preview/:token` — sees rendered email exactly as recipients will
- Reviewer can leave comments (name required, no account needed)
- Comments appear in author's editor sidebar in real-time (Supabase realtime subscription)
- Author resolves comments as addressed

### Version History

- Auto-saved snapshot on every significant structural change (block add/remove/reorder)
- Text-only changes debounced — snapshot every 60 seconds of active editing
- Named saves: author can label any version ("After PM review", "Final v2")
- Restore any version → loads that `blocks_jsonb` into editor (current version auto-saved first)

---

## Export & Gmail Compatibility

### Export Options

| Option | Description |
|---|---|
| **Copy for Gmail** | `ClipboardItem` with `text/html` MIME. Paste directly into Gmail compose. |
| **Copy HTML** | Raw inlined HTML source to clipboard |
| **Download .html** | File download for archiving |
| **Send Test** | Enter email address → sends via Resend API |

### Gmail Safety (auto-enforced on every export)

1. All CSS inlined via Juice.js
2. `<table>`-based layout — never div/flex/grid for structure
3. `bgcolor` attribute + `style="background-color:"` on every major `<td>`
4. All images: `width` + `height` + `alt` attributes required
5. Web-safe font fallback stack always appended
6. Absolute image URLs (Supabase CDN)
7. 102KB size warning in editor (real-time indicator in bottom bar)
8. No tracking pixels, no unsubscribe footer (internal email)

### Interactive Block Export

- On export: generates unique `export_id` + `recipient_token` stored in `responses` table
- Each NPS cell / poll option / RSVP button → `https://app.kore-email.com/r/{token}/{block_id}/{value}`
- Response landing page: records response → shows "Thanks, recorded!" page
- Response dashboard: Author sees live results per email (NPS scores, poll breakdown, RSVP count)

---

## UI/UX Overhaul

### DnD Fixes

- **Insertion line** (thin horizontal rule + dot) replaces bounding-box highlight — shows exact drop position
- **Block ghost**: semi-transparent rendering of actual block content during drag (not just handle icon)
- **Auto-scroll**: smooth scroll when dragging near canvas top/bottom edge
- **Hover-only drag handle**: reduces visual noise
- **Undo/Redo**: Cmd+Z / Cmd+Shift+Z — block-level for structure, character-level for text

### Properties Panel

- Collapsible sections: **Content / Typography / Colors / Spacing / Advanced**
- Collapsed by default, remembers open state per block type
- Reset-to-default button per property
- "Overriding theme" badge on locally overridden values
- Fully contextual — no universal panel, each block type defines its own controls

### Editor Chrome

```
┌─────────────────────────────────────────────────────────┐
│ [Draft name]  [Status badge]  [Undo][Redo]  [Share][Export] │  ← Top bar
├──────────┬──────────────────────────────┬───────────────┤
│  Block   │                              │  Properties   │
│ Library  │     Email Canvas (600px)     │  (contextual) │
│          │                              │               │
│ Layout   │  ┌────────────────────────┐  │ Content       │
│ Media    │  │  Header Block          │  │ ▼ Typography  │
│ Interact │  ├────────────────────────┤  │   Colors      │
│ Internal │  │  Hero Block            │  │   Spacing     │
│ Existing │  ├────────────────────────┤  │   Advanced    │
│          │  │  Changelog Block       │  │               │
│          │  └────────────────────────┘  │               │
├──────────┴──────────────────────────────┴───────────────┤
│  [102KB: 34KB ▓▓░░░░]  [12 blocks]  [Saved 2m ago]     │  ← Bottom bar
└─────────────────────────────────────────────────────────┘
```

### Preview Modes

- **Desktop** (600px) / **Mobile** (375px) — live toggle, no modal
- **Dark mode preview** — simulates Gmail dark rendering
- **Gmail view** — strips head `<style>` to simulate Gmail's CSS handling

---

## Decision Log

| Decision | Alternatives Considered | Rationale |
|---|---|---|
| Supabase for backend | Firebase, PocketBase, custom Node+Postgres | Best auth + JSONB storage + RLS + Edge Functions combo. Free tier generous. |
| Link-based interactivity (no AMP) | AMP for Email | AMP requires Google sender registration + CORS setup. Link-based works in every client with no setup. |
| Single workspace (not multi-tenant) | Multi-tenant from day 1 | YAGNI — ship fast, add multi-tenancy when needed. Schema supports it (workspace_id on all tables). |
| Express API layer alongside Supabase | Supabase Edge Functions only | CSS inlining (Juice.js), image compositing, and Resend integration are easier in a persistent Node process. |
| Juice.js for CSS inlining | Premailer, inline-css npm | Juice.js is the most maintained, fastest, and has the best Gmail compatibility track record. |
| Resend for test sends | SendGrid, Postmark, direct SMTP | Resend has the cleanest API, generous free tier, and is built by ex-Vercel team. |
| Table-based HTML output | MJML, React Email | Existing html-generator.ts already outputs table-based HTML. Extend rather than replace. |
| 7-day preview token expiry | 24h, 30 days, no expiry | Long enough for async review workflows, short enough to not accumulate stale links. |

---

## Non-Goals (v1.0)

- Multi-tenant / per-company workspaces
- AMP interactivity
- Real-time co-editing (Figma-style cursors)
- Directory/LDAP/Slack integration for recipients
- Jira/GitHub/Linear changelog auto-import
- Countdown timers (AMP-only, skipped)
- Mobile app
- Email scheduling / send queues
- Analytics (open rates, click tracking) — internal emails don't need tracking pixels

---

## Phased Delivery (Big Bang v1.0, but ordered internally)

**Phase 1 — Backend foundation** (blocks, auth, storage work on top of this)
- Supabase project setup, schema, RLS policies
- Express API scaffold (preview, response recording, export, send-test)
- Auth flow (Google OAuth + email/password)
- Draft CRUD (save, load, list, delete)

**Phase 2 — New block library**
- 7 Modern Design blocks
- 3 Media blocks
- 5 Interactive blocks
- 5 Internal Comms blocks

**Phase 3 — DnD + Properties panel overhaul**
- Insertion line indicator
- Block ghost during drag
- Undo/redo stack
- Properties panel collapsible groups
- Contextual panel per block type

**Phase 4 — Collaboration**
- Shareable preview links
- Comment system
- Version history
- Draft lifecycle (status flow)
- Role-based access

**Phase 5 — Export + Gmail safety**
- Juice.js CSS inliner integration
- Copy for Gmail (ClipboardItem API)
- 102KB size indicator
- Interactive block tokenized URL generation
- Response dashboard
- Send test via Resend

**Phase 6 — Polish + deploy**
- Preview mode toggles (mobile, dark, Gmail)
- Bottom bar (size indicator, block count, saved timestamp)
- Full Vercel + Railway deploy
- GitHub README update

---

## Success Criteria

- All 20 new blocks render correctly in Gmail (tested via Send Test)
- Exported HTML passes Gmail paste test without CSS stripping issues
- Draft saves and restores without data loss
- Shareable preview link accessible without login
- NPS/poll response records correctly in DB
- Build stays under 600KB main bundle
- All existing 21 tests still pass
