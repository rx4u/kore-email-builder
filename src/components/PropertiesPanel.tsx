import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Plus, Trash2, X, Sparkles, Type, Layout, Settings, Palette } from 'lucide-react';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';
import type { BadgeType } from './email-blocks/badge-styles';
import { iconSizes } from '../lib/design-tokens';
import { COLORS } from './email-blocks/email-styles';
import type { HeaderConfig, FooterConfig } from './EmailSettings';
import { applyPreset, detectPreset, type PresetStyle, PRESET_METADATA } from '../lib/block-presets';
import { ImageUploader } from './ImageUploader';
import { AlignmentControl } from './properties-panel/AlignmentControl';
import { ColorControlV2 } from './properties-panel/ColorControlV2';
import { FontSizeControl } from './properties-panel/FontSizeControl';
import { SpacingControl } from './properties-panel/SpacingControl';
import { LogoSizeControl, getLogoPixelValue, migrateLogoWidth, type LogoSize } from './properties-panel/LogoSizeControl';
import { ThemePickerControl } from './properties-panel/ThemePickerControl';
import { ThemeStyleOptions } from './properties-panel/ThemeStyleOptions';
import { getColorHex } from '../lib/color-palette-v2';
import { getThemeById } from '../lib/theme-catalog';
import { applyThemeToBlock } from '../lib/theme-application';
import { PanelHeader } from './ui/PanelHeader';
import { migrateToColorValue, colorValueToHex, isColorValue, createColorToken, type ColorValue, type ColorId } from '../lib/color-token-system';

/** Shared callbacks for ThemeStyleOptions so we don't repeat ColorfulMode + ThemeSwap logic in every block. */
function makeThemeStyleCallbacks(
  block: ContentBlock,
  globalDefaultTheme: string | undefined,
  updateProps: (patch: Record<string, unknown>) => void
) {
  return {
    onColorfulChange(colorful: boolean) {
      const effectiveTheme = block.props.theme || globalDefaultTheme;
      if (!effectiveTheme) return;
      const zone = colorful ? 'header' : 'body';
      const themeColors = applyThemeToBlock(effectiveTheme, block.props.themeSwapped || false, zone);
      if (themeColors) {
        updateProps({
          theme: effectiveTheme,
          colorfulMode: colorful,
          backgroundColor: createColorToken(themeColors.backgroundColor),
          titleColor: createColorToken(themeColors.titleColor),
          descriptionColor: createColorToken(themeColors.descriptionColor),
          ctaColor: createColorToken(themeColors.ctaColor),
        });
      }
    },
    onSwapChange(swapped: boolean) {
      const effectiveTheme = block.props.theme || globalDefaultTheme;
      if (!effectiveTheme) return;
      const zone = block.props.colorfulMode ? 'header' : 'body';
      const themeColors = applyThemeToBlock(effectiveTheme, swapped, zone);
      if (themeColors) {
        updateProps({
          theme: effectiveTheme,
          themeSwapped: swapped,
          backgroundColor: createColorToken(themeColors.backgroundColor),
          titleColor: createColorToken(themeColors.titleColor),
          descriptionColor: createColorToken(themeColors.descriptionColor),
          ctaColor: createColorToken(themeColors.ctaColor),
        });
      }
    },
  };
}

// New unified component system
import { 
  PropertyPanelContainer,
  PropertySections,
  PropertySection,
  SectionGroup,
  PropertyGroup,
  TextInputControl,
  TextareaControl,
  ToggleControl,
  SelectControl,
  BadgeSelectControl,
  ContentBadgeSelectControl,
  DateInputControl,
  SemanticPaddingControl,
  PresetStylesSection,
  VisibilityToggles,
  SpacingGroup,
  BlockColorsGroup,
  CTATypeControl,
  type CTAType,
  AlertTypeControl,
  type AlertType
} from './properties-panel';

import { PANEL_SECTION_GROUPS } from '../lib/panel-section-contract';

export type ContentBlockType = 
  | 'feature-screenshot' 
  | 'feature-list' 
  | 'text-only' 
  | 'multi-update' 
  | 'item-grid' 
  | 'warning'
  | 'code-snippet'
  | 'two-column'
  | 'video-block'
  | 'stats-metrics'
  | 'timeline'
  | 'divider'
  | 'image-content'
  | 'hero'
  | 'changelog'
  | 'deprecation'
  | 'metrics-snapshot'
  | 'nps-rating';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  props: any;
}

interface PropertiesPanelProps {
  selectedId: 'header' | 'footer' | string;
  block: ContentBlock | null;
  header?: HeaderConfig;
  footer?: FooterConfig;
  onBlockChange: (block: ContentBlock) => void;
  onHeaderChange?: (header: HeaderConfig) => void;
  onFooterChange?: (footer: FooterConfig) => void;
  onClose: () => void;
  onApplyGlobalDefaults?: () => void;
  globalDefaultTheme?: string;
}

