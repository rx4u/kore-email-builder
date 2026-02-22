import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { springs } from '../lib/motion-config';

interface CodeViewerProps {
  code: string;
}

type TokenType = 'tag' | 'attrName' | 'attrValue' | 'comment' | 'text'
  | 'cssComment' | 'cssSelector' | 'cssProperty' | 'cssValue' | 'cssBracket' | 'cssPunctuation' | 'cssText';
type Token = { type: TokenType; text: string };

/** Tokenize CSS (e.g. inside <style>) and push to out */
function highlightCSS(css: string, out: Token[]): void {
  let i = 0;
  let state: 'selector' | 'rule' = 'selector';
  const len = css.length;
  while (i < len) {
    if (css.slice(i, i + 2) === '/*') {
      const end = css.indexOf('*/', i);
      const endIdx = end === -1 ? len : end + 2;
      out.push({ type: 'cssComment', text: css.slice(i, endIdx) });
      i = endIdx;
      continue;
    }
    if (css[i] === '{') {
      out.push({ type: 'cssBracket', text: '{' });
      i++;
      state = 'rule';
      continue;
    }
    if (css[i] === '}') {
      out.push({ type: 'cssBracket', text: '}' });
      i++;
      state = 'selector';
      continue;
    }
    if (state === 'rule') {
      const propMatch = css.slice(i).match(/^\s*([\w-]+)\s*:\s*([^;]*;?)/);
      if (propMatch) {
        const full = propMatch[0];
        const colonIdx = full.indexOf(':');
        const afterColon = full.slice(colonIdx + 1);
        out.push({ type: 'cssProperty', text: propMatch[1] });
        out.push({ type: 'cssPunctuation', text: ':' });
        out.push({ type: 'cssValue', text: afterColon });
        i += full.length;
        continue;
      }
    }
    if (state === 'selector') {
      let j = i;
      while (j < len && css[j] !== '{' && css.slice(j, j + 2) !== '/*') j++;
      if (j > i) {
        out.push({ type: 'cssSelector', text: css.slice(i, j) });
        i = j;
        continue;
      }
    }
    const ws = css.slice(i).match(/^\s+/);
    if (ws) {
      out.push({ type: 'cssText', text: ws[0] });
      i += ws[0].length;
      continue;
    }
    out.push({ type: 'cssText', text: css[i] });
    i++;
  }
}

/** HTML + CSS syntax highlight: <style> content is tokenized as CSS */
function highlightHTML(html: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const len = html.length;
  let nextTextIsCSS = false;

  while (i < len) {
    if (html.slice(i, i + 4) === '<!--') {
      const end = html.indexOf('-->', i);
      const endIdx = end === -1 ? len : end + 3;
      out.push({ type: 'comment', text: html.slice(i, endIdx) });
      i = endIdx;
      nextTextIsCSS = false;
      continue;
    }
    if (html[i] === '<') {
      const close = html[i + 1] === '/';
      let j = i + (close ? 2 : 1);
      while (j < len && /[\w-]/.test(html[j])) j++;
      const tagSlice = html.slice(i, j);
      const tagName = tagSlice.replace(/^<\/?/, '').trim().toLowerCase();
      out.push({ type: 'tag', text: tagSlice });
      i = j;
      if (close && tagName === 'style') {
        nextTextIsCSS = false;
      }
      continue;
    }
    if (html[i] === '>') {
      const tagName = (() => {
        let k = i - 1;
        while (k >= 0 && html[k] !== '<') k--;
        if (k < 0) return '';
        const slice = html.slice(k, i);
        const m = slice.match(/<(\/?)\s*([\w-]+)/);
        return m ? (m[1] ? '/' : '') + m[2].toLowerCase() : '';
      })();
      out.push({ type: 'tag', text: '>' });
      i++;
      nextTextIsCSS = tagName === 'style';
      continue;
    }
    if (html[i] === '"') {
      let j = i + 1;
      while (j < len && html[j] !== '"') j++;
      j++;
      out.push({ type: 'attrValue', text: html.slice(i, j) });
      i = j;
      continue;
    }
    if (html[i] === "'") {
      let j = i + 1;
      while (j < len && html[j] !== "'") j++;
      j++;
      out.push({ type: 'attrValue', text: html.slice(i, j) });
      i = j;
      continue;
    }
    const attrNameMatch = html.slice(i).match(/^([\w-]+)(\s*)=/);
    if (attrNameMatch) {
      out.push({ type: 'attrName', text: attrNameMatch[1] });
      i += attrNameMatch[1].length;
      continue;
    }
    // Plain text: until next < or " or '
    let j = i;
    while (j < len && html[j] !== '<' && html[j] !== '"' && html[j] !== "'") j++;
    if (j > i) {
      const slice = html.slice(i, j);
      if (nextTextIsCSS) {
        highlightCSS(slice, out);
        nextTextIsCSS = false;
      } else {
        out.push({ type: 'text', text: slice });
      }
      i = j;
    } else {
      out.push({ type: 'text', text: html[i] });
      i++;
    }
  }
  return out;
}

const tokenStyle: Record<string, React.CSSProperties> = {
  tag: { color: 'var(--tag-color, #2563eb)' },
  attrName: { color: 'var(--attr-color, #b45309)' },
  attrValue: { color: 'var(--value-color, #047857)' },
  comment: { color: 'var(--muted-foreground)', fontStyle: 'italic' },
  text: { color: 'var(--foreground)' },
  cssComment: { color: 'var(--muted-foreground)', fontStyle: 'italic' },
  cssSelector: { color: 'var(--css-selector-color, #7c3aed)' },
  cssProperty: { color: 'var(--attr-color, #b45309)' },
  cssValue: { color: 'var(--value-color, #047857)' },
  cssBracket: { color: 'var(--foreground)' },
  cssPunctuation: { color: 'var(--foreground)' },
  cssText: { color: 'var(--foreground)' },
};

export function CodeViewer({ code }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => highlightHTML(code), [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('HTML copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy HTML');
    }
  };

  return (
    <div
      className="flex flex-col bg-card border rounded-md overflow-hidden shrink-0"
      style={{ height: '100%', minHeight: 0, width: '100%', maxWidth: '100%' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 shrink-0">
        <span className="text-sm text-muted-foreground font-medium">email.html</span>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={springs.snappy}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="h-9 w-9"
            title={copied ? 'Copied' : 'Copy HTML'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </motion.div>
      </div>

      <ScrollArea
        className="flex-1 min-h-0 w-full overflow-hidden"
        viewportStyle={{ minHeight: 0, height: '100%', overflow: 'auto' }}
      >
        <pre
          className="p-4 text-sm font-mono leading-relaxed w-full max-w-full box-border"
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <code className="block min-w-0 w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {tokens.map((t, idx) => (
              <span key={idx} style={tokenStyle[t.type] ?? tokenStyle.text}>
                {t.text}
              </span>
            ))}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
}
