/**
 * PropertySection
 *
 * Collapsible section for the Properties Panel.
 * Open/closed state is persisted in localStorage per (blockType, sectionId).
 * Falls back to the defaultOpen list from PropertySectionsContext.
 */

import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { usePropertySectionsContext } from './PropertySections';

interface PropertySectionProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
  spacing?: 'compact' | 'normal' | 'spacious';
  className?: string;
}

function getStorageKey(blockType: string | undefined, sectionId: string | undefined): string {
  const bt = blockType || 'default';
  const sid = sectionId || 'section';
  return `panel-section-${bt}-${sid}`;
}

export const PropertySection = React.memo(({
  id,
  icon: Icon,
  title,
  children,
  spacing = 'normal',
  className = '',
}: PropertySectionProps) => {
  const { defaultOpen, blockType } = usePropertySectionsContext();
  const isDefaultOpen = id ? defaultOpen.includes(id) : true;
  const storageKey = getStorageKey(blockType, id);

  const [open, setOpen] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored !== null ? stored === 'true' : isDefaultOpen;
    } catch {
      return isDefaultOpen;
    }
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={handleOpenChange}
      className={cn('w-full py-2', className)}
      id={id}
    >
      <Collapsible.Trigger asChild>
        <button
          className="w-full flex items-center justify-between gap-2 cursor-pointer bg-transparent border-none p-0 mb-1 group"
          aria-label={`Toggle ${title} section`}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform duration-150',
              open ? 'rotate-0' : '-rotate-90'
            )}
          />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content>
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
      </Collapsible.Content>
    </Collapsible.Root>
  );
});
PropertySection.displayName = 'PropertySection';
