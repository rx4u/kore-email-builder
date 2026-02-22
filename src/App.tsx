import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragOverEvent,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  getFirstCollision,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KoreLogo } from "./components/KoreLogo";
import { DragDotsIcon } from "./components/DragDotsIcon";
import agentConfigImg from "figma:asset/49248dbd165caf7144a4cb6ade908b8d36ee2839.png";
import { Copy, Check, Circle, Trash2, GripVertical, Image, List, FileText, RefreshCw, Grid3x3, AlertTriangle, MessageSquare, Code, Columns, Video, BarChart3, Clock, Minus, Mail, ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose, PanelLeft, PanelRight, Settings, Info, Wrench, Eye, Zap } from 'lucide-react';
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Separator } from "./components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { EmailSettingsButton, EmailSettingsPanel, type HeaderConfig, type FooterConfig } from "./components/EmailSettings";
import { PropertiesPanel, type ContentBlock, type ContentBlockType } from "./components/PropertiesPanel";
import { ThemeSettingsPanel } from "./components/ThemeSettingsPanel";
import { CodeViewer } from "./components/CodeViewer";
import { generateEmailHTML } from "./lib/html-generator";
import { iconSizes } from "./lib/design-tokens";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { GlobalThemeSettings, DEFAULT_GLOBAL_THEME, applyGlobalThemeToBlock, getThemeColorScheme, applyThemeToHeader, applyThemeToFooter, BUTTON_STYLES, getEmailWrapperStyles } from "./lib/global-theme";
import { getThemeById } from "./lib/theme-catalog";
import { createColorToken } from "./lib/color-token-system";
import { calculateLuminance, getContrastTextColor } from "./lib/color-utilities";
import { shallowEqual } from "./lib/performance-utils";
import { BLOCK_DEFAULTS } from "./lib/block-defaults";
import { TEMPLATE_COPY } from "./content/template-copy";
import { loadSession, saveSession, PERSISTENCE_VERSION } from "./lib/browser-persistence";
import { motion, AnimatePresence } from "motion/react";
import { panelVariants, sidebarStripVariants, panelContentSwitchVariants, springs, prefersReducedMotion, panelWidthTransition } from "./lib/motion-config";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { PanelHeader } from "./components/ui/PanelHeader";
import { EmptyState } from "./components/ui/EmptyState";
import { cn } from "./components/ui/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./components/ui/alert-dialog";

// Forensic Debugger utility (disabled)
const forensicDebugger = {
  logs: [] as Array<{ timestamp: number; type: string; label: string; data: any }>,
  log(type: string, label: string, data: any) {
    // No-op - forensic debugging disabled
  },
  reset() {
    // No-op - forensic debugging disabled
  },
  getLogs() {
    return this.logs;
  }
};

// Date component
const DateLabel = ({ date, isEmailMode = false, foregroundColor }: { date: string, isEmailMode?: boolean, foregroundColor?: string }) => {
  const dateStyle = {
    fontSize: '11px',
    color: foregroundColor || '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    fontWeight: '600',
    textAlign: 'right' as const,
    marginBottom: '8px'
  };

  if (isEmailMode) {
    return (
      <tr>
        <td style={{ padding: '0 32px 8px 32px', textAlign: 'right' }}>
          <div style={dateStyle}>{date}</div>
        </td>
      </tr>
    );
  }

  return (
    <div style={{ padding: '0 32px 8px 32px', textAlign: 'right' }}>
      <div style={dateStyle}>{date}</div>
    </div>
  );
};

// Email Block Components
import { FeatureWithScreenshot } from "./components/email-blocks/FeatureWithScreenshot";
import { FeatureList } from "./components/email-blocks/FeatureList";
import { ItemGrid } from "./components/email-blocks/ItemGrid";
import { MultiUpdate } from "./components/email-blocks/MultiUpdate";
import { WarningBlock } from "./components/email-blocks/WarningBlock";
import { TextOnlyBlock } from "./components/email-blocks/TextOnlyBlock";
import { HeaderBlock, KORE_LOGO_DEFAULT } from "./components/email-blocks/HeaderBlock";
import { ContactFooterBlock } from "./components/email-blocks/ContactFooterBlock";

import { CodeSnippet } from "./components/email-blocks/CodeSnippet";
import { TwoColumnFeature } from "./components/email-blocks/TwoColumnFeature";
import { VideoBlock } from "./components/email-blocks/VideoBlock";
import { StatsMetrics } from "./components/email-blocks/StatsMetrics";
import { Timeline } from "./components/email-blocks/Timeline";
import { DividerBlock } from "./components/email-blocks/DividerBlock";
import { ImageContentBlock } from "./components/email-blocks/ImageContentBlock";
import { HeroBlock } from "./components/email-blocks/HeroBlock";
import { ChangelogBlock } from "./components/email-blocks/ChangelogBlock";
import { DeprecationBlock } from "./components/email-blocks/DeprecationBlock";
import { MetricsBlock } from "./components/email-blocks/MetricsBlock";
import { NpsBlock } from "./components/email-blocks/NpsBlock";


// Email Template Wrapper – layout style (Copenhagen, New York, Oslo) controls radius and border
function EmailTemplate({ 
  children, 
  mode = 'build',
  emailBackground = '#ffffff',
  borderColor = '#E5E7EB',
  emailWidth = '600px',
  innerBorderRadius = '12px',
  innerBorder = '1px solid #E5E7EB',
}: { 
  children: React.ReactNode, 
  mode?: 'build' | 'preview',
  emailBackground?: string,
  borderColor?: string,
  emailWidth?: string,
  innerBorderRadius?: string,
  innerBorder?: string,
}) {
  const noBorder = innerBorder === 'none' || !innerBorder;
  const effectiveBorder = mode === 'preview' ? innerBorder : 'none';
  return (
    <table cellPadding="0" cellSpacing="0" border={0} style={{ 
      maxWidth: emailWidth, 
      width: '100%', 
      margin: 0,
      backgroundColor: mode === 'preview' ? emailBackground : 'transparent',
      borderRadius: innerBorderRadius,
      overflow: 'hidden',
      border: effectiveBorder,
      borderCollapse: 'collapse',
      borderSpacing: 0,
      ...(noBorder && mode === 'preview' && {
        borderWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
      }),
    }}>
      <tbody>
        {children}
      </tbody>
    </table>
  );
}

// Outside Email Spacer - for spacing outside the white email container
function OutsideEmailSpacer({ height = '32px' }: { height?: string }) {
  return (
    <div style={{ height, backgroundColor: 'transparent' }}></div>
  );
}

// Spacer row for elegant spacing between blocks
function BlockSpacer({ height = '24px' }: { height?: string }) {
  return (
    <tr>
      <td style={{ height }}></td>
    </tr>
  );
}

// Email state structure
interface EmailState {
  header: HeaderConfig;
  content: ContentBlock[];
  footer: FooterConfig;
}

/** Default date string for header when missing (avoids empty blank header). */
const DEFAULT_HEADER_DATE = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/**
 * Patches restored session state so header/footer never have empty required text.
 * Prevents "empty blank blocks" when session had empty title, date, or footer fields.
 */
function patchEmptyBlocks(state: EmailState): EmailState {
  const header = { ...state.header };
  if (header.title === undefined || header.title === null || String(header.title).trim() === '') {
    header.title = 'Email Title';
  }
  if (header.date === undefined || header.date === null || String(header.date).trim() === '') {
    header.date = DEFAULT_HEADER_DATE();
  }
  // If version badge was saved with month/year (e.g. "October 2025"), use a proper version string
  const monthYearPattern = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i;
  if (header.versionText && monthYearPattern.test(String(header.versionText).trim())) {
    header.versionText = 'v1.0.0';
  }
  const footer = { ...state.footer };
  if (footer.message === undefined || footer.message === null || String(footer.message).trim() === '') {
    footer.message = 'Thank you for your continued support and valuable feedback.';
  }
  if (footer.teamName === undefined || footer.teamName === null || String(footer.teamName).trim() === '') {
    footer.teamName = 'Kore.ai Product Management Team';
  }
  if (footer.email === undefined || footer.email === null || String(footer.email).trim() === '') {
    footer.email = 'contact@kore.ai';
  }
  if (footer.website === undefined || footer.website === null || String(footer.website).trim() === '') {
    footer.website = 'kore.ai';
  }
  if (footer.disclaimer === undefined || footer.disclaimer === null || String(footer.disclaimer).trim() === '') {
    footer.disclaimer = '© 2025 Kore.ai. All rights reserved.';
  }
  return { ...state, header, footer };
}

// Available content blocks for library
const contentBlockLibrary = [
  {
    type: 'feature-screenshot' as ContentBlockType,
    name: 'Feature + Screenshot',
    description: 'Feature with image and benefits',
    icon: Image
  },
  {
    type: 'image-content' as ContentBlockType,
    name: 'Image + Content',
    description: 'Side-by-side image & content',
    icon: Image
  },
  {
    type: 'feature-list' as ContentBlockType,
    name: 'Feature List',
    description: 'Bulleted list of features',
    icon: List
  },
  {
    type: 'text-only' as ContentBlockType,
    name: 'Text Block',
    description: 'Simple text content',
    icon: FileText
  },
  {
    type: 'multi-update' as ContentBlockType,
    name: 'Multi-Update',
    description: 'Group multiple updates',
    icon: RefreshCw
  },
  {
    type: 'item-grid' as ContentBlockType,
    name: 'Item Grid',
    description: '2-column feature grid',
    icon: Grid3x3
  },
  {
    type: 'warning' as ContentBlockType,
    name: 'Alert Block',
    description: 'Warning, success, info, error, or tip',
    icon: AlertTriangle
  },
  {
    type: 'code-snippet' as ContentBlockType,
    name: 'Code Snippet',
    description: 'API examples and code',
    icon: Code
  },
  {
    type: 'two-column' as ContentBlockType,
    name: 'Two Column',
    description: 'Side-by-side comparison',
    icon: Columns
  },
  {
    type: 'video-block' as ContentBlockType,
    name: 'Video Block',
    description: 'Embedded video thumbnail',
    icon: Video
  },
  {
    type: 'stats-metrics' as ContentBlockType,
    name: 'Stats & Metrics',
    description: 'Display key numbers',
    icon: BarChart3
  },
  {
    type: 'timeline' as ContentBlockType,
    name: 'Timeline',
    description: 'Sequential updates',
    icon: Clock
  },
  {
    type: 'divider' as ContentBlockType,
    name: 'Divider',
    description: 'Horizontal line separator',
    icon: Minus
  },
  {
    type: 'hero' as ContentBlockType,
    name: 'Hero',
    description: 'Large display hero with badge and CTA',
    icon: Zap
  },
  {
    type: 'changelog' as ContentBlockType,
    name: 'Changelog',
    description: 'Categorized release changes with color-coded types',
    icon: Clock
  },
  {
    type: 'deprecation' as ContentBlockType,
    name: 'Deprecation Notice',
    description: 'EOL date, severity level, and migration path',
    icon: AlertTriangle
  },
  {
    type: 'metrics-snapshot' as ContentBlockType,
    name: 'Metrics Snapshot',
    description: 'Stat cards with delta indicators',
    icon: BarChart3
  },
  {
    type: 'nps-rating' as ContentBlockType,
    name: 'NPS Rating',
    description: '0-10 satisfaction scale with tokenized links',
    icon: MessageSquare
  }
];

