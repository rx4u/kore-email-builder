import React from 'react';

export interface DeprecationBlockProps {
  featureName?: string;
  deprecatedDate?: string;
  eolDate?: string;
  migrationPath?: string;
  severity?: 'warning' | 'critical';
  ctaText?: string;
  ctaUrl?: string;
  outerBgColor?: string;
  isEmailMode?: boolean;
}

function isDarkBg(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export const DeprecationBlock = React.memo(function DeprecationBlock({
  featureName = 'Legacy Auth API v1',
  deprecatedDate = 'March 1, 2026',
  eolDate = 'June 1, 2026',
  migrationPath = 'Migrate to Auth API v2. See migration guide for step-by-step instructions.',
  severity = 'warning',
  ctaText = 'View Migration Guide',
  ctaUrl = '#',
  outerBgColor = '#ffffff',
  isEmailMode = false,
}: DeprecationBlockProps) {
  const borderColor = severity === 'critical' ? '#ef4444' : '#d97706';
  const bgColor = severity === 'critical' ? '#1c0a0a' : '#1a1200';
  const badgeText = severity === 'critical' ? 'CRITICAL' : 'DEPRECATION NOTICE';

  return (
    <tr>
      <td style={{ padding: '24px 40px', backgroundColor: outerBgColor }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}`, borderRadius: '8px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '24px 28px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '4px', background: borderColor, color: '#09090b', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                    {badgeText}
                  </span>
                </div>
                <div style={{ color: '#f4f4f5', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{featureName}</div>
                <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '16px' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#71717a', fontSize: '13px', paddingBottom: '8px', paddingRight: '24px', whiteSpace: 'nowrap' as const }}>Deprecated:</td>
                      <td style={{ color: '#f4f4f5', fontSize: '13px', fontWeight: 600, paddingBottom: '8px' }}>{deprecatedDate}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#71717a', fontSize: '13px', paddingRight: '24px', whiteSpace: 'nowrap' as const }}>End of Life:</td>
                      <td style={{ color: borderColor, fontSize: '13px', fontWeight: 700 }}>{eolDate}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                  <strong style={{ color: '#f4f4f5' }}>Migration path: </strong>{migrationPath}
                </div>
                {ctaText && (
                  <a href={ctaUrl} style={{ display: 'inline-block', padding: '10px 24px', background: borderColor, color: '#09090b', textDecoration: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '14px' }}>
                    {ctaText}
                  </a>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
});
