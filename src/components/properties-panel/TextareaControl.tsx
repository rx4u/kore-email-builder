/**
 * TextareaControl
 * 
 * Standardized textarea component for property panels
 * Replaces raw Textarea usage with consistent styling and behavior
 */

import React from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface TextareaControlProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  className?: string;
}

export const TextareaControl = React.memo(({ 
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
  id,
  className = ''
}: TextareaControlProps) => {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <Label htmlFor={textareaId} className="text-sm">{label}</Label>
      <Textarea
        id={textareaId}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-none w-full"
      />
    </div>
  );
});
TextareaControl.displayName = 'TextareaControl';