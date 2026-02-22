# Forensic Report: Empty Blank Blocks in Email Templates

**Date:** February 9, 2026  
**Issue:** Some templates show header/footer (or content) as “empty blank blocks”—e.g. only logo on a dark bar with no title, date, or footer text.

---

## 1. Root cause analysis

### 1.1 Header block

| Cause | Explanation |
|-------|-------------|
| **Empty/missing `title`** | `HeaderBlock` renders `<h1>{title}</h1>`. When `title` is `''` or undefined, the heading is empty and the header looks blank except for the logo. |
| **Empty/missing `date`** | Date is rendered only when `showDate && date`. If `date` is `''` or undefined, the date line is not shown, so the header has no second line of text. |
| **Session restore** | Restored state from `localStorage` can have `header.title` or `header.date` missing or empty (e.g. user cleared them, or an older bug). Restore was applied as-is with no patching. |
| **Templates** | All defined starter templates (blank, release-notes, major-feature, premium-showcase, newsletter, product-update) include non-empty `title` and `date`. So empty header in normal use comes from restored session or in-session edits, not from template definitions. |

### 1.2 Footer block

| Cause | Explanation |
|-------|-------------|
| **Empty text fields** | `ContactFooterBlock` always renders `message`, `teamName`, `email`, `website`, and `disclaimer`. If any are `''`, those sections render as empty (e.g. empty `<p>`, empty `<div>`s), so the footer can look like “logo only” or mostly blank. |
| **Session restore** | Restored state can have empty `footer.message`, `footer.teamName`, etc., again applied as-is. |

### 1.3 Content blocks (context only)

- Blocks such as `TextOnlyBlock` use conditions like `showTitle && title` / `showDescription && description`. Empty title/description can produce minimal or blank-looking blocks.
- This report and the implemented fixes focus on **header and footer**; content blocks can be addressed in a follow-up (e.g. placeholders for empty title/description).

---

## 2. Strategic fix (implemented)

### 2.1 Session restore hardening (`App.tsx`)

- **`patchEmptyBlocks(state: EmailState): EmailState`** runs on restored session before `setEmailState`.
- It ensures:
  - **Header:** `title` and `date` are never missing or blank; defaults: `"Email Title"` and current date (e.g. `toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })`).
  - **Footer:** `message`, `teamName`, `email`, `website`, `disclaimer` are never missing or blank; defaults match the usual Kore.ai footer copy and `kore.ai` / `contact@kore.ai`.
- So any previously saved “empty” header/footer is corrected on next load.

### 2.2 HeaderBlock placeholders

- **Title:** When not in editable mode, if `title` is missing or only whitespace, the heading shows **"Email title"** instead of an empty `<h1>`.
- **Date:** When `showDate` is true, the date row is always shown. If `date` is missing or only whitespace, it shows the **current date** (same format as above) instead of hiding the row.
- Result: header never appears as “logo only” with no text.

### 2.3 ContactFooterBlock placeholders

- **message:** If empty/whitespace → **"Thank you for your continued support and valuable feedback."**
- **teamName:** If empty/whitespace → **"Kore.ai Product Management Team"**
- **email:** If empty/whitespace → **"contact@kore.ai"**
- **website:** If empty/whitespace → display **"kore.ai"**, link **"https://kore.ai"**
- **disclaimer:** If empty/whitespace → **"© 2025 Kore.ai. All rights reserved."**
- Result: footer always shows readable copy; no “blank” footer block.

---

## 3. Files changed

| File | Change |
|------|--------|
| `src/App.tsx` | Added `patchEmptyBlocks()`, `DEFAULT_HEADER_DATE`; session restore now uses `patchEmptyBlocks(session.emailState)` before `setEmailState`. |
| `src/components/email-blocks/HeaderBlock.tsx` | Title fallback to `"Email title"` when empty; date row always shown when `showDate`, with current date when `date` is empty. |
| `src/components/email-blocks/ContactFooterBlock.tsx` | Placeholder text for empty `message`, `teamName`, `email`, `website`, `disclaimer`. |

---

## 4. Verification

- **New session:** All starter templates already have non-empty header/footer; no change in behavior.
- **Restored session with empty header/footer:** After load, header shows “Email title” and today’s date; footer shows default message, team name, email, website, disclaimer.
- **User clears title/date in builder:** Header still shows “Email title” and current date (non-editable view) or the empty input with placeholder “Email title...” (editable). Footer always shows placeholder text when fields are cleared.
- **Export/HTML:** Placeholders are visible in the built email; they can be edited in the builder before sending.

---

## 5. Optional follow-ups

- **Content blocks:** Add minimal placeholders for empty `title`/`description` in text-based blocks so middle-of-email blocks never look completely blank.
- **i18n:** If the app is localized, move default strings (e.g. “Email title”, footer copy) into a shared locale file.
- **Saved state:** Consider normalizing state on save (e.g. run a lighter “ensure non-empty header/footer” pass before `saveSession`) so old sessions are gradually repaired on save as well as on load.
