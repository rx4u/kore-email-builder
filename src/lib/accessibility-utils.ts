/**
 * Accessibility Utilities
 * 
 * Provides utilities and helpers for improving application accessibility
 * including ARIA helpers, focus management, and screen reader support.
 * 
 * Part of Phase 1: Accessibility Enhancement
 */

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  enableAnnouncements: boolean;
  keyboardShortcutsEnabled: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
}

/**
 * Default accessibility configuration
 */
export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  enableAnnouncements: true,
  keyboardShortcutsEnabled: true,
  highContrastMode: false,
  reducedMotion: false,
};

/**
 * ARIA live region politeness levels
 */
export type AriaPoliteness = 'off' | 'polite' | 'assertive';

/**
 * Announcement message structure
 */
export interface Announcement {
  message: string;
  politeness: AriaPoliteness;
  clearAfter?: number; // ms
}

/**
 * Screen reader announcer class
 */
class ScreenReaderAnnouncer {
  private liveRegion: HTMLDivElement | null = null;
  private announcements: Announcement[] = [];
  private isProcessing = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the live region for announcements
   */
  private initialize(): void {
    if (typeof document === 'undefined') return;

    // Create live region if it doesn't exist
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('role', 'status');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.className = 'sr-only';
      
      // Add visually hidden styles
      Object.assign(this.liveRegion.style, {
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      });

      document.body.appendChild(this.liveRegion);
    }
  }

  /**
   * Announce a message to screen readers
   */
  announce(
    message: string,
    politeness: AriaPoliteness = 'polite',
    clearAfter: number = 3000
  ): void {
    if (!this.liveRegion) return;

    this.announcements.push({ message, politeness, clearAfter });

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process announcement queue
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.announcements.length > 0) {
      const announcement = this.announcements.shift();
      if (!announcement || !this.liveRegion) continue;

      // Update politeness level
      this.liveRegion.setAttribute('aria-live', announcement.politeness);

      // Set the message
      this.liveRegion.textContent = announcement.message;

      // Clear after delay
      if (announcement.clearAfter) {
        await new Promise((resolve) => setTimeout(resolve, announcement.clearAfter));
        this.liveRegion.textContent = '';
      }

      // Small delay between announcements
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  /**
   * Clear all announcements
   */
  clear(): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
    }
    this.announcements = [];
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
      this.liveRegion = null;
    }
    this.announcements = [];
  }
}

/**
 * Global screen reader announcer instance
 */
export const screenReaderAnnouncer = new ScreenReaderAnnouncer();

/**
 * Announce a message to screen readers
 */
export function announce(
  message: string,
  politeness: AriaPoliteness = 'polite',
  clearAfter?: number
): void {
  screenReaderAnnouncer.announce(message, politeness, clearAfter);
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private focusStack: HTMLElement[] = [];

  /**
   * Save current focus
   */
  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  /**
   * Restore previous focus
   */
  restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && element.focus) {
      // Use setTimeout to avoid focus fighting
      setTimeout(() => element.focus(), 0);
    }
  }

  /**
   * Focus first focusable element in container
   */
  focusFirstIn(container: HTMLElement): void {
    const focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  /**
   * Focus last focusable element in container
   */
  focusLastIn(container: HTMLElement): void {
    const focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus();
    }
  }

  /**
   * Get all focusable elements in container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll(selector));
  }

  /**
   * Trap focus within a container
   */
  trapFocus(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusable = this.getFocusableElements(container);
    if (focusable.length === 0) return;

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      // Tab
      if (activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }
}

/**
 * Global focus manager instance
 */
export const focusManager = new FocusManager();

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * ARIA label helpers
 */
