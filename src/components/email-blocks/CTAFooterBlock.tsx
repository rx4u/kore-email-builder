// STRUCTURAL BLOCK: CTA Footer
// Call-to-action section before contact footer

import React from 'react';
import { type PaddingSize } from '../../lib/layout-scales';
import { getBlockPadding } from '../../lib/block-utilities';
import { getContrastTextColor } from '../../lib/color-utilities';
import { getThemeColors } from '../../lib/theme-catalog';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

interface CTAFooterBlockProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaBorderRadius?: string;
  ctaColor?: ColorValue | ColorId | string;  // Token-based color
  isEmailMode?: boolean;
  showCardStyle?: boolean;
  // Styling properties - Token-based colors
  backgroundColor?: ColorValue | ColorId | string;
  contentAlignment?: 'left' | 'center' | 'right';
  titleColor?: ColorValue | ColorId | string;
  titleFontSize?: number;
  descriptionColor?: ColorValue | ColorId | string;
  descriptionFontSize?: number;
  // Padding - supports both new semantic system and legacy pixel values
  padding?: PaddingSize; // NEW: Semantic padding (sm/md/lg)
  paddingTop?: number;   // DEPRECATED: For backwards compatibility
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  // Theme support - NEW
  theme?: string;
}

export const CTAFooterBlock = React.memo(({ 
  title, 
  description, 
  ctaText, 
  ctaLink,
  ctaBorderRadius = '10px',
  ctaColor = '#004EEB',  // NEW: Default to brand blue
  isEmailMode = false,
  showCardStyle = false,
  backgroundColor = '#F8FAFC',
  contentAlignment = 'center',
  titleColor = '#0F172A',
  titleFontSize = 24,
  descriptionColor = '#64748B',
  descriptionFontSize = 16,
  padding = 'md', // NEW: Default to 'md' padding
  paddingTop,   // DEPRECATED: For backwards compatibility
  paddingBottom,
  paddingLeft,
  paddingRight,
  theme // NEW: Theme support
}: CTAFooterBlockProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor || '#F8FAFC');
  const titleColorHex = colorValueToHex(titleColor || '#0F172A');
  const descColorHex = colorValueToHex(descriptionColor || '#64748B');
  const ctaColorHex = colorValueToHex(ctaColor || '#004EEB');
  
  // Get theme colors if theme is set (using 'footer' zone)
  const themeColors = theme ? getThemeColors(theme, 'footer') : null;
  
  // Calculate padding - support both semantic system and legacy pixel values
  // If legacy pixel values are provided, use those for backward compatibility
  // Otherwise, use semantic padding system
  const calculatedPadding = paddingTop !== undefined || paddingBottom !== undefined || 
                            paddingLeft !== undefined || paddingRight !== undefined
    ? `${paddingTop || 48}px ${paddingRight || 32}px ${paddingBottom || 48}px ${paddingLeft || 32}px`
    : getBlockPadding(padding, isEmailMode).padding;

  // Calculate button text color based on background
  const ctaTextColor = getContrastTextColor(ctaColorHex);

  return (
    <tr>
      <td style={{ 
        backgroundColor: bgColorHex || themeColors?.bg,
        padding: calculatedPadding,
        textAlign: contentAlignment,
        borderRadius: '0 0 12px 12px'
      }}>
        <h2 style={{ margin: '0 0 12px 0', color: titleColorHex || themeColors?.fg, fontSize: `${titleFontSize}px`, fontWeight: '600', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        <p style={{ margin: '0 0 28px 0', color: descColorHex || themeColors?.fg, fontSize: `${descriptionFontSize}px`, lineHeight: '1.7', maxWidth: '500px', marginLeft: contentAlignment === 'center' ? 'auto' : '0', marginRight: contentAlignment === 'center' ? 'auto' : contentAlignment === 'right' ? '0' : 'auto' }}>
          {renderTextWithLineBreaks(description)}
        </p>
        <a href={ctaLink} style={{ 
          display: 'inline-block',
          backgroundColor: ctaColorHex,
          color: ctaTextColor,
          padding: '14px 36px',
          borderRadius: ctaBorderRadius,
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: isEmailMode ? 'none' : `0 4px 6px -1px ${ctaColorHex}33, 0 2px 4px -1px ${ctaColorHex}1A`, // Dynamic shadow based on button color
          transition: isEmailMode ? undefined : 'all 0.2s'
        }}>
          {ctaText}
        </a>
      </td>
    </tr>
  );
});
CTAFooterBlock.displayName = 'CTAFooterBlock';