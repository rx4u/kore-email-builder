import React from 'react';

export interface PullQuoteProps {
  quoteText?: string;
  authorName?: string;
  authorTitle?: string;
  accentColor?: string;
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

export const PullQuote = React.memo(function PullQuote({
  quoteText = '"This is the most impactful release we\'ve shipped in the last two years."',
  authorName = 'Sarah Chen',
  authorTitle = 'VP of Engineering',
  accentColor = '#18181b',
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: PullQuoteProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px' }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td width="4" style={{ backgroundColor: accentColor, borderRadius: '2px' }} />
              <td style={{ paddingLeft: '24px' }}>
                <div style={{ color: textPrimary, fontSize: '20px', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '16px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
                  {quoteText}
                </div>
                {authorName && (
                  <div style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    <span style={{ color: textPrimary, fontSize: '14px', fontWeight: 700 }}>{authorName}</span>
                    {authorTitle && <span style={{ color: textMuted, fontSize: '13px' }}> — {authorTitle}</span>}
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
