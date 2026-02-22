# Theme & Color Settings / Property Panel – Audit

**Date:** February 2026  
**Scope:** Theme colors in Theme Settings and Properties Panel; color picker (ColorControlV2); theme picker (ThemePickerControl); theme tokens; “colors swapped” / colorful mode.  
**Goal:** Identify duplicates, ordering issues, and inconsistencies so we can clean them up.

---

## 1. Where theme and color appear

| Location | What | Source |
|----------|------|--------|
| **Theme Settings (right panel)** | Block Theme picker, Brand (primary) color, Default logo | ThemePickerControl, ColorControlV2, ImageUploader |
| **Properties Panel (per block)** | Theme picker, Colorful mode, Colors swapped, per-prop color controls | ThemePickerControl, ColorControlV2, checkboxes for colorfulMode / themeSwapped |
| **Theme picker** | Grid of themes (one swatch per theme) | `THEME_CATALOG` (theme-catalog.ts), ThemePickerControl uses `theme.bg` + `theme.fg` for gradient |
| **Color picker** | When no theme: grouped swatches (Most Used, Brand, Grays, Semantic). When theme: “Theme Colors” from zone | `getColorGroups()` (color-token-system.ts), `getThemeTokenPalette()` (color-palette-v2.ts) |

---

## 2. Theme catalog

**Source:** `src/lib/theme-catalog.ts` – `THEME_CATALOG` array.

- **Count:** 28 themes (4 brand, 3 neutral, 21 colorful).
- **Order:** Array order = display order in picker. Current order: Brand (4) → Neutral (3) → Colorful (21). No grouping in UI; single grid, 8 columns.
- **Backward compat:** Each theme has `bg` and `fg` (used by ThemePickerControl for the swatch gradient). These mirror header when not overridden.

### 2.1 Duplicates / naming

- **No duplicate theme IDs** in the catalog.
- **Possible visual “duplicates”:** Some themes may look similar (e.g. multiple light blues or grays). Not deduplicated by hex; ordering does not put “obvious” duplicates next to each other for comparison.
- **Naming:** Mix of “Kore Default”, “Brand Light”, “Brand Primary”, “Brand Dark”, “Neutral Light”, “Neutral”, “Neutral Dark”, then many “Colorful” names (e.g. “System Blue”, “Complexity Orange”). No strict naming rule; “Neutral” vs “Neutral Light” can be confusing.

### 2.2 Theme picker UI (ThemePickerControl)

- **Order:** Strictly `THEME_CATALOG` array order – no grouping by category (brand / neutral / colorful) and no “featured” or “recommended” section.
- **Swatch:** `linear-gradient(135deg, ${theme.bg} 50%, ${theme.fg} 50%)`. Uses root `theme.bg` / `theme.fg` (backward compat = header colors). Correct for “header stripe” preview.
- **Console logs:** Multiple `console.log` calls in ThemePickerControl (catalog length, ids, selection). Should be removed or gated for production.

**Recommendations:**

- Group themes in UI by category (Brand → Neutral → Colorful) or add section labels.
- Optionally put “Kore Default” (and maybe 1–2 others) in a “Recommended” row.
- Remove or guard ThemePickerControl console logs.

---

## 3. Color picker (ColorControlV2)

**Sources:**  
- **Without theme:** `getColorGroups(purpose)` → groups from color-token-system.ts.  
- **With theme:** `getThemeTokenPalette(themeId, zone)` → theme tokens from color-palette-v2.ts.

### 3.1 Duplicate colors in “no theme” mode

**“Most Used”** is a fixed list:

```ts
['white', 'black', 'brand-600', 'neutral-900', 'neutral-600', 'neutral-500', 'neutral-400', 'neutral-200', 'neutral-100']
```

**“Brand Colors”** is the full brand slice from `COLOR_PALETTE_V2` (e.g. brand-50 … brand-900).

- **Duplicate:** `brand-600` appears in both **Most Used** and **Brand Colors**. So the same swatch can appear twice when purpose is `'all'`.
- **Neutrals:** “Most Used” includes neutral-900, 600, 500, 400, 200, 100. “Grays” shows all neutrals (neutral-50 … neutral-900). So neutrals in “Most Used” are repeated in “Grays”.

**Recommendation:** Either remove duplicates across groups (e.g. “Most Used” only IDs that are not already in Brand/Grays), or drop “Most Used” and rely on Brand + Grays + Semantic with a clear order. If keeping “Most Used”, make it a true subset (no repeat in other groups).

### 3.2 Order of color groups

Current order in `getColorGroups()`:

1. Most Used  
2. Brand Colors  
3. Grays (Neutrals)  
4. Semantic (only when purpose !== 'text' && !== 'background')

No configuration; order is fixed. For “background” or “text” purpose, groups are filtered but order is unchanged.

**Recommendation:** Document or make order configurable (e.g. Brand first for product UIs, or Grays first for neutral-first workflows). Consider moving Semantic before or after Grays by design.

### 3.3 Order within groups

- **Most Used:** Order is the array above (white, black, brand-600, then neutrals dark→light then light).
- **Brand / Grays / Semantic:** Order = order in `COLOR_PALETTE_V2` (NEUTRALS, BRAND, SEMANTIC). Neutrals are 50→900; brand similar.

No duplicate hex within palette; duplicates are only across groups (Most Used vs Brand/Grays).

### 3.4 Theme tokens (when a theme is selected)

When `currentThemeId` and `themeZone` are set, ColorControlV2 shows **only** “Theme Colors” from `getThemeTokenPalette(themeId, zone)`.

**Token order** (same for every zone):

