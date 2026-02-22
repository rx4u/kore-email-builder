/**
 * useKeyboardShortcuts Hook
 * 
 * Provides keyboard shortcut management for the application
 * Supports global and context-specific shortcuts with priority handling
 * 
 * Part of Phase 1: Accessibility Enhancement
 */

import { useEffect, useCallback, useRef } from 'react';
import { keyboard } from '../lib/accessibility-utils';

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: (event: KeyboardEvent) => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

/**
 * Shortcut context (for priority handling)
 */
export type ShortcutContext = 'global' | 'modal' | 'panel' | 'editor';

/**
 * Check if shortcut matches keyboard event
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
  
  const ctrlMatch = shortcut.ctrl !== undefined 
    ? event.ctrlKey === shortcut.ctrl 
    : !event.ctrlKey;
    
  const metaMatch = shortcut.meta !== undefined 
    ? event.metaKey === shortcut.meta 
    : !event.metaKey;
    
  const shiftMatch = shortcut.shift !== undefined 
    ? event.shiftKey === shortcut.shift 
    : !event.shiftKey;
    
  const altMatch = shortcut.alt !== undefined 
    ? event.altKey === shortcut.alt 
    : !event.altKey;

  return keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch;
}

/**
 * Format shortcut for display
 */
export function formatShortcutDisplay(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  const isMac = navigator.platform.includes('Mac');
  
  if (shortcut.ctrl || shortcut.meta) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  
  // Format key
  let keyDisplay = shortcut.key.toUpperCase();
  if (keyDisplay === ' ') keyDisplay = 'Space';
  if (keyDisplay === 'ESCAPE') keyDisplay = 'Esc';
  if (keyDisplay === 'DELETE') keyDisplay = 'Del';
  
  parts.push(keyDisplay);
  
  return parts.join(isMac ? '' : '+');
}

/**
 * Hook for registering keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  context: ShortcutContext = 'global',
  enabled: boolean = true
) {
  const shortcutsRef = useRef(shortcuts);
  
  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields (except Escape)
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;
    
    if (isInput && event.key !== 'Escape') {
      return;
    }

    // Check each shortcut
    for (const shortcut of shortcutsRef.current) {
      if (shortcut.enabled === false) continue;
      
      if (matchesShortcut(event, shortcut)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action(event);
        break; // Only trigger first match
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  return {
    formatShortcut: formatShortcutDisplay,
  };
}

/**
 * Common application shortcuts
 */
export const commonShortcuts = {
  /**
   * Undo shortcut
   */
  undo: (action: () => void): KeyboardShortcut => ({
    key: 'z',
    ctrl: true,
    meta: true,
    description: 'Undo last action',
    action,
  }),

  /**
   * Redo shortcut (Windows/Linux)
   */
  redoWin: (action: () => void): KeyboardShortcut => ({
    key: 'y',
    ctrl: true,
    description: 'Redo last undone action',
    action,
  }),

  /**
   * Redo shortcut (Mac)
   */
  redoMac: (action: () => void): KeyboardShortcut => ({
    key: 'z',
    meta: true,
    shift: true,
    description: 'Redo last undone action',
    action,
  }),

  /**
   * Delete shortcut
   */
  delete: (action: () => void): KeyboardShortcut => ({
    key: 'Delete',
    description: 'Delete selected item',
    action,
  }),

  /**
   * Backspace shortcut (alternative delete)
   */
  backspace: (action: () => void): KeyboardShortcut => ({
    key: 'Backspace',
    description: 'Delete selected item',
    action,
  }),

  /**
   * Escape shortcut
   */
  escape: (action: () => void): KeyboardShortcut => ({
    key: 'Escape',
    description: 'Close panel or dialog',
    action,
    preventDefault: false, // Allow default escape behavior
  }),

  /**
   * Copy shortcut
   */
  copy: (action: () => void): KeyboardShortcut => ({
    key: 'c',
    ctrl: true,
    meta: true,
    description: 'Copy',
    action,
  }),

  /**
   * Copy with Shift modifier
   */
  copyShift: (action: () => void, description: string): KeyboardShortcut => ({
    key: 'c',
    ctrl: true,
    meta: true,
    shift: true,
    description,
    action,
  }),

  /**
   * Copy with Alt modifier
   */
  copyAlt: (action: () => void, description: string): KeyboardShortcut => ({
    key: 'c',
    ctrl: true,
    meta: true,
    alt: true,
    description,
    action,
  }),

  /**
   * Help shortcut
   */
  help: (action: () => void): KeyboardShortcut => ({
    key: '?',
    shift: true,
    description: 'Show keyboard shortcuts',
    action,
  }),

  /**
   * Save shortcut
   */
  save: (action: () => void): KeyboardShortcut => ({
    key: 's',
    ctrl: true,
    meta: true,
    description: 'Save',
    action,
  }),

  /**
   * Find/Search shortcut
   */
  find: (action: () => void): KeyboardShortcut => ({
    key: 'f',
    ctrl: true,
    meta: true,
    description: 'Find',
    action,
  }),

  /**
   * New item shortcut
   */
  new: (action: () => void): KeyboardShortcut => ({
    key: 'n',
    ctrl: true,
    meta: true,
    description: 'New item',
    action,
  }),
};

/**
 * Get all shortcuts as array for display
 */
export function getAllShortcuts(shortcuts: KeyboardShortcut[]): Array<{
  display: string;
  description: string;
}> {
  return shortcuts
    .filter(s => s.enabled !== false)
    .map(s => ({
      display: formatShortcutDisplay(s),
      description: s.description,
    }));
}
