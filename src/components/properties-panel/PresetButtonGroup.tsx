/**
 * PresetButtonGroup
 *
 * A reusable control for selecting preset values (compact/standard/spacious, etc.)
 * Uses the same button-row pattern as WidthControl for reliable clicks and consistent UX.
 */

import React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { CONTROL_SPACING, TRANSITION_STYLES } from '../../lib/control-spacing';

export type PresetValue = 'compact' | 'standard' | 'spacious';

interface PresetOption {
  value: string;
  label: string;
  description?: string;
}

interface PresetButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options?: PresetOption[];
}

const DEFAULT_OPTIONS: PresetOption[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'standard', label: 'Standard' },
  { value: 'spacious', label: 'Spacious' }
];

export const PresetButtonGroup = React.memo(({
  value,
  onChange,
  label,
  options = DEFAULT_OPTIONS
}: PresetButtonGroupProps) => {
  return (
    <div className={`${CONTROL_SPACING.CONTROL_INTERNAL} w-full`}>
      <Label className="text-sm">{label}</Label>
      <div className="grid grid-cols-3 gap-2 w-full mt-1">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(option.value)}
              className={TRANSITION_STYLES.INTERACTIVE}
              aria-label={option.description ?? option.label}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

PresetButtonGroup.displayName = 'PresetButtonGroup';