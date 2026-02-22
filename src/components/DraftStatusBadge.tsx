import { useState } from 'react';
import { updateDraftStatus } from '../lib/drafts';

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  draft:     { label: 'Draft',     bg: '#27272a', color: '#a1a1aa' },
  in_review: { label: 'In Review', bg: '#27272a', color: '#e4e4e7' },
  approved:  { label: 'Approved',  bg: '#052e16', color: '#22c55e' },
  sent:      { label: 'Sent',      bg: '#1c0a3a', color: '#a78bfa' },
};

interface DraftStatusBadgeProps {
  status: string;
  emailId: string;
  userRole?: string;
  onStatusChange?: (newStatus: string) => void;
}

export function DraftStatusBadge({ status, emailId, userRole, onStatusChange }: DraftStatusBadgeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = STATUS_CONFIG[status] ?? { label: status, bg: '#27272a', color: '#a1a1aa' };

  async function transition(newStatus: 'draft' | 'in_review' | 'approved' | 'sent') {
    if (!emailId) return;
    setLoading(true);
    setError(null);
    try {
      await updateDraftStatus(emailId, newStatus);
      onStatusChange?.(newStatus);
    } catch (e: any) {
      setError(e.message ?? 'Failed to update status');
    } finally {
      setLoading(false);
    }
  }

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 6,
    border: '1px solid #3f3f46',
    background: '#18181b',
    color: '#e4e4e7',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    fontFamily: 'DM Sans, sans-serif',
  };

  const actions: React.ReactNode[] = [];

  if (userRole && emailId) {
    if (status === 'draft' && (userRole === 'author' || userRole === 'admin')) {
      actions.push(
        <button key="submit" style={btnStyle} disabled={loading} onClick={() => transition('in_review')}>
          {loading && <Spinner />}
          Submit for Review
        </button>
      );
    }

    if (status === 'in_review' && (userRole === 'reviewer' || userRole === 'admin')) {
      actions.push(
        <button key="approve" style={{ ...btnStyle, borderColor: '#166534', color: '#22c55e' }} disabled={loading} onClick={() => transition('approved')}>
          {loading && <Spinner />}
          Approve
        </button>,
        <button key="reject" style={{ ...btnStyle, borderColor: '#7f1d1d', color: '#f87171' }} disabled={loading} onClick={() => transition('draft')}>
          {loading && <Spinner />}
          Reject
        </button>
      );
    }

    if (status === 'approved' && (userRole === 'author' || userRole === 'admin')) {
      actions.push(
        <button key="sent" style={{ ...btnStyle, borderColor: '#4c1d95', color: '#a78bfa' }} disabled={loading} onClick={() => transition('sent')}>
          {loading && <Spinner />}
          Mark as Sent
        </button>
      );
    }
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{
        display: 'inline-block',
        background: config.bg,
        color: config.color,
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 9999,
        letterSpacing: '0.04em',
        fontFamily: 'DM Mono, monospace',
        textTransform: 'uppercase',
      }}>
        {config.label}
      </span>
      {actions}
      {error && (
        <span style={{ fontSize: 11, color: '#f87171', fontFamily: 'DM Sans, sans-serif' }}>{error}</span>
      )}
    </span>
  );
}

function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
