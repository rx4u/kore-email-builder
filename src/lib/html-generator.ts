// Generates production-ready HTML email code from email state
import type { EmailState } from '../components/PropertiesPanel';
import { colorValueToHex } from './color-token-system';
import { getEmailWrapperStyles } from './global-theme';
import { PADDING_SCALE, HEADER_FOOTER_PADDING_SCALE, type PaddingSize } from './layout-scales';
import { FONT_SIZE_SCALE, type FontSize } from './typography-scales';
import { KORE_LOGO_DEFAULT, koreLogoDark, koreLogoLight } from '../components/email-blocks/HeaderBlock';

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
  if (['hero', 'changelog', 'deprecation', 'metrics-snapshot', 'nps-rating'].includes(block.type)) {
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
      const { badge, showBadge, title, subtitle, showSubtitle, ctaText, ctaUrl, showCta, bgColor = '#09090b', textColor = '#f4f4f5', displaySize = 56 } = block;
      return `<tr>
  <td align="center" bgcolor="${bgColor}" style="background-color:${bgColor}; padding:64px 40px; text-align:center;">
    ${showBadge && badge ? `<div style="margin-bottom:16px;"><span style="display:inline-block; padding:4px 14px; border-radius:100px; border:1px solid ${textColor}40; color:${textColor}; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; font-family:'DM Sans',Arial,sans-serif;">${badge}</span></div>` : ''}
    <div style="font-size:${displaySize}px; font-weight:800; line-height:1.1; color:${textColor}; margin:0 0 16px; font-family:'DM Serif Display',Georgia,serif; letter-spacing:-0.02em;">${title}</div>
    ${showSubtitle && subtitle ? `<div style="font-size:18px; color:${textColor}b3; margin:0 0 32px; font-family:'DM Sans',Arial,sans-serif; line-height:1.6;">${subtitle}</div>` : ''}
    ${showCta && ctaText ? `<a href="${ctaUrl || '#'}" style="display:inline-block; padding:14px 32px; background-color:#f59e0b; color:#09090b; text-decoration:none; border-radius:8px; font-weight:700; font-size:16px; font-family:'DM Sans',Arial,sans-serif;">${ctaText}</a>` : ''}
  </td>
</tr>`;
    }
    
    case 'changelog': {
      const { version = 'v2.1.0', date, sections = [], bgColor = '#09090b' } = block;
      const typeConfig: Record<string, { color: string; label: string }> = {
        feature:     { color: '#22c55e', label: 'New' },
        improvement: { color: '#3b82f6', label: 'Improved' },
        fix:         { color: '#f59e0b', label: 'Fixed' },
        breaking:    { color: '#ef4444', label: 'Breaking' },
        deprecated:  { color: '#a78bfa', label: 'Deprecated' },
      };
      const sectionsHTML = sections.map((section: any) => {
        const cfg = typeConfig[section.type] || typeConfig.feature;
        const items = (section.items || []).map((item: string) =>
          `<li style="color:#a1a1aa;font-size:14px;line-height:1.7;margin-bottom:4px;">${item}</li>`
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
      <span style="display:inline-block;padding:4px 10px;border-radius:6px;background:#27272a;color:#f4f4f5;font-size:13px;font-weight:700;font-family:'DM Mono',monospace;">${version}</span>
      ${date ? `<span style="color:#71717a;font-size:13px;margin-left:12px;">${date}</span>` : ''}
    </div>
    ${sectionsHTML}
  </td>
</tr>`;
    }

    case 'deprecation': {
      const { featureName = 'Legacy Auth API v1', deprecatedDate = 'March 1, 2026', eolDate = 'June 1, 2026', migrationPath = '', severity = 'warning', ctaText = 'View Migration Guide', ctaUrl = '#' } = block;
      const borderColor = severity === 'critical' ? '#ef4444' : '#f59e0b';
      const innerBg = severity === 'critical' ? '#1c0a0a' : '#1a1200';
      const badgeText = severity === 'critical' ? 'CRITICAL' : 'DEPRECATION NOTICE';
      return `<tr>
  <td style="padding:24px 40px;background-color:#09090b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${innerBg};border:2px solid ${borderColor};border-radius:8px;">
      <tr>
        <td style="padding:24px 28px;font-family:'DM Sans',Arial,sans-serif;">
          <div style="margin-bottom:16px;"><span style="display:inline-block;padding:3px 10px;border-radius:4px;background:${borderColor};color:#09090b;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">${badgeText}</span></div>
          <div style="color:#f4f4f5;font-size:18px;font-weight:700;margin-bottom:16px;">${featureName}</div>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr><td style="color:#71717a;font-size:13px;padding-bottom:8px;padding-right:24px;white-space:nowrap;">Deprecated:</td><td style="color:#f4f4f5;font-size:13px;font-weight:600;padding-bottom:8px;">${deprecatedDate}</td></tr>
            <tr><td style="color:#71717a;font-size:13px;padding-right:24px;white-space:nowrap;">End of Life:</td><td style="color:${borderColor};font-size:13px;font-weight:700;">${eolDate}</td></tr>
          </table>
          <div style="color:#a1a1aa;font-size:14px;margin-bottom:20px;line-height:1.6;"><strong style="color:#f4f4f5;">Migration path: </strong>${migrationPath}</div>
          ${ctaText ? `<a href="${ctaUrl}" style="display:inline-block;padding:10px 24px;background:${borderColor};color:#09090b;text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;">${ctaText}</a>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>`;
    }

    case 'metrics-snapshot': {
      const { headline, metrics = [], bgColor = '#09090b' } = block;
      const deltaColor = (dir?: string) => dir === 'up' ? '#22c55e' : dir === 'down' ? '#ef4444' : '#71717a';
      const deltaIcon = (dir?: string) => dir === 'up' ? '&#8593;' : dir === 'down' ? '&#8595;' : '&mdash;';
      const cellsHTML = metrics.map((m: any, i: number) =>
        `<td style="text-align:center;padding:0 16px;${i > 0 ? 'border-left:1px solid #27272a;' : ''}">
  <div style="font-size:36px;font-weight:800;color:#f4f4f5;font-family:'DM Mono',monospace;line-height:1;">${m.value}</div>
  ${m.delta ? `<div style="font-size:12px;color:${deltaColor(m.deltaDirection)};margin-top:4px;font-weight:600;">${deltaIcon(m.deltaDirection)} ${m.delta}</div>` : ''}
  <div style="font-size:12px;color:#71717a;margin-top:6px;text-transform:uppercase;letter-spacing:0.06em;">${m.label}</div>
</td>`
      ).join('');
      return `<tr>
  <td bgcolor="${bgColor}" style="background-color:${bgColor};padding:32px 40px;font-family:'DM Sans',Arial,sans-serif;">
    ${headline ? `<div style="color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px;">${headline}</div>` : ''}
    <table width="100%" cellpadding="0" cellspacing="0"><tr>${cellsHTML}</tr></table>
  </td>
</tr>`;
    }

    case 'nps-rating': {
      const { questionText = 'How satisfied are you with this release?', lowLabel = 'Not at all', highLabel = 'Extremely satisfied', exportToken, blockId = 'nps', apiUrl = 'https://app.kore-email.com' } = block;
      const npsColors = ['#ef4444','#f97316','#f97316','#fb923c','#fb923c','#eab308','#eab308','#84cc16','#84cc16','#22c55e','#22c55e'];
      const cellsHTML = npsColors.map((color, i) => {
        const href = exportToken ? `${apiUrl}/r/${exportToken}/${blockId}/${i}` : '#';
        return `<td style="padding:0 2px;"><a href="${href}" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;background-color:${color};color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:6px;font-family:'DM Sans',Arial,sans-serif;">${i}</a></td>`;
      }).join('');
      return `<tr>
  <td align="center" style="padding:32px 24px;background-color:#09090b;font-family:'DM Sans',Arial,sans-serif;">
    <div style="color:#f4f4f5;font-size:16px;margin-bottom:20px;font-weight:500;">${questionText}</div>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 8px;"><tr>${cellsHTML}</tr></table>
    <table width="480" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="color:#71717a;font-size:11px;">${lowLabel}</td>
        <td align="right" style="color:#71717a;font-size:11px;">${highLabel}</td>
      </tr>
    </table>
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
