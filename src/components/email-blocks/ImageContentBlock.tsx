// Image + Content Block
// Use for: Side-by-side image and content layout with switchable position

import React from 'react';
import { BADGE_STYLES, type BadgeType } from './badge-styles';
import { COLORS } from './email-styles';
import { getCTAButtonStyleV2, type CTAButtonStyle } from './cta-button-styles';
import { emailSafeStyle, EMAIL_SAFE_STYLES } from '../../lib/email-styles-converter';
import { 
  getPadding, 
  getSpacing, 
  type PaddingSize,
  type SpacingSize,
  type AlignmentOption
} from '../../lib/layout-scales';
import {
  getFontSize,
  getFontWeight,
  getTextColor,
  type FontSize,
  type FontWeight
} from '../../lib/typography-scales';
import {
  getBlockTitleStyles,
  getBlockDescriptionStyles,
  shouldShow
} from '../../lib/block-utilities';
import { getThemeColors } from '../../lib/theme-catalog';
import { getSwappedColors } from '../../lib/theme-application';
import { colorValueToHex } from '../../lib/color-token-system';
import { type ImageRadiusStyle } from '../../lib/global-theme';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

interface ImageContentBlockProps {
  // Image properties
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  imageWidth?: number; // percentage, default 40
  imageRadius?: ImageRadiusStyle;  // Image corner radius
  
  // Content properties
  title?: string;
  description?: string;
  badge?: BadgeType;
  bullets?: string[];
  ctaText?: string;
  ctaLink?: string;
  
  // Layout properties
  padding?: PaddingSize;
  contentAlign?: AlignmentOption;
  
  // Phase 2: Typography
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  titleColor?: ColorValue | ColorId | string;
  descriptionSize?: FontSize;
  descriptionWeight?: FontWeight;
  descriptionColor?: ColorValue | ColorId | string;
  
  // Spacing properties
  titleDescriptionGap?: SpacingSize;
  descriptionBulletsGap?: SpacingSize;
  bulletsCtaGap?: SpacingSize;
  bulletSpacing?: SpacingSize;
  imageContentGap?: SpacingSize;
  
  // CTA properties
  ctaStyle?: CTAButtonStyle;
  ctaBorderRadius?: string;
  ctaColor?: ColorValue | ColorId | string;
  showCTA?: boolean;
  
  // Visibility properties
  showTitle?: boolean;
  showDescription?: boolean;
  showBadge?: boolean;
  showBullets?: boolean;
  showImage?: boolean;
  
  // Theme system
  theme?: string;
  colorfulMode?: boolean;
  themeSwapped?: boolean;
  backgroundColor?: ColorValue | ColorId | string;
  
  // System properties
  isEmailMode?: boolean;
}

