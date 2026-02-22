// Category Badge Component
// Inspired by Mixpanel's "PRODUCT" badge
// Use for: Email categorization (Release Notes, Feature Update, etc.)

import React from 'react';

export type CategoryBadgeType = 
  | 'release-notes'
  | 'feature-update'
  | 'product-announcement'
  | 'security-update'
  | 'maintenance'
  | 'webinar'
  | 'event';

interface CategoryBadgeProps {
  type: CategoryBadgeType;
  isEmailMode?: boolean;
}

const CATEGORY_STYLES: Record<CategoryBadgeType, { bg: string; color: string; label: string }> = {
  'release-notes': {
    bg: '#E9E3FF',
    color: '#5B21B6',
    label: 'RELEASE NOTES'
  },
  'feature-update': {
    bg: '#DBEAFE',
    color: '#1E40AF',
    label: 'FEATURE UPDATE'
  },
  'product-announcement': {
    bg: '#E9E3FF',
    color: '#5B21B6',
    label: 'PRODUCT'
  },
  'security-update': {
    bg: '#FEE2E2',
    color: '#991B1B',
    label: 'SECURITY'
  },
  'maintenance': {
    bg: '#FEF3C7',
    color: '#92400E',
    label: 'MAINTENANCE'
  },
  'webinar': {
    bg: '#D1FAE5',
    color: '#065F46',
    label: 'WEBINAR'
  },
  'event': {
    bg: '#DBEAFE',
    color: '#1E40AF',
    label: 'EVENT'
  }
};

export const CategoryBadge = React.memo(({ type, isEmailMode = false }: CategoryBadgeProps) => {
  const style = CATEGORY_STYLES[type];

  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: style.bg,
      color: style.color,
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      lineHeight: '1',
      verticalAlign: 'middle'
    }}>
      {style.label}
    </span>
  );
});
CategoryBadge.displayName = 'CategoryBadge';
