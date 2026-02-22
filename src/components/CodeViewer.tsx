import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Download, Mail, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { springs } from '../lib/motion-config';
import { copyForGmail, sendTest } from '../lib/export';

interface CodeViewerProps {
  code: string;
  subject?: string;
}

type TokenType = 'tag' | 'attrName' | 'attrValue' | 'comment' | 'text'
  | 'cssComment' | 'cssSelector' | 'cssProperty' | 'cssValue' | 'cssBracket' | 'cssPunctuation' | 'cssText';
type Token = { type: TokenType; text: string };

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

function SendTestDialog({ html, subject }: { html: string; subject: string }) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to.trim()) {
      toast.error('Enter a recipient email address');
      return;
    }
    setSending(true);
    try {
      await sendTest(html, subject, to.trim());
      toast.success(`Test email sent to ${to.trim()}`);
      setOpen(false);
      setTo('');
    } catch {
      toast.error('Failed to send test email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs hidden" title="Send test email">
          <Mail className="w-3.5 h-3.5" />
          Send Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Test Email</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="send-test-subject" className="text-xs text-muted-foreground">Subject</Label>
            <Input
              id="send-test-subject"
              value={subject}
              readOnly
              className="text-sm bg-muted/40 cursor-default"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="send-test-to" className="text-xs text-muted-foreground">Recipient</Label>
            <Input
              id="send-test-to"
              type="email"
              placeholder="you@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              className="text-sm"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sending}
            className="gap-2"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {sending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CodeViewer({ code, subject = 'Email Preview' }: CodeViewerProps) {
  const [gmailLoading, setGmailLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => highlightHTML(code), [code]);

  const handleCopyForGmail = async () => {
    setGmailLoading(true);
    try {
      await copyForGmail(code);
      toast.success('Copied for Gmail — paste directly into Compose');
    } catch {
      toast.error('Failed to copy for Gmail. Is the API running?');
    } finally {
      setGmailLoading(false);
    }
  };

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('HTML copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy HTML');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="flex flex-col bg-card border rounded-md overflow-hidden shrink-0"
      style={{ height: '100%', minHeight: 0, width: '100%', maxWidth: '100%' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 shrink-0 gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground font-medium">email.html</span>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springs.snappy}>
            <Button
              variant="default"
              size="sm"
              onClick={handleCopyForGmail}
              disabled={gmailLoading}
              className="gap-1.5 h-9 text-xs bg-primary hover:bg-primary/80 text-white border-0"
              title="Copy inlined HTML for pasting into Gmail"
            >
              {gmailLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Copy className="w-3.5 h-3.5" />}
              {gmailLoading ? 'Inlining…' : 'Copy for Gmail'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springs.snappy}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyHTML}
              className="gap-1.5 h-9 text-xs"
              title={copied ? 'Copied' : 'Copy raw HTML'}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy HTML
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springs.snappy}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-1.5 h-9 text-xs"
              title="Download email.html"
            >
              <Download className="w-3.5 h-3.5" />
              Download .html
            </Button>
          </motion.div>

          <SendTestDialog html={code} subject={subject} />
        </div>
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
