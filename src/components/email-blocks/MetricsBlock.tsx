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
  isEmailMode?: boolean;
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
  isEmailMode = false,
}: MetricsBlockProps) {
  const deltaColor = (dir?: string) => dir === 'up' ? '#22c55e' : dir === 'down' ? '#ef4444' : '#71717a';
  const deltaIcon = (dir?: string) => dir === 'up' ? '↑' : dir === 'down' ? '↓' : '—';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {headline && (
          <div style={{ color: '#71717a', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '24px' }}>
            {headline}
          </div>
        )}
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              {metrics.map((m, i) => (
                <td key={i} style={{ textAlign: 'center', padding: '0 16px', borderLeft: i > 0 ? '1px solid #27272a' : 'none' }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#f4f4f5', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>
                    {m.value}
                  </div>
                  {m.delta && (
                    <div style={{ fontSize: '12px', color: deltaColor(m.deltaDirection), marginTop: '4px', fontWeight: 600 }}>
                      {deltaIcon(m.deltaDirection)} {m.delta}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#71717a', marginTop: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
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
