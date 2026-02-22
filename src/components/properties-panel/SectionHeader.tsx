/**
 * SectionHeader
 * 
 * Standardized section header for properties panel
 * Provides consistent styling for section titles with optional icons
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { panelStandards } from '../../lib/design-tokens';

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  className?: string;
}

export const SectionHeader = React.memo(({ 
  icon: Icon, 
  title,
  className = ''
}: SectionHeaderProps) => {
  return (
    <div className={`flex items-center ${panelStandards.sectionHeaderGap} ${className}`}>
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <h4 className="text-sm font-semibold">{title}</h4>
    </div>
  );
});
SectionHeader.displayName = 'SectionHeader';
