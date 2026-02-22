/**
 * Theme Catalog - Multi-Zone Color Themes
 * 
 * Each theme supports 3 zones: Header, Body, Footer
 * Zones have independent bg/fg color pairs for professional email layouts.
 * 
 * Example: Kore Default theme
 * - Header: Blue background (#004EEB) with white text
 * - Body: White background (#FFFFFF) with dark text
 * - Footer: Light blue tint (#EEF4FF) with dark text
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ThemeCategory = 'brand' | 'neutral' | 'colorful';
export type ThemeType = 'light' | 'dark'; // NEW: Light vs Dark theme classification

export interface ThemeZone {
  bg: string;  // Background color
  fg: string;  // Foreground/text color
  
  // NEW: Extended color tokens for theme-based design
  primary500?: string;      // Lighter primary color (for body/content)
  primary600?: string;      // Darker primary color (for header/CTA/footer)
  textDark?: string;        // Dark text option (for light backgrounds)
  textLight?: string;       // Light text option (for dark backgrounds)
  bg50?: string;            // 50% lightness - subtle lighter variant
  bg100?: string;           // 75% lightness - clearly lighter variant
  bg200?: string;           // HSL-calculated: L + (100-L) * 0.5 (button bg in colorful mode)
  bg300?: string;           // HSL-calculated: L + (100-L) * 0.75 (hover states)
  fg200?: string;           // HSL-calculated: for swapped mode (50% shift)
  fg300?: string;           // HSL-calculated: for swapped mode (75% shift)
}

export interface ThemeDefinition {
  id: string;              // Unique ID (e.g., 'kore-default')
  name: string;            // Display name (e.g., 'Kore Default')
  
  // MULTI-ZONE COLORS (NEW)
  header: ThemeZone;       // Header zone colors
  body: ThemeZone;         // Body/content zone colors
  footer: ThemeZone;       // Footer zone colors
  
  // BACKWARD COMPATIBILITY (DEPRECATED - defaults to header colors)
  bg?: string;             // Fallback to header.bg
  fg?: string;             // Fallback to header.fg
  
  category: ThemeCategory; // Category for grouping
  themeType?: ThemeType;   // NEW: Light or dark theme
  description?: string;    // Optional description
  cssClass: string;        // CSS class name (e.g., 'theme-kore-default')
  
  // CSS VARIABLES (EXTENDED for multi-zone)
  cssVars: {
    headerBg: string;      // '--theme-{id}-header-bg'
    headerFg: string;      // '--theme-{id}-header-fg'
    bodyBg: string;        // '--theme-{id}-body-bg'
    bodyFg: string;        // '--theme-{id}-body-fg'
    footerBg: string;      // '--theme-{id}-footer-bg'
    footerFg: string;      // '--theme-{id}-footer-fg'
    
    // NEW: Extended token CSS variables
    headerPrimary500?: string;
    headerPrimary600?: string;
    headerTextDark?: string;
    headerTextLight?: string;
    headerBg50?: string;
    headerBg100?: string;
    
    bodyPrimary500?: string;
    bodyPrimary600?: string;
    bodyTextDark?: string;
    bodyTextLight?: string;
    bodyBg50?: string;
    bodyBg100?: string;
    
    footerPrimary500?: string;
    footerPrimary600?: string;
    footerTextDark?: string;
    footerTextLight?: string;
    footerBg50?: string;
    footerBg100?: string;
  };
  
  isDefault?: boolean;     // Is this the default theme?
}

// ============================================================================
// THEME CATALOG - Multi-Zone Themes
// ============================================================================

export const THEME_CATALOG: ThemeDefinition[] = [
  // ===== BRAND THEMES (4 - includes new Kore Default) =====
  {
    id: 'kore-default',
    name: 'Kore Default',
    header: {
      bg: '#004EEB',  // Kore.ai primary blue
      fg: '#FFFFFF',  // White text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue (for body/content)
      primary600: '#004EEB',    // Main brand blue (for header/CTA)
      textDark: '#1E293B',      // Dark text for light backgrounds
      textLight: '#FFFFFF',     // Light text for dark backgrounds
      bg50: '#EFF6FF',          // Lightest blue tint
      bg100: '#DBEAFE',         // Light blue tint
      bg200: '#8097F5',         // HSL: L + (100-L) * 0.5
      bg300: '#BFC9FA',         // HSL: L + (100-L) * 0.75
      fg200: '#808080',         // HSL: L * (1 - 0.5) - for swapping
      fg300: '#404040',         // HSL: L * (1 - 0.75) - for swapping
    },
    body: {
      bg: '#FFFFFF',  // Clean white background
      fg: '#1E293B',  // Dark slate text (readable)
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue (for body/content)
      primary600: '#004EEB',    // Main brand blue (for CTAs)
      textDark: '#1E293B',      // Dark text for light backgrounds
      textLight: '#FFFFFF',     // Light text for dark backgrounds
      bg50: '#F8FAFC',          // Lightest gray tint
      bg100: '#F1F5F9',         // Light gray tint
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F7F9FC',  // Light blue tint
      fg: '#1E293B',  // Dark slate text (readable)
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue (for body/content)
      primary600: '#004EEB',    // Main brand blue (for CTAs)
      textDark: '#1E293B',      // Dark text for light backgrounds
      textLight: '#FFFFFF',     // Light text for dark backgrounds
      bg50: '#EFF6FF',          // Lightest blue tint
      bg100: '#DBEAFE',         // Light blue tint
      bg200: '#FCFDFE',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFEFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#004EEB',    // Backward compat - defaults to header.bg
    fg: '#FFFFFF',    // Backward compat - defaults to header.fg
    category: 'brand',
    themeType: 'light',  // NEW: Light theme classification
    description: 'Official Kore.ai brand theme with professional white body',
    cssClass: 'theme-kore-default',
    cssVars: {
      headerBg: '--theme-kore-default-header-bg',
      headerFg: '--theme-kore-default-header-fg',
      bodyBg: '--theme-kore-default-body-bg',
      bodyFg: '--theme-kore-default-body-fg',
      footerBg: '--theme-kore-default-footer-bg',
      footerFg: '--theme-kore-default-footer-fg',
      // NEW: Extended token CSS variables
      headerPrimary500: '--theme-kore-default-header-primary-500',
      headerPrimary600: '--theme-kore-default-header-primary-600',
      headerTextDark: '--theme-kore-default-header-text-dark',
      headerTextLight: '--theme-kore-default-header-text-light',
      headerBg50: '--theme-kore-default-header-bg-50',
      headerBg100: '--theme-kore-default-header-bg-100',
      bodyPrimary500: '--theme-kore-default-body-primary-500',
      bodyPrimary600: '--theme-kore-default-body-primary-600',
      bodyTextDark: '--theme-kore-default-body-text-dark',
      bodyTextLight: '--theme-kore-default-body-text-light',
      bodyBg50: '--theme-kore-default-body-bg-50',
      bodyBg100: '--theme-kore-default-body-bg-100',
      footerPrimary500: '--theme-kore-default-footer-primary-500',
      footerPrimary600: '--theme-kore-default-footer-primary-600',
      footerTextDark: '--theme-kore-default-footer-text-dark',
      footerTextLight: '--theme-kore-default-footer-text-light',
      footerBg50: '--theme-kore-default-footer-bg-50',
      footerBg100: '--theme-kore-default-footer-bg-100',
    },
    isDefault: true,  // NEW DEFAULT THEME ✅
  },
  {
    id: 'brand-light',
    name: 'Brand Light',
    header: {
      bg: '#EEF4FF',  // Soft brand tint
      fg: '#1E3A8A',  // Dark blue text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#1E3A8A',    // Darker blue (header fg)
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F0F5FF',          // Lightest blue tint
      bg100: '#E0EBFF',         // Light blue tint
      bg200: '#F6F9FF',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFCFF',         // HSL: L + (100-L) * 0.75
      fg200: '#667DB3',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#99AACE',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#1E3A8A',    // Darker blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#DBEAFE',  // Slightly darker blue tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#1E3A8A',    // Darker blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EFF6FF',          // Lightest blue tint
      bg100: '#DBEAFE',         // Light blue tint
      bg200: '#EDEFF7',         // HSL: L + (100-L) * 0.5
      bg300: '#F6F7FB',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#EEF4FF',    // Backward compat
    fg: '#1E3A8A',    // Backward compat
    category: 'brand',
    themeType: 'light',  // NEW
    description: 'Soft brand tint with readable dark blue text',
    cssClass: 'theme-brand-light',
    cssVars: {
      headerBg: '--theme-brand-light-header-bg',
      headerFg: '--theme-brand-light-header-fg',
      bodyBg: '--theme-brand-light-body-bg',
      bodyFg: '--theme-brand-light-body-fg',
      footerBg: '--theme-brand-light-footer-bg',
      footerFg: '--theme-brand-light-footer-fg',
      // NEW
      headerPrimary500: '--theme-brand-light-header-primary-500',
      headerPrimary600: '--theme-brand-light-header-primary-600',
      headerTextDark: '--theme-brand-light-header-text-dark',
      headerTextLight: '--theme-brand-light-header-text-light',
      headerBg50: '--theme-brand-light-header-bg-50',
      headerBg100: '--theme-brand-light-header-bg-100',
      bodyPrimary500: '--theme-brand-light-body-primary-500',
      bodyPrimary600: '--theme-brand-light-body-primary-600',
      bodyTextDark: '--theme-brand-light-body-text-dark',
      bodyTextLight: '--theme-brand-light-body-text-light',
      bodyBg50: '--theme-brand-light-body-bg-50',
      bodyBg100: '--theme-brand-light-body-bg-100',
      footerPrimary500: '--theme-brand-light-footer-primary-500',
      footerPrimary600: '--theme-brand-light-footer-primary-600',
      footerTextDark: '--theme-brand-light-footer-text-dark',
      footerTextLight: '--theme-brand-light-footer-text-light',
      footerBg50: '--theme-brand-light-footer-bg-50',
      footerBg100: '--theme-brand-light-footer-bg-100',
    },
  },
  {
    id: 'brand-primary',
    name: 'Brand Primary',
    header: {
      bg: '#215AF1',  // Vivid brand blue
      fg: '#FFFFFF',  // White text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#215AF1',    // Main brand blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EFF6FF',          // Lightest blue tint
      bg100: '#DBEAFE',         // Light blue tint
      bg200: '#90ACF8',         // HSL: L + (100-L) * 0.5
      bg300: '#C7D6FB',         // HSL: L + (100-L) * 0.75
      fg200: '#808080',         // HSL: L * (1 - 0.5) - for swapping
      fg300: '#404040',         // HSL: L * (1 - 0.75) - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#215AF1',    // Main brand blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#EFF6FF',  // Light blue tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#215AF1',    // Main brand blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EFF6FF',          // Lightest blue tint
      bg100: '#DBEAFE',         // Light blue tint
      bg200: '#F7FAFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFDFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#215AF1',    // Backward compat
    fg: '#FFFFFF',    // Backward compat
    category: 'brand',
    themeType: 'light',  // NEW
    description: 'Vivid brand blue with white text',
    cssClass: 'theme-brand-primary',
    cssVars: {
      headerBg: '--theme-brand-primary-header-bg',
      headerFg: '--theme-brand-primary-header-fg',
      bodyBg: '--theme-brand-primary-body-bg',
      bodyFg: '--theme-brand-primary-body-fg',
      footerBg: '--theme-brand-primary-footer-bg',
      footerFg: '--theme-brand-primary-footer-fg',
      // NEW
      headerPrimary500: '--theme-brand-primary-header-primary-500',
      headerPrimary600: '--theme-brand-primary-header-primary-600',
      headerTextDark: '--theme-brand-primary-header-text-dark',
      headerTextLight: '--theme-brand-primary-header-text-light',
      headerBg50: '--theme-brand-primary-header-bg-50',
      headerBg100: '--theme-brand-primary-header-bg-100',
      bodyPrimary500: '--theme-brand-primary-body-primary-500',
      bodyPrimary600: '--theme-brand-primary-body-primary-600',
      bodyTextDark: '--theme-brand-primary-body-text-dark',
      bodyTextLight: '--theme-brand-primary-body-text-light',
      bodyBg50: '--theme-brand-primary-body-bg-50',
      bodyBg100: '--theme-brand-primary-body-bg-100',
      footerPrimary500: '--theme-brand-primary-footer-primary-500',
      footerPrimary600: '--theme-brand-primary-footer-primary-600',
      footerTextDark: '--theme-brand-primary-footer-text-dark',
      footerTextLight: '--theme-brand-primary-footer-text-light',
      footerBg50: '--theme-brand-primary-footer-bg-50',
      footerBg100: '--theme-brand-primary-footer-bg-100',
    },
    isDefault: false,  // No longer default (Kore Default is now default)
  },
  {
    id: 'brand-dark',
    name: 'Brand Dark',
    header: {
      bg: '#0F1E54',  // Deep navy
      fg: '#F0F3FF',  // Off-white text
      // NEW: Extended color tokens (DARK THEME)
      primary500: '#6366F1',    // Lighter purple-blue for visibility
      primary600: '#4F46E5',    // Vivid primary
      textDark: '#1E293B',      // Dark text
      textLight: '#F8FAFC',     // Very light text (primary)
      bg50: '#1E3A8A',          // Lighter navy (elevated surface)
      bg100: '#1E40AF',         // Mid navy
      bg200: '#C7D1F0',         // HSL: DARK theme handling
      bg300: '#E3E8F7',         // HSL: DARK theme handling
      fg200: '#C4C9E0',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#E1E4EF',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT BODY)
      primary500: '#6366F1',    // Lighter purple-blue
      primary600: '#4F46E5',    // Vivid primary
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#EEF2FF',  // Light indigo tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT FOOTER)
      primary500: '#6366F1',    // Lighter purple-blue
      primary600: '#4F46E5',    // Vivid primary
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F0F5FF',          // Lightest indigo
      bg100: '#E0EBFF',         // Light indigo
      bg200: '#F7F8FF',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFCFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#0F1E54',    // Backward compat
    fg: '#F0F3FF',    // Backward compat
    category: 'brand',
    themeType: 'dark',  // NEW: DARK THEME
    description: 'Deep navy with off-white text',
    cssClass: 'theme-brand-dark',
    cssVars: {
      headerBg: '--theme-brand-dark-header-bg',
      headerFg: '--theme-brand-dark-header-fg',
      bodyBg: '--theme-brand-dark-body-bg',
      bodyFg: '--theme-brand-dark-body-fg',
      footerBg: '--theme-brand-dark-footer-bg',
      footerFg: '--theme-brand-dark-footer-fg',
      // NEW
      headerPrimary500: '--theme-brand-dark-header-primary-500',
      headerPrimary600: '--theme-brand-dark-header-primary-600',
      headerTextDark: '--theme-brand-dark-header-text-dark',
      headerTextLight: '--theme-brand-dark-header-text-light',
      headerBg50: '--theme-brand-dark-header-bg-50',
      headerBg100: '--theme-brand-dark-header-bg-100',
      bodyPrimary500: '--theme-brand-dark-body-primary-500',
      bodyPrimary600: '--theme-brand-dark-body-primary-600',
      bodyTextDark: '--theme-brand-dark-body-text-dark',
      bodyTextLight: '--theme-brand-dark-body-text-light',
      bodyBg50: '--theme-brand-dark-body-bg-50',
      bodyBg100: '--theme-brand-dark-body-bg-100',
      footerPrimary500: '--theme-brand-dark-footer-primary-500',
      footerPrimary600: '--theme-brand-dark-footer-primary-600',
      footerTextDark: '--theme-brand-dark-footer-text-dark',
      footerTextLight: '--theme-brand-dark-footer-text-light',
      footerBg50: '--theme-brand-dark-footer-bg-50',
      footerBg100: '--theme-brand-dark-footer-bg-100',
    },
  },

  // ===== NEUTRAL THEMES (3) =====
  {
    id: 'neutral-light',
    name: 'Neutral Light',
    header: {
      bg: '#EEF2F6',  // Light gray
      fg: '#111827',  // Near-black text
      // NEW: Extended color tokens
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#0F172A',      // Very dark text
      textLight: '#F8FAFC',     // Very light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#F6F8FA',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFCFD',         // HSL: L + (100-L) * 0.75
      fg200: '#586F86',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#8CA3B8',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F8FAFC',  // Very light gray tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FCFDFE',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFEFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#EEF2F6',    // Backward compat
    fg: '#111827',    // Backward compat
    category: 'neutral',
    themeType: 'light',  // NEW
    description: 'Light gray with near-black text',
    cssClass: 'theme-neutral-light',
    cssVars: {
      headerBg: '--theme-neutral-light-header-bg',
      headerFg: '--theme-neutral-light-header-fg',
      bodyBg: '--theme-neutral-light-body-bg',
      bodyFg: '--theme-neutral-light-body-fg',
      footerBg: '--theme-neutral-light-footer-bg',
      footerFg: '--theme-neutral-light-footer-fg',
      // NEW
      headerPrimary500: '--theme-neutral-light-header-primary-500',
      headerPrimary600: '--theme-neutral-light-header-primary-600',
      headerTextDark: '--theme-neutral-light-header-text-dark',
      headerTextLight: '--theme-neutral-light-header-text-light',
      headerBg50: '--theme-neutral-light-header-bg-50',
      headerBg100: '--theme-neutral-light-header-bg-100',
      bodyPrimary500: '--theme-neutral-light-body-primary-500',
      bodyPrimary600: '--theme-neutral-light-body-primary-600',
      bodyTextDark: '--theme-neutral-light-body-text-dark',
      bodyTextLight: '--theme-neutral-light-body-text-light',
      bodyBg50: '--theme-neutral-light-body-bg-50',
      bodyBg100: '--theme-neutral-light-body-bg-100',
      footerPrimary500: '--theme-neutral-light-footer-primary-500',
      footerPrimary600: '--theme-neutral-light-footer-primary-600',
      footerTextDark: '--theme-neutral-light-footer-text-dark',
      footerTextLight: '--theme-neutral-light-footer-text-light',
      footerBg50: '--theme-neutral-light-footer-bg-50',
      footerBg100: '--theme-neutral-light-footer-bg-100',
    },
  },
  {
    id: 'neutral',
    name: 'Neutral',
    header: {
      bg: '#C5CED8',  // Mid gray
      fg: '#0B1220',  // Dark text
      // NEW: Extended color tokens
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#0F172A',      // Very dark text
      textLight: '#F8FAFC',     // Very light text
      bg50: '#E2E8F0',          // Lightest gray
      bg100: '#CBD5E1',         // Light gray
      bg200: '#E2E6EB',         // HSL: L + (100-L) * 0.5
      bg300: '#F0F3F5',         // HSL: L + (100-L) * 0.75
      fg200: '#555D69',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#858B94',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#E2E8F0',  // Light gray tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F1F5F9',          // Lightest gray
      bg100: '#E2E8F0',         // Light gray
      bg200: '#F0F4F7',         // HSL: L + (100-L) * 0.5
      bg300: '#F8FAFB',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#C5CED8',    // Backward compat
    fg: '#0B1220',    // Backward compat
    category: 'neutral',
    themeType: 'light',  // NEW
    description: 'Mid gray with dark text',
    cssClass: 'theme-neutral',
    cssVars: {
      headerBg: '--theme-neutral-header-bg',
      headerFg: '--theme-neutral-header-fg',
      bodyBg: '--theme-neutral-body-bg',
      bodyFg: '--theme-neutral-body-fg',
      footerBg: '--theme-neutral-footer-bg',
      footerFg: '--theme-neutral-footer-fg',
      // NEW
      headerPrimary500: '--theme-neutral-header-primary-500',
      headerPrimary600: '--theme-neutral-header-primary-600',
      headerTextDark: '--theme-neutral-header-text-dark',
      headerTextLight: '--theme-neutral-header-text-light',
      headerBg50: '--theme-neutral-header-bg-50',
      headerBg100: '--theme-neutral-header-bg-100',
      bodyPrimary500: '--theme-neutral-body-primary-500',
      bodyPrimary600: '--theme-neutral-body-primary-600',
      bodyTextDark: '--theme-neutral-body-text-dark',
      bodyTextLight: '--theme-neutral-body-text-light',
      bodyBg50: '--theme-neutral-body-bg-50',
      bodyBg100: '--theme-neutral-body-bg-100',
      footerPrimary500: '--theme-neutral-footer-primary-500',
      footerPrimary600: '--theme-neutral-footer-primary-600',
      footerTextDark: '--theme-neutral-footer-text-dark',
      footerTextLight: '--theme-neutral-footer-text-light',
      footerBg50: '--theme-neutral-footer-bg-50',
      footerBg100: '--theme-neutral-footer-bg-100',
    },
  },
  {
    id: 'neutral-dark',
    name: 'Neutral Dark',
    header: {
      bg: '#111827',  // Charcoal
      fg: '#E5E7EB',  // Light gray text
      // NEW: Extended color tokens (DARK THEME)
      primary500: '#94A3B8',    // Lighter gray for visibility
      primary600: '#64748B',    // Mid gray
      textDark: '#1E293B',      // Dark text
      textLight: '#F1F5F9',     // Very light text (primary)
      bg50: '#1F2937',          // Lighter charcoal
      bg100: '#374151',         // Mid charcoal
      bg200: '#D3D7DC',         // HSL: DARK theme handling
      bg300: '#E9EBEE',         // HSL: DARK theme handling
      fg200: '#D9DEE3',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#ECF0F3',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT BODY)
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F1F5F9',  // Very light slate
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT FOOTER)
      primary500: '#64748B',    // Lighter gray
      primary600: '#475569',    // Darker gray
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#F8FAFB',         // HSL: L + (100-L) * 0.5
      bg300: '#FCFDFE',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#111827',    // Backward compat
    fg: '#E5E7EB',    // Backward compat
    category: 'neutral',
    themeType: 'dark',  // NEW: DARK THEME
    description: 'Charcoal with light gray text',
    cssClass: 'theme-neutral-dark',
    cssVars: {
      headerBg: '--theme-neutral-dark-header-bg',
      headerFg: '--theme-neutral-dark-header-fg',
      bodyBg: '--theme-neutral-dark-body-bg',
      bodyFg: '--theme-neutral-dark-body-fg',
      footerBg: '--theme-neutral-dark-footer-bg',
      footerFg: '--theme-neutral-dark-footer-fg',
      // NEW
      headerPrimary500: '--theme-neutral-dark-header-primary-500',
      headerPrimary600: '--theme-neutral-dark-header-primary-600',
      headerTextDark: '--theme-neutral-dark-header-text-dark',
      headerTextLight: '--theme-neutral-dark-header-text-light',
      headerBg50: '--theme-neutral-dark-header-bg-50',
      headerBg100: '--theme-neutral-dark-header-bg-100',
      bodyPrimary500: '--theme-neutral-dark-body-primary-500',
      bodyPrimary600: '--theme-neutral-dark-body-primary-600',
      bodyTextDark: '--theme-neutral-dark-body-text-dark',
      bodyTextLight: '--theme-neutral-dark-body-text-light',
      bodyBg50: '--theme-neutral-dark-body-bg-50',
      bodyBg100: '--theme-neutral-dark-body-bg-100',
      footerPrimary500: '--theme-neutral-dark-footer-primary-500',
      footerPrimary600: '--theme-neutral-dark-footer-primary-600',
      footerTextDark: '--theme-neutral-dark-footer-text-dark',
      footerTextLight: '--theme-neutral-dark-footer-text-light',
      footerBg50: '--theme-neutral-dark-footer-bg-50',
      footerBg100: '--theme-neutral-dark-footer-bg-100',
    },
  },

  // ===== COLORFUL THEMES (21) =====
  {
    id: 'system-blue',
    name: 'System Blue',
    header: {
      bg: '#f1f2ef',  // Light beige
      fg: '#095fef',  // Blue text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#095fef',    // System blue (header fg)
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8F9F7',          // Lightest beige
      bg100: '#F1F2EF',         // Light beige
      bg200: '#F8F8F7',         // HSL: L + (100-L) * 0.5
      bg300: '#FCFCFB',         // HSL: L + (100-L) * 0.75
      fg200: '#6491C5',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#97B9DB',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#095fef',    // System blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#E8EBE7',  // Slight darker beige tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#3B82F6',    // Lighter blue
      primary600: '#095fef',    // System blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F1F4EF',          // Lightest beige
      bg100: '#E8EBE7',         // Light beige
      bg200: '#F3F5F3',         // HSL: L + (100-L) * 0.5
      bg300: '#F9FAF9',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#f1f2ef',    // Backward compat
    fg: '#095fef',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-system-blue',
    cssVars: {
      headerBg: '--theme-system-blue-header-bg',
      headerFg: '--theme-system-blue-header-fg',
      bodyBg: '--theme-system-blue-body-bg',
      bodyFg: '--theme-system-blue-body-fg',
      footerBg: '--theme-system-blue-footer-bg',
      footerFg: '--theme-system-blue-footer-fg',
      // NEW
      headerPrimary500: '--theme-system-blue-header-primary-500',
      headerPrimary600: '--theme-system-blue-header-primary-600',
      headerTextDark: '--theme-system-blue-header-text-dark',
      headerTextLight: '--theme-system-blue-header-text-light',
      headerBg50: '--theme-system-blue-header-bg-50',
      headerBg100: '--theme-system-blue-header-bg-100',
      bodyPrimary500: '--theme-system-blue-body-primary-500',
      bodyPrimary600: '--theme-system-blue-body-primary-600',
      bodyTextDark: '--theme-system-blue-body-text-dark',
      bodyTextLight: '--theme-system-blue-body-text-light',
      bodyBg50: '--theme-system-blue-body-bg-50',
      bodyBg100: '--theme-system-blue-body-bg-100',
      footerPrimary500: '--theme-system-blue-footer-primary-500',
      footerPrimary600: '--theme-system-blue-footer-primary-600',
      footerTextDark: '--theme-system-blue-footer-text-dark',
      footerTextLight: '--theme-system-blue-footer-text-light',
      footerBg50: '--theme-system-blue-footer-bg-50',
      footerBg100: '--theme-system-blue-footer-bg-100',
    },
  },
  {
    id: 'complexity-orange',
    name: 'Complexity Orange',
    header: {
      bg: '#c5acf3',  // Light purple
      fg: '#e15930',  // Orange text
      // NEW: Extended color tokens
      primary500: '#C084FC',    // Lighter purple
      primary600: '#9333EA',    // Darker purple
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F3EBFC',          // Lightest purple
      bg100: '#DEC5F7',         // Light purple
      bg200: '#E2D5F9',         // HSL: L + (100-L) * 0.5
      bg300: '#F0EAFC',         // HSL: L + (100-L) * 0.75
      fg200: '#D58C75',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#E9BAA7',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#C084FC',    // Lighter purple
      primary600: '#9333EA',    // Darker purple
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F3EBFC',  // Very light purple tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#C084FC',    // Lighter purple
      primary600: '#9333EA',    // Darker purple
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FAF8FC',          // Lightest purple
      bg100: '#F3EBFC',         // Light purple
      bg200: '#F9F5FE',         // HSL: L + (100-L) * 0.5
      bg300: '#FCFAFE',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#c5acf3',    // Backward compat
    fg: '#e15930',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-complexity-orange',
    cssVars: {
      headerBg: '--theme-complexity-orange-header-bg',
      headerFg: '--theme-complexity-orange-header-fg',
      bodyBg: '--theme-complexity-orange-body-bg',
      bodyFg: '--theme-complexity-orange-body-fg',
      footerBg: '--theme-complexity-orange-footer-bg',
      footerFg: '--theme-complexity-orange-footer-fg',
      // NEW
      headerPrimary500: '--theme-complexity-orange-header-primary-500',
      headerPrimary600: '--theme-complexity-orange-header-primary-600',
      headerTextDark: '--theme-complexity-orange-header-text-dark',
      headerTextLight: '--theme-complexity-orange-header-text-light',
      headerBg50: '--theme-complexity-orange-header-bg-50',
      headerBg100: '--theme-complexity-orange-header-bg-100',
      bodyPrimary500: '--theme-complexity-orange-body-primary-500',
      bodyPrimary600: '--theme-complexity-orange-body-primary-600',
      bodyTextDark: '--theme-complexity-orange-body-text-dark',
      bodyTextLight: '--theme-complexity-orange-body-text-light',
      bodyBg50: '--theme-complexity-orange-body-bg-50',
      bodyBg100: '--theme-complexity-orange-body-bg-100',
      footerPrimary500: '--theme-complexity-orange-footer-primary-500',
      footerPrimary600: '--theme-complexity-orange-footer-primary-600',
      footerTextDark: '--theme-complexity-orange-footer-text-dark',
      footerTextLight: '--theme-complexity-orange-footer-text-light',
      footerBg50: '--theme-complexity-orange-footer-bg-50',
      footerBg100: '--theme-complexity-orange-footer-bg-100',
    },
  },
  {
    id: 'lime-grid',
    name: 'Lime Grid',
    header: {
      bg: '#d4f476',  // Lime green
      fg: '#424d36',  // Dark olive text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F7FCE5',          // Lightest lime
      bg100: '#ECFCCB',         // Light lime
      bg200: '#E9F9BA',         // HSL: L + (100-L) * 0.5
      bg300: '#F4FCDD',         // HSL: L + (100-L) * 0.75
      fg200: '#84967C',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#B6C3AF',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F7FCE5',  // Very light lime tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F7FCE5',          // Lightest lime
      bg100: '#ECFCCB',         // Light lime
      bg200: '#FBFEF2',         // HSL: L + (100-L) * 0.5
      bg300: '#FDFFF8',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#d4f476',    // Backward compat
    fg: '#424d36',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-lime-grid',
    cssVars: {
      headerBg: '--theme-lime-grid-header-bg',
      headerFg: '--theme-lime-grid-header-fg',
      bodyBg: '--theme-lime-grid-body-bg',
      bodyFg: '--theme-lime-grid-body-fg',
      footerBg: '--theme-lime-grid-footer-bg',
      footerFg: '--theme-lime-grid-footer-fg',
      // NEW
      headerPrimary500: '--theme-lime-grid-header-primary-500',
      headerPrimary600: '--theme-lime-grid-header-primary-600',
      headerTextDark: '--theme-lime-grid-header-text-dark',
      headerTextLight: '--theme-lime-grid-header-text-light',
      headerBg50: '--theme-lime-grid-header-bg-50',
      headerBg100: '--theme-lime-grid-header-bg-100',
      bodyPrimary500: '--theme-lime-grid-body-primary-500',
      bodyPrimary600: '--theme-lime-grid-body-primary-600',
      bodyTextDark: '--theme-lime-grid-body-text-dark',
      bodyTextLight: '--theme-lime-grid-body-text-light',
      bodyBg50: '--theme-lime-grid-body-bg-50',
      bodyBg100: '--theme-lime-grid-body-bg-100',
      footerPrimary500: '--theme-lime-grid-footer-primary-500',
      footerPrimary600: '--theme-lime-grid-footer-primary-600',
      footerTextDark: '--theme-lime-grid-footer-text-dark',
      footerTextLight: '--theme-lime-grid-footer-text-light',
      footerBg50: '--theme-lime-grid-footer-bg-50',
      footerBg100: '--theme-lime-grid-footer-bg-100',
    },
  },
  {
    id: 'deep-olive',
    name: 'Deep Olive',
    header: {
      bg: '#424d36',  // Dark olive (HSL: 92°, 18%, 25%)
      fg: '#c5acf3',  // Light purple text
      // NEW: Extended color tokens (DARK THEME) - Fixed with proper lightness levels
      primary500: '#84CC16',    // Lighter green for visibility
      primary600: '#65A30D',    // Vivid green
      textDark: '#1E293B',      // Dark text (for light buttons)
      textLight: '#F8FAFC',     // Very light text (for dark backgrounds)
      bg50: '#7a8f6b',          // 50% lightness - HSL(92°, 18%, 50%)
      bg100: '#c8d4c0',         // 75% lightness - HSL(92°, 18%, 75%)
      bg200: '#D1E6DB',         // HSL: DARK theme handling
      bg300: '#E8F2ED',         // HSL: DARK theme handling
      fg200: '#D5DDF3',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#EAEEF9',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT BODY)
      primary500: '#84CC16',    // Lighter green
      primary600: '#65A30D',    // Vivid green
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F5F7F4',  // Very light olive tint (HSL: 92°, 18%, 96%)
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT FOOTER)
      primary500: '#84CC16',    // Lighter green
      primary600: '#65A30D',    // Vivid green
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAF7',          // Lightest olive
      bg100: '#F5F7F4',         // Light olive (same as bg)
      bg200: '#FAFBF9',         // HSL: L + (100-L) * 0.5
      bg300: '#FCFDFC',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#424d36',    // Backward compat
    fg: '#c5acf3',    // Backward compat
    category: 'colorful',
    themeType: 'dark',  // NEW: DARK THEME
    cssClass: 'theme-deep-olive',
    cssVars: {
      headerBg: '--theme-deep-olive-header-bg',
      headerFg: '--theme-deep-olive-header-fg',
      bodyBg: '--theme-deep-olive-body-bg',
      bodyFg: '--theme-deep-olive-body-fg',
      footerBg: '--theme-deep-olive-footer-bg',
      footerFg: '--theme-deep-olive-footer-fg',
      // NEW
      headerPrimary500: '--theme-deep-olive-header-primary-500',
      headerPrimary600: '--theme-deep-olive-header-primary-600',
      headerTextDark: '--theme-deep-olive-header-text-dark',
      headerTextLight: '--theme-deep-olive-header-text-light',
      headerBg50: '--theme-deep-olive-header-bg-50',
      headerBg100: '--theme-deep-olive-header-bg-100',
      bodyPrimary500: '--theme-deep-olive-body-primary-500',
      bodyPrimary600: '--theme-deep-olive-body-primary-600',
      bodyTextDark: '--theme-deep-olive-body-text-dark',
      bodyTextLight: '--theme-deep-olive-body-text-light',
      bodyBg50: '--theme-deep-olive-body-bg-50',
      bodyBg100: '--theme-deep-olive-body-bg-100',
      footerPrimary500: '--theme-deep-olive-footer-primary-500',
      footerPrimary600: '--theme-deep-olive-footer-primary-600',
      footerTextDark: '--theme-deep-olive-footer-text-dark',
      footerTextLight: '--theme-deep-olive-footer-text-light',
      footerBg50: '--theme-deep-olive-footer-bg-50',
      footerBg100: '--theme-deep-olive-footer-bg-100',
    },
  },
  {
    id: 'retro-red',
    name: 'Retro Red',
    header: {
      bg: '#e15930',  // Retro orange-red
      fg: '#fdfdfd',  // White text
      // NEW: Extended color tokens
      primary500: '#F87171',    // Lighter red/orange
      primary600: '#DC2626',    // Darker red
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FEF2F2',          // Lightest red
      bg100: '#FEE2E2',         // Light red
      bg200: '#F0AC97',         // HSL: L + (100-L) * 0.5
      bg300: '#F7D5CB',         // HSL: L + (100-L) * 0.75
      fg200: '#FEFEFE',         // HSL: L * (1 - 0.5) - for swapping
      fg300: '#FEFEFE',         // HSL: L * (1 - 0.75) - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#F87171',    // Lighter red/orange
      primary600: '#DC2626',    // Darker red
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FCF0EB',  // Very light peachy tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#F87171',    // Lighter red/orange
      primary600: '#DC2626',    // Darker red
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FEF7F5',          // Lightest peach
      bg100: '#FCF0EB',         // Light peach
      bg200: '#FDF7F5',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFBFA',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#e15930',    // Backward compat
    fg: '#fdfdfd',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-retro-red',
    cssVars: {
      headerBg: '--theme-retro-red-header-bg',
      headerFg: '--theme-retro-red-header-fg',
      bodyBg: '--theme-retro-red-body-bg',
      bodyFg: '--theme-retro-red-body-fg',
      footerBg: '--theme-retro-red-footer-bg',
      footerFg: '--theme-retro-red-footer-fg',
      // NEW
      headerPrimary500: '--theme-retro-red-header-primary-500',
      headerPrimary600: '--theme-retro-red-header-primary-600',
      headerTextDark: '--theme-retro-red-header-text-dark',
      headerTextLight: '--theme-retro-red-header-text-light',
      headerBg50: '--theme-retro-red-header-bg-50',
      headerBg100: '--theme-retro-red-header-bg-100',
      bodyPrimary500: '--theme-retro-red-body-primary-500',
      bodyPrimary600: '--theme-retro-red-body-primary-600',
      bodyTextDark: '--theme-retro-red-body-text-dark',
      bodyTextLight: '--theme-retro-red-body-text-light',
      bodyBg50: '--theme-retro-red-body-bg-50',
      bodyBg100: '--theme-retro-red-body-bg-100',
      footerPrimary500: '--theme-retro-red-footer-primary-500',
      footerPrimary600: '--theme-retro-red-footer-primary-600',
      footerTextDark: '--theme-retro-red-footer-text-dark',
      footerTextLight: '--theme-retro-red-footer-text-light',
      footerBg50: '--theme-retro-red-footer-bg-50',
      footerBg100: '--theme-retro-red-footer-bg-100',
    },
  },
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    header: {
      bg: '#095fef',  // Electric blue
      fg: '#c5acf3',  // Light purple text
      // NEW: Extended color tokens
      primary500: '#6366F1',    // Lighter indigo
      primary600: '#4F46E5',    // Darker indigo
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EEF2FF',          // Lightest indigo
      bg100: '#E0E7FF',         // Light indigo
      bg200: '#6491C5',         // HSL: L + (100-L) * 0.5
      bg300: '#97B9DB',         // HSL: L + (100-L) * 0.75
      fg200: '#D5DDF3',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#EAEEF9',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#6366F1',    // Lighter indigo
      primary600: '#4F46E5',    // Darker indigo
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#EEF4FF',  // Very light blue tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#6366F1',    // Lighter indigo
      primary600: '#4F46E5',    // Darker indigo
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EFF6FF',          // Lightest blue
      bg100: '#DBEAFE',         // Light blue
      bg200: '#F6F9FF',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFCFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#095fef',    // Backward compat
    fg: '#c5acf3',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-electric-indigo',
    cssVars: {
      headerBg: '--theme-electric-indigo-header-bg',
      headerFg: '--theme-electric-indigo-header-fg',
      bodyBg: '--theme-electric-indigo-body-bg',
      bodyFg: '--theme-electric-indigo-body-fg',
      footerBg: '--theme-electric-indigo-footer-bg',
      footerFg: '--theme-electric-indigo-footer-fg',
      // NEW
      headerPrimary500: '--theme-electric-indigo-header-primary-500',
      headerPrimary600: '--theme-electric-indigo-header-primary-600',
      headerTextDark: '--theme-electric-indigo-header-text-dark',
      headerTextLight: '--theme-electric-indigo-header-text-light',
      headerBg50: '--theme-electric-indigo-header-bg-50',
      headerBg100: '--theme-electric-indigo-header-bg-100',
      bodyPrimary500: '--theme-electric-indigo-body-primary-500',
      bodyPrimary600: '--theme-electric-indigo-body-primary-600',
      bodyTextDark: '--theme-electric-indigo-body-text-dark',
      bodyTextLight: '--theme-electric-indigo-body-text-light',
      bodyBg50: '--theme-electric-indigo-body-bg-50',
      bodyBg100: '--theme-electric-indigo-body-bg-100',
      footerPrimary500: '--theme-electric-indigo-footer-primary-500',
      footerPrimary600: '--theme-electric-indigo-footer-primary-600',
      footerTextDark: '--theme-electric-indigo-footer-text-dark',
      footerTextLight: '--theme-electric-indigo-footer-text-light',
      footerBg50: '--theme-electric-indigo-footer-bg-50',
      footerBg100: '--theme-electric-indigo-footer-bg-100',
    },
  },
  {
    id: 'resonant-moss',
    name: 'Resonant Moss',
    header: {
      bg: '#6b6f68',  // Moss gray
      fg: '#a9bd72',  // Light moss green text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#E2E8F0',          // Lightest gray-green
      bg100: '#CBD5E1',         // Light gray-green
      bg200: '#B5B7B3',         // HSL: L + (100-L) * 0.5
      bg300: '#DADBD9',         // HSL: L + (100-L) * 0.75
      fg200: '#D4DEA8',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#EAEEC3',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F3F4F2',  // Very light gray-green tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8F9F7',          // Lightest gray-green
      bg100: '#F3F4F2',         // Light gray-green
      bg200: '#F9FAF8',         // HSL: L + (100-L) * 0.5
      bg300: '#FCFCFB',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#6b6f68',    // Backward compat
    fg: '#a9bd72',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-resonant-moss',
    cssVars: {
      headerBg: '--theme-resonant-moss-header-bg',
      headerFg: '--theme-resonant-moss-header-fg',
      bodyBg: '--theme-resonant-moss-body-bg',
      bodyFg: '--theme-resonant-moss-body-fg',
      footerBg: '--theme-resonant-moss-footer-bg',
      footerFg: '--theme-resonant-moss-footer-fg',
      // NEW
      headerPrimary500: '--theme-resonant-moss-header-primary-500',
      headerPrimary600: '--theme-resonant-moss-header-primary-600',
      headerTextDark: '--theme-resonant-moss-header-text-dark',
      headerTextLight: '--theme-resonant-moss-header-text-light',
      headerBg50: '--theme-resonant-moss-header-bg-50',
      headerBg100: '--theme-resonant-moss-header-bg-100',
      bodyPrimary500: '--theme-resonant-moss-body-primary-500',
      bodyPrimary600: '--theme-resonant-moss-body-primary-600',
      bodyTextDark: '--theme-resonant-moss-body-text-dark',
      bodyTextLight: '--theme-resonant-moss-body-text-light',
      bodyBg50: '--theme-resonant-moss-body-bg-50',
      bodyBg100: '--theme-resonant-moss-body-bg-100',
      footerPrimary500: '--theme-resonant-moss-footer-primary-500',
      footerPrimary600: '--theme-resonant-moss-footer-primary-600',
      footerTextDark: '--theme-resonant-moss-footer-text-dark',
      footerTextLight: '--theme-resonant-moss-footer-text-light',
      footerBg50: '--theme-resonant-moss-footer-bg-50',
      footerBg100: '--theme-resonant-moss-footer-bg-100',
    },
  },
  {
    id: 'tangerine-cream',
    name: 'Tangerine Cream',
    header: {
      bg: '#ea6325',  // Tangerine orange
      fg: '#fbe1cd',  // Cream text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFF7ED',          // Lightest orange
      bg100: '#FFEDD5',         // Light orange
      bg200: '#F4B192',         // HSL: L + (100-L) * 0.5
      bg300: '#F9D8C8',         // HSL: L + (100-L) * 0.75
      fg200: '#FDF0E6',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#FEF7F2',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FEF3ED',  // Very light peachy cream tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFF7ED',          // Lightest orange
      bg100: '#FFEDD5',         // Light orange
      bg200: '#FEF9F6',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFCFA',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#ea6325',    // Backward compat
    fg: '#fbe1cd',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-tangerine-cream',
    cssVars: {
      headerBg: '--theme-tangerine-cream-header-bg',
      headerFg: '--theme-tangerine-cream-header-fg',
      bodyBg: '--theme-tangerine-cream-body-bg',
      bodyFg: '--theme-tangerine-cream-body-fg',
      footerBg: '--theme-tangerine-cream-footer-bg',
      footerFg: '--theme-tangerine-cream-footer-fg',
      // NEW
      headerPrimary500: '--theme-tangerine-cream-header-primary-500',
      headerPrimary600: '--theme-tangerine-cream-header-primary-600',
      headerTextDark: '--theme-tangerine-cream-header-text-dark',
      headerTextLight: '--theme-tangerine-cream-header-text-light',
      headerBg50: '--theme-tangerine-cream-header-bg-50',
      headerBg100: '--theme-tangerine-cream-header-bg-100',
      bodyPrimary500: '--theme-tangerine-cream-body-primary-500',
      bodyPrimary600: '--theme-tangerine-cream-body-primary-600',
      bodyTextDark: '--theme-tangerine-cream-body-text-dark',
      bodyTextLight: '--theme-tangerine-cream-body-text-light',
      bodyBg50: '--theme-tangerine-cream-body-bg-50',
      bodyBg100: '--theme-tangerine-cream-body-bg-100',
      footerPrimary500: '--theme-tangerine-cream-footer-primary-500',
      footerPrimary600: '--theme-tangerine-cream-footer-primary-600',
      footerTextDark: '--theme-tangerine-cream-footer-text-dark',
      footerTextLight: '--theme-tangerine-cream-footer-text-light',
      footerBg50: '--theme-tangerine-cream-footer-bg-50',
      footerBg100: '--theme-tangerine-cream-footer-bg-100',
    },
  },
  {
    id: 'golden-clay',
    name: 'Golden Clay',
    header: {
      bg: '#f6a521',  // Golden yellow
      fg: '#682b16',  // Dark brown text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest amber
      bg100: '#FEF3C7',         // Light amber
      bg200: '#FBD290',         // HSL: L + (100-L) * 0.5
      bg300: '#FDE8C7',         // HSL: L + (100-L) * 0.75
      fg200: '#B4558A',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#DA8AB4',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FEF8E7',  // Very light golden tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest amber
      bg100: '#FEF3C7',         // Light amber
      bg200: '#FEFBF3',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFDF9',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#f6a521',    // Backward compat
    fg: '#682b16',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-golden-clay',
    cssVars: {
      headerBg: '--theme-golden-clay-header-bg',
      headerFg: '--theme-golden-clay-header-fg',
      bodyBg: '--theme-golden-clay-body-bg',
      bodyFg: '--theme-golden-clay-body-fg',
      footerBg: '--theme-golden-clay-footer-bg',
      footerFg: '--theme-golden-clay-footer-fg',
      // NEW
      headerPrimary500: '--theme-golden-clay-header-primary-500',
      headerPrimary600: '--theme-golden-clay-header-primary-600',
      headerTextDark: '--theme-golden-clay-header-text-dark',
      headerTextLight: '--theme-golden-clay-header-text-light',
      headerBg50: '--theme-golden-clay-header-bg-50',
      headerBg100: '--theme-golden-clay-header-bg-100',
      bodyPrimary500: '--theme-golden-clay-body-primary-500',
      bodyPrimary600: '--theme-golden-clay-body-primary-600',
      bodyTextDark: '--theme-golden-clay-body-text-dark',
      bodyTextLight: '--theme-golden-clay-body-text-light',
      bodyBg50: '--theme-golden-clay-body-bg-50',
      bodyBg100: '--theme-golden-clay-body-bg-100',
      footerPrimary500: '--theme-golden-clay-footer-primary-500',
      footerPrimary600: '--theme-golden-clay-footer-primary-600',
      footerTextDark: '--theme-golden-clay-footer-text-dark',
      footerTextLight: '--theme-golden-clay-footer-text-light',
      footerBg50: '--theme-golden-clay-footer-bg-50',
      footerBg100: '--theme-golden-clay-footer-bg-100',
    },
  },
  {
    id: 'soft-ivory',
    name: 'Soft Ivory',
    header: {
      bg: '#fbe1cd',  // Soft ivory
      fg: '#2e573a',  // Forest green text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest amber
      bg100: '#FEF3C7',         // Light amber
      bg200: '#FDF0E6',         // HSL: L + (100-L) * 0.5
      bg300: '#FEF7F2',         // HSL: L + (100-L) * 0.75
      fg200: '#849B81',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#B6C8B3',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FEF7F0',  // Very light ivory tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest ivory
      bg100: '#FEF3C7',         // Light ivory
      bg200: '#FEFBF7',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFDFA',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#fbe1cd',    // Backward compat
    fg: '#2e573a',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-soft-ivory',
    cssVars: {
      headerBg: '--theme-soft-ivory-header-bg',
      headerFg: '--theme-soft-ivory-header-fg',
      bodyBg: '--theme-soft-ivory-body-bg',
      bodyFg: '--theme-soft-ivory-body-fg',
      footerBg: '--theme-soft-ivory-footer-bg',
      footerFg: '--theme-soft-ivory-footer-fg',
      // NEW
      headerPrimary500: '--theme-soft-ivory-header-primary-500',
      headerPrimary600: '--theme-soft-ivory-header-primary-600',
      headerTextDark: '--theme-soft-ivory-header-text-dark',
      headerTextLight: '--theme-soft-ivory-header-text-light',
      headerBg50: '--theme-soft-ivory-header-bg-50',
      headerBg100: '--theme-soft-ivory-header-bg-100',
      bodyPrimary500: '--theme-soft-ivory-body-primary-500',
      bodyPrimary600: '--theme-soft-ivory-body-primary-600',
      bodyTextDark: '--theme-soft-ivory-body-text-dark',
      bodyTextLight: '--theme-soft-ivory-body-text-light',
      bodyBg50: '--theme-soft-ivory-body-bg-50',
      bodyBg100: '--theme-soft-ivory-body-bg-100',
      footerPrimary500: '--theme-soft-ivory-footer-primary-500',
      footerPrimary600: '--theme-soft-ivory-footer-primary-600',
      footerTextDark: '--theme-soft-ivory-footer-text-dark',
      footerTextLight: '--theme-soft-ivory-footer-text-light',
      footerBg50: '--theme-soft-ivory-footer-bg-50',
      footerBg100: '--theme-soft-ivory-footer-bg-100',
    },
  },
  {
    id: 'deep-forest',
    name: 'Deep Forest',
    header: {
      bg: '#2e573a',  // Deep forest green
      fg: '#fbe1cd',  // Ivory text
      // NEW: Extended color tokens
      primary500: '#34D399',    // Lighter emerald
      primary600: '#10B981',    // Darker emerald
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#D1FAE5',          // Lightest emerald
      bg100: '#A7F3D0',         // Light emerald
      bg200: '#8FAF9C',         // HSL: DARK theme handling
      bg300: '#C7D7CE',         // HSL: DARK theme handling
      fg200: '#FDF0E6',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#FEF7F2',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#34D399',    // Lighter emerald
      primary600: '#10B981',    // Darker emerald
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F0F9F4',  // Very light green tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#34D399',    // Lighter emerald
      primary600: '#10B981',    // Darker emerald
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#D1FAE5',          // Lightest emerald
      bg100: '#A7F3D0',         // Light emerald
      bg200: '#F7FCF9',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFEFB',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#2e573a',    // Backward compat
    fg: '#fbe1cd',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-deep-forest',
    cssVars: {
      headerBg: '--theme-deep-forest-header-bg',
      headerFg: '--theme-deep-forest-header-fg',
      bodyBg: '--theme-deep-forest-body-bg',
      bodyFg: '--theme-deep-forest-body-fg',
      footerBg: '--theme-deep-forest-footer-bg',
      footerFg: '--theme-deep-forest-footer-fg',
      // NEW
      headerPrimary500: '--theme-deep-forest-header-primary-500',
      headerPrimary600: '--theme-deep-forest-header-primary-600',
      headerTextDark: '--theme-deep-forest-header-text-dark',
      headerTextLight: '--theme-deep-forest-header-text-light',
      headerBg50: '--theme-deep-forest-header-bg-50',
      headerBg100: '--theme-deep-forest-header-bg-100',
      bodyPrimary500: '--theme-deep-forest-body-primary-500',
      bodyPrimary600: '--theme-deep-forest-body-primary-600',
      bodyTextDark: '--theme-deep-forest-body-text-dark',
      bodyTextLight: '--theme-deep-forest-body-text-light',
      bodyBg50: '--theme-deep-forest-body-bg-50',
      bodyBg100: '--theme-deep-forest-body-bg-100',
      footerPrimary500: '--theme-deep-forest-footer-primary-500',
      footerPrimary600: '--theme-deep-forest-footer-primary-600',
      footerTextDark: '--theme-deep-forest-footer-text-dark',
      footerTextLight: '--theme-deep-forest-footer-text-light',
      footerBg50: '--theme-deep-forest-footer-bg-50',
      footerBg100: '--theme-deep-forest-footer-bg-100',
    },
  },
  {
    id: 'spring-leaf',
    name: 'Spring Leaf',
    header: {
      bg: '#78a34b',  // Spring green
      fg: '#682b16',  // Brown text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F7FCE5',          // Lightest lime
      bg100: '#ECFCCB',         // Light lime
      bg200: '#BBD1A5',         // HSL: L + (100-L) * 0.5
      bg300: '#DDE8D2',         // HSL: L + (100-L) * 0.75
      fg200: '#B4558A',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#DA8AB4',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F5F9F0',  // Very light green tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#84CC16',    // Lighter lime
      primary600: '#65A30D',    // Darker lime
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F7FCE5',          // Lightest lime
      bg100: '#ECFCCB',         // Light lime
      bg200: '#FAFCF7',         // HSL: L + (100-L) * 0.5
      bg300: '#FCFDFB',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#78a34b',    // Backward compat
    fg: '#682b16',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-spring-leaf',
    cssVars: {
      headerBg: '--theme-spring-leaf-header-bg',
      headerFg: '--theme-spring-leaf-header-fg',
      bodyBg: '--theme-spring-leaf-body-bg',
      bodyFg: '--theme-spring-leaf-body-fg',
      footerBg: '--theme-spring-leaf-footer-bg',
      footerFg: '--theme-spring-leaf-footer-fg',
      // NEW
      headerPrimary500: '--theme-spring-leaf-header-primary-500',
      headerPrimary600: '--theme-spring-leaf-header-primary-600',
      headerTextDark: '--theme-spring-leaf-header-text-dark',
      headerTextLight: '--theme-spring-leaf-header-text-light',
      headerBg50: '--theme-spring-leaf-header-bg-50',
      headerBg100: '--theme-spring-leaf-header-bg-100',
      bodyPrimary500: '--theme-spring-leaf-body-primary-500',
      bodyPrimary600: '--theme-spring-leaf-body-primary-600',
      bodyTextDark: '--theme-spring-leaf-body-text-dark',
      bodyTextLight: '--theme-spring-leaf-body-text-light',
      bodyBg50: '--theme-spring-leaf-body-bg-50',
      bodyBg100: '--theme-spring-leaf-body-bg-100',
      footerPrimary500: '--theme-spring-leaf-footer-primary-500',
      footerPrimary600: '--theme-spring-leaf-footer-primary-600',
      footerTextDark: '--theme-spring-leaf-footer-text-dark',
      footerTextLight: '--theme-spring-leaf-footer-text-light',
      footerBg50: '--theme-spring-leaf-footer-bg-50',
      footerBg100: '--theme-spring-leaf-footer-bg-100',
    },
  },
  {
    id: 'mahogany-glow',
    name: 'Mahogany Glow',
    header: {
      bg: '#682b16',  // Mahogany brown
      fg: '#fbe1cd',  // Cream text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFF7ED',          // Lightest orange
      bg100: '#FFEDD5',         // Light orange
      bg200: '#B4558A',         // HSL: DARK theme handling
      bg300: '#DA8AB4',         // HSL: DARK theme handling
      fg200: '#FDF0E6',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#FEF7F2',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F9F3EF',  // Very light brown tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFF7ED',          // Lightest orange
      bg100: '#FFEDD5',         // Light orange
      bg200: '#FCF9F7',         // HSL: L + (100-L) * 0.5
      bg300: '#FDFCFB',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#682b16',    // Backward compat
    fg: '#fbe1cd',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-mahogany-glow',
    cssVars: {
      headerBg: '--theme-mahogany-glow-header-bg',
      headerFg: '--theme-mahogany-glow-header-fg',
      bodyBg: '--theme-mahogany-glow-body-bg',
      bodyFg: '--theme-mahogany-glow-body-fg',
      footerBg: '--theme-mahogany-glow-footer-bg',
      footerFg: '--theme-mahogany-glow-footer-fg',
      // NEW
      headerPrimary500: '--theme-mahogany-glow-header-primary-500',
      headerPrimary600: '--theme-mahogany-glow-header-primary-600',
      headerTextDark: '--theme-mahogany-glow-header-text-dark',
      headerTextLight: '--theme-mahogany-glow-header-text-light',
      headerBg50: '--theme-mahogany-glow-header-bg-50',
      headerBg100: '--theme-mahogany-glow-header-bg-100',
      bodyPrimary500: '--theme-mahogany-glow-body-primary-500',
      bodyPrimary600: '--theme-mahogany-glow-body-primary-600',
      bodyTextDark: '--theme-mahogany-glow-body-text-dark',
      bodyTextLight: '--theme-mahogany-glow-body-text-light',
      bodyBg50: '--theme-mahogany-glow-body-bg-50',
      bodyBg100: '--theme-mahogany-glow-body-bg-100',
      footerPrimary500: '--theme-mahogany-glow-footer-primary-500',
      footerPrimary600: '--theme-mahogany-glow-footer-primary-600',
      footerTextDark: '--theme-mahogany-glow-footer-text-dark',
      footerTextLight: '--theme-mahogany-glow-footer-text-light',
      footerBg50: '--theme-mahogany-glow-footer-bg-50',
      footerBg100: '--theme-mahogany-glow-footer-bg-100',
    },
  },
  {
    id: 'rose-dust',
    name: 'Rose Dust',
    header: {
      bg: '#e1a8c2',  // Rose pink
      fg: '#2e573a',  // Forest green text
      // NEW: Extended color tokens
      primary500: '#F472B6',    // Lighter pink
      primary600: '#EC4899',    // Darker pink
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FCE7F3',          // Lightest pink
      bg100: '#FBCFE8',         // Light pink
      bg200: '#F0D3E0',         // HSL: L + (100-L) * 0.5
      bg300: '#F7E9EF',         // HSL: L + (100-L) * 0.75
      fg200: '#8FAF9C',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#C7D7CE',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#F472B6',    // Lighter pink
      primary600: '#EC4899',    // Darker pink
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FCF5F8',  // Very light rose tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#F472B6',    // Lighter pink
      primary600: '#EC4899',    // Darker pink
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FCE7F3',          // Lightest pink
      bg100: '#FBCFE8',         // Light pink
      bg200: '#FDFAFB',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFDFD',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#e1a8c2',    // Backward compat
    fg: '#2e573a',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-rose-dust',
    cssVars: {
      headerBg: '--theme-rose-dust-header-bg',
      headerFg: '--theme-rose-dust-header-fg',
      bodyBg: '--theme-rose-dust-body-bg',
      bodyFg: '--theme-rose-dust-body-fg',
      footerBg: '--theme-rose-dust-footer-bg',
      footerFg: '--theme-rose-dust-footer-fg',
      // NEW
      headerPrimary500: '--theme-rose-dust-header-primary-500',
      headerPrimary600: '--theme-rose-dust-header-primary-600',
      headerTextDark: '--theme-rose-dust-header-text-dark',
      headerTextLight: '--theme-rose-dust-header-text-light',
      headerBg50: '--theme-rose-dust-header-bg-50',
      headerBg100: '--theme-rose-dust-header-bg-100',
      bodyPrimary500: '--theme-rose-dust-body-primary-500',
      bodyPrimary600: '--theme-rose-dust-body-primary-600',
      bodyTextDark: '--theme-rose-dust-body-text-dark',
      bodyTextLight: '--theme-rose-dust-body-text-light',
      bodyBg50: '--theme-rose-dust-body-bg-50',
      bodyBg100: '--theme-rose-dust-body-bg-100',
      footerPrimary500: '--theme-rose-dust-footer-primary-500',
      footerPrimary600: '--theme-rose-dust-footer-primary-600',
      footerTextDark: '--theme-rose-dust-footer-text-dark',
      footerTextLight: '--theme-rose-dust-footer-text-light',
      footerBg50: '--theme-rose-dust-footer-bg-50',
      footerBg100: '--theme-rose-dust-footer-bg-100',
    },
  },
  {
    id: 'risd-blue',
    name: 'RISD Blue',
    header: {
      bg: '#215af1',  // RISD blue
      fg: '#f0e6d5',  // Cream text
      // NEW: Extended color tokens
      primary500: '#60A5FA',    // Lighter blue
      primary600: '#2563EB',    // Darker blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EFF6FF',          // Lightest blue
      bg100: '#DBEAFE',         // Light blue
      bg200: '#906CC1',         // HSL: DARK theme handling
      bg300: '#C7B5DF',         // HSL: DARK theme handling
      fg200: '#F7F2EA',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#FBF8F4',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#60A5FA',    // Lighter blue
      primary600: '#2563EB',    // Darker blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#EFF6FF',  // Very light blue tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#60A5FA',    // Lighter blue
      primary600: '#2563EB',    // Darker blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EFF6FF',          // Lightest blue
      bg100: '#DBEAFE',         // Light blue
      bg200: '#F7FBFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFDFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#215af1',    // Backward compat
    fg: '#f0e6d5',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-risd-blue',
    cssVars: {
      headerBg: '--theme-risd-blue-header-bg',
      headerFg: '--theme-risd-blue-header-fg',
      bodyBg: '--theme-risd-blue-body-bg',
      bodyFg: '--theme-risd-blue-body-fg',
      footerBg: '--theme-risd-blue-footer-bg',
      footerFg: '--theme-risd-blue-footer-fg',
      // NEW
      headerPrimary500: '--theme-risd-blue-header-primary-500',
      headerPrimary600: '--theme-risd-blue-header-primary-600',
      headerTextDark: '--theme-risd-blue-header-text-dark',
      headerTextLight: '--theme-risd-blue-header-text-light',
      headerBg50: '--theme-risd-blue-header-bg-50',
      headerBg100: '--theme-risd-blue-header-bg-100',
      bodyPrimary500: '--theme-risd-blue-body-primary-500',
      bodyPrimary600: '--theme-risd-blue-body-primary-600',
      bodyTextDark: '--theme-risd-blue-body-text-dark',
      bodyTextLight: '--theme-risd-blue-body-text-light',
      bodyBg50: '--theme-risd-blue-body-bg-50',
      bodyBg100: '--theme-risd-blue-body-bg-100',
      footerPrimary500: '--theme-risd-blue-footer-primary-500',
      footerPrimary600: '--theme-risd-blue-footer-primary-600',
      footerTextDark: '--theme-risd-blue-footer-text-dark',
      footerTextLight: '--theme-risd-blue-footer-text-light',
      footerBg50: '--theme-risd-blue-footer-bg-50',
      footerBg100: '--theme-risd-blue-footer-bg-100',
    },
  },
  {
    id: 'celestial-sky',
    name: 'Celestial Sky',
    header: {
      bg: '#069fec',  // Sky blue
      fg: '#f0e6d5',  // Cream text
      // NEW: Extended color tokens
      primary500: '#38BDF8',    // Lighter sky blue
      primary600: '#0EA5E9',    // Darker sky blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F0F9FF',          // Lightest sky
      bg100: '#E0F2FE',         // Light sky
      bg200: '#83C3EC',         // HSL: DARK theme handling
      bg300: '#C1DFF5',         // HSL: DARK theme handling
      fg200: '#F7F2EA',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#FBF8F4',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#38BDF8',    // Lighter sky blue
      primary600: '#0EA5E9',    // Darker sky blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F0F9FF',  // Very light sky tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#38BDF8',    // Lighter sky blue
      primary600: '#0EA5E9',    // Darker sky blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F0F9FF',          // Lightest sky
      bg100: '#E0F2FE',         // Light sky
      bg200: '#F7FBFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFDFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#069fec',    // Backward compat
    fg: '#f0e6d5',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-celestial-sky',
    cssVars: {
      headerBg: '--theme-celestial-sky-header-bg',
      headerFg: '--theme-celestial-sky-header-fg',
      bodyBg: '--theme-celestial-sky-body-bg',
      bodyFg: '--theme-celestial-sky-body-fg',
      footerBg: '--theme-celestial-sky-footer-bg',
      footerFg: '--theme-celestial-sky-footer-fg',
      // NEW
      headerPrimary500: '--theme-celestial-sky-header-primary-500',
      headerPrimary600: '--theme-celestial-sky-header-primary-600',
      headerTextDark: '--theme-celestial-sky-header-text-dark',
      headerTextLight: '--theme-celestial-sky-header-text-light',
      headerBg50: '--theme-celestial-sky-header-bg-50',
      headerBg100: '--theme-celestial-sky-header-bg-100',
      bodyPrimary500: '--theme-celestial-sky-body-primary-500',
      bodyPrimary600: '--theme-celestial-sky-body-primary-600',
      bodyTextDark: '--theme-celestial-sky-body-text-dark',
      bodyTextLight: '--theme-celestial-sky-body-text-light',
      bodyBg50: '--theme-celestial-sky-body-bg-50',
      bodyBg100: '--theme-celestial-sky-body-bg-100',
      footerPrimary500: '--theme-celestial-sky-footer-primary-500',
      footerPrimary600: '--theme-celestial-sky-footer-primary-600',
      footerTextDark: '--theme-celestial-sky-footer-text-dark',
      footerTextLight: '--theme-celestial-sky-footer-text-light',
      footerBg50: '--theme-celestial-sky-footer-bg-50',
      footerBg100: '--theme-celestial-sky-footer-bg-100',
    },
  },
  {
    id: 'midnight-penn',
    name: 'Midnight Penn',
    header: {
      bg: '#181d58',  // Midnight blue
      fg: '#f0e6d5',  // Cream text
      // NEW: Extended color tokens (DARK THEME)
      primary500: '#60A5FA',    // Lighter blue for visibility
      primary600: '#3B82F6',    // Mid blue
      textDark: '#0F172A',      // Very dark text
      textLight: '#F1F5F9',     // Very light text (primary)
      bg50: '#1E3A8A',          // Lighter midnight blue
      bg100: '#1E40AF',         // Mid midnight blue
      bg200: '#4A5196',         // HSL: DARK theme handling
      bg300: '#858CB7',         // HSL: DARK theme handling
      fg200: '#F7F2EA',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#FBF8F4',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT BODY)
      primary500: '#60A5FA',    // Lighter blue
      primary600: '#3B82F6',    // Mid blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F0F1F9',  // Very light blue tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens (LIGHT FOOTER)
      primary500: '#60A5FA',    // Lighter blue
      primary600: '#3B82F6',    // Mid blue
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#EFF6FF',          // Lightest blue
      bg100: '#DBEAFE',         // Light blue
      bg200: '#F7F8FC',         // HSL: L + (100-L) * 0.5
      bg300: '#FBFBFD',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#181d58',    // Backward compat
    fg: '#f0e6d5',    // Backward compat
    category: 'colorful',
    themeType: 'dark',  // NEW: DARK THEME
    cssClass: 'theme-midnight-penn',
    cssVars: {
      headerBg: '--theme-midnight-penn-header-bg',
      headerFg: '--theme-midnight-penn-header-fg',
      bodyBg: '--theme-midnight-penn-body-bg',
      bodyFg: '--theme-midnight-penn-body-fg',
      footerBg: '--theme-midnight-penn-footer-bg',
      footerFg: '--theme-midnight-penn-footer-fg',
      // NEW
      headerPrimary500: '--theme-midnight-penn-header-primary-500',
      headerPrimary600: '--theme-midnight-penn-header-primary-600',
      headerTextDark: '--theme-midnight-penn-header-text-dark',
      headerTextLight: '--theme-midnight-penn-header-text-light',
      headerBg50: '--theme-midnight-penn-header-bg-50',
      headerBg100: '--theme-midnight-penn-header-bg-100',
      bodyPrimary500: '--theme-midnight-penn-body-primary-500',
      bodyPrimary600: '--theme-midnight-penn-body-primary-600',
      bodyTextDark: '--theme-midnight-penn-body-text-dark',
      bodyTextLight: '--theme-midnight-penn-body-text-light',
      bodyBg50: '--theme-midnight-penn-body-bg-50',
      bodyBg100: '--theme-midnight-penn-body-bg-100',
      footerPrimary500: '--theme-midnight-penn-footer-primary-500',
      footerPrimary600: '--theme-midnight-penn-footer-primary-600',
      footerTextDark: '--theme-midnight-penn-footer-text-dark',
      footerTextLight: '--theme-midnight-penn-footer-text-light',
      footerBg50: '--theme-midnight-penn-footer-bg-50',
      footerBg100: '--theme-midnight-penn-footer-bg-100',
    },
  },
  {
    id: 'old-lace',
    name: 'Old Lace',
    header: {
      bg: '#f0e6d5',  // Old lace cream
      fg: '#181d58',  // Midnight blue text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest amber
      bg100: '#FEF3C7',         // Light amber
      bg200: '#F7F2EA',         // HSL: L + (100-L) * 0.5
      bg300: '#FBF8F4',         // HSL: L + (100-L) * 0.75
      fg200: '#4A5196',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#858CB7',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#F9F5ED',  // Slightly darker cream tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest amber
      bg100: '#FEF3C7',         // Light amber
      bg200: '#FCFAF6',         // HSL: L + (100-L) * 0.5
      bg300: '#FDFCFA',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#f0e6d5',    // Backward compat
    fg: '#181d58',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-old-lace',
    cssVars: {
      headerBg: '--theme-old-lace-header-bg',
      headerFg: '--theme-old-lace-header-fg',
      bodyBg: '--theme-old-lace-body-bg',
      bodyFg: '--theme-old-lace-body-fg',
      footerBg: '--theme-old-lace-footer-bg',
      footerFg: '--theme-old-lace-footer-fg',
      // NEW
      headerPrimary500: '--theme-old-lace-header-primary-500',
      headerPrimary600: '--theme-old-lace-header-primary-600',
      headerTextDark: '--theme-old-lace-header-text-dark',
      headerTextLight: '--theme-old-lace-header-text-light',
      headerBg50: '--theme-old-lace-header-bg-50',
      headerBg100: '--theme-old-lace-header-bg-100',
      bodyPrimary500: '--theme-old-lace-body-primary-500',
      bodyPrimary600: '--theme-old-lace-body-primary-600',
      bodyTextDark: '--theme-old-lace-body-text-dark',
      bodyTextLight: '--theme-old-lace-body-text-light',
      bodyBg50: '--theme-old-lace-body-bg-50',
      bodyBg100: '--theme-old-lace-body-bg-100',
      footerPrimary500: '--theme-old-lace-footer-primary-500',
      footerPrimary600: '--theme-old-lace-footer-primary-600',
      footerTextDark: '--theme-old-lace-footer-text-dark',
      footerTextLight: '--theme-old-lace-footer-text-light',
      footerBg50: '--theme-old-lace-footer-bg-50',
      footerBg100: '--theme-old-lace-footer-bg-100',
    },
  },
  {
    id: 'amber-dawn',
    name: 'Amber Dawn',
    header: {
      bg: '#f2ae12',  // Amber yellow
      fg: '#181d58',  // Midnight blue text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest amber
      bg100: '#FEF3C7',         // Light amber
      bg200: '#F8D789',         // HSL: L + (100-L) * 0.5
      bg300: '#FBEBC4',         // HSL: L + (100-L) * 0.75
      fg200: '#4A5196',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#858CB7',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FEF8E8',  // Very light amber tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FBBF24',    // Lighter amber
      primary600: '#D97706',    // Darker amber
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFFBEB',          // Lightest amber
      bg100: '#FEF3C7',         // Light amber
      bg200: '#FEFBF3',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFDF9',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#f2ae12',    // Backward compat
    fg: '#181d58',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-amber-dawn',
    cssVars: {
      headerBg: '--theme-amber-dawn-header-bg',
      headerFg: '--theme-amber-dawn-header-fg',
      bodyBg: '--theme-amber-dawn-body-bg',
      bodyFg: '--theme-amber-dawn-body-fg',
      footerBg: '--theme-amber-dawn-footer-bg',
      footerFg: '--theme-amber-dawn-footer-fg',
      // NEW
      headerPrimary500: '--theme-amber-dawn-header-primary-500',
      headerPrimary600: '--theme-amber-dawn-header-primary-600',
      headerTextDark: '--theme-amber-dawn-header-text-dark',
      headerTextLight: '--theme-amber-dawn-header-text-light',
      headerBg50: '--theme-amber-dawn-header-bg-50',
      headerBg100: '--theme-amber-dawn-header-bg-100',
      bodyPrimary500: '--theme-amber-dawn-body-primary-500',
      bodyPrimary600: '--theme-amber-dawn-body-primary-600',
      bodyTextDark: '--theme-amber-dawn-body-text-dark',
      bodyTextLight: '--theme-amber-dawn-body-text-light',
      bodyBg50: '--theme-amber-dawn-body-bg-50',
      bodyBg100: '--theme-amber-dawn-body-bg-100',
      footerPrimary500: '--theme-amber-dawn-footer-primary-500',
      footerPrimary600: '--theme-amber-dawn-footer-primary-600',
      footerTextDark: '--theme-amber-dawn-footer-text-dark',
      footerTextLight: '--theme-amber-dawn-footer-text-light',
      footerBg50: '--theme-amber-dawn-footer-bg-50',
      footerBg100: '--theme-amber-dawn-footer-bg-100',
    },
  },
  {
    id: 'persimmon-glow',
    name: 'Persimmon Glow',
    header: {
      bg: '#fb4c03',  // Persimmon orange
      fg: '#f0e6d5',  // Cream text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFF7ED',          // Lightest orange
      bg100: '#FFEDD5',         // Light orange
      bg200: '#FCA681',         // HSL: DARK theme handling
      bg300: '#FDD2C0',         // HSL: DARK theme handling
      fg200: '#F7F2EA',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#FBF8F4',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FFF4EE',  // Very light orange tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#FB923C',    // Lighter orange
      primary600: '#EA580C',    // Darker orange
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FFF7ED',          // Lightest orange
      bg100: '#FFEDD5',         // Light orange
      bg200: '#FFF9F6',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFCFA',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#fb4c03',    // Backward compat
    fg: '#f0e6d5',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-persimmon-glow',
    cssVars: {
      headerBg: '--theme-persimmon-glow-header-bg',
      headerFg: '--theme-persimmon-glow-header-fg',
      bodyBg: '--theme-persimmon-glow-body-bg',
      bodyFg: '--theme-persimmon-glow-body-fg',
      footerBg: '--theme-persimmon-glow-footer-bg',
      footerFg: '--theme-persimmon-glow-footer-fg',
      // NEW
      headerPrimary500: '--theme-persimmon-glow-header-primary-500',
      headerPrimary600: '--theme-persimmon-glow-header-primary-600',
      headerTextDark: '--theme-persimmon-glow-header-text-dark',
      headerTextLight: '--theme-persimmon-glow-header-text-light',
      headerBg50: '--theme-persimmon-glow-header-bg-50',
      headerBg100: '--theme-persimmon-glow-header-bg-100',
      bodyPrimary500: '--theme-persimmon-glow-body-primary-500',
      bodyPrimary600: '--theme-persimmon-glow-body-primary-600',
      bodyTextDark: '--theme-persimmon-glow-body-text-dark',
      bodyTextLight: '--theme-persimmon-glow-body-text-light',
      bodyBg50: '--theme-persimmon-glow-body-bg-50',
      bodyBg100: '--theme-persimmon-glow-body-bg-100',
      footerPrimary500: '--theme-persimmon-glow-footer-primary-500',
      footerPrimary600: '--theme-persimmon-glow-footer-primary-600',
      footerTextDark: '--theme-persimmon-glow-footer-text-dark',
      footerTextLight: '--theme-persimmon-glow-footer-text-light',
      footerBg50: '--theme-persimmon-glow-footer-bg-50',
      footerBg100: '--theme-persimmon-glow-footer-bg-100',
    },
  },
  {
    id: 'vivid-violet',
    name: 'Vivid Violet',
    header: {
      bg: '#f775e8',  // Vivid violet
      fg: '#181d58',  // Midnight blue text
      // NEW: Extended color tokens
      primary500: '#D946EF',    // Lighter fuchsia
      primary600: '#C026D3',    // Darker fuchsia
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FAF5FF',          // Lightest violet
      bg100: '#F3E8FF',         // Light violet
      bg200: '#FBBAEF',         // HSL: L + (100-L) * 0.5
      bg300: '#FDDCF7',         // HSL: L + (100-L) * 0.75
      fg200: '#4A5196',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#858CB7',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    body: {
      bg: '#FFFFFF',  // White body
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#D946EF',    // Lighter fuchsia
      primary600: '#C026D3',    // Darker fuchsia
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#F8FAFC',          // Lightest gray
      bg100: '#F1F5F9',         // Light gray
      bg200: '#FFFFFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FFFFFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    footer: {
      bg: '#FEF5FD',  // Very light violet tint
      fg: '#1E293B',  // Dark text
      // NEW: Extended color tokens
      primary500: '#D946EF',    // Lighter fuchsia
      primary600: '#C026D3',    // Darker fuchsia
      textDark: '#1E293B',      // Dark text
      textLight: '#FFFFFF',     // Light text
      bg50: '#FAF5FF',          // Lightest violet
      bg100: '#F3E8FF',         // Light violet
      bg200: '#FEFCFF',         // HSL: L + (100-L) * 0.5
      bg300: '#FEFEFF',         // HSL: L + (100-L) * 0.75
      fg200: '#69839D',         // HSL: L + (100-L) * 0.5 - for swapping
      fg300: '#96ABC1',         // HSL: L + (100-L) * 0.75 - for swapping
    },
    bg: '#f775e8',    // Backward compat
    fg: '#181d58',    // Backward compat
    category: 'colorful',
    themeType: 'light',  // NEW
    cssClass: 'theme-vivid-violet',
    cssVars: {
      headerBg: '--theme-vivid-violet-header-bg',
      headerFg: '--theme-vivid-violet-header-fg',
      bodyBg: '--theme-vivid-violet-body-bg',
      bodyFg: '--theme-vivid-violet-body-fg',
      footerBg: '--theme-vivid-violet-footer-bg',
      footerFg: '--theme-vivid-violet-footer-fg',
      // NEW
      headerPrimary500: '--theme-vivid-violet-header-primary-500',
      headerPrimary600: '--theme-vivid-violet-header-primary-600',
      headerTextDark: '--theme-vivid-violet-header-text-dark',
      headerTextLight: '--theme-vivid-violet-header-text-light',
      headerBg50: '--theme-vivid-violet-header-bg-50',
      headerBg100: '--theme-vivid-violet-header-bg-100',
      bodyPrimary500: '--theme-vivid-violet-body-primary-500',
      bodyPrimary600: '--theme-vivid-violet-body-primary-600',
      bodyTextDark: '--theme-vivid-violet-body-text-dark',
      bodyTextLight: '--theme-vivid-violet-body-text-light',
      bodyBg50: '--theme-vivid-violet-body-bg-50',
      bodyBg100: '--theme-vivid-violet-body-bg-100',
      footerPrimary500: '--theme-vivid-violet-footer-primary-500',
      footerPrimary600: '--theme-vivid-violet-footer-primary-600',
      footerTextDark: '--theme-vivid-violet-footer-text-dark',
      footerTextLight: '--theme-vivid-violet-footer-text-light',
      footerBg50: '--theme-vivid-violet-footer-bg-50',
      footerBg100: '--theme-vivid-violet-footer-bg-100',
    },
  },
];

// ============================================================================
// CATEGORY METADATA
// ============================================================================

export const THEME_CATEGORIES = {
  brand: {
    label: 'Brand',
    description: 'Official Kore.ai brand color themes',
    icon: '🎨',
  },
  neutral: {
    label: 'Neutral',
    description: 'Professional gray-scale themes',
    icon: '⚫',
  },
  colorful: {
    label: 'Colorful',
    description: 'Vibrant themed color combinations',
    icon: '🌈',
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get theme by ID
 */
