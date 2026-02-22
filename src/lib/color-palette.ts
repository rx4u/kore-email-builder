// Kore.ai Design System Color Palette
// Centralized color definitions - NO custom colors allowed outside this palette

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

export interface ColorDefinition {
  id: string;
  hex: string;
  name: string;
  category: ColorCategory;
  usage?: string;
}

export type ColorCategory = 
  | 'text'
  | 'brand'
  | 'utility-gray'
  | 'semantic'
  | 'special';

// ============================================================================
// TEXT COLORS
// ============================================================================

const TEXT_COLORS: ColorDefinition[] = [
  // Primary Text
  { id: 'text-primary-900', hex: '#0F172A', name: 'Primary Text', category: 'text', usage: 'Main headings and important text' },
  { id: 'text-primary-on-brand', hex: '#1E293B', name: 'Primary Text (On Brand)', category: 'text', usage: 'Text on brand backgrounds' },
  
  // Secondary Text
  { id: 'text-secondary-700', hex: '#334155', name: 'Secondary Text', category: 'text', usage: 'Subheadings and secondary content' },
  { id: 'text-secondary-700-hover', hex: '#1E293B', name: 'Secondary Text (Hover)', category: 'text', usage: 'Hover state for secondary text' },
  { id: 'text-secondary-on-brand', hex: '#475569', name: 'Secondary Text (On Brand)', category: 'text', usage: 'Secondary text on brand backgrounds' },
  
  // Tertiary Text
  { id: 'text-tertiary-600', hex: '#475569', name: 'Tertiary Text', category: 'text', usage: 'Body text and descriptions' },
  { id: 'text-tertiary-600-hover', hex: '#334155', name: 'Tertiary Text (Hover)', category: 'text', usage: 'Hover state for tertiary text' },
  { id: 'text-tertiary-on-brand', hex: '#64748B', name: 'Tertiary Text (On Brand)', category: 'text', usage: 'Tertiary text on brand backgrounds' },
  
  // Quaternary Text
  { id: 'text-quaternary-500', hex: '#64748B', name: 'Quaternary Text', category: 'text', usage: 'Supporting text and captions' },
  { id: 'text-quaternary-on-brand', hex: '#94A3B8', name: 'Quaternary Text (On Brand)', category: 'text', usage: 'Quaternary text on brand backgrounds' },
  
  // Special Text States
  { id: 'text-white', hex: '#FFFFFF', name: 'White Text', category: 'text', usage: 'Text on dark backgrounds' },
  { id: 'text-disabled', hex: '#94A3B8', name: 'Disabled Text', category: 'text', usage: 'Disabled state text' },
  { id: 'text-placeholder', hex: '#94A3B8', name: 'Placeholder Text', category: 'text', usage: 'Input placeholder text' },
];

// ============================================================================
// BRAND COLORS
// ============================================================================

const BRAND_COLORS: ColorDefinition[] = [
  // Primary Brand Blue
  { id: 'brand-primary-900', hex: '#002A80', name: 'Brand Primary (900)', category: 'brand', usage: 'Darkest brand blue' },
  { id: 'brand-primary-800', hex: '#003399', name: 'Brand Primary (800)', category: 'brand', usage: 'Dark brand blue' },
  { id: 'brand-primary-700', hex: '#0042d1', name: 'Brand Primary (700)', category: 'brand', usage: 'Brand blue hover state' },
  { id: 'brand-primary-600', hex: '#004EEB', name: 'Brand Primary', category: 'brand', usage: 'Primary brand color - Kore.ai blue' },
  { id: 'brand-primary-500', hex: '#3374FF', name: 'Brand Primary (500)', category: 'brand', usage: 'Light brand blue' },
  { id: 'brand-primary-400', hex: '#6699FF', name: 'Brand Primary (400)', category: 'brand', usage: 'Lighter brand blue' },
  { id: 'brand-primary-300', hex: '#99BBFF', name: 'Brand Primary (300)', category: 'brand', usage: 'Very light brand blue' },
  { id: 'brand-primary-200', hex: '#CCE0FF', name: 'Brand Primary (200)', category: 'brand', usage: 'Subtle brand blue' },
  { id: 'brand-primary-100', hex: '#E5F0FF', name: 'Brand Primary (100)', category: 'brand', usage: 'Pale brand blue' },
  { id: 'brand-primary-50', hex: '#F0F5FF', name: 'Brand Primary (50)', category: 'brand', usage: 'Lightest brand blue - backgrounds' },
  
  // Brand Text Colors
  { id: 'brand-text-primary', hex: '#004EEB', name: 'Brand Text Primary', category: 'brand', usage: 'Primary brand text color' },
  { id: 'brand-text-secondary', hex: '#3374FF', name: 'Brand Text Secondary', category: 'brand', usage: 'Secondary brand text color' },
  { id: 'brand-text-tertiary', hex: '#6699FF', name: 'Brand Text Tertiary', category: 'brand', usage: 'Tertiary brand text color' },
];

// ============================================================================
// UTILITY GRAYS
// ============================================================================