// Starter templates
const starterTemplates: Record<string, EmailState> = {
  blank: {
    // Content brief: no body blocks; user adds blocks as needed (BMAD P2-3).
    header: {
      title: TEMPLATE_COPY.blank.header.title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      showDate: true,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'lg' as 'sm' | 'md' | 'lg' | 'xl' | 'custom'
    },
    content: [], // Empty by design; add blocks as needed (TEMPLATE_CONTENT_BRIEF).
    footer: {
      showFooter: true,
      ...TEMPLATE_COPY.blank.footer,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'sm' as 'sm' | 'md' | 'lg',
      backgroundColor: '#F8FAFC',
      contentAlignment: 'center' as 'left' | 'center' | 'right',
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 32,
      paddingRight: 32
    }
  },
  'release-notes': {
    header: {
      title: TEMPLATE_COPY['release-notes'].header.title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      showDate: true,
      productName: TEMPLATE_COPY['release-notes'].header.productName,
      showProductName: true,
      productNameFontSize: 20,
      categoryBadge: TEMPLATE_COPY['release-notes'].header.categoryBadge as HeaderConfig['categoryBadge'],
      versionText: TEMPLATE_COPY['release-notes'].header.versionText,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'lg' as 'sm' | 'md' | 'lg' | 'xl' | 'custom',
      theme: 'kore-default' // Official Kore.ai blue theme
    },
    content: [
      {
        id: 'feature-1',
        type: 'feature-screenshot',
        props: {
          ...BLOCK_DEFAULTS['feature-screenshot'],
          title: 'Advanced AI Engine',
          badge: 'new',
          description: 'Enhanced natural language understanding with improved accuracy and faster response times.',
          screenshotAlt: 'AI Engine Dashboard',
          bullets: [
            'Improved intent recognition',
            'Multi-language support',
            'Real-time learning'
          ],
          ctaText: 'Learn more',
          ctaLink: 'https://example.com/docs'
        }
      },
      {
        id: 'feature-2',
        type: 'feature-list',
        props: {
          ...BLOCK_DEFAULTS['feature-list'],
          title: 'Platform Enhancements',
          badge: 'improved',
          description: 'Key improvements across the platform for better performance and usability.',
          bullets: [
            'Faster dashboard loading times',
            'Enhanced security protocols',
            'Improved API response rates',
            'Better error handling'
          ]
        }
      },
      {
        id: 'updates-1',
        type: 'multi-update',
        props: {
          ...BLOCK_DEFAULTS['multi-update'],
          title: 'Additional Updates',
          updates: [
            {
              title: 'New Integration Hub',
              badge: 'new',
              description: 'Connect with 50+ third-party services seamlessly.',
              ctaText: 'View integrations',
              ctaLink: 'https://example.com/integrations'
            },
            {
              title: 'Analytics Dashboard v2',
              badge: 'improved',
              description: 'More insights with customizable reports and real-time metrics.',
              ctaText: 'Explore analytics',
              ctaLink: 'https://example.com/analytics'
            }
          ]
        }
      },
      {
        id: 'timeline-1',
        type: 'timeline',
        props: {
          ...BLOCK_DEFAULTS.timeline,
          title: 'Coming Soon',
          description: 'Preview of upcoming features in our roadmap.',
          items: [
            {
              title: 'Advanced Automation',
              description: 'Automated workflows and triggers',
              date: 'Q1 2026'
            },
            {
              title: 'Mobile App Redesign',
              description: 'Enhanced mobile experience',
              date: 'Q2 2026'
            }
          ]
        }
      },
      {
        id: 'warning-1',
        type: 'warning',
        props: {
          ...BLOCK_DEFAULTS.warning,
          title: 'Deprecation Notice',
          description: 'Legacy API v1.0 will be sunset on March 31, 2026. Please migrate to v2.0.',
          severity: 'warning',
          ctaText: 'Migration guide',
          ctaLink: 'https://example.com/migration'
        }
      }
    ],
    footer: {
      showFooter: true,
      ...TEMPLATE_COPY['release-notes'].footer,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'sm' as 'sm' | 'md' | 'lg',
      backgroundColor: '#F8FAFC',
      contentAlignment: 'center' as 'left' | 'center' | 'right',
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 32,
      paddingRight: 32
    }
  },
  'major-feature': {
    header: {
      title: TEMPLATE_COPY['major-feature'].header.title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      showDate: true,
      categoryBadge: TEMPLATE_COPY['major-feature'].header.categoryBadge as HeaderConfig['categoryBadge'],
      versionText: TEMPLATE_COPY['major-feature'].header.versionText,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'lg' as 'sm' | 'md' | 'lg' | 'xl' | 'custom',
      logoAlignment: 'left' as 'left' | 'center',
      theme: 'brand-primary' // Recommended: brand-primary (see RECOMMENDED_THEME_BY_TEMPLATE)
    },
    content: [
      {
        id: 'feature-1',
        type: 'feature-screenshot',
        props: {
          ...BLOCK_DEFAULTS['feature-screenshot'],
          title: 'Smart Analytics Dashboard',
          badge: 'new',
          description: 'Get real-time insights into your data with customizable dashboards and advanced reporting.',
          screenshotAlt: 'Analytics Dashboard',
          bullets: [
            'Customizable widgets',
            'Real-time data sync',
            'Export to multiple formats',
            'Team collaboration'
          ],
          ctaText: 'Try it now',
          ctaLink: 'https://example.com/analytics',
          useGradientBackground: true,
          fullWidth: false
        }
      },
      {
        id: 'two-column-1',
        type: 'two-column',
        props: {
          ...BLOCK_DEFAULTS['two-column'],
          leftColumn: {
            title: 'Powerful Insights',
            description: 'Visualize complex data with interactive charts and graphs. Build custom dashboards with drag-and-drop widgets, analyze trends with advanced filters, and leverage predictive modeling to forecast future outcomes.'
          },
          rightColumn: {
            title: 'Easy Sharing',
            description: 'Share reports with your team and stakeholders effortlessly. Export to multiple formats with one click, schedule automated reports, and control access with granular permissions.'
          }
        }
      },
      {
        id: 'stats-1',
        type: 'stats-metrics',
        props: {
          ...BLOCK_DEFAULTS['stats-metrics'],
          title: 'Performance Improvements',
          stats: [
            { label: 'Faster Load Times', value: '50%' },
            { label: 'More Data Points', value: '10x' },
            { label: 'Uptime SLA', value: '99.9%' }
          ]
        }
      },
      {
        id: 'code-1',
        type: 'code-snippet',
        props: {
          ...BLOCK_DEFAULTS['code-snippet'],
          title: 'Quick Integration',
          description: 'Add analytics to your application in minutes.',
          code: `// Initialize analytics
const analytics = new Analytics({
  apiKey: 'your-api-key',
  autoTrack: true
});

// Track custom events
analytics.track('feature_used', {
  feature: 'dashboard'
});`,
          language: 'javascript'
        }
      },
      {
        id: 'grid-1',
        type: 'item-grid',
        props: {
          ...BLOCK_DEFAULTS['item-grid'],
          title: 'Supported Data Sources',
          description: 'Connect to your favorite tools and platforms.',
          items: [
            'PostgreSQL',
            'MongoDB',
            'MySQL',
            'Redis',
            'Salesforce',
            'Google Analytics'
          ],
          ctaText: 'View all integrations',
          ctaLink: 'https://example.com/integrations'
        }
      },
      {
        id: 'video-1',
        type: 'video-block',
        props: {
          ...BLOCK_DEFAULTS.video,
          title: 'See it in Action',
          description: 'Watch a 2-minute demo of the new analytics dashboard.',
          videoUrl: 'https://example.com/demo-video',
          ctaText: 'Watch demo'
        }
      }
    ],
    footer: {
      showFooter: true,
      ...TEMPLATE_COPY['major-feature'].footer,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'sm' as 'sm' | 'md' | 'lg',
      backgroundColor: '#F8FAFC',
      contentAlignment: 'center' as 'left' | 'center' | 'right',
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 32,
      paddingRight: 32
    }
  },
  'premium-showcase': {
    header: {
      title: TEMPLATE_COPY['premium-showcase'].header.title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      showDate: true,
      categoryBadge: TEMPLATE_COPY['premium-showcase'].header.categoryBadge as HeaderConfig['categoryBadge'],
      versionText: TEMPLATE_COPY['premium-showcase'].header.versionText,
      versionBadgeStyle: 'accent',
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'lg' as 'sm' | 'md' | 'lg' | 'xl' | 'custom',
      logoAlignment: 'left' as 'left' | 'center',
      theme: 'brand-dark' // Recommended: brand-dark (see RECOMMENDED_THEME_BY_TEMPLATE)
    },
    content: [
      {
        id: 'showcase-1',
        type: 'feature-screenshot',
        props: {
          ...BLOCK_DEFAULTS['feature-screenshot'],
          title: 'Enterprise Command Center',
          badge: 'enterprise',
          description: 'Centralized control for large-scale deployments with advanced management capabilities.',
          screenshotAlt: 'Command Center Dashboard',
          bullets: [
            'Multi-tenant management',
            'Advanced security controls',
            'Compliance monitoring',
            '24/7 premium support'
          ],
          ctaText: 'Learn more',
          ctaLink: 'https://example.com/enterprise'
        }
      },
      {
        id: 'stats-1',
        type: 'stats-metrics',
        props: {
          ...BLOCK_DEFAULTS['stats-metrics'],
          title: 'Enterprise Impact',
          description: 'Real results from our enterprise customers.',
          stats: [
            { label: 'Average ROI', value: '300%' },
            { label: 'Time Saved', value: '85%' },
            { label: 'Support Response', value: '<1hr' }
          ]
        }
      },
      {
        id: 'two-column-1',
        type: 'two-column',
        props: {
          ...BLOCK_DEFAULTS['two-column'],
          leftColumn: {
            title: 'Advanced Security',
            description: 'Enterprise-grade security built for compliance. SOC 2 Type II certified with GDPR compliance, custom data retention policies, and encryption at rest for all sensitive data.'
          },
          rightColumn: {
            title: 'Custom Deployments',
            description: 'Deploy on your infrastructure with full control. On-premise options, private cloud support, dedicated instances, and custom SLAs tailored to your business needs.'
          }
        }
      },
      {
        id: 'showcase-2',
        type: 'feature-screenshot',
        props: {
          ...BLOCK_DEFAULTS['feature-screenshot'],
          title: 'Compliance Dashboard',
          badge: 'enterprise',
          description: 'Monitor compliance across all your deployments with real-time alerts and audit trails.',
          screenshotAlt: 'Compliance Dashboard',
          bullets: [
            'Automated compliance checks',
            'Detailed audit logs',
            'Custom policy enforcement',
            'Regulatory reporting'
          ],
          ctaText: 'View features',
          ctaLink: 'https://example.com/compliance'
        }
      },
      {
        id: 'grid-1',
        type: 'item-grid',
        props: {
          ...BLOCK_DEFAULTS['item-grid'],
          title: 'Enterprise Integrations',
          description: 'Connect with your enterprise systems seamlessly.',
          items: [
            'Salesforce',
            'ServiceNow',
            'SAP',
            'Oracle',
            'Microsoft Teams',
            'Slack Enterprise',
            'Workday',
            'Azure AD',
            'Okta'
          ],
          ctaText: 'Explore integrations',
          ctaLink: 'https://example.com/enterprise-integrations'
        }
      },
      {
        id: 'timeline-1',
        type: 'timeline',
        props: {
          ...BLOCK_DEFAULTS.timeline,
          title: 'Implementation Timeline',
          description: 'Typical enterprise onboarding process.',
          items: [
            {
              title: 'Discovery & Planning',
              description: 'Requirements gathering and architecture design',
              date: 'Week 1-2'
            },
            {
              title: 'Deployment',
              description: 'Infrastructure setup and configuration',
              date: 'Week 3-4'
            },
            {
              title: 'Training & Onboarding',
              description: 'Team training and knowledge transfer',
              date: 'Week 5-6'
            },
            {
              title: 'Go Live',
              description: 'Production deployment and support',
              date: 'Week 7'
            }
          ]
        }
      },
      {
        id: 'warning-1',
        type: 'warning',
        props: {
          ...BLOCK_DEFAULTS.warning,
          title: 'Enterprise License Required',
          description: 'These features require an active Enterprise license. Contact our sales team for pricing and availability.',
          alertType: 'info',
          ctaText: 'Contact sales',
          ctaLink: 'https://example.com/contact-sales'
        }
      },
      {
        id: 'multi-update-1',
        type: 'multi-update',
        props: {
          ...BLOCK_DEFAULTS['multi-update'],
          title: 'Included Enterprise Features',
          updates: [
            {
              title: 'Single Sign-On (SSO)',
              badge: 'included',
              description: 'SAML and OAuth 2.0 support for seamless authentication.'
            },
            {
              title: 'Role-Based Access Control',
              badge: 'included',
              description: 'Granular permissions and custom role definitions.'
            },
            {
              title: 'Advanced Audit Logs',
              badge: 'included',
              description: 'Comprehensive activity tracking and compliance reporting.'
            },
            {
              title: 'Priority Support',
              badge: 'included',
              description: 'Dedicated support team with <1 hour response time.'
            }
          ]
        }
      }
    ],
    footer: {
      showFooter: true,
      ...TEMPLATE_COPY['premium-showcase'].footer,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'sm' as 'sm' | 'md' | 'lg',
      backgroundColor: '#F8FAFC',
      contentAlignment: 'center' as 'left' | 'center' | 'right',
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 32,
      paddingRight: 32
    }
  },
  'newsletter': {
    header: {
      title: TEMPLATE_COPY.newsletter.header.title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      showDate: true,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'lg' as 'sm' | 'md' | 'lg' | 'xl' | 'custom',
      theme: 'kore-default'
    },
    content: [
      {
        id: 'intro-1',
        type: 'text-only',
        props: {
          ...BLOCK_DEFAULTS['text-only'],
          title: 'Welcome to this month\'s update',
          description: 'Here’s what’s new and what to try in the product.'
        }
      },
      {
        id: 'updates-1',
        type: 'multi-update',
        props: {
          ...BLOCK_DEFAULTS['multi-update'],
          title: 'Highlights',
          updates: [
            { title: 'New feature', badge: 'new', description: 'A new capability is now available.' },
            { title: 'Improvement', badge: 'improved', description: 'We’ve made things faster and clearer.' }
          ]
        }
      },
      {
        id: 'cta-1',
        type: 'feature-screenshot',
        props: {
          ...BLOCK_DEFAULTS['feature-screenshot'],
          title: 'Get started',
          description: 'Dive in with our quick start guide.',
          ctaText: 'Read the guide',
          ctaLink: 'https://example.com/guide'
        }
      }
    ],
    footer: {
      showFooter: true,
      ...TEMPLATE_COPY.newsletter.footer,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'sm' as 'sm' | 'md' | 'lg',
      backgroundColor: '#F8FAFC',
      contentAlignment: 'center' as 'left' | 'center' | 'right',
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 32,
      paddingRight: 32
    }
  },
  'product-update': {
    header: {
      title: TEMPLATE_COPY['product-update'].header.title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      showDate: true,
      categoryBadge: TEMPLATE_COPY['product-update'].header.categoryBadge as HeaderConfig['categoryBadge'],
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'md' as 'sm' | 'md' | 'lg' | 'xl' | 'custom',
      theme: 'kore-default'
    },
    content: [
      {
        id: 'announce-1',
        type: 'feature-screenshot',
        props: {
          ...BLOCK_DEFAULTS['feature-screenshot'],
          title: 'What’s new',
          badge: 'new',
          description: 'Summary of the latest changes and how they help you.',
          ctaText: 'Learn more',
          ctaLink: 'https://example.com'
        }
      },
      {
        id: 'list-1',
        type: 'feature-list',
        props: {
          ...BLOCK_DEFAULTS['feature-list'],
          title: 'Key changes',
          bullets: ['Change one', 'Change two', 'Change three']
        }
      }
    ],
    footer: {
      showFooter: true,
      ...TEMPLATE_COPY['product-update'].footer,
      showLogo: true,
      logoSrc: KORE_LOGO_DEFAULT,
      logoSize: 'sm' as 'sm' | 'md' | 'lg',
      backgroundColor: '#F8FAFC',
      contentAlignment: 'center' as 'left' | 'center' | 'right',
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 32,
      paddingRight: 32
    }
  }
};

