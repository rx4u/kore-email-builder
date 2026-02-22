/**
 * TextInputControl
 * 
 * Standardized text input component for property panels
 * Replaces raw Input usage with consistent styling and behavior
 */

import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface TextInputControlProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'number';
  id?: string;
  className?: string;
}

export const TextInputControl = React.memo(({ 
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  id,
  className = ''
}: TextInputControlProps) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <Label htmlFor={inputId} className="text-sm">{label}</Label>
      <Input
        id={inputId}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full"
      />
    </div>
  );
});
TextInputControl.displayName = 'TextInputControl';