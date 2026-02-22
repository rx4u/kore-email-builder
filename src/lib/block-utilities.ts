/**
 * Block Utilities
 * 
 * Helper functions for common block patterns to reduce code duplication
 * and ensure consistency across all email blocks.
 * 
 * Usage:
 * import { getBlockPadding, getBlockAlignment, getBlockTypography } from '@/lib/block-utilities';
 */

import { 
  PaddingSize, 
  SpacingSize, 
  GapSize, 
  AlignmentOption,
  PADDING_SCALE,
  HEADER_FOOTER_PADDING_SCALE,
  SPACING_SCALE,
  GAP_SCALE,
  getAlignmentStyles,
  getCTAAlignmentStyles
} from './layout-scales';

import {
  FontSize,
  FontWeight,
  TextColor,
  FONT_SIZE_SCALE,
  FONT_WEIGHT_SCALE,
  TEXT_COLOR_SCALE,
  getTitleStyles,
  getDescriptionStyles,
  getEmailSafeTypographyStyles
} from './typography-scales';

import { emailSafeStyle } from './email-styles-converter';
import { COLORS } from '../components/email-blocks/email-styles';

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

/**
 * Get padding styles for a block
 * 
 * @param size - Padding size option
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getBlockPadding = (
  size: PaddingSize = 'md',
  isEmailMode: boolean = false
): React.CSSProperties => {
  const padding = PADDING_SCALE[size];
  
  return emailSafeStyle({
    padding: padding,
    backgroundColor: '#ffffff',
    borderRadius: '0'
  }, isEmailMode)
};

/**
 * Get padding styles for header/footer blocks (2x vertical breathing space)
 * 
 * @param size - Padding size option
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getHeaderFooterPadding = (
  size: PaddingSize = 'md',
  isEmailMode: boolean = false
): React.CSSProperties => {
  const padding = HEADER_FOOTER_PADDING_SCALE[size];
  
  return emailSafeStyle({
    padding: padding,
    backgroundColor: '#ffffff',
    borderRadius: '0'
  }, isEmailMode);
};

/**
 * Get alignment styles for block content
 * 
 * @param align - Alignment option
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getBlockAlignment = (
  align: AlignmentOption = 'left',
  isEmailMode: boolean = false
): React.CSSProperties => {
  return getAlignmentStyles(align, isEmailMode);
};

/**
 * Get spacing between elements
 * 
 * @param size - Spacing size option
 * @returns CSS margin value
 */
export const getBlockSpacing = (
  size: SpacingSize = 'md'
): string => {
  return SPACING_SCALE[size];
};

/**
 * Get gap for grid/flex layouts
 * 
 * @param size - Gap size option
 * @returns CSS gap value
 */
export const getBlockGap = (
  size: GapSize = 'md'
): string => {
  return GAP_SCALE[size];
};

// ============================================================================
// TYPOGRAPHY UTILITIES
// ============================================================================

