// Kore.ai Design System Color Palette V2
// Standardized system with NO duplicates
// Clear naming: Base colors + Semantic aliases + User-friendly display names

import { getThemeById } from './theme-catalog';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ColorDefinition {
  id: string;                // Technical ID (e.g., 'neutral-900')
  hex: string;               // Hex value (e.g., '#0F172A')
  name: string;              // Short name (e.g., 'Neutral 900')
  displayName: string;       // User-facing name (e.g., 'Primary Text (Neutral 900)')
  category: ColorCategory;   // Category for grouping
  usage: string;             // When to use this color
  textSafe: boolean;         // Safe to use for text
  backgroundSafe: boolean;   // Safe to use for backgrounds
  aliases?: string[];        // Semantic aliases (e.g., ['text-primary'])
}

export type ColorCategory = 
  | 'neutral'      // Grays for text, borders, backgrounds
  | 'brand'        // Kore.ai brand blues
  | 'semantic'     // Success, error, warning, info
  | 'special'      // White, black, transparent
  | 'theme-tokens'; // Dynamic theme-specific tokens

// ============================================================================
// BASE COLORS - Single Source of Truth
// ============================================================================

// NEUTRALS (Grays) - 10 shades
// These are the primary grays used throughout the system
const NEUTRALS: ColorDefinition[] = [
  {
    id: 'neutral-50',
    hex: '#F8FAFC',
    name: 'Subtle Background',
    displayName: 'Subtle Background (Neutral 50)',
    category: 'neutral',
    usage: 'Lightest gray - subtle backgrounds, hover states',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['bg-subtle']
  },
  {
    id: 'neutral-100',
    hex: '#F1F5F9',
    name: 'Surface',
    displayName: 'Surface (Neutral 100)',
    category: 'neutral',
    usage: 'Very light gray - cards, surfaces, containers',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['bg-surface']
  },
  {
    id: 'neutral-200',
    hex: '#E2E8F0',
    name: 'Border',
    displayName: 'Border (Neutral 200)',
    category: 'neutral',
    usage: 'Light gray - borders, dividers, separators',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['border-default', 'divider']
  },
  {
    id: 'neutral-300',
    hex: '#CBD5E1',
    name: 'Strong Border',
    displayName: 'Strong Border (Neutral 300)',
    category: 'neutral',
    usage: 'Medium-light gray - emphasized borders',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['border-strong']
  },
  {
    id: 'neutral-400',
    hex: '#94A3B8',
    name: 'Muted Text',
    displayName: 'Muted Text (Neutral 400)',
    category: 'neutral',
    usage: 'Medium gray - disabled text, placeholders, captions',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-muted', 'text-disabled', 'text-placeholder']
  },
  {
    id: 'neutral-500',
    hex: '#64748B',
    name: 'Body Text',
    displayName: 'Body Text (Neutral 500)',
    category: 'neutral',
    usage: 'Medium-dark gray - body text, descriptions',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-body', 'text-tertiary']
  },
  {
    id: 'neutral-600',
    hex: '#475569',
    name: 'Secondary Text',
    displayName: 'Secondary Text (Neutral 600)',
    category: 'neutral',
    usage: 'Dark gray - secondary headings, subtext',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-secondary']
  },
  {
    id: 'neutral-700',
    hex: '#334155',
    name: 'Heading',
    displayName: 'Heading (Neutral 700)',
    category: 'neutral',
    usage: 'Darker gray - headings, important text',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-heading']
  },
  {
    id: 'neutral-800',
    hex: '#1E293B',
    name: 'Emphasis',
    displayName: 'Emphasis (Neutral 800)',
    category: 'neutral',
    usage: 'Very dark gray - emphasized text, strong contrast',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-emphasis']
  },
  {
    id: 'neutral-900',
    hex: '#0F172A',
    name: 'Primary Text',
    displayName: 'Primary Text (Neutral 900)',
    category: 'neutral',
    usage: 'Darkest gray - primary text, maximum contrast',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-primary']
  },
];

