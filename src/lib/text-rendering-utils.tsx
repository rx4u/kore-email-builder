/**
 * Text Rendering Utilities
 * 
 * Utilities for rendering text with preserved line breaks in HTML/email contexts.
 * Converts newline characters (\n) to HTML <br> elements for proper display.
 */

import React from 'react';

/**
 * Renders text with line breaks preserved
 * Converts \n characters to <br> elements for proper HTML rendering
 * 
 * Use this for any user-entered text that might contain multiple lines:
 * - Descriptions
 * - Messages
 * - Disclaimers
 * - Any textarea content
 * 
 * @param text - The text content (may contain \n newline characters)
 * @returns React fragment with text and <br> elements, or null if text is empty
 * 
 * @example
 * // Single line - returns as-is
 * renderTextWithLineBreaks("Hello world")
 * // Returns: "Hello world"
 * 
 * @example
 * // Multi-line - adds <br> elements
 * renderTextWithLineBreaks("Line 1\nLine 2\nLine 3")
 * // Returns: <>Line 1<br />Line 2<br />Line 3</>
 * 
 * @example
 * // Usage in component
 * <p style={descriptionStyle}>
 *   {renderTextWithLineBreaks(description)}
 * </p>
 */
export const renderTextWithLineBreaks = (text: string | undefined): React.ReactNode => {
  // Handle empty/undefined text
  if (!text) return null;
  
  // Split by newline character
  const lines = text.split('\n');
  
  // If only one line, return as-is (optimization: no <br> needed)
  if (lines.length === 1) {
    return text;
  }
  
  // Map lines to React fragments with <br> between them
  // Note: We don't add a <br> after the last line
  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

/**
 * Converts newlines to <br> tags for raw HTML export
 * Use this when generating HTML strings for email clients (not JSX)
 * 
 * @param text - The text content
 * @returns HTML string with <br> tags instead of \n characters
 * 
 * @example
 * convertNewlinesToBr("Line 1\nLine 2")
 * // Returns: "Line 1<br>Line 2"
 */
export const convertNewlinesToBr = (text: string | undefined): string => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
};
