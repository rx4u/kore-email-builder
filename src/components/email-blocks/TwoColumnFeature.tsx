// Two Column Feature Component
// Use for: Side-by-side comparisons, feature pairs, before/after

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
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

interface Column {
  title: string;
  description: string;
}

interface TwoColumnFeatureProps {
  // Core content (NEW: Block-level title and description)
  title?: string;
  description?: string;
  leftColumn: Column;
  rightColumn: Column;
  
  // Phase 2: Layout
  padding?: PaddingSize;
  contentAlign?: AlignmentOption;
  
  // Phase 2: Typography (NEW: Block-level typography)
  blockTitleSize?: FontSize;
  blockTitleWeight?: FontWeight;
  blockTitleColor?: ColorValue | ColorId | string;
  blockDescriptionSize?: FontSize;
  blockDescriptionWeight?: FontWeight;
  blockDescriptionColor?: ColorValue | ColorId | string;
  // Column-level typography
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  titleColor?: ColorValue | ColorId | string;
  descriptionSize?: FontSize;
  descriptionWeight?: FontWeight;
  descriptionColor?: ColorValue | ColorId | string;
  
  // Phase 2: Spacing
  blockTitleDescriptionGap?: SpacingSize;
  blockDescriptionContentGap?: SpacingSize;
  titleDescriptionGap?: SpacingSize;
  columnGap?: SpacingSize;
  
  // Phase 2: Visibility (NEW: Block-level visibility)
  showBlockTitle?: boolean;
  showBlockDescription?: boolean;
  showLeftColumn?: boolean;
  showRightColumn?: boolean;
  
  // Theme system (Phase 3)
  theme?: string;
  backgroundColor?: ColorValue | ColorId | string;
  columnBackgroundColor?: ColorValue | ColorId | string;
  
  // Legacy/System
  isEmailMode?: boolean;
}

