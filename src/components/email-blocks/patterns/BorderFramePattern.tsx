// Email-compatible border frame pattern
// Creates decorative corner frames using nested tables

import React from 'react';

interface BorderFramePatternProps {
  borderColor?: string;
  borderWidth?: number;
  cornerSize?: number;
  children: React.ReactNode;
  padding?: number;
}

export const BorderFramePattern = React.memo(({ 
  borderColor = '#e6f0ff', // Very light blue based on Kore.ai brand
  borderWidth = 2,
  cornerSize = 24,
  children,
  padding = 16
}: BorderFramePatternProps) => {
  return (
    <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>
      <tbody>
        {/* Top border with corners */}
        <tr>
          <td style={{ 
            width: `${cornerSize}px`,
            height: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
          <td style={{ 
            height: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
          <td style={{ 
            width: `${cornerSize}px`,
            height: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
        </tr>
        
        {/* Content area with side borders */}
        <tr>
          <td style={{ 
            width: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
          <td style={{ padding: `${padding}px` }}>
            {children}
          </td>
          <td style={{ 
            width: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
        </tr>
        
        {/* Bottom border with corners */}
        <tr>
          <td style={{ 
            width: `${cornerSize}px`,
            height: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
          <td style={{ 
            height: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
          <td style={{ 
            width: `${cornerSize}px`,
            height: `${borderWidth}px`,
            backgroundColor: borderColor 
          }} />
        </tr>
      </tbody>
    </table>
  );
});
BorderFramePattern.displayName = 'BorderFramePattern';
