/**
 * Color Token System - Complete Implementation
 * 
 * This file implements the CORRECT way to handle colors:
 * - Store: Color token IDs (e.g., 'white', 'brand-600')
 * - Display: Semantic names (e.g., "White", "Brand Primary")
 * - Render: Hex values at runtime (e.g., '#FFFFFF', '#004EEB')
 */

import {
  COLOR_PALETTE_V2,
  getColorByIdV2,
  getColorHexV2,
  findClosestColorV2,
  type ColorDefinition
} from './color-palette-v2';
import { getThemeById } from './theme-catalog';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Color Token ID - only valid palette IDs allowed
 */
export type ColorId = typeof COLOR_PALETTE_V2[number]['id'];

/**
 * Color value with optional opacity
 * This is what we store in state
 */
export interface ColorValue {
  id: ColorId | 'custom';  // 'custom' for non-palette colors
  hex?: string;  // Required when id is 'custom'
  opacity?: number;  // 0-1, default 1.0
}

/**
 * Simple color - either token ID or legacy hex
 */
export type Color = ColorId | string;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert hex or rgba string to ColorValue
 * This handles migration from old hex-based system
 */
export function hexToColorValue(hexOrRgba: string): ColorValue {
  // Type safety: ensure input is a string
  if (typeof hexOrRgba !== 'string') {
    console.warn('hexToColorValue received non-string input:', hexOrRgba);
    return { id: 'custom', hex: '#CCCCCC' }; // Return fallback
  }
  
  // Normalize hex format
  let normalizedHex = hexOrRgba;
  let opacity: number | undefined;
  
  // Handle rgba with opacity
  if (hexOrRgba.startsWith('rgba(')) {
    const match = hexOrRgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      opacity = parseFloat(match[4]);
      
      normalizedHex = '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
      }).join('').toUpperCase();
    }
  }
  // Handle rgb without opacity
  else if (hexOrRgba.startsWith('rgb(')) {
    const match = hexOrRgba.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      
      normalizedHex = '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
      }).join('').toUpperCase();
    }
  } else {
    // Normalize hex to uppercase
    normalizedHex = hexOrRgba.toUpperCase();
  }
  
  // Check if this exact hex exists in our palette
  const exactMatch = COLOR_PALETTE_V2.find(c => c.hex.toUpperCase() === normalizedHex);
  
  if (exactMatch) {
    // Use palette color
    return {
      id: exactMatch.id as ColorId,
      ...(opacity !== undefined && opacity < 1.0 && { opacity })
    };
  } else {
    // Custom color - don't force into palette
    return {
      id: 'custom' as ColorId,
      hex: normalizedHex,
      ...(opacity !== undefined && opacity < 1.0 && { opacity })
    };
  }
}

/**
 * Convert ColorValue to hex string for rendering
 */
export function colorValueToHex(colorValue: ColorValue | ColorId | string | undefined | null): string {
  // Handle undefined/null - return a default fallback
  if (colorValue === undefined || colorValue === null) {
    return '#CCCCCC'; // Neutral gray fallback for undefined colors
  }
  
  // Handle string color ID
  if (typeof colorValue === 'string') {
    return getColorHexV2(colorValue);
  }
  
  // Handle ColorValue object
  let hex: string;
  
  if (colorValue.id === 'custom' && colorValue.hex) {
    // Use custom hex value
    hex = colorValue.hex;
  } else if (colorValue.id === 'custom') {
    // Custom without hex (e.g. corrupted/old state) - avoid black
    hex = '#64748B';
  } else {
    // Look up hex from palette
    hex = getColorHexV2(colorValue.id);
  }
  
  // If opacity is specified and < 1.0, convert to rgba
  if (colorValue.opacity !== undefined && colorValue.opacity < 1.0) {
    return hexToRgba(hex, colorValue.opacity);
  }
  
  return hex;
}

/**
 * Convert hex to rgba with opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  // Handle 'transparent' special case
  if (hex === 'transparent') {
    return 'transparent';
  }
  
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// ============================================================================
// DISPLAY UTILITIES
// ============================================================================

/**
 * Get display name for a color (shows in Properties Panel)
 */
