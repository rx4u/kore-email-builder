import React from 'react';

export type RoadmapStatus = 'now' | 'next' | 'later';

export interface RoadmapItem {
  label: string;
  status: RoadmapStatus;
  description?: string;
}

export interface RoadmapPreviewProps {
  items?: RoadmapItem[];
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

const STATUS_DARK: Record<RoadmapStatus, { label: string; color: string; bg: string }> = {
  now:   { label: 'Now',   color: '#22c55e', bg: '#052e16' },
  next:  { label: 'Next',  color: '#3b82f6', bg: '#0a0a1c' },
  later: { label: 'Later', color: '#71717a', bg: '#1a1a1a' },
};

const STATUS_LIGHT: Record<RoadmapStatus, { label: string; color: string; bg: string }> = {
  now:   { label: 'Now',   color: '#16a34a', bg: '#dcfce7' },
  next:  { label: 'Next',  color: '#2563eb', bg: '#dbeafe' },
  later: { label: 'Later', color: '#52525b', bg: '#f4f4f5' },
};

export const RoadmapPreview = React.memo(function RoadmapPreview({
  items = [
    { label: 'AI-powered email subject suggestions', status: 'now', description: 'Launching in v2.1' },
    { label: 'Multi-language support', status: 'next', description: 'In design review' },
    { label: 'Salesforce integration', status: 'later' },
    { label: 'Mobile app (iOS + Android)', status: 'later' },
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: RoadmapPreviewProps) {
  const dark = isDarkBg(bgColor);
  const STATUS_CONFIG = dark ? STATUS_DARK : STATUS_LIGHT;
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: textMuted, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '20px' }}>Roadmap</div>
        {items.map((item, i) => {
          const config = STATUS_CONFIG[item.status];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
              <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', backgroundColor: config.bg, color: config.color, fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' as const, marginTop: '2px' }}>
                {config.label}
              </span>
              <div>
                <div style={{ color: textPrimary, fontSize: '14px', fontWeight: 600 }}>{item.label}</div>
                {item.description && <div style={{ color: textMuted, fontSize: '12px', marginTop: '2px' }}>{item.description}</div>}
              </div>
            </div>
          );
        })}
      </td>
    </tr>
  );
});
