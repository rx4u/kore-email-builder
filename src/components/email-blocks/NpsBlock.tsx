import React from 'react';

export interface NpsBlockProps {
  questionText?: string;
  lowLabel?: string;
  highLabel?: string;
  exportToken?: string;
  blockId?: string;
  apiUrl?: string;
  isEmailMode?: boolean;
  bgColor?: string;
  textColor?: string;
  theme?: string;
}

const NPS_COLORS = [
  '#ef4444','#f97316','#f97316','#fb923c','#fb923c',
  '#eab308','#eab308','#84cc16','#84cc16','#22c55e','#22c55e'
];

function isDarkBg(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export const NpsBlock = React.memo(function NpsBlock({
  questionText = 'How satisfied are you with this release?',
  lowLabel = 'Not at all',
  highLabel = 'Extremely satisfied',
  exportToken,
  blockId = 'nps',
  apiUrl = 'https://kore-email-builder.vercel.app',
  isEmailMode = false,
  bgColor = '#ffffff',
  textColor,
  theme,
}: NpsBlockProps) {
  const dark = isDarkBg(bgColor);
  const resolvedTextColor = textColor ?? (dark ? '#f4f4f5' : '#09090b');
  const labelColor = dark ? '#71717a' : '#52525b';

  return (
    <tr>
      <td align="center" style={{ padding: '32px 24px', backgroundColor: bgColor, fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: resolvedTextColor, fontSize: '16px', marginBottom: '20px', fontWeight: 500 }}>
          {questionText}
        </div>
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '8px' }}>
          {Array.from({ length: 11 }, (_, i) => (
            isEmailMode && exportToken ? (
              <a
                key={i}
                href={`${apiUrl}/r/${exportToken}/${blockId}/${i}`}
                style={{
                  display: 'inline-block', width: '40px', height: '40px', lineHeight: '40px',
                  textAlign: 'center', backgroundColor: NPS_COLORS[i], color: '#fff',
                  fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                  borderRadius: '6px', fontFamily: 'DM Sans, Arial, sans-serif',
                }}
              >
                {i}
              </a>
            ) : (
              <span
                key={i}
                style={{
                  display: 'inline-block', width: '40px', height: '40px', lineHeight: '40px',
                  textAlign: 'center', backgroundColor: NPS_COLORS[i], color: '#fff',
                  fontWeight: 700, fontSize: '14px', borderRadius: '6px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                }}
              >
                {i}
              </span>
            )
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '480px', margin: '0 auto' }}>
          <span style={{ color: labelColor, fontSize: '11px' }}>{lowLabel}</span>
          <span style={{ color: labelColor, fontSize: '11px' }}>{highLabel}</span>
        </div>
      </td>
    </tr>
  );
});