1. Zone Background (`bg`)  
2. Zone Text (`fg`)  
3. Accent Light (`primary500`)  
4. Accent Dark (`primary600`)  
5. Dark Text (`textDark`)  
6. Light Text (`textLight`)  
7. Surface Subtle (`bg50`)  
8. Surface Light (`bg100`)

**Duplicate hex within theme tokens:** In many themes, `fg` and `textLight` are both white (or very close), and `textDark` and body `fg` can match. So the same (or near-same) color can appear twice in the theme swatch grid.

**Recommendation:** Either deduplicate by hex when rendering theme tokens (one swatch per hex, first label wins) or keep all but add a “primary/secondary” label so duplicates are clearly intentional.

---

## 4. “Colors swapped” / Colorful mode (Property Panel)

**Where:** PropertiesPanel-REFACTORED.tsx – repeated per block type that supports theme (e.g. feature-screenshot, feature-list, text-only, multi-update, etc.).

**Behavior:**

- **Colorful mode:** Checkbox to use **header** zone colors for the block instead of **body**. When off, block uses body zone; when on, block uses header zone (more saturated).
- **Colors swapped:** Checkbox passed to `applyThemeToBlock(themeId, swapped, zone)`. When `true`, `backgroundColor = zone.fg` and `titleColor/descriptionColor = zone.bg` (fg/bg swapped).

**Issues:**

- **Copy/labels:** “Colorful mode” and “Colors swapped” may be unclear to users (what “colorful” or “swapped” means visually). No tooltip or short help in the audit scope.
- **Duplication:** The same two checkboxes and the same `applyThemeToBlock` logic are repeated in many block-specific sections (10+ blocks). Any change to label or behavior must be done in many places.
- **Consistency:** Some blocks may not expose both options; need to confirm every theme-aware block shows them in the same way.

**Recommendations:**

- Add one shared control group (e.g. “Theme style: Body / Header zone” and “Swap background and text colors”) and reuse it for all theme-aware blocks.
- Add brief labels or tooltips: e.g. “Use header zone colors” and “Swap background and text colors”.

---

## 5. Theme Settings vs block-level theme

- **Theme Settings:** `defaultBlockTheme` = global default. Applied to header/footer and to blocks that don’t override.
- **Block-level:** `block.props.theme` overrides for that block. Block can also set `colorfulMode` and `themeSwapped`.

So we have:

- One global theme (Theme Settings).
- Per-block theme + “colorful” + “swapped” (Properties Panel).

No duplicate “theme” concept; the only overlap is that the same ThemePickerControl and same THEME_CATALOG are used in both places. Order/duplicates in the catalog affect both equally.

---

## 6. Summary table (issues and priority)

| # | Issue | Location | Severity | Fix idea |
|---|--------|----------|----------|----------|
| 1 | **Color duplicate: brand-600 (and neutrals) in two groups** | getColorGroups / ColorControlV2 | High | Deduplicate “Most Used” vs Brand/Grays, or drop Most Used. |
| 2 | **Theme token duplicate hex (e.g. fg vs textLight)** | getThemeTokenPalette, ColorControlV2 | Medium | Dedupe by hex in theme token list or document. |
| 3 | **Themes not grouped in picker** | ThemePickerControl, THEME_CATALOG | Medium | Group by category (Brand / Neutral / Colorful) or add labels. |
| 4 | **Theme picker order = array order only** | theme-catalog.ts | Low | Define explicit order (e.g. recommended first, then by category). |
| 5 | **Console logs in ThemePickerControl** | ThemePickerControl.tsx | Low | Remove or guard with __DEV__. |
| 6 | **“Colorful” / “Colors swapped” repeated and possibly unclear** | PropertiesPanel-REFACTORED.tsx | Medium | Shared control component; clearer labels/tooltips. |
| 7 | **Color group order fixed and undocumented** | getColorGroups | Low | Document or make configurable (Brand vs Grays first, etc.). |

---

## 7. Suggested cleanup order

1. **High:** Remove color duplicates in picker (Most Used vs Brand/Grays).  
2. **Medium:** Group themes in ThemePickerControl by category; optionally dedupe or label theme token swatches.  
3. **Medium:** Extract “Colorful mode” and “Colors swapped” into one shared control; add short labels/tooltips.  
4. **Low:** Remove ThemePickerControl console logs; document or adjust color group order; optional theme order (e.g. recommended first).

---

## 8. Files to change (for implementation)

| File | Purpose |
|------|---------|
| `src/lib/color-token-system.ts` | getColorGroups – deduplicate, optionally reorder groups. |
| `src/lib/color-palette-v2.ts` | getThemeTokenPalette – optional dedupe by hex. |
| `src/components/properties-panel/ThemePickerControl.tsx` | Group by category; remove console logs. |
| `src/lib/theme-catalog.ts` | Optional: export a “display order” or “featured” list. |
| `src/components/PropertiesPanel-REFACTORED.tsx` | Replace repeated colorful/swap UI with shared component. |
| `src/components/ThemeSettingsPanel.tsx` | Only if theme picker component or order changes. |

This audit is the baseline for deciding what to implement first (e.g. "we shall start working on them once this is done").

**Implemented (post-audit):** #1 color dedupe (Most Used = white/black only), #2 theme token hex dedupe in getThemeTokenPalette (first occurrence per hex kept), #3 theme picker grouped by category, #5 console logs removed, #6 ThemeStyleOptions + clearer labels/tooltips, #7 color group order documented. **Tests:** `src/lib/color-token-system.test.ts` (getColorGroups), `src/lib/color-palette-v2.test.ts` (getThemeTokenPalette dedupe).
