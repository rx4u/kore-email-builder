import React from 'react';

export interface BentoCell {
  title: string;
  description: string;
  icon?: string;
  bgColor?: string;
  link?: string;
}

export interface BentoGridProps {
  cells?: BentoCell[];
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

export const BentoGrid = React.memo(function BentoGrid({
  cells = [
    { title: 'Ship faster', description: 'Automated deploy pipelines cut release time by 60%.', icon: '🚀', bgColor: '#18181b' },
    { title: 'Zero downtime', description: 'Blue-green deployments with instant rollback.', icon: '⚡', bgColor: '#1c1a00' },
    { title: 'Full visibility', description: 'Real-time logs, traces, and alerts in one place.', icon: '📊', bgColor: '#0a1a0a' },
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: BentoGridProps) {
  const [large, ...small] = cells;

  const cellColors = (cellBg: string) => {
    const dark = isDarkBg(cellBg);
    return {
      text: textColor || (dark ? '#f4f4f5' : '#09090b'),
      muted: dark ? '#71717a' : '#52525b',
      border: dark ? '#27272a' : '#e4e4e7',
    };
  };

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '24px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <table width="100%" cellPadding={0} cellSpacing={12}>
          <tbody>
            <tr>
              {(() => { const bg = large?.bgColor || '#18181b'; const c = cellColors(bg); return (
              <td width="58%" style={{ backgroundColor: bg, borderRadius: '12px', padding: '28px', verticalAlign: 'top', border: `1px solid ${c.border}` }}>
                {large?.icon && <div style={{ fontSize: '28px', marginBottom: '12px' }}>{large.icon}</div>}
                <div style={{ color: c.text, fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{large?.title}</div>
                <div style={{ color: c.muted, fontSize: '14px', lineHeight: 1.6 }}>{large?.description}</div>
              </td>
              ); })()}
              <td width="38%" style={{ verticalAlign: 'top' }}>
                <table width="100%" cellPadding={0} cellSpacing={0}>
                  <tbody>
                    {small.slice(0, 2).map((cell, i) => {
                      const bg = cell.bgColor || '#18181b';
                      const c = cellColors(bg);
                      return (
                      <tr key={i}>
                        <td style={{ backgroundColor: bg, borderRadius: '12px', padding: '20px', border: `1px solid ${c.border}`, display: 'block', marginTop: i > 0 ? '12px' : '0' }}>
                          {cell.icon && <div style={{ fontSize: '22px', marginBottom: '8px' }}>{cell.icon}</div>}
                          <div style={{ color: c.text, fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{cell.title}</div>
                          <div style={{ color: c.muted, fontSize: '13px', lineHeight: 1.5 }}>{cell.description}</div>
                        </td>
                      </tr>
                    ); })}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
});
