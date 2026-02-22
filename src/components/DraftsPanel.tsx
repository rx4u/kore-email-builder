import { useEffect, useState, useCallback } from 'react';
import { listDrafts, deleteDraft, loadDraft } from '../lib/drafts';
import { DraftStatusBadge } from './DraftStatusBadge';

interface DraftItem {
  id: string;
  subject: string;
  status: string;
  updated_at: string;
  author_id: string;
}

interface DraftsPanelProps {
  onLoadDraft: (emailId: string, blocks: any[], subject: string) => void;
  currentEmailId?: string;
  onClose?: () => void;
  userRole?: 'author' | 'reviewer' | 'admin';
}

export function DraftsPanel({ onLoadDraft, currentEmailId, onClose, userRole }: DraftsPanelProps) {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDrafts();
      setDrafts(data as DraftItem[]);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load drafts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDrafts(); }, [fetchDrafts]);

  async function handleLoad(id: string) {
    setLoadingId(id);
    try {
      const data = await loadDraft(id);
      const blocks = Array.isArray(data.blocks_jsonb) ? data.blocks_jsonb : [];
      onLoadDraft(data.id, blocks, data.subject ?? 'Untitled Email');
      onClose?.();
    } catch (e: any) {
      setError(e.message ?? 'Failed to load draft');
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm('Delete this draft?')) return;
    setDeletingId(id);
    try {
      await deleteDraft(id);
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch (e: any) {
      setError(e.message ?? 'Failed to delete draft');
    } finally {
      setDeletingId(null);
    }
  }

  function handleStatusChange(id: string, newStatus: string) {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  }

  const panel: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 50,
    display: 'flex',
  };

  const overlay: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(2px)',
  };

  const sidebar: React.CSSProperties = {
    position: 'relative',
    width: 360,
    maxWidth: '100vw',
    height: '100%',
    background: '#09090b',
    borderRight: '1px solid #27272a',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'DM Sans, sans-serif',
    zIndex: 1,
    overflowY: 'auto',
  };

  return (
    <div style={panel}>
      <div style={overlay} onClick={onClose} />
      <div style={sidebar}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#f4f4f5' }}>Drafts</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => { onLoadDraft('', [], 'Untitled Email'); onClose?.(); }}
              style={{
                background: '#f59e0b',
                color: '#09090b',
                border: 'none',
                borderRadius: 7,
                padding: '6px 14px',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              + New Email
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '12px 16px', padding: '8px 12px', background: '#1f0a0a', border: '1px solid #7f1d1d', borderRadius: 7, color: '#f87171', fontSize: 12 }}>
            {error}
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#52525b', fontSize: 14 }}>Loading...</div>
          ) : drafts.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#52525b', fontSize: 14 }}>
              No drafts yet. Click "+ New Email" to start.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
              {drafts.map(draft => {
                const isActive = draft.id === currentEmailId;
                const isLoadingThis = loadingId === draft.id;
                const isDeletingThis = deletingId === draft.id;
                return (
                  <li
                    key={draft.id}
                    onClick={() => !isLoadingThis && handleLoad(draft.id)}
                    style={{
                      padding: '12px 20px',
                      cursor: isLoadingThis ? 'wait' : 'pointer',
                      borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                      background: isActive ? 'rgba(245,158,11,0.06)' : 'transparent',
                      opacity: isDeletingThis ? 0.4 : 1,
                      transition: 'background 0.15s, border-color 0.15s',
                      borderBottom: '1px solid #18181b',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#18181b'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#e4e4e7',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}>
                        {isLoadingThis ? 'Loading...' : (draft.subject || 'Untitled Email')}
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, draft.id)}
                        disabled={isDeletingThis}
                        aria-label="Delete draft"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#52525b',
                          cursor: isDeletingThis ? 'not-allowed' : 'pointer',
                          padding: '2px 4px',
                          borderRadius: 4,
                          flexShrink: 0,
                          fontSize: 14,
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#52525b'; }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <DraftStatusBadge
                      status={draft.status ?? 'draft'}
                      emailId={draft.id}
                      userRole={userRole}
                      onStatusChange={(s) => handleStatusChange(draft.id, s)}
                    />
                    <span style={{ fontSize: 11, color: '#52525b' }}>
                      {formatDate(draft.updated_at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}
