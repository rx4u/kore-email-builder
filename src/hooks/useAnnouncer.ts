/**
 * useAnnouncer Hook
 * 
 * Provides screen reader announcement capabilities for React components
 * Handles announcement queuing and timing automatically
 * 
 * Part of Phase 1: Accessibility Enhancement
 */

import { useCallback, useEffect, useRef } from 'react';
import { announce, AriaPoliteness } from '../lib/accessibility-utils';

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnouncer() {
  const lastAnnouncementRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Announce a message to screen readers
   */
  const announceMessage = useCallback(
    (
      message: string,
      options?: {
        politeness?: AriaPoliteness;
        clearAfter?: number;
        debounce?: number;
      }
    ) => {
      const {
        politeness = 'polite',
        clearAfter = 3000,
        debounce = 0,
      } = options || {};

      // Avoid duplicate announcements
      if (message === lastAnnouncementRef.current) {
        return;
      }

      lastAnnouncementRef.current = message;

      const doAnnounce = () => {
        announce(message, politeness, clearAfter);
      };

      if (debounce > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(doAnnounce, debounce);
      } else {
        doAnnounce();
      }
    },
    []
  );

  /**
   * Announce success message
   */
  const announceSuccess = useCallback(
    (message: string) => {
      announceMessage(message, { politeness: 'polite', clearAfter: 2000 });
    },
    [announceMessage]
  );

  /**
   * Announce error message
   */
  const announceError = useCallback(
    (message: string) => {
      announceMessage(message, { politeness: 'assertive', clearAfter: 5000 });
    },
    [announceMessage]
  );

  /**
   * Announce info message
   */
  const announceInfo = useCallback(
    (message: string) => {
      announceMessage(message, { politeness: 'polite', clearAfter: 3000 });
    },
    [announceMessage]
  );

  /**
   * Announce loading state
   */
  const announceLoading = useCallback(
    (message: string = 'Loading') => {
      announceMessage(message, { politeness: 'polite', clearAfter: 10000 });
    },
    [announceMessage]
  );

  /**
   * Announce navigation
   */
  const announceNavigation = useCallback(
    (location: string) => {
      announceMessage(`Navigated to ${location}`, {
        politeness: 'polite',
        clearAfter: 2000,
      });
    },
    [announceMessage]
  );

  return {
    announce: announceMessage,
    announceSuccess,
    announceError,
    announceInfo,
    announceLoading,
    announceNavigation,
  };
}

/**
 * Hook for announcing changes in collections (lists)
 */
export function useCollectionAnnouncer() {
  const { announce } = useAnnouncer();

  /**
   * Announce item added
   */
  const announceItemAdded = useCallback(
    (itemName: string, totalCount: number) => {
      announce(`${itemName} added. Total items: ${totalCount}`, {
        politeness: 'polite',
        clearAfter: 2000,
      });
    },
    [announce]
  );

  /**
   * Announce item removed
   */
  const announceItemRemoved = useCallback(
    (itemName: string, totalCount: number) => {
      announce(`${itemName} removed. ${totalCount} items remaining`, {
        politeness: 'polite',
        clearAfter: 2000,
      });
    },
    [announce]
  );

  /**
   * Announce item updated
   */
  const announceItemUpdated = useCallback(
    (itemName: string) => {
      announce(`${itemName} updated`, {
        politeness: 'polite',
        clearAfter: 1500,
      });
    },
    [announce]
  );

  /**
   * Announce items reordered
   */
  const announceReordered = useCallback(
    (itemName: string, newPosition: number, totalCount: number) => {
      announce(`${itemName} moved to position ${newPosition} of ${totalCount}`, {
        politeness: 'polite',
        clearAfter: 2000,
      });
    },
    [announce]
  );

  /**
   * Announce selection changed
   */
  const announceSelectionChanged = useCallback(
    (itemName: string, isSelected: boolean) => {
      announce(`${itemName} ${isSelected ? 'selected' : 'deselected'}`, {
        politeness: 'polite',
        clearAfter: 1500,
      });
    },
    [announce]
  );

  return {
    announceItemAdded,
    announceItemRemoved,
    announceItemUpdated,
    announceReordered,
    announceSelectionChanged,
  };
}

/**
 * Hook for announcing form validation
 */
export function useFormAnnouncer() {
  const { announce, announceError } = useAnnouncer();

  /**
   * Announce validation errors
   */
  const announceValidationErrors = useCallback(
    (errorCount: number, firstError?: string) => {
      if (errorCount === 0) {
        announce('Form is valid', { politeness: 'polite', clearAfter: 2000 });
      } else if (errorCount === 1 && firstError) {
        announceError(`Validation error: ${firstError}`);
      } else {
        announceError(`${errorCount} validation errors found`);
      }
    },
    [announce, announceError]
  );

  /**
   * Announce field error
   */
  const announceFieldError = useCallback(
    (fieldName: string, error: string) => {
      announceError(`${fieldName}: ${error}`);
    },
    [announceError]
  );

  /**
   * Announce form submitted
   */
  const announceFormSubmitted = useCallback(
    (success: boolean, message?: string) => {
      if (success) {
        announce(message || 'Form submitted successfully', {
          politeness: 'polite',
          clearAfter: 2000,
        });
      } else {
        announceError(message || 'Form submission failed');
      }
    },
    [announce, announceError]
  );

  return {
    announceValidationErrors,
    announceFieldError,
    announceFormSubmitted,
  };
}