export function getThemeById(id: string): ThemeDefinition | undefined {
  return THEME_CATALOG.find(theme => theme.id === id);
}

/**
 * Get theme by CSS class name
 */
export function getThemeByClass(cssClass: string): ThemeDefinition | undefined {
  return THEME_CATALOG.find(theme => theme.cssClass === cssClass);
}

/**
 * Get all themes in a category
 */
export function getThemesByCategory(category: ThemeCategory): ThemeDefinition[] {
  return THEME_CATALOG.filter(theme => theme.category === category);
}

/**
 * Get default theme
 */
export function getDefaultTheme(): ThemeDefinition {
  return THEME_CATALOG.find(theme => theme.isDefault) || THEME_CATALOG[1];
}

/**
 * Validate theme ID
 */
export function isValidThemeId(id: string): boolean {
  return THEME_CATALOG.some(theme => theme.id === id);
}

/**
 * Get theme colors for a specific zone (header/body/footer)
 * @param themeId - Theme ID to look up
 * @param zone - Which zone to get colors for ('header', 'body', or 'footer')
 * @returns Full ThemeZone object with all color tokens, or null if theme not found
 */
export function getThemeColors(
  themeId: string, 
  zone: 'header' | 'body' | 'footer' = 'header'
): ThemeZone | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  // Return complete zone object with all extended color tokens
  return theme[zone];
}

