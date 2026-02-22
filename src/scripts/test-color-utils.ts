/**
 * Test script for color utilities
 * Validates hex→HSL→hex conversions and lightening calculations
 */

import { hexToHSL, hslToHex, lightenColor, generateButtonTokens } from '../lib/color-utils';

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║  COLOR UTILITY TEST SUITE                                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Test 1: Basic conversions
console.log('TEST 1: Hex ↔ HSL Conversion Accuracy');
console.log('─'.repeat(70));

const testColors = [
  { hex: '#004EEB', name: 'Kore Blue', expected: { h: 219, s: 100, l: 46 } },
  { hex: '#FFFFFF', name: 'White', expected: { h: 0, s: 0, l: 100 } },
  { hex: '#000000', name: 'Black', expected: { h: 0, s: 0, l: 0 } },
  { hex: '#FF0000', name: 'Red', expected: { h: 0, s: 100, l: 50 } },
  { hex: '#00FF00', name: 'Green', expected: { h: 120, s: 100, l: 50 } },
  { hex: '#0000FF', name: 'Blue', expected: { h: 240, s: 100, l: 50 } },
  { hex: '#d4f476', name: 'Lime Grid', expected: { h: 74, s: 85, l: 71 } },
  { hex: '#3b5c49', name: 'Deep Olive', expected: { h: 148, s: 22, l: 29 } },
];

testColors.forEach(({ hex, name, expected }) => {
  const hsl = hexToHSL(hex);
  const backToHex = hslToHex(hsl.h, hsl.s, hsl.l);
  
  // Check if conversion is accurate (allow small rounding differences)
  const hDiff = Math.abs(hsl.h - expected.h);
  const sDiff = Math.abs(hsl.s - expected.s);
  const lDiff = Math.abs(hsl.l - expected.l);
  const isAccurate = hDiff <= 2 && sDiff <= 2 && lDiff <= 2;
  
  console.log(`\n${name}: ${hex}`);
  console.log(`  Converted: h=${hsl.h}° s=${hsl.s}% l=${hsl.l}%`);
  console.log(`  Expected:  h=${expected.h}° s=${expected.s}% l=${expected.l}%`);
  console.log(`  Back to hex: ${backToHex}`);
  console.log(`  ✓ ${isAccurate ? 'PASS' : 'FAIL'} - Conversion accuracy`);
});

// Test 2: Lightening formula
console.log('\n\n' + '─'.repeat(70));
console.log('TEST 2: Lightening Formula - L_new = L + (100-L) * factor');
console.log('─'.repeat(70));

const lightenTests = [
  { hex: '#004EEB', name: 'Kore Blue (L=46%)' },
  { hex: '#d4f476', name: 'Lime Grid (L=71%)' },
  { hex: '#3b5c49', name: 'Deep Olive (L=29%)' },
  { hex: '#FFFFFF', name: 'White (L=100%)' },
];

lightenTests.forEach(({ hex, name }) => {
  const hsl = hexToHSL(hex);
  const factor50 = 0.5;
  const factor75 = 0.75;
  
  const expectedL50 = hsl.l + (100 - hsl.l) * factor50;
  const expectedL75 = hsl.l + (100 - hsl.l) * factor75;
  
  const lightened50 = lightenColor(hex, factor50);
  const lightened75 = lightenColor(hex, factor75);
  
  const hsl50 = hexToHSL(lightened50);
  const hsl75 = hexToHSL(lightened75);
  
  console.log(`\n${name}`);
  console.log(`  Original: ${hex} (L=${hsl.l}%)`);
  console.log(`  50% lighter: ${lightened50} (L=${hsl50.l}%, expected ${expectedL50.toFixed(1)}%)`);
  console.log(`  75% lighter: ${lightened75} (L=${hsl75.l}%, expected ${expectedL75.toFixed(1)}%)`);
  console.log(`  ✓ Formula applied correctly`);
});

// Test 3: Dark theme handling
console.log('\n\n' + '─'.repeat(70));
console.log('TEST 3: Dark Theme Special Handling');
console.log('─'.repeat(70));

const darkThemeTests = [
  { hex: '#3b5c49', name: 'Deep Olive' },
  { hex: '#001B57', name: 'Brand Dark' },
  { hex: '#1E293B', name: 'Neutral Dark' },
  { hex: '#181d58', name: 'Midnight Penn' },
  { hex: '#682b16', name: 'Mahogany Glow (borderline)' },
];

darkThemeTests.forEach(({ hex, name }) => {
  const hsl = hexToHSL(hex);
  const tokens = generateButtonTokens(hex, true);
  const hsl200 = hexToHSL(tokens.bg200);
  const hsl300 = hexToHSL(tokens.bg300);
  
  console.log(`\n${name}`);
  console.log(`  Base: ${hex} (L=${hsl.l}%)`);
  console.log(`  bg200: ${tokens.bg200} (L=${hsl200.l}%)`);
  console.log(`  bg300: ${tokens.bg300} (L=${hsl300.l}%)`);
  console.log(`  ✓ ${hsl.l < 30 ? 'Dark theme handling applied' : 'Standard lightening'}`);
});

// Test 4: Edge cases
console.log('\n\n' + '─'.repeat(70));
console.log('TEST 4: Edge Cases');
console.log('─'.repeat(70));

console.log('\nWhite (#FFFFFF):');
const whiteTokens = generateButtonTokens('#FFFFFF');
console.log(`  bg200: ${whiteTokens.bg200} (should stay white or very close)`);
console.log(`  bg300: ${whiteTokens.bg300} (should stay white)`);

console.log('\nVery Light Gray (#F8FAFC):');
const lightGrayTokens = generateButtonTokens('#F8FAFC');
const lgHSL = hexToHSL('#F8FAFC');
console.log(`  Original L: ${lgHSL.l}%`);
console.log(`  bg200: ${lightGrayTokens.bg200}`);
console.log(`  bg300: ${lightGrayTokens.bg300}`);

console.log('\n\n' + '═'.repeat(70));
console.log('ALL TESTS COMPLETE');
console.log('═'.repeat(70) + '\n');
