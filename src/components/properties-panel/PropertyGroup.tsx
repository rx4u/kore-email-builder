import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight } from 'lucide-react';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';
import { usePropertySectionsContext } from './PropertySections';

interface PropertyGroupProps {
  title?: string;
  children: React.ReactNode;
  separator?: boolean;
  spacing?: 'compact' | 'normal' | 'spacious';
  className?: string;
}

function getGroupStorageKey(blockType: string | undefined, title: string | undefined): string {
  const bt = blockType || 'default';
  const g = title || 'group';
  return `panel-group-${bt}-${g}`;
}

export const PropertyGroup = React.memo(({
  title,
  children,
  separator = false,
  spacing = 'normal',
  className = '',
}: PropertyGroupProps) => {
  const { blockType } = usePropertySectionsContext();

  // All hooks must be called unconditionally (Rules of Hooks)
  const storageKey = getGroupStorageKey(blockType, title);

  const [open, setOpen] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
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

  if (!title) {
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
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      {separator && <Separator className="my-3" />}
      <Collapsible.Root
        open={open}
        onOpenChange={handleOpenChange}
        className={cn('w-full', className)}
      >
        <Collapsible.Trigger asChild>
          <button
            className="w-full flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 mb-1 group"
            aria-label={`Toggle ${title} group`}
          >
            <ChevronRight
              className={cn(
                'w-3 h-3 text-muted-foreground transition-transform duration-150',
                open && 'rotate-90'
              )}
            />
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              {title}
            </span>
          </button>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <div className={cn(
            'w-full',
            spacing === 'compact' && 'space-y-2',
            spacing === 'normal' && 'space-y-2.5',
            spacing === 'spacious' && 'space-y-3',
          )}>
            {children}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
});
PropertyGroup.displayName = 'PropertyGroup';
