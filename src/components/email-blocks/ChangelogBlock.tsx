import React from 'react';

export type ChangeType = 'feature' | 'fix' | 'breaking' | 'deprecated' | 'improvement';

export interface ChangeSection {
  type: ChangeType;
  items: string[];
}

export interface ChangelogBlockProps {
  version?: string;
  date?: string;
  sections?: ChangeSection[];
  bgColor?: string;
  textColor?: string;
  isEmailMode?: boolean;
}

const TYPE_CONFIG: Record<ChangeType, { color: string; label: string }> = {
  feature:     { color: '#22c55e', label: 'New' },
  improvement: { color: '#3b82f6', label: 'Improved' },
  fix:         { color: '#d97706', label: 'Fixed' },
  breaking:    { color: '#ef4444', label: 'Breaking' },
  deprecated:  { color: '#a78bfa', label: 'Deprecated' },
};

function isDarkBg(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export const ChangelogBlock = React.memo(function ChangelogBlock({
  version = 'v2.1.0',
  date,
  sections = [
    { type: 'feature', items: ['New dashboard overview page', 'Bulk export to CSV'] },
    { type: 'fix', items: ['Fixed broken pagination on mobile'] },
    { type: 'breaking', items: ['Removed legacy v1 API endpoints'] },
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: ChangelogBlockProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const badgeBg = dark ? '#27272a' : '#e4e4e7';
  const listColor = dark ? '#a1a1aa' : '#52525b';

  return (
    <tr>
      <td
        bgcolor={bgColor}
        style={{
          backgroundColor: bgColor,
          padding: '32px 40px',
          fontFamily: 'DM Sans, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block', padding: '4px 10px', borderRadius: '6px',
            background: badgeBg, color: textPrimary, fontSize: '13px',
            fontWeight: 700, fontFamily: 'DM Mono, monospace',
          }}>
            {version}
          </span>
          {date && <span style={{ color: textMuted, fontSize: '13px' }}>{date}</span>}
        </div>
        {sections.map((section, si) => {
          const config = TYPE_CONFIG[section.type] || TYPE_CONFIG.feature;
          return (
            <div key={si} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: config.color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: config.color, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                  {config.label}
                </span>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 20px', listStyle: 'disc' }}>
                {section.items.map((item, ii) => (
                  <li key={ii} style={{ color: listColor, fontSize: '14px', lineHeight: 1.7, marginBottom: '4px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </td>
    </tr>
  );
});
