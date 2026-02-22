/**
 * Control Spacing System
 * 
 * Standardized spacing constants for property panel controls
 * Ensures visual consistency across all property controls
 */

export const CONTROL_SPACING = {
  // Spacing between individual controls within a group
  BETWEEN_CONTROLS: 'space-y-2.5',
  
  // Spacing between property groups
  BETWEEN_GROUPS: 'space-y-3',
  
  // Spacing between major sections
  BETWEEN_SECTIONS: 'space-y-4',
  
  // Internal spacing within a control (label to input)
  CONTROL_INTERNAL: 'space-y-1.5',
  
  // Grid gaps for button groups
  GRID_GAP_SMALL: 'gap-1',      // For 8-column grids (theme picker, color swatches)
  GRID_GAP_MEDIUM: 'gap-1.5',   // For 4-column grids (logo sizes)
  GRID_GAP_LARGE: 'gap-2',      // For 3-column grids (presets, alignment)
} as const;

export const LABEL_STYLES = {
  // Section title (e.g., "Theme Settings")
  SECTION: 'font-semibold',
  
  // Control label (e.g., "Spacing Preset")
  CONTROL: 'text-sm',
  
  // Small/helper text
  HELPER: 'text-xs text-muted-foreground',
} as const;

export const TRANSITION_STYLES = {
  // Standard interactive element transition
  INTERACTIVE: 'transition-all hover:scale-105 active:scale-95',
  
  // Color/theme swatch transition
  SWATCH: 'transition-all hover:scale-110 active:scale-95',
  
  // Smooth opacity transition
  FADE: 'transition-opacity duration-200',
  
  // Panel slide animations
  SLIDE: 'transition-all duration-200',
} as const;
