/**
 * Theme Application Utilities
 * 
 * Helpers for applying theme colors to content blocks with FG/BG swapping
 */

import { getThemeById, type ThemeDefinition } from './theme-catalog';
import { hexToColorValue, type ColorValue } from './color-token-system';

export interface ThemeApplicationResult {
  backgroundColor: string;
  titleColor: string;
  descriptionColor: string;
  ctaColor?: string;
  accentColor?: string;
}

/**
 * Apply theme colors to a content block
 * 
 * @param themeId - Theme ID from theme catalog
 * @param swapped - If true, swap fg and bg colors
 * @param zone - Which theme zone to use (default: 'body')
 * @returns Object with color values as hex strings
 * 
 * @example
 * const colors = applyThemeToBlock('kore-default', false, 'body');
 * // Returns: { backgroundColor: '#004EEB', titleColor: '#FFFFFF', ... }
 * 
 * const swappedColors = applyThemeToBlock('kore-default', true, 'body');
 * // Returns: { backgroundColor: '#FFFFFF', titleColor: '#004EEB', ... }
 */
export function applyThemeToBlock(
  themeId: string,
  swapped: boolean = false,
  zone: 'header' | 'body' | 'footer' = 'body'
): ThemeApplicationResult | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  const zoneColors = theme[zone];
  
  // Swap fg/bg if requested
  const backgroundColor = swapped ? zoneColors.fg : zoneColors.bg;
  const foregroundColor = swapped ? zoneColors.bg : zoneColors.fg;
  
  // Use primary600 for CTA if available, otherwise use foreground color
  const ctaColor = (zoneColors as any).primary600 || foregroundColor;
  
  return {
    backgroundColor,
    titleColor: foregroundColor,
    descriptionColor: foregroundColor,
    ctaColor: ctaColor,
    accentColor: foregroundColor,
  };
}

/**
 * Create ColorValue token from hex string
 * Useful for converting theme colors to ColorValue format
 * 
 * @param hex - Hex color string (e.g., '#004EEB')
 * @returns ColorValue object that can be used in block props
 * 
 * @example
 * const color = createColorToken('#004EEB');
 * // Can be used as: titleColor={color}
 */
export function createColorToken(hex: string): ColorValue {
  return hexToColorValue(hex);
}

/**
 * Get theme colors for a specific zone with swap support
 * 
 * @param themeId - Theme ID
 * @param zone - Zone to get colors for
 * @param swapped - Whether to swap colors
 * @returns Object with bg and fg hex values
 */
export function getThemeZoneColors(
  themeId: string,
  zone: 'header' | 'body' | 'footer',
  swapped: boolean = false
): { bg: string; fg: string } | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  const zoneColors = theme[zone];
  
  if (swapped) {
    return {
      bg: zoneColors.fg,
      fg: zoneColors.bg,
    };
  }
  
  return {
    bg: zoneColors.bg,
    fg: zoneColors.fg,
  };
}

/**
 * Get swapped theme colors using intermediate lightness tokens (bg200/fg200)
 * This provides smoother visual transitions than direct fg/bg inversion
 * 
 * @param themeId - Theme ID from theme catalog
 * @param zone - Which theme zone to use
 * @param swapped - If true, use bg200/fg200 tokens for smooth transition
 * @returns Object with bg and fg hex values, or null if theme not found
 * 
 * @example
 * // Normal mode
 * getSwappedColors('kore-default', 'body', false)
 * // Returns: { bg: '#FFFFFF', fg: '#1E293B' }
 * 
 * // Swapped mode - uses bg200 for smooth light background
 * getSwappedColors('kore-default', 'body', true)
 * // Returns: { bg: '#FFFFFF', fg: '#69839D' } (uses fg200 for softer text)
 * 
 * // Swapped on header zone - uses bg200 for lighter background
 * getSwappedColors('kore-default', 'header', true)
 * // Returns: { bg: '#80A7F5', fg: '#004EEB' } (bg200 lighter than original fg)
 */
export function getSwappedColors(
  themeId: string,
  zone: 'header' | 'body' | 'footer',
  swapped: boolean = false
): { bg: string; fg: string } | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  const zoneData = theme[zone];
  
  if (swapped) {
    // Use intermediate lightness tokens for smooth transitions
    // bg200 = 50% lightness boost from original bg (smoother than direct fg)
    // fg200 = 50% lightness boost from original fg (better contrast than direct bg)
    return {
      bg: zoneData.bg200 || zoneData.fg,  // Fallback to direct fg if bg200 missing
      fg: zoneData.fg200 || zoneData.bg,  // Fallback to direct bg if fg200 missing
    };
  }
  
  // Normal mode - use original bg/fg
  return {
    bg: zoneData.bg,
    fg: zoneData.fg,
  };
}