export function getColorDisplayName(colorValue: ColorValue | ColorId | string | undefined | null): string {
  // Handle undefined/null
  if (colorValue === undefined || colorValue === null) {
    return 'Not Set';
  }
  
  // Handle string color ID
  if (typeof colorValue === 'string') {
    const color = getColorByIdV2(colorValue);
    return color?.displayName || color?.name || colorValue;
  }
  
  // Handle custom colors
  if (colorValue.id === 'custom') {
    const baseName = 'Custom Color';
    if (colorValue.opacity !== undefined && colorValue.opacity < 1.0) {
      const percentOpacity = Math.round(colorValue.opacity * 100);
      return `${baseName} (${percentOpacity}%)`;
    }
    return baseName;
  }
  
  // Handle ColorValue object
  const color = getColorByIdV2(colorValue.id);
  const baseName = color?.displayName || color?.name || colorValue.id;
  
  // Add opacity if specified
  if (colorValue.opacity !== undefined && colorValue.opacity < 1.0) {
    const percentOpacity = Math.round(colorValue.opacity * 100);
    return `${baseName} (${percentOpacity}%)`;
  }
  
  return baseName;
}

/**
 * Get context-aware name based on purpose
 */
function getContextAwareName(colorId: ColorId, purpose?: 'text' | 'background' | 'all'): string {
  const color = getColorByIdV2(colorId);
  if (!color) return colorId;
  
  // For background context, use alternative names for neutral colors
  if (purpose === 'background') {
    const bgNames: Record<string, string> = {
      'neutral-50': 'Subtle Surface',
      'neutral-100': 'Surface',
      'neutral-200': 'Soft Background',
      'neutral-300': 'Light Surface',
      'neutral-400': 'Muted Surface',
      'neutral-500': 'Medium Surface',
      'neutral-600': 'Dark Surface',
      'neutral-700': 'Deep Surface',
      'neutral-800': 'Darker Surface',
      'neutral-900': 'Darkest Surface',
    };
    return bgNames[colorId] || color.name;
  }
  
  // For text context, use text-appropriate names
  if (purpose === 'text') {
    const textNames: Record<string, string> = {
      'neutral-400': 'Muted Text',
      'neutral-500': 'Body Text',
      'neutral-600': 'Strong Text',
      'neutral-700': 'Emphasis',
      'neutral-800': 'Emphasis',
      'neutral-900': 'Emphasis',
    };
    return textNames[colorId] || color.name;
  }
  
  // Default: use the original name
  return color.name;
}

/**
 * Get short name for a color (for compact displays)
 */
export function getColorShortName(
  colorValue: ColorValue | ColorId | string | undefined | null,
  purpose?: 'text' | 'background' | 'all'
): string {
  // Handle undefined/null
  if (colorValue === undefined || colorValue === null) {
    return 'Not Set';
  }
  
  // Handle string color ID
  if (typeof colorValue === 'string') {
    const baseName = getContextAwareName(colorValue as ColorId, purpose);
    return baseName;
  }
  
  // Handle custom colors - just say "Custom Color" (hex shows in badge)
  if (colorValue.id === 'custom') {
    const baseName = 'Custom Color';
    if (colorValue.opacity !== undefined && colorValue.opacity < 1.0) {
      const percentOpacity = Math.round(colorValue.opacity * 100);
      return `${baseName} ${percentOpacity}%`;
    }
    return baseName;
  }
  
  // Handle ColorValue object
  const baseName = getContextAwareName(colorValue.id, purpose);
  
  // Add opacity if specified
  if (colorValue.opacity !== undefined && colorValue.opacity < 1.0) {
    const percentOpacity = Math.round(colorValue.opacity * 100);
    return `${baseName} ${percentOpacity}%`;
  }
  
  return baseName;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Check if a string is a valid color ID
 */
export function isValidColorId(id: string): id is ColorId {
  return id === 'custom' || COLOR_PALETTE_V2.some(color => color.id === id);
}

/**
 * Check if a value is a ColorValue object
 */
export function isColorValue(value: any): value is ColorValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    isValidColorId(value.id)
  );
}

// ============================================================================
// MIGRATION UTILITIES
// ============================================================================

/**
 * Migrate legacy color string to ColorValue
 * Handles:
 * - Hex strings: '#FFFFFF' → { id: 'white' }
 * - Rgba strings: 'rgba(255,255,255,0.9)' → { id: 'white', opacity: 0.9 }
 * - Already valid IDs: 'white' → { id: 'white' }
 * - ColorValue objects: return as-is
 */
export function migrateToColorValue(color: string | ColorValue | undefined): ColorValue | undefined {
  if (!color) return undefined;
  
  // If already a ColorValue object, return it
  if (typeof color === 'object' && 'id' in color) {
    return color;
  }
  
  // If not a string, return undefined to avoid errors
  if (typeof color !== 'string') {
    return undefined;
  }
  
  // If already a valid color ID, wrap it
  if (isValidColorId(color)) {
    return { id: color };
  }
  
  // Convert hex/rgba to ColorValue
  return hexToColorValue(color);
}

