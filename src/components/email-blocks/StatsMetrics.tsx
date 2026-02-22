// Stats/Metrics Component
// Use for: Key numbers, performance metrics, highlights

import React from 'react';
import { COLORS } from './email-styles';
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
import { getThemeById } from '../../lib/theme-catalog';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';

interface Stat {
  value: string;
  label: string;
}

interface StatsMetricsProps {
  // Core content
  title?: string;
  stats: Stat[];
  
  // Phase 2: Layout
  padding?: PaddingSize;
  contentAlign?: AlignmentOption;
  
  // Phase 2: Typography
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  titleColor?: ColorValue | ColorId | string;
  valueSize?: FontSize;
  valueWeight?: FontWeight;
  valueColor?: ColorValue | ColorId | string;
  labelSize?: FontSize;
  labelWeight?: FontWeight;
  labelColor?: ColorValue | ColorId | string;
  
  // Phase 2: Spacing
  titleStatsGap?: SpacingSize;
  statGap?: SpacingSize;
  
  // Phase 2: Visibility
  showTitle?: boolean;
  
  // Theme system (Phase 3)
  theme?: string;
  backgroundColor?: ColorValue | ColorId | string;
  
  // Legacy/System
  isEmailMode?: boolean;
}

export const StatsMetrics = React.memo(({
  title,
  stats,
  // Phase 2: Layout
  padding = 'md',
  contentAlign = 'left',
  // Phase 2: Typography
  titleSize = 'xl',
  titleWeight = 'semibold',
  titleColor,
  valueSize = '4xl',
  valueWeight = 'bold',
  valueColor,
  labelSize = 'sm',
  labelWeight = 'normal',
  labelColor,
  // Phase 2: Spacing
  titleStatsGap = 'xl',
  statGap = 'md',
  // Phase 2: Visibility
  showTitle = true,
  // Theme system
  theme,
  backgroundColor = '#FFFFFF',
  // Legacy/System
  isEmailMode = false
}: StatsMetricsProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor);
  const titleColorHex = colorValueToHex(titleColor || COLORS.primaryText);
  const valueColorHex = colorValueToHex(valueColor || COLORS.primary);
  const labelColorHex = colorValueToHex(labelColor || COLORS.secondaryText);
  
  // Apply theme colors if theme is set (using 'body' zone)
  const themeData = theme ? getThemeById(theme) : null;
  const effectiveBackgroundColor = themeData?.body.bg || bgColorHex;
  const effectiveTitleColor = themeData?.body.fg || titleColorHex;
  // Use theme header color for stat values (accent color), fall back to custom or brand primary
  const effectiveValueColor = themeData?.header.bg || valueColorHex;
  const effectiveLabelColor = themeData?.body.fg || labelColorHex;
  
  const paddingValue = getPadding(padding);

  // Standardized title style using block utilities
  const titleStyle = {
    ...getBlockTitleStyles(titleSize, titleWeight, effectiveTitleColor, isEmailMode),
    marginBottom: getSpacing(titleStatsGap),
    textAlign: contentAlign
  };

  const containerStyle = {
    padding: paddingValue,
    backgroundColor: effectiveBackgroundColor
  };

  // Stat box colors: Use theme-aware subtle variant or fallback to gray
  const statBoxBackground = themeData?.body.fg ? `${themeData.body.fg}0A` : '#F8FAFC'; // 0A = 4% opacity
  
  const statBoxStyle = {
    backgroundColor: statBoxBackground,
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center' as const
  };
  
  // Standardized label style
  const labelStyle = {
    color: effectiveLabelColor,
    fontSize: getFontSize(labelSize),
    fontWeight: getFontWeight(labelWeight),
    lineHeight: '1.4'
  };

  return (
    <tr>
      <td style={containerStyle}>
        {/* Title - STANDARDIZED */}
        {shouldShow(showTitle) && title && (
          <div style={titleStyle}>
            {title}
          </div>
        )}
        
        {/* Stats Grid */}
        {isEmailMode ? (
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {stats.map((stat, index) => (
                  <td 
                    key={index}
                    width={`${100 / stats.length}%`}
                    style={{
                      ...statBoxStyle,
                      verticalAlign: 'top',
                      ...(index < stats.length - 1 && { paddingRight: getSpacing(statGap) })
                    }}
                  >
                    <div style={{
                      color: effectiveValueColor,
                      fontSize: getFontSize(valueSize),
                      fontWeight: getFontWeight(valueWeight),
                      marginBottom: '8px',
                      lineHeight: '1.2'
                    }}>
                      {stat.value}
                    </div>
                    <div style={labelStyle}>
                      {stat.label}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: getSpacing(statGap),
            gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`
          }}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                style={statBoxStyle}
              >
                <div style={{ 
                  color: effectiveValueColor,
                  fontSize: getFontSize(valueSize),
                  fontWeight: getFontWeight(valueWeight),
                  marginBottom: '8px',
                  lineHeight: '1.2'
                }}>
                  {stat.value}
                </div>
                <div style={labelStyle}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
});
StatsMetrics.displayName = 'StatsMetrics';