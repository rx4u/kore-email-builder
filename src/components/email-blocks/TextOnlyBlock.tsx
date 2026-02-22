// BLOCK TYPE 7: Text-Only Block
// Use for: Simple announcements without bullets or screenshots
// DEBUG: Force module reload - checking colorful mode execution

import React from 'react';
import { BADGE_STYLES, type BadgeType } from './badge-styles';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { getCTAButtonStyleV2, type CTAButtonStyle } from './cta-button-styles';
import { COLORS } from './email-styles';
import { TextOnlyBlockProps } from './shared-props';
import { 
  getBlockPadding, 
  getBlockTitleStyles, 
  getBlockDescriptionStyles,
  getBlockAlignment,
  getCTAContainerStyles,
  shouldShow,
  getTitleMargin,
  getDescriptionMargin
} from '../../lib/block-utilities';
import { getThemeColors, getThemeById } from '../../lib/theme-catalog';
import { getSwappedColors } from '../../lib/theme-application';
import { colorValueToHex } from '../../lib/color-token-system';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

export const TextOnlyBlock = React.memo(({ 
  icon, 
  title, 
  badge,
  description, 
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
  // Editable props
  isEditable = false,
  onTitleChange,
  onDescriptionChange,
  onCtaTextChange,
  onCtaLinkChange,
  // System props
  isEmailMode = false,
  showCardStyle = false,
  // Theme support - NEW
  theme,
  colorfulMode = false,
  themeSwapped = false,
  backgroundColor
}: TextOnlyBlockProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = backgroundColor ? colorValueToHex(backgroundColor) : undefined;
  const titleColorHex = colorValueToHex(titleColor || COLORS.primaryText);
  const descColorHex = colorValueToHex(descriptionColor || COLORS.secondaryText);
  const ctaColorHex = colorValueToHex(ctaColor || COLORS.primary);
  
  // Choose zone based on colorful mode
  const themeZone = colorfulMode ? 'header' : 'body';
  
  // Get theme colors with swap support using new utility
  // This uses bg200/fg200 tokens for smooth transitions instead of direct fg/bg swap
  const themeColors = theme ? getSwappedColors(theme, themeZone, themeSwapped) : null;
  
  // Get theme header colors for CTA buttons (accent color)
  const themeHeaderColors = theme ? getThemeColors(theme, 'header') : null;
  
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

  const titleInputStyle = emailSafeStyle({
    ...titleStyle,
    border: '2px solid var(--border)',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: isEmailMode ? undefined : 'all 0.2s'
  }, isEmailMode);

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
    ...getDescriptionMargin(descriptionCtaGap, showCTA)
  };

  const descriptionTextareaStyle = emailSafeStyle({
    ...descriptionStyle,
    width: '100%',
    border: '2px solid var(--border)',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'inherit',
    minHeight: '80px',
    outline: 'none',
    transition: isEmailMode ? undefined : 'all 0.2s',
    resize: 'vertical' as const
  }, isEmailMode);

  const ctaInputStyle = emailSafeStyle({
    color: 'var(--primary)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    border: '2px solid var(--border)',
    padding: '10px 16px',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'inherit',
    minWidth: '150px',
    outline: 'none',
    transition: isEmailMode ? undefined : 'all 0.2s'
  }, isEmailMode);

  const ctaLinkInputStyle = emailSafeStyle({
    fontSize: 'var(--text-sm)',
    color: 'var(--text-tertiary)',
    border: '2px solid var(--border)',
    padding: '10px 16px',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'inherit',
    flex: 1,
    minWidth: '200px',
    outline: 'none',
    transition: isEmailMode ? undefined : 'all 0.2s'
  }, isEmailMode);

  // Get full theme zone object for extended tokens (bg200, bg300, textDark, textLight)
  // In colorful mode, use current zone; otherwise use header zone for accent color
  const themeZoneForButton = theme && colorfulMode ? getThemeById(theme)?.[themeZone] : theme ? getThemeById(theme)?.header : null;
  
  // Use theme zone background color as base for button in colorful mode
  // This allows getCTAButtonStyleV2 to derive proper bg200/bg300 lighter variants
  const effectiveCTAColor = (colorfulMode && themeZoneForButton) ? themeZoneForButton.bg : ctaColorHex;
  
  // CTA Button Style using V2 function with colorful mode support
  const ctaButtonStyle = emailSafeStyle(
    getCTAButtonStyleV2(
      ctaStyle,
      isEmailMode,
      ctaBorderRadius,
      effectiveCTAColor,
      colorfulMode,
      themeZoneForButton
    ),
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
              {isEditable && onTitleChange ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  style={titleInputStyle}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span style={titleStyle}>
                  {title}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {shouldShow(showDescription) && (
            <div>
              {isEditable && onDescriptionChange ? (
                <textarea
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  style={descriptionTextareaStyle}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p style={descriptionStyle}>
                  {renderTextWithLineBreaks(description)}
                </p>
              )}
            </div>
          )}

          {/* CTA Button */}
          {shouldShow(showCTA) && (
            <div style={ctaWrapperStyle}>
              {isEditable && onCtaTextChange ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => onCtaTextChange(e.target.value)}
                    style={ctaInputStyle}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {onCtaLinkChange && (
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => onCtaLinkChange(e.target.value)}
                      placeholder="https://..."
                      style={ctaLinkInputStyle}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              ) : (
                <a href={ctaLink} style={ctaButtonStyle}>
                  {ctaText}
                  {ctaStyle !== 'link' && <span style={{ fontSize: '16px' }}>→</span>}
                </a>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});
TextOnlyBlock.displayName = 'TextOnlyBlock';