const UTILITY_GRAYS: ColorDefinition[] = [
  { id: 'utility-gray-50', hex: '#F8FAFC', name: 'Gray 50', category: 'utility-gray', usage: 'Lightest gray - subtle backgrounds' },
  { id: 'utility-gray-100', hex: '#F1F5F9', name: 'Gray 100', category: 'utility-gray', usage: 'Very light gray - backgrounds' },
  { id: 'utility-gray-200', hex: '#E2E8F0', name: 'Gray 200', category: 'utility-gray', usage: 'Light gray - borders and dividers' },
  { id: 'utility-gray-300', hex: '#CBD5E1', name: 'Gray 300', category: 'utility-gray', usage: 'Medium-light gray - borders' },
  { id: 'utility-gray-400', hex: '#94A3B8', name: 'Gray 400', category: 'utility-gray', usage: 'Medium gray - disabled states' },
  { id: 'utility-gray-500', hex: '#64748B', name: 'Gray 500', category: 'utility-gray', usage: 'Medium-dark gray - secondary text' },
  { id: 'utility-gray-600', hex: '#475569', name: 'Gray 600', category: 'utility-gray', usage: 'Dark gray - body text' },
  { id: 'utility-gray-700', hex: '#334155', name: 'Gray 700', category: 'utility-gray', usage: 'Darker gray - headings' },
  { id: 'utility-gray-800', hex: '#1E293B', name: 'Gray 800', category: 'utility-gray', usage: 'Very dark gray - primary text' },
  { id: 'utility-gray-900', hex: '#0F172A', name: 'Gray 900', category: 'utility-gray', usage: 'Darkest gray - emphasis text' },
];

// ============================================================================
// SEMANTIC COLORS
// ============================================================================

const SEMANTIC_COLORS: ColorDefinition[] = [
  // Success (Green)
  { id: 'success-600', hex: '#059669', name: 'Success', category: 'semantic', usage: 'Success states and positive actions' },
  { id: 'success-500', hex: '#10B981', name: 'Success (Light)', category: 'semantic', usage: 'Light success color' },
  { id: 'success-400', hex: '#34D399', name: 'Success (Lighter)', category: 'semantic', usage: 'Lighter success color' },
  { id: 'success-50', hex: '#ECFDF5', name: 'Success (Subtle)', category: 'semantic', usage: 'Subtle success background' },
  
  // Error (Red)
  { id: 'error-600', hex: '#DC2626', name: 'Error', category: 'semantic', usage: 'Error states and destructive actions' },
  { id: 'error-500', hex: '#EF4444', name: 'Error (Light)', category: 'semantic', usage: 'Light error color' },
  { id: 'error-400', hex: '#F87171', name: 'Error (Lighter)', category: 'semantic', usage: 'Lighter error color' },
  { id: 'error-50', hex: '#FEF2F2', name: 'Error (Subtle)', category: 'semantic', usage: 'Subtle error background' },
  
  // Warning (Orange/Amber)
  { id: 'warning-600', hex: '#D97706', name: 'Warning', category: 'semantic', usage: 'Warning states and caution' },
  { id: 'warning-500', hex: '#F59E0B', name: 'Warning (Light)', category: 'semantic', usage: 'Light warning color' },
  { id: 'warning-400', hex: '#FBBF24', name: 'Warning (Lighter)', category: 'semantic', usage: 'Lighter warning color' },
  { id: 'warning-50', hex: '#FFFBEB', name: 'Warning (Subtle)', category: 'semantic', usage: 'Subtle warning background' },
  
  // Info (Blue)
  { id: 'info-600', hex: '#2563EB', name: 'Info', category: 'semantic', usage: 'Informational states' },
  { id: 'info-500', hex: '#3B82F6', name: 'Info (Light)', category: 'semantic', usage: 'Light info color' },
  { id: 'info-400', hex: '#60A5FA', name: 'Info (Lighter)', category: 'semantic', usage: 'Lighter info color' },
  { id: 'info-50', hex: '#EFF6FF', name: 'Info (Subtle)', category: 'semantic', usage: 'Subtle info background' },
];

// ============================================================================
// SPECIAL COLORS
// ============================================================================

const SPECIAL_COLORS: ColorDefinition[] = [
  { id: 'white', hex: '#FFFFFF', name: 'White', category: 'special', usage: 'Pure white - cards and backgrounds' },
  { id: 'black', hex: '#000000', name: 'Black', category: 'special', usage: 'Pure black - high contrast text' },
  { id: 'transparent', hex: 'transparent', name: 'Transparent', category: 'special', usage: 'Transparent backgrounds' },
];

// ============================================================================
// COMBINED PALETTE
// ============================================================================

export const COLOR_PALETTE: ColorDefinition[] = [
  ...TEXT_COLORS,
  ...BRAND_COLORS,
  ...UTILITY_GRAYS,
  ...SEMANTIC_COLORS,
  ...SPECIAL_COLORS,
];

// ============================================================================
// COLOR CATEGORIES FOR ORGANIZATION
// ============================================================================

