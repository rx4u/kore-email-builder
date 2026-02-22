// BLOCK TYPE 6: Alert/Warning Block
// Use for: Warnings, Success messages, Info, Errors, Tips

import React from 'react';
import { getCTAButtonStyleV2, type CTAButtonStyle } from './cta-button-styles';
import { 
  getPadding, 
  getSpacing, 
  getCTAAlignmentStyles,
  type PaddingSize,
  type SpacingSize,
  type AlignmentOption
} from '../../lib/layout-scales';
import {
  type FontSize,
  type FontWeight
} from '../../lib/typography-scales';
import {
  getBlockTitleStyles,
  getBlockDescriptionStyles,
  shouldShow
} from '../../lib/block-utilities';
import { getThemeById } from '../../lib/theme-catalog';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

export type AlertType = 'warning' | 'success' | 'info' | 'error' | 'tip';

// Alert type configurations
const ALERT_CONFIGS: Record<AlertType, {
  backgroundColor: string;
  borderColor: string;
  badgeColor: string;
  badgeText: string;
  titleColor: string;
  descriptionColor: string;
  buttonColor: string;
}> = {
  warning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    badgeColor: '#F59E0B',
    badgeText: 'WARNING',
    titleColor: '#92400E',
    descriptionColor: '#78350F',
    buttonColor: '#D97706',
  },
  success: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    badgeColor: '#10B981',
    badgeText: 'SUCCESS',
    titleColor: '#065F46',
    descriptionColor: '#047857',
    buttonColor: '#059669',
  },
  info: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    badgeColor: '#3B82F6',
    badgeText: 'INFO',
    titleColor: '#1E40AF',
    descriptionColor: '#1E3A8A',
    buttonColor: '#2563EB',
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    badgeColor: '#EF4444',
    badgeText: 'ERROR',
    titleColor: '#991B1B',
    descriptionColor: '#7F1D1D',
    buttonColor: '#DC2626',
  },
  tip: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
    badgeColor: '#6366F1',
    badgeText: 'TIP',
    titleColor: '#3730A3',
    descriptionColor: '#312E81',
    buttonColor: '#4F46E5',
  },
};

interface WarningBlockProps {
  // Core content
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  ctaStyle?: 'primary' | 'secondary' | 'tertiary' | 'link';
  ctaBorderRadius?: string;
  
  // Alert type
  alertType?: AlertType;
  
  // Phase 2: Layout
  padding?: PaddingSize;
  contentAlign?: AlignmentOption;
  
  // Phase 2: Typography
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  titleColor?: ColorValue | ColorId | string;
  descriptionSize?: FontSize;
  descriptionWeight?: FontWeight;
  descriptionColor?: ColorValue | ColorId | string;
  
  // Phase 2: Spacing
  titleDescriptionGap?: SpacingSize;
  descriptionCtaGap?: SpacingSize;
  
  // Phase 2: Visibility
  showTitle?: boolean;
  showDescription?: boolean;
  showCTA?: boolean;
  showBadge?: boolean;
  
  // Theme system (Phase 3)
  theme?: string;
  colorfulMode?: boolean;
  themeSwapped?: boolean;
  backgroundColor?: ColorValue | ColorId | string;
  ctaColor?: ColorValue | ColorId | string;
  
  // Legacy/System
  isEmailMode?: boolean;
  showCardStyle?: boolean;
}