// BRAND COLORS (Kore.ai Blue) - 10 shades
const BRAND: ColorDefinition[] = [
  {
    id: 'brand-50',
    hex: '#F0F5FF',
    name: 'Brand Light Background',
    displayName: 'Brand Light Background (Blue 50)',
    category: 'brand',
    usage: 'Lightest brand blue - subtle backgrounds',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['bg-brand-subtle']
  },
  {
    id: 'brand-100',
    hex: '#E5F0FF',
    name: 'Brand Pale',
    displayName: 'Brand Pale (Blue 100)',
    category: 'brand',
    usage: 'Pale brand blue - hover states on light backgrounds',
    textSafe: false,
    backgroundSafe: true,
  },
  {
    id: 'brand-200',
    hex: '#CCE0FF',
    name: 'Brand Subtle',
    displayName: 'Brand Subtle (Blue 200)',
    category: 'brand',
    usage: 'Subtle brand blue - borders, accents',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['border-brand']
  },
  {
    id: 'brand-300',
    hex: '#99BBFF',
    name: 'Brand Light',
    displayName: 'Brand Light (Blue 300)',
    category: 'brand',
    usage: 'Light brand blue - soft accents',
    textSafe: false,
    backgroundSafe: true,
  },
  {
    id: 'brand-400',
    hex: '#6699FF',
    name: 'Brand Medium',
    displayName: 'Brand Medium (Blue 400)',
    category: 'brand',
    usage: 'Medium brand blue - secondary actions',
    textSafe: true,
    backgroundSafe: true,
  },
  {
    id: 'brand-500',
    hex: '#3374FF',
    name: 'Brand Bright',
    displayName: 'Brand Bright (Blue 500)',
    category: 'brand',
    usage: 'Bright brand blue - active states',
    textSafe: true,
    backgroundSafe: true,
  },
  {
    id: 'brand-600',
    hex: '#004EEB',
    name: 'Brand Primary',
    displayName: 'Brand Primary (Blue 600)',
    category: 'brand',
    usage: 'PRIMARY BRAND COLOR - Kore.ai blue, buttons, links',
    textSafe: true,
    backgroundSafe: true,
    aliases: ['brand-primary', 'text-link', 'bg-brand']
  },
  {
    id: 'brand-700',
    hex: '#0042d1',
    name: 'Brand Hover',
    displayName: 'Brand Hover (Blue 700)',
    category: 'brand',
    usage: 'Dark brand blue - hover states, pressed buttons',
    textSafe: true,
    backgroundSafe: true,
    aliases: ['brand-hover', 'text-link-hover']
  },
  {
    id: 'brand-800',
    hex: '#003399',
    name: 'Brand Dark',
    displayName: 'Brand Dark (Blue 800)',
    category: 'brand',
    usage: 'Darker brand blue - strong emphasis',
    textSafe: true,
    backgroundSafe: false,
  },
  {
    id: 'brand-900',
    hex: '#002A80',
    name: 'Brand Darkest',
    displayName: 'Brand Darkest (Blue 900)',
    category: 'brand',
    usage: 'Darkest brand blue - maximum emphasis',
    textSafe: true,
    backgroundSafe: false,
  },
];

