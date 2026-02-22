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

const SEVERITY_CONFIG: Record<IssueSeverity, { label: string; color: string; bg: string }> = {
  p1: { label: 'P1', color: '#ef4444', bg: '#1c0a0a' },
  p2: { label: 'P2', color: '#f59e0b', bg: '#1a1200' },
  p3: { label: 'P3', color: '#3b82f6', bg: '#0a0a1c' },
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
  bgColor = '#09090b',
  isEmailMode = false,
}: KnownIssuesProps) {
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <div style={{ color: '#71717a', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '20px' }}>{headline}</div>
        {issues.map((issue, i) => {
          const sev = SEVERITY_CONFIG[issue.severity];
          const sta = STATUS_CONFIG[issue.status];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < issues.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: sev.bg, color: sev.color, fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' as const }}>
                {sev.label}
              </span>
              <div style={{ flex: 1, color: '#f4f4f5', fontSize: '14px' }}>
                {issue.link ? <a href={issue.link} style={{ color: '#f4f4f5', textDecoration: 'underline' }}>{issue.title}</a> : issue.title}
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
