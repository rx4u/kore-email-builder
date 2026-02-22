interface BottomBarProps {
  sizeKB: number;
  blockCount: number;
  savedAt: Date | null;
  saving: boolean;
}

export function BottomBar({ sizeKB, blockCount, savedAt, saving }: BottomBarProps) {
  const pct = Math.min((sizeKB / 102) * 100, 100);
  const color = sizeKB > 90 ? '#ef4444' : sizeKB > 70 ? '#f59e0b' : '#22c55e';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '8px 24px', background: '#09090b', borderTop: '1px solid #18181b', fontSize: '12px', color: '#71717a', fontFamily: 'DM Mono, monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{sizeKB}KB / 102KB</span>
        <div style={{ width: '80px', height: '4px', background: '#27272a', borderRadius: '2px' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
        {sizeKB > 102 && <span style={{ color: '#ef4444' }}>Gmail will clip</span>}
      </div>
      <span>{blockCount} blocks</span>
      <span>{saving ? 'Saving...' : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Not saved'}</span>
    </div>
  );
}
