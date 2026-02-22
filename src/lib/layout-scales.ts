/**
 * Layout Scales System
 * 
 * Provides standardized padding, spacing, and alignment utilities
 * for all email blocks to ensure consistency and scalability.
 * 
 * Usage:
 * import { PADDING_SCALE, SPACING_SCALE, AlignmentOption } from '@/lib/layout-scales';
 */

// ============================================================================
// PADDING SCALE
// ============================================================================

/**
 * Padding size options for content blocks
 * 
 * Standardized values (new):
 * - none: No padding (0) - for edge-to-edge content
 * - compact: Small (16px 24px) - Compact layout
 * - standard: Medium (24px 32px) - Standard spacing (default)
 * - spacious: Large (32px 48px) - Comfortable spacing
 * 
 * Legacy values (for backward compatibility):
 * - xs: Extra small (8px 16px) - Compact lists, tight spacing
 * - sm: Small (16px 24px) - Standard lists, mobile-friendly
 * - md: Medium (24px 32px) - Current default, balanced
 * - lg: Large (32px 48px) - Features, important content
 * - xl: Extra large (48px 64px) - Hero sections, premium content
 * - xxl: Double extra large (64px 80px) - Full-page sections
 */
export type PaddingSize = 'none' | 'compact' | 'standard' | 'spacious' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Padding scale mapping
 * Format: "vertical horizontal" (top/bottom left/right)
 */
export const PADDING_SCALE: Record<PaddingSize, string> = {
  // Standardized values (new)
  none: '0',
  compact: '16px 24px',
  standard: '24px 32px',
  spacious: '32px 48px',
  // Legacy values (backward compatibility) – lg strengthened for Spacious preset
  xs: '8px 16px',
  sm: '16px 24px',
  md: '24px 32px',    // Current default
  lg: '48px 40px',    // Spacious: 48 vertical, 40 horizontal (was 32px 48px)
  xl: '48px 64px',
  xxl: '64px 80px'
};

/**
 * Header/Footer Padding Scale - 2x vertical for breathing space
 * Format: "vertical horizontal" (top/bottom left/right)
 * Vertical padding is doubled compared to standard PADDING_SCALE
 */
export const HEADER_FOOTER_PADDING_SCALE: Record<PaddingSize, string> = {
  // Standardized values (new) – spacious aligned with lg for Spacious preset
  none: '0',
  compact: '32px 24px',
  standard: '48px 32px',
  spacious: '96px 40px',   // Same as lg so Spacious preset is strong in export when key is used
  // Legacy values (backward compatibility) – lg strengthened for Spacious preset
  xs: '16px 16px',   // 2x vertical: 8px → 16px
  sm: '32px 24px',   // 2x vertical: 16px → 32px
  md: '48px 32px',   // 2x vertical: 24px → 48px (default)
  lg: '96px 40px',   // 2x vertical: 48px → 96px (Spacious; was 64px 48px)
  xl: '96px 64px',   // 2x vertical: 48px → 96px
  xxl: '128px 80px'  // 2x vertical: 64px → 128px
};

/**
 * Human-readable padding labels for UI
 */
export const PADDING_LABELS: Record<PaddingSize, string> = {
  none: 'None',
  xs: 'Extra Compact',
  sm: 'Compact',
  md: 'Standard',
  lg: 'Spacious',
  xl: 'Very Spacious',
  xxl: 'Maximum'
};

/**
 * Padding descriptions for tooltips/help text
 */
export const PADDING_DESCRIPTIONS: Record<PaddingSize, string> = {
  none: 'No padding - edge-to-edge content',
  xs: '8px vertical, 16px horizontal - Very tight spacing',
  sm: '16px vertical, 24px horizontal - Compact layout',
  md: '24px vertical, 32px horizontal - Standard spacing (default)',
  lg: '32px vertical, 48px horizontal - Comfortable spacing',
  xl: '48px vertical, 64px horizontal - Premium feel',
  xxl: '64px vertical, 80px horizontal - Hero sections'
};

// ============================================================================
// SPACING SCALE (Internal element gaps)
// ============================================================================

/**
 * Spacing size options for gaps between elements within a block
 * 
 * Examples:
 * - Title to description gap
 * - Description to CTA gap
 * - Bullet point spacing
 * - List item spacing
 */
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '2x' | '3x' | '4x';

/**
 * Vertical spacing scale for internal gaps
 * Used for margins between elements within blocks
 */
export const SPACING_SCALE: Record<SpacingSize, string> = {
  xs: '4px',
  sm: '8px',
  md: '12px',    // Current default for title-description
  lg: '16px',
  xl: '24px',    // Current default for description-CTA
  xxl: '32px',
  '2x': '24px',  // 2x multiplier (24px)
  '3x': '36px',  // 3x multiplier (36px)
  '4x': '48px'   // 4x multiplier (48px)
};

