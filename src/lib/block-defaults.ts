/**
 * Centralized Block Defaults
 * 
 * SINGLE SOURCE OF TRUTH for all block default values.
 * Eliminates 3-layer mismatch between:
 * - App.tsx block creation
 * - Component default parameters
 * - Properties Panel fallback values
 * 
 * Created: November 5, 2025
 * Issue: CRITICAL_BUG_DEFAULT_VALUES_MISMATCH.md
 */

import type { 
  PaddingSize, 
  SpacingSize, 
  AlignmentOption 
} from './layout-scales';
import type { FontSize, FontWeight } from './typography-scales';
import type { CTAButtonStyle } from '../components/email-blocks/email-styles';
import type { BadgeType } from '../components/email-blocks/badge-styles';
import type { ColorValue } from './color-token-system';

// ============================================================================
// HEADER BLOCK DEFAULTS
// ============================================================================

export const HEADER_DEFAULTS = {
  // Content
  title: 'Product Release Notes',
  date: new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  
  // Visibility
  showDate: true,
  showPattern: false,
  showLogo: true,
  
  // Logo
  logoSize: 'md' as const,
  logoCustomWidth: undefined as number | undefined,
  
  // Badges
  categoryBadge: undefined as BadgeType | undefined,
  versionText: '',
  versionBadgeStyle: 'outlined' as const,
  
  // Layout
  contentAlignment: 'left' as const,
  padding: 'md' as PaddingSize,
  logoTitleGap: 'xl' as SpacingSize,
  titleDateGap: 'sm' as SpacingSize,
  
  // Colors - ColorValue tokens
  backgroundColor: { id: 'brand-600' } as ColorValue,
  titleColor: { id: 'white' } as ColorValue,
  dateColor: { id: 'white' } as ColorValue,
  
  // Typography
  titleFontSize: 32,
  dateFontSize: 16,
  
  // Theme
  theme: undefined as string | undefined,
  colorfulMode: false,
  themeSwapped: false,
  
  // System
  isEmailMode: false,
  showCardStyle: false,
};

// ============================================================================
// FOOTER BLOCK DEFAULTS (CTA Footer)
// ============================================================================

export const CTA_FOOTER_DEFAULTS = {
  // Content
  ctaText: 'Learn More',
  ctaLink: 'https://kore.ai',
  description: 'Questions? Contact us for more information.',
  
  // Visibility
  showPattern: false,
  
  // Colors
  backgroundColor: { id: 'neutral-50' } as ColorValue,
  ctaBackgroundColor: { id: 'brand-600' } as ColorValue,
  ctaTextColor: { id: 'white' } as ColorValue,
  descriptionColor: { id: 'neutral-600' } as ColorValue,
  
  // Layout
  padding: 'md' as PaddingSize,
  
  // Theme
  theme: undefined as string | undefined,
  
  // System
  isEmailMode: false,
  showCardStyle: false,
};

// ============================================================================
// CONTENT BLOCK DEFAULTS
// ============================================================================

/**
 * Base defaults shared by most content blocks
 */
const BASE_CONTENT_BLOCK_DEFAULTS = {
  // Visibility
  showTitle: true,
  showDescription: true,
  showBadge: true,
  showIcon: true,
  
  // Layout
  padding: 'standard' as PaddingSize,
  contentAlign: 'left' as AlignmentOption,
  // Note: titleAlign, descriptionAlign, bulletAlign removed - they fall back to contentAlign
  
  // Typography
  titleSize: 'xl' as FontSize,
  titleWeight: 'bold' as FontWeight,
  descriptionSize: 'sm' as FontSize,
  descriptionWeight: 'normal' as FontWeight,
  
  // Colors - ColorValue tokens
  backgroundColor: { id: 'white' } as ColorValue,
  titleColor: { id: 'neutral-900' } as ColorValue,
  descriptionColor: { id: 'neutral-600' } as ColorValue,
  
  // Spacing
  titleDescriptionGap: 'md' as SpacingSize,
  
  // Theme
  theme: undefined as string | undefined,
  colorfulMode: false,
  themeSwapped: false,
  
  // System
  isEmailMode: false,
  showCardStyle: false,
};

/**
 * CTA defaults shared by blocks with CTAs
 */
