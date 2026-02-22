/**
 * PropertySections
 * 
 * Simple wrapper for PropertySection components
 * Part of Unified System (Phase 4+)
 * 
 * Provides consistent spacing between sections
 * No accordion behavior - all sections always visible
 */

interface PropertySectionsProps {
  children: React.ReactNode;
  defaultOpen?: string[];  // Kept for API compatibility, but ignored
  className?: string;
}

export function PropertySections({ 
  children,
  className = ''
}: PropertySectionsProps) {
  return (
    <div className={`w-full space-y-4 divide-y divide-border/60 ${className}`}>
      {children}
    </div>
  );
}