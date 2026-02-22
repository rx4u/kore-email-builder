import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateEmailHTML } from '../lib/html-generator';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

type PageState = 'loading' | 'found' | 'expired' | 'notfound' | 'error';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function PreviewPage() {
  const { token } = useParams<{ token: string }>();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [html, setHtml] = useState('');
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/preview/${token}`)
      .then(async res => {
        if (res.status === 410) { setPageState('expired'); return; }
        if (res.status === 404) { setPageState('notfound'); return; }
        if (!res.ok) { setPageState('error'); return; }
        const data = await res.json();
        let emailHtml = data.html ?? '';
        if (!emailHtml && data.email?.blocks_jsonb) {
          const blocks = Array.isArray(data.email.blocks_jsonb) ? data.email.blocks_jsonb : [];
          // Use generateEmailHTML with a minimal default theme
          const defaultTheme = { emailWidth: 600, fontFamily: 'DM Sans, sans-serif', backgroundColor: '#ffffff' };
          emailHtml = generateEmailHTML(
            { contentBlocks: blocks, headerConfig: {}, footerConfig: {}, subject: data.email.subject ?? '' } as any,
            defaultTheme
          );
        }
        setHtml(emailHtml);
        // Look up the preview_token UUID so we can use it as token_id FK when inserting comments
        if (data.token_id) {
          setTokenId(data.token_id);
        } else {
          const { data: ptData } = await supabase
            .from('preview_tokens')
            .select('id')
            .eq('token', token)
            .single();
          setTokenId(ptData?.id ?? null);
        }
        setPageState('found');
      })
      .catch(() => setPageState('error'));
  }, [token]);

  const fetchComments = async (tid: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, author_name, content, created_at')
      .eq('token_id', tid)
      .order('created_at', { ascending: true });
    if (!error) setComments(data ?? []);
  };

  useEffect(() => {
    if (pageState !== 'found' || !tokenId) return;
    fetchComments(tokenId);
  }, [pageState, tokenId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId || !message.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    setSubmitted(false);
    const { error } = await supabase.from('comments').insert({
      token_id: tokenId,
      author_name: authorName.trim() || 'Anonymous',
      content: message.trim(),
    });
    setSubmitting(false);
    if (error) { setSubmitError(error.message); return; }
    setSubmitted(true);
    setAuthorName('');
    setMessage('');
    await fetchComments(tokenId);
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#09090b',
    color: '#f4f4f5',
    fontFamily: 'DM Sans, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 16px',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '640px',
  };

  if (pageState === 'loading') {
    return (
      <div style={containerStyle}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '80px' }}>
          <div style={{
            width: '32px', height: '32px',
            border: '3px solid #27272a',
            borderTopColor: '#a1a1aa',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#71717a', margin: 0, fontSize: '14px' }}>Loading preview...</p>
        </div>
      </div>
    );
  }

  if (pageState === 'expired') {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px' }}>&#x231B;</p>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>This preview has expired</h2>
          <p style={{ color: '#71717a', margin: 0, fontSize: '14px' }}>The preview link is no longer valid. Please request a new one.</p>
        </div>
      </div>
    );
  }

  if (pageState === 'notfound') {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px' }}>&#x1F50D;</p>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>Preview not found</h2>
          <p style={{ color: '#71717a', margin: 0, fontSize: '14px' }}>This preview link does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ color: '#71717a', margin: 0, fontSize: '14px' }}>Unable to load the preview. Try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={cardStyle}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#52525b', background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', padding: '4px 10px' }}>
            Email Preview
          </span>
        </div>

        <div style={{
          border: '1px solid #27272a',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '32px',
        }}>
          <iframe
            srcDoc={html}
            style={{
              width: '600px',
              maxWidth: '100%',
              height: '600px',
              border: 'none',
              display: 'block',
              margin: '0 auto',
              background: '#fff',
            }}
            title="Email Preview"
            sandbox="allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600 }}>Leave a comment</h3>

          {submitted && (
            <div style={{
              background: '#052e16', border: '1px solid #166534', borderRadius: '8px',
              padding: '10px 14px', fontSize: '13px', color: '#86efac', marginBottom: '16px',
            }}>
              Comment submitted!
            </div>
          )}

          {submitError && (
            <div style={{
              background: '#1f1015', border: '1px solid #7f1d1d', borderRadius: '8px',
              padding: '10px 14px', fontSize: '13px', color: '#fca5a5', marginBottom: '16px',
            }}>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Write a comment..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }}
            />
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              style={{
                alignSelf: 'flex-end',
                padding: '9px 20px',
                background: submitting || !message.trim() ? '#3f3f46' : '#18181b',
                color: submitting || !message.trim() ? '#71717a' : '#ffffff',
                border: 'none', borderRadius: '8px',
                fontWeight: 600, fontSize: '13px',
                cursor: submitting || !message.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        {comments.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#a1a1aa' }}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {comments.map(c => (
                <div
                  key={c.id}
                  style={{
                    background: '#18181b', border: '1px solid #27272a',
                    borderRadius: '10px', padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#e4e4e7' }}>
                      {c.author_name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#52525b' }}>
                      {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#d4d4d8', lineHeight: 1.5 }}>
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#f4f4f5',
  fontSize: '13px',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