const CTA_DEFAULTS = {
  showCTA: true,
  ctaText: 'Learn More',
  ctaLink: '#',
  ctaStyle: 'primary' as CTAButtonStyle, // ✅ PRIMARY is the correct default
  ctaBorderRadius: '8px',
  ctaColor: { id: 'brand-600' } as ColorValue,
  descriptionButtonGap: 'lg' as SpacingSize,
};

// ============================================================================
// FEATURE WITH SCREENSHOT
// ============================================================================

export const FEATURE_SCREENSHOT_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  ...CTA_DEFAULTS,
  
  // Content
  title: 'New Feature',
  description: 'Feature description goes here. Explain the benefits and value to your users.',
  badge: 'new' as BadgeType,
  bullets: [] as string[],
  screenshot: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/c03d315e1938db5a050bd6edd265cdcb5787dd24',
  screenshotAlt: 'Feature screenshot',
  
  // Visibility
  showBullets: true,
  
  // Spacing
  descriptionCtaGap: 'xl' as SpacingSize,
  bulletSpacing: 'md' as SpacingSize,
  
};

// ============================================================================
// FEATURE LIST
// ============================================================================

export const FEATURE_LIST_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  ...CTA_DEFAULTS,
  
  // Content
  title: 'Key Features',
  description: 'Discover what makes this release special.',
  badge: 'new' as BadgeType,
  bullets: [] as string[],
  
  // Visibility
  showBullets: true,
  
  // Spacing
  descriptionCtaGap: 'xl' as SpacingSize,
  bulletSpacing: 'md' as SpacingSize,
};

// ============================================================================
// IMAGE + CONTENT BLOCK
// ============================================================================

export const IMAGE_CONTENT_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  ...CTA_DEFAULTS,
  
  // Content
  title: 'Feature Title',
  description: 'Feature description goes here.',
  badge: undefined as BadgeType | undefined,
  bullets: [] as string[],
  imageSrc: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/c03d315e1938db5a050bd6edd265cdcb5787dd24',
  imageAlt: 'Feature image',
  
  // Image
  showImage: true,
  imagePosition: 'left' as const,
  imageWidth: 40,
  
  // Visibility
  showBullets: true,
  
  // Layout - Granular alignments for advanced use
  ctaAlign: 'left' as AlignmentOption,
  
  // Spacing
  titleDescriptionGap: 'md' as SpacingSize,
  descriptionBulletsGap: 'lg' as SpacingSize,
  bulletsCtaGap: 'lg' as SpacingSize,
  bulletSpacing: 'sm' as SpacingSize,
  imageContentGap: 'lg' as SpacingSize,
  
  // Typography
  titleSize: 'xl' as FontSize,
  descriptionSize: 'sm' as FontSize,
};

// ============================================================================
// TEXT ONLY BLOCK
// ============================================================================

export const TEXT_ONLY_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  ...CTA_DEFAULTS,
  
  // Content
  title: 'Update Title',
  description: 'Update description goes here.',
};

// ============================================================================
// TWO COLUMN FEATURE
// ============================================================================

export const TWO_COLUMN_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  
  // Content
  title: 'Side-by-Side Comparison',
  description: 'Compare features or options side by side.',
  leftColumn: {
    title: 'Column 1',
    description: 'Description for first column',
  },
  rightColumn: {
    title: 'Column 2',
    description: 'Description for second column',
  },
  
  // Visibility - CRITICAL: TwoColumn component uses showBlockTitle/showBlockDescription
  showTitle: false,  // Standard prop (not used by component, but kept for PropertiesPanel)
  showDescription: false,  // Standard prop (not used by component, but kept for PropertiesPanel)
  showBlockTitle: false,  // Actual prop used by TwoColumnFeature component
  showBlockDescription: false,  // Actual prop used by TwoColumnFeature component
  
  // Layout
  columnRatio: '50-50' as const,
  columnGap: 'md' as SpacingSize,
  stackOnMobile: true,
  
  // Spacing
  titleColumnsGap: 'lg' as SpacingSize,
  
  // Typography - Column-specific sizes (keep these)
  columnTitleFontSize: 18,
  columnDescriptionFontSize: 14,
  
  // Colors
  columnTitleColor: { id: 'neutral-900' } as ColorValue,
  columnDescriptionColor: { id: 'neutral-600' } as ColorValue,
  columnBackgroundColor: { id: 'neutral-50' } as ColorValue,
};

