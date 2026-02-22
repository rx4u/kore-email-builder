/**
 * Typography Scales System
 * 
 * Provides standardized font sizes, weights, and typography utilities
 * for all email blocks to ensure consistency and scalability.
 * 
 * Usage:
 * import { FONT_SIZE_SCALE, FONT_WEIGHT_SCALE, FontSize } from '@/lib/typography-scales';
 */

// ============================================================================
// FONT SIZE SCALE
// ============================================================================

/**
 * Font size options
 * 
 * - xs: 12px - Small labels, captions, metadata
 * - sm: 14px - Secondary text, helper text
 * - base: 16px - Body text, standard content (default)
 * - lg: 18px - Emphasized body text
 * - xl: 20px - Small headings
 * - 2xl: 22px - Standard headings (current default for titles)
 * - 3xl: 26px - Large headings
 * - 4xl: 32px - Hero headings
 */
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/**
 * Font size scale mapping
 */
export const FONT_SIZE_SCALE: Record<FontSize, string> = {
  xs: '12px',
  sm: '14px',
  base: '16px',   // Current default for descriptions
  lg: '18px',
  xl: '20px',
  '2xl': '22px',  // Current default for titles
  '3xl': '26px',
  '4xl': '32px'
};

/**
 * Human-readable font size labels for UI
 */
export const FONT_SIZE_LABELS: Record<FontSize, string> = {
  xs: 'Extra Small',
  sm: 'Small',
  base: 'Base',
  lg: 'Large',
  xl: 'Extra Large',
  '2xl': 'Heading',
  '3xl': 'Large Heading',
  '4xl': 'Hero'
};

/**
 * Font size descriptions for tooltips
 */
export const FONT_SIZE_DESCRIPTIONS: Record<FontSize, string> = {
  xs: '12px - Small labels, captions',
  sm: '14px - Secondary text',
  base: '16px - Body text (default)',
  lg: '18px - Emphasized text',
  xl: '20px - Small headings',
  '2xl': '22px - Standard headings',
  '3xl': '26px - Large headings',
  '4xl': '32px - Hero headings'
};

// ============================================================================
// FONT WEIGHT SCALE
// ============================================================================

/**
 * Font weight options
 */
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

/**
 * Font weight scale mapping
 */
export const FONT_WEIGHT_SCALE: Record<FontWeight, string> = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',      // Current default for titles
  extrabold: '800'
};

/**
 * Human-readable font weight labels
 */
export const FONT_WEIGHT_LABELS: Record<FontWeight, string> = {
  normal: 'Normal',
  medium: 'Medium',
  semibold: 'Semi Bold',
  bold: 'Bold',
  extrabold: 'Extra Bold'
};

// ============================================================================
// LINE HEIGHT SCALE
// ============================================================================

/**
 * Line height options
 */
export type LineHeight = 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

/**
 * Line height scale mapping
 */
export const LINE_HEIGHT_SCALE: Record<LineHeight, string> = {
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '1.7'    // Current default for descriptions
};

// ============================================================================
// LETTER SPACING SCALE
// ============================================================================

/**
 * Letter spacing options
 */
export type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';

/**
 * Letter spacing scale mapping
 */
export const LETTER_SPACING_SCALE: Record<LetterSpacing, string> = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em'
};

// ============================================================================
// COLOR SYSTEM (Typography-specific)
// ============================================================================

/**
 * Text color options
 * Using Kore.ai brand colors and semantic color system
 */
export type TextColor = 
  | 'primary'      // Main text color (dark)
  | 'secondary'    // Secondary text (medium gray)
  | 'tertiary'     // Tertiary text (light gray)
  | 'brand'        // Kore.ai brand blue
  | 'white'        // White text
  | 'black'        // Pure black
  | 'success'      // Green
  | 'warning'      // Orange/Yellow
  | 'error'        // Red
  | 'custom';      // Custom color

/**
 * Text color values
 */
export const TEXT_COLOR_SCALE: Record<Exclude<TextColor, 'custom'>, string> = {
  primary: '#1E293B',     // Slate 800 - Main text
  secondary: '#64748B',   // Slate 500 - Secondary text
  tertiary: '#94A3B8',    // Slate 400 - Tertiary text
  brand: '#004EEB',       // Kore.ai brand blue
  white: '#FFFFFF',       // White
  black: '#000000',       // Black
  success: '#10B981',     // Green
  warning: '#F59E0B',     // Orange
  error: '#EF4444'        // Red
};

/**
 * Text color labels for UI
 */
export const TEXT_COLOR_LABELS: Record<TextColor, string> = {
  primary: 'Primary (Dark)',
  secondary: 'Secondary (Gray)',
  tertiary: 'Tertiary (Light Gray)',
  brand: 'Brand Blue',
  white: 'White',
  black: 'Black',
  success: 'Success (Green)',
  warning: 'Warning (Orange)',
  error: 'Error (Red)',
  custom: 'Custom Color'
};

// ============================================================================
// TYPOGRAPHY PRESETS
// ============================================================================

/**
 * Common typography combinations for different use cases
 */
export interface TypographyPreset {
  fontSize: FontSize;
  fontWeight: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  color: TextColor;
}

