/**
 * VisibilityToggles
 *
 * Shared visibility toggles for content blocks: Title, Description, optional Badge.
 * Renders at the top of the Content section so all blocks use the same pattern.
 * Option A: use titleProp/descriptionProp/badgeProp when block uses different prop names (e.g. showBlockTitle).
 */

import React from 'react';
import { ToggleControl } from './ToggleControl';

export type VisibilityToggleKind = 'title' | 'description' | 'badge';

export interface VisibilityTogglesProps {
  /** Which toggles to show. Most blocks use ['title', 'description']; timeline also uses 'badge'. */
  toggles: VisibilityToggleKind[];
  showTitle: boolean | undefined;
  showDescription: boolean | undefined;
  showBadge?: boolean | undefined;
  /** Called with prop name and value, e.g. updateProp('showTitle', true) */
  updateProp: (key: string, value: boolean) => void;
  /** Prop key for title toggle (default 'showTitle'). Use 'showBlockTitle' for two-column, timeline. */
  titleProp?: string;
  /** Prop key for description toggle (default 'showDescription'). Use 'showBlockDescription' for two-column, timeline. */
  descriptionProp?: string;
  /** Prop key for badge toggle (default 'showBadge'). */
  badgeProp?: string;
  /** Default checked state for description when undefined (default true). Use false for timeline. */
  descriptionDefault?: boolean;
}

export const VisibilityToggles = React.memo(({
  toggles,
  showTitle,
  showDescription,
  showBadge = true,
  updateProp,
  titleProp = 'showTitle',
  descriptionProp = 'showDescription',
  badgeProp = 'showBadge',
  descriptionDefault = true,
}: VisibilityTogglesProps) => {
  const descChecked = showDescription ?? descriptionDefault;
  return (
    <>
      {toggles.includes('title') && (
        <ToggleControl
          id={`visibility-${titleProp}`}
          label="Title"
          checked={showTitle ?? true}
          onChange={(v) => updateProp(titleProp, v)}
        />
      )}
      {toggles.includes('description') && (
        <ToggleControl
          id={`visibility-${descriptionProp}`}
          label="Description"
          checked={descChecked}
          onChange={(v) => updateProp(descriptionProp, v)}
        />
      )}
      {toggles.includes('badge') && (
        <ToggleControl
          id={`visibility-${badgeProp}`}
          label="Badge"
          checked={showBadge ?? true}
          onChange={(v) => updateProp(badgeProp, v)}
        />
      )}
    </>
  );
});
VisibilityToggles.displayName = 'VisibilityToggles';
