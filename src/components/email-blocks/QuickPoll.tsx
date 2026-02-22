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
  apiUrl = 'https://app.kore-email.com',
  isEmailMode = false,
}: QuickPollProps) {
  return (
    <tr>
      <td align="center" style={{ padding: '32px 40px', backgroundColor: '#09090b', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: '#f4f4f5', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{questionText}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {options.map(opt => (
            isEmailMode && exportToken ? (
              <a key={opt.id} href={`${apiUrl}/r/${exportToken}/${blockId}/${opt.id}`}
                style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '100px', border: '1px solid #f59e0b', color: '#f59e0b', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                {opt.label}
              </a>
            ) : (
              <span key={opt.id}
                style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '100px', border: '1px solid #f59e0b', color: '#f59e0b', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                {opt.label}
              </span>
            )
          ))}
        </div>
      </td>
    </tr>
  );
});
