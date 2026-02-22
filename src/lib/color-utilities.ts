/**
 * Color Utilities
 * 
 * Provides color manipulation and contrast calculation functions
 * for the theme system to ensure accessible color combinations.
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB object
 */
export function hexToRgb(hex: string): RGBColor {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Calculate relative luminance of a color (0-1)
 * Based on WCAG 2.0 specification
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function calculateLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  
  // Convert RGB to sRGB
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  // Apply gamma correction
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors (1-21)
 * Based on WCAG 2.0 specification
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function calculateContrastRatio(foreground: string, background: string): number {
  const lum1 = calculateLuminance(foreground);
  const lum2 = calculateLuminance(background);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if text color should be white or black based on background
 * Returns the color with better contrast
 */
export function getContrastTextColor(backgroundColor: string): string {
  const luminance = calculateLuminance(backgroundColor);
  
  // If background is dark (luminance < 0.5), use white text
  // If background is light (luminance >= 0.5), use black text
  return luminance < 0.5 ? '#FFFFFF' : '#000000';
}

/**
 * Check if color combination meets WCAG contrast requirements
 * AA: 4.5:1 for normal text, 3:1 for large text
 * AAA: 7:1 for normal text, 4.5:1 for large text
 */
export function meetsWCAGContrast(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  } else {
    return largeText ? ratio >= 3 : ratio >= 4.5;
  }
}

/**
 * Lighten a color by a percentage (0-1)
 */
export function lightenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  
  const lighten = (value: number) => {
    return Math.min(255, value + (255 - value) * amount);
  };
  
  return rgbToHex({
    r: lighten(rgb.r),
    g: lighten(rgb.g),
    b: lighten(rgb.b),
  });
}

/**
 * Darken a color by a percentage (0-1)
 */
export function darkenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  
  const darken = (value: number) => {
    return Math.max(0, value - value * amount);
  };
  
  return rgbToHex({
    r: darken(rgb.r),
    g: darken(rgb.g),
    b: darken(rgb.b),
  });
}

/**
 * Adjust color opacity (returns rgba string)
 */
export function adjustOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Convert hex to rgba string
 */
export function hexToRgba(hex: string, alpha: number): string {
  return adjustOpacity(hex, alpha);
}

/**
 * Check if a color is light or dark
 */
export function isLightColor(hex: string): boolean {
  const luminance = calculateLuminance(hex);
  return luminance >= 0.5;
}

/**
 * Get theme color variants for nested elements
 * Returns lighter/darker variants based on the base color
 */
export function getThemeVariants(bg: string, fg: string) {
  return {
    bg: bg,
    bgLight: lightenColor(bg, 0.15),      // 15% lighter
    bgLighter: lightenColor(bg, 0.30),    // 30% lighter
    bgDark: darkenColor(bg, 0.15),        // 15% darker
    fg: fg,
    fgDim: adjustOpacity(fg, 0.7),        // 70% opacity
    fgVeryDim: adjustOpacity(fg, 0.5),    // 50% opacity
    // For borders and subtle elements
    border: adjustOpacity(fg, 0.1),       // 10% opacity for borders
  };
}

/**
 * Get a slightly lighter/darker variant of a color for hover states
 */
export function getHoverColor(hex: string, mode: 'light' | 'dark' = 'light'): string {
  return mode === 'light' ? darkenColor(hex, 0.1) : lightenColor(hex, 0.1);
}

/**
 * Validate hex color format
 */
export function isValidHexColor(hex: string): boolean {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Ensure hex color has # prefix
 */
export function normalizeHexColor(hex: string): string {
  return hex.startsWith('#') ? hex : `#${hex}`;
}

/**
 * Convert RGB to HSL
 * Returns { h: 0-360, s: 0-100, l: 0-100 }
 */
export function rgbToHsl(rgb: RGBColor): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert hex to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb);
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGBColor {
  // Normalize inputs
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert HSL to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb);
}

/**
 * Set a color to a specific lightness level while preserving hue and saturation
 * @param hex - Base color
 * @param targetLightness - Target lightness (0-100)
 * @returns New color with target lightness
 */
export function setLightness(hex: string, targetLightness: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex(hsl.h, hsl.s, targetLightness);
}