/**
 * Migrate an entire config object's colors
 */
export function migrateConfigColors<T extends Record<string, any>>(
  config: T,
  colorProperties: (keyof T)[]
): T {
  const migrated = { ...config };
  
  for (const prop of colorProperties) {
    const value = migrated[prop];
    if (typeof value === 'string') {
      migrated[prop] = migrateToColorValue(value) as any;
    }
  }
  
  return migrated;
}

/**
 * Create a color token from a hex string or color ID
 * This is the primary way to create ColorValue objects
 * 
 * Examples:
 * - createColorToken('#FFFFFF') → { id: 'white' }
 * - createColorToken('white') → { id: 'white' }
 * - createColorToken('brand-600') → { id: 'brand-600' }
 */
export function createColorToken(colorInput: string | ColorId, opacity?: number): ColorValue {
  // If it's already a valid color ID, use it directly
  if (isValidColorId(colorInput)) {
    return opacity !== undefined ? { id: colorInput, opacity } : { id: colorInput };
  }
  
  // Otherwise, convert hex to ColorValue
  const colorValue = hexToColorValue(colorInput);
  
  // Apply opacity override if provided
  if (opacity !== undefined) {
    colorValue.opacity = opacity;
  }
  
  return colorValue;
}

// ============================================================================
// GROUPED COLORS FOR COLOR PICKER
// ============================================================================
//
// Group order (by design): 1. Most Used, 2. Brand Colors, 3. Grays, 4. Semantic.
// Most Used is deduplicated: it only contains IDs not shown in Brand or Grays,
// so the same swatch never appears twice (see THEME_AND_COLOR_AUDIT.md).

export interface ColorGroup {
  id: string;
  label: string;
  description?: string;
  colors: ColorDefinition[];
}

/** IDs shown in "Most Used" – only non-brand, non-neutral so no duplicate swatches in Brand/Grays. */
const MOST_USED_IDS = ['white', 'black'] as const;

/**
 * Get grouped colors for color picker display.
 * Order: Most Used → Brand Colors → Grays → Semantic (when purpose allows).
 * Duplicates removed: Most Used contains only white/black; Brand and Grays show full palettes.
 */
export function getColorGroups(purpose?: 'text' | 'background' | 'all'): ColorGroup[] {
  const groups: ColorGroup[] = [];

  // Most Used – only white/black to avoid duplicates in Brand/Grays (audit fix)
  const mostUsedColors = MOST_USED_IDS.map(id => getColorByIdV2(id)).filter(Boolean) as ColorDefinition[];
  if (mostUsedColors.length > 0) {
    groups.push({
      id: 'common',
      label: 'Most Used',
      colors: mostUsedColors
    });
  }

  // Brand Colors (full brand slice)
  const brandColors = COLOR_PALETTE_V2.filter(c => c.category === 'brand');
  if (brandColors.length > 0) {
    groups.push({
      id: 'brand',
      label: 'Brand Colors',
      description: 'Kore.ai brand blues',
      colors: brandColors
    });
  }

  // Neutral/Gray Colors (full grays slice)
  const neutralColors = COLOR_PALETTE_V2.filter(c => c.category === 'neutral');
  if (neutralColors.length > 0) {
    groups.push({
      id: 'neutral',
      label: 'Grays',
      description: 'Text and borders',
      colors: neutralColors
    });
  }

  // Semantic Colors (if not filtering by purpose)
  if (purpose !== 'text' && purpose !== 'background') {
    const semanticColors = COLOR_PALETTE_V2.filter(c => c.category === 'semantic');
    if (semanticColors.length > 0) {
      groups.push({
        id: 'semantic',
        label: 'Semantic',
        description: 'Status colors',
        colors: semanticColors
      });
    }
  }

  // Filter by purpose if specified
  if (purpose) {
    return groups.map(group => ({
      ...group,
      colors: group.colors.filter(c =>
        purpose === 'text' ? c.textSafe : c.backgroundSafe
      )
    })).filter(group => group.colors.length > 0);
  }

  return groups;
}

// ============================================================================
// HELPER FUNCTIONS FOR COMMON OPERATIONS
// ============================================================================

/**
 * Create a ColorValue from ID and optional opacity
 */
