import React from 'react';

export interface RsvpBlockProps {
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
  yesLabel?: string;
  noLabel?: string;
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

export const RsvpBlock = React.memo(function RsvpBlock({
  eventTitle = 'Q1 Engineering All-Hands',
  eventDate = 'Thursday, March 6 · 2:00–3:30 PM UTC',
  eventLocation = 'Zoom (link in invite)',
  yesLabel = "Yes, I'll attend",
  noLabel = "Can't make it",
  exportToken,
  blockId = 'rsvp',
  apiUrl = 'https://kore-email-builder.vercel.app',
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: RsvpBlockProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const noBtnBg = dark ? '#27272a' : '#e4e4e7';
  const noBtnText = dark ? '#f4f4f5' : '#09090b';

  const yesUrl = `${apiUrl}/r/${exportToken || 'preview'}/${blockId}/yes`;
  const noUrl = `${apiUrl}/r/${exportToken || 'preview'}/${blockId}/no`;
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', textAlign: 'center', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: textPrimary, fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{eventTitle}</div>
        <div style={{ color: textMuted, fontSize: '14px', marginBottom: '4px' }}>{eventDate}</div>
        {eventLocation && <div style={{ color: textMuted, fontSize: '13px', marginBottom: '28px' }}>{eventLocation}</div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={yesUrl} style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#22c55e', color: '#09090b', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
            {yesLabel}
          </a>
          <a href={noUrl} style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: noBtnBg, color: noBtnText, textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
            {noLabel}
          </a>
        </div>
      </td>
    </tr>
  );
});
