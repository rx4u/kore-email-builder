/**
 * Block Style Presets
 * Quick-apply configurations for "Compact", "Standard", and "Spacious" layouts
 */

import type { PaddingSize, SpacingSize } from './layout-scales';
import type { FontSize, FontWeight } from './typography-scales';

export type PresetStyle = 'compact' | 'standard' | 'spacious';

/**
 * Base preset configuration interface
 * Different blocks use different subsets of these properties
 */
export interface PresetConfig {
  // Layout
  padding?: PaddingSize;
  contentAlign?: 'left' | 'center' | 'right';
  
  // Typography - Title
  titleSize?: FontSize;
  titleWeight?: FontWeight;
  
  // Typography - Description
  descriptionSize?: FontSize;
  descriptionWeight?: FontWeight;
  
  // Typography - Header
  headerSize?: FontSize;
  headerWeight?: FontWeight;
  
  // Typography - Value (for stats)
  valueSize?: FontSize;
  valueWeight?: FontWeight;
  
  // Typography - Label
  labelSize?: FontSize;
  labelWeight?: FontWeight;
  
  // Typography - Date
  dateSize?: FontSize;
  dateWeight?: FontWeight;
  
  // Spacing - Common
  titleDescriptionGap?: SpacingSize;
  descriptionButtonGap?: SpacingSize;
  headerDescriptionGap?: SpacingSize;
  
  // Spacing - Block-specific
  bulletSpacing?: SpacingSize;
  updateSpacing?: SpacingSize;
  itemSpacing?: SpacingSize;
  columnGap?: SpacingSize;
  statGap?: SpacingSize;
  thumbnailTextGap?: SpacingSize;
  screenshotTextGap?: SpacingSize;
  titleCodeGap?: SpacingSize;
  titleStatsGap?: SpacingSize;
  dateGap?: SpacingSize;
  titleGap?: SpacingSize;
}

/**
 * Preset Definitions
 */
export const PRESETS: Record<PresetStyle, PresetConfig> = {
  /**
   * COMPACT PRESET
   * - Minimal spacing for dense content
   * - Smaller typography
   * - Tight padding
   * Use for: Newsletter snippets, quick updates, mobile-optimized layouts
   */
  compact: {
    // Layout
    padding: 'sm',
    contentAlign: 'left',
    
    // Typography - Title
    titleSize: 'lg',
    titleWeight: 'semibold',
    
    // Typography - Description
    descriptionSize: 'sm',
    descriptionWeight: 'normal',
    
    // Typography - Header
    headerSize: 'xl',
    headerWeight: 'bold',
    
    // Typography - Value
    valueSize: '3xl',
    valueWeight: 'bold',
    
    // Typography - Label
    labelSize: 'xs',
    labelWeight: 'normal',
    
    // Typography - Date
    dateSize: 'xs',
    dateWeight: 'semibold',
    
    // Spacing - Common
    titleDescriptionGap: 'sm',
    descriptionButtonGap: 'md',
    headerDescriptionGap: 'sm',
    
    // Spacing - Block-specific
    bulletSpacing: 'sm',
    updateSpacing: 'sm',
    itemSpacing: 'md',
    columnGap: 'sm',
    statGap: 'sm',
    thumbnailTextGap: 'md',
    screenshotTextGap: 'md',
    titleCodeGap: 'sm',
    titleStatsGap: 'md',
    dateGap: 'xs',
    titleGap: 'sm',
  },

  /**
   * STANDARD PRESET (Default)
   * - Balanced spacing for general use
   * - Professional typography
   * - Standard padding
   * Use for: Most release notes, feature announcements, regular updates
   */
  standard: {
    // Layout
    padding: 'md',
    contentAlign: 'left',
    
    // Typography - Title
    titleSize: 'xl',
    titleWeight: 'bold',
    
    // Typography - Description
    descriptionSize: 'base',
    descriptionWeight: 'normal',
    
    // Typography - Header
    headerSize: '2xl',
    headerWeight: 'bold',
    
    // Typography - Value
    valueSize: '4xl',
    valueWeight: 'bold',
    
    // Typography - Label
    labelSize: 'sm',
    labelWeight: 'normal',
    
    // Typography - Date
    dateSize: 'xs',
    dateWeight: 'semibold',
    
    // Spacing - Common
    titleDescriptionGap: 'md',
    descriptionButtonGap: 'lg',
    headerDescriptionGap: 'md',
    
    // Spacing - Block-specific
    bulletSpacing: 'md',
    updateSpacing: 'md',
    itemSpacing: 'lg',
    columnGap: 'md',
    statGap: 'md',
    thumbnailTextGap: 'lg',
    screenshotTextGap: 'lg',
    titleCodeGap: 'sm',
    titleStatsGap: 'xl',
    dateGap: 'xs',
    titleGap: 'sm',
  },

  /**
   * SPACIOUS PRESET
   * - Generous spacing for emphasis
   * - Larger typography
   * - Extra padding
   * Use for: Major announcements, hero sections, executive summaries
   */
  spacious: {
    // Layout
    padding: 'xl',
    contentAlign: 'left',
    
    // Typography - Title
    titleSize: '2xl',
    titleWeight: 'bold',
    
    // Typography - Description
    descriptionSize: 'lg',
    descriptionWeight: 'normal',
    
    // Typography - Header
    headerSize: '3xl',
    headerWeight: 'bold',
    
    // Typography - Value
    valueSize: '4xl',
    valueWeight: 'bold',
    
    // Typography - Label
    labelSize: 'base',
    labelWeight: 'normal',
    
    // Typography - Date
    dateSize: 'sm',
    dateWeight: 'semibold',
    
    // Spacing - Common
    titleDescriptionGap: 'lg',
    descriptionButtonGap: 'xl',
    headerDescriptionGap: 'lg',
    
    // Spacing - Block-specific
    bulletSpacing: 'lg',
    updateSpacing: 'lg',
    itemSpacing: 'xl',
    columnGap: 'lg',
    statGap: 'lg',
    thumbnailTextGap: 'xl',
    screenshotTextGap: 'xl',
    titleCodeGap: 'md',
    titleStatsGap: 'xxl',
    dateGap: 'sm',
    titleGap: 'md',
  },
};

