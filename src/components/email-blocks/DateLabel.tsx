// Date label component - displays above header
import React from 'react';
import { emailSafeStyle } from '../../lib/email-styles-converter';
import { type AlignmentOption } from '../../lib/layout-scales';

interface DateLabelProps {
  date: string;
  alignment?: AlignmentOption; // NEW: Support for left/center/right alignment
  isEmailMode?: boolean;
  foregroundColor?: string; // Theme-aware text color
}

export const DateLabel = React.memo(({ date, alignment = 'right', isEmailMode = false, foregroundColor }: DateLabelProps) => {
  const dateStyle = emailSafeStyle({
    fontSize: '11px',
    color: foregroundColor || '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    fontWeight: '600',
    textAlign: alignment,
    marginBottom: '8px'
  }, isEmailMode);

  // For email mode, use table structure
  if (isEmailMode) {
    return (
      <tr>
        <td style={{ 
          padding: '0 32px 8px 32px',
          textAlign: alignment
        }}>
          <div style={dateStyle}>
            {date}
          </div>
        </td>
      </tr>
    );
  }

  // For build mode, use div
  return (
    <div style={{ 
      padding: '0 32px 8px 32px',
      textAlign: alignment
    }}>
      <div style={dateStyle}>
        {date}
      </div>
    </div>
  );
});
DateLabel.displayName = 'DateLabel';