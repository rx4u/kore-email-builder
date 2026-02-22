/**
 * Automated script to update all theme bg200/bg300 tokens using HSL formula
 * Formula: L_new = L + (100 - L) * factor
 * 
 * This script:
 * 1. Reads the theme catalog
 * 2. For each theme's header/body/footer zones
 * 3. Calculates bg200 (50% lighter) and bg300 (75% lighter)
 * 4. Handles dark themes specially
 * 5. Outputs updated theme data
 */

import { generateButtonTokens, hexToHSL } from '../lib/color-utils';

// Import the themes (you would normally import from theme-catalog.ts)
// For this script, we'll process the data structure

interface ZoneColors {
  bg: string;
  fg: string;
  primary500: string;
  primary600: string;
  textDark: string;
  textLight: string;
  bg50: string;
  bg100: string;
  bg200?: string;
  bg300?: string;
}

interface Theme {
  id: string;
  name: string;
  header: ZoneColors;
  body: ZoneColors;
  footer: ZoneColors;
  themeType: 'light' | 'dark';
  category: 'brand' | 'neutral' | 'colorful';
}

/**
 * Update a single zone with calculated bg200/bg300 tokens
 */
function updateZoneTokens(
  zone: ZoneColors,
  zoneName: string,
  isDarkTheme: boolean
): ZoneColors & { bg200: string; bg300: string } {
  const tokens = generateButtonTokens(zone.bg, isDarkTheme && zoneName === 'header');
  
  const hsl = hexToHSL(zone.bg);
  
  return {
    ...zone,
    bg200: tokens.bg200,
    bg300: tokens.bg300,
  };
}

/**
 * Update a complete theme with calculated tokens
 */
function updateTheme(theme: Theme): Theme {
  const isDarkTheme = theme.themeType === 'dark';
  
  return {
    ...theme,
    header: updateZoneTokens(theme.header, 'header', isDarkTheme),
    body: updateZoneTokens(theme.body, 'body', false), // Body is typically light
    footer: updateZoneTokens(theme.footer, 'footer', false), // Footer is typically light
  };
}

/**
 * Generate a report of changes
 */
function generateChangeReport(oldTheme: Theme, newTheme: Theme): string {
  const report: string[] = [];
  
  report.push(`\n=== ${newTheme.name} (${newTheme.id}) ===`);
  report.push(`Theme Type: ${newTheme.themeType}`);
  
  const zones: Array<keyof Pick<Theme, 'header' | 'body' | 'footer'>> = ['header', 'body', 'footer'];
  
  zones.forEach(zoneName => {
    const zone = newTheme[zoneName];
    const hsl = hexToHSL(zone.bg);
    
    report.push(`\n${zoneName.toUpperCase()}:`);
    report.push(`  Base bg: ${zone.bg} (L=${hsl.l}%)`);
    report.push(`  bg200: ${zone.bg200} ← HSL calculated (50% lighter)`);
    report.push(`  bg300: ${zone.bg300} ← HSL calculated (75% lighter)`);
  });
  
  return report.join('\n');
}

/**
 * Main function to process all themes
 */
export function processAllThemes(themes: Theme[]): {
  updatedThemes: Theme[];
  report: string;
} {
  const updatedThemes = themes.map(updateTheme);
  
  const reports = themes.map((oldTheme, index) => 
    generateChangeReport(oldTheme, updatedThemes[index])
  );
  
  return {
    updatedThemes,
    report: reports.join('\n'),
  };
}

/**
 * Generate TypeScript code for a zone
 */
export function generateZoneCode(zone: ZoneColors & { bg200: string; bg300: string }, indent: number = 4): string {
  const ind = ' '.repeat(indent);
  
  return `${ind}bg: '${zone.bg}',
${ind}fg: '${zone.fg}',
${ind}// NEW: Extended color tokens
${ind}primary500: '${zone.primary500}',
${ind}primary600: '${zone.primary600}',
${ind}textDark: '${zone.textDark}',
${ind}textLight: '${zone.textLight}',
${ind}bg50: '${zone.bg50}',
${ind}bg100: '${zone.bg100}',
${ind}bg200: '${zone.bg200}',  // HSL: L + (100-L) * 0.5
${ind}bg300: '${zone.bg300}',  // HSL: L + (100-L) * 0.75`;
}

/**
 * Utility to format a single theme for output
 */
export function formatThemeForCatalog(theme: Theme): string {
  const header = generateZoneCode(theme.header as any, 6);
  const body = generateZoneCode(theme.body as any, 6);
  const footer = generateZoneCode(theme.footer as any, 6);
  
  return `    header: {
${header}
    },
    body: {
${body}
    },
    footer: {
${footer}
    },`;
}

// Example usage and testing
if (require.main === module) {
  console.log('Theme Token Update Script');
  console.log('=========================\n');
  console.log('This script calculates bg200/bg300 tokens using HSL formula:');
  console.log('L_new = L + (100 - L) * factor\n');
  console.log('Ready to process themes...\n');
}

export default processAllThemes;