/**
 * Human-readable spacing labels
 */
export const SPACING_LABELS: Record<SpacingSize, string> = {
  xs: 'Minimal',
  sm: 'Tight',
  md: 'Normal',
  lg: 'Comfortable',
  xl: 'Spacious',
  xxl: 'Maximum'
};

// ============================================================================
// GAP SCALE (Horizontal gaps, grid spacing)
// ============================================================================

/**
 * Gap size options for horizontal spacing
 * Used for grid columns, inline elements, flex gaps
 */
export type GapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Gap scale for horizontal spacing
 */
export const GAP_SCALE: Record<GapSize, string> = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px'
};

// ============================================================================
// ALIGNMENT SYSTEM
// ============================================================================

/**
 * Content alignment options
 */
export type AlignmentOption = 'left' | 'center' | 'right';

/**
 * Human-readable alignment labels
 */
export const ALIGNMENT_LABELS: Record<AlignmentOption, string> = {
  left: 'Left',
  center: 'Center',
  right: 'Right'
};

/**
 * Get CSS text-align value
 */
export const getTextAlign = (align: AlignmentOption = 'left'): 'left' | 'center' | 'right' => {
  return align;
};

/**
 * Get flexbox alignment styles for email-safe rendering
 * 
 * @param align - Alignment option
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getAlignmentStyles = (
  align: AlignmentOption = 'left',
  isEmailMode: boolean = false
) => {
  if (isEmailMode) {
    // For email clients, use table-based alignment
    return {
      textAlign: align as 'left' | 'center' | 'right'
    };
  }
  
  // For preview mode, use flexbox
  return {
    textAlign: align as 'left' | 'center' | 'right',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
  };
};

/**
 * Get button/CTA alignment styles
 */
export const getCTAAlignmentStyles = (align: AlignmentOption = 'left') => {
  return {
    display: 'flex',
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
  };
};

// ============================================================================
// WIDTH CONSTRAINTS
// ============================================================================

/**
 * Max-width options for content blocks
 * Useful for controlling line length for readability
 */
export type MaxWidthSize = 'sm' | 'md' | 'lg' | 'full';

export const MAX_WIDTH_SCALE: Record<MaxWidthSize, string> = {
  sm: '480px',
  md: '640px',
  lg: '800px',
  full: '100%'
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius options
 */
export type BorderRadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const BORDER_RADIUS_SCALE: Record<BorderRadiusSize, string> = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'  // Pill shape
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get padding value from size
 */
export const getPadding = (size: PaddingSize = 'md'): string => {
  return PADDING_SCALE[size];
};

/**
 * Get spacing value from size
 */
export const getSpacing = (size: SpacingSize = 'md'): string => {
  return SPACING_SCALE[size];
};

/**
 * Get gap value from size
 */
export const getGap = (size: GapSize = 'md'): string => {
  return GAP_SCALE[size];
};

/**
 * Get border radius value from size
 */
export const getBorderRadius = (size: BorderRadiusSize = 'md'): string => {
  return BORDER_RADIUS_SCALE[size];
};

/**
 * Parse padding string into individual values
 * Useful for when you need separate top/bottom/left/right values
 */
export const parsePadding = (padding: string): {
  vertical: string;
  horizontal: string;
} => {
  const parts = padding.split(' ');
  if (parts.length === 2) {
    return {
      vertical: parts[0],
      horizontal: parts[1]
    };
  }
  return {
    vertical: padding,
    horizontal: padding
  };
};

// ============================================================================
// PRESETS
// ============================================================================

/**
 * Common layout presets for quick application
 */
export const LAYOUT_PRESETS = {
  compact: {
    padding: 'sm' as PaddingSize,
    spacing: 'sm' as SpacingSize,
    gap: 'sm' as GapSize
  },
  standard: {
    padding: 'md' as PaddingSize,
    spacing: 'md' as SpacingSize,
    gap: 'md' as GapSize
  },
  spacious: {
    padding: 'lg' as PaddingSize,
    spacing: 'lg' as SpacingSize,
    gap: 'lg' as GapSize
  },
  premium: {
    padding: 'xl' as PaddingSize,
    spacing: 'xl' as SpacingSize,
    gap: 'xl' as GapSize
  }
};

/**
 * Preset labels for UI
 */
export const LAYOUT_PRESET_LABELS = {
  compact: 'Compact Layout',
  standard: 'Standard Layout',
  spacious: 'Spacious Layout',
  premium: 'Premium Layout'
};