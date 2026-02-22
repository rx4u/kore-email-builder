import React from 'react';

export type CellValue = 'yes' | 'no' | 'partial' | string;

export interface ComparisonRow {
  label: string;
  values: CellValue[];
}

export interface ComparisonTableProps {
  columns?: string[];
  rows?: ComparisonRow[];
  bgColor?: string;
  textColor?: string;
  isEmailMode?: boolean;
}

function isDarkBg(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

const CELL_SYMBOLS: Record<string, { symbol: string; color: string }> = {
  yes:     { symbol: '✓', color: '#22c55e' },
  no:      { symbol: '✗', color: '#ef4444' },
  partial: { symbol: '◐', color: '#d97706' },
};

export const ComparisonTable = React.memo(function ComparisonTable({
  columns = ['Feature', 'Kore v1', 'Competitor A', 'Competitor B'],
  rows = [
    { label: 'Internal comms blocks', values: ['yes', 'no', 'no'] },
    { label: 'Changelog block', values: ['yes', 'no', 'no'] },
    { label: 'Collaboration', values: ['yes', 'partial', 'yes'] },
    { label: 'Gmail-safe export', values: ['yes', 'yes', 'partial'] },
  ],
  bgColor = '#ffffff',
  textColor,
  isEmailMode = false,
}: ComparisonTableProps) {
  const dark = isDarkBg(bgColor);
  const textPrimary = textColor || (dark ? '#f4f4f5' : '#09090b');
  const textMuted = dark ? '#71717a' : '#52525b';
  const dividerColor = dark ? '#27272a' : '#e4e4e7';

  return (
    <tr>
      <td bgcolor={bgColor} style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, Arial, sans-serif' }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={{ textAlign: i === 0 ? 'left' : 'center', padding: '10px 12px', borderBottom: `1px solid ${dividerColor}`, color: textMuted, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td style={{ padding: '12px', borderBottom: `1px solid ${dividerColor}`, color: textPrimary, fontSize: '14px' }}>{row.label}</td>
                {row.values.map((val, vi) => {
                  const cell = CELL_SYMBOLS[val];
                  return (
                    <td key={vi} style={{ textAlign: 'center', padding: '12px', borderBottom: `1px solid ${dividerColor}`, fontSize: '16px', color: cell?.color || '#a1a1aa' }}>
                      {cell ? cell.symbol : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
});
