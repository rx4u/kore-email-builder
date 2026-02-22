/**
 * PanelHeader Component
 * 
 * Standardized header for all side panels in the email builder.
 * Provides consistent spacing, typography, and action placement.
 */

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from './card';
import { panelStandards } from '../../lib/design-tokens';

interface PanelHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PanelHeader({ 
  title, 
  description, 
  action,
  className = ''
}: PanelHeaderProps) {
  return (
    <CardHeader className={`flex-shrink-0 ${panelStandards.headerPaddingY} ${panelStandards.headerPaddingX} ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className={`min-w-0 flex-1 ${description ? 'space-y-1.5' : ''}`}>
          <CardTitle className="text-base tracking-tight">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
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