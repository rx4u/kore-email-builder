import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { cn } from '../ui/utils';

export interface SegmentedOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  title?: string;
}

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: SegmentedOption[];
  className?: string;
  /** Optional aria-label for the group when there is no external label element. */
  'aria-label'?: string;
}

/**
 * SegmentedControl
 *
 * Canonical segmented "choose one of N" control, backed by shadcn ToggleGroup.
 * Used for Alignment, Quick Styles presets, and any other segmented choices.
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  onChange,
  options,
  className,
  'aria-label': ariaLabel,
}) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val);
      }}
      variant="outline"
      size="default"
      className={cn('w-full', className)}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.title || option.label || option.value}
          className="flex-1"
        >
          {option.icon && (
            <span className={cn(option.label ? 'mr-1.5' : '')}>{option.icon}</span>
          )}
          {option.label && <span>{option.label}</span>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

