import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FontSize, FONT_SIZE_SCALE } from '../../lib/typography-scales';

interface FontSizeControlProps {
  value: FontSize | number;
  onChange: (value: FontSize | number) => void;
  label?: string;
  min?: number;
  max?: number;
}

// Convert number to closest semantic token
function numberToFontSize(num: number): FontSize {
  if (num <= 12) return 'xs';
  if (num <= 14) return 'sm';
  if (num <= 16) return 'base';
  if (num <= 18) return 'lg';
  if (num <= 20) return 'xl';
  if (num <= 22) return '2xl';
  if (num <= 26) return '3xl';
  return '4xl';
}

// Convert semantic token to number
function fontSizeToNumber(size: FontSize): number {
  return parseInt(FONT_SIZE_SCALE[size]);
}

export const FontSizeControl = React.memo(({ 
  value, 
  onChange, 
  label = "Font Size"
}: FontSizeControlProps) => {
  const semanticValue: FontSize = typeof value === 'number' ? numberToFontSize(value) : (value || 'base');
  
  const handleChange = (newSize: FontSize) => {
    if (typeof value === 'number') {
      onChange(fontSizeToNumber(newSize));
    } else {
      onChange(newSize);
    }
  };
  
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Select value={semanticValue} onValueChange={handleChange}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="xs">Extra Small (12px)</SelectItem>
          <SelectItem value="sm">Small (14px)</SelectItem>
          <SelectItem value="base">Base (16px)</SelectItem>
          <SelectItem value="lg">Large (18px)</SelectItem>
          <SelectItem value="xl">Extra Large (20px)</SelectItem>
          <SelectItem value="2xl">Heading (22px)</SelectItem>
          <SelectItem value="3xl">Large Heading (26px)</SelectItem>
          <SelectItem value="4xl">Hero (32px)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});
FontSizeControl.displayName = 'FontSizeControl';
