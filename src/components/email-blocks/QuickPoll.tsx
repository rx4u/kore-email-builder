import React from 'react';

export interface PollOption {
  id: string;
  label: string;
}

export interface QuickPollProps {
  questionText?: string;
  options?: PollOption[];
  exportToken?: string;
  blockId?: string;
  apiUrl?: string;
  isEmailMode?: boolean;
  bgColor?: string;
  textColor?: string;
  theme?: string;
}

function isDarkBg(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export const QuickPoll = React.memo(function QuickPoll({
  questionText = 'Which area should we prioritize next?',
  options = [
    { id: 'perf', label: 'Performance' },
    { id: 'dx', label: 'Developer Experience' },
    { id: 'docs', label: 'Documentation' },
    { id: 'mobile', label: 'Mobile App' },
  ],
  exportToken,
  blockId = 'poll',
  apiUrl = 'https://kore-email-builder.vercel.app',
  isEmailMode = false,
  bgColor = '#ffffff',
  textColor = '#09090b',
}: QuickPollProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const pillBorder = dark ? '#f4f4f5' : '#18181b';
  const pillText = dark ? '#f4f4f5' : '#18181b';

  return (
    <tr>
      <td align="center" style={{ padding: '32px 40px', backgroundColor: bgColor, fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: textPrimary, fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{questionText}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {options.map(opt => (
            isEmailMode && exportToken ? (
              <a key={opt.id} href={`${apiUrl}/r/${exportToken}/${blockId}/${opt.id}`}
                style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '100px', border: `1px solid ${pillBorder}`, color: pillText, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                {opt.label}
              </a>
            ) : (
              <span key={opt.id}
                style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '100px', border: `1px solid ${pillBorder}`, color: pillText, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                {opt.label}
              </span>
            )
          ))}
        </div>
      </td>
    </tr>
  );
});
