import React from 'react';

export interface GifDemoProps {
  gifUrl?: string;
  caption?: string;
  ctaText?: string;
  ctaUrl?: string;
  showOutlookWarning?: boolean;
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

export const GifDemo = React.memo(function GifDemo({
  gifUrl = 'https://placehold.co/520x280/18181b/f4f4f5?text=GIF+Demo',
  caption = 'Watch the new onboarding flow in action',
  ctaText = 'Try it yourself',
  ctaUrl = '#',
  showOutlookWarning = true,
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: GifDemoProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const dividerColor = dark ? '#27272a' : '#e4e4e7';
  const ctaBg = dark ? '#f4f4f5' : '#18181b';
  const ctaText_ = dark ? '#09090b' : '#ffffff';
  const imgBorder = dividerColor;

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', textAlign: 'center', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <img src={gifUrl} alt={caption || 'Demo'} width="100%" style={{ maxWidth: '520px', display: 'block', margin: '0 auto', borderRadius: '8px', border: `1px solid ${imgBorder}` }} />
        {caption && <div style={{ color: textMuted, fontSize: '13px', marginTop: '12px' }}>{caption}</div>}
        {ctaText && (
          <div style={{ marginTop: '20px' }}>
            <a href={ctaUrl} style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: ctaBg, color: ctaText_, textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
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
