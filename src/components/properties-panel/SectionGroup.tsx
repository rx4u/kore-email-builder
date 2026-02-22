/**
 * SectionGroup
 *
 * Optional wrapper to group property panel sections under a logical label
 * (e.g. "Content & structure", "Layout & spacing", "Appearance").
 * Use with PANEL_SECTION_GROUPS from src/lib/panel-section-contract.ts.
 *
 * Renders a small label, optional divider, then children. Does not change
 * section order or behaviour.
 */

import React from 'react';
import { cn } from '../ui/utils';

interface SectionGroupProps {
  /** Label shown above the group (e.g. "Appearance"). */
  label: string;
  children: React.ReactNode;
  /** Show a divider above the label. Default true; set false for the first group in the panel. */
  showDivider?: boolean;
  className?: string;
}

export const SectionGroup = React.memo(function SectionGroup({
  label,
  children,
  showDivider = true,
  className = '',
}: SectionGroupProps) {
  return (
    <div className={cn('w-full pt-4', className)}>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
        {label}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
});
