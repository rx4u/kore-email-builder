import React from 'react';

export interface Metric {
  value: string;
  label: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
}

export interface MetricsBlockProps {
  headline?: string;
  metrics?: Metric[];
  bgColor?: string;
  textColor?: string;
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

export const MetricsBlock = React.memo(function MetricsBlock({
  headline = 'This Sprint at a Glance',
  metrics = [
    { value: '98.7%', label: 'Uptime', delta: '+0.2%', deltaDirection: 'up' },
    { value: '1.2s', label: 'Avg Response', delta: '-0.3s', deltaDirection: 'up' },
    { value: '2,481', label: 'API Calls', delta: '+12%', deltaDirection: 'up' },
    { value: '3', label: 'Incidents', delta: '-2', deltaDirection: 'up' },
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: MetricsBlockProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const dividerColor = dark ? '#27272a' : '#e4e4e7';

  const deltaColor = (dir?: string) => dir === 'up' ? '#22c55e' : dir === 'down' ? '#ef4444' : '#71717a';
  const deltaIcon = (dir?: string) => dir === 'up' ? '↑' : dir === 'down' ? '↓' : '—';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {headline && (
          <div style={{ color: textMuted, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '24px' }}>
            {headline}
          </div>
        )}
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              {metrics.map((m, i) => (
                <td key={i} style={{ textAlign: 'center', padding: '0 16px', borderLeft: i > 0 ? `1px solid ${dividerColor}` : 'none' }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: textPrimary, fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>
                    {m.value}
                  </div>
                  {m.delta && (
                    <div style={{ fontSize: '12px', color: deltaColor(m.deltaDirection), marginTop: '4px', fontWeight: 600 }}>
                      {deltaIcon(m.deltaDirection)} {m.delta}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: textMuted, marginTop: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                    {m.label}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
});
