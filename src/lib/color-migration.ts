/**
 * Color Migration Utilities
 * 
 * Automatically converts legacy hex/rgba strings to ColorValue tokens
 */

import { 
  migrateToColorValue, 
  isColorValue,
  type ColorValue,
  type ColorId 
} from './color-token-system';
import type { HeaderConfig, FooterConfig } from '../components/EmailSettings';
import type { ContentBlock } from '../components/PropertiesPanel';

/**
 * Migrate header colors from hex to tokens
 */
export function migrateHeaderColors(header: HeaderConfig): HeaderConfig {
  return {
    ...header,
    backgroundColor: normalizeColorProp(header.backgroundColor),
    titleColor: normalizeColorProp(header.titleColor),
    dateColor: normalizeColorProp(header.dateColor),
  };
}

/**
 * Migrate footer colors from hex to tokens
 */
export function migrateFooterColors(footer: FooterConfig): FooterConfig {
  return {
    ...footer,
    backgroundColor: normalizeColorProp(footer.backgroundColor),
    messageColor: normalizeColorProp(footer.messageColor),
    teamNameColor: normalizeColorProp(footer.teamNameColor),
    linkColor: normalizeColorProp(footer.linkColor),
    disclaimerColor: normalizeColorProp(footer.disclaimerColor),
  };
}

/**
 * Migrate content block colors from hex to tokens
 */
export function migrateBlockColors(block: ContentBlock): ContentBlock {
  if (!block.props) return block;
  
  const migratedProps = { ...block.props };
  
  // Common color properties across all blocks
  const colorProps = [
    'backgroundColor',
    'titleColor',
    'descriptionColor',
    'textColor',
    'headingColor',
    'bodyColor',
    'accentColor',
    'borderColor',
    'labelColor',
    'valueColor',
    'iconColor',
    'linkColor',
    'buttonBackgroundColor',
    'buttonTextColor',
  ];
  
  for (const prop of colorProps) {
    if (migratedProps[prop]) {
      migratedProps[prop] = normalizeColorProp(migratedProps[prop]);
    }
  }
  
  // Handle items arrays (for multi-update, feature-list, etc.)
  if (Array.isArray(migratedProps.items)) {
    migratedProps.items = migratedProps.items.map((item: any) => {
      const migratedItem = { ...item };
      for (const prop of colorProps) {
        if (migratedItem[prop]) {
          migratedItem[prop] = normalizeColorProp(migratedItem[prop]);
        }
      }
      return migratedItem;
    });
  }
  
  // Handle features arrays
  if (Array.isArray(migratedProps.features)) {
    migratedProps.features = migratedProps.features.map((feature: any) => {
      const migratedFeature = { ...feature };
      for (const prop of colorProps) {
        if (migratedFeature[prop]) {
          migratedFeature[prop] = normalizeColorProp(migratedFeature[prop]);
        }
      }
      return migratedFeature;
    });
  }
  
  // Handle stats/metrics arrays
  if (Array.isArray(migratedProps.stats)) {
    migratedProps.stats = migratedProps.stats.map((stat: any) => {
      const migratedStat = { ...stat };
      for (const prop of colorProps) {
        if (migratedStat[prop]) {
          migratedStat[prop] = normalizeColorProp(migratedStat[prop]);
        }
      }
      return migratedStat;
    });
  }
  
  // Handle timeline events
  if (Array.isArray(migratedProps.events)) {
    migratedProps.events = migratedProps.events.map((event: any) => {
      const migratedEvent = { ...event };
      for (const prop of colorProps) {
        if (migratedEvent[prop]) {
          migratedEvent[prop] = normalizeColorProp(migratedEvent[prop]);
        }
      }
      return migratedEvent;
    });
  }
  
  return {
    ...block,
    props: migratedProps,
  };
}

/**
 * Normalize a color property value
 * - If already ColorValue: return as-is
 * - If string (hex/rgba): migrate to ColorValue
 * - If undefined: return undefined
 */
function normalizeColorProp(
  value: ColorValue | ColorId | string | undefined
): ColorValue | undefined {
  if (!value) return undefined;
  
  // Already a ColorValue object
  if (isColorValue(value)) {
    return value;
  }
  
  // String - needs migration
  if (typeof value === 'string') {
    return migrateToColorValue(value);
  }
  
  return undefined;
}

/**
 * Migrate all blocks in an array
 */
export function migrateAllBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map(migrateBlockColors);
}

/**
 * Check if a config needs migration
 */
export function needsMigration(config: any): boolean {
  if (!config) return false;
  
  // Check common color properties
  const colorProps = [
    'backgroundColor',
    'titleColor',
    'dateColor',
    'messageColor',
    'teamNameColor',
    'linkColor',
    'disclaimerColor',
  ];
  
  for (const prop of colorProps) {
    const value = config[prop];
    // If it's a string and not already a ColorValue object, needs migration
    if (typeof value === 'string' && !isColorValue(value)) {
      return true;
    }
  }
  
  return false;
}
