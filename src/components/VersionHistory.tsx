import { useEffect, useState } from 'react';
import { listVersions, restoreVersion, saveVersion } from '../lib/versions';

interface Version {
  id: string;
  label: string | null;
  created_at: string;
  saved_by: string | null;
}

interface VersionHistoryProps {
  emailId: string | null;
  currentBlocks: unknown;
  onRestore: (blocks: unknown) => void;
}

export function VersionHistory({ emailId, currentBlocks, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const loadVersions = async () => {
    if (!emailId) return;
    const v = await listVersions(emailId);
    setVersions(v as Version[]);
  };

  useEffect(() => {
    loadVersions();
  }, [emailId]);

  const handleSaveNamed = async () => {
    if (!emailId || !label.trim()) return;
    setSaving(true);
    try {
      await saveVersion(emailId, currentBlocks, label.trim());
      setLabel('');
      await loadVersions();
    } catch (e) {
      console.error('Failed to save version:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    setRestoring(versionId);
    try {
      const blocks = await restoreVersion(versionId);
      onRestore(blocks);
    } catch (e) {
      console.error('Failed to restore version:', e);
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '16px', color: '#f4f4f5', fontFamily: 'DM Sans, sans-serif' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a' }}>
        Version History
      </h3>

      {emailId ? (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveNamed()}
              placeholder="Label this version..."
              style={{
                flex: 1, padding: '6px 10px', borderRadius: '6px',
                border: '1px solid #27272a', background: '#18181b',
                color: '#f4f4f5', fontSize: '12px', outline: 'none',
              }}
            />
            <button
              onClick={handleSaveNamed}
              disabled={saving || !label.trim()}
              style={{
                padding: '6px 12px', borderRadius: '6px',
                background: label.trim() ? '#f59e0b' : '#27272a',
                color: label.trim() ? '#09090b' : '#71717a',
                border: 'none', cursor: label.trim() ? 'pointer' : 'not-allowed',
                fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {versions.length === 0 ? (
            <p style={{ color: '#52525b', fontSize: '12px', margin: 0 }}>No versions saved yet.</p>
          ) : (
            versions.map(v => (
              <div
                key={v.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid #1a1a1a',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: v.label ? 600 : 400, color: v.label ? '#f4f4f5' : '#a1a1aa' }}>
                    {v.label || 'Auto-save'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#52525b', marginTop: '2px' }}>
                    {formatDate(v.created_at)}
                  </div>
                </div>
                <button
                  onClick={() => handleRestore(v.id)}
                  disabled={restoring === v.id}
                  style={{
                    fontSize: '11px', color: '#f59e0b', background: 'none',
                    border: 'none', cursor: 'pointer', padding: '4px 8px',
                    borderRadius: '4px', fontWeight: 600,
                  }}
                >
                  {restoring === v.id ? '...' : 'Restore'}
                </button>
              </div>
            ))
          )}
        </>
      ) : (
        <p style={{ color: '#52525b', fontSize: '12px', margin: 0 }}>Save your email first to track versions.</p>
      )}
    </div>
  );
}
