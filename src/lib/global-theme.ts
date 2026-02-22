/**
 * Global Theme System
 * 
 * Manages template-wide theme settings that apply to all blocks.
 * Users can set global defaults for spacing, typography, colors, etc.
 */

import { getContrastTextColor, lightenColor, darkenColor } from './color-utilities';
import { createColorToken, type ColorValue } from './color-token-system';

export type ThemeMode = 'light' | 'dark';
export type SpacingPreset = 'compact' | 'standard' | 'spacious';
export type TypographyScale = 'compact' | 'standard' | 'comfortable';
export type EmailWidth = '560px' | '600px' | '640px';
export type ButtonStyle = 'rounded' | 'square' | 'pill';  // Removed 'slight'
export type ContentAlignment = 'left' | 'center' | 'right';

// ============================================================================
// THEME COLOR SCHEME
// ============================================================================

export interface ThemeColorScheme {
  // Header
  headerBackground: ColorValue;
  headerText: ColorValue;
  headerAccent: ColorValue;
  
  // Body
  emailBackground: ColorValue;
  blockBackground: ColorValue;
  footerBackground: ColorValue;  // Added for visual separation
  bodyText: ColorValue;
  mutedText: ColorValue;
  
  // Interactive
  primaryButton: ColorValue;
  primaryButtonText: ColorValue;
  secondaryButton: ColorValue;
  secondaryButtonText: ColorValue;
  
  // Borders
  border: ColorValue;
  borderStrong: ColorValue;
}

export type DefaultLogoSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GlobalThemeSettings {
  // Appearance
  mode: ThemeMode;
  primaryColor: string;
  
  // Branding (logo and colors applied template-wide)
  defaultLogoUrl?: string;   // Default logo URL used when header/footer don't set their own
  defaultLogoSize?: DefaultLogoSize;
  
  // Spacing
  spacingPreset: SpacingPreset;
  emailWidth: EmailWidth;
  /** Overall email wrapper style (Copenhagen, New York, Oslo). */
  emailLayoutStyle?: EmailLayoutStyle;
  
  // Typography
  typographyScale: TypographyScale;
  
  // Content
  defaultAlignment: ContentAlignment;
  buttonStyle: ButtonStyle;
  imageRadius: ImageRadiusStyle;
  
  // Default Block Theme (NEW)
  defaultBlockTheme?: string;  // Theme ID from theme catalog
}

export const DEFAULT_GLOBAL_THEME: GlobalThemeSettings = {
  mode: 'light',
  primaryColor: '#004EEB',
  spacingPreset: 'standard',
  emailWidth: '600px',
  emailLayoutStyle: 'copenhagen',
  typographyScale: 'standard',
  defaultAlignment: 'left',
  buttonStyle: 'rounded',
  imageRadius: 'rounded',
  defaultBlockTheme: 'kore-default',  // NEW: Kore Default theme with multi-zone colors
};

// Spacing values based on preset
export const SPACING_PRESETS = {
  compact: {
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '16px',
    paddingRight: '16px',
    itemSpacing: '8px',
  },
  standard: {
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    paddingRight: '24px',
    itemSpacing: '12px',
  },
  spacious: {
    paddingTop: '48px',
    paddingBottom: '48px',
    paddingLeft: '40px',
    paddingRight: '40px',
    itemSpacing: '20px',
  },
} as const;

// Typography scales
export const TYPOGRAPHY_SCALES = {
  compact: {
    multiplier: 0.875, // 87.5%
    headingSize: '20px',
    bodySize: '14px',
    smallSize: '12px',
  },
  standard: {
    multiplier: 1.0, // 100%
    headingSize: '24px',
    bodySize: '16px',
    smallSize: '14px',
  },
  comfortable: {
    multiplier: 1.125, // 112.5%
    headingSize: '30px',
    bodySize: '20px',
    smallSize: '16px',
  },
} as const;

// Button border radius based on style
export const BUTTON_STYLES = {
  rounded: '8px',
  square: '0px',
  pill: '9999px',  // Fully rounded
} as const;

// Image border radius based on style
export const IMAGE_RADIUS = {
  rounded: '8px',
  square: '0px',
  pill: '9999px',  // Fully rounded
} as const;

export type ImageRadiusStyle = keyof typeof IMAGE_RADIUS;

// Email layout style (overall wrapper: spacing, corners, border) – city-themed names (Berlin removed)
export const EMAIL_LAYOUT_STYLES = {
  copenhagen: 'Copenhagen',  // Contained card: rounded, spaced, friendly (default)
  newyork: 'New York',       // Full-bleed: edge-to-edge, no frame
  oslo: 'Oslo',              // Minimal: more whitespace, no border
} as const;

export type EmailLayoutStyle = keyof typeof EMAIL_LAYOUT_STYLES;

export interface EmailWrapperStyles {
  outerPaddingTop: string;
  outerPaddingSides: string;
  innerBorderRadius: string;
  innerBorder: string;
}

/**
 * Layout style summary:
 * - Copenhagen: Rounded card (20px), light border, standard padding → friendly, contained.
 * - New York:   No padding, no border, no radius → full-bleed, bold.
 * - Oslo:      No border, no radius, large padding → minimal, breathing room.
 * (Legacy 'berlin' falls through to default → Copenhagen.)
 */
