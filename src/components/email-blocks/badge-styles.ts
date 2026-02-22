// SHARED: Badge styles for content blocks
// Used across: FeatureWithScreenshot, TextOnlyBlock, FeatureList, MultiUpdate

export const BADGE_STYLES = {
  new: { bg: '#10b981', color: '#ffffff', text: 'NEW' },
  updated: { bg: '#3b82f6', color: '#ffffff', text: 'UPDATED' },
  beta: { bg: '#d97706', color: '#ffffff', text: 'BETA' },
  improved: { bg: '#8b5cf6', color: '#ffffff', text: 'IMPROVED' },
  enterprise: { bg: '#0f172a', color: '#ffffff', text: 'ENTERPRISE' },
  included: { bg: '#059669', color: '#ffffff', text: 'INCLUDED' }
} as const;

export type BadgeType = keyof typeof BADGE_STYLES;
