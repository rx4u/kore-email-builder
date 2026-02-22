// Kore.ai logo with automatic dark/light mode switching
// Uses the official Kore.ai logo assets imported from Figma

import React, { useState, useEffect } from 'react';
import KoreAiLogoDark from '../imports/KoreAiLogoDark';
import KoreAiLogoLight from '../imports/KoreAiLogoLight';

export const KoreLogo = React.memo(() => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-full">
      {isDark ? <KoreAiLogoLight /> : <KoreAiLogoDark />}
    </div>
  );
});
KoreLogo.displayName = 'KoreLogo';

// Also export as default for compatibility
export default KoreLogo;