export const TwoColumnFeature = React.memo(({
  title,
  description,
  leftColumn,
  rightColumn,
  // Phase 2: Layout
  padding = 'md',
  contentAlign = 'left',
  // Phase 2: Typography (NEW: Block-level typography)
  blockTitleSize = 'xl',
  blockTitleWeight = 'bold',
  blockTitleColor,
  blockDescriptionSize = 'sm',
  blockDescriptionWeight = 'normal',
  blockDescriptionColor,
  // Column-level typography
  titleSize = 'lg',
  titleWeight = 'semibold',
  titleColor,
  descriptionSize = 'sm',
  descriptionWeight = 'normal',
  descriptionColor,
  // Phase 2: Spacing
  blockTitleDescriptionGap = 'md',
  blockDescriptionContentGap = 'lg',
  titleDescriptionGap = 'sm',
  columnGap = 'lg',
  // Phase 2: Visibility (NEW: Block-level visibility)
  showBlockTitle = true,
  showBlockDescription = true,
  showLeftColumn = true,
  showRightColumn = true,
  // Theme system
  theme,
  colorfulMode = false,
  themeSwapped = false,
  backgroundColor = '#FFFFFF',
  columnBackgroundColor,
  // Legacy/System
  isEmailMode = false
}: TwoColumnFeatureProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor);
  const blockTitleColorHex = colorValueToHex(blockTitleColor || getTextColor('primary'));
  const blockDescColorHex = colorValueToHex(blockDescriptionColor || getTextColor('secondary'));
  const titleColorHex = colorValueToHex(titleColor || getTextColor('primary'));
  const descColorHex = colorValueToHex(descriptionColor || getTextColor('secondary'));
  
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
  const effectiveBlockTitleColor = zoneFg || blockTitleColorHex;
  const effectiveBlockDescriptionColor = zoneFg || blockDescColorHex;
  const effectiveTitleColor = zoneFg || titleColorHex;
  const effectiveDescriptionColor = zoneFg || descColorHex;
  
  // Column background: Use theme's lightest shade (bg50) for subtle visual separation
  const effectiveColumnBackgroundColor = columnBackgroundColor 
    ? colorValueToHex(columnBackgroundColor)
    : (themeData?.[themeZone].bg50 || '#F8F9FA');
  
  const paddingValue = getPadding(padding);

  const containerStyle = {
    padding: paddingValue,
    backgroundColor: effectiveBackgroundColor
  };

  const columnStyle = {
    borderRadius: '8px',
    padding: '24px',
    backgroundColor: effectiveColumnBackgroundColor
  };

  // Calculate column widths based on visibility
  const bothVisible = showLeftColumn && showRightColumn;
  const columnWidth = bothVisible ? '48%' : '100%';

  // Column content styles
  const columnTitleStyle = {
    color: effectiveTitleColor,
    fontSize: getFontSize(titleSize),
    fontWeight: getFontWeight(titleWeight),
    marginBottom: getSpacing(titleDescriptionGap),
    lineHeight: '1.4',
    letterSpacing: '-0.01em',
    textAlign: contentAlign
  };

  const columnDescriptionStyle = {
    color: effectiveDescriptionColor,
    fontSize: getFontSize(descriptionSize),
    fontWeight: getFontWeight(descriptionWeight),
    lineHeight: '1.6',
    margin: 0,
    textAlign: contentAlign
  };

  return (
    <tr>
      <td style={containerStyle}>
        {/* === BLOCK HEADER SECTION === */}
        
        {/* Block Title - STANDARDIZED at top */}
        {shouldShow(showBlockTitle) && title && (
          <div style={{
            ...getBlockTitleStyles(blockTitleSize, blockTitleWeight, effectiveBlockTitleColor, isEmailMode),
            marginBottom: shouldShow(showBlockDescription) && description ? getSpacing(blockTitleDescriptionGap) : getSpacing(blockDescriptionContentGap),
            textAlign: contentAlign
          }}>
            {title}
          </div>
        )}
        
        {/* Block Description - STANDARDIZED after title */}
        {shouldShow(showBlockDescription) && description && (
          <div style={{
            ...getBlockDescriptionStyles(blockDescriptionSize, blockDescriptionWeight, effectiveBlockDescriptionColor, isEmailMode),
            marginBottom: getSpacing(blockDescriptionContentGap),
            textAlign: contentAlign
          }}>
            {renderTextWithLineBreaks(description)}
          </div>
        )}
        
        {/* === BLOCK CONTENT SECTION === */}
        
        {isEmailMode ? (
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {/* Left Column */}
                {shouldShow(showLeftColumn) && (
                  <td width={columnWidth} style={{
                    ...columnStyle,
                    verticalAlign: 'top'
                  }}>
                    <div style={columnTitleStyle}>
                      {leftColumn.title}
                    </div>
                    <div style={columnDescriptionStyle}>
                      {leftColumn.description}
                    </div>
                  </td>
                )}
                
                {/* Spacer - only show if both columns visible */}
                {bothVisible && <td width="4%"></td>}
                
                {/* Right Column */}
                {shouldShow(showRightColumn) && (
                  <td width={columnWidth} style={{
                    ...columnStyle,
                    verticalAlign: 'top'
                  }}>
                    <div style={columnTitleStyle}>
                      {rightColumn.title}
                    </div>
                    <div style={columnDescriptionStyle}>
                      {rightColumn.description}
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: bothVisible ? '1fr 1fr' : '1fr',
            gap: getSpacing(columnGap)
          }}>
            {/* Left Column */}
            {shouldShow(showLeftColumn) && (
              <div style={columnStyle}>
                <h3 style={{ ...columnTitleStyle, marginTop: 0 }}>
                  {leftColumn.title}
                </h3>
                <p style={columnDescriptionStyle}>
                  {leftColumn.description}
                </p>
              </div>
            )}
            
            {/* Right Column */}
            {shouldShow(showRightColumn) && (
              <div style={columnStyle}>
                <h3 style={{ ...columnTitleStyle, marginTop: 0 }}>
                  {rightColumn.title}
                </h3>
                <p style={columnDescriptionStyle}>
                  {rightColumn.description}
                </p>
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
});
TwoColumnFeature.displayName = 'TwoColumnFeature';