export function getEmailWrapperStyles(globalTheme: { emailLayoutStyle?: EmailLayoutStyle }): EmailWrapperStyles {
  const style = globalTheme.emailLayoutStyle ?? 'copenhagen';
  switch (style) {
    case 'copenhagen':
      return { outerPaddingTop: '32px', outerPaddingSides: '20px', innerBorderRadius: '20px', innerBorder: '1px solid #D1D5DB' };
    case 'newyork':
      return { outerPaddingTop: '0', outerPaddingSides: '0', innerBorderRadius: '0', innerBorder: 'none' };
    case 'oslo':
      return { outerPaddingTop: '56px', outerPaddingSides: '28px', innerBorderRadius: '0', innerBorder: 'none' };
    default:
      return { outerPaddingTop: '32px', outerPaddingSides: '20px', innerBorderRadius: '20px', innerBorder: '1px solid #D1D5DB' };
  }
}

// ============================================================================
// THEME COLOR SCHEME GENERATOR
// ============================================================================

/**
 * Generate complete color scheme based on mode and primary color
 * This ensures all colors work together and meet accessibility standards
 */
export function getThemeColorScheme(
  mode: ThemeMode,
  primaryColor: string
): ThemeColorScheme {
  const headerText = getContrastTextColor(primaryColor);
  
  if (mode === 'dark') {
    return {
      // Header
      headerBackground: createColorToken(primaryColor),
      headerText: createColorToken(headerText),
      headerAccent: createColorToken(headerText),  // SOLID COLOR - no opacity
      
      // Body - Dark mode uses dark backgrounds
      emailBackground: createColorToken('neutral-900'),      // Slate 900
      blockBackground: createColorToken('neutral-800'),      // Slate 800
      footerBackground: createColorToken(darkenColor(primaryColor, 0.7)),  // Darkened brand color for visual connection
      bodyText: createColorToken('neutral-100'),             // Slate 100
      mutedText: createColorToken('neutral-400'),            // Slate 400
      
      // Interactive
      primaryButton: createColorToken(primaryColor),
      primaryButtonText: createColorToken(headerText),
      secondaryButton: createColorToken('neutral-100'),      // Slate 100 - Light button for dark mode
      secondaryButtonText: createColorToken('neutral-900'),  // Slate 900 - Dark text for contrast
      
      // Borders
      border: createColorToken('neutral-700'),               // Slate 700
      borderStrong: createColorToken('neutral-600'),         // Slate 600
    };
  } else {
    return {
      // Header
      headerBackground: createColorToken(primaryColor),
      headerText: createColorToken(headerText),
      headerAccent: createColorToken(headerText),  // SOLID COLOR - no opacity
      
      // Body - Light mode uses light backgrounds
      emailBackground: createColorToken('neutral-50'),       // Gray to match canvas
      blockBackground: createColorToken('white'),            // White
      footerBackground: createColorToken(lightenColor(primaryColor, 0.95)),  // 5% brand color tint for visual connection
      bodyText: createColorToken('neutral-800'),             // Slate 800
      mutedText: createColorToken('neutral-500'),            // Slate 500
      
      // Interactive
      primaryButton: createColorToken(primaryColor),
      primaryButtonText: createColorToken(headerText),
      secondaryButton: createColorToken('neutral-100'),      // Slate 100
      secondaryButtonText: createColorToken('neutral-800'),  // Slate 800
      
      // Borders
      border: createColorToken('neutral-200'),               // Slate 200
      borderStrong: createColorToken('neutral-300'),         // Slate 300
    };
  }
}

function parsePx(value: string): number {
  if (typeof value !== 'string') return 24;
  const n = parseInt(value.replace(/px$/i, ''), 10);
  return Number.isFinite(n) ? n : 24;
}

/**
 * Apply theme colors and typography scale to header props
 */
export function applyThemeToHeader(
  headerProps: any,
  colorScheme: ThemeColorScheme,
  globalTheme: GlobalThemeSettings
): any {
  const paddingMap: Record<SpacingPreset, 'sm' | 'md' | 'lg'> = {
    compact: 'sm',
    standard: 'md',
    spacious: 'lg',
  };
  const scale = globalTheme.typographyScale ?? 'standard';
  const typo = TYPOGRAPHY_SCALES[scale];

  return {
    ...headerProps,
    backgroundColor: colorScheme.headerBackground,
    titleColor: colorScheme.headerText,
    dateColor: colorScheme.headerAccent,
    contentAlignment: globalTheme.defaultAlignment,
    padding: paddingMap[globalTheme.spacingPreset],
    paddingTop: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined,
    paddingRight: undefined,
    theme: undefined,
    titleFontSize: parsePx(typo.headingSize),
    dateFontSize: parsePx(typo.bodySize),
    productNameFontSize: parsePx(typo.smallSize),
  };
}

/**
 * Apply theme colors and typography scale to footer props
 */
