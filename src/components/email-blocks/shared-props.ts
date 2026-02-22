/**
 * Shared Props & Interfaces
 * 
 * Common TypeScript interfaces for all email blocks to ensure
 * consistency and reduce code duplication.
 * 
 * Usage:
 * import { BaseBlockProps, CTABlockProps } from './shared-props';
 */

import { 
  PaddingSize, 
  SpacingSize, 
  GapSize, 
  AlignmentOption 
} from '../../lib/layout-scales';

import { 
  FontSize, 
  FontWeight, 
  TextColor 
} from '../../lib/typography-scales';

import { BadgeType } from './badge-styles';
import { CTAButtonStyle } from './email-styles';
import { type ColorValue, type ColorId } from '../../lib/color-token-system';
import { type ImageRadiusStyle } from '../../lib/global-theme';

// ============================================================================
// LAYOUT PROPS
// ============================================================================

/**
 * Layout and spacing properties
 * Common to all blocks
 */
export interface LayoutProps {
  // Padding control
  padding?: PaddingSize;
  
  // Alignment control - unified alignment for all content
  contentAlign?: AlignmentOption;
  
  // Internal spacing
  titleDescriptionGap?: SpacingSize;
  descriptionCtaGap?: SpacingSize;
  
  // System flags
  isEmailMode?: boolean;
  showCardStyle?: boolean;
}

// ============================================================================
// TYPOGRAPHY PROPS
// ============================================================================

/**
 * Typography properties
 * Control for text styling
 */
export interface TypographyProps {
  // Title typography
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  titleColor?: ColorValue | ColorId | string;  // Token-based color
  
  // Description typography
  descriptionSize?: FontSize;
  descriptionWeight?: FontWeight;
  descriptionColor?: ColorValue | ColorId | string;  // Token-based color
}

// ============================================================================
// VISIBILITY PROPS
// ============================================================================

/**
 * Content visibility toggles
 * Control what content is shown/hidden
 */
export interface VisibilityProps {
  showTitle?: boolean;
  showDescription?: boolean;
  showBadge?: boolean;
  showIcon?: boolean;
}

// ============================================================================
// BASE BLOCK PROPS
// ============================================================================

/**
 * Base properties for all content blocks
 * Combines layout, typography, theme, and visibility
 */
export interface BaseBlockProps extends LayoutProps, TypographyProps, ThemeProps, VisibilityProps {
  // Required content
  title: string;
  
  // Optional enhancements
  icon?: React.ReactNode;
  badge?: BadgeType;
}

// ============================================================================
// BLOCK PROPS WITH DESCRIPTION
// ============================================================================

/**
 * Properties for blocks that have descriptions
 */
export interface DescriptionBlockProps extends BaseBlockProps {
  description: string;
}

// ============================================================================
// CTA PROPS
// ============================================================================

/**
 * Call-to-action properties
 * For blocks with CTAs
 */
export interface CTAProps {
  // CTA content
  ctaText: string;
  ctaLink: string;
  
  // CTA styling
  ctaStyle?: CTAButtonStyle;
  ctaBorderRadius?: string;
  ctaColor?: ColorValue | ColorId | string;  // Token-based CTA button color
  
  // CTA visibility
  showCTA?: boolean;
  
  // CTA sizing
  ctaWidth?: 'auto' | 'full';
  ctaSize?: 'sm' | 'md' | 'lg';
}

/**
 * Properties for blocks with CTA buttons
 */
export interface CTABlockProps extends DescriptionBlockProps, CTAProps {}

// ============================================================================
// IMAGE PROPS
// ============================================================================

/**
 * Image/screenshot properties
 * For blocks with images
 */
export interface ImageProps {
  // Image source
  screenshot: string;
  screenshotAlt: string;
  
  // Image layout
  imageAlign?: AlignmentOption;
  imageWidth?: 'sm' | 'md' | 'lg' | 'full';
  imageShape?: 'square' | 'rounded' | 'circle';
  imageRadius?: ImageRadiusStyle;  // Image corner radius (square, rounded, pill)
  
  // Image spacing
  imageMargin?: SpacingSize;
}

/**
 * Properties for blocks with images
 */
export interface ImageBlockProps extends CTABlockProps, ImageProps {}

