# Smoke test: Theme & color cleanup

**Purpose:** Verify the theme/color audit changes work as intended.  
**When:** After theme picker grouping, color dedupe, ThemeStyleOptions, and theme token hex dedupe.

---

## 1. Theme picker (Settings or Properties)

- [ ] Open **Theme Settings** (right panel when nothing selected) or select a content block and open **Properties**.
- [ ] Find the **Theme** section with the theme swatch grid.
- [ ] **Brand** section appears first with a "BRAND" label and 4 theme swatches.
- [ ] **Neutral** section appears next with "NEUTRAL" and 3 swatches.
- [ ] **Colorful** section last with "COLORFUL" and the rest of the themes.
- [ ] Click a theme; selection ring appears; no console logs in dev tools.

---

## 2. Color picker – no theme

- [ ] With **no theme** on the block (or theme set to "None"), open a color control (e.g. Background or Title color).
- [ ] **Most Used** group shows only **2 swatches**: white and black (no brand-600, no neutrals).
- [ ] **Brand Colors** and **Grays** groups show full palettes with no duplicate swatches from Most Used.

---

## 3. Color picker – with theme

- [ ] Set a **theme** on the block (e.g. Kore Default). Open the same color control.
- [ ] **Theme Colors** (or equivalent) shows theme tokens for that zone.
- [ ] Same hex does **not** appear twice (e.g. if fg and textLight are both white, only one white swatch).

---

## 4. Theme style options (Colorful / Swap)

- [ ] Select a block that supports theme (e.g. Feature Screenshot, Text Only).
- [ ] With a theme set, **Theme style** section appears with two options:
  - **Use header zone colors** (with tooltip on hover).
  - **Swap background and text colors** (with tooltip on hover).
- [ ] Toggling each updates the block colors as before.

---

## Quick pass

If short on time: do **§1** (theme picker grouping) and **§2** (Most Used = white + black). That covers the main UI and color-dedupe behavior.

After you’ve run this, we can do **Step 2: Content strategy Phase 2** (or styling follow-up / tests).