export function createColorValue(id: ColorId, opacity?: number): ColorValue {
  const value: ColorValue = { id };
  if (opacity !== undefined && opacity < 1.0) {
    value.opacity = opacity;
  }
  return value;
}

/**
 * Get color definition from ColorValue
 */
export function getColorDefinition(colorValue: ColorValue | ColorId | string): ColorDefinition | undefined {
  const id = typeof colorValue === 'string' ? colorValue : colorValue.id;
  return getColorByIdV2(id);
}

/**
 * Extract opacity from ColorValue
 */
export function getOpacity(colorValue: ColorValue | ColorId | string): number {
  if (typeof colorValue === 'string') return 1.0;
  return colorValue.opacity ?? 1.0;
}

/**
 * Set opacity on ColorValue
 */
export function withOpacity(colorValue: ColorValue | ColorId | string, opacity: number): ColorValue {
  const id = typeof colorValue === 'string' ? colorValue : colorValue.id;
  return createColorValue(id, opacity);
}

// ============================================================================
// THEME TOKEN HELPERS
// ============================================================================

/**
 * Get primary-500 (lighter primary) color from theme zone
 * @param themeId - Theme ID to look up
 * @param zone - Which zone ('header', 'body', or 'footer')
 * @returns Hex color string or fallback
 */
export function getThemePrimary500(themeId: string, zone: 'header' | 'body' | 'footer' = 'header'): string {
  const theme = getThemeById(themeId);
  
  if (!theme || !theme[zone].primary500) {
    // Fallback to a neutral color
    return '#60A5FA'; // Blue-400 as default
  }
  
  return theme[zone].primary500;
}

/**
 * Get primary-600 (darker primary) color from theme zone
 * @param themeId - Theme ID to look up
 * @param zone - Which zone ('header', 'body', or 'footer')
 * @returns Hex color string or fallback
 */
export function getThemePrimary600(themeId: string, zone: 'header' | 'body' | 'footer' = 'header'): string {
  const theme = getThemeById(themeId);
  
  if (!theme || !theme[zone].primary600) {
    // Fallback to a neutral color
    return '#3B82F6'; // Blue-500 as default
  }
  
  return theme[zone].primary600;
}

/**
 * Get text-dark color from theme zone
 * @param themeId - Theme ID to look up
 * @param zone - Which zone ('header', 'body', or 'footer')
 * @returns Hex color string or fallback
 */
export function getThemeTextDark(themeId: string, zone: 'header' | 'body' | 'footer' = 'header'): string {
  const theme = getThemeById(themeId);
  
  if (!theme || !theme[zone].textDark) {
    // Fallback to dark text
    return '#1E293B'; // Slate-800 as default
  }
  
  return theme[zone].textDark;
}

/**
 * Get text-light color from theme zone
 * @param themeId - Theme ID to look up
 * @param zone - Which zone ('header', 'body', or 'footer')
 * @returns Hex color string or fallback
 */
export function getThemeTextLight(themeId: string, zone: 'header' | 'body' | 'footer' = 'header'): string {
  const theme = getThemeById(themeId);
  
  if (!theme || !theme[zone].textLight) {
    // Fallback to white
    return '#FFFFFF';
  }
  
  return theme[zone].textLight;
}

/**
 * Get bg-50 (lightest background) color from theme zone
 * @param themeId - Theme ID to look up
 * @param zone - Which zone ('header', 'body', or 'footer')
 * @returns Hex color string or fallback
 */
export function getThemeBg50(themeId: string, zone: 'header' | 'body' | 'footer' = 'header'): string {
  const theme = getThemeById(themeId);
  
  if (!theme || !theme[zone].bg50) {
    // Fallback to light gray
    return '#F8FAFC'; // Slate-50 as default
  }
  
  return theme[zone].bg50;
}

/**
 * Get bg-100 (light background) color from theme zone
 * @param themeId - Theme ID to look up
 * @param zone - Which zone ('header', 'body', or 'footer')
 * @returns Hex color string or fallback
 */
export function getThemeBg100(themeId: string, zone: 'header' | 'body' | 'footer' = 'header'): string {
  const theme = getThemeById(themeId);
  
  if (!theme || !theme[zone].bg100) {
    // Fallback to light gray
    return '#F1F5F9'; // Slate-100 as default
  }
  
  return theme[zone].bg100;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Re-export types from color-palette-v2
  type ColorDefinition,
  COLOR_PALETTE_V2,
  getColorByIdV2,
  getColorHexV2,
  findClosestColorV2,
};