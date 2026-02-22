/**
 * PropertySections
 *
 * Wrapper for PropertySection components.
 * Provides defaultOpen list and blockType to child sections via Context.
 */

import React, { createContext, useContext } from 'react';

interface PropertySectionsContextValue {
  defaultOpen: readonly string[];
  blockType?: string;
}

export const PropertySectionsContext = createContext<PropertySectionsContextValue>({
  defaultOpen: ['content', 'layout', 'colors'],
  blockType: undefined,
});

export function usePropertySectionsContext() {
  return useContext(PropertySectionsContext);
}

interface PropertySectionsProps {
  children: React.ReactNode;
  defaultOpen?: string[];
  blockType?: string;
  className?: string;
}

export function PropertySections({
  children,
  defaultOpen = ['content', 'layout', 'colors'],
  blockType,
  className = '',
}: PropertySectionsProps) {
  return (
    <PropertySectionsContext.Provider value={{ defaultOpen, blockType }}>
      <div className={`w-full space-y-4 divide-y divide-border/60 ${className}`}>
        {children}
      </div>
    </PropertySectionsContext.Provider>
  );
}
