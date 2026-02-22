// STRUCTURAL BLOCK: Header
// Email header with logo and badges
// Features automatic logo color adaptation:
//   - White logo on dark backgrounds (e.g., #004EEB blue)
//   - Dark logo on light backgrounds (e.g., white, light gray)

import React from 'react';
import { DottedPattern } from './patterns/DottedPattern';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { CategoryBadge, type CategoryBadgeType } from './CategoryBadge';
import { VersionBadge, type VersionBadgeStyle } from './VersionBadge';
import { getLogoPixelValue } from '../properties-panel/LogoSizeControl';
import { type PaddingSize } from '../../lib/layout-scales';
import { getHeaderFooterPadding } from '../../lib/block-utilities';
import { getThemeColors } from '../../lib/theme-catalog';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';
import { getSpacing, type SpacingSize } from '../../lib/layout-scales';
// Import Kore.ai logos from assets - switch based on background (dark logo on light bg, light logo on dark bg)
import koreLogoDark from '../../assets/kore-logo-dark.png'; // For light backgrounds
import koreLogoLight from '../../assets/kore-logo-light.png'; // For dark backgrounds

/** Sentinel for "use Kore adaptive logo" so we don't rely on URL equality across bundles. */
export const KORE_LOGO_DEFAULT = 'kore-logo-default';

// Export logos for use in other components
export { koreLogoDark, koreLogoLight };

interface HeaderBlockProps {
  title: string;
  date?: string;
  showDate?: boolean;
  showPattern?: boolean;
  onTitleChange?: (value: string) => void;
  isEditable?: boolean;
  isEmailMode?: boolean;
  showCardStyle?: boolean;
  // Product name configuration
  productName?: string;
  showProductName?: boolean;
  productNameFontSize?: number;
  // New badge options
  categoryBadge?: CategoryBadgeType;
  versionText?: string;
  versionBadgeStyle?: VersionBadgeStyle;
  // Logo configuration
  showLogo?: boolean;
  logoSrc?: string;
  logoSize?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  logoCustomWidth?: number;
  logoWidth?: number; // DEPRECATED: For backwards compatibility
  logoAlignment?: 'left' | 'center' | 'right'; // Logo alignment (defaults to contentAlignment)
  // Styling properties - Token-based colors
  contentAlignment?: 'left' | 'center' | 'right';
  backgroundColor?: ColorValue | ColorId | string;
  titleColor?: ColorValue | ColorId | string;
  titleFontSize?: number;
  dateColor?: ColorValue | ColorId | string;
  dateFontSize?: number;
  // Padding - supports both new semantic system and legacy pixel values
  padding?: PaddingSize; // NEW: Semantic padding (sm/md/lg)
  paddingTop?: number;   // DEPRECATED: For backwards compatibility
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  // Spacing - NEW: Semantic spacing controls
  logoTitleGap?: SpacingSize;
  titleDateGap?: SpacingSize;
  // Theme support - NEW
  theme?: string;
}