/**
 * Get title styles for blocks
 * STANDARDIZED: All blocks must use this for titles
 * 
 * @param size - Font size
 * @param weight - Font weight
 * @param color - Text color (hex or color name)
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getBlockTitleStyles = (
  size: FontSize = '2xl',
  weight: FontWeight = 'bold',
  color: string = COLORS.primaryText,
  isEmailMode: boolean = false
): React.CSSProperties => {
  // STANDARDIZED: Always include lineHeight and letterSpacing
  const standardStyles: React.CSSProperties = {
    fontSize: FONT_SIZE_SCALE[size],
    fontWeight: FONT_WEIGHT_SCALE[weight],
    color: color,
    lineHeight: '1.4',
    letterSpacing: '-0.01em'
  };
  
  if (isEmailMode) {
    return emailSafeStyle(standardStyles, isEmailMode);
  }
  
  return standardStyles;
};

/**
 * Get description styles for blocks
 * STANDARDIZED: All blocks must use this for descriptions
 * 
 * @param size - Font size
 * @param weight - Font weight
 * @param color - Text color (hex or color name)
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getBlockDescriptionStyles = (
  size: FontSize = 'base',
  weight: FontWeight = 'normal',
  color: string = COLORS.secondaryText,
  isEmailMode: boolean = false
): React.CSSProperties => {
  // STANDARDIZED: Always include lineHeight and margin
  const standardStyles: React.CSSProperties = {
    fontSize: FONT_SIZE_SCALE[size],
    fontWeight: FONT_WEIGHT_SCALE[weight],
    color: color,
    lineHeight: '1.6',
    margin: '0'
  };
  
  if (isEmailMode) {
    return emailSafeStyle(standardStyles, isEmailMode);
  }
  
  return standardStyles;
};

/**
 * Get complete typography styles (generic)
 * 
 * @param size - Font size
 * @param weight - Font weight
 * @param color - Text color
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getBlockTypography = (
  size: FontSize = 'base',
  weight: FontWeight = 'normal',
  color: string = COLORS.primaryText,
  isEmailMode: boolean = false
): React.CSSProperties => {
  if (isEmailMode) {
    return getEmailSafeTypographyStyles(size, weight, color);
  }
  
  return {
    fontSize: FONT_SIZE_SCALE[size],
    fontWeight: FONT_WEIGHT_SCALE[weight],
    color: color
  };
};

// ============================================================================
// CONTAINER UTILITIES
// ============================================================================

/**
 * Get complete container styles for a block
 * Combines padding, background, and border-radius
 * 
 * @param padding - Padding size
 * @param backgroundColor - Background color (hex)
 * @param isEmailMode - Whether rendering for email output
 * @returns CSS style object
 */
export const getBlockContainerStyles = (
  padding: PaddingSize = 'md',
  backgroundColor: string = '#ffffff',
  isEmailMode: boolean = false
): React.CSSProperties => {
  return emailSafeStyle({
    padding: PADDING_SCALE[padding],
    backgroundColor: backgroundColor,
    borderRadius: '0'
  }, isEmailMode);
};

/**
 * Get container styles with custom options
 */
export interface ContainerOptions {
  padding?: PaddingSize;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderSide?: 'none' | 'left' | 'top' | 'right' | 'bottom' | 'all';
  borderRadius?: string;
}

export const getBlockContainerWithOptions = (
  options: ContainerOptions = {},
  isEmailMode: boolean = false
): React.CSSProperties => {
  const {
    padding = 'md',
    backgroundColor = '#ffffff',
    borderColor,
    borderWidth,
    borderSide = 'none',
    borderRadius = '0'
  } = options;
  
  const styles: React.CSSProperties = {
    padding: PADDING_SCALE[padding],
    backgroundColor: backgroundColor,
    borderRadius: borderRadius
  };
  
  // Add border if specified
  if (borderColor && borderWidth && borderSide !== 'none') {
    if (borderSide === 'all') {
      styles.border = `${borderWidth} solid ${borderColor}`;
    } else {
      styles[`border${borderSide.charAt(0).toUpperCase() + borderSide.slice(1)}` as keyof React.CSSProperties] = 
        `${borderWidth} solid ${borderColor}` as any;
    }
  }
  
  return emailSafeStyle(styles, isEmailMode);
};

// ============================================================================
// ELEMENT SPACING UTILITIES
// ============================================================================

/**
 * Get margin-bottom for title element
 * 
 * @param spacing - Spacing size for title-to-description gap
 * @returns CSS style object
 */
export const getTitleMargin = (spacing: SpacingSize = 'md'): React.CSSProperties => {
  return {
    marginBottom: SPACING_SCALE[spacing]
  };
};

/**
 * Get margin-bottom for description element
 * 
 * @param spacing - Spacing size for description-to-CTA gap
 * @param hasCTA - Whether the block has a CTA button
 * @returns CSS style object
 */
export const getDescriptionMargin = (
  spacing: SpacingSize = 'xl',
  hasCTA: boolean = true
): React.CSSProperties => {
  return {
    margin: hasCTA ? `0 0 ${SPACING_SCALE[spacing]} 0` : '0'
  };
};

/**
 * Get wrapper styles for content with spacing
 * 
 * @param bottomSpacing - Bottom margin/spacing
 * @returns CSS style object
 */
export const getContentWrapper = (bottomSpacing: SpacingSize = 'xl'): React.CSSProperties => {
  return {
    marginBottom: SPACING_SCALE[bottomSpacing]
  };
};

// ============================================================================
// CTA UTILITIES
// ============================================================================

