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
  isEmailMode?: boolean;
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
  apiUrl = 'https://app.kore-email.com',
  isEmailMode = false,
}: FeedbackPromptProps) {
  return (
    <tr>
      <td align="center" style={{ padding: '32px 40px', backgroundColor: '#09090b', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: '#f4f4f5', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{questionText}</div>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          {options.map(opt => (
            isEmailMode && exportToken ? (
              <a key={opt.value} href={`${apiUrl}/r/${exportToken}/${blockId}/${opt.value}`}
                style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-block' }}>
                <div style={{ fontSize: '36px', marginBottom: '6px' }}>{opt.emoji}</div>
                <div style={{ color: '#71717a', fontSize: '12px' }}>{opt.label}</div>
              </a>
            ) : (
              <div key={opt.value} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '36px', marginBottom: '6px' }}>{opt.emoji}</div>
                <div style={{ color: '#71717a', fontSize: '12px' }}>{opt.label}</div>
              </div>
            )
          ))}
        </div>
      </td>
    </tr>
  );
});
