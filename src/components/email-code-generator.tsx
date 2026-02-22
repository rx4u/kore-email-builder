// Generates production-ready HTML email code from template type

export function generateEmailHTML(templateType: string): string {
  const emailBoilerplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
    body { margin: 0; padding: 0; }
    table { border-collapse: collapse; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Prevent WebKit and Windows mobile changing default text sizes */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    
    /* Remove spacing between tables in Outlook 2007 and up */
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  
  <!-- EMAIL CONTAINER -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- EMAIL TEMPLATE -->
        <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb;">
          <tbody>
            
            <!-- HEADER BLOCK -->
            <tr>
              <td style="padding: 32px 32px 24px 32px; background-color: #ffffff;">
                <!-- Logo + Title -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 12px 0;">
                  <tbody>
                    <tr>
                      <td style="vertical-align: middle; padding-right: 16px;">
                        <div style="width: 100px; height: auto;">
                          <!-- INSERT YOUR LOGO HERE -->
                          <img src="YOUR_LOGO_URL_HERE" alt="Kore.ai" width="100" style="display: block;" />
                        </div>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="font-size: 24px; font-weight: 600; color: #111827; letter-spacing: -0.5px;">
                          ${getTemplateTitle(templateType)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <!-- Date -->
                <div style="font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  ${getCurrentDate()}
                </div>
              </td>
            </tr>
            
            ${getTemplateContent(templateType)}
            
          </tbody>
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;

  return emailBoilerplate;
}

function getTemplateTitle(templateType: string): string {
  const titles: Record<string, string> = {
    'release-notes': 'Release Notes v3.2.0',
    'major-feature': 'Product Updates',
    'quick-updates': 'Weekly Updates',
    'integration-expansion': 'Integration Updates',
    'critical-notice': 'Important Notice',
    'comprehensive': 'Product Updates',
    'with-patterns': 'Product Updates'
  };
  return titles[templateType] || 'Product Updates';
}

function getCurrentDate(): string {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

function getTemplateContent(templateType: string): string {
  switch (templateType) {
    case 'release-notes':
      return getReleaseNotesContent();
    case 'major-feature':
      return getMajorFeatureContent();
    case 'quick-updates':
      return getQuickUpdatesContent();
    case 'integration-expansion':
      return getIntegrationExpansionContent();
    case 'critical-notice':
      return getCriticalNoticeContent();
    case 'comprehensive':
      return getComprehensiveContent();
    case 'with-patterns':
      return getWithPatternsContent();
    default:
      return getReleaseNotesContent();
  }
}

function getReleaseNotesContent(): string {
  return `
            <!-- FEATURE WITH SCREENSHOT BLOCK -->
            <tr>
              <td style="padding: 32px 32px; background-color: #ffffff; border-top: 1px solid #e5e7eb;">
                <div style="margin-bottom: 12px;">
                  <span style="font-size: 22px; font-weight: 600; color: #111827; margin-right: 12px; vertical-align: middle;">
                    Multi-Agent Orchestration
                  </span>
                  <span style="background-color: #004EEB; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                    NEW
                  </span>
                </div>
                <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                  Coordinate multiple AI agents with improved control and monitoring capabilities. Build complex workflows that leverage specialized agents working together seamlessly.
                </p>
                
                <!-- Screenshot -->
                <div style="margin: 20px 0;">
                  <img src="YOUR_SCREENSHOT_URL_HERE" alt="Multi-Agent Orchestration dashboard" style="max-width: 100%; height: auto; display: block; border-radius: 4px; border: 1px solid #e5e7eb;" />
                </div>
                
                <!-- Bullet points -->
                <ul style="margin: 16px 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                  <li>Intelligent task routing across specialized agents</li>
                  <li>Real-time monitoring and performance analytics</li>
                  <li>Fallback strategies for enhanced reliability</li>
                </ul>
                
                <a href="https://kore.ai/docs/multi-agent-orchestration" style="color: #004EEB; font-size: 15px; font-weight: 600; text-decoration: none;">
                  View documentation →
                </a>
              </td>
            </tr>
            
            <!-- CONTACT FOOTER BLOCK -->
            <tr>
              <td style="background-color: #f9fafb; padding: 32px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 15px; line-height: 1.5;">
                  Thank you for using Kore.ai.
                </p>
                <div style="margin-bottom: 6px; color: #111827; font-size: 14px; font-weight: 600;">
                  Kore.ai Product Team
                </div>
                <div style="margin-bottom: 16px; color: #6b7280; font-size: 14px;">
                  <a href="mailto:releases@kore.ai" style="color: #004EEB; text-decoration: none;">
                    releases@kore.ai
                  </a>
                  •
                  <a href="https://kore.ai" style="color: #004EEB; text-decoration: none;">
                    kore.ai
                  </a>
                </div>
                <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                  This email is confidential and intended for the recipient specified.
                </p>
              </td>
            </tr>`;
}

function getMajorFeatureContent(): string {
  return `
            <!-- FEATURE WITH SCREENSHOT BLOCK -->
            <tr>
              <td style="padding: 32px 32px; background-color: #ffffff; border-top: 1px solid #e5e7eb;">
                <div style="margin-bottom: 12px;">
                  <span style="font-size: 22px; font-weight: 600; color: #111827; margin-right: 12px; vertical-align: middle;">
                    Multi-Agent Orchestration
                  </span>
                  <span style="background-color: #004EEB; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                    NEW
                  </span>
                </div>
                <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                  Coordinate multiple AI agents with improved control and monitoring capabilities. Build complex workflows that leverage specialized agents working together seamlessly.
                </p>
                <div style="margin: 20px 0;">
                  <img src="YOUR_SCREENSHOT_URL_HERE" alt="Multi-Agent Orchestration dashboard" style="max-width: 100%; height: auto; display: block; border-radius: 4px; border: 1px solid #e5e7eb;" />
                </div>
                <ul style="margin: 16px 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                  <li>Intelligent task routing across specialized agents</li>
                  <li>Real-time monitoring and performance analytics</li>
                  <li>Fallback strategies for enhanced reliability</li>
                </ul>
                <a href="https://kore.ai/docs/multi-agent-orchestration" style="color: #004EEB; font-size: 15px; font-weight: 600; text-decoration: none;">
                  Learn more →
                </a>
              </td>
            </tr>
            
            <!-- CTA FOOTER BLOCK -->
            <tr>
              <td style="background-color: #f0f6ff; padding: 32px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <div style="margin-bottom: 8px; font-size: 18px; font-weight: 600; color: #111827;">
                  Want to Learn More?
                </div>
                <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                  Explore the complete documentation for detailed information.
                </p>
                <a href="https://kore.ai/docs" style="display: inline-block; background-color: #004EEB; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
                  View Documentation
                </a>
              </td>
            </tr>
            
            <!-- CONTACT FOOTER BLOCK -->
            <tr>
              <td style="background-color: #f9fafb; padding: 32px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 15px; line-height: 1.5;">
                  Thank you for your continued support.
                </p>
                <div style="margin-bottom: 6px; color: #111827; font-size: 14px; font-weight: 600;">
                  Kore.ai Product Team
                </div>
                <div style="margin-bottom: 16px; color: #6b7280; font-size: 14px;">
                  <a href="mailto:releases@kore.ai" style="color: #004EEB; text-decoration: none;">releases@kore.ai</a>
                  •
                  <a href="https://kore.ai" style="color: #004EEB; text-decoration: none;">kore.ai</a>
                </div>
                <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                  This email is confidential and intended for the recipient specified.
                </p>
              </td>
            </tr>`;
}

function getQuickUpdatesContent(): string {
  return `
            <!-- TEXT ONLY BLOCK -->
            <tr>
              <td style="padding: 32px 32px; background-color: #ffffff; border-top: 1px solid #e5e7eb;">
                <div style="margin-bottom: 8px;">
                  <span style="font-size: 20px; font-weight: 600; color: #111827; margin-right: 10px; vertical-align: middle;">
                    Enterprise Encryption
                  </span>
                  <span style="background-color: #004EEB; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                    NEW
                  </span>
                </div>
                <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                  Customer-Managed Key (CMK) encryption for Azure deployments, giving you complete control over encryption keys and data security.
                </p>
                <a href="https://kore.ai/docs/security" style="color: #004EEB; font-size: 15px; font-weight: 600; text-decoration: none;">
                  View security documentation →
                </a>
              </td>
            </tr>
            
            <!-- CONTACT FOOTER BLOCK -->
            <tr>
              <td style="background-color: #f9fafb; padding: 32px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 15px; line-height: 1.5;">
                  Questions? We're here to help.
                </p>
                <div style="margin-bottom: 6px; color: #111827; font-size: 14px; font-weight: 600;">
                  Kore.ai Support Team
                </div>
                <div style="margin-bottom: 16px; color: #6b7280; font-size: 14px;">
                  <a href="mailto:support@kore.ai" style="color: #004EEB; text-decoration: none;">support@kore.ai</a>
                  •
                  <a href="https://kore.ai" style="color: #004EEB; text-decoration: none;">kore.ai</a>
                </div>
                <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                  This email is confidential and intended for the recipient specified.
                </p>
              </td>
            </tr>`;
}

function getIntegrationExpansionContent(): string {
  return getReleaseNotesContent(); // Same structure for brevity
}

function getCriticalNoticeContent(): string {
  return `
            <!-- WARNING BLOCK -->
            <tr>
              <td style="padding: 32px 32px; background-color: #fffbeb; border-top: 1px solid #fde68a; border-left: 4px solid #f59e0b;">
                <div style="margin-bottom: 10px;">
                  <span style="font-size: 20px; font-weight: 600; color: #92400e; margin-right: 10px; vertical-align: middle;">
                    Deprecation Notice
                  </span>
                  <span style="background-color: #f59e0b; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                    ACTION REQUIRED
                  </span>
                </div>
                <p style="margin: 0 0 16px 0; color: #78350f; font-size: 15px; line-height: 1.6;">
                  Legacy authentication endpoints will be deprecated on December 31, 2025. Please migrate to the new OAuth 2.0 authentication flow before this date to avoid service interruption.
                </p>
                <a href="https://kore.ai/docs/auth-migration" style="color: #92400e; font-size: 15px; font-weight: 600; text-decoration: none;">
                  View migration guide →
                </a>
              </td>
            </tr>
            
            <!-- CONTACT FOOTER BLOCK -->
            <tr>
              <td style="background-color: #f9fafb; padding: 32px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 15px; line-height: 1.5;">
                  Contact us with any questions about this change.
                </p>
                <div style="margin-bottom: 6px; color: #111827; font-size: 14px; font-weight: 600;">
                  Kore.ai Platform Team
                </div>
                <div style="margin-bottom: 16px; color: #6b7280; font-size: 14px;">
                  <a href="mailto:platform@kore.ai" style="color: #004EEB; text-decoration: none;">platform@kore.ai</a>
                  •
                  <a href="https://kore.ai" style="color: #004EEB; text-decoration: none;">kore.ai</a>
                </div>
                <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                  This email is confidential and intended for the recipient specified.
                </p>
              </td>
            </tr>`;
}

function getComprehensiveContent(): string {
  return getReleaseNotesContent(); // Same structure for brevity
}

function getWithPatternsContent(): string {
  return getReleaseNotesContent(); // Same structure for brevity
}
