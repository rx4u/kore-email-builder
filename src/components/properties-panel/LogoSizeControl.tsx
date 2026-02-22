import React from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CONTROL_SPACING, TRANSITION_STYLES } from '../../lib/control-spacing';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

export const LOGO_SIZE_MAP: Record<Exclude<LogoSize, 'custom'>, number> = {
  sm: 60,
  md: 80,
  lg: 120,
  xl: 160
};

interface LogoSizeControlProps {
  value: LogoSize;
  customValue?: number;
  onChange: (size: LogoSize, customValue?: number) => void;
  label?: string;
}

export const LogoSizeControl = React.memo(({ 
  value, 
  customValue = 80,
  onChange, 
  label = "Logo Size" 
}: LogoSizeControlProps) => {
  const [localCustom, setLocalCustom] = React.useState(customValue);

  const handleSizeChange = (size: LogoSize) => {
    if (size === 'custom') {
      onChange(size, localCustom);
    } else {
      onChange(size, undefined);
    }
  };

  const handleCustomChange = (newValue: number) => {
    setLocalCustom(newValue);
    if (value === 'custom') {
      onChange('custom', newValue);
    }
  };

  return (
    <div className={CONTROL_SPACING.CONTROL_INTERNAL}>
      <Label className="text-sm">{label}</Label>
      
      {/* Preset size buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        <Button
          type="button"
          variant={value === 'sm' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSizeChange('sm')}
          className={`h-auto py-2 px-2 flex flex-col items-center gap-0.5 ${TRANSITION_STYLES.INTERACTIVE}`}
        >
          <span className="text-xs font-semibold">SM</span>
          <span className="text-xs opacity-70">60px</span>
        </Button>
        <Button
          type="button"
          variant={value === 'md' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSizeChange('md')}
          className={`h-auto py-2 px-2 flex flex-col items-center gap-0.5 ${TRANSITION_STYLES.INTERACTIVE}`}
        >
          <span className="text-xs font-semibold">MD</span>
          <span className="text-xs opacity-70">80px</span>
        </Button>
        <Button
          type="button"
          variant={value === 'lg' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSizeChange('lg')}
          className={`h-auto py-2 px-2 flex flex-col items-center gap-0.5 ${TRANSITION_STYLES.INTERACTIVE}`}
        >
          <span className="text-xs font-semibold">LG</span>
          <span className="text-xs opacity-70">120px</span>
        </Button>
        <Button
          type="button"
          variant={value === 'xl' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSizeChange('xl')}
          className={`h-auto py-2 px-2 flex flex-col items-center gap-0.5 ${TRANSITION_STYLES.INTERACTIVE}`}
        >
          <span className="text-xs font-semibold">XL</span>
          <span className="text-xs opacity-70">160px</span>
        </Button>
      </div>
    </div>
  );
});
LogoSizeControl.displayName = 'LogoSizeControl';

// Helper function to migrate from old logoWidth to new logoSize system
export function migrateLogoWidth(width?: number): { size: LogoSize; custom?: number } {
  if (!width) return { size: 'md' };
  if (width <= 60) return { size: 'sm' };
  if (width <= 80) return { size: 'md' };
  if (width <= 120) return { size: 'lg' };
  if (width <= 160) return { size: 'xl' };
  return { size: 'custom', custom: width };
}

// Helper function to get actual pixel value from logo size
export function getLogoPixelValue(size: LogoSize, customValue?: number): number {
  if (size === 'custom' && customValue) return customValue;
  if (size === 'custom') return 80; // fallback
  return LOGO_SIZE_MAP[size];
}