import React from 'react';

export type PreviewMode = 'desktop' | 'mobile' | 'dark';

interface PreviewToolbarProps {
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
}

const MODES: { value: PreviewMode; label: string }[] = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'dark', label: 'Dark' },
];

export function PreviewToolbar({ previewMode, onPreviewModeChange }: PreviewToolbarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '4px', padding: '12px 24px',
      borderBottom: '1px solid #e5e7eb', background: '#f9fafb', flexShrink: 0,
    }}>
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onPreviewModeChange(m.value)}
          style={{
            padding: '5px 14px',
            borderRadius: '6px',
            border: '1px solid',
            borderColor: previewMode === m.value ? '#18181b' : '#e5e7eb',
            background: previewMode === m.value ? '#18181b' : 'transparent',
            color: previewMode === m.value ? '#fff' : '#52525b',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'DM Mono, monospace',
            textTransform: 'capitalize',
            transition: 'all 0.15s',
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
