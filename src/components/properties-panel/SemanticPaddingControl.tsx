/**
 * SemanticPaddingControl
 * 
 * Select control for semantic padding values with pixel measurements
 * Handles legacy values (xs, sm, md, lg, xl, xxl) and maps to new semantic values
 */

import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Map legacy values to new semantic values
const LEGACY_TO_SEMANTIC: Record<string, string> = {
  'xs': 'compact',
  'sm': 'compact',
  'md': 'standard',
  'lg': 'spacious',
  'xl': 'spacious',
  'xxl': 'spacious',
};

interface SemanticPaddingControlProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

export const SemanticPaddingControl = React.memo(({ 
  label = 'Padding',
  value,
  onChange,
  className = ''
}: SemanticPaddingControlProps) => {
  // Convert legacy value to semantic value for display
  const displayValue = value 
    ? (LEGACY_TO_SEMANTIC[value] || value)
    : 'standard';
  
  return (
    <div className={className}>
      <Label className="text-sm">{label}</Label>
      <Select value={displayValue} onValueChange={onChange}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select padding" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (0px)</SelectItem>
          <SelectItem value="compact">Compact (16px)</SelectItem>
          <SelectItem value="standard">Standard (24px)</SelectItem>
          <SelectItem value="spacious">Spacious (32px)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});
SemanticPaddingControl.displayName = 'SemanticPaddingControl';