// SEMANTIC COLORS - Success, Error, Warning, Info
const SEMANTIC: ColorDefinition[] = [
  // Success (Green)
  {
    id: 'success-600',
    hex: '#059669',
    name: 'Success',
    displayName: 'Success (Green 600)',
    category: 'semantic',
    usage: 'Success states, positive actions, confirmations',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-success']
  },
  {
    id: 'success-500',
    hex: '#10B981',
    name: 'Success Light',
    displayName: 'Success Light (Green 500)',
    category: 'semantic',
    usage: 'Light success color',
    textSafe: true,
    backgroundSafe: true,
  },
  {
    id: 'success-400',
    hex: '#34D399',
    name: 'Success Lighter',
    displayName: 'Success Lighter (Green 400)',
    category: 'semantic',
    usage: 'Lighter success color',
    textSafe: false,
    backgroundSafe: true,
  },
  {
    id: 'success-50',
    hex: '#ECFDF5',
    name: 'Success Subtle',
    displayName: 'Success Subtle (Green 50)',
    category: 'semantic',
    usage: 'Subtle success background',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['bg-success']
  },
  
  // Error (Red)
  {
    id: 'error-600',
    hex: '#DC2626',
    name: 'Error',
    displayName: 'Error (Red 600)',
    category: 'semantic',
    usage: 'Error states, destructive actions, alerts',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-error']
  },
  {
    id: 'error-500',
    hex: '#EF4444',
    name: 'Error Light',
    displayName: 'Error Light (Red 500)',
    category: 'semantic',
    usage: 'Light error color',
    textSafe: true,
    backgroundSafe: true,
  },
  {
    id: 'error-400',
    hex: '#F87171',
    name: 'Error Lighter',
    displayName: 'Error Lighter (Red 400)',
    category: 'semantic',
    usage: 'Lighter error color',
    textSafe: false,
    backgroundSafe: true,
  },
  {
    id: 'error-50',
    hex: '#FEF2F2',
    name: 'Error Subtle',
    displayName: 'Error Subtle (Red 50)',
    category: 'semantic',
    usage: 'Subtle error background',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['bg-error']
  },
  
  // Warning (Orange)
  {
    id: 'warning-600',
    hex: '#D97706',
    name: 'Warning',
    displayName: 'Warning (Orange 600)',
    category: 'semantic',
    usage: 'Warning states, caution, important notices',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-warning']
  },
  {
    id: 'warning-500',
    hex: '#F59E0B',
    name: 'Warning Light',
    displayName: 'Warning Light (Orange 500)',
    category: 'semantic',
    usage: 'Light warning color',
    textSafe: true,
    backgroundSafe: true,
  },
  {
    id: 'warning-400',
    hex: '#FBBF24',
    name: 'Warning Lighter',
    displayName: 'Warning Lighter (Orange 400)',
    category: 'semantic',
    usage: 'Lighter warning color',
    textSafe: false,
    backgroundSafe: true,
  },
  {
    id: 'warning-50',
    hex: '#FFFBEB',
    name: 'Warning Subtle',
    displayName: 'Warning Subtle (Orange 50)',
    category: 'semantic',
    usage: 'Subtle warning background',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['bg-warning']
  },
  
  // Info (Blue - different from brand)
  {
    id: 'info-600',
    hex: '#2563EB',
    name: 'Info',
    displayName: 'Info (Blue 600)',
    category: 'semantic',
    usage: 'Informational states, helpful tips',
    textSafe: true,
    backgroundSafe: false,
    aliases: ['text-info']
  },
  {
    id: 'info-500',
    hex: '#3B82F6',
    name: 'Info Light',
    displayName: 'Info Light (Blue 500)',
    category: 'semantic',
    usage: 'Light info color',
    textSafe: true,
    backgroundSafe: true,
  },
  {
    id: 'info-400',
    hex: '#60A5FA',
    name: 'Info Lighter',
    displayName: 'Info Lighter (Blue 400)',
    category: 'semantic',
    usage: 'Lighter info color',
    textSafe: false,
    backgroundSafe: true,
  },
  {
    id: 'info-50',
    hex: '#EFF6FF',
    name: 'Info Subtle',
    displayName: 'Info Subtle (Blue 50)',
    category: 'semantic',
    usage: 'Subtle info background',
    textSafe: false,
    backgroundSafe: true,
    aliases: ['bg-info']
  },
];

// SPECIAL COLORS
const SPECIAL: ColorDefinition[] = [
  {
    id: 'white',
    hex: '#FFFFFF',
    name: 'White',
    displayName: 'White',
    category: 'special',
    usage: 'Pure white - default backgrounds, text on dark',
    textSafe: true,
    backgroundSafe: true,
    aliases: ['bg-default', 'text-on-brand']
  },
  {
    id: 'black',
    hex: '#000000',
    name: 'Black',
    displayName: 'Black',
    category: 'special',
    usage: 'Pure black - maximum contrast text',
    textSafe: true,
    backgroundSafe: false,
  },
  {
    id: 'transparent',
    hex: 'transparent',
    name: 'Transparent',
    displayName: 'Transparent',
    category: 'special',
    usage: 'Transparent - no background',
    textSafe: false,
    backgroundSafe: true,
  },
];

