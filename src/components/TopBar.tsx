import { useState } from 'react';
import { Share2, FileStack, History, Check, Clock, LogOut, Settings } from 'lucide-react';
import { ShareDialog } from './ShareDialog';
import { KoreLogo } from './KoreLogo';
import { signOut } from '../lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TopBarUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface TopBarProps {
  subject: string;
  onSubjectChange: (s: string) => void;
  saving: boolean;
  savedAt: Date | null;
  emailId: string;
  onShowDrafts: () => void;
  onShowVersionHistory?: () => void;
  user?: TopBarUser | null;
}

function UserAvatar({ user }: { user: TopBarUser }) {
  const initials = (user.name || user.email || '?').charAt(0).toUpperCase();
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name || user.email}
        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }
  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: '#27272a',
      color: '#f4f4f5',
      fontSize: '12px',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '5px',
  padding: '4px 10px', borderRadius: '6px',
  border: '1px solid #e4e4e7', background: 'transparent',
  color: '#18181b', fontSize: '12px', fontWeight: 500,
  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  height: '28px',
  transition: 'background 150ms',
};
const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = '#f4f4f5'; };
const hoverOut = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'transparent'; };

export function TopBar({
  subject,
  onSubjectChange,
  saving,
  savedAt,
  emailId,
  onShowDrafts,
  onShowVersionHistory,
  user,
}: TopBarProps) {
  const [shareOpen, setShareOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore — auth state change will handle redirect
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '12px', padding: '0 16px 0 0' }}>
        {/* Left: Logo + divider + Subject */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          <KoreLogo width={96} variant="auto" />
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
              fontSize: '13px',
              fontWeight: 500,
              color: '#18181b',
              flex: 1,
              minWidth: 0,
              fontFamily: 'DM Sans, sans-serif',
              padding: '3px 6px',
              borderRadius: '4px',
              transition: 'background 150ms',
            }}
            onFocus={(e) => { e.target.style.background = 'rgba(0,0,0,0.04)'; }}
            onBlur={(e) => { e.target.style.background = 'transparent'; }}
          />
        </div>

        {/* Center: Auto-save status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#71717a', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>
          {saving ? (
            <>
              <Clock size={11} style={{ color: '#f59e0b' }} />
              <span>Saving...</span>
            </>
          ) : savedAt ? (
            <>
              <Check size={11} style={{ color: '#22c55e' }} />
              <span>Saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </>
          ) : (
            <span style={{ color: '#a1a1aa' }}>Not saved</span>
          )}
        </div>

        {/* Right: Action buttons + user avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => setShareOpen(true)} style={actionBtnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} title="Share email">
            <Share2 size={13} />
            Share
          </button>
          <button onClick={onShowDrafts} style={actionBtnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} title="Open drafts">
            <FileStack size={13} />
            Drafts
          </button>
          {onShowVersionHistory && (
            <button onClick={onShowVersionHistory} style={actionBtnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} title="Version history">
              <History size={13} />
              History
            </button>
          )}

          {/* Vertical divider before avatar */}
          <div style={{ width: '1px', height: '20px', background: '#e4e4e7', margin: '0 4px', flexShrink: 0 }} />

          {/* User profile dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    borderRadius: '50%',
                    transition: 'box-shadow 150ms',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 2px #f59e0b80'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
                  title={user.name || user.email}
                >
                  <UserAvatar user={user} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', padding: '4px' }}>
                <DropdownMenuLabel style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#f4f4f5', fontFamily: 'DM Sans, sans-serif' }}>{user.name || 'User'}</div>
                  <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ background: '#27272a', margin: '2px 0' }} />
                <DropdownMenuItem
                  disabled
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: '#52525b', cursor: 'not-allowed', fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Settings size={14} />
                  Settings & Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ background: '#27272a', margin: '2px 0' }} />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: '#f87171', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                  className="hover:!bg-red-500/10 hover:!text-red-300 focus:!bg-red-500/10 focus:!text-red-300"
                >
                  <LogOut size={14} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#27272a', flexShrink: 0 }} />
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
