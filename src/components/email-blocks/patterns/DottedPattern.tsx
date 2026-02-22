// Email-compatible dotted pattern component
// Creates subtle dot grid using table cells

import React from 'react';

interface DottedPatternProps {
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  rows?: number;
  cols?: number;
}

export const DottedPattern = React.memo(({ 
  dotColor = '#e6f0ff', // Very light blue based on Kore.ai brand
  dotSize = 2,
  spacing = 12,
  rows = 3,
  cols = 20
}: DottedPatternProps) => {
  const cellSize = dotSize + spacing;
  
  return (
    <table cellPadding="0" cellSpacing="0" border={0} style={{ 
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: `${spacing}px`
    }}>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex} style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                backgroundColor: dotColor,
                borderRadius: '50%',
                fontSize: '0',
                lineHeight: '0'
              }}>
                {/* Empty cell - dot created by background */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
DottedPattern.displayName = 'DottedPattern';
