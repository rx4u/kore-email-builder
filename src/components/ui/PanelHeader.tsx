/**
 * PanelHeader Component
 * 
 * Standardized header for all side panels in the email builder.
 * Provides consistent spacing, typography, and action placement.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from './card';
import { panelStandards } from '../../lib/design-tokens';

interface PanelHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function PanelHeader({
  title,
  description,
  icon: Icon,
  action,
  className = ''
}: PanelHeaderProps) {
  return (
    <CardHeader className={`flex-shrink-0 ${panelStandards.headerPaddingY} ${panelStandards.headerPaddingX} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className={`min-w-0 flex-1 flex items-center gap-2.5 ${description ? 'space-y-1.5' : ''}`}>
          {Icon && (
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 flex-shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm font-semibold tracking-tight">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs">{description}</CardDescription>
            )}
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </CardHeader>
  );
}