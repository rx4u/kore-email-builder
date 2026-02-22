/**
 * Unit tests for color token system (theme/color audit follow-up).
 * - getColorGroups: Most Used = white + black only; group order; no duplicate swatches.
 */
import { describe, it, expect } from 'vitest';
import { getColorGroups, type ColorGroup } from './color-token-system';

describe('getColorGroups', () => {
  it('returns Most Used group with only white and black (no brand/neutral dupes)', () => {
    const groups = getColorGroups();
    const common = groups.find((g) => g.id === 'common');
    expect(common).toBeDefined();
    expect(common!.label).toBe('Most Used');
    expect(common!.colors).toHaveLength(2);
    const ids = common!.colors.map((c) => c.id).sort();
    expect(ids).toEqual(['black', 'white']);
  });

  it('orders groups as Most Used → Brand → Grays → Semantic', () => {
    const groups = getColorGroups();
    const ids = groups.map((g) => g.id);
    expect(ids[0]).toBe('common');
    expect(ids[1]).toBe('brand');
    expect(ids[2]).toBe('neutral');
    expect(ids.includes('semantic')).toBe(true);
  });

  it('has no color ID in both Most Used and Brand', () => {
    const groups = getColorGroups();
    const commonIds = new Set(
      (groups.find((g) => g.id === 'common')?.colors ?? []).map((c) => c.id)
    );
    const brandIds = (groups.find((g) => g.id === 'brand')?.colors ?? []).map((c) => c.id);
    brandIds.forEach((id) => {
      expect(commonIds.has(id)).toBe(false);
    });
  });

  it('has no color ID in both Most Used and Grays', () => {
    const groups = getColorGroups();
    const commonIds = new Set(
      (groups.find((g) => g.id === 'common')?.colors ?? []).map((c) => c.id)
    );
    const neutralIds = (groups.find((g) => g.id === 'neutral')?.colors ?? []).map((c) => c.id);
    neutralIds.forEach((id) => {
      expect(commonIds.has(id)).toBe(false);
    });
  });

  it('filters by purpose text and returns only text-safe colors', () => {
    const groups = getColorGroups('text');
    groups.forEach((group: ColorGroup) => {
      group.colors.forEach((c) => {
        expect(c.textSafe).toBe(true);
      });
    });
  });

  it('filters by purpose background and returns only background-safe colors', () => {
    const groups = getColorGroups('background');
    groups.forEach((group: ColorGroup) => {
      group.colors.forEach((c) => {
        expect(c.backgroundSafe).toBe(true);
      });
    });
  });
});
