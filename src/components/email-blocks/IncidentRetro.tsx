import React from 'react';

export interface IncidentRetroProps {
  incidentId?: string;
  date?: string;
  duration?: string;
  impact?: string;
  rootCause?: string;
  fixApplied?: string;
  actionItems?: string[];
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

export const IncidentRetro = React.memo(function IncidentRetro({
  incidentId = 'INC-2024-047',
  date = 'February 15, 2026',
  duration = '43 minutes',
  impact = 'API gateway returning 503 for ~12% of requests in us-east-1',
  rootCause = 'Memory leak in connection pool after deploy of v3.2.1',
  fixApplied = 'Rolled back to v3.2.0, deployed hotfix v3.2.2 with pool limits',
  actionItems = [
    'Add connection pool metrics to alerting dashboard',
    'Require load test in staging before next deploy',
    'Update runbook with rollback procedure',
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: IncidentRetroProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const badgeBg = dark ? '#1c0a0a' : '#fee2e2';

  const Field = ({ label, value }: { label: string; value: string }) => (
    <tr>
      <td style={{ color: textMuted, fontSize: '13px', paddingBottom: '12px', paddingRight: '24px', verticalAlign: 'top', whiteSpace: 'nowrap' as const }}>{label}</td>
      <td style={{ color: textPrimary, fontSize: '13px', paddingBottom: '12px', lineHeight: 1.6 }}>{value}</td>
    </tr>
  );

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', backgroundColor: badgeBg, color: '#ef4444', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
            Incident Retro
          </span>
          <span style={{ color: textMuted, fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>{incidentId}</span>
        </div>
        <table cellPadding={0} cellSpacing={0}>
          <tbody>
            <Field label="Date" value={date || ''} />
            <Field label="Duration" value={duration || ''} />
            <Field label="Impact" value={impact || ''} />
            <Field label="Root Cause" value={rootCause || ''} />
            <Field label="Fix Applied" value={fixApplied || ''} />
          </tbody>
        </table>
        {actionItems && actionItems.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ color: textMuted, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '10px' }}>Action Items</div>
            <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
              {actionItems.map((item, i) => (
                <li key={i} style={{ color: dark ? '#a1a1aa' : '#52525b', fontSize: '13px', lineHeight: 1.7, marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </td>
    </tr>
  );
});
