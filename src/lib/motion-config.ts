/**
 * Motion Configuration & Animation Variants
 * 
 * Centralized motion system for consistent microinteractions
 * Uses motion/react (Framer Motion) for spring physics and smooth animations
 * 
 * Design Principles:
 * - Subtle & professional (avoid excessive motion)
 * - Spring-based physics for natural feel
 * - Consistent timing across similar interactions
 * - Respect user preferences (prefers-reduced-motion)
 */

// ========================================
// SPRING PRESETS
// ========================================

export const springs = {
  // Gentle - For large panels, modals, page transitions
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
    mass: 1,
  },
  
  // Default - For most UI interactions
  default: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  
  // Snappy - For buttons, small elements
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },
  
  // Bouncy - For playful interactions (success states)
  bouncy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 20,
    mass: 1,
  },
  
  // Smooth - For linear movements (no bounce)
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 40,
    mass: 1,
  },
} as const;

// ========================================
// EASING CURVES
// ========================================

export const easings = {
  // Standard curves
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0.0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  
  // Custom curves for specific interactions
  gentle: [0.16, 1, 0.3, 1],
  smooth: [0.33, 1, 0.68, 1],
  sharp: [0.4, 0, 0.6, 1],
} as const;

// ========================================
// DURATION SCALES
// ========================================

export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  moderate: 0.35,
  slow: 0.5,
  slower: 0.75,
} as const;

// ========================================
// ANIMATION VARIANTS
// ========================================

/**
 * Button Interactions
 */
export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: springs.snappy,
  },
  tap: { 
    scale: 0.98,
    transition: springs.snappy,
  },
};

export const iconButtonVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1,
    transition: springs.snappy,
  },
  tap: { 
    scale: 0.9,
    transition: springs.snappy,
  },
};

/**
 * Card Interactions (for preset styles, feature cards)
 */
export const cardHoverVariants = {
  hover: {
    y: -2,
    scale: 1.02,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Draggable Block Interactions
 */
export const draggableVariants = {
  initial: { 
    scale: 1,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  },
  hover: {
    scale: 1.01,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    transition: springs.default,
  },
  dragging: {
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    zIndex: 1000,
    transition: springs.snappy,
  },
};

/**
 * Panel Slide Animations
 */
export const panelVariants = {
  // Slide from right (property panel, theme panel)
  slideRight: {
    initial: { x: 24, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: springs.gentle,
    },
    exit: {
      x: 24,
      opacity: 0,
      transition: springs.gentle,
    },
  },
  // Legacy full-width slide (for overlay panels)
  slideRightFull: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: springs.gentle },
    exit: { x: "100%", opacity: 0, transition: springs.gentle },
  },

  // Slide from left (blocks/library panel)
  slideLeft: {
    initial: { x: -24, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: springs.gentle,
    },
    exit: {
      x: -24,
      opacity: 0,
      transition: springs.gentle,
    },
  },
  slideLeftFull: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: springs.gentle },
    exit: { x: "-100%", opacity: 0, transition: springs.gentle },
  },

  // Collapse/Expand width
  collapse: {
    initial: { width: 0, opacity: 0 },
    animate: {
      width: "auto",
      opacity: 1,
      transition: springs.smooth,
    },
    exit: {
      width: 0,
      opacity: 0,
      transition: springs.smooth,
    },
  },
};

/**
 * Sidebar strip (collapsed state) – subtle slide + fade
 */
export const sidebarStripVariants = {
  left: {
    initial: { x: -16, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: springs.gentle },
    exit: { x: -16, opacity: 0, transition: springs.gentle },
  },
  right: {
    initial: { x: 16, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: springs.gentle },
    exit: { x: 16, opacity: 0, transition: springs.gentle },
  },
};

/**
 * Right panel content switch (Theme ↔ Properties) – crossfade + slight slide
 */
export const panelContentSwitchVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: springs.gentle },
  exit: { opacity: 0, x: -12, transition: springs.gentle },
};

/**
 * Panel width animation – smooth resize so main content doesn’t jerk
 * Use with a single panel container that animates width instead of swapping elements.
 */
export const panelWidthTransition = springs.smooth;

/**
 * Fade Animations
 */
export const fadeVariants = {
  // Simple fade
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Fade with scale (pop effect)
  pop: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: springs.snappy,
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: springs.snappy,
    },
  },
  
  // Fade with slide up
  fadeUp: {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: springs.default,
    },
    exit: { 
      opacity: 0, 
      y: 10,
      transition: springs.default,
    },
  },
  
  // Fade with slide down
  fadeDown: {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: springs.default,
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: springs.default,
    },
  },
};

/**
 * List/Stagger Animations
 */
export const staggerVariants = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: springs.default,
    },
  },
};

/**
 * Tab Underline Animation
 */
export const tabUnderlineVariants = {
  initial: { scaleX: 0 },
  animate: { 
    scaleX: 1,
    transition: springs.smooth,
  },
};

/**
 * Tooltip/Popover Animations
 */
export const tooltipVariants = {
  initial: { opacity: 0, scale: 0.95, y: -5 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: durations.fast,
      ease: easings.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -5,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn,
    },
  },
};

/**
 * Success/Delete Feedback Animations
 */
export const feedbackVariants = {
  // Success pulse
  success: {
    scale: [1, 1.1, 1],
    transition: {
      duration: durations.moderate,
      ease: easings.easeInOut,
    },
  },
  
  // Shake (for errors or delete confirmation)
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: durations.moderate,
      ease: easings.easeInOut,
    },
  },
  
  // Pulse (attention)
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: durations.slow,
      repeat: Infinity,
      ease: easings.easeInOut,
    },
  },
};

/**
 * Color/Theme Transition
 */
export const colorTransition = {
  duration: durations.normal,
  ease: easings.smooth,
};

/**
 * Layout Shift Animation
 */
export const layoutTransition = {
  layout: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation config based on user preference
 */
export const getAnimationConfig = (config: any) => {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  return config;
};

/**
 * Conditional motion wrapper
 */
export const conditionalMotion = (variants: any) => {
  if (prefersReducedMotion()) {
    return {
      initial: variants.animate,
      animate: variants.animate,
      exit: variants.animate,
    };
  }
  return variants;
};
