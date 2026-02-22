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
  isEmailMode?: boolean;
}

export const RsvpBlock = React.memo(function RsvpBlock({
  eventTitle = 'Q1 Engineering All-Hands',
  eventDate = 'Thursday, March 6 · 2:00–3:30 PM UTC',
  eventLocation = 'Zoom (link in invite)',
  yesLabel = "Yes, I'll attend",
  noLabel = "Can't make it",
  exportToken,
  blockId = 'rsvp',
  apiUrl = 'https://app.kore-email.com',
  bgColor = '#09090b',
  isEmailMode = false,
}: RsvpBlockProps) {
  const yesUrl = `${apiUrl}/r/${exportToken || 'preview'}/${blockId}/yes`;
  const noUrl = `${apiUrl}/r/${exportToken || 'preview'}/${blockId}/no`;
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', textAlign: 'center', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: '#f4f4f5', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{eventTitle}</div>
        <div style={{ color: '#71717a', fontSize: '14px', marginBottom: '4px' }}>{eventDate}</div>
        {eventLocation && <div style={{ color: '#71717a', fontSize: '13px', marginBottom: '28px' }}>{eventLocation}</div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={yesUrl} style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#22c55e', color: '#09090b', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
            {yesLabel}
          </a>
          <a href={noUrl} style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#27272a', color: '#f4f4f5', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
            {noLabel}
          </a>
        </div>
      </td>
    </tr>
  );
});
