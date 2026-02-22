import React from 'react';

export interface Card {
  icon?: string;
  title: string;
  description: string;
  link?: string;
}

export interface CardGridProps {
  columns?: 2 | 3;
  cards?: Card[];
  bgColor?: string;
  isEmailMode?: boolean;
}

export const CardGrid = React.memo(function CardGrid({
  columns = 2,
  cards = [
    { icon: '🔐', title: 'SSO Integration', description: 'Connect your identity provider in under 5 minutes.' },
    { icon: '🔔', title: 'Smart Alerts', description: 'Get notified only when it matters, not for every event.' },
    { icon: '📈', title: 'Usage Analytics', description: 'Track team adoption and feature usage over time.' },
    { icon: '🛡️', title: 'Audit Logs', description: 'Full activity history for compliance and debugging.' },
  ],
  bgColor = '#09090b',
  isEmailMode = false,
}: CardGridProps) {
  const rows: Card[][] = [];
  for (let i = 0; i < cards.length; i += columns) {
    rows.push(cards.slice(i, i + columns));
  }
  const cellWidth = columns === 2 ? '48%' : '31%';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {rows.map((row, ri) => (
          <table key={ri} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '16px' }}>
            <tbody>
              <tr>
                {row.map((card, ci) => (
                  <td key={ci} width={cellWidth} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '10px', padding: '20px', verticalAlign: 'top', marginRight: ci < row.length - 1 ? '16px' : '0' }}>
                    {card.icon && <div style={{ fontSize: '24px', marginBottom: '10px' }}>{card.icon}</div>}
                    <div style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{card.title}</div>
                    <div style={{ color: '#71717a', fontSize: '13px', lineHeight: 1.6 }}>{card.description}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ))}
      </td>
    </tr>
  );
});