/**
 * Get CTA container alignment styles
 * 
 * @param align - Alignment option
 * @returns CSS style object
 */
export const getCTAContainerStyles = (align: AlignmentOption = 'left'): React.CSSProperties => {
  return getCTAAlignmentStyles(align);
};

/**
 * Get CTA wrapper with alignment and sizing
 * 
 * @param align - Alignment option
 * @param width - Width option
 * @returns CSS style object
 */
export const getCTAWrapperStyles = (
  align: AlignmentOption = 'left',
  width: 'auto' | 'full' = 'auto'
): React.CSSProperties => {
  return {
    display: 'flex',
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
    width: width === 'full' ? '100%' : 'auto'
  };
};

// ============================================================================
// VISIBILITY UTILITIES
// ============================================================================

/**
 * Check if element should be rendered based on visibility prop
 * 
 * @param show - Visibility flag
 * @param defaultValue - Default visibility (usually true)
 * @returns Whether element should be shown
 */
export const shouldShow = (show?: boolean, defaultValue: boolean = true): boolean => {
  return show !== undefined ? show : defaultValue;
};

/**
 * Get wrapper props that conditionally render children
 * Returns null if should not show
 */
export const conditionalRender = <T,>(
  show: boolean | undefined,
  element: T,
  defaultShow: boolean = true
): T | null => {
  return shouldShow(show, defaultShow) ? element : null;
};

// ============================================================================
// BULLET/LIST UTILITIES
// ============================================================================

/**
 * Get bullet list styles
 * 
 * @param spacing - Spacing between bullets
 * @returns CSS style object
 */
export const getBulletListStyles = (spacing: SpacingSize = 'sm'): React.CSSProperties => {
  return {
    margin: '0',
    padding: '0',
    listStyle: 'none'
  };
};

/**
 * Get individual bullet item styles
 * 
 * @param spacing - Spacing after each bullet
 * @param isLast - Whether this is the last item
 * @returns CSS style object
 */
export const getBulletItemStyles = (
  spacing: SpacingSize = 'sm',
  isLast: boolean = false
): React.CSSProperties => {
  return {
    marginBottom: isLast ? '0' : SPACING_SCALE[spacing],
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px'
  };
};

// ============================================================================
// GRID UTILITIES
// ============================================================================

/**
 * Get grid container styles
 * 
 * @param columns - Number of columns
 * @param gap - Gap between items
 * @returns CSS style object (for non-email mode)
 */
export const getGridContainerStyles = (
  columns: number = 2,
  gap: GapSize = 'md'
): React.CSSProperties => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: GAP_SCALE[gap]
  };
};

/**
 * Get email-safe table grid structure
 * Returns props for table-based grid (email-compatible)
 */
export const getEmailGridProps = (columns: number = 2) => {
  return {
    cellPadding: 0,
    cellSpacing: 0,
    border: 0,
    style: { width: '100%' }
  };
};

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Resolve color value (handle both color names and hex codes)
 * 
 * @param color - Color input (can be TextColor name or hex code)
 * @param fallback - Fallback color if invalid
 * @returns Hex color code
 */
