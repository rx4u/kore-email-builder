/**
 * Global Block Defaults
 * 
 * Centralized defaults that can be applied to all blocks at once.
 * Stored in localStorage and applied via Global Defaults dialog.
 */

import { 
  FontSize, 
  FontWeight, 
  TextColor 
} from './typography-scales';

import { 
  PaddingSize, 
  SpacingSize, 
  AlignmentOption 
} from './layout-scales';

import { CTAButtonStyle } from '../components/email-blocks/email-styles';
import { getColorHex } from './color-palette';

// ============================================================================
// INTERFACES
// ============================================================================

export interface GlobalBlockDefaults {
  typography: {
    titleSize: FontSize;
    titleWeight: FontWeight;
    titleColor: string;
    descriptionSize: FontSize;
    descriptionWeight: FontWeight;
    descriptionColor: string;
  };
  spacing: {
    padding: PaddingSize;
    titleDescriptionGap: SpacingSize;
    descriptionCtaGap: SpacingSize;
    itemSpacing: SpacingSize;
  };
  alignment: {
    contentAlign: AlignmentOption;
    titleAlign: AlignmentOption;
  };
  button: {
    ctaStyle: CTAButtonStyle;
    ctaSize: 'sm' | 'md' | 'lg';
    ctaWidth: 'auto' | 'full';
  };
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_GLOBAL_DEFAULTS: GlobalBlockDefaults = {
  typography: {
    titleSize: '2xl',
    titleWeight: 'bold',
    titleColor: getColorHex('text-primary-900'),
    descriptionSize: 'base',
    descriptionWeight: 'normal',
    descriptionColor: getColorHex('text-tertiary-600'),
  },
  spacing: {
    padding: 'md',
    titleDescriptionGap: 'md',
    descriptionCtaGap: 'xl',
    itemSpacing: 'md',
  },
  alignment: {
    contentAlign: 'left',
    titleAlign: 'left',
  },
  button: {
    ctaStyle: 'secondary',
    ctaSize: 'md',
    ctaWidth: 'auto',
  },
};

// ============================================================================
// STORAGE KEY
// ============================================================================

const STORAGE_KEY = 'koreai-global-block-defaults';

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get global defaults from localStorage
 */
export function getGlobalDefaults(): GlobalBlockDefaults {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading global defaults:', error);
  }
  return DEFAULT_GLOBAL_DEFAULTS;
}

/**
 * Save global defaults to localStorage
 */
export function saveGlobalDefaults(defaults: GlobalBlockDefaults): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  } catch (error) {
    console.error('Error saving global defaults:', error);
  }
}

/**
 * Reset to default values
 */
export function resetGlobalDefaults(): GlobalBlockDefaults {
  saveGlobalDefaults(DEFAULT_GLOBAL_DEFAULTS);
  return DEFAULT_GLOBAL_DEFAULTS;
}

/**
 * Apply global defaults to a block's props
 * Merges defaults without overwriting user content
 */
export function applyDefaultsToBlock(blockProps: any, defaults: GlobalBlockDefaults): any {
  return {
    ...blockProps,
    
    // Typography
    titleSize: defaults.typography.titleSize,
    titleWeight: defaults.typography.titleWeight,
    titleColor: defaults.typography.titleColor,
    descriptionSize: defaults.typography.descriptionSize,
    descriptionWeight: defaults.typography.descriptionWeight,
    descriptionColor: defaults.typography.descriptionColor,
    
    // Spacing
    padding: defaults.spacing.padding,
    titleDescriptionGap: defaults.spacing.titleDescriptionGap,
    descriptionCtaGap: defaults.spacing.descriptionCtaGap,
    descriptionButtonGap: defaults.spacing.descriptionCtaGap, // Alias
    itemSpacing: defaults.spacing.itemSpacing,
    bulletSpacing: defaults.spacing.itemSpacing, // Alias
    updateSpacing: defaults.spacing.itemSpacing, // Alias
    
    // Alignment
    contentAlign: defaults.alignment.contentAlign,
    titleAlign: defaults.alignment.titleAlign,
    descriptionAlign: defaults.alignment.contentAlign, // Use content align for description
    
    // Button (only if block has CTA)
    ...(('ctaText' in blockProps || 'ctaLink' in blockProps) && {
      ctaStyle: defaults.button.ctaStyle,
      ctaSize: defaults.button.ctaSize,
      ctaWidth: defaults.button.ctaWidth,
    }),
  };
}