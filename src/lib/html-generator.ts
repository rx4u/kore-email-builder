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