// ============================================================================
// COMBINED PALETTE - Single Source of Truth
// ============================================================================

export const COLOR_PALETTE_V2: ColorDefinition[] = [
  ...NEUTRALS,
  ...BRAND,
  ...SEMANTIC,
  ...SPECIAL,
];

// ============================================================================
// SEMANTIC ALIASES - References to Base Colors
// ============================================================================

export const SEMANTIC_ALIASES: Record<string, string> = {
  // Text aliases
  'text-primary': 'neutral-900',
  'text-secondary': 'neutral-600',
  'text-tertiary': 'neutral-500',
  'text-heading': 'neutral-700',
  'text-body': 'neutral-500',
  'text-muted': 'neutral-400',
  'text-disabled': 'neutral-400',
  'text-placeholder': 'neutral-400',
  'text-emphasis': 'neutral-800',
  'text-on-brand': 'white',
  'text-link': 'brand-600',
  'text-link-hover': 'brand-700',
  'text-success': 'success-600',
  'text-error': 'error-600',
  'text-warning': 'warning-600',
  'text-info': 'info-600',
  
  // Background aliases
  'bg-default': 'white',
  'bg-subtle': 'neutral-50',
  'bg-surface': 'neutral-100',
  'bg-brand': 'brand-600',
  'bg-brand-subtle': 'brand-50',
  'bg-success': 'success-50',
  'bg-error': 'error-50',
  'bg-warning': 'warning-50',
  'bg-info': 'info-50',
  
  // Border aliases
  'border-default': 'neutral-200',
  'border-strong': 'neutral-300',
  'border-brand': 'brand-200',
  'divider': 'neutral-200',
  
  // Brand aliases
  'brand-primary': 'brand-600',
  'brand-hover': 'brand-700',
} as const;

// ============================================================================
// BACKWARDS COMPATIBILITY - Old IDs to New IDs
// ============================================================================

export const LEGACY_ID_MAP: Record<string, string> = {
  // Old text color IDs → New neutral IDs
  'text-primary-900': 'neutral-900',
  'text-primary-on-brand': 'neutral-800',
  'text-secondary-700': 'neutral-700',
  'text-secondary-700-hover': 'neutral-800',
  'text-secondary-on-brand': 'neutral-600',
  'text-tertiary-600': 'neutral-600',
  'text-tertiary-600-hover': 'neutral-700',
  'text-tertiary-on-brand': 'neutral-500',
  'text-quaternary-500': 'neutral-500',
  'text-quaternary-on-brand': 'neutral-400',
  'text-white': 'white',
  
  // Old utility gray IDs → New neutral IDs
  'utility-gray-50': 'neutral-50',
  'utility-gray-100': 'neutral-100',
  'utility-gray-200': 'neutral-200',
  'utility-gray-300': 'neutral-300',
  'utility-gray-400': 'neutral-400',
  'utility-gray-500': 'neutral-500',
  'utility-gray-600': 'neutral-600',
  'utility-gray-700': 'neutral-700',
  'utility-gray-800': 'neutral-800',
  'utility-gray-900': 'neutral-900',
  
  // Old brand IDs → New brand IDs
  'brand-primary-50': 'brand-50',
  'brand-primary-100': 'brand-100',
  'brand-primary-200': 'brand-200',
  'brand-primary-300': 'brand-300',
  'brand-primary-400': 'brand-400',
  'brand-primary-500': 'brand-500',
  'brand-primary-600': 'brand-600',
  'brand-primary-700': 'brand-700',
  'brand-primary-800': 'brand-800',
  'brand-primary-900': 'brand-900',
  'brand-text-primary': 'brand-600',
  'brand-text-secondary': 'brand-500',
  'brand-text-tertiary': 'brand-400',
} as const;

// ============================================================================
// CATEGORY ORGANIZATION - Purpose-Based Grouping
// ============================================================================

