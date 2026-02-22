import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Copy, X, Check, Link } from 'lucide-react';
import { getPreviewUrl } from '../lib/preview';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  emailId: string;
}

export function ShareDialog({ open, onClose, emailId }: ShareDialogProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !emailId) return;
    setUrl('');
    setError('');
    setLoading(true);
    getPreviewUrl(emailId)
      .then(setUrl)
      .catch(e => setError(e.message ?? 'Failed to generate preview link'))
      .finally(() => setLoading(false));
  }, [open, emailId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setError('Could not copy to clipboard. Please copy the URL manually.');
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 50,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            width: '480px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 51,
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--foreground)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link size={18} color="currentColor" />
              <Dialog.Title style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                Share Preview
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--muted-foreground)', padding: '4px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {loading && (
            <div style={{ color: 'var(--muted-foreground)', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>
              Generating link...
            </div>
          )}

          {error && (
            <div style={{
              background: '#1f1015', border: '1px solid #7f1d1d', borderRadius: '8px',
              padding: '12px', fontSize: '13px', color: '#fca5a5', marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {url && !loading && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '6px' }}>
                  Preview URL
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    readOnly
                    value={url}
                    style={{
                      flex: 1, padding: '9px 12px',
                      background: 'var(--background)', border: '1px solid var(--border)',
                      borderRadius: '8px', color: 'var(--muted-foreground)',
                      fontSize: '13px', fontFamily: 'DM Mono, monospace',
                      outline: 'none', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                    onFocus={e => e.target.select()}
                  />
                  <button
                    onClick={handleCopy}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '9px 14px',
                      background: copied ? '#16a34a' : 'var(--foreground)',
                      border: 'none', borderRadius: '8px',
                      color: 'var(--background)', fontWeight: 600, fontSize: '13px',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      transition: 'background 0.15s',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#52525b' }}>
                Expires in 7 days. Anyone with this link can view the email preview.
              </p>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
