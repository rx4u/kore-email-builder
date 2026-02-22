/**
 * SelectControl
 * 
 * Generic select component for property panels
 * Base component for specialized selects (Padding, Badge, etc.)
 */

import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectControlProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  className?: string;
}

export const SelectControl = React.memo(({ 
  label,
  value,
  onChange,
  options,
  placeholder,
  id,
  className = ''
}: SelectControlProps) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : 'select');
  
  // Ensure we always have a valid string value for controlled component
  // Use nullish coalescing to preserve empty strings
  const controlledValue = value ?? (options[0]?.value ?? '');
  
  return (
    <div className={`space-y-2 w-full ${className}`}>
      {label && <Label htmlFor={selectId} className="text-sm">{label}</Label>}
      <Select value={controlledValue} onValueChange={onChange}>
        <SelectTrigger id={selectId} className="h-9 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
SelectControl.displayName = 'SelectControl';