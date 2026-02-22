/**
 * Panel section contract – canonical section order and grouping for the property panel (left bar).
 * Use this to keep all content blocks consistent and to add or group sections in one place.
 *
 * @see src/docs/BMAD_PROPERTY_PANEL_AND_SETTINGS_AUDIT.md §9 (Panel anatomy)
 */

/** Section IDs used in PropertySection id. Must match across all content blocks (except documented exceptions). */
export const CONTENT_BLOCK_SECTION_IDS = ['content', 'layout', 'typography', 'colors'] as const;
export type ContentBlockSectionId = (typeof CONTENT_BLOCK_SECTION_IDS)[number];

/** Section order for standard content blocks. Exceptions: divider (style, layout, colors); image-content (content, image, layout, typography, colors). */
export const CONTENT_BLOCK_SECTION_ORDER: readonly ContentBlockSectionId[] = CONTENT_BLOCK_SECTION_IDS;

/** defaultOpen: which sections are "open" when the panel loads. Typography is usually closed to reduce clutter. */
export const CONTENT_BLOCK_DEFAULT_OPEN: readonly ContentBlockSectionId[] = ['content', 'layout', 'colors'];

/** Logical groups for visual grouping (optional). Use when rendering section group labels or dividers. */
export const PANEL_SECTION_GROUPS = {
  /** Copy and structure (title, description, badge, list, CTA). */
  content: { label: 'Content & structure', sectionIds: ['content'] as const },
  /** Padding, alignment, spacing. */
  layout: { label: 'Layout & spacing', sectionIds: ['layout'] as const },
  /** Typography and colors together = "Appearance". */
  appearance: { label: 'Appearance', sectionIds: ['typography', 'colors'] as const },
} as const;

/** image-content block: insert this section between content and layout. */
export const IMAGE_CONTENT_EXTRA_SECTION_ID = 'image' as const;

/** divider block: use this instead of content. */
export const DIVIDER_STYLE_SECTION_ID = 'style' as const;
