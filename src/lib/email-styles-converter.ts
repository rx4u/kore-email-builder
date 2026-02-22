/**
 * Email Styles Converter
 * Converts CSS variables to actual values for email client compatibility
 * 
 * Email clients (Gmail, Outlook, etc.) don't support CSS variables.
 * This utility converts var(--*) references to their actual hex/px values.
 */

// CSS Variable to Value Mapping
// Based on /styles/globals.css
export const CSS_VARIABLE_MAP: Record<string, string> = {
  // Typography Scale
  'var(--text-xs)': '12px',
  'var(--text-sm)': '14px',
  'var(--text-base)': '16px',
  'var(--text-lg)': '18px',
  'var(--text-xl)': '20px',
  'var(--text-2xl)': '24px',
  
  // Font Weights
  'var(--font-weight-normal)': '400',
  'var(--font-weight-medium)': '500',
  'var(--font-weight-semibold)': '600',
  'var(--font-weight-bold)': '700',
  
  // Colors
  'var(--background)': '#ffffff',
  'var(--foreground)': '#0F172A',
  'var(--text-primary)': '#0F172A',
  'var(--text-secondary)': '#475569',
  'var(--text-tertiary)': '#64748B',
  'var(--primary)': '#004EEB',
  'var(--primary-foreground)': '#ffffff',
  'var(--border)': '#e5e7eb',
  'var(--accent)': '#f3f4f6',
  'var(--muted)': '#ececf0',
  'var(--muted-foreground)': '#64748B',
  
  // Border Radius
  'var(--radius)': '10px',
  'var(--radius-sm)': '6px',
  'var(--radius-md)': '8px',
  'var(--radius-lg)': '12px',
  'var(--radius-xl)': '16px',
};

/**
 * Converts a single CSS variable reference to its actual value
 */
export function resolveCSSVariable(value: string): string {
  if (typeof value !== 'string') return value;
  
  // Direct lookup
  if (CSS_VARIABLE_MAP[value]) {
    return CSS_VARIABLE_MAP[value];
  }
  
  return value;
}

/**
 * Recursively resolves all CSS variables in a style object
 * Converts React CSSProperties object to email-safe values
 */
export function resolveEmailStyles(
  styles: React.CSSProperties | undefined | null
): React.CSSProperties {
  // Handle null or undefined styles
  if (!styles || typeof styles !== 'object') {
    return {};
  }
  
  const resolved: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === 'string') {
      resolved[key] = resolveCSSVariable(value);
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects (though rare in inline styles)
      resolved[key] = resolveEmailStyles(value as React.CSSProperties);
    } else {
      resolved[key] = value;
    }
  }
  
  return resolved as React.CSSProperties;
}

/**
 * Creates email-safe styles by resolving CSS variables
 * Use this in email block components when isEmailMode is true
 */
export function emailSafeStyle(
  styles: React.CSSProperties | undefined | null,
  isEmailMode: boolean = false
): React.CSSProperties {
  if (!styles) {
    return {};
  }
  return isEmailMode ? resolveEmailStyles(styles) : styles;
}

/**
 * Batch resolve multiple style objects
 * Useful for components with multiple style definitions
 */
export function resolveEmailStylesBatch(
  stylesMap: Record<string, React.CSSProperties>
): Record<string, React.CSSProperties> {
  const resolved: Record<string, React.CSSProperties> = {};
  
  for (const [key, styles] of Object.entries(stylesMap)) {
    resolved[key] = resolveEmailStyles(styles);
  }
  
  return resolved;
}

/**
 * Email-safe inline style helper
 * Converts style object to inline style string with resolved variables
 */
export function toEmailInlineStyle(styles: React.CSSProperties): string {
  const resolved = resolveEmailStyles(styles);
  
  return Object.entries(resolved)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

/**
 * Common email-safe styles for reuse
 * All values are hardcoded for email client compatibility
 */
export const EMAIL_SAFE_STYLES = {
  // Layout
  blockContainer: {
    padding: '40px 40px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff'
  } as React.CSSProperties,
  
  // Typography
  titleXL: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: '-0.01em'
  } as React.CSSProperties,
  
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: '-0.01em'
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: '-0.01em'
  } as React.CSSProperties,
  
  bodyText: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#64748B',
    lineHeight: '1.7',
    margin: '0'
  } as React.CSSProperties,
  
  secondaryText: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#475569',
    lineHeight: '1.7'
  } as React.CSSProperties,
  
  smallText: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#64748B'
  } as React.CSSProperties,
  
  // Badges
  badge: {
    backgroundColor: '#004EEB',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'inline-block'
  } as React.CSSProperties,
  
  // Bullets
  bullet: {
    color: '#004EEB',
    fontSize: '20px',
    lineHeight: '1.5',
    flexShrink: 0,
    marginTop: '2px',
    marginRight: '12px'
  } as React.CSSProperties,
  
  bulletText: {
    color: '#475569',
    fontSize: '15px',
    lineHeight: '1.7'
  } as React.CSSProperties,
  
  // Buttons & CTAs
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#004EEB',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '10px 20px',
    backgroundColor: '#EFF6FF',
    borderRadius: '8px'
  } as React.CSSProperties,
  
  // Images
  roundedImage: {
    width: '100%',
    display: 'block',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  } as React.CSSProperties,
  
  // Borders
  border: {
    border: '1px solid #e5e7eb'
  } as React.CSSProperties,
  
  borderTop: {
    borderTop: '1px solid #e5e7eb'
  } as React.CSSProperties
};
