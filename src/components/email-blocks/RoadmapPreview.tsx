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
  isEmailMode?: boolean;
}

const STATUS_CONFIG: Record<RoadmapStatus, { label: string; color: string; bg: string }> = {
  now:   { label: 'Now',   color: '#22c55e', bg: '#052e16' },
  next:  { label: 'Next',  color: '#3b82f6', bg: '#0a0a1c' },
  later: { label: 'Later', color: '#71717a', bg: '#1a1a1a' },
};

export const RoadmapPreview = React.memo(function RoadmapPreview({
  items = [
    { label: 'AI-powered email subject suggestions', status: 'now', description: 'Launching in v2.1' },
    { label: 'Multi-language support', status: 'next', description: 'In design review' },
    { label: 'Salesforce integration', status: 'later' },
    { label: 'Mobile app (iOS + Android)', status: 'later' },
  ],
  bgColor = '#09090b',
  isEmailMode = false,
}: RoadmapPreviewProps) {
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: '#71717a', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '20px' }}>Roadmap</div>
        {items.map((item, i) => {
          const config = STATUS_CONFIG[item.status];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
              <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', backgroundColor: config.bg, color: config.color, fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' as const, marginTop: '2px' }}>
                {config.label}
              </span>
              <div>
                <div style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: 600 }}>{item.label}</div>
                {item.description && <div style={{ color: '#71717a', fontSize: '12px', marginTop: '2px' }}>{item.description}</div>}
              </div>
            </div>
          );
        })}
      </td>
    </tr>
  );
});
