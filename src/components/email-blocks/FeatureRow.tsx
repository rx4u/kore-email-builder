import React from 'react';

export interface FeatureRowProps {
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
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

export const FeatureRow = React.memo(function FeatureRow({
  imageUrl = 'https://placehold.co/280x180/18181b/f4f4f5?text=Feature',
  imageAlt = 'Feature image',
  imagePosition = 'left',
  title = 'Ship with confidence',
  description = 'Automated testing, staging environments, and one-click rollback give your team the safety net to move fast.',
  ctaText = 'Learn more',
  ctaUrl = '#',
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: FeatureRowProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const ctaColor = dark ? '#f4f4f5' : '#18181b';

  const imageCell = (
    <td width="48%" style={{ verticalAlign: 'middle', padding: imagePosition === 'left' ? '0 20px 0 0' : '0 0 0 20px' }}>
      <img src={imageUrl} alt={imageAlt} width="100%" style={{ display: 'block', borderRadius: '8px', maxWidth: '280px' }} />
    </td>
  );
  const textCell = (
    <td width="48%" style={{ verticalAlign: 'middle' }}>
      <div style={{ color: textPrimary, fontSize: '20px', fontWeight: 700, marginBottom: '12px', fontFamily: 'DM Sans, Arial, sans-serif' }}>{title}</div>
      <div style={{ color: textMuted, fontSize: '14px', lineHeight: 1.7, marginBottom: '20px', fontFamily: 'DM Sans, Arial, sans-serif' }}>{description}</div>
      {ctaText && (
        <a href={ctaUrl} style={{ color: ctaColor, fontSize: '14px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, Arial, sans-serif' }}>
          {ctaText} →
        </a>
      )}
    </td>
  );
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px' }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              {imagePosition === 'left' ? <>{imageCell}{textCell}</> : <>{textCell}{imageCell}</>}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
});
