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

export const TeamAttribution = React.memo(function TeamAttribution({
  headline = 'Built by',
  members = [
    { name: 'Priya Mehta', role: 'Engineering Lead' },
    { name: 'James Liu', role: 'Product Design' },
    { name: 'Anika Osei', role: 'Backend Engineering' },
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: TeamAttributionProps) {
  const dark = isDarkBg(bgColor);
  const avatarBg = dark ? '#27272a' : '#e4e4e7';
  const avatarText = dark ? '#f4f4f5' : '#09090b';
  const nameColor = textColor || (dark ? '#f4f4f5' : '#09090b');
  const roleColor = dark ? '#71717a' : '#52525b';
  const headlineColor = dark ? '#71717a' : '#52525b';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '24px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {headline && <div style={{ color: headlineColor, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '16px' }}>{headline}</div>}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {members.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {m.avatarUrl ? (
                <img src={m.avatarUrl} alt={m.name} width={36} height={36} style={{ borderRadius: '50%', display: 'block' }} />
              ) : (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: avatarText, fontSize: '14px', fontWeight: 700 }}>
                  {m.name.charAt(0)}
                </div>
              )}
              <div>
                <div style={{ color: nameColor, fontSize: '13px', fontWeight: 600 }}>{m.name}</div>
                <div style={{ color: roleColor, fontSize: '12px' }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
});
