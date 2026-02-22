/**
 * SpacingGroup
 *
 * Shared Layout section group: title–description gap, optional description–CTA gap,
 * optional bullet/screenshot spacing, and optional extra slots (Option B).
 * Wraps SpacingControl(s) in a single PropertyGroup.
 */

import React from 'react';
import { PropertyGroup } from './PropertyGroup';
import { SpacingControl, type SpacingSize } from './SpacingControl';

export interface SpacingExtraSlot {
  label: string;
  value: SpacingSize | undefined;
  onChange: (v: SpacingSize) => void;
}

export interface SpacingGroupProps {
  /** Primary gap (e.g. title–description). */
  primary: { value: SpacingSize | undefined; onChange: (v: SpacingSize) => void };
  /** Label for primary control. Default "Primary". */
  primaryLabel?: string;
  /** Optional secondary gap (e.g. description–CTA). Shown when showSecondary is true. */
  secondary?: { value: SpacingSize | undefined; onChange: (v: SpacingSize) => void };
  secondaryLabel?: string;
  showSecondary?: boolean;
  /** Optional bullet spacing (feature-list, feature-screenshot). */
  bullet?: { value: SpacingSize | undefined; onChange: (v: SpacingSize) => void };
  showBullet?: boolean;
  /** Optional screenshot spacing (feature-screenshot). */
  screenshot?: { value: SpacingSize | undefined; onChange: (v: SpacingSize) => void };
  showScreenshot?: boolean;
  /** Optional extra spacing controls (Option B). Rendered after primary/secondary/bullet/screenshot. */
  extra?: SpacingExtraSlot[];
}

export const SpacingGroup = React.memo(({
  primary,
  primaryLabel = 'Primary',
  secondary,
  secondaryLabel = 'Secondary',
  showSecondary = false,
  bullet,
  showBullet = false,
  screenshot,
  showScreenshot = false,
  extra = [],
}: SpacingGroupProps) => {
  return (
    <PropertyGroup title="Spacing" separator>
      <SpacingControl
        label={primaryLabel}
        value={primary.value}
        onChange={primary.onChange}
      />
      {showSecondary && secondary && (
        <SpacingControl
          label={secondaryLabel}
          value={secondary.value}
          onChange={secondary.onChange}
        />
      )}
      {showBullet && bullet && (
        <SpacingControl
          label="Bullet Spacing"
          value={bullet.value}
          onChange={bullet.onChange}
        />
      )}
      {showScreenshot && screenshot && (
        <SpacingControl
          label="Screenshot Spacing"
          value={screenshot.value}
          onChange={screenshot.onChange}
        />
      )}
      {extra.map((slot, i) => (
        <SpacingControl
          key={i}
          label={slot.label}
          value={slot.value}
          onChange={slot.onChange}
        />
      ))}
    </PropertyGroup>
  );
});
SpacingGroup.displayName = 'SpacingGroup';