/**
 * Get all zone colors for a theme at once
 * @param themeId - Theme ID to look up
 * @returns Object with header, body, and footer colors
 */
export function getAllThemeZoneColors(themeId: string): {
  header: { bg: string; fg: string };
  body: { bg: string; fg: string };
  footer: { bg: string; fg: string };
} | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  return {
    header: { bg: theme.header.bg, fg: theme.header.fg },
    body: { bg: theme.body.bg, fg: theme.body.fg },
    footer: { bg: theme.footer.bg, fg: theme.footer.fg },
  };
}

/**
 * Generate CSS variable names for a specific zone
 * @param themeId - Theme ID to look up
 * @param zone - Which zone to get CSS vars for
 * @returns Object with CSS variable names for bg and fg
 */
export function getThemeCssVars(
  themeId: string,
  zone: 'header' | 'body' | 'footer' = 'header'
): { bg: string; fg: string } | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  const zoneKey = zone.charAt(0).toUpperCase() + zone.slice(1); // 'header' -> 'Header'
  return {
    bg: theme.cssVars[`${zone}Bg` as keyof typeof theme.cssVars],
    fg: theme.cssVars[`${zone}Fg` as keyof typeof theme.cssVars],
  };
}

// ============================================================================
// THEME UTILITIES - Inversion & Manipulation
// ============================================================================

