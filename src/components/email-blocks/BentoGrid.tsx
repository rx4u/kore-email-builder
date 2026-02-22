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
  isEmailMode?: boolean;
}

export const BentoGrid = React.memo(function BentoGrid({
  cells = [
    { title: 'Ship faster', description: 'Automated deploy pipelines cut release time by 60%.', icon: '🚀', bgColor: '#18181b' },
    { title: 'Zero downtime', description: 'Blue-green deployments with instant rollback.', icon: '⚡', bgColor: '#1c1a00' },
    { title: 'Full visibility', description: 'Real-time logs, traces, and alerts in one place.', icon: '📊', bgColor: '#0a1a0a' },
  ],
  bgColor = '#09090b',
  isEmailMode = false,
}: BentoGridProps) {
  const [large, ...small] = cells;
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '24px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <table width="100%" cellPadding={0} cellSpacing={12}>
          <tbody>
            <tr>
              <td width="58%" style={{ backgroundColor: large?.bgColor || '#18181b', borderRadius: '12px', padding: '28px', verticalAlign: 'top', border: '1px solid #27272a' }}>
                {large?.icon && <div style={{ fontSize: '28px', marginBottom: '12px' }}>{large.icon}</div>}
                <div style={{ color: '#f4f4f5', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{large?.title}</div>
                <div style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.6 }}>{large?.description}</div>
              </td>
              <td width="38%" style={{ verticalAlign: 'top' }}>
                <table width="100%" cellPadding={0} cellSpacing={0}>
                  <tbody>
                    {small.slice(0, 2).map((cell, i) => (
                      <tr key={i}>
                        <td style={{ backgroundColor: cell.bgColor || '#18181b', borderRadius: '12px', padding: '20px', marginBottom: i === 0 ? '12px' : '0', border: '1px solid #27272a', display: 'block', marginTop: i > 0 ? '12px' : '0' }}>
                          {cell.icon && <div style={{ fontSize: '22px', marginBottom: '8px' }}>{cell.icon}</div>}
                          <div style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{cell.title}</div>
                          <div style={{ color: '#71717a', fontSize: '13px', lineHeight: 1.5 }}>{cell.description}</div>
                        </td>
                      </tr>
                    ))}
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
