/**
 * Unit tests for color palette V2 (theme/color audit follow-up).
 * - getThemeTokenPalette: deduplicates by hex so the same color does not appear twice.
 */
import { describe, it, expect } from 'vitest';
import { getThemeTokenPalette } from './color-palette-v2';

describe('getThemeTokenPalette', () => {
  it('returns no duplicate hex values (dedupe by hex)', () => {
    const themeId = 'kore-default';
    const zones: Array<'header' | 'body' | 'footer'> = ['header', 'body', 'footer'];
    for (const zone of zones) {
      const tokens = getThemeTokenPalette(themeId, zone);
      const hexes = tokens.map((t) => t.hex.toUpperCase());
      const seen = new Set<string>();
      hexes.forEach((hex) => {
        expect(seen.has(hex)).toBe(false);
        seen.add(hex);
      });
    }
  });

  it('returns empty array for unknown theme', () => {
    expect(getThemeTokenPalette('unknown-theme-id')).toEqual([]);
  });

  it('returns theme tokens for known theme and zone', () => {
    const tokens = getThemeTokenPalette('kore-default', 'header');
    expect(tokens.length).toBeGreaterThan(0);
    tokens.forEach((t) => {
      expect(t.id).toMatch(/^theme-header-/);
      expect(t.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(t.category).toBe('theme-tokens');
    });
  });
});
