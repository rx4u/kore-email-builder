/**
 * Template copy – single source of truth for starter template header/footer text.
 * Used by App.tsx starterTemplates. Enables future i18n or CMS (BMAD P3-1).
 * Content rules: see src/docs/TEMPLATE_CONTENT_BRIEF.md.
 */

export type TemplateId =
  | 'blank'
  | 'release-notes'
  | 'major-feature'
  | 'premium-showcase'
  | 'newsletter'
  | 'product-update';

/** Matches HeaderConfig.categoryBadge in EmailSettings. */
export type TemplateCategoryBadge =
  | 'release-notes'
  | 'feature-update'
  | 'product-announcement'
  | 'security-update'
  | 'maintenance'
  | 'webinar'
  | 'event';

export interface TemplateHeaderCopy {
  title: string;
  productName?: string;
  versionText?: string;
  categoryBadge?: TemplateCategoryBadge;
}

export interface TemplateFooterCopy {
  message: string;
  teamName: string;
  email: string;
  website: string;
  disclaimer: string;
}

export interface TemplateCopy {
  header: TemplateHeaderCopy;
  footer: TemplateFooterCopy;
}

export const TEMPLATE_COPY: Record<TemplateId, TemplateCopy> = {
  blank: {
    header: { title: 'Email Title' },
    footer: {
      message: 'Thank you for your continued support and valuable feedback.',
      teamName: 'Kore.ai Product Management Team',
      email: 'contact@kore.ai',
      website: 'kore.ai',
      disclaimer: '© 2025 Kore.ai. All rights reserved.',
    },
  },
  'release-notes': {
    header: {
      title: 'Release Notes',
      productName: 'AI for Work',
      versionText: 'v3.2.0',
      categoryBadge: 'release-notes',
    },
    footer: {
      message: 'Thank you for your continued support and valuable feedback.',
      teamName: 'Kore.ai Product Management Team',
      email: 'releases@kore.ai',
      website: 'kore.ai',
      disclaimer: '© 2025 Kore.ai. All rights reserved.',
    },
  },
  'major-feature': {
    header: {
      title: 'Product Updates',
      versionText: 'v2.0.0',
      categoryBadge: 'feature-update',
    },
    footer: {
      message: 'Thank you for your continued support and valuable feedback.',
      teamName: 'Kore.ai Product Management Team',
      email: 'releases@kore.ai',
      website: 'kore.ai',
      disclaimer: '© 2025 Kore.ai. All rights reserved.',
    },
  },
  'premium-showcase': {
    header: {
      title: 'Enterprise Edition',
      versionText: 'v10.5.0',
      categoryBadge: 'product-announcement',
    },
    footer: {
      message: 'Contact our Enterprise support team for dedicated assistance.',
      teamName: 'Kore.ai Product Management Team',
      email: 'enterprise@kore.ai',
      website: 'kore.ai',
      disclaimer: '© 2025 Kore.ai. All rights reserved.',
    },
  },
  newsletter: {
    header: { title: 'Monthly Newsletter' },
    footer: {
      message: 'Thanks for reading.',
      teamName: 'Kore.ai Product Team',
      email: 'newsletter@kore.ai',
      website: 'kore.ai',
      disclaimer: "You received this because you're subscribed.",
    },
  },
  'product-update': {
    header: {
      title: 'Product Update',
      categoryBadge: 'product-announcement',
    },
    footer: {
      message: 'Thank you for your continued support and valuable feedback.',
      teamName: 'Kore.ai Product Management Team',
      email: 'contact@kore.ai',
      website: 'kore.ai',
      disclaimer: '© 2025 Kore.ai. All rights reserved.',
    },
  },
};
