// Custom Drag Dots Icon
// 6 dots arranged in 2 columns, 3 rows
// Enhanced for better visibility

import React from 'react';

interface DragDotsIconProps {
  className?: string;
}

export const DragDotsIcon = React.memo(({ className = "" }: DragDotsIconProps) => {
  return (
    <svg
      width="12"
      height="18"
      viewBox="0 0 12 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left column */}
      <circle cx="3" cy="3" r="2" />
      <circle cx="3" cy="9" r="2" />
      <circle cx="3" cy="15" r="2" />
      
      {/* Right column */}
      <circle cx="9" cy="3" r="2" />
      <circle cx="9" cy="9" r="2" />
      <circle cx="9" cy="15" r="2" />
    </svg>
  );
});
DragDotsIcon.displayName = 'DragDotsIcon';
