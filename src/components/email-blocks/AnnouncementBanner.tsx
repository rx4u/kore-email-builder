import React from 'react';

export interface AnnouncementBannerProps {
  icon?: string;
  headline?: string;
  bgColor?: string;
  textColor?: string;
  isEmailMode?: boolean;
}

export const AnnouncementBanner = React.memo(function AnnouncementBanner({
  icon = '📣',
  headline = 'Scheduled maintenance: Sunday, March 2 from 2-4 AM UTC',
  bgColor = '#ffffff',
  textColor = '#09090b',
  isEmailMode = false,
}: AnnouncementBannerProps) {
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '16px 32px', textAlign: 'center', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <span style={{ fontSize: '18px', marginRight: '10px' }}>{icon}</span>
        <span style={{ color: textColor, fontSize: '14px', fontWeight: 600 }}>{headline}</span>
      </td>
    </tr>
  );
});
