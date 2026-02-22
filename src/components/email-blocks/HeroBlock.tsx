import React from 'react';

export interface HeroBlockProps {
  badge?: string;
  showBadge?: boolean;
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
  ctaText?: string;
  ctaUrl?: string;
  showCta?: boolean;
  bgColor?: string;
  textColor?: string;
  displaySize?: number;
  isEmailMode?: boolean;
}

export const HeroBlock = React.memo(function HeroBlock({
  badge = 'New Release',
  showBadge = true,
  title = "What's New in v2.0",
  subtitle = 'The biggest update yet — faster, smarter, and more powerful.',
  showSubtitle = true,
  ctaText = "See what's new",
  ctaUrl = '#',
  showCta = true,
  bgColor = '#09090b',
  textColor = '#f4f4f5',
  displaySize = 56,
  isEmailMode = false,
}: HeroBlockProps) {
  return (
    <tr>
      <td
        align="center"
        bgcolor={bgColor}
        style={{
          backgroundColor: bgColor,
          padding: '64px 40px',
          textAlign: 'center',
        }}
      >
        {showBadge && badge && (
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '100px',
              border: `1px solid ${textColor}40`,
              color: textColor,
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              fontFamily: 'DM Sans, Arial, sans-serif',
            }}>
              {badge}
            </span>
          </div>
        )}

        <div style={{
          fontSize: `${displaySize}px`,
          fontWeight: 800,
          lineHeight: 1.1,
          color: textColor,
          margin: '0 0 16px',
          fontFamily: 'DM Serif Display, Georgia, serif',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </div>

        {showSubtitle && subtitle && (
          <div style={{
            fontSize: '18px',
            color: `${textColor}b3`,
            margin: '0 0 32px',
            fontFamily: 'DM Sans, Arial, sans-serif',
            lineHeight: 1.6,
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {subtitle}
          </div>
        )}

        {showCta && ctaText && (
          <a
            href={ctaUrl}
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#18181b',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '16px',
              fontFamily: 'DM Sans, Arial, sans-serif',
            }}
          >
            {ctaText}
          </a>
        )}
      </td>
    </tr>
  );
});
