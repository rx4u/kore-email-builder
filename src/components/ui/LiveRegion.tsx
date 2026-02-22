/**
 * LiveRegion Component
 * 
 * Provides a visually hidden live region for screen reader announcements
 * Automatically managed, typically only one instance needed per app
 * 
 * Part of Phase 1: Accessibility Enhancement
 */

import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  /**
   * Message to announce
   */
  message?: string;

  /**
   * ARIA politeness level
   */
  politeness?: 'off' | 'polite' | 'assertive';

  /**
   * Clear message after delay (ms)
   */
  clearAfter?: number;

  /**
   * Atomic announcements (read entire message)
   */
  atomic?: boolean;
}

/**
 * Screen reader live region component
 * 
 * Usage:
 * ```tsx
 * <LiveRegion 
 *   message="Item added" 
 *   politeness="polite" 
 *   clearAfter={3000} 
 * />
 * ```
 */
export const LiveRegion = React.memo(({
  message = '',
  politeness = 'polite',
  clearAfter,
  atomic = true,
}: LiveRegionProps) => {
  const regionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!message || !regionRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new message
    regionRef.current.textContent = message;

    // Auto-clear after delay
    if (clearAfter) {
      timeoutRef.current = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = '';
        }
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    />
  );
});
LiveRegion.displayName = 'LiveRegion';

/**
 * Alert live region (assertive)
 * Use for critical messages that need immediate attention
 */
export const LiveAlert = React.memo(({
  message = '',
  clearAfter = 5000,
}: {
  message?: string;
  clearAfter?: number;
}) => {
  return (
    <LiveRegion message={message} politeness="assertive" clearAfter={clearAfter} />
  );
});
LiveAlert.displayName = 'LiveAlert';

/**
 * Status live region (polite)
 * Use for non-critical status updates
 */
export const LiveStatus = React.memo(({
  message = '',
  clearAfter = 3000,
}: {
  message?: string;
  clearAfter?: number;
}) => {
  return (
    <LiveRegion message={message} politeness="polite" clearAfter={clearAfter} />
  );
});
LiveStatus.displayName = 'LiveStatus';
