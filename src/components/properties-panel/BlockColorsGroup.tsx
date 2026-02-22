/**
 * BlockColorsGroup
 *
 * Shared Colors section for content blocks: Theme picker, ThemeStyleOptions (colorful/swap),
 * Custom Colors (background, title, description, CTA), and optional extra colors (Option B).
 */

import React from 'react';
import { PropertyGroup } from './PropertyGroup';
import { ThemePickerControl } from './ThemePickerControl';
import { ThemeStyleOptions } from './ThemeStyleOptions';
import { ColorControlV2 } from './ColorControlV2';
import type { ColorValue } from '../../lib/color-token-system';

export interface BlockColorsGroupThemeStyleCallbacks {
  onColorfulChange: (colorful: boolean) => void;
  onSwapChange: (swapped: boolean) => void;
}

export interface BlockColorsGroupExtraColor {
  label: string;
  value: ColorValue | undefined;
  onChange: (value: ColorValue) => void;
  purpose?: 'text' | 'background' | 'all';
}

export interface BlockColorsGroupProps {
  theme: string | undefined;
  onThemeChange: (themeId: string | undefined) => void;
  showNone?: boolean;
  globalDefaultTheme?: string;
  colorfulMode: boolean;
  themeSwapped: boolean;
  themeStyleCallbacks: BlockColorsGroupThemeStyleCallbacks;
  backgroundColor: ColorValue | undefined;
  titleColor: ColorValue | undefined;
  descriptionColor: ColorValue | undefined;
  ctaColor: ColorValue | undefined;
  updateProp: (key: string, value: unknown) => void;
  showTitle?: boolean;
  showDescription?: boolean;
  showCTA?: boolean;
  /** Theme ID and zone for ColorControlV2 (theme tokens). Default zone 'body'. */
  currentThemeId?: string;
  themeZone?: 'header' | 'body' | 'footer';
  /** Optional label overrides for Custom Colors (e.g. descriptionLabel="Message" for warning block). */
  titleColorLabel?: string;
  descriptionColorLabel?: string;
  /** Optional extra color controls (Option B). Rendered after CTA in Custom Colors. */
  extraColors?: BlockColorsGroupExtraColor[];
  /** When true, do not show Theme picker or theme style options (e.g. for code-snippet where only custom colors apply). */
  hideThemePicker?: boolean;
}

export const BlockColorsGroup = React.memo(({
  theme,
  onThemeChange,
  showNone = true,
  globalDefaultTheme,
  colorfulMode,
  themeSwapped,
  themeStyleCallbacks,
  backgroundColor,
  titleColor,
  descriptionColor,
  ctaColor,
  updateProp,
  showTitle = true,
  showDescription = true,
  showCTA = true,
  currentThemeId,
  themeZone = 'body',
  titleColorLabel = 'Title',
  descriptionColorLabel = 'Body Text',
  extraColors = [],
  hideThemePicker = false,
}: BlockColorsGroupProps) => {
  const showThemeStyle = !hideThemePicker && !!(theme || globalDefaultTheme);

  return (
    <>
      {!hideThemePicker && (
        <>
          <ThemePickerControl
            value={theme}
            onChange={onThemeChange}
            label="Theme"
            showNone={showNone}
            globalDefaultTheme={globalDefaultTheme}
          />
          {showThemeStyle && (
            <ThemeStyleOptions
              colorfulMode={colorfulMode}
              themeSwapped={themeSwapped}
              {...themeStyleCallbacks}
            />
          )}
        </>
      )}
      <PropertyGroup title="Custom Colors" separator>
        <ColorControlV2
          value={backgroundColor}
          onChange={(value) => updateProp('backgroundColor', value)}
          label="Background"
          purpose="background"
          currentThemeId={currentThemeId}
          themeZone={themeZone}
        />
        {(showTitle ?? true) && (
          <ColorControlV2
            value={titleColor}
            onChange={(value) => updateProp('titleColor', value)}
            label={titleColorLabel}
            purpose="text"
            currentThemeId={currentThemeId}
            themeZone={themeZone}
          />
        )}
        {(showDescription ?? true) && (
          <ColorControlV2
            value={descriptionColor}
            onChange={(value) => updateProp('descriptionColor', value)}
            label={descriptionColorLabel}
            purpose="text"
            currentThemeId={currentThemeId}
            themeZone={themeZone}
          />
        )}
        {(showCTA ?? true) && (
          <ColorControlV2
            value={ctaColor}
            onChange={(value) => updateProp('ctaColor', value)}
            label="CTA"
            purpose="text"
            currentThemeId={currentThemeId}
            themeZone={themeZone}
          />
        )}
        {extraColors.map((ec, i) => (
          <ColorControlV2
            key={i}
            value={ec.value}
            onChange={ec.onChange}
            label={ec.label}
            purpose={ec.purpose ?? 'all'}
            currentThemeId={currentThemeId}
            themeZone={themeZone}
          />
        ))}
      </PropertyGroup>
    </>
  );
});
BlockColorsGroup.displayName = 'BlockColorsGroup';
