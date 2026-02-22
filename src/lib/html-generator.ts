// Generates production-ready HTML email code from email state
import type { EmailState } from '../components/PropertiesPanel';
import { colorValueToHex } from './color-token-system';
import { getEmailWrapperStyles } from './global-theme';
import { PADDING_SCALE, HEADER_FOOTER_PADDING_SCALE, type PaddingSize } from './layout-scales';
import { FONT_SIZE_SCALE, type FontSize } from './typography-scales';
import { KORE_LOGO_DEFAULT, koreLogoDark, koreLogoLight } from '../components/email-blocks/HeaderBlock';

function isDarkBg(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/** Resolve title/description size to px for email-safe CSS (semantic keys like '4xl' → '32px'). */
function resolveFontSize(value: string | undefined, fallbackPx: string): string {
  if (!value) return fallbackPx;
  if (value in FONT_SIZE_SCALE) return FONT_SIZE_SCALE[value as FontSize];
  if (/^\d+px$/.test(value)) return value;
  return fallbackPx;
}

/** Resolve semantic padding (sm/md/lg or compact/standard/spacious) to px for email-safe CSS. */
function resolvePaddingToPx(padding: string | undefined, scale: 'block' | 'headerFooter'): string {
  const map = scale === 'block' ? PADDING_SCALE : HEADER_FOOTER_PADDING_SCALE;
  const fallback = scale === 'block' ? '24px 32px' : '48px 32px';
  if (!padding) return fallback;
  if (padding in map) return map[padding as PaddingSize];
  if (/^\d+px(\s+\d+px)*$/.test(padding)) return padding;
  return fallback;
}

// Helper function to generate email-safe list HTML
function generateListHTML(bullets: string[], textColor: string = '#475569'): string {
  if (!bullets || bullets.length === 0) return '';
  
  return `
    <ul style="margin: 0 0 16px 0; padding-left: 24px; list-style-type: disc;">
      ${bullets.map(bullet => `
        <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.7; color: ${textColor};">${bullet}</li>
      `).join('')}
    </ul>
  `;
}

export function generateEmailHTML(emailState: EmailState, globalTheme: any): string {
  const emailWidth = globalTheme.emailWidth || 600;
  const wrapperStyles = getEmailWrapperStyles(globalTheme);
  const innerTableStyle = `max-width: ${typeof emailWidth === 'string' ? emailWidth.replace('px', '') : emailWidth}px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: ${wrapperStyles.innerBorderRadius}; border: ${wrapperStyles.innerBorder};`;
  const outerBg = '#f3f4f6';

  // Generate HTML for content blocks
  const contentBlocksHTML = emailState.content.map(block => {
    return generateBlockHTML(block);
  }).join('\n');

  // Email boilerplate
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${emailState.header.title || 'Email'}</title>
  <style type="text/css">
    /* Email client resets */
    body { margin: 0; padding: 0; }
    table { border-collapse: collapse; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Prevent WebKit and Windows mobile changing default text sizes */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    
    /* Remove spacing between tables in Outlook 2007 and up */
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${outerBg};">
  
  <!-- EMAIL CONTAINER -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${outerBg}; padding: ${wrapperStyles.outerPaddingTop} ${wrapperStyles.outerPaddingSides};">
    <tr>
      <td align="center">
        
        <!-- EMAIL CONTENT -->
        <table cellpadding="0" cellspacing="0" border="0" style="${innerTableStyle}">
          <tbody>
            
            <!-- HEADER -->
            ${generateHeaderHTML(emailState.header)}
            
            <!-- CONTENT BLOCKS -->
            ${contentBlocksHTML}
            
            <!-- FOOTER -->
            ${emailState.footer.showFooter !== false ? generateFooterHTML(emailState.footer) : ''}
            
          </tbody>
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;
}

function resolveHeaderLogoUrl(header: any): string {
  const logoSrc = header.logoSrc;
  if (!logoSrc) return 'YOUR_LOGO_URL_HERE';
  const bgHex = colorValueToHex(header.backgroundColor || '#004EEB');
  const isKoreLogo = logoSrc === KORE_LOGO_DEFAULT || (typeof logoSrc === 'string' && logoSrc.includes('kore-logo'));
  if (!isKoreLogo) return logoSrc;
  const r = parseInt(bgHex.slice(1, 3), 16) || 0;
  const g = parseInt(bgHex.slice(3, 5), 16) || 0;
  const b = parseInt(bgHex.slice(5, 7), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? koreLogoDark : koreLogoLight;
}

function generateHeaderHTML(header: any): string {
  const padding = resolvePaddingToPx(header.padding, 'headerFooter');
  const backgroundColor = colorValueToHex(header.backgroundColor || '#ffffff');
  const titleColor = colorValueToHex(header.titleColor || '#000000');
  const dateColor = colorValueToHex(header.dateColor || '#64748B');
  const logoUrl = resolveHeaderLogoUrl(header);
  
  return `<tr>
  <td style="padding: ${padding}; background-color: ${backgroundColor};">
    ${header.showLogo !== false ? `<div style="margin-bottom: 16px;">
      <img src="${logoUrl}" alt="Logo" width="${header.logoCustomWidth || 100}" style="display: block;" />
    </div>` : ''}
    <h1 style="margin: 0 0 8px 0; color: ${titleColor}; font-size: ${typeof header.titleFontSize === 'number' ? `${header.titleFontSize}px` : (header.titleFontSize || '28px')}; font-weight: bold; line-height: 1.2;">
      ${header.title || 'Email Title'}
    </h1>
    ${header.showDate !== false ? `<p style="margin: 0; color: ${dateColor}; font-size: ${header.dateFontSize || '14px'};">
      ${header.date || ''}
    </p>` : ''}
    ${header.versionText ? `<div style="margin-top: 12px; display: inline-block; padding: 4px 12px; background-color: #f3f4f6; border-radius: 4px; font-size: 12px; font-weight: 600; color: #64748B;">
      ${header.versionText}
    </div>` : ''}
  </td>
</tr>`;
}

function generateBlockHTML(block: any): string {
  // Support both flat block and { id, type, props } shape from app state
  const props = block.props != null ? { ...block.props, type: block.type } : block;

  // These blocks manage their own <tr><td> structure with custom bgColor
  if (['hero', 'changelog', 'deprecation', 'metrics-snapshot', 'nps-rating', 'bento-grid', 'feature-row', 'pull-quote', 'announcement-banner', 'card-grid', 'comparison-table', 'gif-demo', 'video-thumbnail', 'quick-poll', 'rsvp', 'feedback-prompt', 'known-issues', 'roadmap-preview', 'team-attribution', 'incident-retro'].includes(block.type)) {
    return generateBlockContent(props);
  }

  const backgroundColor = colorValueToHex(props.backgroundColor || '#ffffff');
  const padding = resolvePaddingToPx(props.padding, 'block');

  return `<tr>
  <td style="padding: ${padding}; background-color: ${backgroundColor};">
    <!-- ${block.type} block -->
    ${generateBlockContent(props)}
  </td>
</tr>`;
}

function generateBlockContent(block: any): string {
  // Simplified content generation - expand based on block type
  switch (block.type) {
    case 'text-only':
      return `<p style="margin: 0; color: ${colorValueToHex(block.textColor || '#000000')}; font-size: 14px; line-height: 1.6;">
        ${block.description || 'Content goes here'}
      </p>`;
    
    case 'feature-list':
      const titleColor = colorValueToHex(block.titleColor || '#000000');
      const descriptionColor = colorValueToHex(block.descriptionColor || '#64748B');
      
      return `${block.showTitle !== false && block.title ? `<h2 style="margin: 0 0 16px 0; color: ${titleColor}; font-size: ${resolveFontSize(block.titleSize, '24px')}; font-weight: ${block.titleWeight || 'bold'};">
        ${block.title}
      </h2>` : ''}
      ${block.showDescription !== false && block.description ? `<p style="margin: 0 0 16px 0; color: ${descriptionColor}; font-size: ${resolveFontSize(block.descriptionSize, '16px')}; line-height: 1.7;">
        ${block.description}
      </p>` : ''}
      ${block.showBullets !== false && block.bullets && block.bullets.length > 0 ? generateListHTML(block.bullets, descriptionColor) : ''}
      ${block.showCTA !== false && block.ctaText ? `
        <div style="margin-top: 16px;">
          <a href="${block.ctaLink || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${colorValueToHex(block.ctaColor || '#000000')}; color: #ffffff; text-decoration: none; border-radius: ${block.ctaBorderRadius || '8px'}; font-weight: 600;">
            ${block.ctaText}
          </a>
        </div>
      ` : ''}`;
    
    case 'image-content':
      const imageWidth = block.imageWidth || 40;
      const contentWidth = 100 - imageWidth;
      const isImageLeft = block.imagePosition !== 'right';
      
      const imageHTML = block.showImage !== false && block.imageSrc ? `
        <td width="${imageWidth}%" style="vertical-align: top; ${isImageLeft ? 'padding-right: 24px;' : ''}">
          <img src="${block.imageSrc}" alt="${block.imageAlt || 'Feature image'}" style="width: 100%; height: auto; display: block; border-radius: 8px; border: 1px solid #e5e7eb;" />
        </td>
      ` : '';
      
      const contentHTML = `
        <td width="${contentWidth}%" style="vertical-align: top; ${!isImageLeft && block.showImage !== false ? 'padding-right: 24px;' : ''}">
          ${block.showTitle !== false && block.title ? `<h2 style="margin: 0 0 12px 0; color: ${colorValueToHex(block.titleColor || '#000000')}; font-size: 24px; font-weight: bold;">${block.title}</h2>` : ''}
          ${block.showDescription !== false && block.description ? `<p style="margin: 0 0 16px 0; color: ${colorValueToHex(block.descriptionColor || '#64748B')}; font-size: 14px; line-height: 1.6;">${block.description}</p>` : ''}
          ${block.showBullets !== false && block.bullets && block.bullets.length > 0 ? generateListHTML(block.bullets, colorValueToHex(block.descriptionColor || '#64748B')) : ''}
          ${block.showCTA !== false && block.ctaText ? `
            <div>
              <a href="${block.ctaLink || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${colorValueToHex(block.ctaColor || '#0066FF')}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                ${block.ctaText}
              </a>
            </div>
          ` : ''}
        </td>
      `;
      
      return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          ${isImageLeft ? imageHTML + contentHTML : contentHTML + imageHTML}
        </tr>
      </table>`;
    
    case 'feature-screenshot':
      const screenshotImageHTML = block.showImage !== false && block.imageSrc ? `
        <div style="margin-bottom: 24px;">
          <img src="${block.imageSrc}" alt="${block.imageAlt || 'Feature screenshot'}" style="width: 100%; height: auto; display: block; border-radius: 8px; border: 1px solid #e5e7eb;" />
        </div>
      ` : '';
      
      return `${screenshotImageHTML}
        ${block.showTitle !== false && block.title ? `<h2 style="margin: 0 0 16px 0; color: ${colorValueToHex(block.titleColor || '#000000')}; font-size: ${resolveFontSize(block.titleSize, '24px')}; font-weight: ${block.titleWeight || 'bold'};">${block.title}</h2>` : ''}
        ${block.showDescription !== false && block.description ? `<p style="margin: 0 0 16px 0; color: ${colorValueToHex(block.descriptionColor || '#64748B')}; font-size: ${resolveFontSize(block.descriptionSize, '16px')}; line-height: 1.7;">${block.description}</p>` : ''}
        ${block.showBullets !== false && block.bullets && block.bullets.length > 0 ? generateListHTML(block.bullets, colorValueToHex(block.descriptionColor || '#64748B')) : ''}
        ${block.showCTA !== false && block.ctaText ? `
          <div style="margin-top: 16px;">
            <a href="${block.ctaLink || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${colorValueToHex(block.ctaColor || '#000000')}; color: #ffffff; text-decoration: none; border-radius: ${block.ctaBorderRadius || '8px'}; font-weight: 600;">${block.ctaText}</a>
          </div>
        ` : ''}`;

    case 'multi-update':
      let multiUpdateHTML = '';
      if (block.showTitle !== false && block.title) {
        multiUpdateHTML += `<h2 style="margin: 0 0 24px 0; color: ${colorValueToHex(block.titleColor || '#000000')}; font-size: ${resolveFontSize(block.titleSize, '24px')}; font-weight: bold;">${block.title}</h2>`;
      }
      if (block.updates && block.updates.length > 0) {
        block.updates.forEach((update: any, index: number) => {
          multiUpdateHTML += `
            <div style="${index > 0 ? 'margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;' : ''}">
              <h3 style="margin: 0 0 8px 0; color: ${colorValueToHex(block.titleColor || '#000000')}; font-size: 18px; font-weight: 600;">${update.title || ''}</h3>
              <p style="margin: 0 0 12px 0; color: ${colorValueToHex(block.descriptionColor || '#64748B')}; font-size: 14px; line-height: 1.6;">${update.description || ''}</p>
              ${update.ctaText ? `<a href="${update.ctaLink || '#'}" style="color: ${colorValueToHex(block.ctaColor || '#000000')}; text-decoration: none; font-weight: 600; font-size: 14px;">${update.ctaText} →</a>` : ''}
            </div>
          `;
        });
      }
      return multiUpdateHTML;

    case 'two-column':
      const leftContent = `
        <td width="50%" style="vertical-align: top; padding-right: 12px;">
          ${block.showTitle !== false && block.leftTitle ? `<h3 style="margin: 0 0 12px 0; color: ${colorValueToHex(block.titleColor || '#000000')}; font-size: 18px; font-weight: 600;">${block.leftTitle}</h3>` : ''}
          ${block.leftDescription ? `<p style="margin: 0; color: ${colorValueToHex(block.descriptionColor || '#64748B')}; font-size: 14px; line-height: 1.6;">${block.leftDescription}</p>` : ''}
        </td>
      `;
      const rightContent = `
        <td width="50%" style="vertical-align: top; padding-left: 12px;">
          ${block.showTitle !== false && block.rightTitle ? `<h3 style="margin: 0 0 12px 0; color: ${colorValueToHex(block.titleColor || '#000000')}; font-size: 18px; font-weight: 600;">${block.rightTitle}</h3>` : ''}
          ${block.rightDescription ? `<p style="margin: 0; color: ${colorValueToHex(block.descriptionColor || '#64748B')}; font-size: 14px; line-height: 1.6;">${block.rightDescription}</p>` : ''}
        </td>
      `;
      return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;"><tr>${leftContent}${rightContent}</tr></table>`;

    case 'warning':
    case 'alert':
      const alertBgColors: any = {
        'warning': '#FEF3C7',
        'success': '#D1FAE5',
        'error': '#FEE2E2',
        'info': '#DBEAFE'
      };
      const alertBorderColors: any = {
        'warning': '#F59E0B',
        'success': '#10B981',
        'error': '#EF4444',
        'info': '#3B82F6'
      };
      const alertType = block.alertType || 'warning';
      return `
        <div style="padding: 16px; background-color: ${alertBgColors[alertType] || alertBgColors.warning}; border-left: 4px solid ${alertBorderColors[alertType] || alertBorderColors.warning}; border-radius: 8px;">
          ${block.showTitle !== false && block.title ? `<h3 style="margin: 0 0 8px 0; color: ${colorValueToHex(block.titleColor || '#000000')}; font-size: 18px; font-weight: 600;">${block.title}</h3>` : ''}
          ${block.description ? `<p style="margin: 0; color: ${colorValueToHex(block.descriptionColor || '#000000')}; font-size: 14px; line-height: 1.6;">${block.description}</p>` : ''}
        </div>
      `;

    case 'divider':
      return `<hr style="border: none; border-top: ${block.thickness || '1px'} ${block.style || 'solid'} ${colorValueToHex(block.color || '#e5e7eb')}; margin: ${block.spacing || '24px'} 0;" />`;

    case 'hero': {
      const { badge, showBadge, title, subtitle, showSubtitle, ctaText, ctaUrl, showCta, bgColor = '#ffffff', textColor = '#09090b', displaySize = 56 } = block;
      const heroCtaBg = textColor || '#18181b';
      const heroCtaText = isDarkBg(heroCtaBg) ? '#ffffff' : '#09090b';
      return `<tr>
  <td align="center" bgcolor="${bgColor}" style="background-color:${bgColor}; padding:64px 40px; text-align:center;">
    ${showBadge && badge ? `<div style="margin-bottom:16px;"><span style="display:inline-block; padding:4px 14px; border-radius:100px; border:1px solid ${textColor}40; color:${textColor}; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; font-family:'DM Sans',Arial,sans-serif;">${badge}</span></div>` : ''}
    <div style="font-size:${displaySize}px; font-weight:800; line-height:1.1; color:${textColor}; margin:0 0 16px; font-family:'DM Serif Display',Georgia,serif; letter-spacing:-0.02em;">${title}</div>
    ${showSubtitle && subtitle ? `<div style="font-size:18px; color:${textColor}b3; margin:0 0 32px; font-family:'DM Sans',Arial,sans-serif; line-height:1.6;">${subtitle}</div>` : ''}
    ${showCta && ctaText ? `<a href="${ctaUrl || '#'}" style="display:inline-block; padding:14px 32px; background-color:${heroCtaBg}; color:${heroCtaText}; text-decoration:none; border-radius:8px; font-weight:700; font-size:16px; font-family:'DM Sans',Arial,sans-serif;">${ctaText}</a>` : ''}
  </td>
</tr>`;
    }
    
    case 'changelog': {
      const { version = 'v2.1.0', date, sections = [], bgColor = '#ffffff' } = block;
      const clDark = isDarkBg(bgColor);
      const clTextPrimary = block.textColor || (clDark ? '#f4f4f5' : '#09090b');
      const clTextMuted = clDark ? '#71717a' : '#52525b';
      const clDivider = clDark ? '#27272a' : '#e4e4e7';
      const clBadgeBg = clDark ? '#27272a' : '#e4e4e7';
      const clItemColor = clDark ? '#a1a1aa' : '#52525b';
      const typeConfig: Record<string, { color: string; label: string }> = {
        feature:     { color: '#22c55e', label: 'New' },
        improvement: { color: '#3b82f6', label: 'Improved' },
        fix:         { color: '#d97706', label: 'Fixed' },
        breaking:    { color: '#ef4444', label: 'Breaking' },
        deprecated:  { color: '#a78bfa', label: 'Deprecated' },
      };
      const sectionsHTML = sections.map((section: any) => {
        const cfg = typeConfig[section.type] || typeConfig.feature;
        const items = (section.items || []).map((item: string) =>
          `<li style="color:${clItemColor};font-size:14px;line-height:1.7;margin-bottom:4px;">${item}</li>`
        ).join('');
        return `<div style="margin-bottom:20px;">
  <div style="margin-bottom:8px;">
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${cfg.color};vertical-align:middle;margin-right:8px;"></span>
    <span style="font-size:12px;font-weight:700;color:${cfg.color};text-transform:uppercase;letter-spacing:0.06em;">${cfg.label}</span>
  </div>
  <ul style="margin:0;padding:0 0 0 20px;list-style:disc;">${items}</ul>
</div>`;
      }).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    <div style="margin-bottom:24px;">
      <span style="display:inline-block;padding:4px 10px;border-radius:6px;background:${clBadgeBg};color:${clTextPrimary};font-size:13px;font-weight:700;font-family:'DM Mono',monospace;">${version}</span>
      ${date ? `<span style="color:${clTextMuted};font-size:13px;margin-left:12px;">${date}</span>` : ''}
    </div>
    ${sectionsHTML}
  </td>
</tr>`;
    }

    case 'deprecation': {
      const { featureName = 'Legacy Auth API v1', deprecatedDate = 'March 1, 2026', eolDate = 'June 1, 2026', migrationPath = '', severity = 'warning', ctaText = 'View Migration Guide', ctaUrl = '#', bgColor = '#ffffff' } = block;
      const depDark = isDarkBg(bgColor);
      const depTextPrimary = block.textColor || (depDark ? '#f4f4f5' : '#09090b');
      const depTextMuted = depDark ? '#71717a' : '#52525b';
      const depBodyColor = depDark ? '#a1a1aa' : '#52525b';
      const borderColor = severity === 'critical' ? '#ef4444' : '#d97706';
      const innerBg = severity === 'critical' ? (depDark ? '#1c0a0a' : '#fef2f2') : (depDark ? '#1a1200' : '#fffbeb');
      const badgeText = severity === 'critical' ? 'CRITICAL' : 'DEPRECATION NOTICE';
      const badgeTextColor = isDarkBg(borderColor) ? '#ffffff' : '#09090b';
      return `<tr>
  <td style="padding:24px 40px;background-color:${bgColor};">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${innerBg};border:2px solid ${borderColor};border-radius:8px;">
      <tr>
        <td style="padding:24px 28px;font-family:'DM Sans',Arial,sans-serif;">
          <div style="margin-bottom:16px;"><span style="display:inline-block;padding:3px 10px;border-radius:4px;background:${borderColor};color:${badgeTextColor};font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">${badgeText}</span></div>
          <div style="color:${depTextPrimary};font-size:18px;font-weight:700;margin-bottom:16px;">${featureName}</div>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr><td style="color:${depTextMuted};font-size:13px;padding-bottom:8px;padding-right:24px;white-space:nowrap;">Deprecated:</td><td style="color:${depTextPrimary};font-size:13px;font-weight:600;padding-bottom:8px;">${deprecatedDate}</td></tr>
            <tr><td style="color:${depTextMuted};font-size:13px;padding-right:24px;white-space:nowrap;">End of Life:</td><td style="color:${borderColor};font-size:13px;font-weight:700;">${eolDate}</td></tr>
          </table>
          <div style="color:${depBodyColor};font-size:14px;margin-bottom:20px;line-height:1.6;"><strong style="color:${depTextPrimary};">Migration path: </strong>${migrationPath}</div>
          ${ctaText ? `<a href="${ctaUrl}" style="display:inline-block;padding:10px 24px;background:${borderColor};color:${badgeTextColor};text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;">${ctaText}</a>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>`;
    }

    case 'metrics-snapshot': {
      const { headline, metrics = [], bgColor = '#ffffff' } = block;
      const msDark = isDarkBg(bgColor);
      const msTextPrimary = block.textColor || (msDark ? '#f4f4f5' : '#09090b');
      const msTextMuted = msDark ? '#71717a' : '#52525b';
      const msDivider = msDark ? '#27272a' : '#e4e4e7';
      const deltaColor = (dir?: string) => dir === 'up' ? '#22c55e' : dir === 'down' ? '#ef4444' : msTextMuted;
      const deltaIcon = (dir?: string) => dir === 'up' ? '&#8593;' : dir === 'down' ? '&#8595;' : '&mdash;';
      const cellsHTML = metrics.map((m: any, i: number) =>
        `<td style="text-align:center;padding:0 16px;${i > 0 ? `border-left:1px solid ${msDivider};` : ''}">
  <div style="font-size:36px;font-weight:800;color:${msTextPrimary};font-family:'DM Mono',monospace;line-height:1;">${m.value}</div>
  ${m.delta ? `<div style="font-size:12px;color:${deltaColor(m.deltaDirection)};margin-top:4px;font-weight:600;">${deltaIcon(m.deltaDirection)} ${m.delta}</div>` : ''}
  <div style="font-size:12px;color:${msTextMuted};margin-top:6px;text-transform:uppercase;letter-spacing:0.06em;">${m.label}</div>
</td>`
      ).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    ${headline ? `<div style="color:${msTextMuted};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px;">${headline}</div>` : ''}
    <table width="100%" cellpadding="0" cellspacing="0"><tr>${cellsHTML}</tr></table>
  </td>
</tr>`;
    }

    case 'nps-rating': {
      const { questionText = 'How satisfied are you with this release?', lowLabel = 'Not at all', highLabel = 'Extremely satisfied', exportToken, blockId = 'nps', apiUrl = 'https://kore-email-builder.vercel.app', bgColor = '#ffffff' } = block;
      const npsDark = isDarkBg(bgColor);
      const npsTextPrimary = block.textColor || (npsDark ? '#f4f4f5' : '#09090b');
      const npsTextMuted = npsDark ? '#71717a' : '#52525b';
      const npsColors = ['#ef4444','#f97316','#f97316','#fb923c','#fb923c','#eab308','#eab308','#84cc16','#84cc16','#22c55e','#22c55e'];
      const cellsHTML = npsColors.map((color, i) => {
        const href = exportToken ? `${apiUrl}/r/${exportToken}/${blockId}/${i}` : '#';
        return `<td style="padding:0 2px;"><a href="${href}" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;background-color:${color};color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:6px;font-family:'DM Sans',Arial,sans-serif;">${i}</a></td>`;
      }).join('');
      return `<tr>
  <td align="center" style="padding:32px 24px;background-color:${bgColor};font-family:'DM Sans',Arial,sans-serif;">
    <div style="color:${npsTextPrimary};font-size:16px;margin-bottom:20px;font-weight:500;">${questionText}</div>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 8px;"><tr>${cellsHTML}</tr></table>
    <table width="480" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="color:${npsTextMuted};font-size:11px;">${lowLabel}</td>
        <td align="right" style="color:${npsTextMuted};font-size:11px;">${highLabel}</td>
      </tr>
    </table>
  </td>
</tr>`;
    }


    case 'bento-grid': {
      const { cells = [], bgColor = '#ffffff' } = block;
      const bgDark = isDarkBg(bgColor);
      const bgCellDefault = bgDark ? '#18181b' : '#f9f9f9';
      const bgDivider = bgDark ? '#27272a' : '#e4e4e7';
      const [large, ...small] = cells;
      const largeCellBg = large?.bgColor || bgCellDefault;
      const largeCellDark = isDarkBg(largeCellBg);
      const largeCell = large ? `
        <td width="58%" style="background-color:${largeCellBg};border-radius:12px;padding:28px;vertical-align:top;border:1px solid ${bgDivider};">
          ${large.icon ? `<div style="font-size:28px;margin-bottom:12px;">${large.icon}</div>` : ''}
          <div style="color:${largeCellDark ? '#f4f4f5' : '#09090b'};font-size:18px;font-weight:700;margin-bottom:8px;">${large.title||''}</div>
          <div style="color:${largeCellDark ? '#71717a' : '#52525b'};font-size:14px;line-height:1.6;">${large.description||''}</div>
        </td>` : '';
      const smallCells = small.slice(0,2).map((cell: any, i: number) => {
        const sCellBg = cell.bgColor || bgCellDefault;
        const sCellDark = isDarkBg(sCellBg);
        return `
        <tr><td style="background-color:${sCellBg};border-radius:12px;padding:20px;border:1px solid ${bgDivider};display:block;${i>0?'margin-top:12px;':''}">
          ${cell.icon ? `<div style="font-size:22px;margin-bottom:8px;">${cell.icon}</div>` : ''}
          <div style="color:${sCellDark ? '#f4f4f5' : '#09090b'};font-size:14px;font-weight:700;margin-bottom:6px;">${cell.title||''}</div>
          <div style="color:${sCellDark ? '#71717a' : '#52525b'};font-size:13px;line-height:1.5;">${cell.description||''}</div>
        </td></tr>`;
      }).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:24px 40px;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="12"><tbody><tr>
      ${largeCell}
      <td width="38%" style="vertical-align:top;">
        <table width="100%" cellpadding="0" cellspacing="0"><tbody>${smallCells}</tbody></table>
      </td>
    </tr></tbody></table>
  </td>
</tr>`;
    }

    case 'feature-row': {
      const { imageUrl, imageAlt = 'Feature image', imagePosition = 'left', title = '', description = '', ctaText, ctaUrl = '#', bgColor = '#ffffff' } = block;
      const frDark = isDarkBg(bgColor);
      const frTextPrimary = block.textColor || (frDark ? '#f4f4f5' : '#09090b');
      const frTextMuted = frDark ? '#71717a' : '#52525b';
      const frCtaColor = frTextPrimary;
      const imgTd = `<td width="48%" style="vertical-align:middle;padding:${imagePosition==='left'?'0 20px 0 0':'0 0 0 20px'};">
        <img src="${imageUrl||'https://placehold.co/280x180/18181b/f4f4f5?text=Feature'}" alt="${imageAlt}" width="100%" style="display:block;border-radius:8px;max-width:280px;" />
      </td>`;
      const txtTd = `<td width="48%" style="vertical-align:middle;">
        <div style="color:${frTextPrimary};font-size:20px;font-weight:700;margin-bottom:12px;font-family:'DM Sans',Arial,sans-serif;">${title}</div>
        <div style="color:${frTextMuted};font-size:14px;line-height:1.7;margin-bottom:20px;font-family:'DM Sans',Arial,sans-serif;">${description}</div>
        ${ctaText ? `<a href="${ctaUrl}" style="color:${frCtaColor};font-size:14px;font-weight:600;text-decoration:none;font-family:'DM Sans',Arial,sans-serif;">${ctaText} &#8594;</a>` : ''}
      </td>`;
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tbody><tr>
      ${imagePosition==='left' ? imgTd+txtTd : txtTd+imgTd}
    </tr></tbody></table>
  </td>
</tr>`;
    }

    case 'pull-quote': {
      const { quoteText = '', authorName, authorTitle, accentColor, bgColor = '#ffffff' } = block;
      const pqDark = isDarkBg(bgColor);
      const pqTextPrimary = block.textColor || (pqDark ? '#f4f4f5' : '#09090b');
      const pqTextMuted = pqDark ? '#71717a' : '#52525b';
      const pqAccent = accentColor || pqTextPrimary;
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tbody><tr>
      <td width="4" style="background-color:${pqAccent};border-radius:2px;"></td>
      <td style="padding-left:24px;">
        <div style="color:${pqTextPrimary};font-size:20px;font-style:italic;line-height:1.5;margin-bottom:16px;font-family:'DM Serif Display',Georgia,serif;">${quoteText}</div>
        ${authorName ? `<div style="font-family:'DM Sans',Arial,sans-serif;">
          <span style="color:${pqTextPrimary};font-size:14px;font-weight:700;">${authorName}</span>
          ${authorTitle ? `<span style="color:${pqTextMuted};font-size:13px;"> &#8212; ${authorTitle}</span>` : ''}
        </div>` : ''}
      </td>
    </tr></tbody></table>
  </td>
</tr>`;
    }

    case 'announcement-banner': {
      const { icon = '📣', headline = '', bgColor = '#fffbeb', textColor = '#92400e' } = block;
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:16px 32px;text-align:center;font-family:'DM Sans',Arial,sans-serif;">
    <span style="font-size:18px;margin-right:10px;">${icon}</span>
    <span style="color:${textColor};font-size:14px;font-weight:600;">${headline}</span>
  </td>
</tr>`;
    }

    case 'card-grid': {
      const { columns = 2, cards = [], bgColor = '#ffffff' } = block;
      const cgDark = isDarkBg(bgColor);
      const cgTextPrimary = block.textColor || (cgDark ? '#f4f4f5' : '#09090b');
      const cgTextMuted = cgDark ? '#71717a' : '#52525b';
      const cgCardBg = cgDark ? '#18181b' : '#f9f9f9';
      const cgDivider = cgDark ? '#27272a' : '#e4e4e7';
      const cellWidth = columns === 2 ? '48%' : '31%';
      const rows: any[][] = [];
      for (let i = 0; i < cards.length; i += columns) rows.push(cards.slice(i, i + columns));
      const rowsHTML = rows.map((row: any[]) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tbody><tr>
          ${row.map((card: any) => `<td width="${cellWidth}" style="background-color:${cgCardBg};border:1px solid ${cgDivider};border-radius:10px;padding:20px;vertical-align:top;">
            ${card.icon ? `<div style="font-size:24px;margin-bottom:10px;">${card.icon}</div>` : ''}
            <div style="color:${cgTextPrimary};font-size:14px;font-weight:700;margin-bottom:6px;">${card.title||''}</div>
            <div style="color:${cgTextMuted};font-size:13px;line-height:1.6;">${card.description||''}</div>
          </td>`).join('')}
        </tr></tbody></table>`).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    ${rowsHTML}
  </td>
</tr>`;
    }

    case 'comparison-table': {
      const { columns: cols = [], rows: trows = [], bgColor = '#ffffff' } = block;
      const ctDark = isDarkBg(bgColor);
      const ctTextPrimary = block.textColor || (ctDark ? '#f4f4f5' : '#09090b');
      const ctTextMuted = ctDark ? '#71717a' : '#52525b';
      const ctDivider = ctDark ? '#27272a' : '#e4e4e7';
      const ctRowBorder = ctDark ? '#1a1a1a' : '#e4e4e7';
      const headerCells = cols.map((col: string, i: number) => `<th style="text-align:${i===0?'left':'center'};padding:10px 12px;border-bottom:1px solid ${ctDivider};color:${ctTextMuted};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${col}</th>`).join('');
      const SYMBOLS: Record<string, string> = { yes: '✓', no: '✗', partial: '◐' };
      const COLORS: Record<string, string> = { yes: '#22c55e', no: '#ef4444', partial: '#d97706' };
      const ctDefaultVal = ctDark ? '#a1a1aa' : '#71717a';
      const bodyRows = trows.map((row: any) => `<tr>
        <td style="padding:12px;border-bottom:1px solid ${ctRowBorder};color:${ctTextPrimary};font-size:14px;">${row.label||''}</td>
        ${(row.values||[]).map((val: string) => `<td style="text-align:center;padding:12px;border-bottom:1px solid ${ctRowBorder};font-size:16px;color:${COLORS[val]||ctDefaultVal};">${SYMBOLS[val]||val}</td>`).join('')}
      </tr>`).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </td>
</tr>`;
    }

    case 'gif-demo': {
      const { gifUrl, caption, ctaText, ctaUrl = '#', showOutlookWarning = true, bgColor = '#ffffff' } = block;
      const gdDark = isDarkBg(bgColor);
      const gdTextMuted = gdDark ? '#71717a' : '#52525b';
      const gdDivider = gdDark ? '#27272a' : '#e4e4e7';
      const gdCtaBg = gdDark ? '#f4f4f5' : '#18181b';
      const gdCtaText = isDarkBg(gdCtaBg) ? '#ffffff' : '#09090b';
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;text-align:center;font-family:'DM Sans',Arial,sans-serif;">
    <img src="${gifUrl||'https://placehold.co/520x280/18181b/f4f4f5?text=GIF+Demo'}" alt="${caption||'Demo'}" width="100%" style="max-width:520px;display:block;margin:0 auto;border-radius:8px;border:1px solid ${gdDivider};" />
    ${caption ? `<div style="color:${gdTextMuted};font-size:13px;margin-top:12px;">${caption}</div>` : ''}
    ${ctaText ? `<div style="margin-top:20px;"><a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;background-color:${gdCtaBg};color:${gdCtaText};text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">${ctaText}</a></div>` : ''}
    ${showOutlookWarning ? `<div style="margin-top:12px;color:#52525b;font-size:11px;">* GIF plays in Gmail/Apple Mail. Outlook shows the first frame.</div>` : ''}
  </td>
</tr>`;
    }

    case 'video-thumbnail': {
      const { videoUrl = '#', thumbnailUrl, caption, durationLabel, bgColor = '#ffffff' } = block;
      const vtDark = isDarkBg(bgColor);
      const vtTextMuted = vtDark ? '#71717a' : '#52525b';
      const vtDivider = vtDark ? '#27272a' : '#e4e4e7';
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;text-align:center;font-family:'DM Sans',Arial,sans-serif;">
    <a href="${videoUrl}" style="display:inline-block;position:relative;text-decoration:none;">
      <img src="${thumbnailUrl||'https://placehold.co/520x293/18181b/f4f4f5?text=Video+Thumbnail'}" alt="${caption||'Video'}" width="100%" style="max-width:520px;display:block;border-radius:8px;border:1px solid ${vtDivider};" />
    </a>
    ${caption ? `<div style="color:${vtTextMuted};font-size:13px;margin-top:12px;">${caption}</div>` : ''}
    ${durationLabel ? `<div style="margin-top:6px;color:${vtTextMuted};font-size:12px;font-family:'DM Mono',monospace;">${durationLabel}</div>` : ''}
  </td>
</tr>`;
    }

    case 'quick-poll': {
      const { questionText = 'Which area should we prioritize next?', options = [], exportToken, blockId = 'poll', apiUrl = 'https://kore-email-builder.vercel.app', bgColor = '#ffffff' } = block;
      const qpDark = isDarkBg(bgColor);
      const qpTextPrimary = block.textColor || (qpDark ? '#f4f4f5' : '#09090b');
      const qpPillBorder = qpDark ? '#71717a' : '#52525b';
      const qpPillText = qpDark ? '#f4f4f5' : '#09090b';
      const btns = options.map((opt: any) => {
        const href = exportToken ? `${apiUrl}/r/${exportToken}/${blockId}/${opt.id}` : '#';
        return `<td style="padding:4px;"><a href="${href}" style="display:inline-block;padding:10px 20px;border-radius:100px;border:1px solid ${qpPillBorder};color:${qpPillText};text-decoration:none;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">${opt.label||''}</a></td>`;
      }).join('');
      return `<tr>
  <td align="center" style="padding:32px 40px;background-color:${bgColor};font-family:'DM Sans',Arial,sans-serif;">
    <div style="color:${qpTextPrimary};font-size:16px;font-weight:600;margin-bottom:20px;">${questionText}</div>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>${btns}</tr></table>
  </td>
</tr>`;
    }

    case 'rsvp': {
      const { eventTitle = '', eventDate, eventLocation, yesLabel = "Yes, I'll attend", noLabel = "Can't make it", exportToken, blockId = 'rsvp', apiUrl = 'https://kore-email-builder.vercel.app', bgColor = '#ffffff' } = block;
      const rsvpDark = isDarkBg(bgColor);
      const rsvpTextPrimary = block.textColor || (rsvpDark ? '#f4f4f5' : '#09090b');
      const rsvpTextMuted = rsvpDark ? '#71717a' : '#52525b';
      const rsvpNoBg = rsvpDark ? '#27272a' : '#e4e4e7';
      const rsvpNoText = rsvpDark ? '#f4f4f5' : '#09090b';
      const yesUrl = `${apiUrl}/r/${exportToken||'preview'}/${blockId}/yes`;
      const noUrl = `${apiUrl}/r/${exportToken||'preview'}/${blockId}/no`;
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;text-align:center;font-family:'DM Sans',Arial,sans-serif;">
    <div style="color:${rsvpTextPrimary};font-size:20px;font-weight:700;margin-bottom:8px;">${eventTitle}</div>
    ${eventDate ? `<div style="color:${rsvpTextMuted};font-size:14px;margin-bottom:4px;">${eventDate}</div>` : ''}
    ${eventLocation ? `<div style="color:${rsvpTextMuted};font-size:13px;margin-bottom:28px;">${eventLocation}</div>` : ''}
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
      <td style="padding:0 6px;"><a href="${yesUrl}" style="display:inline-block;padding:12px 28px;background-color:#22c55e;color:#09090b;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">${yesLabel}</a></td>
      <td style="padding:0 6px;"><a href="${noUrl}" style="display:inline-block;padding:12px 28px;background-color:${rsvpNoBg};color:${rsvpNoText};text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">${noLabel}</a></td>
    </tr></table>
  </td>
</tr>`;
    }

    case 'feedback-prompt': {
      const { questionText = 'How do you feel about this release?', options = [], exportToken, blockId = 'feedback', apiUrl = 'https://kore-email-builder.vercel.app', bgColor = '#ffffff' } = block;
      const fpDark = isDarkBg(bgColor);
      const fpTextPrimary = block.textColor || (fpDark ? '#f4f4f5' : '#09090b');
      const fpTextMuted = fpDark ? '#71717a' : '#52525b';
      const emojis = options.map((opt: any) => {
        const href = exportToken ? `${apiUrl}/r/${exportToken}/${blockId}/${opt.value}` : '#';
        return `<td style="padding:0 12px;text-align:center;">
          <a href="${href}" style="text-decoration:none;display:inline-block;">
            <div style="font-size:36px;margin-bottom:6px;">${opt.emoji||''}</div>
            <div style="color:${fpTextMuted};font-size:12px;font-family:'DM Sans',Arial,sans-serif;">${opt.label||''}</div>
          </a>
        </td>`;
      }).join('');
      return `<tr>
  <td align="center" style="padding:32px 40px;background-color:${bgColor};font-family:'DM Sans',Arial,sans-serif;">
    <div style="color:${fpTextPrimary};font-size:16px;font-weight:600;margin-bottom:20px;">${questionText}</div>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>${emojis}</tr></table>
  </td>
</tr>`;
    }

    case 'known-issues': {
      const { headline = 'Known Issues', issues = [], bgColor = '#ffffff' } = block;
      const kiDark = isDarkBg(bgColor);
      const kiTextPrimary = block.textColor || (kiDark ? '#f4f4f5' : '#09090b');
      const kiTextMuted = kiDark ? '#71717a' : '#52525b';
      const kiRowBorder = kiDark ? '#1a1a1a' : '#e4e4e7';
      const SEV: Record<string, { label: string; color: string; bg: string }> = {
        p1: { label: 'P1', color: '#ef4444', bg: kiDark ? '#1c0a0a' : '#fef2f2' },
        p2: { label: 'P2', color: '#d97706', bg: kiDark ? '#1a1200' : '#fffbeb' },
        p3: { label: 'P3', color: '#3b82f6', bg: kiDark ? '#0a0a1c' : '#eff6ff' },
      };
      const STA: Record<string, { label: string; color: string }> = {
        investigating: { label: 'Investigating', color: '#d97706' },
        in_progress: { label: 'In Progress', color: '#3b82f6' },
        fixed: { label: 'Fixed', color: '#22c55e' },
      };
      const issueRows = issues.map((issue: any, i: number) => {
        const sev = SEV[issue.severity] || SEV.p3;
        const sta = STA[issue.status] || STA.investigating;
        const borderB = i < issues.length - 1 ? `border-bottom:1px solid ${kiRowBorder};` : '';
        return `<tr>
          <td style="padding:12px 0;${borderB}vertical-align:middle;">
            <table width="100%" cellpadding="0" cellspacing="0"><tbody><tr>
              <td width="40" style="vertical-align:middle;padding-right:12px;"><span style="display:inline-block;padding:2px 8px;border-radius:4px;background-color:${sev.bg};color:${sev.color};font-size:11px;font-weight:800;white-space:nowrap;">${sev.label}</span></td>
              <td style="color:${kiTextPrimary};font-size:14px;">${issue.link ? `<a href="${issue.link}" style="color:${kiTextPrimary};text-decoration:underline;">${issue.title||''}</a>` : (issue.title||'')}</td>
              <td style="text-align:right;color:${sta.color};font-size:12px;font-weight:600;white-space:nowrap;padding-left:12px;">${sta.label}</td>
            </tr></tbody></table>
          </td>
        </tr>`;
      }).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    <div style="color:${kiTextMuted};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:20px;">${headline}</div>
    <table width="100%" cellpadding="0" cellspacing="0"><tbody>${issueRows}</tbody></table>
  </td>
</tr>`;
    }

    case 'roadmap-preview': {
      const { items = [], bgColor = '#ffffff' } = block;
      const rpDark = isDarkBg(bgColor);
      const rpTextPrimary = block.textColor || (rpDark ? '#f4f4f5' : '#09090b');
      const rpTextMuted = rpDark ? '#71717a' : '#52525b';
      const STATUS: Record<string, { label: string; color: string; bg: string }> = {
        now:   { label: 'Now',   color: '#22c55e', bg: rpDark ? '#052e16' : '#f0fdf4' },
        next:  { label: 'Next',  color: '#3b82f6', bg: rpDark ? '#0a0a1c' : '#eff6ff' },
        later: { label: 'Later', color: rpTextMuted, bg: rpDark ? '#1a1a1a' : '#f4f4f5' },
      };
      const itemsHTML = items.map((item: any) => {
        const cfg = STATUS[item.status] || STATUS.later;
        return `<tr><td style="padding-bottom:14px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tbody><tr>
            <td style="vertical-align:top;padding-top:2px;padding-right:12px;"><span style="display:inline-block;padding:3px 10px;border-radius:100px;background-color:${cfg.bg};color:${cfg.color};font-size:11px;font-weight:700;white-space:nowrap;">${cfg.label}</span></td>
            <td style="vertical-align:top;">
              <div style="color:${rpTextPrimary};font-size:14px;font-weight:600;">${item.label||''}</div>
              ${item.description ? `<div style="color:${rpTextMuted};font-size:12px;margin-top:2px;">${item.description}</div>` : ''}
            </td>
          </tr></tbody></table>
        </td></tr>`;
      }).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    <div style="color:${rpTextMuted};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:20px;">Roadmap</div>
    <table width="100%" cellpadding="0" cellspacing="0"><tbody>${itemsHTML}</tbody></table>
  </td>
</tr>`;
    }

    case 'team-attribution': {
      const { headline = 'Built by', members = [], bgColor = '#ffffff' } = block;
      const taDark = isDarkBg(bgColor);
      const taTextPrimary = block.textColor || (taDark ? '#f4f4f5' : '#09090b');
      const taTextMuted = taDark ? '#71717a' : '#52525b';
      const taAvatarBg = taDark ? '#27272a' : '#e4e4e7';
      const membersHTML = members.map((m: any) => `<td style="padding-right:24px;vertical-align:middle;white-space:nowrap;">
        <table cellpadding="0" cellspacing="0"><tbody><tr>
          <td style="vertical-align:middle;padding-right:10px;">
            ${m.avatarUrl ? `<img src="${m.avatarUrl}" alt="${m.name||''}" width="36" height="36" style="border-radius:50%;display:block;" />` : `<div style="width:36px;height:36px;border-radius:50%;background-color:${taAvatarBg};text-align:center;line-height:36px;color:${taTextPrimary};font-size:14px;font-weight:700;">${(m.name||'?').charAt(0)}</div>`}
          </td>
          <td style="vertical-align:middle;">
            <div style="color:${taTextPrimary};font-size:13px;font-weight:600;">${m.name||''}</div>
            <div style="color:${taTextMuted};font-size:12px;">${m.role||''}</div>
          </td>
        </tr></tbody></table>
      </td>`).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:24px 40px;font-family:'DM Sans',Arial,sans-serif;">
    ${headline ? `<div style="color:${taTextMuted};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;">${headline}</div>` : ''}
    <table cellpadding="0" cellspacing="0"><tbody><tr>${membersHTML}</tr></tbody></table>
  </td>
</tr>`;
    }

    case 'incident-retro': {
      const { incidentId = '', date = '', duration = '', impact = '', rootCause = '', fixApplied = '', actionItems = [], bgColor = '#ffffff' } = block;
      const irDark = isDarkBg(bgColor);
      const irTextPrimary = block.textColor || (irDark ? '#f4f4f5' : '#09090b');
      const irTextMuted = irDark ? '#71717a' : '#52525b';
      const irItemColor = irDark ? '#a1a1aa' : '#52525b';
      const irBadgeBg = irDark ? '#1c0a0a' : '#fef2f2';
      const fields = [
        { label: 'Date', value: date },
        { label: 'Duration', value: duration },
        { label: 'Impact', value: impact },
        { label: 'Root Cause', value: rootCause },
        { label: 'Fix Applied', value: fixApplied },
      ];
      const fieldRows = fields.map(f => `<tr>
        <td style="color:${irTextMuted};font-size:13px;padding-bottom:12px;padding-right:24px;vertical-align:top;white-space:nowrap;">${f.label}</td>
        <td style="color:${irTextPrimary};font-size:13px;padding-bottom:12px;line-height:1.6;">${f.value}</td>
      </tr>`).join('');
      const actionHTML = actionItems.length > 0 ? `<div style="margin-top:8px;">
        <div style="color:${irTextMuted};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Action Items</div>
        <ul style="margin:0;padding:0 0 0 20px;">
          ${actionItems.map((item: string) => `<li style="color:${irItemColor};font-size:13px;line-height:1.7;margin-bottom:4px;">${item}</li>`).join('')}
        </ul>
      </div>` : '';
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <span style="display:inline-block;padding:4px 10px;border-radius:4px;background-color:${irBadgeBg};color:#ef4444;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;">Incident Retro</span>
      <span style="color:${irTextMuted};font-size:13px;font-family:'DM Mono',monospace;">${incidentId}</span>
    </div>
    <table cellpadding="0" cellspacing="0"><tbody>${fieldRows}</tbody></table>
    ${actionHTML}
  </td>
</tr>`;
    }

    default:
      return `<p style="margin: 0; color: #000000; font-size: 14px;">
        ${block.title || 'Content'}
      </p>`;
  }
}

function generateFooterHTML(footer: any): string {
  const padding = resolvePaddingToPx(footer.padding, 'headerFooter');
  const backgroundColor = colorValueToHex(footer.backgroundColor || '#f9fafb');
  const messageColor = colorValueToHex(footer.messageColor || '#64748B');
  const teamNameColor = colorValueToHex(footer.teamNameColor || '#000000');
  const linkColor = colorValueToHex(footer.linkColor || '#000000');
  const disclaimerColor = colorValueToHex(footer.disclaimerColor || '#9CA3AF');
  
  return `<tr>
  <td style="padding: ${padding}; background-color: ${backgroundColor}; border-top: 1px solid #e5e7eb;">
    ${footer.message ? `<p style="margin: 0 0 8px 0; color: ${messageColor}; font-size: ${footer.messageFontSize || '14px'};">
      ${footer.message}
    </p>` : ''}
    ${footer.teamName ? `<p style="margin: 0 0 16px 0; color: ${teamNameColor}; font-size: ${footer.teamNameFontSize || '16px'}; font-weight: 600;">
      ${footer.teamName}
    </p>` : ''}
    <div style="margin-bottom: 16px;">
      ${footer.email ? `<a href="mailto:${footer.email}" style="color: ${linkColor}; text-decoration: none; margin-right: 16px;">
        ${footer.email}
      </a>` : ''}
      ${footer.website ? `<a href="${footer.website}" style="color: ${linkColor}; text-decoration: none;">
        ${footer.website}
      </a>` : ''}
    </div>
    ${footer.disclaimer ? `<p style="margin: 0; color: ${disclaimerColor}; font-size: ${footer.disclaimerFontSize || '12px'}; line-height: 1.5;">
      ${footer.disclaimer}
    </p>` : ''}
  </td>
</tr>`;
}