// ============================================================================
// MULTI-UPDATE BLOCK
// ============================================================================

export const MULTI_UPDATE_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  
  // Content
  title: 'What\'s New',
  description: 'A collection of recent updates and improvements.',
  updates: [] as Array<{
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  }>,
  
  // Visibility
  showDescription: false,
  
  // CTA
  ctaStyle: 'primary' as CTAButtonStyle,
  
  // Spacing
  updateSpacing: 'lg' as SpacingSize,
  
  // Typography - Update-specific sizes (keep these)
  updateTitleFontSize: 18,
  updateDescriptionFontSize: 14,
};

// ============================================================================
// TIMELINE BLOCK
// ============================================================================

export const TIMELINE_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  
  // Content
  title: 'Release Timeline',
  description: 'Track important milestones and events.',
  events: [] as Array<{
    date: string;
    title: string;
    description: string;
  }>,
  
  // Visibility - CRITICAL: Timeline component uses showBlockTitle/showBlockDescription
  showTitle: true,  // Standard prop (not used by component, but kept for PropertiesPanel)
  showDescription: false,  // Standard prop (not used by component, but kept for PropertiesPanel)
  showBlockTitle: true,  // Actual prop used by Timeline component
  showBlockDescription: false,  // Actual prop used by Timeline component
  
  // Layout
  contentAlign: 'left' as AlignmentOption,
  
  // Spacing
  titleTimelineGap: 'lg' as SpacingSize,
  eventSpacing: 'lg' as SpacingSize,
  
  // Colors
  timelineColor: { id: 'brand-600' } as ColorValue,
  
  // Typography - Event-specific sizes (keep these)
  eventTitleFontSize: 18,
  eventDescriptionFontSize: 14,
};

// ============================================================================
// STATS & METRICS BLOCK
// ============================================================================

export const STATS_METRICS_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  
  // Content
  title: 'Performance Metrics',
  description: 'Key statistics and performance indicators.',
  stats: [] as Array<{
    value: string;
    label: string;
  }>,
  
  // Visibility
  showDescription: false,
  
  // Layout
  contentAlign: 'center' as AlignmentOption,
  
  // Spacing
  titleStatsGap: 'lg' as SpacingSize,
  statSpacing: 'md' as SpacingSize,
  
  // Colors
  statValueColor: { id: 'brand-600' } as ColorValue,
  statLabelColor: { id: 'neutral-600' } as ColorValue,
  
  // Typography - Stat-specific sizes (keep these)
  statValueFontSize: 36,
  statLabelFontSize: 14,
};

// ============================================================================
// ITEM GRID BLOCK
// ============================================================================

export const ITEM_GRID_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  ...CTA_DEFAULTS,
  
  // Content
  title: 'Feature Grid',
  description: 'Explore our latest features.',
  items: [] as string[],
  
  // Grid
  gridColumns: 2 as const,
  itemSpacing: 'lg' as SpacingSize,
  columnGap: 'md' as SpacingSize,
  
  // Colors
  itemBackgroundColor: { id: 'neutral-50' } as ColorValue,
  
  // Typography - Item-specific size (keep this)
  itemFontSize: 14,
};

// ============================================================================
// WARNING/ALERT BLOCK
// ============================================================================

export const WARNING_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  ...CTA_DEFAULTS,
  
  // Content
  title: 'Important Notice',
  message: 'This is an important message.',
  
  // Alert type
  alertType: 'warning' as const,
  showBadge: true,
  
  // Visibility
  showTitle: true,
  showDescription: true,
  showCTA: true,
  
  // Spacing
  titleDescriptionGap: 'md' as SpacingSize,
  descriptionCtaGap: 'lg' as SpacingSize,
  
  // Typography
  titleSize: 'lg' as FontSize,
  descriptionSize: 'sm' as FontSize,
  messageFontSize: 14,
  
  // ✅ CRITICAL: Override inherited colors with undefined
  // This allows alert type configuration (ALERT_CONFIGS in WarningBlock.tsx) to control colors
  // Each alert type has its own semantic colors (warning=yellow, success=green, etc.)
  backgroundColor: undefined,
  titleColor: undefined,
  descriptionColor: undefined,
  ctaColor: undefined,
};

// ============================================================================
// VIDEO BLOCK
// ============================================================================

