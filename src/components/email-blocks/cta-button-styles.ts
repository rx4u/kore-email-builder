// CTA Button Styles - V2 with Colorful Mode Support
// Extracted to separate file to force cache invalidation

import { getColorHex } from '../../lib/color-palette';
import { lightenColor } from '../../lib/color-utilities';
import type { ThemeZone } from '../../lib/theme-catalog';

// Color constants
const COLORS = {
  primary: getColorHex('brand-primary-600'),
  white: getColorHex('white'),
} as const;

export type CTAButtonStyle = 'primary' | 'secondary' | 'outline' | 'link';

/**
 * Get CTA button styles with colorful mode support
 * 
 * @param style - Button style variant
 * @param isEmailMode - Whether rendering for email
 * @param borderRadius - Button border radius
 * @param primaryColor - Primary color for default mode
 * @param colorfulMode - Whether in colorful mode (on colored backgrounds)
 * @param themeZone - Theme zone with extended tokens (bg200, bg300, textDark, textLight)
 */
export function getCTAButtonStyleV2(
  style: CTAButtonStyle = 'primary', 
  isEmailMode: boolean = false, 
  borderRadius: string = '8px',
  primaryColor: string = '#004EEB',
  colorfulMode: boolean = false,
  themeZone?: ThemeZone | null
) {
  console.log('✅ getCTAButtonStyleV2 EXECUTING (NEW FILE)');
  
  // DEBUG: Log all parameters
  if (colorfulMode) {
    console.log('🟣 getCTAButtonStyleV2 - Input Parameters:', {
      style,
      isEmailMode,
      borderRadius,
      primaryColor,
      colorfulMode,
      themeZone: themeZone ? {
        bg: themeZone.bg,
        fg: themeZone.fg,
        bg50: themeZone.bg50,
        bg100: themeZone.bg100,
        bg200: themeZone.bg200,
        bg300: themeZone.bg300,
        textDark: themeZone.textDark,
        textLight: themeZone.textLight,
      } : 'NULL/UNDEFINED'
    });
  }

  const baseStyle = {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: '6px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: borderRadius,
    transition: isEmailMode ? undefined : 'all 0.2s',
    border: 'none'
  };

  // When in colorful mode (on colored backgrounds), use lighter colors for contrast
  if (colorfulMode) {
    console.log('🔍 Checking colorful mode condition:', { 
      colorfulMode, 
      themeZone: !!themeZone, 
      willEnterBranch: colorfulMode && themeZone 
    });
  }
  
  if (colorfulMode && themeZone) {
    // PHASE B & D: Enhanced token usage with bg200/bg300
    // Priority: bg200 (very light) > bg100 (light) > bg50 (subtle) > calculated fallback
    const buttonBgPrimary = themeZone.bg200 || themeZone.bg100 || themeZone.bg50 || lightenColor(primaryColor, 0.85);
    const buttonBgSecondary = themeZone.bg300 || themeZone.bg200 || buttonBgPrimary; // Even lighter for secondary
    
    // Button text should be DARK (for light button backgrounds)
    // This works for both dark and light zones because button bg is always light
    const buttonText = themeZone.textDark || getColorHex('utility-gray-900');
    
    // Outline/link elements use light colors (for contrast against dark block background)
    const outlineColor = themeZone.textLight || getColorHex('text-white');
    
    // DEBUG: Log computed colors
    console.log('🟠 getCTAButtonStyleV2 - Computed Colorful Mode Colors:', {
      buttonBgPrimary,
      buttonBgSecondary,
      buttonText,
      outlineColor,
      tokensUsed: {
        primary: themeZone.bg200 ? 'bg200' : themeZone.bg100 ? 'bg100' : themeZone.bg50 ? 'bg50' : 'calculated',
        secondary: themeZone.bg300 ? 'bg300' : themeZone.bg200 ? 'bg200' : 'fallback'
      },
      fallbackUsed: {
        bg200: !themeZone.bg200,
        bg300: !themeZone.bg300,
        text: !themeZone.textDark,
        outline: !themeZone.textLight
      }
    });
    
    const colorfulStyles = {
      primary: {
        ...baseStyle,
        color: buttonText,              // Dark text on light background
        backgroundColor: buttonBgPrimary, // Very light bg (bg200)
        border: `1px solid ${buttonBgPrimary}`
      },
      secondary: {
        ...baseStyle,
        color: buttonText,                // Dark text on light background
        backgroundColor: buttonBgSecondary, // Ultra light bg (bg300)
        border: `1px solid rgba(255, 255, 255, 0.3)`
      },
      outline: {
        ...baseStyle,
        color: outlineColor,              // Light text (for dark block bg)
        backgroundColor: 'transparent',
        border: `2px solid ${outlineColor}`
      },
      link: {
        ...baseStyle,
        color: outlineColor,              // Light text (for dark block bg)
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0',
        textDecoration: 'underline'
      }
    };
    
    console.log('🎨 Returning COLORFUL mode style for:', style);
    return colorfulStyles[style] || colorfulStyles.primary;
  }

  // DEFAULT MODE: Standard button styles on white/light backgrounds
  const styles = {
    primary: {
      ...baseStyle,
      color: COLORS.white,
      backgroundColor: primaryColor,
      border: `1px solid ${primaryColor}`
    },
    secondary: {
      ...baseStyle,
      color: primaryColor,
      backgroundColor: 'transparent',
      border: `2px solid ${primaryColor}`
    },
    outline: {
      ...baseStyle,
      color: primaryColor,
      backgroundColor: 'transparent',
      border: `2px solid ${primaryColor}`
    },
    link: {
      ...baseStyle,
      color: primaryColor,
      backgroundColor: 'transparent',
      border: 'none',
      padding: '0',
      textDecoration: 'underline'
    }
  };

  return styles[style] || styles.primary;
}
