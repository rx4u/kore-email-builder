// BLOCK TYPE 4: Multi-Update
// Use for: Grouping multiple minor updates together under one heading

import React from 'react';
import { BADGE_STYLES, type BadgeType } from './badge-styles';
import { COLORS } from './email-styles';
import { 
  getPadding, 
  getSpacing, 
  getAlignmentStyles,
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
import { lightenColor, getThemeVariants } from '../../lib/color-utilities';
import { getThemeById } from '../../lib/theme-catalog';
import { colorValueToHex } from '../../lib/color-token-system';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

interface Update {
  title: string;
  badge?: BadgeType;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface MultiUpdateProps {
  // Core content
  icon?: React.ReactNode;
  title: string;
  updates: Update[];
  
  // Phase 2: Layout
  padding?: PaddingSize;
  contentAlign?: AlignmentOption;
  
  // Phase 2: Typography  
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  titleColor?: import('../../lib/color-token-system').ColorValue | import('../../lib/color-token-system').ColorId | string;
  
  // Phase 2: Spacing
  titleDescriptionGap?: SpacingSize;
  updateSpacing?: SpacingSize;
  
  // Phase 2: Visibility
  showTitle?: boolean;
  
  // Theme system (Phase 3)
  theme?: string;              // Theme ID from theme catalog
  ctaColor?: import('../../lib/color-token-system').ColorValue | import('../../lib/color-token-system').ColorId | string;  // Token-based CTA color
  backgroundColor?: import('../../lib/color-token-system').ColorValue | import('../../lib/color-token-system').ColorId | string;  // Token-based background
  
  // Legacy/System
  isEmailMode?: boolean;
  showCardStyle?: boolean;
}

export const MultiUpdate = React.memo(({ 
  icon, 
  title, 
  updates,
  // Phase 2: Layout - NO inline defaults, values come from BLOCK_DEFAULTS
  padding,
  contentAlign,
  // Phase 2: Typography - NO inline defaults
  titleSize,
  titleWeight,
  titleColor,
  // Phase 2: Spacing - NO inline defaults
  titleDescriptionGap,
  updateSpacing,
  // Phase 2: Visibility - NO inline defaults
  showTitle,
  // Theme system
  theme,
  colorfulMode = false,
  themeSwapped = false,
  ctaColor,
  backgroundColor,
  // Legacy/System
  isEmailMode = false,
  showCardStyle = false
}: MultiUpdateProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = backgroundColor ? colorValueToHex(backgroundColor) : undefined;
  const titleColorHex = colorValueToHex(titleColor || getTextColor('primary'));
  const ctaColorHex = colorValueToHex(ctaColor || getTextColor('brand'));
  
  // Choose zone based on colorful mode
  const themeZone = colorfulMode ? 'header' : 'body';
  
  // Apply theme colors if theme is set
  const themeData = theme ? getThemeById(theme) : null;
  let zoneBg = themeData?.[themeZone].bg;
  let zoneFg = themeData?.[themeZone].fg;
  
  // Apply FG/BG swap if requested
  if (themeData && themeSwapped) {
    [zoneBg, zoneFg] = [zoneFg, zoneBg];
  }
  
  const effectiveBackgroundColor = zoneBg || bgColorHex;
  const effectiveTitleColor = zoneFg || titleColorHex;
  
  // Use theme header color for CTA and accent elements if theme is active
  const effectiveCTAColor = themeData?.header.bg || ctaColorHex;
  
  // Create soft, professional card styling with subtle color accent
  // Use very light tint (97% lighter) for background + colored left border
  const updateCardBackground = '#FFFFFF'; // Always white for maximum readability
  const updateCardBorder = `1px solid ${COLORS.border}`; // Subtle gray border
  const accentBorderColor = effectiveCTAColor; // Use theme color for left accent border
  const updateTextColor = COLORS.primaryText; // Always use dark text on white
  const updateDescriptionColor = COLORS.secondaryText; // Always use muted text on white
  
  const paddingValue = getPadding(padding);
  const titleAlignStyles = getAlignmentStyles(contentAlign, isEmailMode);
  
  // Standardized styles for update cards (sub-items)
  // Use theme colors if theme is applied
  const updateTitleStyle = {
    ...getBlockTitleStyles('lg', 'bold', updateTextColor, isEmailMode),
    marginBottom: '8px'
  };

  const updateDescriptionStyle = {
    ...getBlockDescriptionStyles('base', 'normal', updateDescriptionColor, isEmailMode),
    margin: '0 0 16px 0'
  };
  
  return (
    <tr>
      <td style={{ 
        padding: paddingValue, 
        backgroundColor: effectiveBackgroundColor, 
        borderRadius: '0' 
      }}>
        {/* Block Title - STANDARDIZED */}
        {shouldShow(showTitle) && (
          <div style={{ 
            marginBottom: getSpacing(titleDescriptionGap),
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
        
        {/* Updates with card-like styling */}
        <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>
          <tbody>
            {updates.map((update, index) => (
              <tr key={index}>
                <td style={{ paddingBottom: index === updates.length - 1 ? '0' : getSpacing(updateSpacing) }}>
                  <div style={{ 
                    backgroundColor: updateCardBackground,
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: updateCardBorder,
                    borderLeft: `4px solid ${accentBorderColor}`,
                    textAlign: contentAlign
                  }}>
                    {/* Badge - Separate from title for consistency with other blocks */}
                    {update.badge && BADGE_STYLES[update.badge] && (
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ 
                          backgroundColor: BADGE_STYLES[update.badge].bg,
                          color: BADGE_STYLES[update.badge].color,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: '700',
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.5px',
                          display: 'inline-block'
                        }}>
                          {BADGE_STYLES[update.badge].text}
                        </span>
                      </div>
                    )}
                    
                    {/* Update Title - STANDARDIZED */}
                    <div style={updateTitleStyle}>
                      {update.title}
                    </div>
                    
                    {/* Update Description - STANDARDIZED */}
                    <p style={updateDescriptionStyle}>
                      {renderTextWithLineBreaks(update.description)}
                    </p>
                    
                    {/* CTA - Now uses dynamic color from theme */}
                    <a 
                      href={update.ctaLink} 
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: effectiveCTAColor, 
                        fontSize: '15px', 
                        textDecoration: 'none', 
                        fontWeight: '600'
                      }}
                    >
                      {update.ctaText}
                      <span style={{ fontSize: '16px' }}>→</span>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
});
MultiUpdate.displayName = 'MultiUpdate';