export function applyThemeToFooter(
  footerProps: any,
  colorScheme: ThemeColorScheme,
  globalTheme: GlobalThemeSettings
): any {
  const paddingMap: Record<SpacingPreset, 'sm' | 'md' | 'lg'> = {
    compact: 'sm',
    standard: 'md',
    spacious: 'lg',
  };
  const scale = globalTheme.typographyScale ?? 'standard';
  const typo = TYPOGRAPHY_SCALES[scale];

  return {
    ...footerProps,
    backgroundColor: colorScheme.footerBackground,
    messageColor: colorScheme.bodyText,
    teamNameColor: colorScheme.bodyText,
    disclaimerColor: colorScheme.mutedText,
    linkColor: colorScheme.primaryButton,
    ctaColor: globalTheme.primaryColor,
    contentAlignment: globalTheme.defaultAlignment,
    padding: paddingMap[globalTheme.spacingPreset],
    paddingTop: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined,
    paddingRight: undefined,
    theme: undefined,
    messageFontSize: parsePx(typo.bodySize),
    teamNameFontSize: parsePx(typo.bodySize),
    disclaimerFontSize: parsePx(typo.smallSize),
  };
}

/**
 * Apply spacing preset to block props
 */
export function applySpacingToBlock(blockProps: any, preset: SpacingPreset): any {
  // Map preset to PaddingSize
  const paddingMap: Record<SpacingPreset, 'sm' | 'md' | 'lg'> = {
    compact: 'sm',
    standard: 'md',
    spacious: 'lg',
  };
  
  return {
    ...blockProps,
    padding: paddingMap[preset],
  };
}

/**
 * Apply typography scale to block props
 */
export function applyTypographyToBlock(blockProps: any, scale: TypographyScale): any {
  // Map scale to FontSize used by blocks (stronger deltas for visible Text Scale)
  // Compact: ~18–20px title, 14px body; Standard: 22–24px, 16px; Comfortable: 28–32px, 18–20px
  const titleSizeMap: Record<TypographyScale, 'lg' | 'xl' | '2xl' | '3xl' | '4xl'> = {
    compact: 'xl',      // 20px
    standard: '2xl',    // 22px (default)
    comfortable: '4xl', // 32px (clearly larger)
  };
  
  const descriptionSizeMap: Record<TypographyScale, 'sm' | 'base' | 'lg' | 'xl'> = {
    compact: 'sm',      // 14px
    standard: 'base',   // 16px (default)
    comfortable: 'xl',   // 20px (clearly larger)
  };
  
  return {
    ...blockProps,
    titleSize: titleSizeMap[scale],
    descriptionSize: descriptionSizeMap[scale],
  };
}

/**
 * Apply primary color to block props
 */
export function applyPrimaryColorToBlock(blockProps: any, color: string): any {
  return {
    ...blockProps,
    ctaColor: color,  // ✅ NOW IMPLEMENTED: CTA buttons use global theme color
  };
}

/**
 * Apply content alignment to block props
 */
export function applyAlignmentToBlock(blockProps: any, alignment: ContentAlignment): any {
  return {
    ...blockProps,
    contentAlign: alignment,
    titleAlign: alignment,
    descriptionAlign: alignment,
    ctaAlign: alignment,
  };
}

/**
 * Apply button style to block props
 */
export function applyButtonStyleToBlock(blockProps: any, style: ButtonStyle): any {
  return {
    ...blockProps,
    ctaBorderRadius: BUTTON_STYLES[style]
  };
}

/**
 * Apply global theme to a single block
 */
export function applyGlobalThemeToBlock(blockProps: any, theme: GlobalThemeSettings): any {
  let props = { ...blockProps };

  if (theme.defaultBlockTheme) {
    props.theme = theme.defaultBlockTheme;
  }

  props = applySpacingToBlock(props, theme.spacingPreset);
  props = applyTypographyToBlock(props, theme.typographyScale);
  props = applyPrimaryColorToBlock(props, theme.primaryColor);
  props = applyAlignmentToBlock(props, theme.defaultAlignment);
  props = applyButtonStyleToBlock(props, theme.buttonStyle);

  return props;
}

/**
 * Get metadata for spacing presets
 */
export function getSpacingPresetMetadata(preset: SpacingPreset) {
  switch (preset) {
    case 'compact':
      return {
        label: 'Compact',
        description: 'Minimal spacing, dense layout',
        icon: '•',
      };
    case 'standard':
      return {
        label: 'Standard',
        description: 'Balanced spacing, recommended',
        icon: '••',
      };
    case 'spacious':
      return {
        label: 'Spacious',
        description: 'Generous spacing, airy layout',
        icon: '•••',
      };
  }
}

/**
 * Get metadata for typography scales
 */
export function getTypographyScaleMetadata(scale: TypographyScale) {
  switch (scale) {
    case 'compact':
      return {
        label: 'Compact',
        description: 'Smaller text sizes',
        icon: 'A',
      };
    case 'standard':
      return {
        label: 'Standard',
        description: 'Default text sizes',
        icon: 'A+',
      };
    case 'comfortable':
      return {
        label: 'Comfortable',
        description: 'Larger text sizes',
        icon: 'A++',
      };
  }
}