export const COLOR_CATEGORIES_V2 = {
  'text': {
    label: 'Text & Headings',
    description: 'Colors optimized for text readability',
    colors: [
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-900')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-800')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-700')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-600')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-500')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-400')!,
      COLOR_PALETTE_V2.find(c => c.id === 'white')!,
      COLOR_PALETTE_V2.find(c => c.id === 'brand-600')!,
      COLOR_PALETTE_V2.find(c => c.id === 'brand-700')!,
    ].filter(Boolean),
  },
  'brand': {
    label: 'Brand Colors',
    description: 'Kore.ai brand blues',
    colors: BRAND,
  },
  'background': {
    label: 'Backgrounds',
    description: 'Surface and container colors',
    colors: [
      COLOR_PALETTE_V2.find(c => c.id === 'white')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-50')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-100')!,
      COLOR_PALETTE_V2.find(c => c.id === 'neutral-200')!,
      COLOR_PALETTE_V2.find(c => c.id === 'brand-50')!,
      COLOR_PALETTE_V2.find(c => c.id === 'brand-100')!,
      COLOR_PALETTE_V2.find(c => c.id === 'brand-200')!,
      COLOR_PALETTE_V2.find(c => c.id === 'brand-600')!,
      ...SEMANTIC.filter(c => c.id.includes('-50')),
    ].filter(Boolean),
  },
  'semantic': {
    label: 'Semantic',
    description: 'Status and feedback colors',
    colors: SEMANTIC,
  },
  'neutral': {
    label: 'Neutral Grays',
    description: 'Full neutral palette',
    colors: NEUTRALS,
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Resolve color ID - handles aliases and legacy IDs
 */
export function resolveColorId(id: string): string {
  // Check legacy map first
  if (LEGACY_ID_MAP[id]) {
    console.warn(`⚠️  Color ID "${id}" is deprecated. Use "${LEGACY_ID_MAP[id]}" instead.`);
    return LEGACY_ID_MAP[id];
  }
  
  // Check semantic aliases
  if (SEMANTIC_ALIASES[id]) {
    return SEMANTIC_ALIASES[id];
  }
  
  // Return as-is (should be a direct ID)
  return id;
}

/**
 * Get color definition by ID (supports aliases and legacy IDs)
 */
export function getColorByIdV2(id: string): ColorDefinition | undefined {
  // 'custom' is not in palette
  if (id === 'custom') return undefined;
  
  const resolvedId = resolveColorId(id);
  return COLOR_PALETTE_V2.find(color => color.id === resolvedId);
}

/**
 * Get color hex value by ID (supports aliases and legacy IDs).
 * Returns a neutral gray for unknown/custom IDs so we never accidentally render black.
 */
export function getColorHexV2(id: string): string {
  // 'custom' colors don't have a hex - caller should use colorValue.hex; avoid black fallback
  if (id === 'custom') return '#64748B';
  
  const color = getColorByIdV2(id);
  return color?.hex ?? '#64748B';
}

/**
 * Convert rgba/rgb color to hex format
 */
function rgbaToHex(rgba: string): string {
  // Parse rgba(r, g, b, a) or rgb(r, g, b) format
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return rgba;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  // Note: Ignoring alpha channel - we map to solid colors in palette
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert any color to RGB object
 */
function colorToRgb(color: string): { r: number; g: number; b: number } {
  // Handle transparent
  if (color === 'transparent') return { r: 255, g: 255, b: 255 };
  
  // Handle rgba/rgb
  if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
  }
  
  // Handle hex (with or without #, with or without alpha)
  const cleanHex = color.replace('#', '');
  // Take only first 6 characters (ignore alpha if present)
  const hex = cleanHex.substring(0, 6);
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Check if a color is valid in the palette
 */
export function isValidColorV2(hex: string): boolean {
  // No special cases - only palette colors are valid
  const normalizedHex = hex.toUpperCase();
  return COLOR_PALETTE_V2.some(color => color.hex.toUpperCase() === normalizedHex);
}

/**
 * Find the closest color in the palette (for migration)
 */
export function findClosestColorV2(hex: string): ColorDefinition {
  // Same implementation as V1
  const hexToRgb = (h: string) => {
    if (h === 'transparent') return { r: 255, g: 255, b: 255 };
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const targetRgb = colorToRgb(hex);
  let closestColor = COLOR_PALETTE_V2[0];
  let minDistance = Infinity;

  for (const paletteColor of COLOR_PALETTE_V2) {
    if (paletteColor.hex === 'transparent') continue;
    
    const colorRgb = colorToRgb(paletteColor.hex);
    const distance = Math.sqrt(
      Math.pow(colorRgb.r - targetRgb.r, 2) +
      Math.pow(colorRgb.g - targetRgb.g, 2) +
      Math.pow(colorRgb.b - targetRgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

/**
 * Migrate color to V2 system
 */
export function migrateColorV2(color: string): string {
  // Convert rgba/rgb to hex first
  let hex = color;
  if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
    hex = rgbaToHex(color);
  }
  
  // Check if already valid
  if (isValidColorV2(hex)) {
    return hex;
  }
  
  // Find closest color in palette
  const closestColor = findClosestColorV2(hex);
  // Silently migrate to closest valid color
  return closestColor.hex;
}

/**
 * Get colors suitable for text
 */
export function getTextColorsV2(): ColorDefinition[] {
  return COLOR_PALETTE_V2.filter(color => color.textSafe);
}

/**
 * Get colors suitable for backgrounds
 */
export function getBackgroundColorsV2(): ColorDefinition[] {
  return COLOR_PALETTE_V2.filter(color => color.backgroundSafe);
}

// ============================================================================
// PRESET GROUPS - Common Color Selections
// ============================================================================

export const PRESET_GROUPS_V2 = {
  common: {
    label: 'Most Used',
    colors: [
      'brand-600',      // Brand Primary
      'neutral-900',    // Primary Text
      'neutral-600',    // Secondary Text
      'neutral-400',    // Muted Text
      'neutral-100',    // Surface
      'white',          // White
      'success-600',    // Success
      'error-600',      // Error
    ]
  },
} as const;

// ============================================================================
// STATISTICS
// ============================================================================

export const COLOR_STATS_V2 = {
  totalColors: COLOR_PALETTE_V2.length,
  byCategory: {
    neutral: NEUTRALS.length,
    brand: BRAND.length,
    semantic: SEMANTIC.length,
    special: SPECIAL.length,
  },
  textSafe: COLOR_PALETTE_V2.filter(c => c.textSafe).length,
  backgroundSafe: COLOR_PALETTE_V2.filter(c => c.backgroundSafe).length,
  aliases: Object.keys(SEMANTIC_ALIASES).length,
  legacyIds: Object.keys(LEGACY_ID_MAP).length,
};

// ============================================================================
// THEME TOKEN PALETTE - Dynamic Theme Colors
// ============================================================================

/**
 * Generate a dynamic theme token palette for a specific theme and zone
 * This creates ColorDefinitions for the 6 new theme tokens
 * 
 * @param themeId - Theme ID (e.g., 'kore-default')
 * @param zone - Zone name ('header', 'body', or 'footer')
 * @returns Array of ColorDefinitions for theme tokens
 */
export function getThemeTokenPalette(
  themeId: string,
  zone: 'header' | 'body' | 'footer' = 'header'
): ColorDefinition[] {
  const theme = getThemeById(themeId);
  
  if (!theme || !theme[zone]) {
    return [];
  }
  
  const zoneData = theme[zone];
  const zoneName = zone.charAt(0).toUpperCase() + zone.slice(1);
  
  const tokens: ColorDefinition[] = [];
  
  // Background (main color)
  if (zoneData.bg) {
    tokens.push({
      id: `theme-${zone}-bg`,
      hex: zoneData.bg,
      name: `${zoneName} Background`,
      displayName: `${zoneName} Background`,
      category: 'theme-tokens',
      usage: `Background color for ${zone} zone`,
      textSafe: false,
      backgroundSafe: true,
    });
  }
  
  // Foreground/Text (main color)
  if (zoneData.fg) {
    tokens.push({
      id: `theme-${zone}-fg`,
      hex: zoneData.fg,
      name: `${zoneName} Text`,
      displayName: `${zoneName} Text`,
      category: 'theme-tokens',
      usage: `Text color for ${zone} zone`,
      textSafe: true,
      backgroundSafe: false,
    });
  }
  
  // Primary 500 (lighter primary)
  if (zoneData.primary500) {
    tokens.push({
      id: `theme-${zone}-primary-500`,
      hex: zoneData.primary500,
      name: `${zoneName} Primary (Light)`,
      displayName: `${zoneName} Accent Light`,
      category: 'theme-tokens',
      usage: `Lighter primary color for ${zone} zone`,
      textSafe: false,
      backgroundSafe: true,
    });
  }
  
  // Primary 600 (darker primary)
  if (zoneData.primary600) {
    tokens.push({
      id: `theme-${zone}-primary-600`,
      hex: zoneData.primary600,
      name: `${zoneName} Primary (Dark)`,
      displayName: `${zoneName} Accent Dark`,
      category: 'theme-tokens',
      usage: `Darker primary color for ${zone} zone`,
      textSafe: true,
      backgroundSafe: true,
    });
  }
  
  // Text Dark
  if (zoneData.textDark) {
    tokens.push({
      id: `theme-${zone}-text-dark`,
      hex: zoneData.textDark,
      name: `${zoneName} Text (Dark)`,
      displayName: `${zoneName} Dark Text`,
      category: 'theme-tokens',
      usage: `Dark text for light backgrounds in ${zone} zone`,
      textSafe: true,
      backgroundSafe: false,
    });
  }
  
  // Text Light
  if (zoneData.textLight) {
    tokens.push({
      id: `theme-${zone}-text-light`,
      hex: zoneData.textLight,
      name: `${zoneName} Text (Light)`,
      displayName: `${zoneName} Light Text`,
      category: 'theme-tokens',
      usage: `Light text for dark backgrounds in ${zone} zone`,
      textSafe: true,
      backgroundSafe: false,
    });
  }
  
  // BG 50 (lightest tint)
  if (zoneData.bg50) {
    tokens.push({
      id: `theme-${zone}-bg-50`,
      hex: zoneData.bg50,
      name: `${zoneName} BG (Subtle)`,
      displayName: `${zoneName} Surface Subtle`,
      category: 'theme-tokens',
      usage: `Lightest background tint for ${zone} zone`,
      textSafe: false,
      backgroundSafe: true,
    });
  }
  
  // BG 100 (light tint)
  if (zoneData.bg100) {
    tokens.push({
      id: `theme-${zone}-bg-100`,
      hex: zoneData.bg100,
      name: `${zoneName} BG (Light)`,
      displayName: `${zoneName} Surface Light`,
      category: 'theme-tokens',
      usage: `Light background tint for ${zone} zone`,
      textSafe: false,
      backgroundSafe: true,
    });
  }

  // Deduplicate by hex so the same color doesn't appear twice (e.g. fg and textLight both white).
  // First occurrence wins; keeps display order (see THEME_AND_COLOR_AUDIT.md #2).
  const seenHex = new Set<string>();
  return tokens.filter((t) => {
    const key = t.hex.toUpperCase();
    if (seenHex.has(key)) return false;
    seenHex.add(key);
    return true;
  });
}

/**
 * Get all theme tokens for a specific theme (all zones)
 * 
 * @param themeId - Theme ID (e.g., 'kore-default')
 * @returns Array of ColorDefinitions for all theme tokens across all zones
 */
export function getAllThemeTokens(themeId: string): ColorDefinition[] {
  return [
    ...getThemeTokenPalette(themeId, 'header'),
    ...getThemeTokenPalette(themeId, 'body'),
    ...getThemeTokenPalette(themeId, 'footer'),
  ];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default COLOR_PALETTE_V2;

// Re-export with V2 suffix to avoid conflicts during migration
export {
  COLOR_PALETTE_V2 as COLOR_PALETTE,
  getColorByIdV2 as getColorById,
  getColorHexV2 as getColorHex,
  isValidColorV2 as isValidColor,
  findClosestColorV2 as findClosestColor,
  migrateColorV2 as migrateColor,
  getTextColorsV2 as getTextColors,
  getBackgroundColorsV2 as getBackgroundColors,
};