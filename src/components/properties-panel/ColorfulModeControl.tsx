/**
 * ColorfulModeControl
 *
 * Toggle between body zone (white/neutral) and header zone (vibrant) colors.
 * When OFF: body zone. When ON: header zone (use header zone colors).
 */

import React from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ColorfulModeControlProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const ColorfulModeControl = React.memo(({
  checked,
  onChange,
  disabled,
  className = '',
}: ColorfulModeControlProps) => {
  return (
    <div className={`flex items-center justify-between gap-3 w-full ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col gap-0">
              <Label className="text-sm leading-tight">Use header zone colors</Label>
              <p className="text-xs text-muted-foreground m-0 leading-tight">
                Body zone when off; header zone when on
              </p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          Use the theme’s header colors (more saturated) instead of body colors for this block.
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
ColorfulModeControl.displayName = 'ColorfulModeControl';