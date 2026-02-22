// BLOCK TYPE 2: Feature List (No Screenshot)
// Use for: Text-only announcements, features without visual changes

import React from 'react';
import { BADGE_STYLES, type BadgeType } from './badge-styles';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { getCTAButtonStyleV2, type CTAButtonStyle } from './cta-button-styles';
import { COLORS } from './email-styles';
import { ListBlockProps } from './shared-props';
import { 
  getBlockPadding, 
  getBlockTitleStyles, 
  getBlockDescriptionStyles,
  getBlockAlignment,
  getCTAContainerStyles,
  shouldShow,
  getTitleMargin,
  getDescriptionMargin,
  getBulletListStyles,
  getBulletItemStyles
} from '../../lib/block-utilities';
import { getSpacing } from '../../lib/layout-scales';
import { getThemeColors } from '../../lib/theme-catalog';
import { getSwappedColors } from '../../lib/theme-application';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

export const FeatureList = React.memo(({ 
  icon, 
  title, 
  badge,
  description, 
  bullets, 
  ctaText, 
  ctaLink,
  // Layout props - NO inline defaults, values come from BLOCK_DEFAULTS
  padding,
  contentAlign,
  titleAlign,
  descriptionAlign,
  titleDescriptionGap,
  descriptionCtaGap,
  // CTA props - NO inline defaults
  ctaStyle,
  ctaAlign,
  ctaBorderRadius,
  ctaColor,
  showCTA,
  // Typography props - NO inline defaults
  titleSize,
  titleWeight,
  titleColor,
  descriptionSize,
  descriptionWeight,
  descriptionColor,
  // Visibility props - NO inline defaults
  showTitle,
  showDescription,
  showBadge,
  showBullets,
  // List props - NO inline defaults
  bulletSpacing,
  bulletAlign,
  // System props
  isEmailMode = false,
  showCardStyle = false,
  // Theme support - NEW
  theme,
  colorfulMode = false,
  themeSwapped = false,
  backgroundColor
}: ListBlockProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = backgroundColor ? colorValueToHex(backgroundColor) : undefined;
  const titleColorHex = colorValueToHex(titleColor || COLORS.primaryText);
  const descColorHex = colorValueToHex(descriptionColor || COLORS.secondaryText);
  const ctaColorHex = colorValueToHex(ctaColor || COLORS.primary);
  
  // Choose zone based on colorful mode
  const themeZone = colorfulMode ? 'header' : 'body';
  
  // Get theme colors with swap support using getSwappedColors utility
  const themeColors = theme ? getSwappedColors(theme, themeZone, themeSwapped) : null;
  
  // PHASE B: Get full theme zone object for button extended tokens (bg200, bg300, textDark, textLight)
  // Use current zone in colorful mode, header zone in normal mode (for accent color)
  const themeZoneForButton = theme && colorfulMode ? getThemeColors(theme, themeZone) : theme ? getThemeColors(theme, 'header') : null;
  
  const badgeStyle = badge ? BADGE_STYLES[badge] : null;

  // Dynamic styles using new utility functions
  // Custom background takes priority over theme background
  const effectiveBackgroundColor = bgColorHex || themeColors?.bg;
  const containerStyle = {
    ...getBlockPadding(padding, isEmailMode),
    ...(effectiveBackgroundColor && { backgroundColor: effectiveBackgroundColor })
  };
  
  const contentWrapperStyle = getBlockAlignment(contentAlign, isEmailMode);
  const titleWrapperStyle = getBlockAlignment(titleAlign, isEmailMode);
  const descriptionWrapperStyle = getBlockAlignment(descriptionAlign, isEmailMode);
  const ctaWrapperStyle = getCTAContainerStyles(ctaAlign);

  const titleStyle = getBlockTitleStyles(
    titleSize,
    titleWeight,
    titleColorHex || themeColors?.fg,
    isEmailMode
  );

  const badgeInlineStyle = emailSafeStyle({
    backgroundColor: badgeStyle?.bg || COLORS.primary,
    color: badgeStyle?.color || COLORS.white,
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'inline-block'
  }, isEmailMode);

  const descriptionStyle = {
    ...getBlockDescriptionStyles(
      descriptionSize,
      descriptionWeight,
      descColorHex || themeColors?.fg,
      isEmailMode
    ),
    marginBottom: shouldShow(showBullets) ? getSpacing('md') : '0'
  };

  const bulletStyle = emailSafeStyle({
    color: descColorHex || themeColors?.fg,
    fontSize: '18px',
    lineHeight: '1.5',
    flexShrink: 0
  }, isEmailMode);

  const bulletTextStyle = emailSafeStyle({
    color: descColorHex || themeColors?.fg,
    fontSize: '16px',
    lineHeight: '1.7'
  }, isEmailMode);

  // Use theme zone color for CTA if theme is active, otherwise use ctaColor prop
  const effectiveCTAColor = themeZoneForButton?.bg || ctaColorHex;
  
  const ctaButtonStyle = emailSafeStyle(
    getCTAButtonStyleV2(ctaStyle, isEmailMode, ctaBorderRadius, effectiveCTAColor, colorfulMode, themeZoneForButton),
    isEmailMode
  );

  return (
    <tr>
      <td style={containerStyle}>
        <div style={contentWrapperStyle}>
          {/* Badge */}
          {shouldShow(showBadge) && badgeStyle && (
            <div style={{ marginBottom: '8px' }}>
              <span style={badgeInlineStyle}>
                {badgeStyle.text}
              </span>
            </div>
          )}
          
          {/* Title */}
          {shouldShow(showTitle) && (
            <div style={{ ...getTitleMargin(titleDescriptionGap) }}>
              <span style={titleStyle}>
                {title}
              </span>
            </div>
          )}

          {/* Description */}
          {shouldShow(showDescription) && (
            <div>
              <p style={descriptionStyle}>
                {renderTextWithLineBreaks(description)}
              </p>
            </div>
          )}
          
          {/* Bullets */}
          {shouldShow(showBullets) && bullets.length > 0 && (
            <div style={{ 
              textAlign: bulletAlign || contentAlign,
              marginBottom: shouldShow(showCTA) ? getSpacing(descriptionCtaGap) : '0' 
            }}>
              <table 
                cellPadding="0" 
                cellSpacing="0" 
                border={0} 
                style={{ 
                  display: 'inline-block'
                }}
              >
                <tbody>
                  {bullets.map((bullet, index) => (
                    <tr key={index}>
                      <td style={{ 
                        paddingBottom: index === bullets.length - 1 ? '0' : getSpacing(bulletSpacing),
                        verticalAlign: 'top'
                      }}>
                        <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>
                          <tbody>
                            <tr>
                              <td style={{ width: '20px', verticalAlign: 'top', paddingTop: '2px' }}>
                                <span style={bulletStyle}>•</span>
                              </td>
                              <td style={{ paddingLeft: '12px', verticalAlign: 'top' }}>
                                <span style={bulletTextStyle}>{bullet}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CTA Button */}
          {shouldShow(showCTA) && (
            <div style={ctaWrapperStyle}>
              <a href={ctaLink} style={ctaButtonStyle}>
                {ctaText}
                {ctaStyle !== 'link' && <span style={{ fontSize: '16px' }}>→</span>}
              </a>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});
FeatureList.displayName = 'FeatureList';