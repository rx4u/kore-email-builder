import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, BarChart3, Users, ThumbsUp, MessageSquare } from 'lucide-react';
import { getResponses, groupByBlock, type Response } from '../lib/responses';

interface ResponseDashboardProps {
  emailId: string;
  open: boolean;
  onClose: () => void;
}

function NpsSection({ responses }: { responses: Response[] }) {
  const scores = responses.map((r) => Number(r.value)).filter((n) => !isNaN(n));
  if (scores.length === 0) return <p style={{ color: '#71717a', fontSize: '13px' }}>No NPS responses yet.</p>;
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const buckets = Array.from({ length: 11 }, (_, i) => scores.filter((s) => s === i).length);
  const maxCount = Math.max(...buckets, 1);
  return (
    <div>
      <div style={{ marginBottom: '12px', fontSize: '24px', fontWeight: 700, color: '#f0f0f0' }}>
        {avg} <span style={{ fontSize: '14px', color: '#71717a', fontWeight: 400 }}>avg / {scores.length} responses</span>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '60px' }}>
        {buckets.map((count, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '100%',
              height: `${(count / maxCount) * 48}px`,
              background: i <= 6 ? '#ef4444' : i <= 8 ? '#a1a1aa' : '#22c55e',
              borderRadius: '2px 2px 0 0',
              minHeight: count > 0 ? '4px' : '0',
            }} />
            <span style={{ fontSize: '10px', color: '#52525b' }}>{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PollSection({ responses }: { responses: Response[] }) {
  const counts: Record<string, number> = {};
  for (const r of responses) {
    const opt = r.value || 'Unknown';
    counts[opt] = (counts[opt] ?? 0) + 1;
  }
  const total = responses.length;
  if (total === 0) return <p style={{ color: '#71717a', fontSize: '13px' }}>No poll responses yet.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Object.entries(counts).map(([opt, count]) => (
        <div key={opt}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: '#a1a1aa' }}>
            <span>{opt}</span>
            <span>{count} ({Math.round((count / total) * 100)}%)</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#27272a', borderRadius: '4px' }}>
            <div style={{ width: `${(count / total) * 100}%`, height: '100%', background: '#18181b', borderRadius: '4px', transition: 'width 0.3s' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RsvpSection({ responses }: { responses: Response[] }) {
  const yes = responses.filter((r) => r.value.toLowerCase() === 'yes').length;
  const no = responses.filter((r) => r.value.toLowerCase() === 'no').length;
  if (responses.length === 0) return <p style={{ color: '#71717a', fontSize: '13px' }}>No RSVP responses yet.</p>;
  return (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', fontWeight: 700, color: '#22c55e', lineHeight: 1 }}>{yes}</div>
        <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Attending</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', fontWeight: 700, color: '#ef4444', lineHeight: 1 }}>{no}</div>
        <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Not attending</div>
      </div>
    </div>
  );
}

function FeedbackSection({ responses }: { responses: Response[] }) {
  const counts: Record<string, number> = {};
  for (const r of responses) {
    const emoji = r.value || '?';
    counts[emoji] = (counts[emoji] ?? 0) + 1;
  }
  if (responses.length === 0) return <p style={{ color: '#71717a', fontSize: '13px' }}>No feedback responses yet.</p>;
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {Object.entries(counts).map(([emoji, count]) => (
        <div key={emoji} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '32px' }}>{emoji}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa' }}>{count}</span>
        </div>
      ))}
    </div>
  );
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  nps: <BarChart3 size={14} />,
  poll: <Users size={14} />,
  rsvp: <ThumbsUp size={14} />,
  feedback: <MessageSquare size={14} />,
};

const TYPE_LABELS: Record<string, string> = {
  nps: 'NPS',
  poll: 'Poll',
  rsvp: 'RSVP',
  feedback: 'Feedback',
};

export function ResponseDashboard({ emailId, open, onClose }: ResponseDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [grouped, setGrouped] = useState<Record<string, Response[]>>({});

  useEffect(() => {
    if (!open || !emailId) return;
    setLoading(true);
    setError('');
    getResponses(emailId)
      .then((data) => setGrouped(groupByBlock(data ?? [])))
      .catch((e) => setError(e.message ?? 'Failed to load responses'))
      .finally(() => setLoading(false));
  }, [open, emailId]);

  const blockIds = Object.keys(grouped);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }} />
        <Dialog.Content style={{
          position: 'fixed', inset: 0, zIndex: 51,
          display: 'flex', flexDirection: 'column',
          background: '#09090b', color: '#f0f0f0',
          fontFamily: 'DM Sans, sans-serif',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid #18181b' }}>
            <Dialog.Title style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              Response Dashboard
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            {loading && (
              <div style={{ color: '#71717a', fontSize: '14px' }}>Loading responses...</div>
            )}
            {error && (
              <div style={{ color: '#ef4444', fontSize: '14px' }}>{error}</div>
            )}
            {!loading && !error && blockIds.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#52525b' }}>
                <BarChart3 size={40} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: '#71717a' }}>No responses yet</div>
                <div style={{ fontSize: '13px' }}>Responses will appear here once recipients interact with your email.</div>
              </div>
            )}
            {!loading && !error && blockIds.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '720px', margin: '0 auto' }}>
                {blockIds.map((blockId) => {
                  const blockResponses = grouped[blockId];
                  const responseType = blockResponses[0]?.response_type ?? 'unknown';
                  return (
                    <div key={blockId} style={{ background: '#18181b', borderRadius: '12px', padding: '24px', border: '1px solid #27272a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: '#71717a' }}>{TYPE_ICONS[responseType]}</span>
                        <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Mono, monospace' }}>
                          {TYPE_LABELS[responseType] ?? responseType}
                        </span>
                        <span style={{ fontSize: '12px', color: '#3f3f46', marginLeft: 'auto', fontFamily: 'DM Mono, monospace' }}>
                          block: {blockId.slice(0, 8)}
                        </span>
                      </div>
                      {responseType === 'nps' && <NpsSection responses={blockResponses} />}
                      {responseType === 'poll' && <PollSection responses={blockResponses} />}
                      {responseType === 'rsvp' && <RsvpSection responses={blockResponses} />}
                      {responseType === 'feedback' && <FeedbackSection responses={blockResponses} />}
                      {!['nps', 'poll', 'rsvp', 'feedback'].includes(responseType) && (
                        <p style={{ color: '#71717a', fontSize: '13px' }}>{blockResponses.length} responses</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