export const ImageContentBlock = React.memo(({
  // Image properties
  imageSrc,
  imageAlt = 'Feature image',
  imagePosition = 'left',
  imageWidth = 40,
  imageRadius = '8px',
  
  // Content properties
  title = 'Feature Title',
  description = 'Feature description goes here.',
  badge,
  bullets = [],
  ctaText = 'Learn More',
  ctaLink = '#',
  
  // Layout properties
  padding = 'md',
  contentAlign = 'left',
  
  // Phase 2: Typography
  titleSize = 'xl',
  titleWeight = 'bold',
  titleColor,
  descriptionSize = 'sm',
  descriptionWeight = 'normal',
  descriptionColor,
  
  // Spacing properties
  titleDescriptionGap = 'md',
  descriptionBulletsGap = 'lg',
  bulletsCtaGap = 'lg',
  bulletSpacing = 'sm',
  imageContentGap = 'lg',
  
  // CTA properties
  ctaStyle = 'primary',
  ctaBorderRadius = '8px',
  ctaColor,
  showCTA = true,
  
  // Visibility properties
  showTitle = true,
  showDescription = true,
  showBadge = true,
  showBullets = true,
  showImage = true,
  
  // Theme system
  theme,
  colorfulMode = false,
  themeSwapped = false,
  backgroundColor,
  
  // System properties
  isEmailMode = false
}: ImageContentBlockProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = backgroundColor ? colorValueToHex(backgroundColor) : undefined;
  const titleColorHex = colorValueToHex(titleColor || getTextColor('primary'));
  const descColorHex = colorValueToHex(descriptionColor || getTextColor('secondary'));
  const ctaColorHex = colorValueToHex(ctaColor || COLORS.primary);
  
  // Choose zone based on colorful mode
  const themeZone = colorfulMode ? 'header' : 'body';
  
  // Get theme colors with swap support using getSwappedColors utility
  const themeColors = theme ? getSwappedColors(theme, themeZone, themeSwapped) : null;
  
  // PHASE B: Get full theme zone object for button extended tokens (bg200, bg300, textDark, textLight)
  // Use current zone in colorful mode, header zone in normal mode (for accent color)
  const themeZoneForButton = theme && colorfulMode ? getThemeColors(theme, themeZone) : theme ? getThemeColors(theme, 'header') : null;
  
  // Container style with background - custom takes priority
  const effectiveBackgroundColor = bgColorHex || themeColors?.bg;
  const containerStyle = {
    padding: getPadding(padding),
    ...(effectiveBackgroundColor && { backgroundColor: effectiveBackgroundColor })
  };
  
  // Title style
  const titleStyle = getBlockTitleStyles(
    titleSize,
    titleWeight,
    titleColorHex || themeColors?.fg,
    isEmailMode
  );
  
  // Description style
  const descriptionStyle = getBlockDescriptionStyles(
    descriptionSize,
    descriptionWeight,
    descColorHex || themeColors?.fg,
    isEmailMode
  );
  
  // Image style
  const imageStyle = emailSafeStyle({
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: imageRadius,
    border: `1px solid ${COLORS.border}`
  }, isEmailMode);
  
  // Bullet styles
  const bulletStyle = emailSafeStyle({
    color: descColorHex || themeColors?.fg,
    fontSize: getFontSize('sm'),
    lineHeight: '1.5',
    flexShrink: 0
  }, isEmailMode);

  const bulletTextStyle = emailSafeStyle({
    color: descColorHex || themeColors?.fg,
    fontSize: getFontSize('sm'),
    lineHeight: '1.7'
  }, isEmailMode);

  const badgeStyle = badge ? BADGE_STYLES[badge] : null;
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
  
  // Use theme zone color for CTA if theme is active, otherwise use ctaColor prop
  const effectiveCTAColor = themeZoneForButton?.bg || ctaColorHex;
  
  const ctaButtonStyle = emailSafeStyle(
    getCTAButtonStyleV2(ctaStyle, isEmailMode, ctaBorderRadius, effectiveCTAColor, colorfulMode, themeZoneForButton),
    isEmailMode
  );
  
  const ctaWrapperStyle = getCTAContainerStyles(contentAlign);
  
  // Calculate column widths
  const contentWidth = 100 - imageWidth;
  const spacerWidth = 5; // Gap between columns
  
  // Content section
  const renderContent = () => (
    <>
      {/* Badge */}
      {shouldShow(showBadge) && badgeStyle && (
        <div style={{ marginBottom: getSpacing(titleDescriptionGap), textAlign: contentAlign }}>
          <span style={badgeInlineStyle}>{badgeStyle.text}</span>
        </div>
      )}
      {/* Title */}
      {shouldShow(showTitle) && title && (
        <div style={{ 
          marginBottom: shouldShow(showDescription) ? getSpacing(titleDescriptionGap) : (shouldShow(showBullets) && bullets.length > 0 ? getSpacing(descriptionBulletsGap) : (shouldShow(showCTA) ? getSpacing(bulletsCtaGap) : '0')),
          textAlign: contentAlign
        }}>
          <span style={titleStyle}>{title}</span>
        </div>
      )}
      
      {/* Description */}
      {shouldShow(showDescription) && description && (
        <p style={{
          ...descriptionStyle,
          margin: 0,
          marginBottom: shouldShow(showBullets) && bullets.length > 0 ? getSpacing(descriptionBulletsGap) : (shouldShow(showCTA) ? getSpacing(bulletsCtaGap) : '0'),
          textAlign: contentAlign
        }}>
          {renderTextWithLineBreaks(description)}
        </p>
      )}
      
      {/* Bullets */}
      {shouldShow(showBullets) && bullets.length > 0 && (
        <div style={{ 
          textAlign: contentAlign,
          marginBottom: shouldShow(showCTA) ? getSpacing(bulletsCtaGap) : '0'
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
      {shouldShow(showCTA) && ctaText && (
        <div style={ctaWrapperStyle}>
          <a href={ctaLink} style={ctaButtonStyle}>
            {ctaText}
            {ctaStyle !== 'link' && <span style={{ fontSize: '16px' }}>→</span>}
          </a>
        </div>
      )}
    </>
  );
  
  // Image section
  const renderImage = () => (
    shouldShow(showImage) && imageSrc && (
      <img 
        src={imageSrc} 
        alt={imageAlt}
        style={imageStyle} 
      />
    )
  );

  return (
    <tr>
      <td style={containerStyle}>
        {isEmailMode ? (
          // Email mode: Table-based layout
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {imagePosition === 'left' ? (
                  <>
                    {/* Image Column (Left) */}
                    <td 
                      width={`${imageWidth}%`} 
                      style={{ 
                        verticalAlign: 'top',
                        paddingRight: getSpacing(imageContentGap)
                      }}
                      className="image-content-column"
                    >
                      {renderImage()}
                    </td>
                    
                    {/* Content Column (Right) */}
                    <td 
                      width={`${contentWidth}%`} 
                      style={{ verticalAlign: 'top' }}
                      className="image-content-column"
                    >
                      {renderContent()}
                    </td>
                  </>
                ) : (
                  <>
                    {/* Content Column (Left) */}
                    <td 
                      width={`${contentWidth}%`} 
                      style={{ 
                        verticalAlign: 'top',
                        paddingRight: getSpacing(imageContentGap)
                      }}
                      className="image-content-column"
                    >
                      {renderContent()}
                    </td>
                    
                    {/* Image Column (Right) */}
                    <td 
                      width={`${imageWidth}%`} 
                      style={{ verticalAlign: 'top' }}
                      className="image-content-column"
                    >
                      {renderImage()}
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        ) : (
          // Preview mode: Flexbox layout
          <div style={{ 
            display: 'flex', 
            flexDirection: imagePosition === 'left' ? 'row' : 'row-reverse',
            gap: getSpacing(imageContentGap),
            alignItems: 'flex-start'
          }}>
            {/* Image */}
            <div style={{ width: `${imageWidth}%`, flexShrink: 0 }}>
              {renderImage()}
            </div>
            
            {/* Content */}
            <div style={{ flex: 1 }}>
              {renderContent()}
            </div>
          </div>
        )}
      </td>
    </tr>
  );
});

ImageContentBlock.displayName = 'ImageContentBlock';