// ============================================================================
// LIST PROPS
// ============================================================================

/**
 * List/bullet properties
 * For blocks with bullet points or lists
 */
export interface ListProps {
  // List content
  bullets: string[];
  
  // List styling
  bulletStyle?: 'disc' | 'check' | 'arrow' | 'number';
  bulletSpacing?: SpacingSize;
  
  // List visibility
  showBullets?: boolean;
}

/**
 * Properties for blocks with lists
 */
export interface ListBlockProps extends CTABlockProps, ListProps {}

// ============================================================================
// GRID PROPS
// ============================================================================

/**
 * Grid layout properties
 * For blocks with grid/column layouts
 */
export interface GridProps {
  // Grid content
  items: string[];
  
  // Grid layout
  gridColumns?: 1 | 2 | 3 | 4;
  itemSpacing?: GapSize;      // Vertical gap between rows
  columnGap?: GapSize;        // Horizontal gap between columns
  
  // Grid styling
  itemBackground?: ColorValue | ColorId | string;  // Token-based color
  itemBorder?: boolean;
}

/**
 * Properties for blocks with grids
 */
export interface GridBlockProps extends DescriptionBlockProps, GridProps {}

// ============================================================================
// THEME PROPS
// ============================================================================

/**
 * Theme properties
 * NEW: Support for pre-defined color themes
 */
export interface ThemeProps {
  /**
   * Theme ID (e.g., 'brand-primary', 'neutral-dark')
   * When set, theme colors override backgroundColor and textColor
   */
  theme?: string;
  
  /**
   * Use colorful backgrounds from theme (header zone colors)
   * When false: Uses body zone (white backgrounds) - default
   * When true: Uses header zone (colored backgrounds)
   * Default: false
   */
  colorfulMode?: boolean;
  
  /**
   * Swap foreground and background colors of the selected theme
   * When true, inverts the fg/bg colors (e.g., blue bg + white text becomes white bg + blue text)
   * Default: false
   */
  themeSwapped?: boolean;
  
  /**
   * Force use of theme even if custom colors are set
   * Default: false (custom colors take precedence if both exist)
   */
  useTheme?: boolean;
}

// ============================================================================
// BACKGROUND PROPS
// ============================================================================

/**
 * Background and border properties
 * For advanced styling
 */
export interface BackgroundProps {
  // Background
  backgroundColor?: ColorValue | ColorId | string;  // Token-based color
  backgroundPattern?: 'none' | 'dots' | 'stripes' | 'diagonal' | 'grid';
  patternOpacity?: number;
  
