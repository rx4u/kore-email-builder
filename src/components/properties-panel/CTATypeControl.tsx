/**
 * CTA Type Control
 * 
 * Dropdown selector for CTA button style
 * Options: Primary, Secondary, Tertiary, Outline, Link
 */

import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export type CTAType = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'link';

interface CTATypeControlProps {
  label?: string;
  value: CTAType;
  onChange: (value: CTAType) => void;
  disabled?: boolean;
}

interface CTAOption {
  value: CTAType;
  label: string;
}

const CTA_OPTIONS: CTAOption[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'tertiary', label: 'Tertiary' },
  { value: 'outline', label: 'Outline' },
  { value: 'link', label: 'Link' },
];

export const CTATypeControl = React.memo(({
  label = 'Button Type',
  value,
  onChange,
  disabled = false,
}: CTATypeControlProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CTA_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
CTATypeControl.displayName = 'CTATypeControl';
