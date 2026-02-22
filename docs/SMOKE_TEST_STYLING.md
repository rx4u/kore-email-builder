# Smoke test: Template styling (BMAD Styling Strategy)

**Purpose:** Verify theme–template alignment, header/footer styling, and “apply recommended theme on switch.”  
**Reference:** `src/docs/BMAD_TEMPLATE_STYLING_STRATEGY.md` (Theme–template map, Phase 2–3).

---

## 1. Theme–template map (recommended theme per template)

When you **switch template** (dropdown), the app should apply the recommended theme and show a toast.

| Template         | Expected theme      | Check |
|------------------|---------------------|--------|
| Blank            | Kore Default        | [ ]   |
| Release Notes    | Kore Default        | [ ]   |
| Major Feature    | Brand Primary       | [ ]   |
| Premium Showcase | Brand Dark          | [ ]   |
| Newsletter       | Kore Default        | [ ]   |
| Product Update   | Kore Default        | [ ]   |

- [ ] Switch to each template; toast shows template name and theme name (e.g. "Switched to Premium Showcase. Theme: Brand Dark.").
- [ ] Header/footer colors match the applied theme (no stale dark/light from previous template).

---

## 2. Header/footer appearance per template

- [ ] **Blank:** Logo size large; header left; footer center.
- [ ] **Release Notes:** Logo large; date visible; product name + version badge when present.
- [ ] **Major Feature:** Logo large; date visible; header looks on-brand (Brand Primary when applied).
- [ ] **Premium Showcase:** Logo large; darker header (Brand Dark when applied).
- [ ] **Newsletter:** Logo large; date month/year style; footer “Thanks for reading.” etc.
- [ ] **Product Update:** Logo medium (md); compact header; footer as brief.

---

## 3. Global theme still applies

- [ ] Open **Theme Settings** (right panel), change **Block theme** to another theme (e.g. Neutral Dark).
- [ ] Header and footer update to the new theme across the current template.
- [ ] Switch to another template; recommended theme for that template is applied (toast); header/footer match that theme.

---

## 4. Quick pass

If short on time: do **§1** (switch each template once, confirm toast + correct theme colors) and **§3** (change global theme, confirm it still drives header/footer until next template switch).

After this, next step can be **Step 4: Tests for theme/color** (getColorGroups, getThemeTokenPalette, etc.) or another priority.