// Template display names for dropdown (presets + Custom)
const TEMPLATE_LABELS: Record<string, string> = {
  blank: 'Blank',
  'release-notes': 'Release Notes',
  'major-feature': 'Major Feature',
  'premium-showcase': 'Premium Showcase',
  newsletter: 'Newsletter',
  'product-update': 'Product Update',
  custom: 'Custom'
};

/** Recommended theme per template (BMAD Template Styling Strategy). Used for optional "apply theme on template switch" and docs. */
export const RECOMMENDED_THEME_BY_TEMPLATE: Record<string, string> = {
  blank: 'kore-default',
  'release-notes': 'kore-default',
  'major-feature': 'brand-primary',
  'premium-showcase': 'brand-dark',
  newsletter: 'kore-default',
  'product-update': 'kore-default'
};

// Draggable sidebar item
const DraggableBlockLibraryItem = React.memo(({ type, name, icon: IconComponent }: { type: ContentBlockType; name: string; icon: any }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type }
  });

  // Block descriptions for hover cards
  const getBlockDescription = (blockType: ContentBlockType): string => {
    const descriptions: Record<ContentBlockType, string> = {
      'feature-screenshot': 'Feature announcement with screenshot and description',
      'feature-list': 'Bulleted list of features with icons',
      'image-content': 'Image with text side-by-side',
      'item-grid': 'Grid layout for multiple items',
      'multi-update': 'Multiple updates with badges',
      'warning': 'Important notice or warning message',
      'text-only': 'Simple text content block',
      'code-snippet': 'Code block with syntax highlighting',
      'two-column': 'Two-column layout for comparisons',
      'video-block': 'Video embed with thumbnail',
      'stats-metrics': 'Statistical metrics display',
      'timeline': 'Chronological timeline view',
      'divider': 'Visual separator between sections'
    };
    return descriptions[blockType] || 'Content block';
  };

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Card
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="w-full cursor-grab active:cursor-grabbing group border-border/60"
        >
          <CardContent className="p-3.5">
            <div className="flex items-center gap-3">
              <IconComponent className={`${iconSizes.md} text-muted-foreground group-hover:text-black transition-colors duration-200 flex-shrink-0`} />
              <span className="text-sm font-medium flex-1 group-hover:text-black transition-colors">{name}</span>
              <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-black transition-colors duration-200 opacity-50 group-hover:opacity-100" />
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-64">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">{name}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getBlockDescription(type)}
          </p>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Drag to canvas to add
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
});
DraggableBlockLibraryItem.displayName = 'DraggableBlockLibraryItem';

// Compact draggable item for collapsed sidebar
const CompactDraggableBlockLibraryItem = React.memo(({ type, name, icon: IconComponent }: { type: ContentBlockType; name: string; icon: any }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type }
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing transition-all"
        >
          <Card className="w-11 h-11 p-0 transition-all duration-200 hover:border-black hover:scale-105 flex items-center justify-center border-border/60">
            <IconComponent className="w-[18px] h-[18px] text-muted-foreground" />
          </Card>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
});
CompactDraggableBlockLibraryItem.displayName = 'CompactDraggableBlockLibraryItem';

// Drop zone indicator between blocks
const DropIndicator = React.memo(({ id, isOver }: { id: string; isOver: boolean }) => {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "transition-all duration-200 w-full",
        isOver ? "h-16 my-2" : "h-10 my-1.5"
      )}
    >
      {isOver ? (
        <div className="h-full w-full border-2 border-dashed border-black bg-black/5 flex items-center justify-center rounded-md">
          <span className="text-sm font-semibold text-black">Drop block here</span>
        </div>
      ) : (
        <div className="h-full w-full border-2 border-dashed border-border/30 hover:border-border/60 transition-all hover:bg-muted/20 rounded-md" />
      )}
    </div>
  );
});
DropIndicator.displayName = 'DropIndicator';

// Get block metadata helper
function getBlockMetadata(type: ContentBlockType) {
  const meta = contentBlockLibrary.find(b => b.type === type);
  return meta || { name: 'Block', icon: FileText };
}

// Sortable Block Wrapper Component
const SortableBlock = React.memo(({ 
  block, 
  isSelected, 
  onSelect, 
  onRemove,
  onUpdateProps,
  cardBorderRadius,
  children 
}: { 
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdateProps: (props: any) => void;
  /** Border radius from email layout style (Copenhagen 20px, New York/Oslo 0) */
  cardBorderRadius?: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });
  
  // Log render cycles
  useEffect(() => {
    forensicDebugger.log('RENDER', 'SortableBlock', {
      blockId: block.id,
      blockType: block.type,
      isDragging,
      isSelected,
      transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none',
    });
  }, [block.id, block.type, isDragging, isSelected, transform]);
  
  // Log mount/unmount
  useEffect(() => {
    forensicDebugger.log('COMPONENT_MOUNT', 'SortableBlock', {
      blockId: block.id,
      blockType: block.type,
    });
    
    return () => {
      forensicDebugger.log('COMPONENT_UNMOUNT', 'SortableBlock', {
        blockId: block.id,
        blockType: block.type,
      });
    };
  }, [block.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...(cardBorderRadius !== undefined && { borderRadius: cardBorderRadius }),
  };

  const { name, icon: IconComponent } = getBlockMetadata(block.type);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      data-block-id={block.id}
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer border-0",
          isSelected && "ring-2 ring-black/20 ring-offset-2",
          isDragging && "opacity-50"
        )}
      >
        {/* Compact Header */}
        <CardHeader className={cn(
          "flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b transition-all duration-200",
          isSelected ? "border-black/20 bg-black/[0.02]" : "border-border/40"
        )}>
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 hover:bg-muted/60 rounded-sm transition-all hover:scale-110 active:scale-90"
            >
              <GripVertical className={cn(
                "w-4 h-4 transition-colors",
                isSelected ? "text-black/60" : "text-muted-foreground"
              )} />
            </div>
            
            <IconComponent className={cn(
              "w-[18px] h-[18px] transition-colors",
              isSelected ? "text-black" : "text-muted-foreground"
            )} />
            
            <span className={cn(
              "text-sm font-medium transition-colors",
              isSelected ? "text-black" : "text-muted-foreground"
            )}>
              {name}
            </span>
          </div>

          {/* Delete Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Remove block"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
              }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-sm hover:scale-110 hover:rotate-6 active:scale-90"
            >
              <Trash2 className="w-4 h-4" aria-hidden />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove block</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>

      {/* Content Preview */}
      <CardContent className="py-5 px-0">
        <div className="pointer-events-none">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom equality check for optimal performance
  return (
    prevProps.block.id === nextProps.block.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.cardBorderRadius === nextProps.cardBorderRadius &&
    shallowEqual(prevProps.block.props, nextProps.block.props) &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.onRemove === nextProps.onRemove &&
    prevProps.onUpdateProps === nextProps.onUpdateProps
  );
});
SortableBlock.displayName = 'SortableBlock';

// DragOverlay Content Component with lifecycle logging
const DragOverlayContent = React.memo(({ activeId }: { activeId: string }) => {
  useEffect(() => {
    forensicDebugger.log('COMPONENT_MOUNT', 'DragOverlay', {
      activeId,
      timestamp: performance.now(),
    });
    
    return () => {
      forensicDebugger.log('COMPONENT_UNMOUNT', 'DragOverlay', {
        activeId,
        timestamp: performance.now(),
      });
    };
  }, [activeId]);
  
  const type = activeId.replace('sidebar-', '') as ContentBlockType;
  const block = contentBlockLibrary.find(b => b.type === type);
  if (!block) return null;
  const IconComponent = block.icon;
  
  return (
    <div className="bg-white border-2 border-black p-4">
      <div className="flex items-center gap-3">
        <IconComponent className="w-5 h-5 text-black" />
        <span className="text-sm font-semibold">{block.name}</span>
      </div>
    </div>
  );
});
DragOverlayContent.displayName = 'DragOverlayContent';

