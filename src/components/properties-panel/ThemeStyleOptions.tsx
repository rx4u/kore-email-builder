/**
 * ThemeStyleOptions – shared group for "Colorful mode" and "Colors swapped"
 *
 * Renders both theme-style controls with a single section label so the panel
 * doesn’t repeat the same two checkboxes in every theme-aware block (see THEME_AND_COLOR_AUDIT.md).
 */

import React from 'react';
import { ColorfulModeControl } from './ColorfulModeControl';
import { ThemeSwapControl } from './ThemeSwapControl';

export interface ThemeStyleOptionsProps {
  colorfulMode: boolean;
  themeSwapped: boolean;
  onColorfulChange: (checked: boolean) => void;
  onSwapChange: (checked: boolean) => void;
  className?: string;
}

export const ThemeStyleOptions = React.memo(({
  colorfulMode,
  themeSwapped,
  onColorfulChange,
  onSwapChange,
  className = '',
}: ThemeStyleOptionsProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
        Theme style
      </div>
      <ColorfulModeControl
        checked={colorfulMode}
        onChange={onColorfulChange}
      />
      <ThemeSwapControl
        checked={themeSwapped}
        onChange={onSwapChange}
      />
    </div>
  );
});
ThemeStyleOptions.displayName = 'ThemeStyleOptions';