/**
 * Title presets
 */
export const TITLE_PRESETS: Record<string, TypographyPreset> = {
  hero: {
    fontSize: '4xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    color: 'primary'
  },
  h1: {
    fontSize: '3xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    color: 'primary'
  },
  h2: {
    fontSize: '2xl',
    fontWeight: 'bold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
    color: 'primary'
  },
  h3: {
    fontSize: 'xl',
    fontWeight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'normal',
    color: 'primary'
  },
  h4: {
    fontSize: 'lg',
    fontWeight: 'semibold',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: 'primary'
  }
};

/**
 * Body text presets
 */
export const BODY_PRESETS: Record<string, TypographyPreset> = {
  large: {
    fontSize: 'lg',
    fontWeight: 'normal',
    lineHeight: 'relaxed',
    letterSpacing: 'normal',
    color: 'secondary'
  },
  base: {
    fontSize: 'base',
    fontWeight: 'normal',
    lineHeight: 'loose',
    letterSpacing: 'normal',
    color: 'secondary'
  },
  small: {
    fontSize: 'sm',
    fontWeight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: 'tertiary'
  },
  caption: {
    fontSize: 'xs',
    fontWeight: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'wide',
    color: 'tertiary'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get font size value
 */
export const getFontSize = (size: FontSize = 'base'): string => {
  return FONT_SIZE_SCALE[size];
};

/**
 * Get font weight value
 */
export const getFontWeight = (weight: FontWeight = 'normal'): string => {
  return FONT_WEIGHT_SCALE[weight];
};

/**
 * Get line height value
 */
export const getLineHeight = (lineHeight: LineHeight = 'normal'): string => {
  return LINE_HEIGHT_SCALE[lineHeight];
};

/**
 * Get letter spacing value
 */
export const getLetterSpacing = (spacing: LetterSpacing = 'normal'): string => {
  return LETTER_SPACING_SCALE[spacing];
};

/**
 * Get text color value
 * @param color - Color option or custom hex value
 */
export const getTextColor = (color: TextColor | string = 'primary'): string => {
  if (color === 'custom') {
    return TEXT_COLOR_SCALE.primary; // Fallback
  }
  if (color.startsWith('#')) {
    return color; // Custom hex color
  }
  return TEXT_COLOR_SCALE[color as Exclude<TextColor, 'custom'>] || TEXT_COLOR_SCALE.primary;
};

/**
 * Get complete typography styles
 */
export const getTypographyStyles = (
  size: FontSize = 'base',
  weight: FontWeight = 'normal',
  color: TextColor | string = 'primary',
  lineHeight?: LineHeight,
  letterSpacing?: LetterSpacing
) => {
  return {
    fontSize: getFontSize(size),
    fontWeight: getFontWeight(weight),
    color: getTextColor(color),
    ...(lineHeight && { lineHeight: getLineHeight(lineHeight) }),
    ...(letterSpacing && { letterSpacing: getLetterSpacing(letterSpacing) })
  };
};

/**
 * Get typography styles for title elements
 */
export const getTitleStyles = (
  size: FontSize = '2xl',
  weight: FontWeight = 'bold',
  color: TextColor | string = 'primary'
) => {
  return {
    fontSize: getFontSize(size),
    fontWeight: getFontWeight(weight),
    color: getTextColor(color),
    letterSpacing: '-0.01em', // Slight tightening for headings
    lineHeight: '1.3'
  };
};

/**
 * Get typography styles for description/body elements
 */
export const getDescriptionStyles = (
  size: FontSize = 'base',
  weight: FontWeight = 'normal',
  color: TextColor | string = 'secondary'
) => {
  return {
    fontSize: getFontSize(size),
    fontWeight: getFontWeight(weight),
    color: getTextColor(color),
    lineHeight: '1.7',
    margin: '0'
  };
};

/**
 * Email-safe typography styles
 * Ensures compatibility with email clients
 */
export const getEmailSafeTypographyStyles = (
  size: FontSize = 'base',
  weight: FontWeight = 'normal',
  color: string = TEXT_COLOR_SCALE.primary
) => {
  return {
    fontSize: getFontSize(size),
    fontWeight: getFontWeight(weight),
    color: color,
    lineHeight: '1.5',
    margin: '0',
    padding: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  };
};

// ============================================================================
// RESPONSIVE TYPOGRAPHY (Mobile overrides)
// ============================================================================

/**
 * Mobile font size adjustments
 * Slightly smaller sizes for mobile viewing
 */
export const MOBILE_FONT_SIZE_SCALE: Record<FontSize, string> = {
  xs: '11px',
  sm: '13px',
  base: '15px',
  lg: '17px',
  xl: '19px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '28px'
};

/**
 * Get mobile-adjusted font size
 */
export const getMobileFontSize = (size: FontSize = 'base'): string => {
  return MOBILE_FONT_SIZE_SCALE[size];
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate if a string is a valid font size
 */
export const isValidFontSize = (size: string): size is FontSize => {
  return size in FONT_SIZE_SCALE;
};

/**
 * Validate if a string is a valid font weight
 */
export const isValidFontWeight = (weight: string): weight is FontWeight => {
  return weight in FONT_WEIGHT_SCALE;
};