export const WarningBlock = React.memo(({ 
  title, 
  message, 
  ctaText, 
  ctaLink,
  ctaStyle,
  ctaBorderRadius,
  alertType = 'warning',
  // Phase 2: Layout - NO inline defaults, values come from BLOCK_DEFAULTS
  padding,
  contentAlign,
  // Phase 2: Typography - NO inline defaults
  titleSize,
  titleWeight,
  titleColor,
  descriptionSize,
  descriptionWeight,
  descriptionColor,
  // Phase 2: Spacing - NO inline defaults
  titleDescriptionGap,
  descriptionCtaGap,
  // Phase 2: Visibility - NO inline defaults
  showTitle,
  showDescription,
  showCTA,
  showBadge = true,
  // Theme system
  theme,
  colorfulMode,
  themeSwapped,
  backgroundColor,
  ctaColor,
  // Legacy/System
  isEmailMode = false,
  showCardStyle = false
}: WarningBlockProps) => {
  // Get alert type configuration
  const alertConfig = ALERT_CONFIGS[alertType];
  
  // ✅ CRITICAL: For Alert blocks, ALWAYS use alert type colors (semantic meaning)
  // These colors are NOT customizable because they communicate importance (red=error, yellow=warning, etc.)
  // Themes and user-set colors are ignored for alert-specific elements
  
  // Background: Use alert type background (theme override allowed for container)
  const effectiveBackgroundColor = theme 
    ? (getThemeById(theme)?.body.bg || alertConfig.backgroundColor)
    : alertConfig.backgroundColor;
  
  // Text colors: Use alert type colors (or theme for readability)
  const effectiveTitleColor = theme
    ? (getThemeById(theme)?.body.fg || alertConfig.titleColor)
    : alertConfig.titleColor;
    
  const effectiveDescriptionColor = theme
    ? (getThemeById(theme)?.body.fg || alertConfig.descriptionColor)
    : alertConfig.descriptionColor;
  
  // Border & Button: ALWAYS use alert type colors (NOT customizable - semantic meaning)
  const borderColor = alertConfig.borderColor;
  const ctaColorHex = alertConfig.buttonColor;
  
  const paddingValue = getPadding(padding);
  const ctaAlignStyles = getCTAAlignmentStyles(contentAlign);
  
  // Get CTA button style based on ctaStyle type
  const ctaButtonStyle = emailSafeStyle(
    getCTAButtonStyleV2(ctaStyle as CTAButtonStyle, isEmailMode, ctaBorderRadius, ctaColorHex),
    isEmailMode
  );
  
  // Standardized styles using block utilities
  const titleStyle = {
    ...getBlockTitleStyles(titleSize, titleWeight, effectiveTitleColor, isEmailMode),
    textAlign: contentAlign
  };

  const descriptionStyle = {
    ...getBlockDescriptionStyles(descriptionSize, descriptionWeight, effectiveDescriptionColor, isEmailMode),
    margin: shouldShow(showCTA) ? `0 0 ${getSpacing(descriptionCtaGap)} 0` : '0',
    textAlign: contentAlign
  };
  
  return (
    <tr>
      <td style={{ 
        padding: paddingValue,
        backgroundColor: effectiveBackgroundColor, 
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '0'
      }}>
        {/* Badge at top - STANDARDIZED like other blocks */}
        {shouldShow(showBadge) && (
          <div style={{ marginBottom: '8px', textAlign: contentAlign }}>
            <span style={{ 
              backgroundColor: alertConfig.badgeColor,
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px',
              display: 'inline-block'
            }}>
              {alertConfig.badgeText}
            </span>
          </div>
        )}
        
        {/* Title - STANDARDIZED */}
        {shouldShow(showTitle) && (
          <div style={{ 
            ...titleStyle,
            marginBottom: shouldShow(showDescription) ? getSpacing(titleDescriptionGap) : (shouldShow(showCTA) ? getSpacing(descriptionCtaGap) : '0')
          }}>
            {title}
          </div>
        )}
        
        {/* Description - STANDARDIZED */}
        {shouldShow(showDescription) && (
          <p style={descriptionStyle}>
            {renderTextWithLineBreaks(message)}
          </p>
        )}
        
        {/* CTA */}
        {shouldShow(showCTA) && (
          <div style={ctaAlignStyles}>
            <a href={ctaLink} style={ctaButtonStyle}>
              {ctaText}
              {ctaStyle !== 'link' && <span style={{ fontSize: '16px', marginLeft: '8px' }}>→</span>}
            </a>
          </div>
        )}
      </td>
    </tr>
  );
});
WarningBlock.displayName = 'WarningBlock';