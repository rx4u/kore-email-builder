/**
 * ToggleControl
 *
 * Standardized switch/toggle for property panels. Switch on left (easy to tap),
 * label on right. Row height matches other controls (min-h-9). Label matches
 * other panel labels (text-sm font-medium).
 */

import React from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

interface ToggleControlProps {
  label: string;
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  /** When false, label on left and switch on right (legacy). Default true = switch on left. */
  switchOnLeft?: boolean;
}

export const ToggleControl = React.memo(({
  label,
  checked,
  onChange,
  id,
  className = '',
  switchOnLeft = true,
}: ToggleControlProps) => {
  const switchId = id || `switch-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const switchEl = (
    <Switch
      id={switchId}
      checked={checked ?? true}
      onCheckedChange={onChange}
    />
  );
  const labelEl = (
    <Label htmlFor={switchId} className="text-sm font-medium mb-0 flex-shrink-0 cursor-pointer">
      {label}
    </Label>
  );

  return (
    <div
      className={`flex items-center min-h-9 gap-3 w-full ${switchOnLeft ? '' : 'justify-between'} ${className}`}
    >
      {switchOnLeft ? (
        <>
          {switchEl}
          {labelEl}
        </>
      ) : (
        <>
          {labelEl}
          {switchEl}
        </>
      )}
    </div>
  );
});
ToggleControl.displayName = 'ToggleControl';