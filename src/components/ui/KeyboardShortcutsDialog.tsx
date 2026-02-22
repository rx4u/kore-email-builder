/**
 * KeyboardShortcutsDialog Component
 * 
 * Displays all available keyboard shortcuts in a dialog
 * Accessible and user-friendly reference
 * 
 * Part of Phase 1: Accessibility Enhancement
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { Keyboard } from 'lucide-react';

interface ShortcutItem {
  display: string;
  description: string;
  category?: string;
}

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: ShortcutItem[];
}

/**
 * Keyboard shortcuts help dialog
 * 
 * Usage:
 * ```tsx
 * const shortcuts = getAllShortcuts(myShortcuts);
 * <KeyboardShortcutsDialog 
 *   open={showHelp}
 *   onOpenChange={setShowHelp}
 *   shortcuts={shortcuts}
 * />
 * ```
 */
export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
  shortcuts,
}: KeyboardShortcutsDialogProps) {
  // Group shortcuts by category
  const categorized = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutItem[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl"
        aria-describedby="keyboard-shortcuts-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription id="keyboard-shortcuts-description">
            Use these keyboard shortcuts to work faster and more efficiently
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {Object.entries(categorized).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{item.description}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.display}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
          <p>
            Tip: Press <Badge variant="outline" className="font-mono text-xs">?</Badge> anytime to show this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
