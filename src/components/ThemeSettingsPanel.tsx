/**
 * Theme Settings Panel
 * Global theme controls that apply template-wide settings.
 * Includes branding (logo, primary color), spacing, typography, and content.
 */

import { Palette, Layout, Type, Settings, ImageIcon, LayoutGrid } from 'lucide-react';
import { 
  GlobalThemeSettings, 
  SpacingPreset, 
  TypographyScale,
  EmailWidth,
  ButtonStyle,
  ContentAlignment,
  EMAIL_LAYOUT_STYLES,
  type DefaultLogoSize,
  type EmailLayoutStyle
} from '../lib/global-theme';
import { 
  PropertyPanelContainer,
  PropertySections,
  PropertySection,
  PropertyGroup,
  ThemePickerControl,
  PresetButtonGroup,
  WidthControl,
  ButtonStyleControl,
  AlignmentControl,
  ColorControlV2,
  LogoSizeControl,
  SelectControl
} from './properties-panel';
import { ImageUploader } from './ImageUploader';
import { colorValueToHex } from '../lib/color-token-system';
import koreLogoDark from '../assets/kore-logo-dark.png';

interface ThemeSettingsPanelProps {
  globalTheme: GlobalThemeSettings;
  onThemeChange: (theme: GlobalThemeSettings) => void;
  onClose?: () => void;
}

export function ThemeSettingsPanel({ 
  globalTheme, 
  onThemeChange,
  onClose
}: ThemeSettingsPanelProps) {
  
  const updateTheme = (updates: Partial<GlobalThemeSettings>) => {
    onThemeChange({ ...globalTheme, ...updates });
  };

  return (
    <PropertyPanelContainer
      title="Theme Settings"
      onClose={onClose}
    >
      <PropertySections>

        {/* Email style */}
        <PropertySection 
          title="Email style" 
          icon={LayoutGrid}
        >
          <PropertyGroup>
            <SelectControl
              label="Layout style"
              value={globalTheme.emailLayoutStyle ?? 'copenhagen'}
              onChange={(value) => updateTheme({ emailLayoutStyle: value as EmailLayoutStyle })}
              options={Object.entries(EMAIL_LAYOUT_STYLES).map(([value, label]) => ({ value, label }))}
            />
          </PropertyGroup>
        </PropertySection>

        {/* Branding Section - Logo & primary color */}
        <PropertySection 
          title="Branding" 
          icon={ImageIcon}
        >
          <PropertyGroup>
            <ColorControlV2
              value={globalTheme.primaryColor}
              onChange={(v) => updateTheme({ primaryColor: colorValueToHex(v) })}
              label="Brand (primary) color"
              purpose="background"
            />
          </PropertyGroup>
          <PropertyGroup>
            <ImageUploader
              value={globalTheme.defaultLogoUrl ?? koreLogoDark}
              onChange={(url) => updateTheme({ defaultLogoUrl: url || undefined })}
              label="Default logo"
              aspectRatio="auto"
              maxSizeMB={1}
            />
            <LogoSizeControl
              value={(globalTheme.defaultLogoSize ?? 'md') as 'sm' | 'md' | 'lg' | 'xl'}
              onChange={(size) => updateTheme({ defaultLogoSize: size as DefaultLogoSize })}
              label="Default logo size"
            />
          </PropertyGroup>
        </PropertySection>
        
        {/* Block Theme Section */}
        <PropertySection 
          title="Block Theme" 
          icon={Palette}
        >
          <PropertyGroup>
            <ThemePickerControl
              value={globalTheme.defaultBlockTheme}
              onChange={(themeId) => updateTheme({ defaultBlockTheme: themeId })}
              label=""
              showNone={true}
              hidePreview={true}
            />
          </PropertyGroup>
        </PropertySection>

        {/* Spacing & Layout Section */}
        <PropertySection 
          title="Spacing & Layout" 
          icon={Layout}
        >
          <PropertyGroup>
            <PresetButtonGroup
              label="Spacing Preset"
              value={globalTheme.spacingPreset}
              onChange={(value) => updateTheme({ spacingPreset: value as SpacingPreset })}
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'standard', label: 'Standard' },
                { value: 'spacious', label: 'Spacious' }
              ]}
            />
            <WidthControl
              value={globalTheme.emailWidth}
              onChange={(value) => updateTheme({ emailWidth: value })}
              label="Email Width"
            />
          </PropertyGroup>
        </PropertySection>

        {/* Typography Section */}
        <PropertySection 
          title="Typography" 
          icon={Type}
        >
          <PropertyGroup>
            <PresetButtonGroup
              label="Text Scale"
              value={globalTheme.typographyScale}
              onChange={(value) => updateTheme({ typographyScale: value as TypographyScale })}
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'standard', label: 'Standard' },
                { value: 'comfortable', label: 'Comfortable' }
              ]}
            />
          </PropertyGroup>
        </PropertySection>

        {/* Content Section */}
        <PropertySection 
          title="Content" 
          icon={Settings}
        >
          <PropertyGroup>
            <AlignmentControl
              value={globalTheme.defaultAlignment}
              onChange={(value) => updateTheme({ defaultAlignment: value })}
              label="Default Alignment"
            />
            
            <ButtonStyleControl
              value={globalTheme.buttonStyle}
              onChange={(value) => updateTheme({ buttonStyle: value })}
              label="Button Corners"
            />
          </PropertyGroup>
        </PropertySection>

      </PropertySections>
    </PropertyPanelContainer>
  );
}