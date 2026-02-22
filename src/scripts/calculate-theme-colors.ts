/**
 * Manual calculation helper for theme color tokens
 * Run this to get calculated values for all 28 themes
 */

import { hexToHSL, generateButtonTokens } from '../lib/color-utils';

// Theme data extracted from theme-catalog.ts
const themeZoneColors = [
  // BRAND THEMES
  {
    id: 'kore-default',
    name: 'Kore Default',
    type: 'light',
    zones: {
      header: '#004EEB',
      body: '#FFFFFF',
      footer: '#F7F9FC',
    }
  },
  {
    id: 'brand-light',
    name: 'Brand Light',
    type: 'light',
    zones: {
      header: '#EBF3FF',
      body: '#FFFFFF',
      footer: '#F7F9FC',
    }
  },
  {
    id: 'brand-primary',
    name: 'Brand Primary',
    type: 'light',
    zones: {
      header: '#004EEB',
      body: '#FFFFFF',
      footer: '#EBF3FF',
    }
  },
  {
    id: 'brand-dark',
    name: 'Brand Dark',
    type: 'dark',
    zones: {
      header: '#001B57',
      body: '#FFFFFF',
      footer: '#F0F4F8',
    }
  },
  // NEUTRAL THEMES
  {
    id: 'neutral-light',
    name: 'Neutral Light',
    type: 'light',
    zones: {
      header: '#F8FAFC',
      body: '#FFFFFF',
      footer: '#F1F5F9',
    }
  },
  {
    id: 'neutral',
    name: 'Neutral',
    type: 'light',
    zones: {
      header: '#E2E8F0',
      body: '#FFFFFF',
      footer: '#F8FAFC',
    }
  },
  {
    id: 'neutral-dark',
    name: 'Neutral Dark',
    type: 'dark',
    zones: {
      header: '#1E293B',
      body: '#FFFFFF',
      footer: '#F1F5F9',
    }
  },
  // COLORFUL THEMES
  {
    id: 'system-blue',
    name: 'System Blue',
    type: 'light',
    zones: {
      header: '#007AFF',
      body: '#FFFFFF',
      footer: '#F0F9FF',
    }
  },
  {
    id: 'complexity-orange',
    name: 'Complexity Orange',
    type: 'light',
    zones: {
      header: '#FF9500',
      body: '#FFFFFF',
      footer: '#FFF7ED',
    }
  },
  {
    id: 'lime-grid',
    name: 'Lime Grid',
    type: 'light',
    zones: {
      header: '#d4f476',
      body: '#FFFFFF',
      footer: '#F7FCF0',
    }
  },
  {
    id: 'deep-olive',
    name: 'Deep Olive',
    type: 'dark',
    zones: {
      header: '#3b5c49',
      body: '#FFFFFF',
      footer: '#F0F4F2',
    }
  },
  {
    id: 'retro-red',
    name: 'Retro Red',
    type: 'light',
    zones: {
      header: '#DC143C',
      body: '#FFFFFF',
      footer: '#FFF5F7',
    }
  },
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    type: 'light',
    zones: {
      header: '#6366F1',
      body: '#FFFFFF',
      footer: '#EEF2FF',
    }
  },
  {
    id: 'resonant-moss',
    name: 'Resonant Moss',
    type: 'light',
    zones: {
      header: '#84A98C',
      body: '#FFFFFF',
      footer: '#F1F8F4',
    }
  },
  {
    id: 'tangerine-cream',
    name: 'Tangerine Cream',
    type: 'light',
    zones: {
      header: '#FFB347',
      body: '#FFFFFF',
      footer: '#FFF8F0',
    }
  },
  {
    id: 'golden-clay',
    name: 'Golden Clay',
    type: 'light',
    zones: {
      header: '#DAA520',
      body: '#FFFFFF',
      footer: '#FFFBF0',
    }
  },
  {
    id: 'soft-ivory',
    name: 'Soft Ivory',
    type: 'light',
    zones: {
      header: '#fbe1cd',
      body: '#FFFFFF',
      footer: '#FEF7F0',
    }
  },
  {
    id: 'deep-forest',
    name: 'Deep Forest',
    type: 'light',
    zones: {
      header: '#2e573a',
      body: '#FFFFFF',
      footer: '#F0F9F4',
    }
  },
  {
    id: 'spring-leaf',
    name: 'Spring Leaf',
    type: 'light',
    zones: {
      header: '#78a34b',
      body: '#FFFFFF',
      footer: '#F5F9F0',
    }
  },
  {
    id: 'mahogany-glow',
    name: 'Mahogany Glow',
    type: 'light',
    zones: {
      header: '#682b16',
      body: '#FFFFFF',
      footer: '#F9F3EF',
    }
  },
  {
    id: 'rose-dust',
    name: 'Rose Dust',
    type: 'light',
    zones: {
      header: '#e1a8c2',
      body: '#FFFFFF',
      footer: '#FCF5F8',
    }
  },
  {
    id: 'risd-blue',
    name: 'RISD Blue',
    type: 'light',
    zones: {
      header: '#215af1',
      body: '#FFFFFF',
      footer: '#EFF6FF',
    }
  },
  {
    id: 'celestial-sky',
    name: 'Celestial Sky',
    type: 'light',
    zones: {
      header: '#069fec',
      body: '#FFFFFF',
      footer: '#F0F9FF',
    }
  },
  {
    id: 'midnight-penn',
    name: 'Midnight Penn',
    type: 'dark',
    zones: {
      header: '#181d58',
      body: '#FFFFFF',
      footer: '#F0F1F9',
    }
  },
  {
    id: 'old-lace',
    name: 'Old Lace',
    type: 'light',
    zones: {
      header: '#f0e6d5',
      body: '#FFFFFF',
      footer: '#F9F5ED',
    }
  },
  {
    id: 'amber-dawn',
    name: 'Amber Dawn',
    type: 'light',
    zones: {
      header: '#f2ae12',
      body: '#FFFFFF',
      footer: '#FEF8E8',
    }
  },
  {
    id: 'persimmon-glow',
    name: 'Persimmon Glow',
    type: 'light',
    zones: {
      header: '#fb4c03',
      body: '#FFFFFF',
      footer: '#FFF4EE',
    }
  },
  {
    id: 'vivid-violet',
    name: 'Vivid Violet',
    type: 'light',
    zones: {
      header: '#f775e8',
      body: '#FFFFFF',
      footer: '#FEF5FD',
    }
  },
];

