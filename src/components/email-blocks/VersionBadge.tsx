// Version/Date Badge Component
// Inspired by Zendesk's date badge
// Use for: Version numbers, release dates, event dates

import React from 'react';

export type VersionBadgeStyle = 
  | 'outlined'   // Zendesk-style: border only, transparent fill
  | 'filled'     // Solid background
  | 'accent';    // Brand color highlight

interface VersionBadgeProps {
  text: string;
  style?: VersionBadgeStyle;
  isEmailMode?: boolean;
  foregroundColor?: string; // Theme-aware text color
}

export const VersionBadge = React.memo(({ 
  text, 
  style = 'outlined',
  isEmailMode = false,
  foregroundColor = '#FFFFFF' // Default to white for backward compatibility
}: VersionBadgeProps) => {
  
  const getStyles = () => {
    switch (style) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: foregroundColor,
          border: `1.5px solid ${foregroundColor}40`, // 40 = 25% opacity in hex
          padding: '7px 14px'
        };
      case 'filled':
        return {
          backgroundColor: `${foregroundColor}33`, // 33 = 20% opacity in hex
          color: foregroundColor,
          border: 'none',
          padding: '8px 16px'
        };
      case 'accent':
        return {
          backgroundColor: '#FFFFFF',
          color: '#004EEB',
          border: 'none',
          padding: '8px 16px'
        };
    }
  };

  const badgeStyles = getStyles();

  return (
    <span style={{
      display: 'inline-block',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      letterSpacing: '0.01em',
      lineHeight: '1',
      verticalAlign: 'middle',
      ...badgeStyles
    }}>
      {text}
    </span>
  );
});
VersionBadge.displayName = 'VersionBadge';
