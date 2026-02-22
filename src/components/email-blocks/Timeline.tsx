// Timeline Component
// Use for: Sequential updates, roadmap items, chronological events

import React from 'react';
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
import { getThemeById } from '../../lib/theme-catalog';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  // Core content (NEW: Block-level title and description)
  title?: string;
  description?: string;
  items: TimelineItem[];
  
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
  // Item-level typography
  dateSize?: FontSize;
  dateWeight?: FontWeight;
  dateColor?: ColorValue | ColorId | string;
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  titleColor?: ColorValue | ColorId | string;
  descriptionSize?: FontSize;
  descriptionWeight?: FontWeight;
  descriptionColor?: ColorValue | ColorId | string;
  
  // Phase 2: Spacing
  titleDescriptionGap?: SpacingSize;
  descriptionContentGap?: SpacingSize;
  itemSpacing?: SpacingSize;
  dateGap?: SpacingSize;
  titleGap?: SpacingSize;
  
  // Phase 2: Visibility (NEW: Block-level visibility)
  showBlockTitle?: boolean;
  showBlockDescription?: boolean;
  showDates?: boolean;
  
  // Theme system (Phase 3)
  theme?: string;
  backgroundColor?: ColorValue | ColorId | string;
  
  // Legacy/System
  isEmailMode?: boolean;
}

