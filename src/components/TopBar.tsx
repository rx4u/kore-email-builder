import { useState } from 'react';
import { Share2, FileStack, History, Check, Clock } from 'lucide-react';
import { ShareDialog } from './ShareDialog';

const outlineButtonStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '6px 12px', borderRadius: '6px',
  border: '1px solid #e4e4e7', background: 'transparent',
  color: '#18181b', fontSize: '13px', fontWeight: 500,
  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  transition: 'background 0.15s',
};
const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = '#f4f4f5'; };
const hoverOut = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'transparent'; };

interface TopBarProps {
  subject: string;
  onSubjectChange: (s: string) => void;
  saving: boolean;
  savedAt: Date | null;
  emailId: string;
  onShowDrafts: () => void;
  onShowVersionHistory?: () => void;
}

export function TopBar({
  subject,
  onSubjectChange,
  saving,
  savedAt,
  emailId,
  onShowDrafts,
  onShowVersionHistory,
}: TopBarProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '16px' }}>
        {/* Left: Logo + Subject */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#f59e0b', fontFamily: 'DM Serif Display, serif', letterSpacing: '-0.5px' }}>Kore</span>
            <span style={{ fontWeight: 600, fontSize: '18px', color: '#71717a', fontFamily: 'DM Serif Display, serif', letterSpacing: '-0.5px' }}>Mail</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: '#e4e4e7', flexShrink: 0 }} />
          <input
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Email subject..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: '#18181b',
              width: '260px',
              minWidth: 0,
              fontFamily: 'DM Sans, sans-serif',
              padding: '3px 6px',
              borderRadius: '4px',
              transition: 'background 0.15s',
            }}
            onFocus={(e) => { e.target.style.background = '#f4f4f5'; }}
            onBlur={(e) => { e.target.style.background = 'transparent'; }}
          />
        </div>

        {/* Center: Auto-save status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#71717a', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>
          {saving ? (
            <>
              <Clock size={12} style={{ color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
              <span>Saving...</span>
            </>
          ) : savedAt ? (
            <>
              <Check size={12} style={{ color: '#22c55e' }} />
              <span>Saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </>
          ) : (
            <span style={{ color: '#a1a1aa' }}>Not saved</span>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => setShareOpen(true)}
            style={outlineButtonStyle}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            title="Share email"
          >
            <Share2 size={14} />
            Share
          </button>
          <button
            onClick={onShowDrafts}
            style={outlineButtonStyle}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            title="Open drafts"
          >
            <FileStack size={14} />
            Drafts
          </button>
          {onShowVersionHistory && (
            <button
              onClick={onShowVersionHistory}
              style={outlineButtonStyle}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              title="Version history"
            >
              <History size={14} />
              History
            </button>
          )}
        </div>
      </div>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        emailId={emailId}
      />
    </>
  );
}
