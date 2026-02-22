/**
 * PropertyGroup
 * 
 * Groups related controls within a PropertySection
 * Used for sub-sections like "Layout" and "Spacing" within "Layout & Spacing"
 * 
 * Features:
 * - Optional title (shown as small uppercase label)
 * - Optional separator above group
 * - Configurable spacing between controls
 */

import React from 'react';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';

interface PropertyGroupProps {
  title?: string;               // Optional sub-section title
  children: React.ReactNode;
  separator?: boolean;          // Show separator above group
  spacing?: 'compact' | 'normal' | 'spacious';
  className?: string;
}

export const PropertyGroup = React.memo(({ 
  title, 
  children, 
  separator = false,
  spacing = 'normal',
  className = ''
}: PropertyGroupProps) => {
  return (
    <>
      {separator && <Separator className="my-3" />}
      
      <div className={cn(
        'w-full',
        spacing === 'compact' && 'space-y-2',
        spacing === 'normal' && 'space-y-2.5',
        spacing === 'spacious' && 'space-y-3',
        className
      )}>
        {title && (
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            {title}
          </Label>
        )}
        {children}
      </div>
    </>
  );
});
PropertyGroup.displayName = 'PropertyGroup';