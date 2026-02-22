// BLOCK TYPE 3: Item Grid
// Use for: Lists of models, integrations, tools (2-column grid layout)

import React from 'react';
import { getCTAButtonStyleV2, type CTAButtonStyle } from './cta-button-styles';
import { COLORS } from './email-styles';
import { 
  getPadding, 
  getSpacing, 
  getAlignmentStyles,
  getCTAAlignmentStyles,
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
import { getThemeById } from '../../lib/theme-catalog';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

interface ItemGridProps {
  // Core content
  icon?: React.ReactNode;
  title: string;
  description: string;
  items: string[];
  ctaText: string;
  ctaLink: string;
  ctaStyle?: CTAButtonStyle;
  ctaBorderRadius?: string;
  
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
  itemSpacing?: SpacingSize;      // Vertical gap between rows
  columnGap?: SpacingSize;        // Horizontal gap between columns
  
  // Phase 2: Visibility
  showTitle?: boolean;
  showDescription?: boolean;
  showCTA?: boolean;
  
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

export const ItemGrid = React.memo(({ 
  icon, 
  title, 
  description, 
  items, 
  ctaText, 
  ctaLink,
  ctaStyle = 'secondary',
  ctaBorderRadius = '8px',
  ctaColor,
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
  itemSpacing,
  columnGap,
  // Phase 2: Visibility - NO inline defaults
  showTitle,
  showDescription,
  showCTA,
  // Theme system
  theme,
  colorfulMode,
  themeSwapped,
  backgroundColor,
  // Legacy/System
  isEmailMode = false,
  showCardStyle = false
}: ItemGridProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor);
  const titleColorHex = colorValueToHex(titleColor || getTextColor('primary'));
  const descColorHex = colorValueToHex(descriptionColor || getTextColor('secondary'));
  const ctaColorHex = colorValueToHex(ctaColor);
  
  // Apply theme colors if theme is set (using 'body' zone)
  const themeData = theme ? getThemeById(theme) : null;
  const effectiveBackgroundColor = themeData?.body.bg || bgColorHex;
  const effectiveTitleColor = themeData?.body.fg || titleColorHex;
  const effectiveDescriptionColor = themeData?.body.fg || descColorHex;
  
  // Card colors: Use theme-aware subtle variants or fallback to gray
  const cardBackgroundColor = themeData?.body.fg ? `${themeData.body.fg}0A` : '#F8FAFC'; // 0A = 4% opacity
  const cardBorderColor = themeData?.body.fg ? `${themeData.body.fg}1A` : '#E2E8F0'; // 1A = 10% opacity
  
  // Use theme header color for CTA if theme is active, otherwise use ctaColor prop
  const effectiveCTAColor = themeData?.header.bg || ctaColorHex;
  const ctaButtonStyle = getCTAButtonStyleV2(ctaStyle, isEmailMode, ctaBorderRadius, effectiveCTAColor);
  const paddingValue = getPadding(padding);
  const titleAlignStyles = getAlignmentStyles(contentAlign, isEmailMode);
  const descriptionAlignStyles = getAlignmentStyles(contentAlign, isEmailMode);
  const ctaAlignStyles = getCTAAlignmentStyles(contentAlign);
  
  // Standardized style for grid item labels
  const itemLabelStyle = {
    fontSize: getFontSize('sm'),
    fontWeight: getFontWeight('medium'),
    color: themeData?.body.fg || COLORS.primaryText
  };
  
  return (
    <tr>
      <td style={{ 
        padding: paddingValue, 
        backgroundColor: effectiveBackgroundColor, 
        borderRadius: '0' 
      }}>
        {(shouldShow(showTitle) || shouldShow(showDescription)) && (
          <div style={{ marginBottom: getSpacing(descriptionCtaGap) }}>
            {shouldShow(showTitle) && (
              <div style={{ 
                marginBottom: shouldShow(showDescription) ? getSpacing(titleDescriptionGap) : '0',
                ...titleAlignStyles
              }}>
                <span style={{ 
                  fontSize: getFontSize(titleSize),
                  fontWeight: getFontWeight(titleWeight),
                  color: effectiveTitleColor,
                  letterSpacing: '-0.01em' 
                }}>
                  {title}
                </span>
              </div>
            )}
            {shouldShow(showDescription) && (
              <div style={descriptionAlignStyles}>
                <p style={{ 
                  margin: '0', 
                  color: effectiveDescriptionColor,
                  fontSize: getFontSize(descriptionSize),
                  fontWeight: getFontWeight(descriptionWeight),
                  lineHeight: '1.6'
                }}>
                  {renderTextWithLineBreaks(description)}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* 2-Column Grid with modern styling */}
        <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%', marginBottom: shouldShow(showCTA) ? getSpacing(descriptionCtaGap) : '0' }}>
          <tbody>
            {Array.from({ length: Math.ceil(items.length / 2) }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ 
                  width: '50%', 
                  padding: rowIndex === Math.ceil(items.length / 2) - 1 
                    ? `0 ${getSpacing(columnGap)} 0 0` 
                    : `0 ${getSpacing(columnGap)} ${getSpacing(itemSpacing)} 0` 
                }}>
                  {items[rowIndex * 2] && (
                    <div style={{ 
                      backgroundColor: cardBackgroundColor, 
                      padding: '14px 16px', 
                      borderRadius: '10px',
                      border: `1px solid ${cardBorderColor}`,
                      transition: 'all 0.2s'
                    }}>
                      <span style={itemLabelStyle}>{items[rowIndex * 2]}</span>
                    </div>
                  )}
                </td>
                <td style={{ 
                  width: '50%', 
                  padding: rowIndex === Math.ceil(items.length / 2) - 1 
                    ? `0 0 0 ${getSpacing(columnGap)}` 
                    : `0 0 ${getSpacing(itemSpacing)} ${getSpacing(columnGap)}` 
                }}>
                  {items[rowIndex * 2 + 1] && (
                    <div style={{ 
                      backgroundColor: cardBackgroundColor, 
                      padding: '14px 16px', 
                      borderRadius: '10px',
                      border: `1px solid ${cardBorderColor}`,
                      transition: 'all 0.2s'
                    }}>
                      <span style={itemLabelStyle}>{items[rowIndex * 2 + 1]}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {shouldShow(showCTA) && (
          <div style={ctaAlignStyles}>
            <a 
              href={ctaLink} 
              style={ctaButtonStyle}
            >
              {ctaText}
              {ctaStyle !== 'link' && <span style={{ fontSize: '16px' }}>→</span>}
            </a>
          </div>
        )}
      </td>
    </tr>
  );
});
ItemGrid.displayName = 'ItemGrid';