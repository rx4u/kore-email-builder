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

export function getCTAButtonStyleV2(
  style: CTAButtonStyle = 'primary',
  isEmailMode: boolean = false,
  borderRadius: string = '8px',
  primaryColor: string = '#004EEB',
  colorfulMode: boolean = false,
  themeZone?: ThemeZone | null
) {
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

  if (colorfulMode && themeZone) {
    const buttonBgPrimary = themeZone.bg200 || themeZone.bg100 || themeZone.bg50 || lightenColor(primaryColor, 0.85);
    const buttonBgSecondary = themeZone.bg300 || themeZone.bg200 || buttonBgPrimary;
    const buttonText = themeZone.textDark || getColorHex('utility-gray-900');
    const outlineColor = themeZone.textLight || getColorHex('text-white');

    const colorfulStyles = {
      primary: {
        ...baseStyle,
        color: buttonText,
        backgroundColor: buttonBgPrimary,
        border: `1px solid ${buttonBgPrimary}`
      },
      secondary: {
        ...baseStyle,
        color: buttonText,
        backgroundColor: buttonBgSecondary,
        border: `1px solid rgba(255, 255, 255, 0.3)`
      },
      outline: {
        ...baseStyle,
        color: outlineColor,
        backgroundColor: 'transparent',
        border: `2px solid ${outlineColor}`
      },
      link: {
        ...baseStyle,
        color: outlineColor,
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0',
        textDecoration: 'underline'
      }
    };

    return colorfulStyles[style] || colorfulStyles.primary;
  }

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
