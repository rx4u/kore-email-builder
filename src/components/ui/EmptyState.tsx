/**
 * EmptyState Component
 * 
 * Displays helpful messages when content is empty.
 * Used for empty block lists, no selection states, etc.
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { LucideIcon } from 'lucide-react';
import { cn } from './utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export const EmptyState = React.memo(({ 
  icon: Icon, 
  title, 
  description,
  className = '',
  children
}: EmptyStateProps) => {
  return (
    <Alert className={cn("border-dashed border-2 bg-muted/30", className)}>
      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      <AlertTitle className="text-base">{title}</AlertTitle>
      <AlertDescription className="text-sm">{description}</AlertDescription>
      {children}
    </Alert>
  );
});
EmptyState.displayName = 'EmptyState';
