// Kore.ai logo with automatic dark/light mode switching
// SVG viewBox is 0 0 124 30 (aspect ratio 4.133:1)
// Uses explicit pixel dimensions on wrapper so absolutely-positioned SVG has a real bounding box

import React, { useState, useEffect } from 'react';
import KoreAiLogoDark from '../imports/KoreAiLogoDark';
import KoreAiLogoLight from '../imports/KoreAiLogoLight';

interface KoreLogoProps {
  /** Pixel width of the logo. Height is computed from 124:30 aspect ratio. Default: 96 */
  width?: number;
  /** Force a specific variant instead of auto-detecting from document theme */
  variant?: 'dark' | 'light' | 'auto';
  className?: string;
}

export const KoreLogo = React.memo(({ width = 96, variant = 'auto', className }: KoreLogoProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (variant !== 'auto') return;
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [variant]);

  const showLight = variant === 'light' || (variant === 'auto' && isDark);
  const height = Math.round(width / 4.133);

  return (
    <div
      className={className}
      style={{ width, height, position: 'relative', lineHeight: 0, flexShrink: 0, display: 'inline-block' }}
    >
      {showLight ? <KoreAiLogoLight /> : <KoreAiLogoDark />}
    </div>
  );
});
KoreLogo.displayName = 'KoreLogo';

export default KoreLogo;