export default function App() {
  const [mode, setMode] = useState<'build' | 'preview' | 'code'>('build');
  const [currentTemplate, setCurrentTemplate] = useState<string>('release-notes');
  const [emailState, setEmailState] = useState<EmailState>(starterTemplates['release-notes']);
  const [selectedBlockId, setSelectedBlockId] = useState<'header' | 'footer' | string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [globalTheme, setGlobalTheme] = useState<GlobalThemeSettings>(DEFAULT_GLOBAL_THEME);
  const emailContainerRef = useRef<HTMLDivElement>(null);
  const emailSafeContainerRef = useRef<HTMLDivElement>(null);
  const prevDefaultLogoSizeRef = useRef(globalTheme.defaultLogoSize);
  
  // Track template switching with confirmation
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const [showTemplateSwitchDialog, setShowTemplateSwitchDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Small distance to prevent accidental drags but stay responsive
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      // Prevent KeyboardSensor from interfering with input/textarea elements
      activationConstraint: {
        // Only handle keyboard events on draggable elements, not form controls
        shouldHandleEvent: (element) => {
          if (element instanceof HTMLElement) {
            const tagName = element.tagName.toLowerCase();
            // Don't activate sensor on form controls
            if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
              return false; // Let the input handle its own keyboard events
            }
            // Don't activate sensor on contentEditable elements
            if (element.isContentEditable) {
              return false;
            }
          }
          return true; // Handle keyboard events on all other elements
        }
      }
    })
  );

  // When the global default logo size changes in Theme Settings,
  // propagate that size to header and footer logos so the control
  // actually resizes the template logos (unless templates override later).
  useEffect(() => {
    const prev = prevDefaultLogoSizeRef.current;
    const next = globalTheme.defaultLogoSize;
    if (!next || prev === next) return;
    prevDefaultLogoSizeRef.current = next;

    const headerSize = next;
    const footerSize = next === 'xl' ? 'lg' : next;

    const sizeToPixels = (size?: string): number | undefined => {
      switch (size) {
        case 'sm': return 60;
        case 'md': return 80;
        case 'lg': return 120;
        case 'xl': return 160;
        default: return undefined;
      }
    };

    setEmailState(prev => ({
      ...prev,
      header: {
        ...prev.header,
        logoSize: headerSize as any,
        logoCustomWidth: sizeToPixels(headerSize) ?? prev.header.logoCustomWidth,
      },
      footer: {
        ...prev.footer,
        logoSize: footerSize as any,
      },
    }));
  }, [globalTheme.defaultLogoSize]);

  // Track emailState.content changes for forensic analysis
  useEffect(() => {
    forensicDebugger.log('STATE_CHANGE', 'emailState.content', {
      contentLength: emailState.content.length,
      blockIds: emailState.content.map(b => b.id),
      blockTypes: emailState.content.map(b => b.type),
    });
  }, [emailState.content]);
  
  // Restore session from localStorage on mount (once)
  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    if (session.emailState && typeof session.emailState === 'object' && 'header' in session.emailState && 'content' in session.emailState && 'footer' in session.emailState) {
      setEmailState(patchEmptyBlocks(session.emailState as EmailState));
    }
    if (session.globalTheme && typeof session.globalTheme === 'object') {
      setGlobalTheme(session.globalTheme as GlobalThemeSettings);
    }
    const validMode = session.mode === 'build' || session.mode === 'preview' || session.mode === 'code' ? session.mode : 'build';
    setMode(validMode);
    const validTemplate = session.currentTemplate in starterTemplates || session.currentTemplate === 'custom' ? session.currentTemplate : 'release-notes';
    setCurrentTemplate(validTemplate);
    setLeftPanelCollapsed(session.leftPanelCollapsed);
    setRightPanelCollapsed(session.rightPanelCollapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist session to localStorage (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      saveSession({
        version: PERSISTENCE_VERSION,
        savedAt: new Date().toISOString(),
        emailState,
        currentTemplate,
        globalTheme,
        mode,
        leftPanelCollapsed,
        rightPanelCollapsed,
      });
    }, 600);
    return () => clearTimeout(t);
  }, [emailState, currentTemplate, globalTheme, mode, leftPanelCollapsed, rightPanelCollapsed]);

  // Track unsaved changes - when on a preset, dirty if state differs; when Custom, always consider dirty so switching away prompts
  useEffect(() => {
    if (currentTemplate === 'custom') {
      setHasUnsavedChanges(true);
      return;
    }
    const originalTemplate = starterTemplates[currentTemplate];
    if (!originalTemplate) {
      setHasUnsavedChanges(false);
      return;
    }
    const hasChanges = JSON.stringify(emailState) !== JSON.stringify(originalTemplate);
    setHasUnsavedChanges(hasChanges);
  }, [emailState, currentTemplate]);
  
  // Auto-apply theme changes whenever globalTheme changes
  useEffect(() => {
    console.log('🎨 AUTO-APPLYING THEME');
    console.log('Current globalTheme:', globalTheme);
    console.log('Selected theme ID:', globalTheme.defaultBlockTheme);
    
    // Determine which theme to use
    // If a theme is explicitly selected, use it
    // If no theme selected (undefined/null), default to 'kore-default'
    const themeIdToUse = globalTheme.defaultBlockTheme || 'kore-default';
    const selectedTheme = getThemeById(themeIdToUse);
    
    if (selectedTheme) {
        const colorScheme = getThemeColorScheme('light', globalTheme.primaryColor);
        // Ensure readable text on header/footer: if bg is dark, use contrasting fg
        const isHex = (s: string) => /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(s);
        const headerBg = selectedTheme.header.bg;
        const headerFg = isHex(headerBg) && calculateLuminance(headerBg) < 0.5
          ? getContrastTextColor(headerBg)
          : selectedTheme.header.fg;
        const footerBg = selectedTheme.footer.bg;
        const footerFg = isHex(footerBg) && calculateLuminance(footerBg) < 0.5
          ? getContrastTextColor(footerBg)
          : selectedTheme.footer.fg;

        setEmailState(prevState => ({
          ...prevState,
          header: {
            ...applyThemeToHeader(prevState.header, colorScheme, globalTheme),
            backgroundColor: createColorToken(selectedTheme.header.bg),
            titleColor: createColorToken(headerFg),
            dateColor: createColorToken(headerFg),
          },
          content: prevState.content.map(block => {
            const newProps = applyGlobalThemeToBlock(block.props, globalTheme);
            return { ...block, props: newProps };
          }),
          footer: {
            ...applyThemeToFooter(prevState.footer, colorScheme, globalTheme),
            backgroundColor: createColorToken(selectedTheme.footer.bg),
            messageColor: createColorToken(footerFg),
            teamNameColor: createColorToken(footerFg),
            disclaimerColor: createColorToken(footerFg),
            linkColor: createColorToken(footerFg),
            ctaColor: globalTheme.primaryColor,
          },
        }));
      }
  }, [globalTheme]); // Run whenever globalTheme changes

  // Template switching handlers
  const handleTemplateChange = (value: string) => {
    if (hasUnsavedChanges) {
      setPendingTemplate(value);
      setShowTemplateSwitchDialog(true);
    } else {
      switchTemplate(value);
    }
  };

  const switchTemplate = (templateKey: string) => {
    setCurrentTemplate(templateKey);
    if (templateKey === 'custom') {
      setHasUnsavedChanges(true);
      return;
    }
    const template = starterTemplates[templateKey];
    if (template) {
      setEmailState(template);
      setSelectedBlockId(null);
      setHasUnsavedChanges(false);
      // Apply recommended theme for this template (BMAD Template Styling Strategy Phase 3)
      const recommendedThemeId = RECOMMENDED_THEME_BY_TEMPLATE[templateKey];
      if (recommendedThemeId) {
        setGlobalTheme(prev => ({ ...prev, defaultBlockTheme: recommendedThemeId }));
        const themeName = getThemeById(recommendedThemeId)?.name ?? recommendedThemeId;
        toast.success(`Switched to ${template.header.title}. Theme: ${themeName}.`);
      } else {
        toast.success(`Switched to ${template.header.title}`);
      }
    }
  };

  // When user edits content/header/footer, switch to Custom so we don't overwrite a preset
  const markAsCustom = useCallback(() => {
    setCurrentTemplate(prev => (prev === 'custom' ? prev : 'custom'));
  }, []);

  const confirmTemplateSwitch = () => {
    if (pendingTemplate) {
      switchTemplate(pendingTemplate);
      setPendingTemplate(null);
    }
    setShowTemplateSwitchDialog(false);
  };

  const cancelTemplateSwitch = () => {
    setPendingTemplate(null);
    setShowTemplateSwitchDialog(false);
  };

  const handleCopyEmail = async () => {
    // Show generating toast
    const generatingToast = toast.loading('Generating email HTML...');
    
    if (!emailSafeContainerRef.current) {
      toast.error('Email container not ready', { id: generatingToast });
      return;
    }

    // Get the container table (includes spacers + email content) from the hidden container
    const emailTable = emailSafeContainerRef.current.querySelector('table');
    if (!emailTable) {
      console.error('Email table not found in container');
      toast.error('Failed to generate email HTML', { id: generatingToast });
      return;
    }

    // Get the HTML string of the table
    let tableHTML = emailTable.outerHTML;
    
    // Debug: Log the HTML length to verify content
    console.log('Email HTML length:', tableHTML.length);
    
    // Clean up React-specific attributes
    tableHTML = tableHTML.replace(/\s*data-reactroot="[^"]*"/g, '');
    tableHTML = tableHTML.replace(/\s*data-react[^=]*="[^"]*"/g, '');
    
    // Wrap in complete email structure with proper background
    const completeEmailHTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Kore.ai Release Notes</title>
  <style type="text/css">
    /* Email client resets */
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0 !important; height: auto; line-height: 100%; outline: none; text-decoration: none !important; max-width: 100%; display: block; }
    
    /* Prevent WebKit and Windows mobile changing default text sizes */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    
    /* Remove spacing between tables */
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    
    /* Fix line-height on Outlook */
    table, td { line-height: 1.5; }
    
    /* Remove underline from images in some email clients */
    a img { border: none !important; text-decoration: none !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ECF0F5;">
  <!-- Full-width background table -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ECF0F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        ${tableHTML}
      </td>
    </tr>
  </table>
</body>
</html>`;

    let copySucceeded = false;

    try {
      // Try modern Clipboard API with HTML format
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          const htmlBlob = new Blob([completeEmailHTML], { type: 'text/html' });
          const textBlob = new Blob([completeEmailHTML], { type: 'text/plain' });
          
          const clipboardItem = new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
          });
          
          await navigator.clipboard.write([clipboardItem]);
          copySucceeded = true;
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast.success('Email HTML copied to clipboard!', { id: generatingToast });
          return; // Success, exit early
        } catch (clipboardError: any) {
          console.log('Modern clipboard API failed, trying fallback methods');
          // Fall through to legacy methods
        }
      }
      
      // Fallback 1: Try execCommand with contentEditable
      if (!copySucceeded) {
        const execCommandSuccess = copyAsFormattedHTML(completeEmailHTML);
        if (execCommandSuccess) {
          copySucceeded = true;
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast.success('Email HTML copied to clipboard!', { id: generatingToast });
          return;
        }
      }
      
      // Fallback 2: Use textarea method as last resort
      if (!copySucceeded) {
        const textareaSuccess = copyViaTextarea(completeEmailHTML);
        if (textareaSuccess) {
          copySucceeded = true;
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast.success('Email HTML copied to clipboard!', { id: generatingToast });
        } else {
          toast.error('Failed to copy HTML', { id: generatingToast });
        }
      }
      
    } catch (error) {
      console.error('Copy error:', error);
      // Silently fallback to textarea method if not already copied
      if (!copySucceeded) {
        const textareaSuccess = copyViaTextarea(completeEmailHTML);
        if (textareaSuccess) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast.success('Email HTML copied to clipboard!', { id: generatingToast });
        } else {
          toast.error('Failed to copy HTML', { id: generatingToast });
        }
      }
    }
  };

  const copyAsFormattedHTML = (html: string): boolean => {
    // Create a temporary container with the HTML
    const tempDiv = document.createElement('div');
    tempDiv.contentEditable = 'true';
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);
    
    try {
      // Select all content
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Copy with formatting
        const success = document.execCommand('copy');
        
        if (success) {
          // Don't show toast here - let the main function handle it
          return true;
        }
      }
      return false;
    } catch (error) {
      // Silently fail and return false to trigger next fallback
      return false;
    } finally {
      // Clean up
      if (window.getSelection()) {
        window.getSelection()?.removeAllRanges();
      }
      document.body.removeChild(tempDiv);
    }
  };

  const copyViaTextarea = (html: string): boolean => {
    // Create a temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = html;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      
      const success = document.execCommand('copy');
      
      // Don't show toast here - let the main function handle it
      return success;
    } catch (error) {
      // Final fallback failed silently - this is the last resort
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id as string;
    
    forensicDebugger.log('DRAG_START', 'handleDragStart', {
      activeId: id,
      isSidebarItem: id.startsWith('sidebar-'),
      blockType: id.startsWith('sidebar-') ? id.replace('sidebar-', '') : 'canvas-block',
    });
    
    setActiveId(id);
    
    forensicDebugger.log('STATE_CHANGE', 'setActiveId', {
      oldValue: null,
      newValue: id,
    });
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    const newOverId = over?.id as string || null;
    
    forensicDebugger.log('DRAG_OVER', 'handleDragOver', {
      overId: newOverId,
      overType: newOverId?.startsWith('drop-') ? 'drop-zone' : newOverId?.startsWith('sidebar-') ? 'sidebar' : 'canvas-block',
    });
    
    setOverId(newOverId);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    forensicDebugger.log('DRAG_END', 'handleDragEnd.START', {
      activeId: active.id,
      overId: over?.id,
      hasTarget: !!over,
    });
    
    setOverId(null);
    forensicDebugger.log('STATE_CHANGE', 'setOverId', { value: null });
    
    if (!over) {
      forensicDebugger.log('DRAG_END', 'handleDragEnd.CANCELLED', { reason: 'no-target' });
      console.log('Drop cancelled - no target');
      setActiveId(null);
      forensicDebugger.log('STATE_CHANGE', 'setActiveId', { value: null });
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    
    forensicDebugger.log('DRAG_END', 'handleDragEnd.PROCESS', {
      activeId,
      overId,
      isSidebarDrop: activeId.startsWith('sidebar-'),
      isReorder: !activeId.startsWith('sidebar-'),
    });

    // Handle dragging from sidebar
    if (activeId.startsWith('sidebar-')) {
      forensicDebugger.log('DRAG_END', 'handleDragEnd.SIDEBAR_DROP', { activeId, overId });
      
      // Keep DragOverlay visible during drop transition
      setIsDropping(true);
      forensicDebugger.log('STATE_CHANGE', 'setIsDropping', { value: true });
      
      const type = activeId.replace('sidebar-', '') as ContentBlockType;
      const newBlock = createDefaultBlock(type);
      const blockMeta = getBlockMetadata(type);
      
      forensicDebugger.log('DRAG_END', 'handleDragEnd.BLOCK_CREATED', {
        blockId: newBlock.id,
        blockType: type,
        blockName: blockMeta.name,
      });
      
      // Find the drop position
      if (overId.startsWith('drop-')) {
        const dropIndex = parseInt(overId.replace('drop-', ''));
        forensicDebugger.log('DRAG_END', 'handleDragEnd.DROP_ZONE', { dropIndex });
        setCurrentTemplate(prev => (prev === 'custom' ? prev : 'custom'));
        setEmailState(prevState => {
          const newContent = [...prevState.content];
          newContent.splice(dropIndex, 0, newBlock);
          
          forensicDebugger.log('DRAG_END', 'handleDragEnd.BEFORE_SET_STATE', {
            oldContentLength: prevState.content.length,
            newContentLength: newContent.length,
            insertIndex: dropIndex,
          });
          
          forensicDebugger.log('STATE_CHANGE', 'setEmailState', {
            action: 'ADD_BLOCK',
            blockId: newBlock.id,
            position: dropIndex,
            newContentLength: newContent.length,
          });
          
          return { ...prevState, content: newContent };
        });
        
        setSelectedBlockId(newBlock.id);
        setShowThemePanel(false);
        
        toast.success(`${blockMeta.name} added`);
        
        forensicDebugger.log('DRAG_END', 'handleDragEnd.SCHEDULING_CLEANUP', {
          delay: 200,
          blockId: newBlock.id,
        });
        
        setTimeout(() => {
          forensicDebugger.log('DRAG_END', 'handleDragEnd.CLEANUP_TIMEOUT_FIRED', { delay: 200 });
          setActiveId(null);
          forensicDebugger.log('STATE_CHANGE', 'setActiveId', { value: null });
          setIsDropping(false);
          forensicDebugger.log('STATE_CHANGE', 'setIsDropping', { value: false });
        }, 200);
        
        // Auto-scroll to newly added block
        setTimeout(() => {
          const blockElement = document.querySelector(`[data-block-id="${newBlock.id}"]`);
          if (blockElement) {
            blockElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      } else {
        // Dropped on an existing block - add after it
        setCurrentTemplate(prev => (prev === 'custom' ? prev : 'custom'));
        setEmailState(prevState => {
          const targetIndex = prevState.content.findIndex(b => b.id === overId);
          if (targetIndex !== -1) {
            const newContent = [...prevState.content];
            newContent.splice(targetIndex + 1, 0, newBlock);
            return { ...prevState, content: newContent };
          }
          return prevState;
        });
        
        setSelectedBlockId(newBlock.id);
        setShowThemePanel(false);
        toast.success(`${blockMeta.name} added`);
        
        setTimeout(() => {
          setActiveId(null);
          setIsDropping(false);
        }, 200);
        
        setTimeout(() => {
            const blockElement = document.querySelector(`[data-block-id="${newBlock.id}"]`);
            if (blockElement) {
              blockElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }
          }, 100);
      }
      return;
    }

    setActiveId(null);

    // Handle reordering existing blocks
    if (!overId.startsWith('drop-')) {
      // Dropped on another block - swap positions
      setCurrentTemplate(prev => (prev === 'custom' ? prev : 'custom'));
      setEmailState(prevState => {
        const oldIndex = prevState.content.findIndex(b => b.id === activeId);
        const targetIndex = prevState.content.findIndex(b => b.id === overId);
        
        if (oldIndex === -1 || targetIndex === -1) return prevState;
        if (oldIndex === targetIndex) return prevState; // Same position, do nothing
        
        const newContent = arrayMove(prevState.content, oldIndex, targetIndex);
        return { ...prevState, content: newContent };
      });
      return;
    }

    // Reorder: dropped on drop-zone
    setCurrentTemplate(prev => (prev === 'custom' ? prev : 'custom'));
    setEmailState(prevState => {
      const oldIndex = prevState.content.findIndex(b => b.id === activeId);
      const dropIndex = parseInt(overId.replace('drop-', ''));
      
      if (oldIndex === -1) return prevState;

      const newContent = [...prevState.content];
      const [removed] = newContent.splice(oldIndex, 1);
      newContent.splice(dropIndex > oldIndex ? dropIndex - 1 : dropIndex, 0, removed);
      
      return { ...prevState, content: newContent };
    });
  }, [globalTheme.defaultBlockTheme]); // Only dependency needed

  const createDefaultBlock = (type: ContentBlockType): ContentBlock => {
    const id = `block-${Date.now()}`;
    
    // Apply default theme from global settings if set
    const defaultTheme = globalTheme.defaultBlockTheme;
    
    const defaults: Record<ContentBlockType, any> = {
      'feature-screenshot': {
        title: 'New Feature',
        description: 'Feature description',
        screenshotAlt: 'Feature screenshot',
        bullets: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
        ctaText: 'Learn more',
        ctaLink: 'https://kore.ai/docs'
      },
      'image-content': {
        title: 'Feature Title',
        description: 'Feature description goes here. This layout puts image and content side-by-side.',
        imageAlt: 'Feature image',
        imagePosition: 'left',
        imageWidth: 40,
        bullets: ['Key benefit 1', 'Key benefit 2', 'Key benefit 3'],
        ctaText: 'Learn More',
        ctaLink: 'https://kore.ai/docs'
      },
      'feature-list': {
        title: 'Key Features',
        description: 'Feature description',
        bullets: ['Feature 1', 'Feature 2', 'Feature 3'],
        ctaText: 'Learn more',
        ctaLink: 'https://kore.ai/docs'
      },
      'text-only': {
        title: 'Heading',
        description: 'Your content here.',
        ctaText: 'Learn more',
        ctaLink: 'https://kore.ai/docs'
      },
      'multi-update': {
        title: 'What\'s New',
        updates: [
          {
            title: 'New Feature Update',
            description: 'Description of this update and its benefits.',
            ctaText: 'Learn more',
            ctaLink: 'https://kore.ai/docs'
          },
          {
            title: 'Enhancement Update',
            description: 'Description of this enhancement and its impact.',
            ctaText: 'View details',
            ctaLink: 'https://kore.ai/docs'
          }
        ]
      },
      'item-grid': {
        title: 'Features',
        description: 'Grid description',
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
        ctaText: 'Learn more',
        ctaLink: 'https://kore.ai/docs'
      },
      'warning': {
        title: 'Important Notice',
        message: 'This is an important message that requires your attention.',
        alertType: 'warning',
        ctaText: 'Learn more',
        ctaLink: 'https://kore.ai/docs'
      },
      'code-snippet': {
        title: 'Code Example',
        code: 'const example = "Hello World";\nconsole.log(example);',
        language: 'javascript'
      },
      'two-column': {
        leftColumn: {
          title: 'Before',
          description: 'Description of the before state.'
        },
        rightColumn: {
          title: 'After',
          description: 'Description of the after state.'
        }
      },
      'video-block': {
        title: 'Watch the Demo',
        description: 'Learn how to use this feature in our video tutorial.',
        duration: '2:30'
      },
      'stats-metrics': {
        title: 'Key Metrics',
        stats: [
          { value: '99.9%', label: 'Uptime' },
          { value: '2x', label: 'Faster' },
          { value: '500+', label: 'Users' }
        ]
      },
      'timeline': {
        items: [
          {
            date: 'Q1 2025',
            title: 'Launch',
            description: 'Initial product release'
          },
          {
            date: 'Q2 2025',
            title: 'Enhancement',
            description: 'New features added'
          }
        ]
      },
      'divider': {},
      'hero': {}
    };
    
    // ✅ USE CENTRALIZED BLOCK_DEFAULTS - Single Source of Truth!
    const blockDefaultsMap: Record<ContentBlockType, keyof typeof BLOCK_DEFAULTS> = {
      'feature-screenshot': 'feature-screenshot',
      'image-content': 'image-content',
      'feature-list': 'feature-list',
      'text-only': 'text-only',
      'multi-update': 'multi-update',
      'item-grid': 'item-grid',
      'warning': 'warning',
      'code-snippet': 'code-snippet',
      'two-column': 'two-column',
      'video-block': 'video',
      'stats-metrics': 'stats-metrics',
      'timeline': 'timeline',
      'divider': 'divider',
      'hero': 'hero'
    };
    
    const blockDefaultsKey = blockDefaultsMap[type];
    const baseDefaults = BLOCK_DEFAULTS[blockDefaultsKey];

    return {
      id,
      type,
      props: {
        ...baseDefaults,  // ✅ Complete defaults from centralized system
        ...defaults[type],  // Override with user-friendly content
        // Apply default theme if set in global settings
        ...(defaultTheme ? { theme: defaultTheme } : {})
      }
    };
  };

  const removeContentBlock = useCallback((id: string) => {
    setCurrentTemplate(prev => (prev === 'custom' ? prev : 'custom'));
    setEmailState(prevState => ({
      ...prevState,
      content: prevState.content.filter(b => b.id !== id)
    }));
    setSelectedBlockId(prevId => prevId === id ? null : prevId);
  }, []);

  const updateContentBlock = useCallback((updatedBlock: ContentBlock) => {
    setCurrentTemplate(prev => (prev === 'custom' ? prev : 'custom'));
    setEmailState(prevState => ({
      ...prevState,
      content: prevState.content.map(b => b.id === updatedBlock.id ? updatedBlock : b)
    }));
  }, []);

  const updateBlockProps = useCallback((id: string, props: any) => {
    setEmailState(prevState => ({
      ...prevState,
      content: prevState.content.map(b => 
        b.id === id ? { ...b, props: { ...b.props, ...props } } : b
      )
    }));
  }, []);

  const handleApplyGlobalDefaults = () => {
    const { getGlobalDefaults, applyDefaultsToBlock } = require('./lib/global-defaults');
    const defaults = getGlobalDefaults();
    
    setEmailState({
      ...emailState,
      content: emailState.content.map(block => ({
        ...block,
        props: applyDefaultsToBlock(block.props, defaults)
      }))
    });
  };

  // Compute CTA border radius from button style
  const ctaBorderRadius = useMemo(
    () => BUTTON_STYLES[globalTheme.buttonStyle],
    [globalTheme.buttonStyle]
  );

  const renderContentBlock = (block: ContentBlock, isEmailMode: boolean = false, showCardStyle: boolean = false) => {
    // Use block's theme if set, otherwise fall back to global default theme
    const effectiveTheme = block.props.theme || globalTheme.defaultBlockTheme;
    const blockPropsWithTheme = { ...block.props, theme: effectiveTheme };
    
    switch (block.type) {
      case 'feature-screenshot':
        return <FeatureWithScreenshot {...blockPropsWithTheme} ctaBorderRadius={ctaBorderRadius} isEmailMode={isEmailMode} showCardStyle={showCardStyle} />;
      case 'image-content':
        return <ImageContentBlock {...blockPropsWithTheme} ctaBorderRadius={ctaBorderRadius} isEmailMode={isEmailMode} />;
      case 'feature-list':
        return <FeatureList {...blockPropsWithTheme} ctaBorderRadius={ctaBorderRadius} isEmailMode={isEmailMode} showCardStyle={showCardStyle} />;
      case 'text-only':
        return <TextOnlyBlock {...blockPropsWithTheme} ctaBorderRadius={ctaBorderRadius} isEmailMode={isEmailMode} showCardStyle={showCardStyle} />;
      case 'multi-update':
        return <MultiUpdate {...blockPropsWithTheme} isEmailMode={isEmailMode} showCardStyle={showCardStyle} />;
      case 'item-grid':
        return <ItemGrid {...blockPropsWithTheme} ctaBorderRadius={ctaBorderRadius} isEmailMode={isEmailMode} showCardStyle={showCardStyle} />;
      case 'warning':
        return <WarningBlock {...blockPropsWithTheme} ctaBorderRadius={ctaBorderRadius} isEmailMode={isEmailMode} showCardStyle={showCardStyle} />;
      case 'code-snippet':
        return <CodeSnippet {...blockPropsWithTheme} isEmailMode={isEmailMode} />;
      case 'two-column':
        return <TwoColumnFeature {...blockPropsWithTheme} isEmailMode={isEmailMode} />;
      case 'video-block':
        return <VideoBlock {...blockPropsWithTheme} isEmailMode={isEmailMode} />;
      case 'stats-metrics':
        return <StatsMetrics {...blockPropsWithTheme} isEmailMode={isEmailMode} />;
      case 'timeline':
        return <Timeline {...blockPropsWithTheme} isEmailMode={isEmailMode} />;
      case 'divider':
        return <DividerBlock {...blockPropsWithTheme} isEmailMode={isEmailMode} />;
      case 'hero':
        return <HeroBlock {...blockPropsWithTheme} isEmailMode={isEmailMode} />;
      case 'changelog':
        return <ChangelogBlock {...block.props} isEmailMode={isEmailMode} />;
      case 'deprecation':
        return <DeprecationBlock {...block.props} isEmailMode={isEmailMode} />;
      case 'metrics-snapshot':
        return <MetricsBlock {...block.props} isEmailMode={isEmailMode} />;
      case 'nps-rating':
        return <NpsBlock {...block.props} isEmailMode={isEmailMode} />;
      default:
        return null;
    }
  };

  const selectedBlock = useMemo(
    () => selectedBlockId 
      ? emailState.content.find(b => b.id === selectedBlockId) || null
      : null,
    [selectedBlockId, emailState.content]
  );

  // Calculate color scheme for theme-aware rendering (always use light mode)
  const colorScheme = useMemo(
    () => getThemeColorScheme('light', globalTheme.primaryColor),
    [globalTheme.primaryColor]
  );

  // Email layout style (Copenhagen, New York, Oslo) – wrapper spacing, radius, border
  const wrapperStyles = useMemo(
    () => getEmailWrapperStyles(globalTheme),
    [globalTheme.emailLayoutStyle]
  );

  // Preview: Copenhagen keeps top/bottom padding, no horizontal gap, no inner border
  const previewFrame = useMemo(() => {
    const isCopenhagen = (globalTheme.emailLayoutStyle ?? 'copenhagen') === 'copenhagen';
    return {
      padding: isCopenhagen
        ? `${wrapperStyles.outerPaddingTop} 0`
        : `${wrapperStyles.outerPaddingTop} ${wrapperStyles.outerPaddingSides}`,
      border: isCopenhagen ? '0 solid transparent' : wrapperStyles.innerBorder,
      borderWidth: isCopenhagen ? 0 : undefined,
      isCopenhagen,
    };
  }, [globalTheme.emailLayoutStyle, wrapperStyles.outerPaddingTop, wrapperStyles.outerPaddingSides, wrapperStyles.innerBorder]);

  // Generated email HTML for HTML tab (from lib/html-generator)
  const generatedEmailHTML = useMemo(
    () => generateEmailHTML(emailState, globalTheme),
    [emailState, globalTheme]
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className="h-screen flex flex-col" 
        style={{
          backgroundColor: '#ECF0F5'
        }}
      >
      
      {/* Header - Refined with better spacing */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 h-[72px]">
          {/* Left Section: Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-auto">
              <KoreLogo />
            </div>
            <Separator orientation="vertical" className="h-8" />
            <h1 className="font-bold tracking-tight">Email Builder</h1>
          </div>

          {/* Center Section: Mode Toggle */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'build' | 'preview' | 'code')}>
            <TabsList className="shadow-sm">
              <TabsTrigger value="build" className="gap-1.5 min-w-[100px] data-[state=active]:ring-1 data-[state=active]:ring-border" title="Design and edit your email">
                <Wrench className="w-4 h-4 shrink-0" />
                Build
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-1.5 min-w-[100px] data-[state=active]:ring-1 data-[state=active]:ring-border" title="See how your email will look">
                <Eye className="w-4 h-4 shrink-0" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5 min-w-[100px] data-[state=active]:ring-1 data-[state=active]:ring-border" title="View and copy the email HTML code">
                <Code className="w-4 h-4 shrink-0" />
                HTML
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select 
                    value={currentTemplate in TEMPLATE_LABELS ? currentTemplate : 'custom'}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger className="h-9 w-52 border-border/60">
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blank">{TEMPLATE_LABELS.blank}</SelectItem>
                      <SelectItem value="release-notes">{TEMPLATE_LABELS['release-notes']}</SelectItem>
                      <SelectItem value="major-feature">{TEMPLATE_LABELS['major-feature']}</SelectItem>
                      <SelectItem value="premium-showcase">{TEMPLATE_LABELS['premium-showcase']}</SelectItem>
                      <SelectItem value="newsletter">{TEMPLATE_LABELS.newsletter}</SelectItem>
                      <SelectItem value="product-update">{TEMPLATE_LABELS['product-update']}</SelectItem>
                      <SelectItem value="custom">{TEMPLATE_LABELS.custom}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose a template to start with</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Theme Settings Toggle - Available in both Build and Preview modes */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showThemePanel ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    setShowThemePanel(!showThemePanel);
                    // Close theme panel deselects any selected block
                    if (!showThemePanel && selectedBlockId) {
                      setSelectedBlockId(null);
                    }
                  }}
                  className="transition-all hover:scale-105 active:scale-95"
                >
                  <Settings className="w-4 h-4 transition-transform" style={{ transform: showThemePanel ? 'rotate(45deg)' : 'rotate(0deg)' }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Global theme settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="flex-1 flex overflow-hidden"
          style={{
            backgroundColor: '#ECF0F5'
          }}
        >
        
        {/* Left Sidebar - Block Library (Build Mode Only). Single container with animated width to avoid content jerk. */}
        {mode === 'build' && (
          <motion.div
            className="border-r bg-card flex flex-col h-full overflow-hidden shrink-0"
            animate={{ width: leftPanelCollapsed ? 64 : 280 }}
            initial={false}
            transition={prefersReducedMotion() ? { duration: 0 } : panelWidthTransition}
          >
            {leftPanelCollapsed ? (
              <div className="w-16 h-full flex flex-col items-center py-4 overflow-hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLeftPanelCollapsed(false)}
                      className="w-11 h-11 p-0 mb-4 hover:bg-muted/80 transition-all hover:scale-105 active:scale-95"
                    >
                      <PanelRight className="w-[18px] h-[18px]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Expand Content Blocks</p>
                  </TooltipContent>
                </Tooltip>
                <Separator className="mb-4" />
                <div className="flex-1 overflow-hidden w-full">
                  <ScrollArea className="h-full">
                    <div className="px-2.5 space-y-2 flex flex-col items-center">
                      {contentBlockLibrary.map((block) => (
                        <CompactDraggableBlockLibraryItem
                          key={block.type}
                          type={block.type}
                          name={block.name}
                          icon={block.icon}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <aside className="w-[280px] h-full flex flex-col overflow-hidden">
                <PanelHeader
                  title="Content Blocks"
                  description="Drag blocks to add them"
                  className="border-b bg-muted/20"
                  action={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLeftPanelCollapsed(true)}
                          className="h-8 w-8 p-0 transition-all hover:scale-110 active:scale-90"
                        >
                          <PanelLeftClose className={iconSizes.sm} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Collapse panel</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                />
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-2.5">
                      {contentBlockLibrary.map((block) => (
                        <DraggableBlockLibraryItem
                          key={block.type}
                          type={block.type}
                          name={block.name}
                          icon={block.icon}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </aside>
            )}
          </motion.div>
        )}

          {/* Main Canvas Area - layout animation in build mode only so mode switch doesn't show slow resize + dark ring */}
          <motion.main
            layout={mode === 'build'}
            transition={mode === 'preview' || prefersReducedMotion() ? { duration: 0 } : panelWidthTransition}
            className="flex-1 min-w-0 overflow-hidden transition-colors"
            style={{
              backgroundColor: mode === 'preview' ? '#f3f4f6' : '#ECF0F5',
              backgroundImage: 'none'
            }}
          >
            <ScrollArea 
              className="h-full"
              style={{
                backgroundColor: mode === 'preview' ? '#f3f4f6' : '#ECF0F5',
                backgroundImage: 'none'
              }}
              viewportStyle={{
                backgroundColor: mode === 'preview' ? '#f3f4f6' : '#ECF0F5',
                backgroundImage: 'none',
                ...(mode === 'preview' && { padding: 0, margin: 0, border: 0, boxSizing: 'border-box' }),
              }}
            >
              <div 
                className={mode === 'code' ? 'h-full min-h-0 w-full py-4 flex flex-col overflow-hidden' : mode === 'preview' ? 'min-h-full w-full py-8' : 'py-16 px-8 h-full'}
                style={{
                  backgroundColor: mode === 'preview' ? '#f3f4f6' : '#ECF0F5',
                  backgroundImage: 'none',
                  ...(mode === 'preview' && { paddingLeft: 0, paddingRight: 0, boxSizing: 'border-box' }),
                }}
              >
                {mode === 'code' ? (
                  <div className="max-w-4xl mx-auto w-full flex-1 min-h-0 h-0 flex flex-col overflow-hidden">
                    <CodeViewer code={generatedEmailHTML} />
                  </div>
                ) : (
                <>
                  {mode === 'build' ? (
                  <div className="max-w-[660px] mx-auto">
                    <div ref={emailContainerRef} className="mode-transition-enter">
                      {/* Build Mode - Column width = email width so no side gap; div-based structure for drag and drop */}
                      <div style={{ maxWidth: globalTheme.emailWidth, margin: '0 auto' }}>
                        {/* Header Card – radius from email layout style; no border/gap in build so Copenhagen frame is clean */}
                        <Card 
                          onClick={() => {
                            setSelectedBlockId('header');
                            setShowThemePanel(false); // Auto-close theme panel
                          }}
                          style={{ borderRadius: wrapperStyles.innerBorderRadius }}
                          className={cn(
                            "cursor-pointer border-0",
                            selectedBlockId === 'header' && 'ring-2 ring-black/20 ring-offset-2'
                          )}
                        >
                          <CardHeader className={cn(
                            "flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b transition-all duration-200",
                            selectedBlockId === 'header' ? 'border-black/20 bg-black/[0.02]' : 'border-border/40'
                          )}>
                            <span className={cn(
                              "text-sm font-medium transition-colors",
                              selectedBlockId === 'header' ? 'text-black' : 'text-muted-foreground'
                            )}>
                              Header
                            </span>
                          </CardHeader>
                          <CardContent className="py-5 px-0">
                            <EmailTemplate 
                              mode="build"
                              emailBackground={colorScheme.emailBackground}
                              borderColor={colorScheme.border}
                              emailWidth={globalTheme.emailWidth}
                              innerBorderRadius={wrapperStyles.innerBorderRadius}
                              innerBorder={wrapperStyles.innerBorder}
                            >
                              <HeaderBlock 
                                title={emailState.header.title}
                                date={emailState.header.date}
                                showDate={emailState.header.showDate}
                                showPattern={false}
                                productName={emailState.header.productName}
                                showProductName={emailState.header.showProductName}
                                productNameFontSize={emailState.header.productNameFontSize}
                                categoryBadge={emailState.header.categoryBadge}
                                versionText={emailState.header.versionText}
                                versionBadgeStyle={emailState.header.versionBadgeStyle}
                                showCardStyle={true}
                                showLogo={emailState.header.showLogo}
                                logoSrc={emailState.header.logoSrc || globalTheme.defaultLogoUrl}
                                logoSize={emailState.header.logoSize || globalTheme.defaultLogoSize}
                                logoCustomWidth={emailState.header.logoCustomWidth}
                                logoWidth={emailState.header.logoWidth}
                                contentAlignment={emailState.header.contentAlignment}
                                backgroundColor={emailState.header.backgroundColor}
                                titleColor={emailState.header.titleColor}
                                titleFontSize={emailState.header.titleFontSize}
                                dateColor={emailState.header.dateColor}
                                dateFontSize={emailState.header.dateFontSize}
                                padding={emailState.header.padding}
                                {...(emailState.header.paddingTop !== undefined && { paddingTop: emailState.header.paddingTop })}
                                {...(emailState.header.paddingBottom !== undefined && { paddingBottom: emailState.header.paddingBottom })}
                                {...(emailState.header.paddingLeft !== undefined && { paddingLeft: emailState.header.paddingLeft })}
                                {...(emailState.header.paddingRight !== undefined && { paddingRight: emailState.header.paddingRight })}
                                theme={emailState.header.theme || globalTheme.defaultBlockTheme}
                              />
                            </EmailTemplate>
                          </CardContent>
                        </Card>

                        {/* Content Blocks */}
                        {emailState.content.length === 0 ? (
                          <>
                            <DropIndicator id="drop-0" isOver={overId === 'drop-0'} />
                            <div className={cn(
                              "transition-all",
                              overId === 'drop-0' && 'ring-2 ring-black/20 ring-offset-2'
                            )}>
                              <EmptyState
                                icon={Mail}
                                title="No content blocks yet"
                                description="Drag blocks from the sidebar to start building your email"
                              >
                                {overId === 'drop-0' && (
                                  <Alert className="mt-4 bg-black/5 border-black/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Ready to add</AlertTitle>
                                    <AlertDescription>
                                      Release to add this block to your email
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </EmptyState>
                            </div>
                          </>
                        ) : (
                          <SortableContext
                            items={emailState.content.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-0">
                              <DropIndicator id="drop-0" isOver={overId === 'drop-0'} />
                              {emailState.content.map((block, index) => (
                                <React.Fragment key={block.id}>
                                  <SortableBlock
                                  block={block}
                                  isSelected={selectedBlockId === block.id}
                                  cardBorderRadius={wrapperStyles.innerBorderRadius}
                                  onSelect={() => {
                                    setSelectedBlockId(block.id);
                                    setShowThemePanel(false); // Auto-close theme panel
                                  }}
                                  onRemove={() => removeContentBlock(block.id)}
                                  onUpdateProps={(props) => updateBlockProps(block.id, props)}
                                >
                                  <EmailTemplate 
                                      mode="build"
                                      emailBackground={colorScheme.emailBackground}
                                      borderColor={colorScheme.border}
                                      emailWidth={globalTheme.emailWidth}
                                      innerBorderRadius={wrapperStyles.innerBorderRadius}
                                      innerBorder={wrapperStyles.innerBorder}
                                    >
                                      {renderContentBlock(block, false, true)}
                                    </EmailTemplate>
                                  </SortableBlock>
                                  <DropIndicator 
                                    id={`drop-${index + 1}`} 
                                    isOver={overId === `drop-${index + 1}`} 
                                  />
                                </React.Fragment>
                              ))}
                            </div>
                          </SortableContext>
                        )}

                        {/* Footer Card – radius from email layout style; no border/gap in build */}
                        <Card 
                          onClick={() => {
                            setSelectedBlockId('footer');
                            setShowThemePanel(false); // Auto-close theme panel
                          }}
                          style={{ borderRadius: wrapperStyles.innerBorderRadius }}
                          className={cn(
                            "cursor-pointer border-0",
                            selectedBlockId === 'footer' && 'ring-2 ring-black/20 ring-offset-2'
                          )}
                        >
                          <CardHeader className={cn(
                            "flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b transition-all duration-200",
                            selectedBlockId === 'footer' ? 'border-black/20 bg-black/[0.02]' : 'border-border/40'
                          )}>
                            <span className={cn(
                              "text-sm font-medium transition-colors",
                              selectedBlockId === 'footer' ? 'text-black' : 'text-muted-foreground'
                            )}>
                              Footer
                            </span>
                          </CardHeader>
                          <CardContent className="py-5 px-0">
                            <EmailTemplate 
                              mode="build"
                              emailBackground={colorScheme.emailBackground}
                              borderColor={colorScheme.border}
                              emailWidth={globalTheme.emailWidth}
                              innerBorderRadius={wrapperStyles.innerBorderRadius}
                              innerBorder={wrapperStyles.innerBorder}
                            >
                              {(emailState.footer.showFooter ?? true) && (
                                <ContactFooterBlock 
                                  message={emailState.footer.message}
                                  teamName={emailState.footer.teamName}
                                  email={emailState.footer.email}
                                  website={emailState.footer.website}
                                  disclaimer={emailState.footer.disclaimer}
                                  showPattern={false}
                                  showCardStyle={true}
                                  showLogo={!!(emailState.footer.logoSrc || globalTheme.defaultLogoUrl) && emailState.footer.showLogo !== false}
                                  logoSrc={emailState.footer.logoSrc || globalTheme.defaultLogoUrl}
                                  logoSize={emailState.footer.logoSize || (globalTheme.defaultLogoSize === 'xl' ? 'lg' : globalTheme.defaultLogoSize)}
                                  contentAlignment={emailState.footer.contentAlignment}
                                  backgroundColor={emailState.footer.backgroundColor}
                                  messageColor={emailState.footer.messageColor}
                                  messageFontSize={emailState.footer.messageFontSize}
                                  teamNameColor={emailState.footer.teamNameColor}
                                  teamNameFontSize={emailState.footer.teamNameFontSize}
                                  linkColor={emailState.footer.linkColor}
                                  disclaimerColor={emailState.footer.disclaimerColor}
                                  disclaimerFontSize={emailState.footer.disclaimerFontSize}
                                  padding={emailState.footer.padding}
                                  {...(emailState.footer.paddingTop !== undefined && { paddingTop: emailState.footer.paddingTop })}
                                  {...(emailState.footer.paddingBottom !== undefined && { paddingBottom: emailState.footer.paddingBottom })}
                                  {...(emailState.footer.paddingLeft !== undefined && { paddingLeft: emailState.footer.paddingLeft })}
                                  {...(emailState.footer.paddingRight !== undefined && { paddingRight: emailState.footer.paddingRight })}
                                  theme={emailState.footer.theme || globalTheme.defaultBlockTheme}
                                />
                              )}
                            </EmailTemplate>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                  ) : (
                      // Preview Mode – layout padding (top/bottom kept); inner div overflow hidden so table can cover 1px gap
                      <div
                        ref={emailContainerRef}
                        className="mode-transition-enter"
                        style={{
                          width: '100%',
                          minHeight: '100%',
                          backgroundColor: '#f3f4f6',
                          padding: previewFrame.padding,
                          boxSizing: 'border-box',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: globalTheme.emailWidth,
                            margin: '0 auto',
                            width: '100%',
                            backgroundColor: '#ffffff',
                            border: previewFrame.border,
                            ...(previewFrame.borderWidth === 0 && {
                              borderWidth: 0,
                              borderLeftWidth: 0,
                              borderRightWidth: 0,
                              outline: 'none',
                            }),
                            borderRadius: wrapperStyles.innerBorderRadius,
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                          }}
                        >
                          <EmailTemplate 
                            mode="preview"
                            emailBackground="#ffffff"
                            borderColor={colorScheme.border}
                            emailWidth={globalTheme.emailWidth}
                            innerBorderRadius={wrapperStyles.innerBorderRadius}
                            innerBorder="none"
                          >
                          <HeaderBlock 
                            title={emailState.header.title}
                            date={emailState.header.date}
                            showDate={emailState.header.showDate}
                            showPattern={false}
                            productName={emailState.header.productName}
                            showProductName={emailState.header.showProductName}
                            productNameFontSize={emailState.header.productNameFontSize}
                            categoryBadge={emailState.header.categoryBadge}
                            versionText={emailState.header.versionText}
                            versionBadgeStyle={emailState.header.versionBadgeStyle}
                            showCardStyle={false}
                            showLogo={emailState.header.showLogo}
                            logoSrc={emailState.header.logoSrc || globalTheme.defaultLogoUrl}
                            logoSize={emailState.header.logoSize || globalTheme.defaultLogoSize}
                            logoCustomWidth={emailState.header.logoCustomWidth}
                            logoWidth={emailState.header.logoWidth}
                            contentAlignment={emailState.header.contentAlignment}
                            backgroundColor={emailState.header.backgroundColor}
                            titleColor={emailState.header.titleColor}
                            titleFontSize={emailState.header.titleFontSize}
                            dateColor={emailState.header.dateColor}
                            dateFontSize={emailState.header.dateFontSize}
                            padding={emailState.header.padding}
                            {...(emailState.header.paddingTop !== undefined && { paddingTop: emailState.header.paddingTop })}
                            {...(emailState.header.paddingBottom !== undefined && { paddingBottom: emailState.header.paddingBottom })}
                            {...(emailState.header.paddingLeft !== undefined && { paddingLeft: emailState.header.paddingLeft })}
                            {...(emailState.header.paddingRight !== undefined && { paddingRight: emailState.header.paddingRight })}
                            theme={emailState.header.theme || globalTheme.defaultBlockTheme}
                          />
                          
                          {emailState.content.map((block, index) => (
                            <React.Fragment key={block.id}>
                              {renderContentBlock(block, false, false)}
                            </React.Fragment>
                          ))}
                          
                          {(emailState.footer.showFooter ?? true) && (
                            <ContactFooterBlock 
                              message={emailState.footer.message}
                              teamName={emailState.footer.teamName}
                              email={emailState.footer.email}
                              website={emailState.footer.website}
                              disclaimer={emailState.footer.disclaimer}
                              showPattern={false}
                              showCardStyle={false}
                              showLogo={!!(emailState.footer.logoSrc || globalTheme.defaultLogoUrl) && emailState.footer.showLogo !== false}
                              logoSrc={emailState.footer.logoSrc || globalTheme.defaultLogoUrl}
                              logoSize={emailState.footer.logoSize || (globalTheme.defaultLogoSize === 'xl' ? 'lg' : globalTheme.defaultLogoSize)}
                              contentAlignment={emailState.footer.contentAlignment}
                              backgroundColor={emailState.footer.backgroundColor}
                              messageColor={emailState.footer.messageColor}
                              messageFontSize={emailState.footer.messageFontSize}
                              teamNameColor={emailState.footer.teamNameColor}
                              teamNameFontSize={emailState.footer.teamNameFontSize}
                              linkColor={emailState.footer.linkColor}
                              disclaimerColor={emailState.footer.disclaimerColor}
                              disclaimerFontSize={emailState.footer.disclaimerFontSize}
                              padding={emailState.footer.padding}
                              {...(emailState.footer.paddingTop !== undefined && { paddingTop: emailState.footer.paddingTop })}
                              {...(emailState.footer.paddingBottom !== undefined && { paddingBottom: emailState.footer.paddingBottom })}
                              {...(emailState.footer.paddingLeft !== undefined && { paddingLeft: emailState.footer.paddingLeft })}
                              {...(emailState.footer.paddingRight !== undefined && { paddingRight: emailState.footer.paddingRight })}
                              theme={emailState.footer.theme || globalTheme.defaultBlockTheme}
                            />
                          )}
                          </EmailTemplate>
                        </div>
                      </div>
                  )}
                </>
                )}
              </div>
            </ScrollArea>
          </motion.main>

        {/* Right Panel - Single container with animated width to avoid content jerk. Rendered in preview too (width 0 when theme closed) so close animates smoothly. */}
        {(mode === 'build' || mode === 'preview') && (
          <motion.div
            className="border-l bg-card flex flex-col h-full overflow-hidden shrink-0"
            animate={{
              width: mode === 'build'
                ? (rightPanelCollapsed ? 48 : (showThemePanel || selectedBlockId) ? 384 : 0)
                : (showThemePanel ? 384 : 0),
            }}
            initial={false}
            transition={prefersReducedMotion() ? { duration: 0 } : panelWidthTransition}
          >
            {(mode === 'build' && rightPanelCollapsed) ? (
              <div className="w-12 h-full flex flex-col items-center py-4 overflow-hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRightPanelCollapsed(false)}
                      className="w-9 h-9 p-0 transition-all hover:scale-110 active:scale-90"
                    >
                      <PanelLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{showThemePanel ? "Expand Theme Settings" : selectedBlockId ? "Expand Properties Panel" : "Expand Panel"}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex-1 flex items-center justify-center">
                  <div className="writing-mode-vertical text-xs text-muted-foreground font-medium select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    {showThemePanel ? 'THEME SETTINGS' : selectedBlockId ? 'PROPERTIES' : 'PANEL'}
                  </div>
                </div>
              </div>
            ) : (showThemePanel || selectedBlockId) ? (
              <AnimatePresence mode="wait">
                {showThemePanel ? (
                  <motion.div
                    key="right-theme"
                    className="min-w-[384px] h-full flex flex-col"
                    initial={prefersReducedMotion() ? panelContentSwitchVariants.animate : panelContentSwitchVariants.initial}
                    animate={panelContentSwitchVariants.animate}
                    exit={prefersReducedMotion() ? panelContentSwitchVariants.animate : panelContentSwitchVariants.exit}
                    transition={springs.gentle}
                  >
                    <ThemeSettingsPanel
                      globalTheme={globalTheme}
                      onThemeChange={setGlobalTheme}
                      onClose={() => setShowThemePanel(false)}
                    />
                  </motion.div>
                ) : selectedBlockId ? (
                  <motion.div
                    key="right-properties"
                    className="min-w-[384px] h-full flex flex-col"
                    initial={prefersReducedMotion() ? panelContentSwitchVariants.animate : panelContentSwitchVariants.initial}
                    animate={panelContentSwitchVariants.animate}
                    exit={prefersReducedMotion() ? panelContentSwitchVariants.animate : panelContentSwitchVariants.exit}
                    transition={springs.gentle}
                  >
                    <PropertiesPanel
                      selectedId={selectedBlockId}
                      block={selectedBlock}
                      header={emailState.header}
                      footer={emailState.footer}
                      onBlockChange={updateContentBlock}
                      onHeaderChange={(header) => { markAsCustom(); setEmailState(prev => ({ ...prev, header })); }}
                      onFooterChange={(footer) => { markAsCustom(); setEmailState(prev => ({ ...prev, footer })); }}
                      onClose={() => setSelectedBlockId(null)}
                      onApplyGlobalDefaults={handleApplyGlobalDefaults}
                      globalDefaultTheme={globalTheme.defaultBlockTheme}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            ) : null}
          </motion.div>
        )}

        </div>

      <DragOverlay>
        {activeId && activeId.startsWith('sidebar-') ? (
          <DragOverlayContent key={activeId} activeId={activeId} />
        ) : null}
      </DragOverlay>
      </DndContext>

      {/* Floating Copy Button - Preview only (HTML tab has its own copy icon in the card header) */}
      {mode === 'preview' && (
        <div className={cn(
          "fixed bottom-8 transition-all duration-200",
          showThemePanel ? "right-[352px]" : "right-8"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleCopyEmail}
                className="h-11 px-5 transition-all hover:scale-105 active:scale-95"
                size="default"
              >
                <span className="transition-transform duration-300" style={{ display: 'inline-block', transform: copied ? 'rotate(360deg)' : 'rotate(0deg)' }}>
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                </span>
                {copied ? 'Copied!' : 'Copy Email HTML'}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="font-medium">
              <p>Copy email HTML to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Hidden Email-Safe Container - Used for copying HTML */}
      <div ref={emailSafeContainerRef} style={{ position: 'fixed', left: '-9999px', top: 0 }}>
        {/* Wrap everything in a single container table for proper email structure */}
        <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%', maxWidth: globalTheme.emailWidth }}>
          <tbody>
            {/* Top Spacer – driven by email layout style */}
            <tr>
              <td style={{ height: wrapperStyles.outerPaddingTop, backgroundColor: 'transparent' }}></td>
            </tr>
            
            {/* Main Email Content */}
            <tr>
              <td>
                <table cellPadding="0" cellSpacing="0" border={0} style={{ 
                  maxWidth: globalTheme.emailWidth, 
                  width: '100%', 
                  margin: '0 auto',
                  backgroundColor: colorScheme.emailBackground,
                  borderRadius: wrapperStyles.innerBorderRadius,
                  overflow: 'hidden',
                  border: wrapperStyles.innerBorder
                }}>
                  <tbody>
                    <HeaderBlock 
                      title={emailState.header.title}
                      date={emailState.header.date}
                      showDate={emailState.header.showDate}
                      productName={emailState.header.productName}
                      showProductName={emailState.header.showProductName}
                      productNameFontSize={emailState.header.productNameFontSize}
                      categoryBadge={emailState.header.categoryBadge}
                      versionText={emailState.header.versionText}
                      versionBadgeStyle={emailState.header.versionBadgeStyle}
                      showPattern={false}
                      isEmailMode={true}
                      showLogo={emailState.header.showLogo}
                      logoSrc={emailState.header.logoSrc || globalTheme.defaultLogoUrl}
                      logoSize={emailState.header.logoSize || globalTheme.defaultLogoSize}
                      logoCustomWidth={emailState.header.logoCustomWidth}
                      logoWidth={emailState.header.logoWidth}
                      logoAlignment={emailState.header.logoAlignment}
                      contentAlignment={emailState.header.contentAlignment}
                      backgroundColor={emailState.header.backgroundColor}
                      titleColor={emailState.header.titleColor}
                      titleFontSize={emailState.header.titleFontSize}
                      dateColor={emailState.header.dateColor}
                      dateFontSize={emailState.header.dateFontSize}
                      padding={emailState.header.padding}
                      {...(emailState.header.paddingTop !== undefined && { paddingTop: emailState.header.paddingTop })}
                      {...(emailState.header.paddingBottom !== undefined && { paddingBottom: emailState.header.paddingBottom })}
                      {...(emailState.header.paddingLeft !== undefined && { paddingLeft: emailState.header.paddingLeft })}
                      {...(emailState.header.paddingRight !== undefined && { paddingRight: emailState.header.paddingRight })}
                      theme={emailState.header.theme || globalTheme.defaultBlockTheme}
                    />
                    
                    {emailState.content.map((block, index) => (
                      <React.Fragment key={block.id}>
                        {renderContentBlock(block, true, false)}
                      </React.Fragment>
                    ))}
                    
                    {(emailState.footer.showFooter ?? true) && (
                      <ContactFooterBlock 
                        message={emailState.footer.message}
                        teamName={emailState.footer.teamName}
                        email={emailState.footer.email}
                        website={emailState.footer.website}
                        disclaimer={emailState.footer.disclaimer}
                        showPattern={false}
                        isEmailMode={true}
                        showLogo={!!(emailState.footer.logoSrc || globalTheme.defaultLogoUrl) && emailState.footer.showLogo !== false}
                        logoSrc={emailState.footer.logoSrc || globalTheme.defaultLogoUrl}
                        logoSize={emailState.footer.logoSize || (globalTheme.defaultLogoSize === 'xl' ? 'lg' : globalTheme.defaultLogoSize)}
                        contentAlignment={emailState.footer.contentAlignment}
                        backgroundColor={emailState.footer.backgroundColor}
                        messageColor={emailState.footer.messageColor}
                        messageFontSize={emailState.footer.messageFontSize}
                        teamNameColor={emailState.footer.teamNameColor}
                        teamNameFontSize={emailState.footer.teamNameFontSize}
                        linkColor={emailState.footer.linkColor}
                        disclaimerColor={emailState.footer.disclaimerColor}
                        disclaimerFontSize={emailState.footer.disclaimerFontSize}
                        padding={emailState.footer.padding}
                        {...(emailState.footer.paddingTop !== undefined && { paddingTop: emailState.footer.paddingTop })}
                        {...(emailState.footer.paddingBottom !== undefined && { paddingBottom: emailState.footer.paddingBottom })}
                        {...(emailState.footer.paddingLeft !== undefined && { paddingLeft: emailState.footer.paddingLeft })}
                        {...(emailState.footer.paddingRight !== undefined && { paddingRight: emailState.footer.paddingRight })}
                        theme={emailState.footer.theme || globalTheme.defaultBlockTheme}
                      />
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
            
            {/* Bottom Spacer */}
            <tr>
              <td style={{ height: '32px', backgroundColor: 'transparent' }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Toast notifications */}
      <Toaster />

      {/* Template Switch Confirmation Dialog */}
      <AlertDialog open={showTemplateSwitchDialog} onOpenChange={setShowTemplateSwitchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch template?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Switching templates will discard all your current work. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTemplateSwitch}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTemplateSwitch}>
              Switch Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </div>
    </TooltipProvider>
  );
}