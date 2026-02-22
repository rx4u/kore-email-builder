// Code Snippet Component
// Use for: API examples, configuration snippets, code blocks

import React from 'react';
import { BADGE_STYLES, type BadgeType } from './badge-styles';
import { emailSafeStyle } from '../../lib/email-styles-converter';
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

interface CodeSnippetProps {
  // Core content
  title: string;
  description?: string;
  badge?: BadgeType;
  code: string;
  language?: string;
  
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
  descriptionCodeGap?: SpacingSize;
  titleCodeGap?: SpacingSize;
  
  // Phase 2: Visibility
  showTitle?: boolean;
  showDescription?: boolean;
  showBadge?: boolean;
  showLanguage?: boolean;
  languageLabelAlign?: 'left' | 'center' | 'right';
  
  // Theme system (Phase 3)
  theme?: string;
  backgroundColor?: ColorValue | ColorId | string;
  codeBackgroundColor?: ColorValue | ColorId | string;
  
  // Legacy/System
  isEmailMode?: boolean;
}

export const CodeSnippet = React.memo(({
  title,
  description,
  badge,
  code,
  language = 'javascript',
  // Phase 2: Layout
  padding = 'md',
  contentAlign = 'left',
  // Phase 2: Typography
  titleSize = 'xl',
  titleWeight = 'bold',
  titleColor,
  descriptionSize = 'sm',
  descriptionWeight = 'normal',
  descriptionColor,
  // Phase 2: Spacing
  titleDescriptionGap = 'md',
  descriptionCodeGap = 'lg',
  titleCodeGap = 'sm',
  // Phase 2: Visibility
  showTitle = true,
  showDescription = false,
  showBadge = true,
  showLanguage = true,
  languageLabelAlign = 'right',
  // Theme system
  theme,
  backgroundColor = '#F8FAFC',
  codeBackgroundColor,
  // Legacy/System
  isEmailMode = false
}: CodeSnippetProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor);
  const titleColorHex = colorValueToHex(titleColor || COLORS.primaryText);
  const descriptionColorHex = colorValueToHex(descriptionColor || COLORS.secondaryText);
  const codeBackgroundHex = colorValueToHex(codeBackgroundColor || { id: 'neutral-900' });
  
  // Apply theme colors if theme is set (using 'body' zone)
  const themeData = theme ? getThemeById(theme) : null;
  const effectiveBackgroundColor = themeData?.body.bg || bgColorHex;
  const effectiveTitleColor = themeData?.body.fg || titleColorHex;
  const effectiveDescriptionColor = themeData?.body.fg || descriptionColorHex;
  
  const paddingValue = getPadding(padding);
  const badgeStyle = badge ? BADGE_STYLES[badge] : null;

  const badgeInlineStyle = emailSafeStyle({
    backgroundColor: badgeStyle?.bg || COLORS.primary,
    color: badgeStyle?.color || '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'inline-block'
  }, isEmailMode);

  const containerStyle = {
    padding: paddingValue,
    backgroundColor: effectiveBackgroundColor
  };

  return (
    <tr>
      <td style={containerStyle}>
        {/* Badge - Standardized above title */}
        {shouldShow(showBadge) && badgeStyle && (
          <div style={{ marginBottom: '8px', textAlign: contentAlign }}>
            <span style={badgeInlineStyle}>
              {badgeStyle.text}
            </span>
          </div>
        )}
        
        {/* Title - STANDARDIZED */}
        {shouldShow(showTitle) && title && (
          <div style={{
            ...getBlockTitleStyles(titleSize, titleWeight, effectiveTitleColor, isEmailMode),
            marginBottom: shouldShow(showDescription) && description 
              ? getSpacing(titleDescriptionGap) 
              : getSpacing(titleCodeGap),
            textAlign: contentAlign
          }}>
            {title}
          </div>
        )}
        
        {/* Description - STANDARDIZED (NEW) */}
        {shouldShow(showDescription) && description && (
          <div style={{
            ...getBlockDescriptionStyles(descriptionSize, descriptionWeight, effectiveDescriptionColor, isEmailMode),
            marginBottom: getSpacing(descriptionCodeGap),
            textAlign: contentAlign
          }}>
            {description}
          </div>
        )}
        
        {/* Code Block - THEME-AWARE */}
        <div style={{
          backgroundColor: codeBackgroundHex,
          borderRadius: '8px',
          padding: '16px',
          overflow: 'auto'
        }}>
          <pre style={{
            margin: 0,
            fontFamily: "'Monaco', 'Menlo', 'Consolas', monospace",
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#E2E8F0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            <code>{renderTextWithLineBreaks(code)}</code>
          </pre>
        </div>
        
        {/* Language Label */}
        {shouldShow(showLanguage) && language && (
          <div style={{
            fontSize: '12px',
            color: COLORS.secondaryText,
            marginTop: '8px',
            textAlign: languageLabelAlign
          }}>
            {language}
          </div>
        )}
      </td>
    </tr>
  );
});
CodeSnippet.displayName = 'CodeSnippet';