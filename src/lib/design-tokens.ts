// Design System Tokens for Kore.ai Email Builder
// Complete design token system for consistent UI/UX

import { getColorHex } from './color-palette';

// ============================================================================
// COLORS
// ============================================================================
export const colors = {
  primary: getColorHex('brand-primary-600'), // Kore.ai brand blue
  primaryHover: getColorHex('brand-primary-700'),
  primaryLight: getColorHex('brand-primary-50'),
} as const;

// ============================================================================
// SPACING
// ============================================================================
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
} as const;

// ============================================================================
// LAYOUT SPACING (for gaps, padding, margins)
// ============================================================================
export const layoutSpacing = {
  // Gaps between elements
  gapXs: 'gap-2',      // 8px
  gapSm: 'gap-3',      // 12px
  gapMd: 'gap-4',      // 16px
  gapLg: 'gap-6',      // 24px
  gapXl: 'gap-8',      // 32px
  
  // Padding
  paddingXs: 'px-2 py-1',     // 8px x, 4px y
  paddingSm: 'px-3 py-2',     // 12px x, 8px y
  paddingMd: 'px-4 py-2',     // 16px x, 8px y
  paddingLg: 'px-6 py-3',     // 24px x, 12px y
  paddingXl: 'px-8 py-4',     // 32px x, 16px y
} as const;

// ============================================================================
// HEADER LAYOUT
// ============================================================================
export const headerLayout = {
  height: 'h-16',               // 64px standard header height
  paddingX: 'px-6',            // 24px horizontal padding
  logoWidth: 'w-24',           // 96px logo width (h-auto for aspect ratio)
  sectionGap: 'gap-6',         // 24px gap between header sections
  itemGap: 'gap-3',            // 12px gap between items in a section
} as const;

// ============================================================================
// ICON SIZES
// ============================================================================
export const iconSizes = {
  xs: 'h-3 w-3',    // 12px
  sm: 'h-4 w-4',    // 16px
  md: 'h-5 w-5',    // 20px
  lg: 'h-6 w-6',    // 24px
  xl: 'h-8 w-8',    // 32px
} as const;

// ============================================================================
// BUTTON CONFIGURATION
// ============================================================================
export const buttonConfig = {
  // Heights
  sm: 'h-8',        // 32px
  md: 'h-10',       // 40px (default)
  lg: 'h-11',       // 44px
  
  // Padding
  paddingSm: 'px-3',
  paddingMd: 'px-4',
  paddingLg: 'px-6',
} as const;

// ============================================================================
// FORM CONTROLS
// ============================================================================
export const formControls = {
  height: 'h-10',               // Standard form control height (40px)
  padding: 'px-3 py-2',         // Standard padding
  border: 'border border-input', // Standard border
  background: 'bg-background',  // Standard background
  radius: 'rounded-md',         // New York variant - subtle corners
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
} as const;

// ============================================================================
// BORDER RADIUS - New York Variant (Subtle Rounded Corners)
// ============================================================================
export const borderRadius = {
  sm: 'rounded-sm',     // 4px - subtle
  md: 'rounded-md',     // 6px - New York default
  lg: 'rounded-lg',     // 8px - larger elements
  full: 'rounded-full', // Circles/pills
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================
export const transitions = {
  fast: 'transition-all duration-150',
  normal: 'transition-colors duration-200',
  slow: 'transition-all duration-300',
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================
export const typography = {
  // Headings
  h1: 'text-2xl',
  h2: 'text-xl',
  h3: 'text-lg',
  h4: 'text-base',
  
  // Body
  base: 'text-sm',
  small: 'text-xs',
  
  // Weights (use sparingly, rely on globals.css)
  medium: 'font-medium',
  semibold: 'font-semibold',
} as const;

// ============================================================================
// SIDEBAR CONFIGURATION
// ============================================================================
export const sidebarConfig = {
  width: 'w-72',              // 288px
  padding: 'p-4',
  itemPadding: 'px-3 py-2',
  itemGap: 'gap-2',
} as const;

// ============================================================================
// CONTENT AREA
// ============================================================================
export const contentArea = {
  maxWidth: 'max-w-4xl',      // 896px for email preview
  padding: 'p-8',
  background: 'bg-gray-50',
} as const;

// ============================================================================
// PROPERTIES PANEL
// ============================================================================
export const propertiesPanel = {
  width: 'w-80',              // 320px
  padding: 'p-4',
  sectionGap: 'space-y-6',
  fieldGap: 'space-y-2',
} as const;

// ============================================================================
// PANEL STANDARDS (Left Sidebar, Right Properties Panel)
// ============================================================================
export const panelStandards = {
  // Header
  headerPaddingY: 'py-3',         // 12px vertical - consistent across all panels
  headerPaddingX: 'px-6',         // 24px horizontal - aligns with panel content
  
  // Content padding
  // Slightly roomier horizontal padding for all panels
  contentPadding: 'px-6 py-4',    // 24px left/right, 16px top/bottom
  
  // Close/action button
  actionButtonSize: 'h-8 w-8',    // 32px square - consistent size
  
  // Section spacing
  sectionGap: 'space-y-4',        // 16px between major sections
  sectionInnerGap: 'space-y-3',   // 12px within sections
  fieldGap: 'space-y-2',          // 8px between form fields
  
  // Section headers
  sectionHeaderGap: 'gap-2',      // 8px between icon and text
} as const;

// ============================================================================
// ELEVATION (Z-INDEX)
// ============================================================================
export const elevation = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  modal: 'z-40',
  toast: 'z-50',
} as const;