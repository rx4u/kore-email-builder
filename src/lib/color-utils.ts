/**
 * Color Utilities for HSL-based color manipulation
 * Used for generating theme tokens with mathematically consistent lightness scaling
 */

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/**
 * Convert hex color to HSL
 * @param hex - Color in hex format (e.g., "#d4f476" or "d4f476")
 * @returns HSL object with h (0-360), s (0-100), l (0-100)
 */
export function hexToHSL(hex: string): HSL {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      case b:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to hex color
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string (e.g., "#d4f476")
 */
export function hslToHex(h: number, s: number, l: number): string {
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
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Lighten a color using HSL lightness formula
 * Formula: L_new = L + (100 - L) * factor
 * 
 * @param hex - Original color in hex format
 * @param factor - Lightening factor (0-1). E.g., 0.5 = 50% lighter, 0.75 = 75% lighter
 * @returns Lightened color in hex format
 * 
 * @example
 * lightenColor('#d4f476', 0.5)  // 50% lighter
 * lightenColor('#004EEB', 0.75) // 75% lighter
 */
export function lightenColor(hex: string, factor: number): string {
  const hsl = hexToHSL(hex);
  
  // Apply HSL lightness formula
  const newLightness = hsl.l + (100 - hsl.l) * factor;
  
  // Clamp to 0-100
  const clampedLightness = Math.min(100, Math.max(0, newLightness));
  
  return hslToHex(hsl.h, hsl.s, clampedLightness);
}

/**
 * Darken a color using HSL lightness formula
 * Formula: L_new = L * (1 - factor)
 * 
 * @param hex - Original color in hex format
 * @param factor - Darkening factor (0-1). E.g., 0.5 = 50% darker, 0.75 = 75% darker
 * @returns Darkened color in hex format
 * 
 * @example
 * darkenColor('#FFFFFF', 0.5)  // 50% darker
 * darkenColor('#FFFFFF', 0.75) // 75% darker
 */
export function darkenColor(hex: string, factor: number): string {
  const hsl = hexToHSL(hex);
  
  // Apply darkening formula
  const newLightness = hsl.l * (1 - factor);
  
  // Clamp to 0-100
  const clampedLightness = Math.min(100, Math.max(0, newLightness));
  
  return hslToHex(hsl.h, hsl.s, clampedLightness);
}

/**
 * Special handling for dark backgrounds
 * For very dark colors (L < 30), we need light buttons for contrast
 * 
 * @param hex - Original color in hex format
 * @param isDarkTheme - Whether this is a dark theme zone
 * @returns Object with bg200 and bg300 tokens
 */
export function generateButtonTokens(hex: string, isDarkTheme: boolean = false): {
  bg200: string;
  bg300: string;
} {
  const hsl = hexToHSL(hex);
  
  // Dark background detection
  const isDarkBackground = hsl.l < 30;
  
  if (isDarkBackground || isDarkTheme) {
    // For dark backgrounds, create light buttons with proper contrast
    // Keep the hue and saturation, but use high lightness
    return {
      bg200: hslToHex(hsl.h, Math.min(hsl.s, 40), 90), // 90% lightness, reduced saturation
      bg300: hslToHex(hsl.h, Math.min(hsl.s, 30), 95), // 95% lightness, more reduced saturation
    };
  }
  
  // Standard lightening for light/medium backgrounds
  return {
    bg200: lightenColor(hex, 0.5),  // 50% lighter
    bg300: lightenColor(hex, 0.75), // 75% lighter
  };
}

/**
 * Generate foreground color tokens (for color swapping)
 * Light foregrounds (L > 50) get darkened
 * Dark foregrounds (L < 50) get lightened
 * 
 * @param hex - Original foreground color
 * @returns Object with fg200 and fg300 tokens
 */
export function generateForegroundTokens(hex: string): {
  fg200: string;
  fg300: string;
} {
  const hsl = hexToHSL(hex);
  
  // Determine if foreground is light or dark
  const isLight = hsl.l > 50;
  
  if (isLight) {
    // Light foreground (like white) - darken it
    return {
      fg200: darkenColor(hex, 0.5),  // 50% darker
      fg300: darkenColor(hex, 0.75), // 75% darker
    };
  } else {
    // Dark foreground (like dark slate) - lighten it
    return {
      fg200: lightenColor(hex, 0.5),  // 50% lighter
      fg300: lightenColor(hex, 0.75), // 75% lighter
    };
  }
}

/**
 * Test function to validate conversions
 */
export function testColorConversions() {
  const testCases = [
    { hex: '#d4f476', name: 'Lime Grid' },
    { hex: '#004EEB', name: 'Kore Blue' },
    { hex: '#FFFFFF', name: 'White' },
    { hex: '#000000', name: 'Black' },
    { hex: '#181d58', name: 'Midnight Penn' },
    { hex: '#3b5c49', name: 'Deep Olive' },
  ];

  console.log('=== Color Conversion Tests ===\n');
  
  testCases.forEach(({ hex, name }) => {
    const hsl = hexToHSL(hex);
    const backToHex = hslToHex(hsl.h, hsl.s, hsl.l);
    const tokens = generateButtonTokens(hex);
    
    console.log(`${name}:`);
    console.log(`  Original: ${hex}`);
    console.log(`  HSL: h=${hsl.h}° s=${hsl.s}% l=${hsl.l}%`);
    console.log(`  Back to hex: ${backToHex}`);
    console.log(`  bg200 (50%): ${tokens.bg200}`);
    console.log(`  bg300 (75%): ${tokens.bg300}`);
    console.log('');
  });
}