export const resolveColor = (
  color?: string,
  fallback: string = COLORS.primaryText
): string => {
  if (!color) return fallback;
  
  // If it's already a hex code, return it
  if (color.startsWith('#')) return color;
  
  // Try to resolve from TEXT_COLOR_SCALE
  if (color in TEXT_COLOR_SCALE) {
    return TEXT_COLOR_SCALE[color as keyof typeof TEXT_COLOR_SCALE];
  }
  
  // Try to resolve from COLORS
  if (color in COLORS) {
    return COLORS[color as keyof typeof COLORS];
  }
  
  return fallback;
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Get mobile-optimized padding
 * Slightly smaller than desktop
 * 
 * @param size - Desktop padding size
 * @returns Mobile padding size
 */
export const getMobilePadding = (size: PaddingSize = 'md'): PaddingSize => {
  const mobileMap: Record<PaddingSize, PaddingSize> = {
    none: 'none',
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'lg',
    xxl: 'xl'
  };
  
  return mobileMap[size];
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate and sanitize padding size
 * 
 * @param size - Padding size input
 * @param fallback - Fallback if invalid
 * @returns Valid padding size
 */
export const validatePaddingSize = (
  size?: string,
  fallback: PaddingSize = 'md'
): PaddingSize => {
  if (!size) return fallback;
  if (size in PADDING_SCALE) return size as PaddingSize;
  return fallback;
};

/**
 * Validate and sanitize spacing size
 */
export const validateSpacingSize = (
  size?: string,
  fallback: SpacingSize = 'md'
): SpacingSize => {
  if (!size) return fallback;
  if (size in SPACING_SCALE) return size as SpacingSize;
  return fallback;
};

/**
 * Validate and sanitize font size
 */
export const validateFontSize = (
  size?: string,
  fallback: FontSize = 'base'
): FontSize => {
  if (!size) return fallback;
  if (size in FONT_SIZE_SCALE) return size as FontSize;
  return fallback;
};

/**
 * Validate and sanitize font weight
 */
export const validateFontWeight = (
  weight?: string,
  fallback: FontWeight = 'normal'
): FontWeight => {
  if (!weight) return fallback;
  if (weight in FONT_WEIGHT_SCALE) return weight as FontWeight;
  return fallback;
};

/**
 * Validate and sanitize alignment
 */
export const validateAlignment = (
  align?: string,
  fallback: AlignmentOption = 'left'
): AlignmentOption => {
  if (!align) return fallback;
  if (['left', 'center', 'right'].includes(align)) return align as AlignmentOption;
  return fallback;
};

// ============================================================================
// DEBUGGING UTILITIES
// ============================================================================

/**
 * Get debug info for block props
 * Useful for development/troubleshooting
 */
export const getBlockDebugInfo = (props: any) => {
  return {
    padding: props.padding || 'md (default)',
    contentAlign: props.contentAlign || 'left (default)',
    titleSize: props.titleSize || '2xl (default)',
    descriptionSize: props.descriptionSize || 'base (default)',
    showTitle: props.showTitle !== false ? 'true' : 'false',
    showDescription: props.showDescription !== false ? 'true' : 'false',
    showCTA: props.showCTA !== false ? 'true' : 'false'
  };
};

/**
 * Log block rendering info (development only)
 */
export const logBlockRender = (blockType: string, props: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${blockType}]`, getBlockDebugInfo(props));
  }
};

// ============================================================================
// PRESET UTILITIES
// ============================================================================

/**
 * Apply a layout preset to block props
 */
export const applyLayoutPreset = (
  preset: 'compact' | 'standard' | 'spacious' | 'premium'
) => {
  const presets = {
    compact: {
      padding: 'sm' as PaddingSize,
      titleDescriptionGap: 'sm' as SpacingSize,
      descriptionCtaGap: 'md' as SpacingSize
    },
    standard: {
      padding: 'md' as PaddingSize,
      titleDescriptionGap: 'md' as SpacingSize,
      descriptionCtaGap: 'xl' as SpacingSize
    },
    spacious: {
      padding: 'lg' as PaddingSize,
      titleDescriptionGap: 'lg' as SpacingSize,
      descriptionCtaGap: 'xl' as SpacingSize
    },
    premium: {
      padding: 'xl' as PaddingSize,
      titleDescriptionGap: 'xl' as SpacingSize,
      descriptionCtaGap: 'xxl' as SpacingSize
    }
  };
  
  return presets[preset];
};

/**
 * Apply a typography preset to block props
 */
export const applyTypographyPreset = (
  preset: 'minimal' | 'standard' | 'bold' | 'hero'
) => {
  const presets = {
    minimal: {
      titleSize: 'xl' as FontSize,
      titleWeight: 'semibold' as FontWeight,
      descriptionSize: 'sm' as FontSize
    },
    standard: {
      titleSize: '2xl' as FontSize,
      titleWeight: 'bold' as FontWeight,
      descriptionSize: 'base' as FontSize
    },
    bold: {
      titleSize: '3xl' as FontSize,
      titleWeight: 'bold' as FontWeight,
      descriptionSize: 'lg' as FontSize
    },
    hero: {
      titleSize: '4xl' as FontSize,
      titleWeight: 'extrabold' as FontWeight,
      descriptionSize: 'xl' as FontSize
    }
  };
  
  return presets[preset];
};