export const ariaLabels = {
  /**
   * Drag handle label
   */
  dragHandle: (itemName: string) => `Drag handle for ${itemName}`,

  /**
   * Delete button label
   */
  deleteButton: (itemName: string) => `Remove ${itemName}`,

  /**
   * Close button label
   */
  closeButton: (context: string) => `Close ${context}`,

  /**
   * Toggle button label
   */
  toggleButton: (itemName: string, isOpen: boolean) =>
    `${isOpen ? 'Collapse' : 'Expand'} ${itemName}`,

  /**
   * Copy button label
   */
  copyButton: (content: string) => `Copy ${content} to clipboard`,

  /**
   * Panel label
   */
  panel: (panelName: string, isCollapsed: boolean) =>
    `${panelName} panel, ${isCollapsed ? 'collapsed' : 'expanded'}`,

  /**
   * Block selection label
   */
  blockSelect: (blockName: string, isSelected: boolean) =>
    `${blockName} block, ${isSelected ? 'selected' : 'not selected'}`,

  /**
   * Theme selector label
   */
  themeSelector: (themeName: string) => `Select ${themeName} theme`,

  /**
   * Color picker label
   */
  colorPicker: (colorName: string) => `Color picker for ${colorName}`,

  /**
   * Keyboard shortcut hint
   */
  shortcutHint: (action: string, shortcut: string) =>
    `${action}. Keyboard shortcut: ${shortcut}`,
};

/**
 * Keyboard event helpers
 */
export const keyboard = {
  /**
   * Check if key is Enter or Space (activation keys)
   */
  isActivationKey: (event: KeyboardEvent): boolean => {
    return event.key === 'Enter' || event.key === ' ';
  },

  /**
   * Check if key is Escape
   */
  isEscapeKey: (event: KeyboardEvent): boolean => {
    return event.key === 'Escape' || event.key === 'Esc';
  },

  /**
   * Check if key is Arrow key
   */
  isArrowKey: (event: KeyboardEvent): boolean => {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key);
  },

  /**
   * Check if modifier key is pressed
   */
  hasModifier: (event: KeyboardEvent | MouseEvent): boolean => {
    return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
  },

  /**
   * Get modifier key for current platform
   */
  getModifierKey: (): 'Ctrl' | 'Cmd' => {
    return navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl';
  },

  /**
   * Format shortcut for display
   */
  formatShortcut: (shortcut: string): string => {
    const modKey = keyboard.getModifierKey();
    return shortcut.replace('Ctrl', modKey).replace('Cmd', modKey);
  },
};

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-contrast: high)');
  return mediaQuery.matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches;
}

/**
 * Accessibility validation utilities
 */
export const a11yValidation = {
  /**
   * Check if element has accessible name
   */
  hasAccessibleName: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim()
    );
  },

  /**
   * Check if interactive element is keyboard accessible
   */
  isKeyboardAccessible: (element: HTMLElement): boolean => {
    const tabindex = element.getAttribute('tabindex');
    return (
      element.tagName === 'BUTTON' ||
      element.tagName === 'A' ||
      element.tagName === 'INPUT' ||
      element.tagName === 'SELECT' ||
      element.tagName === 'TEXTAREA' ||
      (tabindex !== null && tabindex !== '-1')
    );
  },

  /**
   * Validate color contrast ratio (simplified)
   */
  hasGoodContrast: (foreground: string, background: string): boolean => {
    // This is a simplified check
    // For production, use a proper color contrast library
    // Target: WCAG AA = 4.5:1 for normal text, 3:1 for large text
    
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // Calculate relative luminance
    const getLuminance = (rgb: { r: number; g: number; b: number }) => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
        const sRGB = val / 255;
        return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return true; // Can't validate, assume OK

    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    // WCAG AA standard: 4.5:1 for normal text
    return ratio >= 4.5;
  },
};

/**
 * Log accessibility warnings (dev only)
 */
export function logAccessibilityWarnings(container: HTMLElement): void {
  if (process.env.NODE_ENV !== 'development') return;

  const warnings: string[] = [];

  // Check for buttons without labels
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!a11yValidation.hasAccessibleName(button as HTMLElement)) {
      warnings.push(`Button without accessible name found: ${button.outerHTML.slice(0, 50)}...`);
    }
  });

  // Check for images without alt text
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      warnings.push(`Image without alt text found: ${img.src}`);
    }
  });

  if (warnings.length > 0) {
    console.group('⚠️ Accessibility Warnings');
    warnings.forEach((warning) => console.warn(warning));
    console.groupEnd();
  }
}
