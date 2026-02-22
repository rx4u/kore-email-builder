/**
 * BadgeSelectControl
 * 
 * Specialized select control for category badges
 * Used in Header properties
 */

import React from 'react';
import { SelectControl, SelectOption } from './SelectControl';

const BADGE_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'release-notes', label: 'Release Notes' },
  { value: 'feature-update', label: 'Feature Update' },
  { value: 'product-announcement', label: 'Product Announcement' },
  { value: 'security-update', label: 'Security Update' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'event', label: 'Event' },
];

interface BadgeSelectControlProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export const BadgeSelectControl = React.memo(({ 
  label = 'Category Badge',
  value,
  onChange,
  className = ''
}: BadgeSelectControlProps) => {
  const handleChange = (newValue: string) => {
    onChange(newValue === 'none' ? undefined : newValue);
  };
  
  return (
    <SelectControl
      label={label}
      value={value || 'none'}
      onChange={handleChange}
      options={BADGE_OPTIONS}
      className={className}
    />
  );
});
BadgeSelectControl.displayName = 'BadgeSelectControl';
