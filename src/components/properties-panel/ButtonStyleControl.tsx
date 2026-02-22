/**
 * ButtonStyleControl
 * 
 * A control for selecting button corner styles
 * Options: Rounded, Square, Pill
 */

import React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { CONTROL_SPACING, TRANSITION_STYLES } from '../../lib/control-spacing';

export type ButtonStyle = 'rounded' | 'square' | 'pill';

interface ButtonStyleOption {
  value: ButtonStyle;
  label: string;
  description?: string;
}

interface ButtonStyleControlProps {
  value: ButtonStyle;
  onChange: (value: ButtonStyle) => void;
  label?: string;
  options?: ButtonStyleOption[];
}

const DEFAULT_OPTIONS: ButtonStyleOption[] = [
  { value: 'rounded', label: 'Rounded', description: 'Rounded corners' },
  { value: 'square', label: 'Square', description: 'Square corners' },
  { value: 'pill', label: 'Pill', description: 'Fully rounded' }
];

export const ButtonStyleControl = React.memo(({ 
  value, 
  onChange, 
  label = 'Button Corners',
  options = DEFAULT_OPTIONS
}: ButtonStyleControlProps) => {
  return (
    <div className={`${CONTROL_SPACING.CONTROL_INTERNAL} w-full`}>
      <Label className="text-sm">{label}</Label>
      <div className="grid grid-cols-3 gap-2 w-full">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
            className={TRANSITION_STYLES.INTERACTIVE}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
});

ButtonStyleControl.displayName = 'ButtonStyleControl';