export const Timeline = React.memo(({
  title,
  description,
  items,
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
  // Item-level typography
  dateSize = 'xs',
  dateWeight = 'semibold',
  dateColor,
  titleSize = 'lg',
  titleWeight = 'semibold',
  titleColor,
  descriptionSize = 'sm',
  descriptionWeight = 'normal',
  descriptionColor,
  // Phase 2: Spacing
  titleDescriptionGap = 'md',
  descriptionContentGap = 'md',
  itemSpacing = 'xl',
  dateGap = 'xs',
  titleGap = 'sm',
  // Phase 2: Visibility (NEW: Block-level visibility)
  showBlockTitle = true,
  showBlockDescription = true,
  showDates = true,
  // Theme system
  theme,
  backgroundColor = '#FFFFFF',
  // Legacy/System
  isEmailMode = false
}: TimelineProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor);
  const blockTitleColorHex = colorValueToHex(blockTitleColor || COLORS.primaryText);
  const blockDescColorHex = colorValueToHex(blockDescriptionColor || COLORS.secondaryText);
  const dateColorHex = colorValueToHex(dateColor || COLORS.primary);
  const titleColorHex = colorValueToHex(titleColor || COLORS.primaryText);
  const descColorHex = colorValueToHex(descriptionColor || COLORS.secondaryText);
  
  // Apply theme colors if theme is set (using 'body' zone)
  const themeData = theme ? getThemeById(theme) : null;
  const effectiveBackgroundColor = themeData?.body.bg || bgColorHex;
  const effectiveBlockTitleColor = themeData?.body.fg || blockTitleColorHex;
  const effectiveBlockDescriptionColor = themeData?.body.fg || blockDescColorHex;
  // Use theme header color for dates/accents, fall back to custom or brand primary
  const effectiveDateColor = themeData?.header.bg || dateColorHex;
  const effectiveTitleColor = themeData?.body.fg || titleColorHex;
  const effectiveDescriptionColor = themeData?.body.fg || descColorHex;
  
  // Timeline visuals: Use theme accent color for dots, subtle line
  const timelineDotColor = effectiveDateColor;
  const timelineLineColor = themeData?.body.fg ? `${themeData.body.fg}1A` : '#E2E8F0'; // 1A = 10% opacity
  
  const paddingValue = getPadding(padding);
  const titleAlignStyles = getAlignmentStyles(contentAlign, isEmailMode);
  const descriptionAlignStyles = getAlignmentStyles(contentAlign, isEmailMode);

  const containerStyle = {
    padding: paddingValue,
    backgroundColor: effectiveBackgroundColor
  };

  return (
    <tr>
      <td style={containerStyle}>
        {/* === BLOCK HEADER SECTION === */}
        
        {/* Block Title - STANDARDIZED at top */}
        {shouldShow(showBlockTitle) && title && (
          <div style={{
            ...getBlockTitleStyles(blockTitleSize, blockTitleWeight, effectiveBlockTitleColor, isEmailMode),
            marginBottom: shouldShow(showBlockDescription) && description ? getSpacing(titleDescriptionGap) : getSpacing(descriptionContentGap),
            textAlign: contentAlign
          }}>
            {title}
          </div>
        )}
        
        {/* Block Description - STANDARDIZED after title */}
        {shouldShow(showBlockDescription) && description && (
          <div style={{
            ...getBlockDescriptionStyles(blockDescriptionSize, blockDescriptionWeight, effectiveBlockDescriptionColor, isEmailMode),
            marginBottom: getSpacing(descriptionContentGap),
            textAlign: contentAlign
          }}>
            {description}
          </div>
        )}
        
        {/* === BLOCK CONTENT SECTION === */}
        
        {/* Timeline Items */}
        {items.map((item, index) => (
          <table 
            key={index}
            cellPadding="0" 
            cellSpacing="0" 
            border={0} 
            style={{ 
              width: '100%',
              marginBottom: index < items.length - 1 ? getSpacing(itemSpacing) : '0'
            }}
          >
            <tbody>
              <tr>
                {contentAlign === 'right' ? (
                  <>
                    {/* Content (Right-aligned: content first) */}
                    <td style={{ paddingRight: '16px', paddingBottom: '8px', verticalAlign: 'top', textAlign: 'right' }}>
                      {shouldShow(showDates) && (
                        <div style={{
                          color: dateColor || '#004EEB',
                          fontSize: getFontSize(dateSize),
                          fontWeight: getFontWeight(dateWeight),
                          marginBottom: getSpacing(dateGap),
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase'
                        }}>
                          {item.date}
                        </div>
                      )}
                      <div style={{
                        color: titleColor || getTextColor('primary'),
                        fontSize: getFontSize(titleSize),
                        fontWeight: getFontWeight(titleWeight),
                        marginBottom: getSpacing(titleGap)
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        color: descriptionColor || getTextColor('secondary'),
                        fontSize: getFontSize(descriptionSize),
                        fontWeight: getFontWeight(descriptionWeight),
                        lineHeight: '1.6'
                      }}>
                        {renderTextWithLineBreaks(item.description)}
                      </div>
                    </td>
                    
                    {/* Timeline Line & Dot (Right-aligned: dot on right) */}
                    <td style={{ width: '20px', position: 'relative', paddingTop: '2px', verticalAlign: 'top' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: timelineDotColor,
                        borderRadius: '50%',
                        marginRight: '4px',
                        marginLeft: 'auto'
                      }}></div>
                      {index < items.length - 1 && (
                        <div style={{
                          width: '2px',
                          backgroundColor: timelineLineColor,
                          marginRight: '9px',
                          marginLeft: 'auto',
                          marginTop: '8px',
                          minHeight: '40px',
                          height: '100%',
                          position: 'absolute',
                          right: '4px'
                        }}></div>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    {/* Timeline Line & Dot (Left-aligned: dot on left) */}
                    <td style={{ width: '20px', position: 'relative', paddingTop: '2px', verticalAlign: 'top' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: timelineDotColor,
                        borderRadius: '50%',
                        marginLeft: '4px'
                      }}></div>
                      {index < items.length - 1 && (
                        <div style={{
                          width: '2px',
                          backgroundColor: timelineLineColor,
                          marginLeft: '9px',
                          marginTop: '8px',
                          minHeight: '40px',
                          height: '100%',
                          position: 'absolute'
                        }}></div>
                      )}
                    </td>
                    
                    {/* Content (Left-aligned: content after dot) */}
                    <td style={{ paddingLeft: '16px', paddingBottom: '8px', verticalAlign: 'top' }}>
                      {shouldShow(showDates) && (
                        <div style={{
                          color: dateColor || '#004EEB',
                          fontSize: getFontSize(dateSize),
                          fontWeight: getFontWeight(dateWeight),
                          marginBottom: getSpacing(dateGap),
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase'
                        }}>
                          {item.date}
                        </div>
                      )}
                      <div style={{
                        color: titleColor || getTextColor('primary'),
                        fontSize: getFontSize(titleSize),
                        fontWeight: getFontWeight(titleWeight),
                        marginBottom: getSpacing(titleGap)
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        color: descriptionColor || getTextColor('secondary'),
                        fontSize: getFontSize(descriptionSize),
                        fontWeight: getFontWeight(descriptionWeight),
                        lineHeight: '1.6'
                      }}>
                        {renderTextWithLineBreaks(item.description)}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        ))}
      </td>
    </tr>
  );
});
Timeline.displayName = 'Timeline';