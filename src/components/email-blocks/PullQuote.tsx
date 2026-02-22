import React from 'react';

export interface PullQuoteProps {
  quoteText?: string;
  authorName?: string;
  authorTitle?: string;
  accentColor?: string;
  bgColor?: string;
  isEmailMode?: boolean;
}

export const PullQuote = React.memo(function PullQuote({
  quoteText = '"This is the most impactful release we\'ve shipped in the last two years."',
  authorName = 'Sarah Chen',
  authorTitle = 'VP of Engineering',
  accentColor = '#f59e0b',
  bgColor = '#ffffff',
  isEmailMode = false,
}: PullQuoteProps) {
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px' }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td width="4" style={{ backgroundColor: accentColor, borderRadius: '2px' }} />
              <td style={{ paddingLeft: '24px' }}>
                <div style={{ color: '#f4f4f5', fontSize: '20px', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '16px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
                  {quoteText}
                </div>
                {authorName && (
                  <div style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    <span style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: 700 }}>{authorName}</span>
                    {authorTitle && <span style={{ color: '#71717a', fontSize: '13px' }}> — {authorTitle}</span>}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
});
