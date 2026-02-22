import React from 'react';

export interface FeedbackOption {
  emoji: string;
  label: string;
  value: string;
}

export interface FeedbackPromptProps {
  questionText?: string;
  options?: FeedbackOption[];
  exportToken?: string;
  blockId?: string;
  apiUrl?: string;
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

export const FeedbackPrompt = React.memo(function FeedbackPrompt({
  questionText = 'How do you feel about this release?',
  options = [
    { emoji: '😞', label: 'Disappointed', value: 'disappointed' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '🤩', label: 'Love it!', value: 'love' },
  ],
  exportToken,
  blockId = 'feedback',
  apiUrl = 'https://kore-email-builder.vercel.app',
  bgColor = '#ffffff',
  textColor = '#09090b',
  isEmailMode = false,
}: FeedbackPromptProps) {
  const dark = isDarkBg(bgColor);
  const textMuted = dark ? '#71717a' : '#52525b';

  return (
    <tr>
      <td align="center" style={{ padding: '32px 40px', backgroundColor: bgColor, fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: textColor, fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{questionText}</div>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          {options.map(opt => (
            isEmailMode && exportToken ? (
              <a key={opt.value} href={`${apiUrl}/r/${exportToken}/${blockId}/${opt.value}`}
                style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-block' }}>
                <div style={{ fontSize: '36px', marginBottom: '6px' }}>{opt.emoji}</div>
                <div style={{ color: textMuted, fontSize: '12px' }}>{opt.label}</div>
              </a>
            ) : (
              <div key={opt.value} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '36px', marginBottom: '6px' }}>{opt.emoji}</div>
                <div style={{ color: textMuted, fontSize: '12px' }}>{opt.label}</div>
              </div>
            )
          ))}
        </div>
      </td>
    </tr>
  );
});
