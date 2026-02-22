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

export const CardGrid = React.memo(function CardGrid({
  columns = 2,
  cards = [
    { icon: '🔐', title: 'SSO Integration', description: 'Connect your identity provider in under 5 minutes.' },
    { icon: '🔔', title: 'Smart Alerts', description: 'Get notified only when it matters, not for every event.' },
    { icon: '📈', title: 'Usage Analytics', description: 'Track team adoption and feature usage over time.' },
    { icon: '🛡️', title: 'Audit Logs', description: 'Full activity history for compliance and debugging.' },
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: CardGridProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const cardBg = dark ? '#18181b' : '#f9f9f9';
  const cardBorder = dark ? '#27272a' : '#e4e4e7';

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
                  <td key={ci} width={cellWidth} style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '20px', verticalAlign: 'top', marginRight: ci < row.length - 1 ? '16px' : '0' }}>
                    {card.icon && <div style={{ fontSize: '24px', marginBottom: '10px' }}>{card.icon}</div>}
                    <div style={{ color: textPrimary, fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{card.title}</div>
                    <div style={{ color: textMuted, fontSize: '13px', lineHeight: 1.6 }}>{card.description}</div>
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
