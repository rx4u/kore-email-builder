// STRUCTURAL BLOCK: Divider
// Email-safe horizontal divider with customizable color and style

import React from 'react';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { getBlockPadding, type PaddingSize } from '../../lib/block-utilities';
import { colorValueToHex, type ColorValue, type ColorId } from '../../lib/color-token-system';

export type DividerStyle = 'solid' | 'dashed' | 'dotted';
export type DividerThickness = 'thin' | 'medium' | 'thick';

interface DividerBlockProps {
  // Core content
  color?: ColorValue | ColorId | string;
  style?: DividerStyle;
  thickness?: DividerThickness;
  spacing?: 'compact' | 'normal' | 'spacious';
  
  // Phase 2: Layout
  padding?: PaddingSize;
  
  // Theme support - NEW
  theme?: string;
  
  // Legacy/System
  isEmailMode?: boolean;
}

// Predefined color options for the properties panel
export const DIVIDER_COLORS = [
  { value: '#E5E7EB', label: 'Light Gray' },
  { value: '#9CA3AF', label: 'Gray' },
  { value: '#6B7280', label: 'Dark Gray' },
  { value: '#004EEB', label: 'Brand Blue' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Orange' },
  { value: '#EF4444', label: 'Red' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#000000', label: 'Black' },
];

export const DividerBlock = React.memo(({ 
  color = '#E5E7EB',
  style = 'solid',
  thickness = 'thin',
  spacing = 'normal',
  // Phase 2: Layout
  padding,
  // Theme support
  theme,
  // Legacy/System
  isEmailMode = false
}: DividerBlockProps) => {
  // Convert ColorValue to hex for rendering
  const colorHex = colorValueToHex(color || '#E5E7EB');
  
  // Dividers should ALWAYS use their color prop, not theme colors
  // Theme foreground (fg) is for text, not decorative elements
  const lineColor = colorHex;
  
  // Map thickness to pixel values
  const thicknessMap = {
    thin: 1,
    medium: 2,
    thick: 3
  };

  // Use getBlockPadding to match other content blocks (white background + padding)
  // This gives consistent styling with proper horizontal/vertical padding
  const containerStyle = getBlockPadding(padding || 'md', isEmailMode);

  const lineStyle = emailSafeStyle({
    border: 'none',
    borderTop: `${thicknessMap[thickness]}px ${style} ${lineColor}`,
    margin: '0',
    height: '0',
    width: '100%',
  }, isEmailMode);

  return (
    <tr>
      <td style={containerStyle}>
        <hr style={lineStyle} />
      </td>
    </tr>
  );
});
DividerBlock.displayName = 'DividerBlock';