/**
 * Invert a theme's colors (swap foreground and background)
 * Creates a new theme with inverted colors for all zones
 * 
 * @param themeId - Theme ID to invert
 * @returns New inverted theme definition, or null if theme not found
 * 
 * @example
 * const inverted = invertTheme('kore-default');
 * // Returns theme with white header bg and blue header fg (inverted)
 */
export function invertTheme(themeId: string): ThemeDefinition | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  const invertedId = `${theme.id}-inverted`;
  
  return {
    ...theme,
    id: invertedId,
    name: `${theme.name} (Inverted)`,
    
    // Swap colors for all zones
    header: {
      bg: theme.header.fg,  // Swap
      fg: theme.header.bg,
    },
    body: {
      bg: theme.body.fg,    // Swap
      fg: theme.body.bg,
    },
    footer: {
      bg: theme.footer.fg,  // Swap
      fg: theme.footer.bg,
    },
    
    // Backward compatibility
    bg: theme.header.fg,
    fg: theme.header.bg,
    
    cssClass: `theme-${invertedId}`,
    cssVars: {
      headerBg: `--theme-${invertedId}-header-bg`,
      headerFg: `--theme-${invertedId}-header-fg`,
      bodyBg: `--theme-${invertedId}-body-bg`,
      bodyFg: `--theme-${invertedId}-body-fg`,
      footerBg: `--theme-${invertedId}-footer-bg`,
      footerFg: `--theme-${invertedId}-footer-fg`,
    },
    
    description: `Inverted version of ${theme.name} theme`,
    isDefault: false, // Inverted themes are never default
  };
}

/**
 * Apply inverted colors to zone colors (for inline inversion)
 * @param zone - Zone colors to invert
 * @returns Inverted zone colors
 */
export function invertZoneColors(zone: ThemeZone): ThemeZone {
  return {
    bg: zone.fg,
    fg: zone.bg,
  };
}

// ============================================================================
// STATISTICS
// ============================================================================

export const THEME_STATS = {
  total: THEME_CATALOG.length,
  byCategory: {
    brand: getThemesByCategory('brand').length,
    neutral: getThemesByCategory('neutral').length,
    colorful: getThemesByCategory('colorful').length,
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export default THEME_CATALOG;