/**
 * Get preset configuration by name
 */
export function getPreset(style: PresetStyle): PresetConfig {
  return PRESETS[style];
}

/**
 * Apply preset to block props
 * Only updates properties that exist in the preset (preserves custom values for other props)
 */
export function applyPreset(
  currentProps: Record<string, any>,
  preset: PresetStyle
): Record<string, any> {
  // Safety check: if currentProps is undefined or null, use empty object
  const safeProps = currentProps || {};
  const presetConfig = getPreset(preset);
  
  return {
    ...safeProps,
    ...presetConfig,
    // Store which preset was applied (for UI highlighting)
    _appliedPreset: preset,
  };
}

/**
 * Detect which preset (if any) matches current props
 * Returns null if props don't match any preset
 */
export function detectPreset(props: Record<string, any>): PresetStyle | null {
  // Safety check: if props is undefined or null, return null
  if (!props) {
    return null;
  }
  
  // Check if preset was explicitly applied
  if (props._appliedPreset) {
    return props._appliedPreset;
  }
  
  // Try to detect based on key properties
  const { padding, titleSize, descriptionSize } = props;
  
  // Compact detection
  if (padding === 'sm' && titleSize === 'lg' && descriptionSize === 'sm') {
    return 'compact';
  }
  
  // Standard detection
  if (padding === 'md' && titleSize === 'xl' && descriptionSize === 'base') {
    return 'standard';
  }
  
  // Spacious detection
  if (padding === 'xl' && titleSize === '2xl' && descriptionSize === 'lg') {
    return 'spacious';
  }
  
  return null;
}

/**
 * Preset metadata for UI display
 */
export const PRESET_METADATA = {
  compact: {
    label: 'Compact',
    description: 'Dense layout, minimal spacing',
    iconName: 'minimize-2',
  },
  standard: {
    label: 'Standard',
    description: 'Balanced layout, professional spacing',
    iconName: 'square',
  },
  spacious: {
    label: 'Spacious',
    description: 'Generous layout, emphasis spacing',
    iconName: 'maximize-2',
  },
} as const;
