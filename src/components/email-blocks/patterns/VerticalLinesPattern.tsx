// Email-compatible vertical lines pattern
// Creates subtle vertical lines using table columns

import React from 'react';

interface VerticalLinesPatternProps {
  lineColor?: string;
  lineWidth?: number;
  spacing?: number;
  count?: number;
  height?: number;
}

export const VerticalLinesPattern = React.memo(({ 
  lineColor = '#e6f0ff', // Very light blue based on Kore.ai brand
  lineWidth = 1,
  spacing = 24,
  count = 15,
  height = 60
}: VerticalLinesPatternProps) => {
  return (
    <table cellPadding="0" cellSpacing="0" border={0} style={{ 
      width: '100%',
      height: `${height}px`
    }}>
      <tbody>
        <tr>
          {Array.from({ length: count }).map((_, index) => (
            <td key={index} style={{
              width: `${lineWidth}px`,
              height: `${height}px`,
              backgroundColor: lineColor,
              padding: '0'
            }}>
              {/* Vertical line */}
            </td>
          )).reduce((acc: React.ReactNode[], line, index) => {
            if (index > 0) {
              // Add spacing cell between lines
              acc.push(
                <td key={`space-${index}`} style={{
                  width: `${spacing}px`,
                  height: `${height}px`,
                  padding: '0'
                }}>
                  {/* Spacer */}
                </td>
              );
            }
            acc.push(line);
            return acc;
          }, [])}
        </tr>
      </tbody>
    </table>
  );
});
VerticalLinesPattern.displayName = 'VerticalLinesPattern';
