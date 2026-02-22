/**
 * ThemeSwapControl
 *
 * Toggle to swap background and text colors of the selected theme (fg/bg swap).
 */

import React from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { ArrowRightLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ThemeSwapControlProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const ThemeSwapControl = React.memo(({
  checked,
  onChange,
  disabled,
  className = '',
}: ThemeSwapControlProps) => {
  return (
    <div className={`flex items-center justify-between gap-3 w-full ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col gap-0">
              <Label className="text-sm leading-tight">Swap background and text colors</Label>
              <p className="text-xs text-muted-foreground m-0 leading-tight">
                Invert theme background and foreground
              </p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          Use the theme’s text color as background and background as text color.
        </TooltipContent>
      </Tooltip>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
});
ThemeSwapControl.displayName = 'ThemeSwapControl';