function calculateAllTokens() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  THEME TOKEN CALCULATION - HSL Formula                         ║');
  console.log('║  Formula: L_new = L + (100 - L) * factor                       ║');
  console.log('║  bg200: factor = 0.5 (50% lighter)                             ║');
  console.log('║  bg300: factor = 0.75 (75% lighter)                            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  themeZoneColors.forEach((theme, index) => {
    const isDarkTheme = theme.type === 'dark';
    
    console.log(`\n${index + 1}. ${theme.name} (${theme.id}) - ${theme.type.toUpperCase()}`);
    console.log('─'.repeat(70));
    
    // Header
    const headerTokens = generateButtonTokens(theme.zones.header, isDarkTheme);
    const headerHSL = hexToHSL(theme.zones.header);
    console.log(`\n  HEADER: ${theme.zones.header}`);
    console.log(`    HSL: h=${headerHSL.h}° s=${headerHSL.s}% l=${headerHSL.l}%`);
    console.log(`    bg200: '${headerTokens.bg200}',  // HSL: L + (100-L) * 0.5`);
    console.log(`    bg300: '${headerTokens.bg300}',  // HSL: L + (100-L) * 0.75`);
    
    // Body
    const bodyTokens = generateButtonTokens(theme.zones.body, false);
    const bodyHSL = hexToHSL(theme.zones.body);
    console.log(`\n  BODY: ${theme.zones.body}`);
    console.log(`    HSL: h=${bodyHSL.h}° s=${bodyHSL.s}% l=${bodyHSL.l}%`);
    console.log(`    bg200: '${bodyTokens.bg200}',  // HSL: L + (100-L) * 0.5`);
    console.log(`    bg300: '${bodyTokens.bg300}',  // HSL: L + (100-L) * 0.75`);
    
    // Footer
    const footerTokens = generateButtonTokens(theme.zones.footer, false);
    const footerHSL = hexToHSL(theme.zones.footer);
    console.log(`\n  FOOTER: ${theme.zones.footer}`);
    console.log(`    HSL: h=${footerHSL.h}° s=${footerHSL.s}% l=${footerHSL.l}%`);
    console.log(`    bg200: '${footerTokens.bg200}',  // HSL: L + (100-L) * 0.5`);
    console.log(`    bg300: '${footerTokens.bg300}',  // HSL: L + (100-L) * 0.75`);
  });
  
  console.log('\n\n' + '═'.repeat(70));
  console.log('CALCULATION COMPLETE - 84 token pairs generated (28 themes × 3 zones)');
  console.log('═'.repeat(70) + '\n');
}

// Run the calculation
calculateAllTokens();
