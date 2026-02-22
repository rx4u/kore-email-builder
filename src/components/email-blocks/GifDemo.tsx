import React from 'react';

export interface GifDemoProps {
  gifUrl?: string;
  caption?: string;
  ctaText?: string;
  ctaUrl?: string;
  showOutlookWarning?: boolean;
  bgColor?: string;
  isEmailMode?: boolean;
}

export const GifDemo = React.memo(function GifDemo({
  gifUrl = 'https://placehold.co/520x280/18181b/f4f4f5?text=GIF+Demo',
  caption = 'Watch the new onboarding flow in action',
  ctaText = 'Try it yourself',
  ctaUrl = '#',
  showOutlookWarning = true,
  bgColor = '#ffffff',
  isEmailMode = false,
}: GifDemoProps) {
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', textAlign: 'center', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <img src={gifUrl} alt={caption || 'Demo'} width="100%" style={{ maxWidth: '520px', display: 'block', margin: '0 auto', borderRadius: '8px', border: '1px solid #27272a' }} />
        {caption && <div style={{ color: '#71717a', fontSize: '13px', marginTop: '12px' }}>{caption}</div>}
        {ctaText && (
          <div style={{ marginTop: '20px' }}>
            <a href={ctaUrl} style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#f59e0b', color: '#09090b', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
              {ctaText}
            </a>
          </div>
        )}
        {showOutlookWarning && (
          <div style={{ marginTop: '12px', color: '#52525b', fontSize: '11px' }}>
            * GIF plays in Gmail/Apple Mail. Outlook shows the first frame.
          </div>
        )}
      </td>
    </tr>
  );
});
