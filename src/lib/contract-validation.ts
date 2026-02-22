/**
 * Dev-only contract validation for BMAD cleanup (Phase 1).
 * Logs prop-name consistency between panel expectations and block defaults.
 * Remove or gate behind __DEV__ if not needed in production.
 */

import {
  FEATURE_LIST_DEFAULTS,
  FEATURE_SCREENSHOT_DEFAULTS,
  IMAGE_CONTENT_DEFAULTS,
  TEXT_ONLY_DEFAULTS,
  TWO_COLUMN_DEFAULTS,
  MULTI_UPDATE_DEFAULTS,
  TIMELINE_DEFAULTS,
  STATS_METRICS_DEFAULTS,
  ITEM_GRID_DEFAULTS,
  WARNING_DEFAULTS,
  VIDEO_DEFAULTS,
  CODE_SNIPPET_DEFAULTS,
} from './block-defaults';

type DefaultsRecord = Record<string, unknown>;

const CONTENT_BLOCK_DEFAULTS: { name: string; defaults: DefaultsRecord }[] = [
  { name: 'feature-list', defaults: FEATURE_LIST_DEFAULTS as DefaultsRecord },
  { name: 'feature-screenshot', defaults: FEATURE_SCREENSHOT_DEFAULTS as DefaultsRecord },
  { name: 'image-content', defaults: IMAGE_CONTENT_DEFAULTS as DefaultsRecord },
  { name: 'text-only', defaults: TEXT_ONLY_DEFAULTS as DefaultsRecord },
  { name: 'two-column', defaults: TWO_COLUMN_DEFAULTS as DefaultsRecord },
  { name: 'multi-update', defaults: MULTI_UPDATE_DEFAULTS as DefaultsRecord },
  { name: 'timeline', defaults: TIMELINE_DEFAULTS as DefaultsRecord },
  { name: 'stats-metrics', defaults: STATS_METRICS_DEFAULTS as DefaultsRecord },
  { name: 'item-grid', defaults: ITEM_GRID_DEFAULTS as DefaultsRecord },
  { name: 'warning', defaults: WARNING_DEFAULTS as DefaultsRecord },
  { name: 'video-block', defaults: VIDEO_DEFAULTS as DefaultsRecord },
  { name: 'code-snippet', defaults: CODE_SNIPPET_DEFAULTS as DefaultsRecord },
];

const LEGACY_TYPOGRAPHY_PROPS = ['titleFontSize', 'descriptionFontSize'];
const SEMANTIC_TYPOGRAPHY_PROPS = ['titleSize', 'descriptionSize'];

/**
 * Run once in development to validate that content blocks use semantic
 * typography props (titleSize, descriptionSize) and do not use legacy
 * titleFontSize/descriptionFontSize. Header/Footer are allowed to use
 * titleFontSize/descriptionFontSize.
 */
export function validateContentBlockTypographyContract(): void {
  const isDev =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV === true) ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');
  if (!isDev) return;

  const issues: string[] = [];
  for (const { name, defaults } of CONTENT_BLOCK_DEFAULTS) {
    for (const legacy of LEGACY_TYPOGRAPHY_PROPS) {
      if (legacy in defaults) {
        issues.push(`block-defaults: ${name} has legacy "${legacy}" (prefer semantic titleSize/descriptionSize)`);
      }
    }
    const hasSemantic = SEMANTIC_TYPOGRAPHY_PROPS.some((p) => p in defaults);
    if (!hasSemantic && (name === 'feature-list' || name === 'text-only' || name === 'feature-screenshot')) {
      issues.push(`block-defaults: ${name} missing semantic titleSize/descriptionSize`);
    }
  }

  if (issues.length > 0) {
    console.warn('[BMAD contract validation] Typography prop consistency:', issues);
  } else {
    console.info('[BMAD contract validation] Content block typography contract OK (semantic props, no legacy in content blocks).');
  }
}
