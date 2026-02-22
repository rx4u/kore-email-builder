import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface SpacingControlProps {
  value: SpacingSize;
  onChange: (value: SpacingSize) => void;
  label?: string;
  includeNone?: boolean;
  includeXXL?: boolean;
}

export const SpacingControl = React.memo(({ 
  value, 
  onChange, 
  label = "Spacing",
  includeNone = false,
  includeXXL = false
}: SpacingControlProps) => {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Select 
        value={value || 'md'}
        onValueChange={(v) => onChange(v as SpacingSize)}
      >
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {includeNone && <SelectItem value="none">None (0px)</SelectItem>}
          <SelectItem value="xs">Tiny (4px)</SelectItem>
          <SelectItem value="sm">Small (8px)</SelectItem>
          <SelectItem value="md">Medium (12px)</SelectItem>
          <SelectItem value="lg">Large (16px)</SelectItem>
          <SelectItem value="xl">XL (24px)</SelectItem>
          {includeXXL && <SelectItem value="xxl">XXL (32px)</SelectItem>}
        </SelectContent>
      </Select>
    </div>
  );
});
SpacingControl.displayName = 'SpacingControl';
