import React from 'react';

export type IssueSeverity = 'p1' | 'p2' | 'p3';
export type IssueStatus = 'investigating' | 'in_progress' | 'fixed';

export interface KnownIssue {
  severity: IssueSeverity;
  title: string;
  status: IssueStatus;
  link?: string;
}

export interface KnownIssuesProps {
  headline?: string;
  issues?: KnownIssue[];
  bgColor?: string;
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

const SEVERITY_DARK: Record<IssueSeverity, { label: string; color: string; bg: string }> = {
  p1: { label: 'P1', color: '#ef4444', bg: '#1c0a0a' },
  p2: { label: 'P2', color: '#f59e0b', bg: '#1a1200' },
  p3: { label: 'P3', color: '#3b82f6', bg: '#0a0a1c' },
};

const SEVERITY_LIGHT: Record<IssueSeverity, { label: string; color: string; bg: string }> = {
  p1: { label: 'P1', color: '#dc2626', bg: '#fee2e2' },
  p2: { label: 'P2', color: '#d97706', bg: '#fef3c7' },
  p3: { label: 'P3', color: '#2563eb', bg: '#dbeafe' },
};

const STATUS_CONFIG: Record<IssueStatus, { label: string; color: string }> = {
  investigating: { label: 'Investigating', color: '#f59e0b' },
  in_progress:   { label: 'In Progress', color: '#3b82f6' },
  fixed:         { label: 'Fixed', color: '#22c55e' },
};

export const KnownIssues = React.memo(function KnownIssues({
  headline = 'Known Issues',
  issues = [
    { severity: 'p1', title: 'Dashboard load fails with SSO enabled', status: 'investigating', link: '#' },
    { severity: 'p2', title: 'Export CSV shows incorrect date format', status: 'in_progress' },
    { severity: 'p3', title: 'Dark mode toggle resets on refresh', status: 'fixed' },
  ],
  bgColor = '#ffffff',
  isEmailMode = false,
}: KnownIssuesProps) {
  const dark = isDarkBg(bgColor);
  const SEVERITY_CONFIG = dark ? SEVERITY_DARK : SEVERITY_LIGHT;
  const textPrimary = dark ? '#f4f4f5' : '#09090b';
  const textMuted = dark ? '#71717a' : '#52525b';
  const dividerColor = dark ? '#27272a' : '#e4e4e7';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: textMuted, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '20px' }}>{headline}</div>
        {issues.map((issue, i) => {
          const sev = SEVERITY_CONFIG[issue.severity];
          const sta = STATUS_CONFIG[issue.status];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < issues.length - 1 ? `1px solid ${dividerColor}` : 'none' }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: sev.bg, color: sev.color, fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' as const }}>
                {sev.label}
              </span>
              <div style={{ flex: 1, color: textPrimary, fontSize: '14px' }}>
                {issue.link ? <a href={issue.link} style={{ color: textPrimary, textDecoration: 'underline' }}>{issue.title}</a> : issue.title}
              </div>
              <span style={{ color: sta.color, fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' as const }}>
                {sta.label}
              </span>
            </div>
          );
        })}
      </td>
    </tr>
  );
});
