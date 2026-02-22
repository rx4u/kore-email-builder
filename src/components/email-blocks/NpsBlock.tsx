import React from 'react';

export interface NpsBlockProps {
  questionText?: string;
  lowLabel?: string;
  highLabel?: string;
  exportToken?: string;
  blockId?: string;
  apiUrl?: string;
  isEmailMode?: boolean;
}

const NPS_COLORS = [
  '#ef4444','#f97316','#f97316','#fb923c','#fb923c',
  '#eab308','#eab308','#84cc16','#84cc16','#22c55e','#22c55e'
];

export const NpsBlock = React.memo(function NpsBlock({
  questionText = 'How satisfied are you with this release?',
  lowLabel = 'Not at all',
  highLabel = 'Extremely satisfied',
  exportToken,
  blockId = 'nps',
  apiUrl = 'https://app.kore-email.com',
  isEmailMode = false,
}: NpsBlockProps) {
  return (
    <tr>
      <td align="center" style={{ padding: '32px 24px', backgroundColor: '#09090b', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: '#f4f4f5', fontSize: '16px', marginBottom: '20px', fontWeight: 500 }}>
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
          <span style={{ color: '#71717a', fontSize: '11px' }}>{lowLabel}</span>
          <span style={{ color: '#71717a', fontSize: '11px' }}>{highLabel}</span>
        </div>
      </td>
    </tr>
  );
});
