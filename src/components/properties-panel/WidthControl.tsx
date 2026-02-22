/**
 * WidthControl
 * 
 * A control for selecting email width from preset options
 * Displays pixel values with active state indication
 */

import React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { CONTROL_SPACING, TRANSITION_STYLES } from '../../lib/control-spacing';

export type EmailWidth = '560px' | '600px' | '640px';

interface WidthControlProps {
  value: EmailWidth;
  onChange: (value: EmailWidth) => void;
  label?: string;
  options?: EmailWidth[];
}

const DEFAULT_OPTIONS: EmailWidth[] = ['560px', '600px', '640px'];

export const WidthControl = React.memo(({ 
  value, 
  onChange, 
  label = 'Email Width',
  options = DEFAULT_OPTIONS
}: WidthControlProps) => {
  return (
    <div className={`${CONTROL_SPACING.CONTROL_INTERNAL} w-full`}>
      <Label className="text-sm">{label}</Label>
      <div className="grid grid-cols-3 gap-2 w-full">
        {options.map((width) => {
          const isActive = value === width;
          return (
            <Button
              key={width}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(width)}
              className={TRANSITION_STYLES.INTERACTIVE}
            >
              {width}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

WidthControl.displayName = 'WidthControl';