export const HeaderBlock = React.memo(({ 
  title,
  date,
  showDate = true,
  showPattern = false,
  onTitleChange,
  isEditable = false,
  isEmailMode = false,
  showCardStyle = false,
  productName,
  showProductName = false,
  productNameFontSize = 20,
  categoryBadge,
  versionText,
  versionBadgeStyle = 'outlined',
  showLogo = true,
  logoSrc = koreLogoDark, // Auto-switches: white logo on dark bg, dark logo on light bg
  logoSize = 'lg', // Default logo size increased for better visibility
  logoCustomWidth,
  logoWidth, // DEPRECATED: For backwards compatibility
  logoAlignment,
  contentAlignment = 'left',
  backgroundColor = '#004EEB',
  titleColor = '#ffffff',
  titleFontSize = 32,
  dateColor = '#ffffff',
  dateFontSize = 16,
  padding = 'md', // NEW: Default to 'md' padding
  paddingTop,   // DEPRECATED: For backwards compatibility
  paddingBottom,
  paddingLeft,
  paddingRight,
  logoTitleGap = '3x', // 3x spacing under logo (36px)
  titleDateGap = 'md',
  theme // NEW: Theme support
}: HeaderBlockProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor || '#004EEB');
  const titleColorHex = colorValueToHex(titleColor || '#ffffff');
  const dateColorHex = colorValueToHex(dateColor || '#ffffff');
  
  // Get theme colors if theme is set (using 'header' zone)
  const themeColors = theme ? getThemeColors(theme, 'header') : null;
  // Calculate actual logo width - supports both new logoSize system and legacy logoWidth
  const actualLogoWidth = logoSize 
    ? getLogoPixelValue(logoSize, logoCustomWidth)
    : (logoWidth || 80);

  // AUTOMATIC LOGO COLOR ADAPTATION
  // Kore logo when: sentinel (from App), exact import match, or URL contains 'kore-logo'. Dark bg → light logo; light bg → dark logo.
  const isKoreLogo = Boolean(
    logoSrc &&
    (logoSrc === KORE_LOGO_DEFAULT ||
      logoSrc === koreLogoDark ||
      logoSrc === koreLogoLight ||
      logoSrc === 'kore-logo' ||
      (typeof logoSrc === 'string' && logoSrc.includes('kore-logo')))
  );

  // Use the same value we render for the header background (single source of truth for logo choice)
  const resolvedBgColor = bgColorHex || themeColors?.bg || '#004EEB';

  // Helper: is this color light? Uses relative luminance (ITU-R BT.709). Unparseable → treat as dark (prefer light logo).
  const isLightColor = (color: string): boolean => {
    let r = 0, g = 0, b = 0;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '').trim();
      if (hex.length >= 6) {
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
      }
    } else if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        r = parseInt(matches[0], 10);
        g = parseInt(matches[1], 10);
        b = parseInt(matches[2], 10);
      }
    }
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  // Dark background (e.g. blue #004EEB) → use light logo; light background → use dark logo
  const backgroundIsDark = !isLightColor(resolvedBgColor);
  const adaptiveLogoSrc = isKoreLogo
    ? (backgroundIsDark ? koreLogoLight : koreLogoDark)
    : logoSrc;

  // Calculate padding - support both semantic system and legacy pixel values
  // If legacy pixel values are provided, use those for backward compatibility
  // Otherwise, use semantic padding system
  const calculatedPadding = paddingTop !== undefined || paddingBottom !== undefined || 
                            paddingLeft !== undefined || paddingRight !== undefined
    ? `${paddingTop || 48}px ${paddingRight || 32}px ${paddingBottom || 48}px ${paddingLeft || 32}px`
    : getHeaderFooterPadding(padding, isEmailMode).padding;

  // Email-safe styles with customizable background (no border-radius; layout wrapper owns corners in preview/export)
  const containerStyle = {
    padding: calculatedPadding,
    backgroundColor: bgColorHex || themeColors?.bg,
    position: isEmailMode ? undefined : ('relative' as const),
    textAlign: contentAlignment as any
  };

  const titleInputStyle = emailSafeStyle({
    fontSize: `${titleFontSize}px`,
    fontWeight: '700',
    color: titleColorHex || themeColors?.fg,
    letterSpacing: '-0.02em',
    border: '2px solid #ffffff4d',
    padding: '12px 16px',
    borderRadius: '8px',
    width: '100%',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: '#ffffff1a',
    transition: isEmailMode ? undefined : 'all 0.2s'
  }, isEmailMode);

  const titleStyle = emailSafeStyle({
    fontSize: `${titleFontSize}px`,
    fontWeight: '700',
    color: titleColorHex || themeColors?.fg,
    letterSpacing: '-0.02em',
    margin: '0',
    lineHeight: '1.2'
  }, isEmailMode);

  const dateStyle = emailSafeStyle({
    fontSize: `${dateFontSize}px`,
    fontWeight: '400',
    color: dateColorHex || themeColors?.fg,
    letterSpacing: '0',
    margin: '12px 0 0 0'
  }, isEmailMode);

  return (
    <tr>
      <td style={containerStyle}>
        {/* Logo */}
        {showLogo && logoSrc && (
          <div style={{ 
            marginBottom: getSpacing(logoTitleGap, isEmailMode), 
            lineHeight: '0', 
            fontSize: '0',
            textAlign: logoAlignment ?? contentAlignment
          }}>
            <img
              src={adaptiveLogoSrc}
              alt="Logo"
              width={actualLogoWidth}
              style={{
                display: (logoAlignment ?? contentAlignment) === 'left' ? 'block' : 'inline-block',
                width: `${actualLogoWidth}px`,
                height: 'auto',
                border: 'none',
                outline: 'none'
              }}
            />
          </div>
        )}

        {/* Product Name - shown ABOVE title */}
        {showProductName && productName && (
          <div style={{ 
            fontSize: `${productNameFontSize}px`,
            color: titleColorHex || themeColors?.fg,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            fontWeight: '700',
            marginBottom: '8px',
            opacity: 0.8
          }}>
            {productName}
          </div>
        )}

        {/* Title Input (Build Mode Only) */}
        {isEditable && onTitleChange ? (
          <div style={{ marginBottom: showDate && date ? '8px' : '0' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              style={titleInputStyle}
              placeholder="Email title..."
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <h1 style={titleStyle}>
            {title && String(title).trim() ? title : 'Email title'}
          </h1>
        )}

        {/* Version Badge */}
        {versionText && (
          <div style={{ marginTop: '16px' }}>
            <VersionBadge 
              text={versionText}
              style={versionBadgeStyle}
              isEmailMode={isEmailMode}
              foregroundColor={themeColors?.fg || titleColor}
            />
          </div>
        )}

        {/* Date - show placeholder when showDate is true but date is empty */}
        {showDate && (
          <div style={{ ...dateStyle, marginTop: getSpacing(titleDateGap, isEmailMode) }}>
            {date && String(date).trim()
              ? date
              : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </td>
    </tr>
  );
});
HeaderBlock.displayName = 'HeaderBlock';