export const COLOR_CATEGORIES = {
  text: { label: 'Text Colors', colors: TEXT_COLORS },
  brand: { label: 'Brand Colors', colors: BRAND_COLORS },
  'utility-gray': { label: 'Utility Grays', colors: UTILITY_GRAYS },
  semantic: { label: 'Semantic Colors', colors: SEMANTIC_COLORS },
  special: { label: 'Special', colors: SPECIAL_COLORS },
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Valid color IDs as a union type for type safety
export type ColorId = typeof COLOR_PALETTE[number]['id'];

// Valid hex values
export type ColorHex = typeof COLOR_PALETTE[number]['hex'];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a color definition by ID
 */
export function getColorById(id: string): ColorDefinition | undefined {
  return COLOR_PALETTE.find(color => color.id === id);
}

/**
 * Get a color hex value by ID
 */
export function getColorHex(id: string): string {
  const color = getColorById(id);
  return color?.hex || '#000000';
}

/**
 * Check if a color is in the palette
 */
export function isValidColor(hex: string): boolean {
  const normalizedHex = hex.toUpperCase();
  return COLOR_PALETTE.some(color => color.hex.toUpperCase() === normalizedHex);
}

/**
 * Find the closest color in the palette to a given hex value
 * Uses simple Euclidean distance in RGB space
 */
export function findClosestColor(hex: string): ColorDefinition {
  // Parse hex to RGB
  const hexToRgb = (h: string) => {
    if (h === 'transparent') return { r: 255, g: 255, b: 255 };
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const targetRgb = hexToRgb(hex);
  
  // Find closest color by Euclidean distance
  let closestColor = COLOR_PALETTE[0];
  let minDistance = Infinity;

  for (const color of COLOR_PALETTE) {
    if (color.hex === 'transparent') continue;
    
    const colorRgb = hexToRgb(color.hex);
    const distance = Math.sqrt(
      Math.pow(colorRgb.r - targetRgb.r, 2) +
      Math.pow(colorRgb.g - targetRgb.g, 2) +
      Math.pow(colorRgb.b - targetRgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }

  return closestColor;
}

/**
 * Migrate a hex value to the closest palette color
 * Returns the original hex if it's already in the palette
 */
export function migrateColor(hex: string): string {
  if (isValidColor(hex)) {
    return hex;
  }
  
  const closestColor = findClosestColor(hex);
  console.log(`🎨 Migrating color ${hex} → ${closestColor.hex} (${closestColor.name})`);
  return closestColor.hex;
}

/**
 * Get colors filtered by category
 */
export function getColorsByCategory(category: ColorCategory): ColorDefinition[] {
  return COLOR_PALETTE.filter(color => color.category === category);
}

/**
 * Get colors suitable for text (excludes very light colors)
 */
export function getTextColors(): ColorDefinition[] {
  return COLOR_PALETTE.filter(color => {
    // Exclude very light colors that don't work for text
    const excludeIds = [
      'brand-primary-50',
      'brand-primary-100',
      'brand-primary-200',
      'utility-gray-50',
      'utility-gray-100',
      'utility-gray-200',
      'success-50',
      'error-50',
      'warning-50',
      'info-50',
      'white',
      'transparent'
    ];
    return !excludeIds.includes(color.id);
  });
}

/**
 * Get colors suitable for backgrounds
 */
export function getBackgroundColors(): ColorDefinition[] {
  return COLOR_PALETTE.filter(color => {
    // Prioritize utility grays, light brand colors, and special colors
    return color.category === 'utility-gray' ||
           color.category === 'special' ||
           (color.category === 'brand' && (
             color.id.includes('-50') ||
             color.id.includes('-100') ||
             color.id.includes('-200') ||
             color.id.includes('-300')
           )) ||
           (color.category === 'semantic' && color.id.includes('-50'));
  });
}

/**
 * Get colors suitable for borders
 */
export function getBorderColors(): ColorDefinition[] {
  return COLOR_PALETTE.filter(color => {
    return color.category === 'utility-gray' ||
           color.id === 'brand-primary-200' ||
           color.id === 'brand-primary-300' ||
           color.id === 'transparent';
  });
}

// ============================================================================
// PRESET COLOR GROUPS (for quick selection)
// ============================================================================

export const PRESET_GROUPS = {
  common: {
    label: 'Common Colors',
    colors: [
      'brand-primary-600',
      'utility-gray-900',
      'utility-gray-600',
      'utility-gray-400',
      'utility-gray-100',
      'white',
      'success-600',
      'error-600',
      'warning-600',
    ]
  },
  text: {
    label: 'Text Colors',
    colors: [
      'text-primary-900',
      'text-secondary-700',
      'text-tertiary-600',
      'text-quaternary-500',
      'text-white',
      'brand-text-primary',
    ]
  },
  backgrounds: {
    label: 'Background Colors',
    colors: [
      'white',
      'utility-gray-50',
      'utility-gray-100',
      'brand-primary-50',
      'brand-primary-100',
      'success-50',
      'error-50',
      'warning-50',
    ]
  }
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export default COLOR_PALETTE;
