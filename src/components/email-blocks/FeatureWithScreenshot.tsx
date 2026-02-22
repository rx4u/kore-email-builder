// BLOCK TYPE 1: Feature with Screenshot
// Use for: Major features that need visual demonstration

import React from 'react';
import { BADGE_STYLES, type BadgeType } from './badge-styles';
import { emailSafeStyle, EMAIL_SAFE_STYLES } from '../../lib/email-styles-converter';
import { getCTAButtonStyleV2, type CTAButtonStyle } from './cta-button-styles';
import { COLORS, GRADIENT_PRESETS, type GradientPreset } from './email-styles';
import { FeatureWithScreenshotProps } from './shared-props';
import { 
  getBlockPadding, 
  getBlockTitleStyles, 
  getBlockDescriptionStyles,
  getBlockAlignment,
  getCTAContainerStyles,
  shouldShow,
  getTitleMargin,
  getBulletListStyles,
  getBulletItemStyles
} from '../../lib/block-utilities';
import { getSpacing } from '../../lib/layout-scales';
import { getThemeColors } from '../../lib/theme-catalog';
import { getSwappedColors } from '../../lib/theme-application';
import { colorValueToHex } from '../../lib/color-token-system';
import { IMAGE_RADIUS } from '../../lib/global-theme';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

export const FeatureWithScreenshot = React.memo(({ 
  icon, 
  title, 
  badge,
  description, 
  screenshot,
  screenshotAlt,
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
  // Image props
  imageRadius,
  imageMargin = 'lg' as const,
  imageMaxWidth = 100 as const,
  gradientIntensity = 50 as const,
  // System props
  isEmailMode = false,
  showCardStyle = false,
  // Layout and styling options
  useGradientBackground = false,
  gradientPreset = 'blueSubtle' as GradientPreset,
  fullWidth = false,
  // Theme support - NEW
  theme,
  colorfulMode = false,
  themeSwapped = false,
  backgroundColor
}: FeatureWithScreenshotProps) => {
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
  const gradientColors = GRADIENT_PRESETS[gradientPreset];

  // Compute image border radius from imageRadius prop
  const imageBorderRadiusValue = imageRadius ? IMAGE_RADIUS[imageRadius] : '8px';

  // Dynamic styles using new utility functions
  // Custom background takes priority over theme background
  const effectiveBackgroundColor = bgColorHex || themeColors?.bg;
  const containerStyle = {
    ...getBlockPadding(padding, isEmailMode),
    ...(effectiveBackgroundColor && { backgroundColor: effectiveBackgroundColor })
  };
  
  const contentWrapperStyle = getBlockAlignment(contentAlign, isEmailMode);
  // Use contentAlign for all elements to ensure consistency
  const titleWrapperStyle = getBlockAlignment(titleAlign || contentAlign, isEmailMode);
  const descriptionWrapperStyle = getBlockAlignment(descriptionAlign || contentAlign, isEmailMode);
  const ctaWrapperStyle = getCTAContainerStyles(ctaAlign || contentAlign);

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
    marginBottom: getSpacing(imageMargin)
  };

  const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: imageBorderRadiusValue,
    display: 'block'
  };

  const imageContainerStyle = emailSafeStyle({
    maxWidth: `${imageMaxWidth}%`,
    margin: '0 auto',
    display: 'block'
  }, isEmailMode);

  // Gradient overlay styles
  const gradientOverlayStyle = emailSafeStyle({
    position: 'absolute' as const,
    inset: '0',
    borderRadius: imageBorderRadiusValue,
    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
    opacity: gradientIntensity / 100,
    pointerEvents: 'none' as const
  }, isEmailMode);

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
          
          {/* Screenshot with optional gradient background and full-width support */}
          <div style={imageContainerStyle}>
            <img 
              src={screenshot} 
              alt={screenshotAlt}
              style={imageStyles} 
            />
          </div>
          
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
                      <td style={{ paddingBottom: index === bullets.length - 1 ? '0' : getSpacing(bulletSpacing) }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                          <span style={bulletStyle}>•</span>
                          <span style={bulletTextStyle}>{bullet}</span>
                        </div>
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
FeatureWithScreenshot.displayName = 'FeatureWithScreenshot';