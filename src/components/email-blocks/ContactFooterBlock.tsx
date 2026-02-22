// STRUCTURAL BLOCK: Contact Footer
// Contact information and legal disclaimer

import React from 'react';
import { VerticalLinesPattern } from './patterns/VerticalLinesPattern';
import { type PaddingSize } from '../../lib/layout-scales';
import { getHeaderFooterPadding } from '../../lib/block-utilities';
import { getThemeColors } from '../../lib/theme-catalog';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';
import { KORE_LOGO_DEFAULT, koreLogoDark } from './HeaderBlock';

interface ContactFooterBlockProps {
  message: string;
  teamName: string;
  email: string;
  website: string;
  disclaimer: string;
  showPattern?: boolean;
  isEmailMode?: boolean;
  showCardStyle?: boolean;
  // Logo configuration
  showLogo?: boolean;
  logoSrc?: string;
  logoSize?: 'sm' | 'md' | 'lg';
  // Styling properties
  contentAlignment?: 'left' | 'center' | 'right';
  backgroundColor?: ColorValue | ColorId | string;
  messageColor?: ColorValue | ColorId | string;
  messageFontSize?: number;
  teamNameColor?: ColorValue | ColorId | string;
  teamNameFontSize?: number;
  linkColor?: ColorValue | ColorId | string;
  disclaimerColor?: ColorValue | ColorId | string;
  disclaimerFontSize?: number;
  // Padding - supports both new semantic system and legacy pixel values
  padding?: PaddingSize; // NEW: Semantic padding (sm/md/lg)
  paddingTop?: number;   // DEPRECATED: For backwards compatibility
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  // Theme support - NEW
  theme?: string;
}

export const ContactFooterBlock = React.memo(({ 
  message, 
  teamName, 
  email, 
  website, 
  disclaimer, 
  showPattern = false,
  isEmailMode = false,
  showCardStyle = false,
  showLogo = false,
  logoSrc,
  logoSize = 'md',
  contentAlignment = 'center',
  backgroundColor = '#F8FAFC',
  messageColor = '#475569',
  messageFontSize = 16,
  teamNameColor = '#0F172A',
  teamNameFontSize = 16,
  linkColor = '#004EEB',
  disclaimerColor = '#94A3B8',
  disclaimerFontSize = 12,
  padding = 'md', // NEW: Default to 'md' padding
  paddingTop,   // DEPRECATED: For backwards compatibility
  paddingBottom,
  paddingLeft,
  paddingRight,
  theme // NEW: Theme support
}: ContactFooterBlockProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor);
  const messageColorHex = colorValueToHex(messageColor);
  const teamNameColorHex = colorValueToHex(teamNameColor);
  const linkColorHex = colorValueToHex(linkColor);
  const disclaimerColorHex = colorValueToHex(disclaimerColor);
  
  // Get theme colors if theme is set (using 'footer' zone)
  const themeColors = theme ? getThemeColors(theme, 'footer') : null;

  // Resolve Kore logo sentinel to actual image URL (footer uses dark logo on light bg)
  const resolvedLogoSrc =
    logoSrc && (logoSrc === KORE_LOGO_DEFAULT || (typeof logoSrc === 'string' && logoSrc.includes('kore-logo')))
      ? koreLogoDark
      : logoSrc;

  // Calculate padding - support both semantic system and legacy pixel values
  // If legacy pixel values are provided, use those for backward compatibility
  // Otherwise, use semantic padding system
  const calculatedPadding = paddingTop !== undefined || paddingBottom !== undefined || 
                            paddingLeft !== undefined || paddingRight !== undefined
    ? `${paddingTop || 48}px ${paddingRight || 32}px ${paddingBottom || 48}px ${paddingLeft || 32}px`
    : getHeaderFooterPadding(padding, isEmailMode).padding;

  return (
    <tr>
      <td style={{ 
        backgroundColor: bgColorHex || themeColors?.bg, 
        padding: calculatedPadding, 
        textAlign: contentAlignment
      }}>
        {showPattern && (
          <div style={{ marginBottom: '32px', opacity: 0.2 }}>
            <VerticalLinesPattern height={40} count={20} spacing={16} lineWidth={1} />
          </div>
        )}
        {showLogo && resolvedLogoSrc && (
          <div style={{ 
            marginBottom: '20px', 
            textAlign: contentAlignment,
            lineHeight: '0',
            fontSize: '0'
          }}>
            <img 
              src={resolvedLogoSrc} 
              alt="Logo" 
              style={{ 
                display: contentAlignment === 'left' ? 'block' : 'inline-block',
                width: logoSize === 'sm' ? '50px' : logoSize === 'md' ? '100px' : '150px' 
              }} 
            />
          </div>
        )}
        <p style={{ margin: '0 0 20px 0', color: messageColorHex || themeColors?.fg, fontSize: `${messageFontSize}px`, lineHeight: '1.7' }}>
          {renderTextWithLineBreaks(message?.trim() ? message : 'Thank you for your continued support and valuable feedback.')}
        </p>
        <div style={{ marginBottom: '8px', color: teamNameColorHex || themeColors?.fg, fontSize: `${teamNameFontSize}px`, fontWeight: '600' }}>
          {teamName?.trim() ? teamName : 'Kore.ai Product Management Team'}
        </div>
        <div style={{ marginBottom: '20px', color: themeColors?.fg ? `${themeColors.fg}99` : '#64748B', fontSize: '14px' }}>
          {email?.trim() ? email : 'contact@kore.ai'}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <a href={website?.trim() ? website : 'https://kore.ai'} style={{ color: linkColorHex || themeColors?.fg, fontSize: '14px', textDecoration: 'underline' }}>
            {website?.trim() ? website : 'kore.ai'}
          </a>
        </div>
        <div style={{ color: disclaimerColorHex || themeColors?.fg, fontSize: '12px', opacity: '0.7' }}>
          {renderTextWithLineBreaks(disclaimer?.trim() ? disclaimer : '© 2025 Kore.ai. All rights reserved.')}
        </div>
      </td>
    </tr>
  );
});
ContactFooterBlock.displayName = 'ContactFooterBlock';