import React from 'react';

export interface TeamMember {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface TeamAttributionProps {
  headline?: string;
  members?: TeamMember[];
  bgColor?: string;
  isEmailMode?: boolean;
}

export const TeamAttribution = React.memo(function TeamAttribution({
  headline = 'Built by',
  members = [
    { name: 'Priya Mehta', role: 'Engineering Lead' },
    { name: 'James Liu', role: 'Product Design' },
    { name: 'Anika Osei', role: 'Backend Engineering' },
  ],
  bgColor = '#09090b',
  isEmailMode = false,
}: TeamAttributionProps) {
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '24px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {headline && <div style={{ color: '#71717a', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '16px' }}>{headline}</div>}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {members.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {m.avatarUrl ? (
                <img src={m.avatarUrl} alt={m.name} width={36} height={36} style={{ borderRadius: '50%', display: 'block' }} />
              ) : (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f4f4f5', fontSize: '14px', fontWeight: 700 }}>
                  {m.name.charAt(0)}
                </div>
              )}
              <div>
                <div style={{ color: '#f4f4f5', fontSize: '13px', fontWeight: 600 }}>{m.name}</div>
                <div style={{ color: '#71717a', fontSize: '12px' }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
});