  // Borders
  borderColor?: ColorValue | ColorId | string;  // Token-based color
  borderWidth?: 'none' | 'thin' | 'medium' | 'thick';
  borderSide?: 'none' | 'left' | 'top' | 'right' | 'bottom' | 'all';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// ============================================================================
// EDITABLE PROPS
// ============================================================================

/**
 * Properties for editable content
 * Used in build mode for inline editing
 */
export interface EditableProps {
  isEditable?: boolean;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onCtaTextChange?: (value: string) => void;
  onCtaLinkChange?: (value: string) => void;
}

// ============================================================================
// COMBINED PROPS (For specific block types)
// ============================================================================

/**
 * Complete props for feature blocks with screenshots
 */
export interface FeatureWithScreenshotProps extends ImageBlockProps, ListBlockProps, EditableProps {
  // Additional feature-specific props
  useGradientBackground?: boolean;
  gradientPreset?: string;
  fullWidth?: boolean;
}

/**
 * Complete props for text-only blocks
 */
export interface TextOnlyBlockProps extends CTABlockProps, EditableProps {}

/**
 * Complete props for warning/alert blocks
 */
export interface WarningBlockProps extends DescriptionBlockProps, CTAProps {
  // Warning-specific
  severity?: 'low' | 'medium' | 'high' | 'critical';
  showPattern?: boolean;
  message: string;  // Alternative to description
}

/**
 * Complete props for item grid blocks
 */
export interface ItemGridBlockProps extends GridBlockProps, CTAProps {}

/**
 * Complete props for code snippet blocks
 */
export interface CodeSnippetBlockProps extends BaseBlockProps {
  code: string;
  language: string;
  codeTheme?: 'light' | 'dark';
  showLineNumbers?: boolean;
  fontSize?: 'xs' | 'sm' | 'md';
}

/**
 * Complete props for video blocks
 */
export interface VideoBlockProps extends DescriptionBlockProps {
  duration?: string;
  thumbnailUrl?: string;
  showDuration?: boolean;
  thumbnailSize?: 'sm' | 'md' | 'lg';
  imageRadius?: ImageRadiusStyle;  // Image corner radius for thumbnail
}

/**
 * Complete props for stats/metrics blocks
 */
export interface StatsMetricsBlockProps extends BaseBlockProps {
  stats: Array<{
    value: string;
    label: string;
  }>;
  statLayout?: 'horizontal' | 'vertical';
  statColumns?: 2 | 3 | 4;
  valueColor?: ColorValue | ColorId | string;  // Token-based color
  valueSize?: FontSize;
}

/**
 * Complete props for timeline blocks
 */
export interface TimelineBlockProps {
  items: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  showConnectors?: boolean;
  itemSpacing?: SpacingSize;
  dateColor?: ColorValue | ColorId | string;  // Token-based color
  isEmailMode?: boolean;
}

/**
 * Complete props for two-column blocks
 */
export interface TwoColumnBlockProps extends LayoutProps {
  leftColumn: {
    title: string;
    description: string;
  };
  rightColumn: {
    title: string;
    description: string;
  };
  columnRatio?: '50-50' | '60-40' | '40-60' | '70-30';
  columnGap?: GapSize;
  stackOnMobile?: boolean;
  titleColor?: ColorValue | ColorId | string;  // Token-based color
  titleSize?: FontSize;
  descriptionColor?: ColorValue | ColorId | string;  // Token-based color
  descriptionSize?: FontSize;
}

/**
 * Complete props for multi-update blocks
 */
export interface MultiUpdateBlockProps extends BaseBlockProps {
  updates: Array<{
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  }>;
  updateSpacing?: SpacingSize;
  ctaStyle?: CTAButtonStyle;
}

/**
 * Complete props for divider blocks
 */
export interface DividerBlockProps {
  color?: ColorValue | ColorId | string;  // Token-based color
  style?: 'solid' | 'dashed' | 'dotted';
  thickness?: 'thin' | 'medium' | 'thick';
  spacing?: 'compact' | 'normal' | 'spacious';
  isEmailMode?: boolean;
}

// ============================================================================
// HEADER/FOOTER PROPS
// ============================================================================

/**
 * Header block props
 */
export interface HeaderBlockProps {
  date: string;
  logoUrl?: string;
  version?: string;
  isEmailMode?: boolean;
}

/**
 * Footer block props
 */
export interface FooterBlockProps {
  showPattern?: boolean;
  isEmailMode?: boolean;
}

/**
 * CTA Footer block props
 */
export interface CTAFooterBlockProps extends FooterBlockProps {
  ctaText: string;
  ctaLink: string;
  description: string;
}

/**
 * Contact Footer block props
 */
export interface ContactFooterBlockProps extends FooterBlockProps {
  companyName?: string;
  address?: string;
  email?: string;
  website?: string;
}

// ============================================================================
// DEFAULT VALUES - REMOVED
// ============================================================================

/**
 * DEFAULT_BLOCK_PROPS has been removed.
 * 
 * All default values now come from /lib/block-defaults.ts via BLOCK_DEFAULTS.
 * This eliminates the 3-layer default values problem and ensures a single 
 * source of truth for all block defaults.
 * 
 * Components should NOT have inline defaults in their destructuring.
 * Props flow: BLOCK_DEFAULTS → App.tsx (createDefaultBlock) → Component
 */

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if props include CTA
 */
export const hasCTA = (props: any): props is CTAProps => {
  return 'ctaText' in props && 'ctaLink' in props;
};

/**
 * Check if props include image
 */
export const hasImage = (props: any): props is ImageProps => {
  return 'screenshot' in props && 'screenshotAlt' in props;
};

/**
 * Check if props include list
 */
export const hasList = (props: any): props is ListProps => {
  return 'bullets' in props && Array.isArray(props.bullets);
};

/**
 * Check if props include grid
 */
export const hasGrid = (props: any): props is GridProps => {
  return 'items' in props && Array.isArray(props.items);
};