export const VIDEO_DEFAULTS = {
  ...BASE_CONTENT_BLOCK_DEFAULTS,
  
  // Content
  title: 'Watch Demo',
  description: 'See how it works.',
  thumbnailUrl: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/c03d315e1938db5a050bd6edd265cdcb5787dd24',
  duration: '',
  
  // Visibility
  showDuration: true,
  
  // Layout
  thumbnailSize: 'md' as const,
  
  // Spacing
  thumbnailTextGap: 'md' as SpacingSize,
};

// ============================================================================
// CODE SNIPPET BLOCK
// ============================================================================

export const CODE_SNIPPET_DEFAULTS = {
  // Content
  title: 'Code Example',
  description: 'Implementation example and usage guide.',
  code: '// Your code here',
  language: 'javascript',
  
  // Visibility
  showTitle: true,
  showDescription: false,
  showLineNumbers: false,
  
  // Styling
  codeTheme: 'light' as const,
  fontSize: 'sm' as const,
  
  // Layout
  padding: 'standard' as PaddingSize,
  contentAlign: 'left' as AlignmentOption,
  
  // Typography
  titleSize: 'xl' as FontSize,
  titleWeight: 'bold' as FontWeight,
  descriptionSize: 'sm' as FontSize,
  descriptionWeight: 'normal' as FontWeight,
  
  // Colors
  backgroundColor: { id: 'white' } as ColorValue,
  titleColor: { id: 'neutral-900' } as ColorValue,
  descriptionColor: { id: 'neutral-600' } as ColorValue,
  codeBackgroundColor: { id: 'neutral-900' } as ColorValue,
  
  // Spacing
  titleDescriptionGap: 'md' as SpacingSize,
  descriptionCodeGap: 'lg' as SpacingSize,
  titleCodeGap: 'sm' as SpacingSize,
  
  // Theme
  theme: undefined as string | undefined,
  
  // System
  isEmailMode: false,
};

// ============================================================================
// DIVIDER BLOCK
// ============================================================================

export const DIVIDER_DEFAULTS = {
  // Styling
  color: { id: 'neutral-200' } as ColorValue,
  style: 'solid' as const,
  thickness: 'thin' as const,
  spacing: 'normal' as const,
  
  // Layout
  padding: 'md' as PaddingSize,
  
  // System
  isEmailMode: false,
};

// ============================================================================
// MASTER BLOCK DEFAULTS OBJECT
// ============================================================================

/**
 * Complete defaults for all block types.
 * Use this as the SINGLE SOURCE OF TRUTH for block creation.
 */
export const BLOCK_DEFAULTS = {
  // Header & Footer
  header: HEADER_DEFAULTS,
  'cta-footer': CTA_FOOTER_DEFAULTS,
  
  // Content Blocks
  'feature-screenshot': FEATURE_SCREENSHOT_DEFAULTS,
  'feature-list': FEATURE_LIST_DEFAULTS,
  'image-content': IMAGE_CONTENT_DEFAULTS,
  'text-only': TEXT_ONLY_DEFAULTS,
  'two-column': TWO_COLUMN_DEFAULTS,
  'multi-update': MULTI_UPDATE_DEFAULTS,
  timeline: TIMELINE_DEFAULTS,
  'stats-metrics': STATS_METRICS_DEFAULTS,
  'item-grid': ITEM_GRID_DEFAULTS,
  warning: WARNING_DEFAULTS,
  video: VIDEO_DEFAULTS,
  'code-snippet': CODE_SNIPPET_DEFAULTS,
  divider: DIVIDER_DEFAULTS,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BlockType = keyof typeof BLOCK_DEFAULTS;

/**
 * Get typed defaults for a specific block type
 */
export function getBlockDefaults<T extends BlockType>(type: T): typeof BLOCK_DEFAULTS[T] {
  return BLOCK_DEFAULTS[type];
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that all required defaults are present for a block type
 */
export function validateBlockDefaults(type: BlockType): boolean {
  const defaults = BLOCK_DEFAULTS[type];
  
  if (!defaults) {
    console.error(`No defaults found for block type: ${type}`);
    return false;
  }
  
  return true;
}

/**
 * Get a default value with type safety
 */
export function getDefaultValue<T extends BlockType, K extends keyof typeof BLOCK_DEFAULTS[T]>(
  type: T,
  key: K
): typeof BLOCK_DEFAULTS[T][K] {
  return BLOCK_DEFAULTS[type][key];
}
