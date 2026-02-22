/**
 * PropertySection
 * 
 * Flat, always-visible section for Properties Panel
 * Part of Unified System (Phase 4+)
 * 
 * Key improvements:
 * - No accordion/collapsible behavior (always visible)
 * - Flat design (no borders by default)
 * - Simple header + content pattern
 * - Consistent icon + title
 * - Configurable spacing
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface PropertySectionProps {
  id?: string;                    // Optional for ref/key purposes
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
  // Visual customization
  spacing?: 'compact' | 'normal' | 'spacious';
  className?: string;
}

export const PropertySection = React.memo(({ 
  id, 
  icon: Icon, 
  title, 
  children,
  spacing = 'normal',
  className = ''
}: PropertySectionProps) => {
  return (
    <div className={cn('w-full py-2', className)} id={id}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <span className="font-semibold text-sm">{title}</span>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className={cn(
          'w-full mt-2',
          spacing === 'compact' && 'space-y-2',
          spacing === 'normal' && 'space-y-3',
          spacing === 'spacious' && 'space-y-4'
        )}
      >
        {children}
      </div>
    </div>
  );
});
PropertySection.displayName = 'PropertySection';