export function PropertiesPanel({ 
  selectedId, 
  block, 
  header, 
  footer, 
  onBlockChange, 
  onHeaderChange, 
  onFooterChange, 
  onClose,
  onApplyGlobalDefaults,
  globalDefaultTheme
}: PropertiesPanelProps) {
  // Handle header editing
  if (selectedId === 'header' && header && onHeaderChange) {
    return (
      <PropertyPanelContainer
        title="Header Properties"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <TextInputControl
              label="Title"
              value={header.title}
              onChange={(v) => onHeaderChange({ ...header, title: v })}
              placeholder="Email subject line..."
            />
            
            <PropertyGroup title="Product Name" separator>
              <ToggleControl
                id="show-product-name"
                label="Product Name"
                checked={header.showProductName ?? true}
                onChange={(v) => onHeaderChange({ ...header, showProductName: v })}
              />
              
              {(header.showProductName ?? true) && (
                <>
                  <TextInputControl
                    label="Product Name"
                    value={header.productName || ''}
                    onChange={(v) => onHeaderChange({ ...header, productName: v })}
                    placeholder="AI for Work"
                  />
                  
                  <FontSizeControl
                    label="Font Size"
                    value={header.productNameFontSize || 20}
                    onChange={(v) => onHeaderChange({ ...header, productNameFontSize: v })}
                    min={12}
                    max={28}
                  />
                </>
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Metadata" separator>
              <ToggleControl
                id="show-date"
                label="Date"
                checked={header.showDate}
                onChange={(v) => onHeaderChange({ ...header, showDate: v })}
              />
              
              {header.showDate !== false && (
                <DateInputControl
                  value={header.date}
                  onChange={(v) => onHeaderChange({ ...header, date: v })}
                />
              )}
              
              <TextInputControl
                label="Version"
                value={header.versionText}
                onChange={(v) => onHeaderChange({ ...header, versionText: v })}
                placeholder="v3.2.0"
              />
              
              <SelectControl
                label="Style"
                value={header.versionBadgeStyle || 'outlined'}
                onChange={(v) => onHeaderChange({ ...header, versionBadgeStyle: v as any })}
                options={[
                  { value: 'outlined', label: 'Outlined' },
                  { value: 'filled', label: 'Filled' },
                  { value: 'accent', label: 'Accent' },
                ]}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Logo" separator>
              <ToggleControl
                id="show-logo"
                label="Logo"
                checked={header.showLogo}
                onChange={(v) => onHeaderChange({ ...header, showLogo: v })}
              />
              
              {header.showLogo !== false && (
                <>
                  <ImageUploader
                    value={header.logoSrc || ''}
                    onChange={(url) => onHeaderChange({ ...header, logoSrc: url })}
                    label="Image"
                    aspectRatio="auto"
                    maxSizeMB={1}
                  />
                  
                  <LogoSizeControl
                    value={header.logoSize || migrateLogoWidth(header.logoWidth).size}
                    onChange={(v) => {
                      const size = v as 'sm' | 'md' | 'lg' | 'xl';
                      const pixels = { sm: 60, md: 80, lg: 120, xl: 160 }[size];
                      onHeaderChange({ 
                        ...header, 
                        logoSize: size,
                        logoCustomWidth: pixels
                      });
                    }}
                  />
                </>
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={header.padding}
              onChange={(v) => onHeaderChange({ ...header, padding: v as any })}
            />
            
            <AlignmentControl
              value={(header.contentAlignment || 'left') as 'left' | 'center' | 'right'}
              onChange={(v) => onHeaderChange({ ...header, contentAlignment: v })}
              label="Alignment"
            />
            
            <PropertyGroup title="Spacing" separator>
              {header.showLogo && (
                <SpacingControl
                  label="Primary"
                  value={header.logoTitleGap as any}
                  onChange={(v) => onHeaderChange({ ...header, logoTitleGap: v })}
                  includeXXL={true}
                />
              )}
              
              {header.showDate !== false && (
                <SpacingControl
                  label="Secondary"
                  value={header.titleDateGap as any}
                  onChange={(v) => onHeaderChange({ ...header, titleDateGap: v })}
                />
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            <FontSizeControl
              label="Title"
              value={header.titleFontSize || 32}
              onChange={(v) => onHeaderChange({ ...header, titleFontSize: v })}
              min={20}
              max={48}
            />
            
            {header.showDate !== false && (
              <FontSizeControl
                label="Caption"
                value={header.dateFontSize || 14}
                onChange={(v) => onHeaderChange({ ...header, dateFontSize: v })}
                min={12}
                max={24}
              />
            )}
          </PropertySection>          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <ThemePickerControl
              value={header.theme}
              onChange={(themeId) => {
                if (themeId) {
                  // Apply theme colors immediately
                  const theme = getThemeById(themeId);
                  if (theme) {
                    onHeaderChange({ 
                      ...header, 
                      theme: themeId,
                      backgroundColor: createColorToken(theme.header.bg),
                      titleColor: createColorToken(theme.header.fg),
                      dateColor: createColorToken(theme.header.fg),
                    });
                  }
                } else {
                  // Clear theme
                  onHeaderChange({ ...header, theme: undefined });
                }
              }}
              label="Theme"
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
            />
            
            <PropertyGroup title="Custom Colors" separator>
              <ColorControlV2
                value={header.backgroundColor || { id: 'brand-600' }}
                onChange={(value) => onHeaderChange({ ...header, backgroundColor: value })}
                label="Background"
                purpose="background"
                currentThemeId={header.theme}
                themeZone="header"
              />

              <ColorControlV2
                value={header.titleColor || { id: 'white' }}
                onChange={(value) => onHeaderChange({ ...header, titleColor: value })}
                label="Title"
                purpose="text"
                currentThemeId={header.theme}
                themeZone="header"
              />

              {header.showDate !== false && (
                <ColorControlV2
                  value={header.dateColor || { id: 'white' }}
                  onChange={(value) => onHeaderChange({ ...header, dateColor: value })}
                  label="Caption"
                  purpose="text"
                  currentThemeId={header.theme}
                  themeZone="header"
                />
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // Handle footer editing
  if (selectedId === 'footer' && footer && onFooterChange) {
    return (
      <PropertyPanelContainer
        title="Footer Properties"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <TextareaControl
              label="Message"
              value={footer.message}
              onChange={(v) => onFooterChange({ ...footer, message: v })}
              rows={2}
            />
            
            <PropertyGroup title="Contact" separator>
              <TextInputControl
                label="Team Name"
                value={footer.teamName}
                onChange={(v) => onFooterChange({ ...footer, teamName: v })}
              />
              
              <TextInputControl
                label="Email"
                value={footer.email}
                onChange={(v) => onFooterChange({ ...footer, email: v })}
                type="email"
              />
              
              <TextInputControl
                label="Website"
                value={footer.website}
                onChange={(v) => onFooterChange({ ...footer, website: v })}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Legal" separator>
              <TextareaControl
                label="Disclaimer"
                value={footer.disclaimer}
                onChange={(v) => onFooterChange({ ...footer, disclaimer: v })}
                rows={2}
              />
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={footer.padding}
              onChange={(v) => onFooterChange({ ...footer, padding: v as any })}
            />
            
            <AlignmentControl
              value={(footer.contentAlignment || 'center') as 'left' | 'center' | 'right'}
              onChange={(v) => onFooterChange({ ...footer, contentAlignment: v })}
              label="Alignment"
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            <FontSizeControl
              label="Body Text"
              value={footer.messageFontSize || 16}
              onChange={(v) => onFooterChange({ ...footer, messageFontSize: v })}
              min={12}
              max={18}
            />
            
            <FontSizeControl
              label="Label"
              value={footer.teamNameFontSize || 16}
              onChange={(v) => onFooterChange({ ...footer, teamNameFontSize: v })}
              min={12}
              max={18}
            />
            
            <FontSizeControl
              label="Caption"
              value={footer.disclaimerFontSize || 12}
              onChange={(v) => onFooterChange({ ...footer, disclaimerFontSize: v })}
              min={10}
              max={16}
            />
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <ThemePickerControl
              value={footer.theme}
              onChange={(themeId) => {
                if (themeId) {
                  // Apply theme colors immediately
                  const theme = getThemeById(themeId);
                  if (theme) {
                    onFooterChange({ 
                      ...footer, 
                      theme: themeId,
                      backgroundColor: createColorToken(theme.footer.bg),
                      messageColor: createColorToken(theme.footer.fg),
                      teamNameColor: createColorToken(theme.footer.fg),
                      linkColor: createColorToken(theme.footer.fg),
                      disclaimerColor: createColorToken(theme.footer.fg),
                    });
                  }
                } else {
                  // Clear theme
                  onFooterChange({ ...footer, theme: undefined });
                }
              }}
              label="Theme"
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
            />
            
            <PropertyGroup title="Custom Colors" separator>
              <ColorControlV2
                value={footer.backgroundColor || { id: 'neutral-50' }}
                onChange={(value) => onFooterChange({ ...footer, backgroundColor: value })}
                label="Background"
                purpose="background"
                currentThemeId={footer.theme}
                themeZone="footer"
              />

              <ColorControlV2
                value={footer.messageColor || { id: 'neutral-600' }}
                onChange={(value) => onFooterChange({ ...footer, messageColor: value })}
                label="Body Text"
                purpose="text"
                currentThemeId={footer.theme}
                themeZone="footer"
              />

              <ColorControlV2
                value={footer.teamNameColor || { id: 'neutral-900' }}
                onChange={(value) => onFooterChange({ ...footer, teamNameColor: value })}
                label="Label"
                purpose="text"
                currentThemeId={footer.theme}
                themeZone="footer"
              />

              <ColorControlV2
                value={footer.linkColor || { id: 'brand-600' }}
                onChange={(value) => onFooterChange({ ...footer, linkColor: value })}
                label="Links"
                purpose="text"
                currentThemeId={footer.theme}
                themeZone="footer"
              />

              <ColorControlV2
                value={footer.disclaimerColor || { id: 'neutral-400' }}
                onChange={(value) => onFooterChange({ ...footer, disclaimerColor: value })}
                label="Caption"
                purpose="text"
                currentThemeId={footer.theme}
                themeZone="footer"
              />
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // Handle content block editing
  if (!block) {
    return null; // Hide panel when no block selected
  }

  // Ensure block.props exists
  if (!block.props) {
    block.props = {};
  }

  const updateProp = (path: string, value: any) => {
    console.log('🔧 PropertiesPanel.updateProp called:', { path, value, blockType: block.type });
    const keys = path.split('.');
    const newProps = { ...block.props };
    let current = newProps;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    console.log('🔧 PropertiesPanel.updateProp: Calling onBlockChange with new props:', newProps);
    onBlockChange({ ...block, props: newProps });
  };
  
  // Helper to update multiple properties at once (batched update)
  const updateProps = (updates: Record<string, any>) => {
    console.log('🔧 PropertiesPanel.updateProps (batch) called:', { updates, blockType: block.type });
    const newProps = { ...block.props, ...updates };
    console.log('🔧 PropertiesPanel.updateProps: Calling onBlockChange with new props:', newProps);
    onBlockChange({ ...block, props: newProps });
  };

  const updateArrayItem = (arrayPath: string, index: number, itemPath: string, value: any) => {
    const array = [...block.props[arrayPath]];
    if (itemPath) {
      array[index] = { ...array[index], [itemPath]: value };
    } else {
      array[index] = value;
    }
    updateProp(arrayPath, array);
  };

  const addArrayItem = (arrayPath: string, defaultItem: any) => {
    const array = [...(block.props[arrayPath] || [])];
    array.push(defaultItem);
    updateProp(arrayPath, array);
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    const array = [...block.props[arrayPath]];
    array.splice(index, 1);
    updateProp(arrayPath, array);
  };

  const getBlockTitle = () => {
    switch (block.type) {
      case 'feature-screenshot': return 'Feature with Screenshot';
      case 'feature-list': return 'Feature List';
      case 'text-only': return 'Text Block';
      case 'multi-update': return 'Multi-Update';
      case 'item-grid': return 'Item Grid';
      case 'warning': return 'Alert Block';
      case 'code-snippet': return 'Code Snippet';
      case 'two-column': return 'Two Column';
      case 'video-block': return 'Video Block';
      case 'stats-metrics': return 'Stats & Metrics';
      case 'timeline': return 'Timeline';
      case 'divider': return 'Divider';
      case 'image-content': return 'Image + Content';
      case 'hero': return 'Hero';
      default: return 'Block Properties';
    }
  };

  const getBlockSpecificTitle = () => {
    switch (block.type) {
      case 'feature-screenshot': return 'Screenshot Options';
      case 'feature-list': return 'Feature List';
      case 'text-only': return 'Text Options';
      case 'multi-update': return 'Updates';
      case 'item-grid': return 'Grid Items';
      case 'warning': return 'Warning Settings';
      case 'code-snippet': return 'Code Settings';
      case 'two-column': return 'Column Content';
      case 'video-block': return 'Video Settings';
      case 'stats-metrics': return 'Statistics';
      case 'timeline': return 'Timeline Events';
      case 'divider': return 'Divider Settings';
      case 'image-content': return 'Image & Content';
      case 'hero': return 'Hero Settings';
      default: return 'Block Settings';
    }
  };

  // ========== DIVIDER BLOCK ==========
  if (block.type === 'divider') {
    return (
      <PropertyPanelContainer
        title="Divider"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["style", "layout", "colors"]}>
          <SectionGroup label="Style" showDivider={false}>
          {/* Style Section */}
          <PropertySection id="style" icon={Settings} title="Style">
            <SelectControl
              label="Line Style"
              value={block.props.style || 'solid'}
              onChange={(v) => updateProp('style', v)}
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' },
              ]}
            />
            
            <SelectControl
              label="Thickness"
              value={block.props.thickness || 'thin'}
              onChange={(v) => updateProp('thickness', v)}
              options={[
                { value: 'thin', label: 'Thin (1px)' },
                { value: 'medium', label: 'Medium (2px)' },
                { value: 'thick', label: 'Thick (3px)' },
              ]}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SelectControl
              label="Vertical Spacing"
              value={block.props.spacing || 'normal'}
              onChange={(v) => updateProp('spacing', v)}
              options={[
                { value: 'compact', label: 'Compact (16px)' },
                { value: 'normal', label: 'Normal (24px)' },
                { value: 'spacious', label: 'Spacious (40px)' },
              ]}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <ColorControlV2
              value={migrateToColorValue(block.props.color || { id: 'neutral-200' })}
              onChange={(value) => updateProp('color', value)}
              label="Line Color"
              purpose="border"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== TEXT-ONLY BLOCK ==========
  if (block.type === 'text-only') {
    return (
      <PropertyPanelContainer
        title="Text Block"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
            {/* Preset Styles */}
            <PresetStylesSection
              currentPreset={detectPreset(block.props)}
              onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
            />
            
            {/* Content Section */}
            <PropertySection id="content" icon={Type} title="Content">
              <PropertyGroup title="Title" separator>
                <VisibilityToggles
                  toggles={['title']}
                  showTitle={block.props.showTitle}
                  showDescription={block.props.showDescription}
                  updateProp={updateProp}
                />
                {(block.props.showTitle ?? true) && (
                  <TextInputControl
                    label="Text"
                    value={block.props.title || ''}
                    onChange={(v) => updateProp('title', v)}
                    placeholder="Enter title..."
                  />
                )}
              </PropertyGroup>

              <PropertyGroup title="Badge" separator>
                <ContentBadgeSelectControl
                  value={block.props.badge}
                  onChange={(v) => updateProp('badge', v)}
                  hideLabel
                />
              </PropertyGroup>
              
              <PropertyGroup title="Description" separator>
                <VisibilityToggles
                  toggles={['description']}
                  showTitle={block.props.showTitle}
                  showDescription={block.props.showDescription}
                  updateProp={updateProp}
                />
                {(block.props.showDescription ?? true) && (
                  <TextareaControl
                    label="Text"
                    value={block.props.description || ''}
                    onChange={(v) => updateProp('description', v)}
                    rows={3}
                  />
                )}
              </PropertyGroup>
              
              <PropertyGroup title="Call-to-Action" separator>
                <ToggleControl
                  id="show-cta"
                  label="Call-to-Action"
                  checked={block.props.showCTA ?? true}
                  onChange={(v) => updateProp('showCTA', v)}
                />
                
                {(block.props.showCTA ?? true) && (
                  <>
                    <TextInputControl
                      label="Button Text"
                      value={block.props.ctaText || ''}
                      onChange={(v) => updateProp('ctaText', v)}
                      placeholder="Learn more"
                    />
                    
                    <TextInputControl
                      label="Link URL"
                      value={block.props.ctaLink || ''}
                      onChange={(v) => updateProp('ctaLink', v)}
                      type="url"
                      placeholder="https://example.com"
                    />
                    
                    <CTATypeControl
                      value={block.props.ctaStyle as CTAType}
                      onChange={(v) => updateProp('ctaStyle', v)}
                    />
                  </>
                )}
              </PropertyGroup>
            </PropertySection>
          </SectionGroup>
          
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
            {/* Layout Section */}
            <PropertySection id="layout" icon={Layout} title="Layout">
              <SemanticPaddingControl
                value={block.props.padding}
                onChange={(v) => updateProp('padding', v)}
              />
              
              <AlignmentControl
                value={block.props.contentAlign as 'left' | 'center' | 'right'}
                onChange={(v) => updateProp('contentAlign', v)}
                label="Alignment"
              />
              
              <SpacingGroup
                primary={{ value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }}
                secondary={{ value: block.props.descriptionCtaGap, onChange: (v) => updateProp('descriptionCtaGap', v) }}
                showSecondary={block.props.showCTA ?? true}
                secondaryLabel="Secondary"
              />
            </PropertySection>
          </SectionGroup>
          
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
            {/* Typography Section */}
            <PropertySection id="typography" icon={Type} title="Typography">
              {(block.props.showTitle ?? true) && (
                <FontSizeControl
                  label="Title"
                  value={block.props.titleSize || 28}
                  onChange={(v) => updateProp('titleSize', v)}
                  min={20}
                  max={48}
                />
              )}
              
              {(block.props.showDescription ?? true) && (
                <FontSizeControl
                  label="Body Text"
                  value={block.props.descriptionSize || 16}
                  onChange={(v) => updateProp('descriptionSize', v)}
                  min={12}
                  max={24}
                />
              )}
            </PropertySection>
            
            {/* Colors Section */}
            <PropertySection id="colors" icon={Palette} title="Colors">
              <BlockColorsGroup
                theme={block.props.theme}
                onThemeChange={(themeId) => {
                  if (themeId) {
                    const currentColorfulMode = block.props.colorfulMode || false;
                    const zone = currentColorfulMode ? 'header' : 'body';
                    const themeColors = applyThemeToBlock(themeId, block.props.themeSwapped || false, zone);
                    if (themeColors) {
                      updateProps({
                        theme: themeId,
                        colorfulMode: currentColorfulMode,
                        backgroundColor: createColorToken(themeColors.backgroundColor),
                        titleColor: createColorToken(themeColors.titleColor),
                        descriptionColor: createColorToken(themeColors.descriptionColor),
                        ctaColor: createColorToken(themeColors.ctaColor)
                      });
                    }
                  } else {
                    updateProp('theme', undefined);
                  }
                }}
                showNone={true}
                globalDefaultTheme={globalDefaultTheme}
                colorfulMode={block.props.colorfulMode ?? false}
                themeSwapped={block.props.themeSwapped ?? false}
                themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
                backgroundColor={block.props.backgroundColor || { id: 'white' }}
                titleColor={block.props.titleColor || { id: 'neutral-900' }}
                descriptionColor={block.props.descriptionColor || { id: 'neutral-600' }}
                ctaColor={block.props.ctaColor}
                updateProp={updateProp}
                showTitle={block.props.showTitle ?? true}
                showDescription={block.props.showDescription ?? true}
                showCTA={block.props.showCTA ?? true}
                currentThemeId={block.props.theme}
                themeZone="body"
              />
            </PropertySection>
          </SectionGroup>
          
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== FEATURE-LIST BLOCK ==========
  if (block.type === 'feature-list') {
    const bullets = block.props.bullets || [];
    
    return (
      <PropertyPanelContainer
        title="Feature List"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Enter title..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Badge" separator>
              <ContentBadgeSelectControl
                value={block.props.badge}
                onChange={(v) => updateProp('badge', v)}
                hideLabel
              />
            </PropertyGroup>
            
            <PropertyGroup title="Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showDescription ?? true) && (
                <TextareaControl
                  label="Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  rows={3}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="List Items" separator>
              <ToggleControl
                id="show-bullets"
                label="List Items"
                checked={block.props.showBullets ?? true}
                onChange={(v) => updateProp('showBullets', v)}
              />
              
              {(block.props.showBullets ?? true) && (
                <div className="space-y-2">
                  {bullets.map((bullet: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={bullet}
                        onChange={(e) => updateArrayItem('bullets', index, '', e.target.value)}
                        placeholder="List item..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('bullets', index)}
                        className="h-9 w-9 p-0 shrink-0"
                      >
                        <Trash2 className={iconSizes.sm} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addArrayItem('bullets', '')}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className={`${iconSizes.sm} mr-2`} />
                    Add Item
                  </Button>
                </div>
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Call-to-Action" separator>
              <ToggleControl
                id="show-cta"
                label="Call-to-Action"
                checked={block.props.showCTA ?? true}
                onChange={(v) => updateProp('showCTA', v)}
              />
              
              {(block.props.showCTA ?? true) && (
                <>
                  <TextInputControl
                    label="Button Text"
                    value={block.props.ctaText || ''}
                    onChange={(v) => updateProp('ctaText', v)}
                    placeholder="Learn more"
                  />
                  
                  <TextInputControl
                    label="Link URL"
                    value={block.props.ctaLink || ''}
                    onChange={(v) => updateProp('ctaLink', v)}
                    type="url"
                    placeholder="https://example.com"
                  />
                  
                  <CTATypeControl
                    value={block.props.ctaStyle as CTAType}
                    onChange={(v) => updateProp('ctaStyle', v)}
                  />
                </>
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }}
              primaryLabel="Primary"
              secondary={{ value: block.props.descriptionCtaGap, onChange: (v) => updateProp('descriptionCtaGap', v) }}
              secondaryLabel="Tertiary"
              showSecondary={block.props.showCTA ?? true}
              bullet={{ value: block.props.bulletSpacing, onChange: (v) => updateProp('bulletSpacing', v) }}
              showBullet={block.props.showBullets ?? true}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
            
            {(block.props.showDescription ?? true) && (
              <FontSizeControl
                label="Body Text"
                value={block.props.descriptionSize}
                onChange={(v) => updateProp('descriptionSize', v)}
                min={12}
                max={24}
              />
            )}
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      descriptionColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={block.props.descriptionColor}
              ctaColor={block.props.ctaColor}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={block.props.showDescription ?? true}
              showCTA={block.props.showCTA ?? true}
              currentThemeId={block.props.theme}
              themeZone="body"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }



  // ========== FEATURE-SCREENSHOT BLOCK ========== 
  if (block.type === 'feature-screenshot') {
    const bullets = block.props.bullets || [];
    
    return (
      <PropertyPanelContainer
        title="Feature with Screenshot"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Enter title..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Badge" separator>
              <ContentBadgeSelectControl
                value={block.props.badge}
                onChange={(v) => updateProp('badge', v)}
                hideLabel
              />
            </PropertyGroup>
            
            <PropertyGroup title="Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showDescription ?? true) && (
                <TextareaControl
                  label="Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  rows={3}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Screenshot" separator>
              <ImageUploader
                value={block.props.screenshot || ''}
                onChange={(url) => updateProp('screenshot', url)}
                label={undefined}
                aspectRatio="16/9"
                maxSizeMB={2}
              />
              
              <TextInputControl
                label="Alt Text"
                value={block.props.screenshotAlt || ''}
                onChange={(v) => updateProp('screenshotAlt', v)}
                placeholder="Describe the image..."
              />
            </PropertyGroup>
            
            <PropertyGroup title="List Items" separator>
              <ToggleControl
                id="show-bullets"
                label="List Items"
                checked={block.props.showBullets ?? true}
                onChange={(v) => updateProp('showBullets', v)}
              />
              
              {(block.props.showBullets ?? true) && (
                <div className="space-y-2">
                  {bullets.map((bullet: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={bullet}
                        onChange={(e) => updateArrayItem('bullets', index, '', e.target.value)}
                        placeholder="List item..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('bullets', index)}
                        className="h-9 w-9 p-0 shrink-0"
                      >
                        <Trash2 className={iconSizes.sm} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addArrayItem('bullets', '')}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className={`${iconSizes.sm} mr-2`} />
                    Add Item
                  </Button>
                </div>
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Call-to-Action" separator>
              <ToggleControl
                id="show-cta"
                label="Call-to-Action"
                checked={block.props.showCTA ?? true}
                onChange={(v) => updateProp('showCTA', v)}
              />
              
              {(block.props.showCTA ?? true) && (
                <>
                  <TextInputControl
                    label="Button Text"
                    value={block.props.ctaText || ''}
                    onChange={(v) => updateProp('ctaText', v)}
                    placeholder="Learn more"
                  />
                  
                  <TextInputControl
                    label="Link URL"
                    value={block.props.ctaLink || ''}
                    onChange={(v) => updateProp('ctaLink', v)}
                    type="url"
                    placeholder="https://example.com"
                  />
                  
                  <CTATypeControl
                    value={block.props.ctaStyle as CTAType}
                    onChange={(v) => updateProp('ctaStyle', v)}
                  />
                </>
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }}
              primaryLabel="Primary"
              extra={[
                { label: 'Image Margin', value: block.props.imageMargin, onChange: (v) => updateProp('imageMargin', v) },
                ...(block.props.showBullets ?? true ? [{ label: 'Bullet Spacing', value: block.props.bulletSpacing, onChange: (v) => updateProp('bulletSpacing', v) }] : []),
                ...(block.props.showCTA ?? true ? [{ label: 'Description to CTA', value: block.props.descriptionCtaGap, onChange: (v) => updateProp('descriptionCtaGap', v) }] : []),
              ]}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
            
            {(block.props.showDescription ?? true) && (
              <FontSizeControl
                label="Body Text"
                value={block.props.descriptionSize}
                onChange={(v) => updateProp('descriptionSize', v)}
                min={12}
                max={24}
              />
            )}
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      descriptionColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor || { id: 'white' }}
              titleColor={block.props.titleColor || { id: 'neutral-900' }}
              descriptionColor={block.props.descriptionColor || { id: 'neutral-600' }}
              ctaColor={block.props.ctaColor}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={block.props.showDescription ?? true}
              showCTA={block.props.showCTA ?? true}
              currentThemeId={block.props.theme}
              themeZone="body"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== CODE-SNIPPET BLOCK ==========
  if (block.type === 'code-snippet') {
    return (
      <PropertyPanelContainer
        title="Code Snippet"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Title Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Code example..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showDescription ?? false) && (
                <TextareaControl
                  label="Description Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  placeholder="Implementation example and usage guide..."
                  rows={2}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Badge" separator>
              <ContentBadgeSelectControl
                value={block.props.badge}
                onChange={(v) => updateProp('badge', v)}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Code" separator>
              <TextareaControl
                label="Code Content"
                value={block.props.code || ''}
                onChange={(v) => updateProp('code', v)}
                rows={6}
                placeholder="// Your code here"
              />
              
              <ToggleControl
                id="show-language"
                label="Language"
                checked={block.props.showLanguage ?? true}
                onChange={(v) => updateProp('showLanguage', v)}
              />
              
              {(block.props.showLanguage ?? true) && (
                <SelectControl
                  label="Language"
                  value={block.props.language || 'javascript'}
                  onChange={(v) => updateProp('language', v)}
                  options={[
                    { value: 'javascript', label: 'JavaScript' },
                    { value: 'typescript', label: 'TypeScript' },
                    { value: 'python', label: 'Python' },
                    { value: 'java', label: 'Java' },
                    { value: 'csharp', label: 'C#' },
                    { value: 'json', label: 'JSON' },
                    { value: 'html', label: 'HTML' },
                    { value: 'css', label: 'CSS' },
                    { value: 'bash', label: 'Bash' },
                    { value: 'yaml', label: 'YAML' },
                  ]}
                />
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={
                (block.props.showDescription ?? false)
                  ? { value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }
                  : { value: block.props.titleCodeGap, onChange: (v) => updateProp('titleCodeGap', v) }
              }
              primaryLabel={(block.props.showDescription ?? false) ? 'Title to Description' : 'Title to Code'}
              extra={(block.props.showDescription ?? false) ? [{ label: 'Description to Code', value: block.props.descriptionCodeGap, onChange: (v) => updateProp('descriptionCodeGap', v) }] : []}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
            
            {(block.props.showDescription ?? false) && (
              <FontSizeControl
                label="Description"
                value={block.props.descriptionSize}
                onChange={(v) => updateProp('descriptionSize', v)}
                min={12}
                max={24}
              />
            )}
          </PropertySection>
          
          {/* Colors Section – no Theme picker; code snippet uses only Custom Colors (Background, Title, Description, Code Background). */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={() => {}}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={false}
              themeSwapped={false}
              themeStyleCallbacks={{ onColorfulChange: () => {}, onSwapChange: () => {} }}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={block.props.descriptionColor}
              ctaColor={undefined}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={block.props.showDescription ?? false}
              showCTA={false}
              currentThemeId={undefined}
              themeZone="body"
              descriptionColorLabel="Description"
              extraColors={[
                { label: 'Code Background', value: block.props.codeBackgroundColor, onChange: (v) => updateProp('codeBackgroundColor', v), purpose: 'background' },
              ]}
              hideThemePicker
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== VIDEO-BLOCK ==========
  if (block.type === 'video-block') {
    return (
      <PropertyPanelContainer
        title="Video Block"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Title Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Video title..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Badge" separator>
              <ContentBadgeSelectControl
                value={block.props.badge}
                onChange={(v) => updateProp('badge', v)}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showDescription ?? true) && (
                <TextareaControl
                  label="Body Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  rows={3}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Video" separator>
              <ImageUploader
                value={block.props.thumbnailUrl || ''}
                onChange={(url) => updateProp('thumbnailUrl', url)}
                label="Thumbnail"
                aspectRatio="16/9"
                maxSizeMB={2}
              />
              
              <TextInputControl
                label="Video URL"
                value={block.props.videoUrl || ''}
                onChange={(v) => updateProp('videoUrl', v)}
                type="url"
                placeholder="https://youtube.com/watch?v=..."
              />
              
              <ToggleControl
                id="show-duration"
                label="Duration"
                checked={block.props.showDuration ?? true}
                onChange={(v) => updateProp('showDuration', v)}
              />
              
              {(block.props.showDuration ?? true) && (
                <TextInputControl
                  label="Duration"
                  value={block.props.duration || ''}
                  onChange={(v) => updateProp('duration', v)}
                  placeholder="3:45"
                />
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.thumbnailTextGap, onChange: (v) => updateProp('thumbnailTextGap', v) }}
              primaryLabel="Primary"
              secondary={{ value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }}
              secondaryLabel="Secondary"
              showSecondary={true}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
            
            {(block.props.showDescription ?? true) && (
              <FontSizeControl
                label="Body Text"
                value={block.props.descriptionSize}
                onChange={(v) => updateProp('descriptionSize', v)}
                min={12}
                max={24}
              />
            )}
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      descriptionColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={block.props.descriptionColor}
              ctaColor={block.props.ctaColor}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={block.props.showDescription ?? true}
              showCTA={false}
              currentThemeId={block.props.theme}
              themeZone="body"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== TWO-COLUMN BLOCK ==========
  if (block.type === 'two-column') {
    return (
      <PropertyPanelContainer
        title="Two Column"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showBlockTitle}
                showDescription={block.props.showBlockDescription}
                updateProp={updateProp}
                titleProp="showBlockTitle"
                descriptionProp="showBlockDescription"
              />
              {(block.props.showBlockTitle ?? true) && (
                <TextInputControl
                  label="Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Enter block title..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Block Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showBlockTitle}
                showDescription={block.props.showBlockDescription}
                updateProp={updateProp}
                titleProp="showBlockTitle"
                descriptionProp="showBlockDescription"
              />
              {(block.props.showBlockDescription ?? true) && (
                <TextareaControl
                  label="Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  rows={2}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Left Column" separator>
              <ToggleControl
                id="show-left-column"
                label="Left Column"
                checked={block.props.showLeftColumn ?? true}
                onChange={(v) => updateProp('showLeftColumn', v)}
              />
              
              {(block.props.showLeftColumn ?? true) && (
                <>
                  <TextInputControl
                    label="Title"
                    value={block.props.leftColumn?.title || ''}
                    onChange={(v) => updateProp('leftColumn.title', v)}
                    placeholder="Left column title..."
                  />
                  
                  <TextareaControl
                    label="Description"
                    value={block.props.leftColumn?.description || ''}
                    onChange={(v) => updateProp('leftColumn.description', v)}
                    rows={3}
                  />
                </>
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Right Column" separator>
              <ToggleControl
                id="show-right-column"
                label="Right Column"
                checked={block.props.showRightColumn ?? true}
                onChange={(v) => updateProp('showRightColumn', v)}
              />
              
              {(block.props.showRightColumn ?? true) && (
                <>
                  <TextInputControl
                    label="Title"
                    value={block.props.rightColumn?.title || ''}
                    onChange={(v) => updateProp('rightColumn.title', v)}
                    placeholder="Right column title..."
                  />
                  
                  <TextareaControl
                    label="Description"
                    value={block.props.rightColumn?.description || ''}
                    onChange={(v) => updateProp('rightColumn.description', v)}
                    rows={3}
                  />
                </>
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.blockTitleDescriptionGap, onChange: (v) => updateProp('blockTitleDescriptionGap', v) }}
              primaryLabel="Block Title → Description"
              extra={[
                { label: 'Block Description → Columns', value: block.props.blockDescriptionContentGap, onChange: (v) => updateProp('blockDescriptionContentGap', v) },
                { label: 'Column Gap', value: block.props.columnGap, onChange: (v) => updateProp('columnGap', v) },
                { label: 'Column Title → Description', value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) },
              ]}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            <PropertyGroup title="Block Title">
              <FontSizeControl
                label="Size"
                value={block.props.blockTitleSize}
                onChange={(v) => updateProp('blockTitleSize', v)}
                min={16}
                max={40}
              />
              
              <SelectControl
                label="Weight"
                value={block.props.blockTitleWeight || 'bold'}
                onChange={(v) => updateProp('blockTitleWeight', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'semibold', label: 'Semibold' },
                  { value: 'bold', label: 'Bold' }
                ]}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Block intro" separator>
              <FontSizeControl
                label="Size"
                value={block.props.blockDescriptionSize}
                onChange={(v) => updateProp('blockDescriptionSize', v)}
                min={12}
                max={18}
              />
              
              <SelectControl
                label="Weight"
                value={block.props.blockDescriptionWeight || 'normal'}
                onChange={(v) => updateProp('blockDescriptionWeight', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'semibold', label: 'Semibold' },
                  { value: 'bold', label: 'Bold' }
                ]}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Column Title" separator>
              <FontSizeControl
                label="Size"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={14}
                max={32}
              />
              
              <SelectControl
                label="Weight"
                value={block.props.titleWeight || 'semibold'}
                onChange={(v) => updateProp('titleWeight', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'semibold', label: 'Semibold' },
                  { value: 'bold', label: 'Bold' }
                ]}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Column Description" separator>
              <FontSizeControl
                label="Size"
                value={block.props.descriptionSize}
                onChange={(v) => updateProp('descriptionSize', v)}
                min={12}
                max={18}
              />
              
              <SelectControl
                label="Weight"
                value={block.props.descriptionWeight || 'normal'}
                onChange={(v) => updateProp('descriptionWeight', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'semibold', label: 'Semibold' },
                  { value: 'bold', label: 'Bold' }
                ]}
              />
            </PropertyGroup>
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      blockTitleColor: createColorToken(theme.body.fg),
                      blockDescriptionColor: createColorToken(theme.body.fg),
                      titleColor: createColorToken(theme.body.fg),
                      descriptionColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={undefined}
              descriptionColor={undefined}
              ctaColor={undefined}
              updateProp={updateProp}
              showTitle={false}
              showDescription={false}
              showCTA={false}
              currentThemeId={block.props.theme}
              themeZone="body"
              extraColors={[
                { label: 'Column Background', value: block.props.columnBackgroundColor, onChange: (v) => updateProp('columnBackgroundColor', v), purpose: 'background' },
                { label: 'Block Title', value: block.props.blockTitleColor, onChange: (v) => updateProp('blockTitleColor', v), purpose: 'text' },
                { label: 'Block Description', value: block.props.blockDescriptionColor, onChange: (v) => updateProp('blockDescriptionColor', v), purpose: 'text' },
                { label: 'Column Title', value: block.props.titleColor, onChange: (v) => updateProp('titleColor', v), purpose: 'text' },
                { label: 'Column Description', value: block.props.descriptionColor, onChange: (v) => updateProp('descriptionColor', v), purpose: 'text' },
              ]}
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== ITEM-GRID BLOCK ==========
  if (block.type === 'item-grid') {
    const items = block.props.items || [];
    
    return (
      <PropertyPanelContainer
        title="Item Grid"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Title Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Enter title..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showDescription ?? true) && (
                <TextareaControl
                  label="Body Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  rows={3}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Grid Items" separator>
              <div className="space-y-2">
                {items.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateArrayItem('items', index, '', e.target.value)}
                      placeholder="Grid item..."
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('items', index)}
                      className="h-9 w-9 p-0 shrink-0"
                    >
                      <Trash2 className={iconSizes.sm} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('items', '')}
                  className="w-full"
                  size="sm"
                >
                  <Plus className={`${iconSizes.sm} mr-2`} />
                  Add Item
                </Button>
              </div>
            </PropertyGroup>
            
            <PropertyGroup title="Call-to-Action" separator>
              <ToggleControl
                id="show-cta"
                label="Call-to-Action"
                checked={block.props.showCTA ?? true}
                onChange={(v) => updateProp('showCTA', v)}
              />
              
              {(block.props.showCTA ?? true) && (
                <>
                  <TextInputControl
                    label="Button Text"
                    value={block.props.ctaText || ''}
                    onChange={(v) => updateProp('ctaText', v)}
                    placeholder="View all"
                  />
                  
                  <TextInputControl
                    label="Link URL"
                    value={block.props.ctaLink || ''}
                    onChange={(v) => updateProp('ctaLink', v)}
                    type="url"
                    placeholder="https://example.com"
                  />
                  
                  <CTATypeControl
                    value={block.props.ctaStyle as CTAType}
                    onChange={(v) => updateProp('ctaStyle', v)}
                  />
                </>
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }}
              primaryLabel="Primary"
              extra={[
                { label: 'Item Spacing', value: block.props.itemSpacing, onChange: (v) => updateProp('itemSpacing', v) },
                { label: 'Column Gap', value: block.props.columnGap, onChange: (v) => updateProp('columnGap', v) },
                ...(block.props.showCTA ?? true ? [{ label: 'Description to CTA', value: block.props.descriptionCtaGap, onChange: (v) => updateProp('descriptionCtaGap', v) }] : []),
              ]}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
            
            {(block.props.showDescription ?? true) && (
              <FontSizeControl
                label="Body Text"
                value={block.props.descriptionSize}
                onChange={(v) => updateProp('descriptionSize', v)}
                min={12}
                max={24}
              />
            )}
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      descriptionColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={block.props.descriptionColor}
              ctaColor={block.props.ctaColor}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={block.props.showDescription ?? true}
              showCTA={block.props.showCTA ?? true}
              currentThemeId={block.props.theme}
              themeZone="body"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== STATS-METRICS BLOCK ==========
  if (block.type === 'stats-metrics') {
    const stats = block.props.stats || [];
    
    return (
      <PropertyPanelContainer
        title="Stats & Metrics"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={undefined}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Title Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Performance metrics..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Metrics" separator>
              <div className="space-y-3">
                {stats.map((stat: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-muted-foreground">Metric {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('stats', index)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      value={stat.value || ''}
                      onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                      placeholder="95%"
                      className="text-sm"
                    />
                    <Input
                      value={stat.label || ''}
                      onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                      placeholder="Uptime"
                      className="text-sm"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('stats', { value: '', label: '' })}
                  className="w-full"
                  size="sm"
                >
                  <Plus className={`${iconSizes.sm} mr-2`} />
                  Add Metric
                </Button>
              </div>
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.titleStatsGap, onChange: (v) => updateProp('titleStatsGap', v) }}
              primaryLabel="Title to Metrics"
              secondary={{ value: block.props.statSpacing, onChange: (v) => updateProp('statSpacing', v) }}
              secondaryLabel="Stat Spacing"
              showSecondary={true}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
            
            <FontSizeControl
              label="Metric Value"
              value={block.props.statValueFontSize}
              onChange={(v) => updateProp('statValueFontSize', v)}
              min={24}
              max={60}
            />
            
            <FontSizeControl
              label="Metric Label"
              value={block.props.statLabelFontSize}
              onChange={(v) => updateProp('statLabelFontSize', v)}
              min={12}
              max={20}
            />
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      statValueColor: createColorToken(theme.header.bg),
                      statLabelColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={undefined}
              ctaColor={undefined}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={false}
              showCTA={false}
              currentThemeId={block.props.theme}
              themeZone="body"
              extraColors={[
                { label: 'Metric Value', value: block.props.statValueColor, onChange: (v) => updateProp('statValueColor', v), purpose: 'text' },
                { label: 'Metric Label', value: block.props.statLabelColor, onChange: (v) => updateProp('statLabelColor', v), purpose: 'text' },
              ]}
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== MULTI-UPDATE BLOCK ==========
  if (block.type === 'multi-update') {
    const updates = block.props.updates || [];
    
    return (
      <PropertyPanelContainer
        title="Multi-Update"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <ToggleControl
              id="show-title"
              label="Title"
              checked={block.props.showTitle ?? true}
              onChange={(v) => updateProp('showTitle', v)}
            />
            
            {(block.props.showTitle ?? true) && (
              <TextInputControl
                label="Title Text"
                value={block.props.title || ''}
                onChange={(v) => updateProp('title', v)}
                placeholder="Multiple updates..."
              />
            )}
            
            <PropertyGroup title="Update Items" separator>
              <div className="space-y-3">
                {updates.map((update: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-muted-foreground">Update {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('updates', index)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Badge</Label>
                      <ContentBadgeSelectControl
                        value={update.badge}
                        onChange={(v) => updateArrayItem('updates', index, 'badge', v)}
                      />
                    </div>
                    <Input
                      value={update.title || ''}
                      onChange={(e) => updateArrayItem('updates', index, 'title', e.target.value)}
                      placeholder="Update title..."
                      className="text-sm"
                    />
                    <Textarea
                      value={update.description || ''}
                      onChange={(e) => updateArrayItem('updates', index, 'description', e.target.value)}
                      placeholder="Description..."
                      rows={2}
                      className="text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={update.ctaText || ''}
                        onChange={(e) => updateArrayItem('updates', index, 'ctaText', e.target.value)}
                        placeholder="CTA text"
                        className="text-sm"
                      />
                      <Input
                        value={update.ctaLink || ''}
                        onChange={(e) => updateArrayItem('updates', index, 'ctaLink', e.target.value)}
                        placeholder="URL"
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('updates', { 
                    title: 'New Update', 
                    description: 'Description of this update.', 
                    ctaText: 'Learn more', 
                    ctaLink: 'https://kore.ai/docs' 
                  })}
                  className="w-full"
                  size="sm"
                >
                  <Plus className={`${iconSizes.sm} mr-2`} />
                  Add Update
                </Button>
              </div>
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }}
              primaryLabel="Primary"
              secondary={{ value: block.props.updateSpacing, onChange: (v) => updateProp('updateSpacing', v) }}
              secondaryLabel="Update Spacing"
              showSecondary={true}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={undefined}
              ctaColor={undefined}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={false}
              showCTA={false}
              currentThemeId={block.props.theme}
              themeZone="body"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== WARNING/ALERT BLOCK ==========
  if (block.type === 'warning') {
    return (
      <PropertyPanelContainer
        title="Alert Block"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <AlertTypeControl
              value={block.props.alertType || 'warning'}
              onChange={(v) => updateProp('alertType', v)}
            />
            
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                showBadge={block.props.showBadge}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Title Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Important Notice"
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Message" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                showBadge={block.props.showBadge}
                updateProp={updateProp}
              />
              {(block.props.showDescription ?? true) && (
                <TextareaControl
                  label="Message Text"
                  value={block.props.message || ''}
                  onChange={(v) => updateProp('message', v)}
                  rows={3}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Badge" separator>
              <VisibilityToggles
                toggles={['badge']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                showBadge={block.props.showBadge}
                updateProp={updateProp}
              />
            </PropertyGroup>
            
            <PropertyGroup title="Call-to-Action" separator>
              <ToggleControl
                id="show-cta"
                label="Call-to-Action"
                checked={block.props.showCTA ?? true}
                onChange={(v) => updateProp('showCTA', v)}
              />
              
              {(block.props.showCTA ?? true) && (
                <>
                  <TextInputControl
                    label="Button Text"
                    value={block.props.ctaText || ''}
                    onChange={(v) => updateProp('ctaText', v)}
                    placeholder="Learn more"
                  />
                  
                  <TextInputControl
                    label="Link URL"
                    value={block.props.ctaLink || ''}
                    onChange={(v) => updateProp('ctaLink', v)}
                    type="url"
                    placeholder="https://example.com"
                  />
                  
                  <CTATypeControl
                    value={block.props.ctaStyle || 'primary'}
                    onChange={(v) => updateProp('ctaStyle', v)}
                  />
                </>
              )}
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }}
              primaryLabel="Title to Message"
              secondary={{ value: block.props.descriptionCtaGap, onChange: (v) => updateProp('descriptionCtaGap', v) }}
              secondaryLabel="Message to CTA"
              showSecondary={block.props.showCTA ?? true}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
              />
            )}
            
            {(block.props.showDescription ?? true) && (
              <FontSizeControl
                label="Message"
                value={block.props.descriptionSize}
                onChange={(v) => updateProp('descriptionSize', v)}
              />
            )}
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      descriptionColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={block.props.descriptionColor}
              ctaColor={block.props.ctaColor}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={block.props.showDescription ?? true}
              showCTA={block.props.showCTA ?? true}
              currentThemeId={block.props.theme}
              themeZone="body"
              descriptionColorLabel="Message"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== TIMELINE BLOCK ==========
  if (block.type === 'timeline') {
    const events = block.props.events || [];
    
    return (
      <PropertyPanelContainer
        title="Timeline"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "layout", "colors"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showBlockTitle}
                showDescription={block.props.showBlockDescription}
                updateProp={updateProp}
                titleProp="showBlockTitle"
                descriptionProp="showBlockDescription"
                descriptionDefault={false}
              />
              {(block.props.showBlockTitle ?? true) && (
                <TextInputControl
                  label="Title Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Timeline..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showBlockTitle}
                showDescription={block.props.showBlockDescription}
                updateProp={updateProp}
                titleProp="showBlockTitle"
                descriptionProp="showBlockDescription"
                descriptionDefault={false}
              />
              {(block.props.showBlockDescription ?? false) && (
                <TextareaControl
                  label="Description Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  placeholder="Track important milestones..."
                  rows={2}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Timeline Events" separator>
              <div className="space-y-3">
                {events.map((event: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-muted-foreground">Event {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('events', index)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      value={event.date || ''}
                      onChange={(e) => updateArrayItem('events', index, 'date', e.target.value)}
                      placeholder="Date..."
                      className="text-sm"
                    />
                    <Input
                      value={event.title || ''}
                      onChange={(e) => updateArrayItem('events', index, 'title', e.target.value)}
                      placeholder="Event title..."
                      className="text-sm"
                    />
                    <Textarea
                      value={event.description || ''}
                      onChange={(e) => updateArrayItem('events', index, 'description', e.target.value)}
                      placeholder="Description..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('events', { date: '', title: '', description: '' })}
                  className="w-full"
                  size="sm"
                >
                  <Plus className={`${iconSizes.sm} mr-2`} />
                  Add Event
                </Button>
              </div>
            </PropertyGroup>
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.titleTimelineGap, onChange: (v) => updateProp('titleTimelineGap', v) }}
              primaryLabel="Primary"
              secondary={{ value: block.props.eventSpacing, onChange: (v) => updateProp('eventSpacing', v) }}
              secondaryLabel="Event Spacing"
              showSecondary={true}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <FontSizeControl
                label="Title"
                value={block.props.titleSize}
                onChange={(v) => updateProp('titleSize', v)}
                min={20}
                max={48}
              />
            )}
            
            <FontSizeControl
              label="Event Title"
              value={block.props.eventTitleFontSize}
              onChange={(v) => updateProp('eventTitleFontSize', v)}
              min={14}
              max={28}
            />
            
            <FontSizeControl
              label="Event Description"
              value={block.props.eventDescriptionFontSize}
              onChange={(v) => updateProp('eventDescriptionFontSize', v)}
              min={12}
              max={18}
            />
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      timelineColor: createColorToken(theme.header.bg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor}
              titleColor={block.props.titleColor}
              descriptionColor={undefined}
              ctaColor={undefined}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={false}
              showCTA={false}
              currentThemeId={block.props.theme}
              themeZone="body"
              extraColors={[
                { label: 'Timeline Line', value: block.props.timelineColor, onChange: (v) => updateProp('timelineColor', v), purpose: 'all' },
              ]}
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== IMAGE + CONTENT BLOCK ==========
  if (block.type === 'image-content') {
    return (
      <PropertyPanelContainer
        title="Image + Content"
        onClose={onClose}
      >
        <PropertySections defaultOpen={["content", "image", "layout"]}>
          <SectionGroup label={PANEL_SECTION_GROUPS.content.label} showDivider={false}>
          {/* Preset Styles - align with other content blocks */}
          <PresetStylesSection
            currentPreset={detectPreset(block.props)}
            onApplyPreset={(preset) => onBlockChange({ ...block, props: applyPreset(block.props, preset) })}
          />
          
          {/* Content Section */}
          <PropertySection id="content" icon={Type} title="Content">
            <PropertyGroup title="Title" separator>
              <VisibilityToggles
                toggles={['title']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showTitle ?? true) && (
                <TextInputControl
                  label="Text"
                  value={block.props.title || ''}
                  onChange={(v) => updateProp('title', v)}
                  placeholder="Enter title..."
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Badge" separator>
              <ContentBadgeSelectControl
                value={block.props.badge}
                onChange={(v) => updateProp('badge', v)}
                hideLabel
              />
            </PropertyGroup>
            
            <PropertyGroup title="Description" separator>
              <VisibilityToggles
                toggles={['description']}
                showTitle={block.props.showTitle}
                showDescription={block.props.showDescription}
                updateProp={updateProp}
              />
              {(block.props.showDescription ?? true) && (
                <TextareaControl
                  label="Body Text"
                  value={block.props.description || ''}
                  onChange={(v) => updateProp('description', v)}
                  placeholder="Feature description goes here."
                  rows={3}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Bullets" separator>
              <ToggleControl
                id="show-bullets"
                label="Bullets"
                checked={block.props.showBullets ?? true}
                onChange={(v) => updateProp('showBullets', v)}
              />
              
              {(block.props.showBullets ?? true) && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Bullet Points</Label>
                  {(block.props.bullets || []).map((bullet: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={bullet}
                        onChange={(e) => updateArrayItem('bullets', index, '', e.target.value)}
                        placeholder={`Bullet ${index + 1}`}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('bullets', index)}
                        className="h-9 px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('bullets', '')}
                    className="w-full text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Bullet
                  </Button>
                </div>
              )}
            </PropertyGroup>
            
            <PropertyGroup title="Call-to-Action" separator>
              <ToggleControl
                id="show-cta"
                label="Call-to-Action"
                checked={block.props.showCTA ?? true}
                onChange={(v) => updateProp('showCTA', v)}
              />
              
              {(block.props.showCTA ?? true) && (
                <>
                  <TextInputControl
                    label="Button Text"
                    value={block.props.ctaText || ''}
                    onChange={(v) => updateProp('ctaText', v)}
                    placeholder="Learn more"
                  />
                  
                  <TextInputControl
                    label="Link URL"
                    value={block.props.ctaLink || ''}
                    onChange={(v) => updateProp('ctaLink', v)}
                    type="url"
                    placeholder="https://example.com"
                  />
                  
                  <CTATypeControl
                    value={(block.props.ctaStyle as CTAType) || 'secondary'}
                    onChange={(v) => updateProp('ctaStyle', v)}
                  />
                </>
              )}
            </PropertyGroup>
          </PropertySection>
          
          {/* Image Section */}
          <PropertySection id="image" icon={Settings} title="Image">
            <ToggleControl
              id="show-image"
              label="Image"
              checked={block.props.showImage ?? true}
              onChange={(v) => updateProp('showImage', v)}
            />
            
            {(block.props.showImage ?? true) && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Image</Label>
                  <ImageUploader
                    value={block.props.imageSrc || ''}
                    onChange={(v) => updateProp('imageSrc', v)}
                  />
                </div>
                
                <TextInputControl
                  label="Alt Text"
                  value={block.props.imageAlt || ''}
                  onChange={(v) => updateProp('imageAlt', v)}
                  placeholder="Feature image"
                />
                
                <SelectControl
                  label="Image Position"
                  value={block.props.imagePosition || 'left'}
                  onChange={(v) => updateProp('imagePosition', v)}
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                  ]}
                />
                
                <SelectControl
                  label="Image Width"
                  value={String(block.props.imageWidth || 40)}
                  onChange={(v) => updateProp('imageWidth', Number(v))}
                  options={[
                    { value: '30', label: '30%' },
                    { value: '40', label: '40%' },
                    { value: '50', label: '50%' },
                  ]}
                />
              </>
            )}
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.layout.label}>
          {/* Layout Section */}
          <PropertySection id="layout" icon={Layout} title="Layout">
            <SemanticPaddingControl
              value={block.props.padding}
              onChange={(v) => updateProp('padding', v)}
            />
            
            <AlignmentControl
              value={block.props.contentAlign as 'left' | 'center' | 'right'}
              onChange={(v) => updateProp('contentAlign', v)}
              label="Alignment"
            />
            
            <SpacingGroup
              primary={{ value: block.props.imageContentGap, onChange: (v) => updateProp('imageContentGap', v) }}
              primaryLabel="Primary"
              extra={[
                ...((block.props.showTitle ?? true) && (block.props.showDescription ?? true)
                  ? [{ label: 'Title to Description', value: block.props.titleDescriptionGap, onChange: (v) => updateProp('titleDescriptionGap', v) }]
                  : []),
                ...(block.props.showCTA ?? true ? [{ label: 'CTA Gap', value: block.props.bulletsCtaGap, onChange: (v) => updateProp('bulletsCtaGap', v) }] : []),
              ]}
            />
          </PropertySection>
          </SectionGroup>
          <SectionGroup label={PANEL_SECTION_GROUPS.appearance.label}>
          {/* Typography Section */}
          <PropertySection id="typography" icon={Type} title="Typography">
            {(block.props.showTitle ?? true) && (
              <>
                <FontSizeControl
                  label="Title Size"
                  value={block.props.titleSize || 'xl'}
                  onChange={(v) => updateProp('titleSize', v)}
                />
                
                <SelectControl
                  label="Title Weight"
                  value={block.props.titleWeight || 'bold'}
                  onChange={(v) => updateProp('titleWeight', v)}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'semibold', label: 'Semibold' },
                    { value: 'bold', label: 'Bold' },
                  ]}
                />
              </>
            )}
            
            {(block.props.showDescription ?? true) && (
              <>
                <FontSizeControl
                  label="Description Size"
                  value={block.props.descriptionSize || 'sm'}
                  onChange={(v) => updateProp('descriptionSize', v)}
                />
                
                <SelectControl
                  label="Description Weight"
                  value={block.props.descriptionWeight || 'normal'}
                  onChange={(v) => updateProp('descriptionWeight', v)}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'semibold', label: 'Semibold' },
                  ]}
                />
              </>
            )}
          </PropertySection>
          
          {/* Colors Section */}
          <PropertySection id="colors" icon={Palette} title="Colors">
            <BlockColorsGroup
              theme={block.props.theme}
              onThemeChange={(themeId) => {
                if (themeId) {
                  const theme = getThemeById(themeId);
                  if (theme) {
                    updateProps({
                      theme: themeId,
                      backgroundColor: createColorToken(theme.body.bg),
                      titleColor: createColorToken(theme.body.fg),
                      descriptionColor: createColorToken(theme.body.fg)
                    });
                  }
                } else {
                  updateProp('theme', undefined);
                }
              }}
              showNone={true}
              globalDefaultTheme={globalDefaultTheme}
              colorfulMode={block.props.colorfulMode ?? false}
              themeSwapped={block.props.themeSwapped ?? false}
              themeStyleCallbacks={makeThemeStyleCallbacks(block, globalDefaultTheme, updateProps)}
              backgroundColor={block.props.backgroundColor || { id: 'white' }}
              titleColor={block.props.titleColor || { id: 'neutral-900' }}
              descriptionColor={block.props.descriptionColor || { id: 'neutral-600' }}
              ctaColor={block.props.ctaColor}
              updateProp={updateProp}
              showTitle={block.props.showTitle ?? true}
              showDescription={block.props.showDescription ?? true}
              showCTA={block.props.showCTA ?? true}
              currentThemeId={block.props.theme}
              themeZone="body"
            />
          </PropertySection>
          </SectionGroup>
        </PropertySections>
      </PropertyPanelContainer>
    );
  }

  // ========== FALLBACK (Should never reach here) ==========
  return (
    <TooltipProvider>
      <aside className="w-80 h-screen border-l bg-card flex flex-col slide-in-right">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">{getBlockTitle()}</h3>
        <Button variant="ghost" onClick={onClose} className="h-9 w-9 p-0" title="Close properties">
          <X className={iconSizes.md} />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 pb-32 space-y-4">
            
            {/* ========== PRESET STYLES ========== */}
            {/* Only show for blocks that support presets (exclude divider) */}
            {block.type !== 'divider' && (
              <>
                <div className="space-y-3 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold">Quick Styles</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['compact', 'standard', 'spacious'] as PresetStyle[]).map((presetStyle) => {
                      const isActive = detectPreset(block.props) === presetStyle;
                      const metadata = PRESET_METADATA[presetStyle];
                      
                      return (
                        <motion.div
                          key={presetStyle}
                          whileHover={{ 
                            y: -2, 
                            scale: 1.02,
                            transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
                          }}
                          whileTap={{ 
                            scale: 0.98,
                            transition: { duration: 0.1 }
                          }}
                        >
                          <Button
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const newProps = applyPreset(block.props, presetStyle);
                              onBlockChange({ ...block, props: newProps });
                            }}
                            className="h-auto py-2 px-2 flex flex-col items-center gap-1 w-full"
                            title={metadata.description}
                          >
                            <span className="text-base leading-none">{metadata.icon}</span>
                            <span className="text-xs leading-none">{metadata.label}</span>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                <Separator />
              </>
            )}
            
            {/* ========== NEW: ACCORDION SECTIONS ========== */}
            <Accordion 
              type="multiple" 
              defaultValue={["content", "layout", "typography", "colors", "specific"]} 
              className="w-full space-y-2"
            >
              
              {/* ========== SECTION 1: CONTENT ========== */}
              {(('title' in block.props) || ('badge' in block.props) || ('description' in block.props)) && (
                <AccordionItem value="content" className="border rounded-md">
                  <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Content</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3 pt-2 space-y-3">
                    
                    {/* Title Group */}
                    {('title' in block.props) && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-title" className="text-sm">Title</Label>
                          <Switch
                            id="show-title"
                            checked={block.props.showTitle ?? true}
                            onCheckedChange={(checked) => updateProp('showTitle', checked)}
                          />
                        </div>
                        
                        {(block.props.showTitle ?? true) && (
                          <>
                            <div>
                              <Input
                                value={block.props.title || ''}
                                onChange={(e) => updateProp('title', e.target.value)}
                                placeholder="Enter title..."
                                className="h-9"
                              />
                            </div>
                            
                            {/* Title Typography */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label className="text-xs">Size</Label>
                                <Select 
                                  value={block.props.titleSize} 
                                  onValueChange={(v) => updateProp('titleSize', v)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="sm">Small</SelectItem>
                                    <SelectItem value="base">Base</SelectItem>
                                    <SelectItem value="lg">Large</SelectItem>
                                    <SelectItem value="xl">XL</SelectItem>
                                    <SelectItem value="2xl">2XL</SelectItem>
                                    <SelectItem value="3xl">3XL</SelectItem>
                                    <SelectItem value="4xl">4XL</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-xs">Weight</Label>
                                <Select 
                                  value={block.props.titleWeight}
                                  onValueChange={(v) => updateProp('titleWeight', v)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="semibold">Semi</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="extrabold">Extra</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            {/* Title Color */}
                            <ColorControlV2
                              value={block.props.titleColor}
                              onChange={(value) => updateProp('titleColor', value)}
                              label="Color"
                              purpose="text"
                            />
                          </>
                        )}
                      </div>
                    )}
                    
                    {/* Badge */}
                    {('badge' in block.props) && (
                      <div className="space-y-2">
                        <Label className="text-sm">Badge</Label>
                        <Select 
                          value={block.props.badge as string} 
                          onValueChange={(value) => updateProp('badge', value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="improved">Improved</SelectItem>
                            <SelectItem value="beta">Beta</SelectItem>
                            <SelectItem value="deprecated">Deprecated</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {/* Description Group */}
                    {('description' in block.props) && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-description" className="text-sm">Description</Label>
                          <Switch
                            id="show-description"
                            checked={block.props.showDescription ?? true}
                            onCheckedChange={(checked) => updateProp('showDescription', checked)}
                          />
                        </div>
                        
                        {(block.props.showDescription ?? true) && (
                          <>
                            <div>
                              <Textarea
                                value={block.props.description || ''}
                                onChange={(e) => updateProp('description', e.target.value)}
                                placeholder="Enter description..."
                                rows={3}
                              />
                            </div>
                            
                            {/* Description Typography */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label className="text-xs">Size</Label>
                                <Select 
                                  value={block.props.descriptionSize}
                                  onValueChange={(v) => updateProp('descriptionSize', v)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="xs">XS</SelectItem>
                                    <SelectItem value="sm">Small</SelectItem>
                                    <SelectItem value="base">Base</SelectItem>
                                    <SelectItem value="lg">Large</SelectItem>
                                    <SelectItem value="xl">XL</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-xs">Weight</Label>
                                <Select 
                                  value={block.props.descriptionWeight}
                                  onValueChange={(v) => updateProp('descriptionWeight', v)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="semibold">Semi</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="extrabold">Extra</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            {/* Description Color */}
                            <ColorControlV2
                              value={block.props.descriptionColor}
                              onChange={(value) => updateProp('descriptionColor', value)}
                              label="Color"
                              purpose="text"
                            />
                          </>
                        )}
                      </div>
                    )}
                    
                    {/* CTA/Button Group */}
                    {('ctaText' in block.props || 'ctaLink' in block.props) && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Call-to-Action</Label>
                            <Switch
                              checked={block.props.showCTA ?? true}
                              onCheckedChange={(checked) => updateProp('showCTA', checked)}
                            />
                          </div>
                          
                          {(block.props.showCTA ?? true) && (
                            <>
                              <div className="space-y-2">
                                <Label className="text-sm">Text</Label>
                                <Input
                                  value={block.props.ctaText || ''}
                                  onChange={(e) => updateProp('ctaText', e.target.value)}
                                  placeholder="Learn more"
                                  className="h-9"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Link</Label>
                                <Input
                                  value={block.props.ctaLink || ''}
                                  onChange={(e) => updateProp('ctaLink', e.target.value)}
                                  placeholder="https://..."
                                  className="h-9"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Style</Label>
                                <Select 
                                  value={block.props.ctaStyle}
                                  onValueChange={(v) => updateProp('ctaStyle', v)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="primary">Primary (Blue Gradient)</SelectItem>
                                    <SelectItem value="secondary">Secondary (Outlined)</SelectItem>
                                    <SelectItem value="tertiary">Tertiary (Ghost)</SelectItem>
                                    <SelectItem value="link">Link (Text Only)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                    
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* ========== SECTION 2: LAYOUT & SPACING ========== */}
              <AccordionItem value="layout" className="border rounded-md">
                <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Layout & Spacing</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 pt-2 space-y-3">
                  
                  {/* Layout Controls */}
                  <div className="space-y-3">
                    <Label className="font-semibold text-sm">Layout</Label>
                    
                    <div>
                      <Label className="text-sm">Padding</Label>
                      <Select 
                        value={block.props.padding || 'standard'}
                        onValueChange={(v) => updateProp('padding', v)}
                      >
                        <SelectTrigger className="h-9 mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <AlignmentControl
                        value={(block.props.contentAlign || 'left') as 'left' | 'center' | 'right'}
                        onChange={(value) => updateProp('contentAlign', value)}
                        label="Content Alignment"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Spacing Controls */}
                  <div className="space-y-3">
                    <Label className="font-semibold text-sm">Spacing</Label>
                    
                    {('title' in block.props || 'description' in block.props) && (
                      <SpacingControl
                        label="Title ↔ Description"
                        value={block.props.titleDescriptionGap as any}
                        onChange={(v) => updateProp('titleDescriptionGap', v)}
                        includeXXL={true}
                      />
                    )}
                    
                    {('descriptionButtonGap' in block.props) && (
                      <SpacingControl
                        label="Description ↔ Button"
                        value={block.props.descriptionButtonGap as any}
                        onChange={(v) => updateProp('descriptionButtonGap', v)}
                        includeXXL={true}
                      />
                    )}
                    
                    {('headerDescriptionGap' in block.props) && (
                      <SpacingControl
                        label="Header ↔ Description"
                        value={block.props.headerDescriptionGap as any}
                        onChange={(v) => updateProp('headerDescriptionGap', v)}
                      />
                    )}
                    
                    {('bulletSpacing' in block.props) && (
                      <SpacingControl
                        label="Bullet Spacing"
                        value={block.props.bulletSpacing as any}
                        onChange={(v) => updateProp('bulletSpacing', v)}
                      />
                    )}
                    
                    {('updateSpacing' in block.props) && (
                      <SpacingControl
                        label="Update Spacing"
                        value={block.props.updateSpacing as any}
                        onChange={(v) => updateProp('updateSpacing', v)}
                      />
                    )}
                    
                    {('itemSpacing' in block.props) && (
                      <div>
                        <Label className="text-sm">Item Spacing</Label>
                        <Select 
                          value={block.props.itemSpacing || 'lg'}
                          onValueChange={(v) => updateProp('itemSpacing', v)}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xs">Tiny (4px)</SelectItem>
                            <SelectItem value="sm">Small (8px)</SelectItem>
                            <SelectItem value="md">Medium (12px)</SelectItem>
                            <SelectItem value="lg">Large (16px)</SelectItem>
                            <SelectItem value="xl">XL (24px)</SelectItem>
                            <SelectItem value="xxl">XXL (32px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {('columnGap' in block.props) && (
                      <div>
                        <Label className="text-sm">Column Gap</Label>
                        <Select 
                          value={block.props.columnGap || 'md'}
                          onValueChange={(v) => updateProp('columnGap', v)}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xs">Tiny (4px)</SelectItem>
                            <SelectItem value="sm">Small (8px)</SelectItem>
                            <SelectItem value="md">Medium (12px)</SelectItem>
                            <SelectItem value="lg">Large (16px)</SelectItem>
                            <SelectItem value="xl">XL (24px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {('statGap' in block.props) && (
                      <SpacingControl
                        label="Stat Gap"
                        value={block.props.statGap as any}
                        onChange={(v) => updateProp('statGap', v)}
                      />
                    )}
                    
                    {('thumbnailTextGap' in block.props) && (
                      <SpacingControl
                        label="Primary Gap"
                        value={block.props.thumbnailTextGap as any}
                        onChange={(v) => updateProp('thumbnailTextGap', v)}
                      />
                    )}
                    
                    {('screenshotTextGap' in block.props) && (
                      <SpacingControl
                        label="Primary Gap"
                        value={block.props.screenshotTextGap as any}
                        onChange={(v) => updateProp('screenshotTextGap', v)}
                        includeXXL={true}
                      />
                    )}
                    
                    {('titleCodeGap' in block.props) && (
                      <div>
                        <Label className="text-sm">Primary Gap</Label>
                        <Select 
                          value={block.props.titleCodeGap || 'sm'}
                          onValueChange={(v) => updateProp('titleCodeGap', v)}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xs">Tiny (4px)</SelectItem>
                            <SelectItem value="sm">Small (8px)</SelectItem>
                            <SelectItem value="md">Medium (12px)</SelectItem>
                            <SelectItem value="lg">Large (16px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {('titleStatsGap' in block.props) && (
                      <SpacingControl
                        label="Primary Gap"
                        value={block.props.titleStatsGap as any}
                        onChange={(v) => updateProp('titleStatsGap', v)}
                        includeXXL={true}
                      />
                    )}
                    
                    {('dateGap' in block.props) && (
                      <SpacingControl
                        label="Secondary Gap"
                        value={block.props.dateGap as any}
                        onChange={(v) => updateProp('dateGap', v)}
                      />
                    )}
                    
                    {('titleGap' in block.props) && (
                      <div>
                        <Label className="text-sm">Primary Gap</Label>
                        <Select 
                          value={block.props.titleGap || 'sm'}
                          onValueChange={(v) => updateProp('titleGap', v)}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xs">Tiny (4px)</SelectItem>
                            <SelectItem value="sm">Small (8px)</SelectItem>
                            <SelectItem value="md">Medium (12px)</SelectItem>
                            <SelectItem value="lg">Large (16px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                  </div>
                  
                </AccordionContent>
              </AccordionItem>
              
              {/* ========== SECTION 3: TYPOGRAPHY ========== */}
              {(('title' in block.props) || ('description' in block.props)) && (
                <AccordionItem value="typography" className="border rounded-md">
                  <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Typography</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3 pt-2 space-y-3">
                    
                    {('title' in block.props && block.props.showTitle !== false) && (
                      <div>
                        <Label className="text-sm">Title Font Size</Label>
                        <Select 
                          value={String(block.props.titleSize || 24)}
                          onValueChange={(value) => updateProp('titleSize', Number(value))}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20">Small (20px)</SelectItem>
                            <SelectItem value="24">Medium (24px)</SelectItem>
                            <SelectItem value="28">Large (28px)</SelectItem>
                            <SelectItem value="32">XL (32px)</SelectItem>
                            <SelectItem value="36">2XL (36px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {('description' in block.props && block.props.showDescription !== false) && (
                      <div>
                        <Label className="text-sm">Description Font Size</Label>
                        <Select 
                          value={String(block.props.descriptionSize || 16)}
                          onValueChange={(value) => updateProp('descriptionSize', Number(value))}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="14">Small (14px)</SelectItem>
                            <SelectItem value="16">Medium (16px)</SelectItem>
                            <SelectItem value="18">Large (18px)</SelectItem>
                            <SelectItem value="20">XL (20px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* ========== SECTION 4: COLORS ========== */}
              {(('title' in block.props) || ('description' in block.props) || ('backgroundColor' in block.props)) && (
                <AccordionItem value="colors" className="border rounded-md">
                  <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Colors & Theme</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3 pt-2 space-y-3">
                    
                    {/* Theme Picker */}
                    <ThemePickerControl
                      value={block.props.theme}
                      globalDefaultTheme={globalDefaultTheme}
                      onChange={(themeId) => {
                        if (themeId) {
                          // Set theme and clear custom colors
                          onBlockChange({ 
                            ...block, 
                            props: {
                              ...block.props,
                              theme: themeId,
                              backgroundColor: undefined,
                              titleColor: undefined,
                              descriptionColor: undefined
                            }
                          });
                        } else {
                          // Clear theme, restore default colors
                          onBlockChange({ 
                            ...block, 
                            props: {
                              ...block.props,
                              theme: undefined,
                              backgroundColor: getColorHex('white'),
                              titleColor: getColorHex('neutral-900'),
                              descriptionColor: getColorHex('neutral-600')
                            }
                          });
                        }
                      }}
                      label="Theme"
                      showNone={true}
                    />
                    
                    {/* Show theme info if active */}
                    {block.props.theme && (
                      <div className="p-2 bg-primary/5 border border-primary/20 rounded-md">
                        <p className="text-xs">
                          Using <span className="font-medium">{getThemeById(block.props.theme)?.name}</span> theme
                        </p>
                      </div>
                    )}
                    
                    {/* Separator between theme and custom colors */}
                    {!block.props.theme && (
                      <Separator className="my-3" />
                    )}
                    
                    {/* Custom Colors - Only show if no theme is active */}
                    {!block.props.theme && ('backgroundColor' in block.props) && (
                      <ColorControlV2
                        value={block.props.backgroundColor || { id: 'white' }}
                        onChange={(value) => updateProp('backgroundColor', value)}
                        label="Background"
                        purpose="background"
                      />
                    )}
                    
                    {!block.props.theme && ('title' in block.props && block.props.showTitle !== false) && (
                      <ColorControlV2
                        value={block.props.titleColor || { id: 'neutral-900' }}
                        onChange={(value) => updateProp('titleColor', value)}
                        label="Title"
                        purpose="text"
                      />
                    )}
                    
                    {!block.props.theme && ('description' in block.props && block.props.showDescription !== false) && (
                      <ColorControlV2
                        value={block.props.descriptionColor || { id: 'neutral-600' }}
                        onChange={(value) => updateProp('descriptionColor', value)}
                        label="Description"
                        purpose="text"
                      />
                    )}
                    
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* ========== SECTION 5: BLOCK-SPECIFIC CONTENT ========== */}
              <AccordionItem value="specific" className="border rounded-md">
                <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">{getBlockSpecificTitle()}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 pt-2 space-y-4">
                  
                  {/* Feature Screenshot specific */}
                  {block.type === 'feature-screenshot' && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Screenshot Alt Text</Label>
                        <Input
                          value={block.props.screenshotAlt || ''}
                          onChange={(e) => updateProp('screenshotAlt', e.target.value)}
                          placeholder="Feature screenshot"
                          className="h-9 mt-1.5"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="gradient-bg" className="text-sm">Gradient Background</Label>
                        <Switch
                          id="gradient-bg"
                          checked={block.props.useGradientBackground || false}
                          onCheckedChange={(checked) => updateProp('useGradientBackground', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="full-width" className="text-sm">Full Width</Label>
                        <Switch
                          id="full-width"
                          checked={block.props.fullWidth || false}
                          onCheckedChange={(checked) => updateProp('fullWidth', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="font-semibold text-sm">Key Benefits</Label>
                        <div className="space-y-2 mt-2">
                          {(block.props.bullets || []).map((bullet: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={bullet}
                                onChange={(e) => updateArrayItem('bullets', index, '', e.target.value)}
                                placeholder={`Benefit ${index + 1}`}
                                className="h-9"
                              />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    onClick={() => removeArrayItem('bullets', index)}
                                    className="h-9 w-9 p-0 flex-shrink-0"
                                  >
                                    <Trash2 className={iconSizes.sm} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remove benefit</TooltipContent>
                              </Tooltip>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addArrayItem('bullets', '')}
                            className="w-full h-8"
                          >
                            <Plus className={`${iconSizes.sm} mr-2`} />
                            Add Benefit
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Feature List specific */}
                  {block.type === 'feature-list' && (
                    <>
                      <div>
                        <Label className="font-semibold text-sm">Features</Label>
                        <div className="space-y-2 mt-2">
                          {(block.props.bullets || []).map((bullet: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={bullet}
                                onChange={(e) => updateArrayItem('bullets', index, '', e.target.value)}
                                placeholder={`Feature ${index + 1}`}
                                className="h-9"
                              />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    onClick={() => removeArrayItem('bullets', index)}
                                    className="h-9 w-9 p-0 flex-shrink-0"
                                  >
                                    <Trash2 className={iconSizes.sm} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remove feature</TooltipContent>
                              </Tooltip>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addArrayItem('bullets', '')}
                            className="w-full h-8"
                          >
                            <Plus className={`${iconSizes.sm} mr-2`} />
                            Add Feature
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Text Only specific */}
                  {block.type === 'text-only' && (
                    <>
                      {('ctaText' in block.props) && (
                        <>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-cta" className="text-sm">Call-to-Action</Label>
                            <Switch
                              id="show-cta"
                              checked={block.props.showCta ?? true}
                              onCheckedChange={(checked) => updateProp('showCta', checked)}
                            />
                          </div>
                          
                          {block.props.showCta !== false && (
                            <>
                              <div>
                                <Label className="text-sm">Text</Label>
                                <Input
                                  value={block.props.ctaText || ''}
                                  onChange={(e) => updateProp('ctaText', e.target.value)}
                                  placeholder="Learn More"
                                  className="h-9 mt-1.5"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-sm">Link</Label>
                                <Input
                                  value={block.props.ctaLink || ''}
                                  onChange={(e) => updateProp('ctaLink', e.target.value)}
                                  placeholder="https://..."
                                  className="h-9 mt-1.5"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Multi-Update specific */}
                  {block.type === 'multi-update' && (
                    <>
                      <div>
                        <Label className="font-semibold text-sm">Updates</Label>
                        <div className="space-y-3 mt-2">
                          {(block.props.updates || []).map((update: any, index: number) => (
                            <div key={index} className="p-3 border rounded-md space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold">Update {index + 1}</Label>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      onClick={() => removeArrayItem('updates', index)}
                                      className="h-9 w-9 p-0"
                                    >
                                      <Trash2 className={iconSizes.sm} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remove update</TooltipContent>
                                </Tooltip>
                              </div>
                              <Input
                                value={update.title || ''}
                                onChange={(e) => updateArrayItem('updates', index, 'title', e.target.value)}
                                placeholder="Update title"
                                className="h-9"
                              />
                              <Textarea
                                value={update.description || ''}
                                onChange={(e) => updateArrayItem('updates', index, 'description', e.target.value)}
                                placeholder="Update description"
                                rows={2}
                                className="text-sm"
                              />
                              <Input
                                value={update.ctaText || ''}
                                onChange={(e) => updateArrayItem('updates', index, 'ctaText', e.target.value)}
                                placeholder="Button text"
                                className="h-7 text-sm"
                              />
                              <Input
                                value={update.ctaLink || ''}
                                onChange={(e) => updateArrayItem('updates', index, 'ctaLink', e.target.value)}
                                placeholder="Button link (https://...)"
                                className="h-7 text-sm"
                              />
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addArrayItem('updates', { title: '', description: '', ctaText: '', ctaLink: '' })}
                            className="w-full h-8"
                          >
                            <Plus className={`${iconSizes.sm} mr-2`} />
                            Add Update
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Item Grid specific */}
                  {block.type === 'item-grid' && (
                    <>
                      <div>
                        <Label className="text-sm">Grid Columns</Label>
                        <Select 
                          value={String(block.props.columns || 3)}
                          onValueChange={(v) => updateProp('columns', Number(v))}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 Columns</SelectItem>
                            <SelectItem value="3">3 Columns</SelectItem>
                            <SelectItem value="4">4 Columns</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-semibold">Grid Items</Label>
                        <div className="space-y-3 mt-2">
                          {(block.props.items || []).map((item: any, index: number) => (
                            <div key={index} className="p-3 border rounded-md space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold">Item {index + 1}</Label>
                                <Button
                                  variant="ghost"
                                  onClick={() => removeArrayItem('items', index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                              <Input
                                value={item.icon || ''}
                                onChange={(e) => updateArrayItem('items', index, 'icon', e.target.value)}
                                placeholder="Icon emoji"
                                className="h-9"
                              />
                              <Input
                                value={item.title || ''}
                                onChange={(e) => updateArrayItem('items', index, 'title', e.target.value)}
                                placeholder="Item title"
                                className="h-9"
                              />
                              <Textarea
                                value={item.description || ''}
                                onChange={(e) => updateArrayItem('items', index, 'description', e.target.value)}
                                placeholder="Item description"
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addArrayItem('items', { icon: '', title: '', description: '' })}
                            className="w-full h-8"
                          >
                            <Plus className={`${iconSizes.sm} mr-2`} />
                            Add Item
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Warning Block specific */}
                  {block.type === 'warning' && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Warning Type</Label>
                        <Select 
                          value={block.props.warningType || 'warning'}
                          onValueChange={(v) => updateProp('warningType', v)}
                        >
                          <SelectTrigger className="h-9 mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Code Snippet specific */}
                  {block.type === 'code-snippet' && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Language</Label>
                        <Switch
                          checked={block.props.showLanguage ?? true}
                          onCheckedChange={(checked) => updateProp('showLanguage', checked)}
                        />
                      </div>
                      
                      {block.props.showLanguage !== false && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Language</Label>
                          <Input
                            value={block.props.language || ''}
                            onChange={(e) => updateProp('language', e.target.value)}
                            placeholder="javascript"
                            className="h-9 mt-1.5"
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Code</Label>
                        <Textarea
                          value={block.props.code || ''}
                          onChange={(e) => updateProp('code', e.target.value)}
                          placeholder="Enter code..."
                          rows={6}
                          className="font-mono text-xs mt-1.5"
                        />
                      </div>
                    </>
                  )}

                  {/* Two Column specific */}
                  {block.type === 'two-column' && (
                    <>
                      <div>
                        <Label className="text-sm font-semibold">Left Column</Label>
                        <div className="space-y-2 mt-2">
                          <Input
                            value={block.props.leftTitle || ''}
                            onChange={(e) => updateProp('leftTitle', e.target.value)}
                            placeholder="Left title"
                            className="h-9"
                          />
                          <Textarea
                            value={block.props.leftContent || ''}
                            onChange={(e) => updateProp('leftContent', e.target.value)}
                            placeholder="Left content"
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-semibold">Right Column</Label>
                        <div className="space-y-2 mt-2">
                          <Input
                            value={block.props.rightTitle || ''}
                            onChange={(e) => updateProp('rightTitle', e.target.value)}
                            placeholder="Right title"
                            className="h-9"
                          />
                          <Textarea
                            value={block.props.rightContent || ''}
                            onChange={(e) => updateProp('rightContent', e.target.value)}
                            placeholder="Right content"
                            rows={3}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Video Block specific */}
                  {block.type === 'video-block' && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Thumbnail Alt Text</Label>
                        <Input
                          value={block.props.thumbnailAlt || ''}
                          onChange={(e) => updateProp('thumbnailAlt', e.target.value)}
                          placeholder="Video thumbnail"
                          className="h-9 mt-1.5"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Video Link</Label>
                        <Input
                          value={block.props.videoLink || ''}
                          onChange={(e) => updateProp('videoLink', e.target.value)}
                          placeholder="https://..."
                          className="h-9 mt-1.5"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Duration</Label>
                        <Input
                          value={block.props.duration || ''}
                          onChange={(e) => updateProp('duration', e.target.value)}
                          placeholder="5:30"
                          className="h-9 mt-1.5"
                        />
                      </div>
                    </>
                  )}

                  {/* Stats & Metrics specific */}
                  {block.type === 'stats-metrics' && (
                    <>
                      <div>
                        <Label className="font-semibold text-sm">Statistics</Label>
                        <div className="space-y-3 mt-2">
                          {(block.props.stats || []).map((stat: any, index: number) => (
                            <div key={index} className="p-2 border rounded-md space-y-2 bg-muted/20">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold">Stat {index + 1}</Label>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      onClick={() => removeArrayItem('stats', index)}
                                      className="h-9 w-9 p-0"
                                    >
                                      <Trash2 className={iconSizes.sm} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remove stat</TooltipContent>
                                </Tooltip>
                              </div>
                              <Input
                                value={stat.value || ''}
                                onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                                placeholder="42%"
                                className="h-9"
                              />
                              <Input
                                value={stat.label || ''}
                                onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                                placeholder="Increase"
                                className="h-9"
                              />
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addArrayItem('stats', { value: '', label: '' })}
                            className="w-full h-8"
                          >
                            <Plus className={`${iconSizes.sm} mr-2`} />
                            Add Stat
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Timeline specific */}
                  {block.type === 'timeline' && (
                    <>
                      <div>
                        <Label className="font-semibold text-sm">Timeline Events</Label>
                        <div className="space-y-3 mt-2">
                          {(block.props.events || []).map((event: any, index: number) => (
                            <div key={index} className="p-2 border rounded-md space-y-2 bg-muted/20">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold">Event {index + 1}</Label>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      onClick={() => removeArrayItem('events', index)}
                                      className="h-9 w-9 p-0"
                                    >
                                      <Trash2 className={iconSizes.sm} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remove event</TooltipContent>
                                </Tooltip>
                              </div>
                              <Input
                                value={event.date || ''}
                                onChange={(e) => updateArrayItem('events', index, 'date', e.target.value)}
                                placeholder="Date"
                                className="h-9"
                              />
                              <Input
                                value={event.title || ''}
                                onChange={(e) => updateArrayItem('events', index, 'title', e.target.value)}
                                placeholder="Event title"
                                className="h-9"
                              />
                              <Textarea
                                value={event.description || ''}
                                onChange={(e) => updateArrayItem('events', index, 'description', e.target.value)}
                                placeholder="Event description"
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addArrayItem('events', { date: '', title: '', description: '' })}
                            className="w-full h-8"
                          >
                            <Plus className={`${iconSizes.sm} mr-2`} />
                            Add Event
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                </AccordionContent>
              </AccordionItem>
              
            </Accordion>
            
        </div>
      </ScrollArea>
    </aside>
    </TooltipProvider>
  );
}
