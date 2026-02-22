// Shared inline styles for email blocks that reference CSS variables
// This ensures consistent styling across all email blocks while maintaining email compatibility

import { getColorHex } from '../../lib/color-palette';
import { lightenColor, getContrastTextColor } from '../../lib/color-utilities';

// Color constants - now using the color palette
export const COLORS = {
  primary: getColorHex('brand-primary-600'),
  primaryText: getColorHex('text-primary-900'),
  secondaryText: getColorHex('text-secondary-700'),
  tertiaryText: getColorHex('text-tertiary-600'),
  border: getColorHex('utility-gray-200'),
  white: getColorHex('white'),
  background: getColorHex('utility-gray-50'),
} as const;

// Gradient presets - Subtle and professional
export const GRADIENT_PRESETS = {
  blueSubtle: { from: '#EFF6FF', to: '#DBEAFE', label: 'Blue (Subtle)' },
  graySubtle: { from: '#F8FAFC', to: '#F1F5F9', label: 'Gray (Subtle)' },
  indigoSubtle: { from: '#EEF2FF', to: '#E0E7FF', label: 'Indigo (Subtle)' },
  tealSubtle: { from: '#F0FDFA', to: '#CCFBF1', label: 'Teal (Subtle)' },
  purpleSubtle: { from: '#FAF5FF', to: '#F3E8FF', label: 'Purple (Subtle)' },
} as const;

export type GradientPreset = keyof typeof GRADIENT_PRESETS;

export type CTAButtonStyle = 'primary' | 'secondary' | 'outline' | 'link';

// Get button styles based on type
// Now supports dynamic primary color from global theme
export function getCTAButtonStyle(
  style: CTAButtonStyle = 'primary', 
  isEmailMode: boolean = false, 
  borderRadius: string = '8px',
  primaryColor: string = '#004EEB'  // Dynamic primary color, defaults to brand blue
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

  // Calculate secondary button background (10% tint of primary color)
  const secondaryBg = lightenColor(primaryColor, 0.9);
  
  // Get appropriate text color for primary button
  const primaryText = getContrastTextColor(primaryColor);

  const styles = {
    primary: {
      ...baseStyle,
      color: primaryText,
      backgroundColor: primaryColor,
      border: `1px solid ${primaryColor}`
    },
    secondary: {
      ...baseStyle,
      color: primaryColor,
      backgroundColor: secondaryBg,
      border: '1px solid transparent'
    },
    outline: {
      ...baseStyle,
      color: primaryColor,
      backgroundColor: 'transparent',
      border: `1px solid ${primaryColor}`
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

  return styles[style];
}

export const emailStyles = {
  // Layout & Spacing
  blockContainer: {
    padding: '32px 40px'
    // No borders - using whitespace for separation
  },
  
  // Typography
  title: {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em'
  },
  
  subtitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em'
  },
  
  bodyText: {
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--text-tertiary)',
    lineHeight: '1.7'
  },
  
  secondaryText: {
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--text-secondary)',
    lineHeight: '1.7'
  },
  
  smallText: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--text-tertiary)'
  },
  
  // Interactive Elements
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--primary)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    textDecoration: 'none',
    padding: '10px 20px',
    backgroundColor: '#EFF6FF',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.2s'
  },
  
  // Borders & Decorative
  border: {
    border: '1px solid var(--border)'
  },
  
  borderTop: {
    borderTop: '1px solid var(--border)'
  },
  
  roundedImage: {
    borderRadius: '12px',
    border: '1px solid var(--border)'
  },
  
  roundedCard: {
    borderRadius: '12px',
    border: '1px solid var(--border)'
  },
  
  // Badge
  badge: {
    padding: '6px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '11px',
    fontWeight: 'var(--font-weight-bold)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  
  // Bullet Points
  bullet: {
    color: 'var(--primary)',
    fontSize: '18px',
    lineHeight: '1.5',
    flexShrink: 0
  }
} as const;