// Email-compatible diagonal stripes pattern
// Creates subtle diagonal effect using staggered table cells

import React from 'react';

interface DiagonalStripesPatternProps {
  stripeColor?: string;
  backgroundColor?: string;
  stripeWidth?: number;
  rows?: number;
  cols?: number;
}

export const DiagonalStripesPattern = React.memo(({ 
  stripeColor = '#f0f6ff', // Very light blue background
  backgroundColor = '#ffffff',
  stripeWidth = 3,
  rows = 4,
  cols = 20
}: DiagonalStripesPatternProps) => {
  return (
    <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: cols }).map((_, colIndex) => {
              // Create diagonal pattern by checking if (rowIndex + colIndex) is divisible by stripe width
              const isStripe = (rowIndex + colIndex) % (stripeWidth * 2) < stripeWidth;
              
              return (
                <td key={colIndex} style={{
                  width: `${100 / cols}%`,
                  height: '8px',
                  backgroundColor: isStripe ? stripeColor : backgroundColor,
                  padding: '0'
                }}>
                  {/* Diagonal stripe cell */}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
DiagonalStripesPattern.displayName = 'DiagonalStripesPattern';
