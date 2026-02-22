import React from 'react';

export interface VideoThumbnailProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  durationLabel?: string;
  bgColor?: string;
  isEmailMode?: boolean;
}

export const VideoThumbnail = React.memo(function VideoThumbnail({
  videoUrl = '#',
  thumbnailUrl = 'https://placehold.co/520x293/18181b/f4f4f5?text=Video+Thumbnail',
  caption = 'Product walkthrough — 4 minutes',
  durationLabel = '4:12',
  bgColor = '#ffffff',
  isEmailMode = false,
}: VideoThumbnailProps) {
  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', textAlign: 'center', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <a href={videoUrl} style={{ display: 'inline-block', position: 'relative', textDecoration: 'none' }}>
          <img src={thumbnailUrl} alt={caption || 'Video'} width="100%" style={{ maxWidth: '520px', display: 'block', borderRadius: '8px', border: '1px solid #27272a' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '56px', height: '56px', backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '20px', marginLeft: '4px' }}>▶</span>
          </div>
          {durationLabel && (
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', fontFamily: 'DM Mono, monospace' }}>
              {durationLabel}
            </div>
          )}
        </a>
        {caption && <div style={{ color: '#71717a', fontSize: '13px', marginTop: '12px' }}>{caption}</div>}
      </td>
    </tr>
  );
});
