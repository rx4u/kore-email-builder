// Email-safe version of Kore.ai logo
// Uses URL image for reliability and consistency across all email clients

import React from 'react';

// Using PNG for email compatibility (SVGs don't work in all email clients)
import logoImg from '../assets/kore-logo-dark.png';
const KORE_LOGO_URL = logoImg;

export const KoreLogoEmail = React.memo(({ useDataUri = false }: { useDataUri?: boolean } = {}) => {
  // Always use the URL image for both preview and email
  // This ensures consistency and avoids encoding issues
  return (
    <img 
      src={KORE_LOGO_URL} 
      alt="Kore.ai" 
      width="120" 
      height="auto"
      style={{ 
        display: 'block', 
        border: '0', 
        borderStyle: 'none',
        outline: 'none',
        textDecoration: 'none',
        verticalAlign: 'middle',
        maxWidth: '100%',
        height: 'auto'
      }} 
      border={0}
    />
  );
});
KoreLogoEmail.displayName = 'KoreLogoEmail';

// Also export as default for compatibility
export default KoreLogoEmail;
