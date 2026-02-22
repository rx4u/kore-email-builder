/**
 * ContentBadgeSelectControl
 * 
 * Specialized select control for CONTENT BLOCK badges
 * (NEW, UPDATED, BETA, IMPROVED, ENTERPRISE, INCLUDED)
 * 
 * Used in: Feature blocks, Text blocks, etc.
 * NOT for Header - Header uses BadgeSelectControl (Category Badges)
 */

import React from 'react';
import { SelectControl, SelectOption } from './SelectControl';

const CONTENT_BADGE_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'new', label: 'NEW' },
  { value: 'updated', label: 'UPDATED' },
  { value: 'beta', label: 'BETA' },
  { value: 'improved', label: 'IMPROVED' },
  { value: 'enterprise', label: 'ENTERPRISE' },
  { value: 'included', label: 'INCLUDED' },
];

interface ContentBadgeSelectControlProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
  hideLabel?: boolean;
}

export const ContentBadgeSelectControl = React.memo(({ 
  label = 'Badge',
  value,
  onChange,
  className = '',
  hideLabel = false
}: ContentBadgeSelectControlProps) => {
  const handleChange = (newValue: string) => {
    onChange(newValue === 'none' ? undefined : newValue);
  };
  
  return (
    <SelectControl
      label={hideLabel ? undefined : label}
      value={value || 'none'}
      onChange={handleChange}
      options={CONTENT_BADGE_OPTIONS}
      className={className}
    />
  );
});
ContentBadgeSelectControl.displayName = 'ContentBadgeSelectControl';
