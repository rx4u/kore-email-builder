// Video/Media Block Component
// Use for: Video thumbnails, embedded media, video announcements

import React from 'react';
import { Play } from 'lucide-react';
import { BADGE_STYLES, type BadgeType } from './badge-styles';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { COLORS } from './email-styles';
import { iconSizes } from '../../lib/design-tokens';
import { 
  getPadding, 
  getSpacing, 
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
import { type ImageRadiusStyle } from '../../lib/global-theme';
import { renderTextWithLineBreaks } from '../../lib/text-rendering-utils';

interface VideoBlockProps {
  // Core content
  title: string;
  badge?: BadgeType;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: string;
  
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
  thumbnailTextGap?: SpacingSize;
  titleDescriptionGap?: SpacingSize;
  
  // Phase 2: Visibility
  showTitle?: boolean;
  showBadge?: boolean;
  showDescription?: boolean;
  showDuration?: boolean;
  
  // Theme system (Phase 3)
  theme?: string;
  backgroundColor?: ColorValue | ColorId | string;
  
  // Legacy/System
  isEmailMode?: boolean;
}

export const VideoBlock = React.memo(({
  title,
  badge,
  description,
  thumbnailUrl,
  videoUrl = '#',
  duration,
  // Phase 2: Layout
  padding = 'md',
  contentAlign = 'left',
  // Phase 2: Typography
  titleSize = '2xl',
  titleWeight = 'semibold',
  titleColor,
  descriptionSize = 'sm',
  descriptionWeight = 'normal',
  descriptionColor,
  // Phase 2: Spacing
  thumbnailTextGap = 'lg',
  titleDescriptionGap = 'sm',
  // Phase 2: Visibility
  showTitle = true,
  showBadge = true,
  showDescription = true,
  showDuration = true,
  // Theme system
  theme,
  backgroundColor = '#FFFFFF',
  // Legacy/System
  isEmailMode = false
}: VideoBlockProps) => {
  // Convert ColorValue to hex for rendering
  const bgColorHex = colorValueToHex(backgroundColor);
  const titleColorHex = colorValueToHex(titleColor || COLORS.primaryText);
  const descColorHex = colorValueToHex(descriptionColor || COLORS.secondaryText);
  
  // Apply theme colors if theme is set (using 'body' zone)
  const themeData = theme ? getThemeById(theme) : null;
  const effectiveBackgroundColor = themeData?.body.bg || bgColorHex;
  const effectiveTitleColor = themeData?.body.fg || titleColorHex;
  const effectiveDescriptionColor = themeData?.body.fg || descColorHex;
  
  const paddingValue = getPadding(padding);
  const badgeStyle = badge ? BADGE_STYLES[badge] : null;

  // Standardized styles using block utilities
  const titleStyle = {
    ...getBlockTitleStyles(titleSize, titleWeight, effectiveTitleColor, isEmailMode),
    marginBottom: shouldShow(showDescription) ? getSpacing(titleDescriptionGap) : '0',
    textAlign: contentAlign
  };

  const descriptionStyle = {
    ...getBlockDescriptionStyles(descriptionSize, descriptionWeight, effectiveDescriptionColor, isEmailMode),
    textAlign: contentAlign
  };

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

  const defaultThumbnail = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80';

  return (
    <tr>
      <td style={containerStyle}>
        {/* === BLOCK HEADER SECTION === */}
        
        {/* Badge - Standardized above title */}
        {shouldShow(showBadge) && badgeStyle && (
          <div style={{ marginBottom: '8px', textAlign: contentAlign }}>
            <span style={badgeInlineStyle}>
              {badgeStyle.text}
            </span>
          </div>
        )}
        
        {/* Title - STANDARDIZED at top */}
        {shouldShow(showTitle) && (
          <div style={titleStyle}>
            {title}
          </div>
        )}
        
        {/* Description - STANDARDIZED after title */}
        {shouldShow(showDescription) && (
          <div style={descriptionStyle}>
            {renderTextWithLineBreaks(description)}
          </div>
        )}
        
        {/* === BLOCK CONTENT SECTION === */}
        
        {/* Video Thumbnail */}
        <div style={{ 
          position: 'relative',
          marginTop: (shouldShow(showBadge) || shouldShow(showTitle) || shouldShow(showDescription)) ? getSpacing(thumbnailTextGap) : '0'
        }}>
          <a href={videoUrl} style={{ display: 'block', textDecoration: 'none' }}>
            <img 
              src={thumbnailUrl || defaultThumbnail} 
              alt={title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                display: 'block'
              }}
            />
            {/* Play Button Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '64px',
              height: '64px',
              backgroundColor: '#004eebe6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Play size={isEmailMode ? 28 : iconSizes.lg} style={{ color: '#FFFFFF', marginLeft: '4px' }} />
            </div>
            {shouldShow(showDuration) && duration && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: '#000000bf',
                color: '#FFFFFF',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {duration}
              </div>
            )}
          </a>
        </div>
      </td>
    </tr>
  );
});
VideoBlock.displayName = 'VideoBlock';