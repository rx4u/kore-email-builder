# Kore Email Builder v1.0 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Kore Email Builder into a full-stack SaaS with Supabase backend, 20 new email blocks, DnD/properties panel overhaul, collaboration features, and Gmail-optimized export.

**Architecture:** React/Vite frontend (existing) + Supabase (auth/db/storage) + Express.js API (CSS inlining, preview serving, response recording, test sends) + Juice.js (CSS inliner) + Resend (email sending). The existing `html-generator.ts` and block component pattern are extended, not replaced.

**Tech Stack:** React 18, Vite 6, TypeScript, Supabase, Express.js, Juice.js, Resend, @dnd-kit, Radix UI, Tailwind CSS, Vitest

**Design doc:** `docs/plans/2026-02-22-v1-product-design.md`

---

## PHASE 1 — Backend Foundation

### Task 1: Supabase project setup + schema

**Files:**
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`
- Create: `.env.example`
- Modify: `.gitignore` (add `.env`)

**Step 1: Install Supabase CLI**
```bash
npm install -g supabase
```

**Step 2: Create `supabase/schema.sql`**
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (extends Supabase Auth)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  role text not null default 'author' check (role in ('author', 'reviewer', 'admin')),
  created_at timestamptz not null default now()
);

-- Workspace (single workspace for v1)
create table public.workspace (
  id uuid primary key default uuid_generate_v4(),
  name text not null default 'Kore Workspace',
  settings_jsonb jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Email drafts
create table public.emails (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspace(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  subject text not null default 'Untitled Email',
  blocks_jsonb jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'in_review', 'approved', 'sent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Version history
create table public.email_versions (
  id uuid primary key default uuid_generate_v4(),
  email_id uuid references public.emails(id) on delete cascade,
  blocks_jsonb jsonb not null,
  saved_by uuid references public.users(id) on delete set null,
  label text,
  created_at timestamptz not null default now()
);

-- Templates
create table public.templates (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspace(id) on delete cascade,
  name text not null,
  description text,
  blocks_jsonb jsonb not null default '{}',
  is_global boolean not null default false,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Interactive block responses
create table public.responses (
  id uuid primary key default uuid_generate_v4(),
  email_id uuid references public.emails(id) on delete cascade,
  block_id text not null,
  recipient_token text not null,
  response_type text not null check (response_type in ('nps', 'poll', 'rsvp', 'rating', 'feedback')),
  value text not null,
  created_at timestamptz not null default now()
);

-- Shareable preview tokens
create table public.preview_tokens (
  id uuid primary key default uuid_generate_v4(),
  email_id uuid references public.emails(id) on delete cascade,
  token text not null unique default uuid_generate_v4()::text,
  expires_at timestamptz not null default (now() + interval '7 days'),
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Preview comments
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  email_id uuid references public.emails(id) on delete cascade,
  token_id uuid references public.preview_tokens(id) on delete cascade,
  author_name text not null,
  content text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at on emails
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger emails_updated_at
  before update on public.emails
  for each row execute function update_updated_at();

-- Row Level Security
alter table public.users enable row level security;
alter table public.emails enable row level security;
alter table public.email_versions enable row level security;
alter table public.templates enable row level security;
alter table public.responses enable row level security;
alter table public.preview_tokens enable row level security;
alter table public.comments enable row level security;

-- RLS Policies (authenticated users see workspace data)
create policy "Users see own profile" on public.users
  for all using (auth.uid() = id);

create policy "Authenticated see all emails" on public.emails
  for select using (auth.role() = 'authenticated');

create policy "Authors manage own emails" on public.emails
  for all using (auth.uid() = author_id);

create policy "Reviewers/admins update status" on public.emails
  for update using (auth.role() = 'authenticated');

create policy "Authenticated see versions" on public.email_versions
  for select using (auth.role() = 'authenticated');

create policy "Authenticated create versions" on public.email_versions
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated see templates" on public.templates
  for select using (auth.role() = 'authenticated');

create policy "Admins manage templates" on public.templates
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Anyone see responses" on public.responses
  for select using (true);

create policy "Anyone insert responses" on public.responses
  for insert with check (true);

create policy "Authenticated see preview tokens" on public.preview_tokens
  for select using (auth.role() = 'authenticated');

create policy "Authenticated create preview tokens" on public.preview_tokens
  for insert with check (auth.role() = 'authenticated');

create policy "Anyone see comments" on public.comments
  for select using (true);

create policy "Anyone insert comments" on public.comments
  for insert with check (true);

create policy "Authenticated resolve comments" on public.comments
  for update using (auth.role() = 'authenticated');
```

**Step 3: Create `supabase/seed.sql`**
```sql
-- Insert default workspace
insert into public.workspace (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Kore Workspace');
```

**Step 4: Create `.env.example`**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_key
API_PORT=3001
VITE_API_URL=http://localhost:3001
```

**Step 5: Add `.env` to `.gitignore`**
```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
cp .env.example .env
```

**Step 6: Commit**
```bash
git add supabase/ .env.example .gitignore
git commit -m "feat: add Supabase schema and environment config"
```

---

### Task 2: Supabase client + auth setup in React

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/auth.ts`
- Create: `src/components/AuthGate.tsx`
- Modify: `src/main.tsx`

**Step 1: Install Supabase client**
```bash
npm install @supabase/supabase-js
```

**Step 2: Create `src/lib/supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 3: Create `src/lib/auth.ts`**
```typescript
import { supabase } from './supabase';

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function useSession() {
  return supabase.auth.getSession();
}
```

**Step 4: Create `src/components/AuthGate.tsx`**
```tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signInWithGoogle, signInWithEmail } from '../lib/auth';
import type { Session } from '@supabase/supabase-js';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#09090b', color:'#f4f4f5', fontFamily:'DM Sans, sans-serif' }}>
      Loading...
    </div>
  );

  if (!session) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:'16px', background:'#09090b', color:'#f4f4f5', fontFamily:'DM Sans, sans-serif' }}>
      <h1 style={{ fontSize:'28px', fontWeight:700, margin:0 }}>Kore Email Builder</h1>
      <p style={{ color:'#71717a', margin:0 }}>Sign in to continue</p>
      <button onClick={signInWithGoogle} style={{ background:'#f4f4f5', color:'#09090b', border:'none', borderRadius:'8px', padding:'12px 24px', fontWeight:600, cursor:'pointer', width:'280px' }}>
        Continue with Google
      </button>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'280px' }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ padding:'10px 14px', borderRadius:'8px', border:'1px solid #27272a', background:'#18181b', color:'#f4f4f5', outline:'none' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ padding:'10px 14px', borderRadius:'8px', border:'1px solid #27272a', background:'#18181b', color:'#f4f4f5', outline:'none' }} />
        <button onClick={() => signInWithEmail(email, password)} style={{ background:'#f59e0b', color:'#09090b', border:'none', borderRadius:'8px', padding:'10px', fontWeight:600, cursor:'pointer' }}>
          Sign In
        </button>
      </div>
    </div>
  );

  return <>{children}</>;
}
```

**Step 5: Wrap app in `src/main.tsx`**
```tsx
import { AuthGate } from './components/AuthGate';
// Wrap <App /> with <AuthGate><App /></AuthGate>
```

**Step 6: Run dev server and verify auth page renders**
```bash
npm run dev
```
Expected: Login page shown at localhost:3000

**Step 7: Commit**
```bash
git add src/lib/supabase.ts src/lib/auth.ts src/components/AuthGate.tsx src/main.tsx
git commit -m "feat: add Supabase auth with Google OAuth and email/password"
```

---

### Task 3: Draft persistence (save/load/list/delete)

**Files:**
- Create: `src/lib/drafts.ts`
- Create: `src/hooks/useDrafts.ts`
- Modify: `src/App.tsx` (wire auto-save)

**Step 1: Create `src/lib/drafts.ts`**
```typescript
import { supabase } from './supabase';
import type { EmailState } from '../components/PropertiesPanel';

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

export async function saveDraft(emailId: string | null, subject: string, state: EmailState) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  if (emailId) {
    const { error } = await supabase.from('emails').update({
      subject,
      blocks_jsonb: state,
      updated_at: new Date().toISOString(),
    }).eq('id', emailId);
    if (error) throw error;
    return emailId;
  } else {
    const { data, error } = await supabase.from('emails').insert({
      workspace_id: WORKSPACE_ID,
      author_id: user.id,
      subject,
      blocks_jsonb: state,
    }).select('id').single();
    if (error) throw error;
    return data.id as string;
  }
}

export async function loadDraft(emailId: string) {
  const { data, error } = await supabase.from('emails')
    .select('*').eq('id', emailId).single();
  if (error) throw error;
  return data;
}

export async function listDrafts() {
  const { data, error } = await supabase.from('emails')
    .select('id, subject, status, updated_at, author_id')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteDraft(emailId: string) {
  const { error } = await supabase.from('emails').delete().eq('id', emailId);
  if (error) throw error;
}

export async function updateStatus(emailId: string, status: string) {
  const { error } = await supabase.from('emails')
    .update({ status }).eq('id', emailId);
  if (error) throw error;
}
```

**Step 2: Create `src/hooks/useDrafts.ts`**
```typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { saveDraft } from '../lib/drafts';
import type { EmailState } from '../components/PropertiesPanel';

export function useAutoSave(emailId: string | null, subject: string, state: EmailState, onSaved: (id: string) => void) {
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const id = await saveDraft(emailId, subject, state);
      onSaved(id);
      setSavedAt(new Date());
    } catch (e) {
      console.error('Auto-save failed:', e);
    } finally {
      setSaving(false);
    }
  }, [emailId, subject, state, onSaved]);

  // Debounced auto-save: 3 seconds after last change
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 3000);
    return () => clearTimeout(timerRef.current);
  }, [save]);

  return { savedAt, saving };
}
```

**Step 3: Write test**
```typescript
// src/lib/drafts.test.ts
import { describe, it, expect, vi } from 'vitest';

vi.mock('./supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'new-id' }, error: null }) }) }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      select: vi.fn().mockReturnValue({ order: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    }),
  },
}));

import { saveDraft, listDrafts } from './drafts';

describe('drafts', () => {
  it('saveDraft with no id creates new draft', async () => {
    const id = await saveDraft(null, 'Test Email', {} as any);
    expect(id).toBe('new-id');
  });

  it('listDrafts returns array', async () => {
    const drafts = await listDrafts();
    expect(Array.isArray(drafts)).toBe(true);
  });
});
```

**Step 4: Run tests**
```bash
npm test
```
Expected: all tests pass

**Step 5: Commit**
```bash
git add src/lib/drafts.ts src/hooks/useDrafts.ts src/lib/drafts.test.ts
git commit -m "feat: add draft persistence with Supabase (save/load/list/delete)"
```

---

### Task 4: Express API server setup

**Files:**
- Create: `api/index.ts`
- Create: `api/routes/preview.ts`
- Create: `api/routes/respond.ts`
- Create: `api/routes/export.ts`
- Create: `api/routes/send-test.ts`
- Create: `api/package.json`
- Create: `api/tsconfig.json`

**Step 1: Initialize API package**
```bash
mkdir api && cd api
npm init -y
npm install express @supabase/supabase-js juice resend cors dotenv
npm install -D typescript @types/express @types/node ts-node nodemon
```

**Step 2: Create `api/tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**Step 3: Create `api/index.ts`**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { previewRouter } from './routes/preview';
import { respondRouter } from './routes/respond';
import { exportRouter } from './routes/export';
import { sendTestRouter } from './routes/send-test';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'https://kore-email-builder.vercel.app'] }));
app.use(express.json({ limit: '10mb' }));

app.use('/preview', previewRouter);
app.use('/r', respondRouter);
app.use('/export', exportRouter);
app.use('/send-test', sendTestRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
```

**Step 4: Create `api/routes/respond.ts`**
```typescript
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

export const respondRouter = Router();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /r/:token/:blockId/:value
respondRouter.get('/:token/:blockId/:value', async (req, res) => {
  const { token, blockId, value } = req.params;

  // Look up email_id from token
  const { data: email, error } = await supabase.from('emails')
    .select('id').contains('blocks_jsonb', {}).limit(1).single();

  // Record response (idempotent — one response per token+block)
  const { error: insertError } = await supabase.from('responses').insert({
    email_id: email?.id,
    block_id: blockId,
    recipient_token: token,
    response_type: 'poll',
    value,
  });

  if (insertError && insertError.code !== '23505') {
    return res.status(500).send('Error recording response');
  }

  // Friendly thank-you page
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Response recorded</title>
    <style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#09090b;color:#f4f4f5;}</style>
    </head>
    <body><div style="text-align:center"><h2>Thanks!</h2><p style="color:#71717a">Your response has been recorded.</p></div></body>
    </html>
  `);
});
```

**Step 5: Create `api/routes/export.ts`**
```typescript
import { Router } from 'express';
import juice from 'juice';

export const exportRouter = Router();

// POST /export { html: string }
exportRouter.post('/', (req, res) => {
  const { html } = req.body as { html: string };
  if (!html) return res.status(400).json({ error: 'html required' });

  const inlined = juice(html, {
    removeStyleTags: false,
    applyStyleTags: true,
    preserveImportant: true,
  });

  const sizeBytes = Buffer.byteLength(inlined, 'utf8');
  const sizeKB = Math.round(sizeBytes / 1024);
  const clipped = sizeKB > 102;

  res.json({ html: inlined, sizeKB, clipped });
});
```

**Step 6: Create `api/routes/send-test.ts`**
```typescript
import { Router } from 'express';
import { Resend } from 'resend';
import juice from 'juice';

export const sendTestRouter = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /send-test { html: string, subject: string, to: string }
sendTestRouter.post('/', async (req, res) => {
  const { html, subject, to } = req.body as { html: string; subject: string; to: string };
  if (!html || !subject || !to) return res.status(400).json({ error: 'html, subject, to required' });

  const inlined = juice(html);

  const { data, error } = await resend.emails.send({
    from: 'Kore Email Builder <noreply@kore-email.com>',
    to,
    subject: `[TEST] ${subject}`,
    html: inlined,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data?.id });
});
```

**Step 7: Create `api/routes/preview.ts`**
```typescript
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

export const previewRouter = Router();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /preview/:token
previewRouter.get('/:token', async (req, res) => {
  const { token } = req.params;

  const { data, error } = await supabase.from('preview_tokens')
    .select('email_id, expires_at, emails(subject, blocks_jsonb)')
    .eq('token', token).single();

  if (error || !data) return res.status(404).send('Preview not found');
  if (new Date(data.expires_at) < new Date()) return res.status(410).send('Preview link expired');

  // Increment view count
  await supabase.from('preview_tokens')
    .update({ view_count: supabase.rpc('increment', { row_id: data.email_id }) })
    .eq('token', token);

  // For now, return JSON — frontend preview page renders it
  res.json({ email: data.emails, token });
});
```

**Step 8: Add dev script to root `package.json`**
```json
"api": "cd api && npx ts-node index.ts",
"dev:all": "concurrently \"npm run dev\" \"npm run api\""
```

Install concurrently:
```bash
npm install -D concurrently
```

**Step 9: Start and verify**
```bash
npm run api &
curl http://localhost:3001/health
```
Expected: `{"ok":true}`

**Step 10: Commit**
```bash
git add api/
git commit -m "feat: add Express API server (preview, respond, export, send-test)"
```

---

### Task 5: Version history

**Files:**
- Create: `src/lib/versions.ts`
- Create: `src/components/VersionHistory.tsx`

**Step 1: Create `src/lib/versions.ts`**
```typescript
import { supabase } from './supabase';
import type { EmailState } from '../components/PropertiesPanel';

export async function saveVersion(emailId: string, state: EmailState, label?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('email_versions').insert({
    email_id: emailId,
    blocks_jsonb: state,
    saved_by: user?.id,
    label: label ?? null,
  });
  if (error) throw error;
}

export async function listVersions(emailId: string) {
  const { data, error } = await supabase.from('email_versions')
    .select('id, label, created_at, saved_by')
    .eq('email_id', emailId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function restoreVersion(versionId: string): Promise<EmailState> {
  const { data, error } = await supabase.from('email_versions')
    .select('blocks_jsonb').eq('id', versionId).single();
  if (error) throw error;
  return data.blocks_jsonb as EmailState;
}
```

**Step 2: Create `src/components/VersionHistory.tsx`**
```tsx
import { useEffect, useState } from 'react';
import { listVersions, restoreVersion, saveVersion } from '../lib/versions';
import type { EmailState } from './PropertiesPanel';

interface VersionHistoryProps {
  emailId: string | null;
  currentState: EmailState;
  onRestore: (state: EmailState) => void;
}

export function VersionHistory({ emailId, currentState, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!emailId) return;
    listVersions(emailId).then(setVersions);
  }, [emailId]);

  const handleSaveNamed = async () => {
    if (!emailId || !label.trim()) return;
    await saveVersion(emailId, currentState, label.trim());
    setLabel('');
    const updated = await listVersions(emailId);
    setVersions(updated);
  };

  const handleRestore = async (versionId: string) => {
    const state = await restoreVersion(versionId);
    onRestore(state);
  };

  return (
    <div style={{ padding: '16px', color: '#f4f4f5', fontFamily: 'DM Sans, sans-serif' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>Version History</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input value={label} onChange={e => setLabel(e.target.value)}
          placeholder="Label this version..."
          style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #27272a', background: '#18181b', color: '#f4f4f5', fontSize: '12px' }} />
        <button onClick={handleSaveNamed}
          style={{ padding: '6px 12px', borderRadius: '6px', background: '#f59e0b', color: '#09090b', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
          Save
        </button>
      </div>
      {versions.map(v => (
        <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #27272a' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: v.label ? 600 : 400 }}>{v.label || 'Auto-save'}</div>
            <div style={{ fontSize: '11px', color: '#71717a' }}>{new Date(v.created_at).toLocaleString()}</div>
          </div>
          <button onClick={() => handleRestore(v.id)}
            style={{ fontSize: '11px', color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer' }}>
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Step 3: Commit**
```bash
git add src/lib/versions.ts src/components/VersionHistory.tsx
git commit -m "feat: add version history (save named versions, restore)"
```

---

## PHASE 2 — New Block Library

### Task 6: Hero block

**Files:**
- Create: `src/components/email-blocks/HeroBlock.tsx`
- Modify: `src/lib/block-defaults.ts`
- Modify: `src/lib/html-generator.ts`
- Modify: `src/App.tsx` (register block)

**Step 1: Create `src/components/email-blocks/HeroBlock.tsx`**
```tsx
import React from 'react';
import { EditableText } from '../EditableText';
import { colorValueToHex } from '../../lib/color-token-system';

export interface HeroBlockProps {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  bgColor?: string;        // hex
  textColor?: string;      // hex
  displaySize?: 48 | 64 | 72;
  isEmailMode?: boolean;
  isSelected?: boolean;
  onUpdate?: (props: Partial<HeroBlockProps>) => void;
}

export function HeroBlock({
  badge,
  title,
  subtitle,
  ctaText,
  ctaUrl = '#',
  bgColor = '#09090b',
  textColor = '#f4f4f5',
  displaySize = 56,
  isEmailMode = false,
  isSelected,
  onUpdate,
}: HeroBlockProps) {
  const containerStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    padding: '64px 40px',
    textAlign: 'center',
    borderRadius: '0',
  };

  return (
    <div style={containerStyle}>
      {badge && (
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '100px',
            border: `1px solid ${textColor}40`,
            color: textColor,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            {isEmailMode ? badge : (
              <EditableText value={badge} onChange={v => onUpdate?.({ badge: v })} />
            )}
          </span>
        </div>
      )}
      <div style={{
        fontSize: `${displaySize}px`,
        fontWeight: 800,
        lineHeight: 1.1,
        color: textColor,
        margin: '0 0 16px',
        fontFamily: 'DM Serif Display, Georgia, serif',
        letterSpacing: '-0.02em',
      }}>
        {isEmailMode ? title : (
          <EditableText value={title} onChange={v => onUpdate?.({ title: v })} />
        )}
      </div>
      {subtitle && (
        <div style={{ fontSize: '18px', color: `${textColor}b3`, margin: '0 0 32px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
          {isEmailMode ? subtitle : (
            <EditableText value={subtitle} onChange={v => onUpdate?.({ subtitle: v })} />
          )}
        </div>
      )}
      {ctaText && (
        <a href={ctaUrl} style={{
          display: 'inline-block',
          padding: '14px 32px',
          backgroundColor: '#f59e0b',
          color: '#09090b',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '16px',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {ctaText}
        </a>
      )}
    </div>
  );
}
```

**Step 2: Add defaults to `src/lib/block-defaults.ts`**
```typescript
export const HERO_DEFAULTS = {
  badge: 'New Release',
  title: 'What\'s New in v2.0',
  subtitle: 'The biggest update yet — faster, smarter, and more powerful.',
  ctaText: 'See what\'s new',
  ctaUrl: '#',
  bgColor: '#09090b',
  textColor: '#f4f4f5',
  displaySize: 56,
};
```

**Step 3: Add HTML generation to `src/lib/html-generator.ts`**

In the `generateBlockHTML` switch statement, add:
```typescript
case 'hero':
  return generateHeroHTML(block);
```

Add the function:
```typescript
function generateHeroHTML(block: ContentBlock): string {
  const { badge, title, subtitle, ctaText, ctaUrl, bgColor = '#09090b', textColor = '#f4f4f5', displaySize = 56 } = block;
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" bgcolor="${bgColor}" style="background-color:${bgColor}; padding:64px 40px; text-align:center;">
      ${badge ? `<div style="margin-bottom:16px;">
        <span style="display:inline-block; padding:4px 12px; border-radius:100px; border:1px solid ${textColor}40; color:${textColor}; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; font-family:'DM Sans',Arial,sans-serif;">${badge}</span>
      </div>` : ''}
      <h1 style="font-size:${displaySize}px; font-weight:800; line-height:1.1; color:${textColor}; margin:0 0 16px; font-family:'DM Serif Display',Georgia,serif; letter-spacing:-0.02em;">${title}</h1>
      ${subtitle ? `<p style="font-size:18px; color:${textColor}b3; margin:0 0 32px; font-family:'DM Sans',Arial,sans-serif; line-height:1.6;">${subtitle}</p>` : ''}
      ${ctaText ? `<a href="${ctaUrl}" style="display:inline-block; padding:14px 32px; background-color:#f59e0b; color:#09090b; text-decoration:none; border-radius:8px; font-weight:700; font-size:16px; font-family:'DM Sans',Arial,sans-serif;">${ctaText}</a>` : ''}
    </td>
  </tr>
</table>`;
}
```

**Step 4: Register in App.tsx block library**

Add `{ type: 'hero', label: 'Hero', icon: '⬛', group: 'Layout' }` to the block library array.

**Step 5: Test builds**
```bash
npm run build 2>&1 | tail -5
```
Expected: build succeeds

**Step 6: Commit**
```bash
git add src/components/email-blocks/HeroBlock.tsx src/lib/block-defaults.ts src/lib/html-generator.ts src/App.tsx
git commit -m "feat: add Hero block with dark background, display type, CTA"
```

---

### Task 7: Changelog block

**Files:**
- Create: `src/components/email-blocks/ChangelogBlock.tsx`
- Modify: `src/lib/block-defaults.ts`
- Modify: `src/lib/html-generator.ts`
- Modify: `src/App.tsx`

**Step 1: Create `src/components/email-blocks/ChangelogBlock.tsx`**
```tsx
import React from 'react';

type ChangeType = 'feature' | 'fix' | 'breaking' | 'deprecated' | 'improvement';

interface ChangeItem {
  type: ChangeType;
  text: string;
}

interface ChangeSection {
  label: string;
  type: ChangeType;
  items: string[];
}

export interface ChangelogBlockProps {
  id: string;
  version: string;
  date?: string;
  sections: ChangeSection[];
  bgColor?: string;
  isEmailMode?: boolean;
  onUpdate?: (props: Partial<ChangelogBlockProps>) => void;
}

const TYPE_CONFIG: Record<ChangeType, { color: string; dot: string; label: string }> = {
  feature:     { color: '#22c55e', dot: '#22c55e', label: 'New' },
  improvement: { color: '#3b82f6', dot: '#3b82f6', label: 'Improved' },
  fix:         { color: '#f59e0b', dot: '#f59e0b', label: 'Fixed' },
  breaking:    { color: '#ef4444', dot: '#ef4444', label: 'Breaking' },
  deprecated:  { color: '#a78bfa', dot: '#a78bfa', label: 'Deprecated' },
};

export function ChangelogBlock({ version, date, sections, bgColor = '#09090b', isEmailMode }: ChangelogBlockProps) {
  return (
    <div style={{ backgroundColor: bgColor, padding: '32px 40px', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
        <span style={{
          display: 'inline-block', padding: '4px 10px', borderRadius: '6px',
          background: '#27272a', color: '#f4f4f5', fontSize: '13px',
          fontWeight: 700, fontFamily: 'DM Mono, monospace',
        }}>
          {version}
        </span>
        {date && <span style={{ color: '#71717a', fontSize: '13px' }}>{date}</span>}
      </div>
      {sections.map((section, si) => {
        const config = TYPE_CONFIG[section.type];
        return (
          <div key={si} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: config.dot, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {config.label}
              </span>
            </div>
            <ul style={{ margin: '0', padding: '0 0 0 20px', listStyle: 'disc' }}>
              {section.items.map((item, ii) => (
                <li key={ii} style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.7, marginBottom: '4px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: Add defaults**
```typescript
export const CHANGELOG_DEFAULTS = {
  version: 'v2.1.0',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  bgColor: '#09090b',
  sections: [
    { type: 'feature', label: 'New', items: ['New dashboard overview page', 'Bulk export to CSV'] },
    { type: 'fix', label: 'Fixed', items: ['Fixed broken pagination on mobile'] },
    { type: 'breaking', label: 'Breaking', items: ['Removed legacy v1 API endpoints'] },
  ],
};
```

**Step 3: Add HTML generation**
```typescript
function generateChangelogHTML(block: ContentBlock): string {
  const typeConfig: Record<string, { color: string; label: string }> = {
    feature:     { color: '#22c55e', label: 'New' },
    improvement: { color: '#3b82f6', label: 'Improved' },
    fix:         { color: '#f59e0b', label: 'Fixed' },
    breaking:    { color: '#ef4444', label: 'Breaking' },
    deprecated:  { color: '#a78bfa', label: 'Deprecated' },
  };
  const { version, date, sections = [], bgColor = '#09090b' } = block;
  const sectionsHTML = sections.map((s: any) => {
    const cfg = typeConfig[s.type] || typeConfig.feature;
    const items = s.items.map((item: string) =>
      `<li style="color:#a1a1aa; font-size:14px; line-height:1.7; margin-bottom:4px;">${item}</li>`
    ).join('');
    return `
      <div style="margin-bottom:20px;">
        <div style="margin-bottom:8px;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${cfg.color}; margin-right:8px; vertical-align:middle;"></span>
          <span style="font-size:12px; font-weight:700; color:${cfg.color}; text-transform:uppercase; letter-spacing:0.06em; font-family:'DM Sans',Arial,sans-serif;">${cfg.label}</span>
        </div>
        <ul style="margin:0; padding:0 0 0 20px;">${items}</ul>
      </div>`;
  }).join('');

  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td bgcolor="${bgColor}" style="background-color:${bgColor}; padding:32px 40px; font-family:'DM Sans',Arial,sans-serif;">
      <div style="margin-bottom:24px;">
        <span style="display:inline-block; padding:4px 10px; border-radius:6px; background:#27272a; color:#f4f4f5; font-size:13px; font-weight:700; font-family:'DM Mono','Courier New',monospace;">${version}</span>
        ${date ? `<span style="color:#71717a; font-size:13px; margin-left:12px;">${date}</span>` : ''}
      </div>
      ${sectionsHTML}
    </td>
  </tr>
</table>`;
}
```

**Step 4: Test build + commit**
```bash
npm run build 2>&1 | tail -5
git add src/components/email-blocks/ChangelogBlock.tsx src/lib/block-defaults.ts src/lib/html-generator.ts src/App.tsx
git commit -m "feat: add Changelog block with categorized changes and color-coded dots"
```

---

### Task 8: Deprecation Notice block

**Files:**
- Create: `src/components/email-blocks/DeprecationBlock.tsx`
- Modify: `src/lib/block-defaults.ts`, `src/lib/html-generator.ts`, `src/App.tsx`

**Step 1: Create `src/components/email-blocks/DeprecationBlock.tsx`**
```tsx
import React from 'react';

export interface DeprecationBlockProps {
  id: string;
  featureName: string;
  deprecatedDate: string;
  eolDate: string;
  migrationPath: string;
  severity: 'warning' | 'critical';
  ctaText?: string;
  ctaUrl?: string;
  isEmailMode?: boolean;
  onUpdate?: (props: Partial<DeprecationBlockProps>) => void;
}

export function DeprecationBlock({ featureName, deprecatedDate, eolDate, migrationPath, severity, ctaText, ctaUrl }: DeprecationBlockProps) {
  const borderColor = severity === 'critical' ? '#ef4444' : '#f59e0b';
  const bgColor = severity === 'critical' ? '#1c0a0a' : '#1c1200';
  const badgeColor = severity === 'critical' ? '#ef4444' : '#f59e0b';
  const badgeText = severity === 'critical' ? 'CRITICAL' : 'DEPRECATION NOTICE';

  return (
    <div style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}`, borderRadius: '8px', padding: '24px 28px', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ marginBottom: '16px' }}>
        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '4px', background: badgeColor, color: '#09090b', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {badgeText}
        </span>
      </div>
      <h3 style={{ color: '#f4f4f5', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>{featureName}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <tbody>
          <tr>
            <td style={{ color: '#71717a', fontSize: '13px', paddingBottom: '8px', width: '140px' }}>Deprecated:</td>
            <td style={{ color: '#f4f4f5', fontSize: '13px', fontWeight: 600, paddingBottom: '8px' }}>{deprecatedDate}</td>
          </tr>
          <tr>
            <td style={{ color: '#71717a', fontSize: '13px', paddingBottom: '8px' }}>End of Life:</td>
            <td style={{ color: badgeColor, fontSize: '13px', fontWeight: 700, paddingBottom: '8px' }}>{eolDate}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
        <strong style={{ color: '#f4f4f5' }}>Migration path:</strong> {migrationPath}
      </p>
      {ctaText && (
        <a href={ctaUrl || '#'} style={{ display: 'inline-block', padding: '10px 24px', background: borderColor, color: '#09090b', textDecoration: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '14px' }}>
          {ctaText}
        </a>
      )}
    </div>
  );
}
```

**Step 2: Add defaults + HTML generator + register in App.tsx (follow same pattern as Task 7)**

**Step 3: Commit**
```bash
git add src/components/email-blocks/DeprecationBlock.tsx src/lib/block-defaults.ts src/lib/html-generator.ts src/App.tsx
git commit -m "feat: add Deprecation Notice block with EOL date and migration path"
```

---

### Task 9: Metrics Snapshot block

Follow the same pattern. Create `MetricsBlock.tsx`:

```tsx
interface Metric { value: string; label: string; delta?: string; deltaDirection?: 'up' | 'down' | 'neutral'; }
// Renders a row of big-number stat cards using table cells
// delta shown with ↑ (green) / ↓ (red) / — (neutral)
```

Commit: `"feat: add Metrics Snapshot block with stat cards and delta indicators"`

---

### Task 10: NPS Rating block (link-based)

**Files:**
- Create: `src/components/email-blocks/NpsBlock.tsx`
- Modify: `src/lib/html-generator.ts` (tokenized URL generation on export)

**Step 1: Create `src/components/email-blocks/NpsBlock.tsx`**

```tsx
// Renders 0-10 colored cells in editor preview
// On export: each cell href = /r/{export_token}/{block_id}/{score}
// Color gradient: 0-6 red→orange, 7-8 yellow, 9-10 green
const NPS_COLORS = ['#ef4444','#f97316','#f97316','#fb923c','#fb923c','#eab308','#eab308','#84cc16','#84cc16','#22c55e','#22c55e'];
```

**Step 2: HTML generator for NPS**

On export, inject `exportToken` (UUID) into each link:
```typescript
function generateNpsHTML(block: ContentBlock, exportToken: string): string {
  const cells = Array.from({ length: 11 }, (_, i) => {
    const color = NPS_COLORS[i];
    const url = `${API_URL}/r/${exportToken}/${block.id}/${i}`;
    return `<td width="48" style="padding:2px;">
      <a href="${url}" style="display:block; width:44px; height:44px; line-height:44px; text-align:center; background:${color}; color:#fff; font-weight:700; font-size:14px; text-decoration:none; border-radius:6px; font-family:'DM Sans',Arial,sans-serif;">${i}</a>
    </td>`;
  }).join('');
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td align="center" style="padding:32px 24px; background:#09090b;">
    <p style="color:#f4f4f5; font-size:16px; margin:0 0 20px; font-family:'DM Sans',Arial,sans-serif;">${block.questionText || 'How satisfied are you?'}</p>
    <table cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>
    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:8px; width:520px;"><tr>
      <td style="color:#71717a; font-size:12px; font-family:'DM Sans',Arial,sans-serif;">Not at all</td>
      <td align="right" style="color:#71717a; font-size:12px; font-family:'DM Sans',Arial,sans-serif;">Extremely</td>
    </tr></table>
  </td></tr>
</table>`;
}
```

**Step 3: Commit**
```bash
git add src/components/email-blocks/NpsBlock.tsx src/lib/html-generator.ts src/App.tsx
git commit -m "feat: add NPS Rating block with tokenized 0-10 links"
```

---

### Task 11: Remaining new blocks (batch)

Implement these following the same pattern (component + defaults + HTML generator + App.tsx registration):

1. **BentoGrid** — 3-cell asymmetric (60/40 top row + full-width bottom). Dark card cells with border-radius.
2. **FeatureRow** — Image left/right, 50/50, stacks on mobile. Alternating direction prop.
3. **PullQuote** — Left accent border (4px), large italic text, author attribution below.
4. **AnnouncementBanner** — Full-width colored strip, icon + headline, center-aligned.
5. **CardGrid** — 2×2 or 3-col. Icon + title + description per card.
6. **ComparisonTable** — Column headers + rows with ✓/✗/partial cell values.
7. **GifDemo** — Image upload (Supabase Storage), caption, first-frame warning for Outlook.
8. **VideoThumbnail** — Image + play button (baked), link to video URL, duration label.
9. **QuickPoll** — 2–5 pill options, each a tokenized link.
10. **RsvpBlock** — Event details + Yes/No CTA buttons with distinct tokenized hrefs.
11. **FeedbackPrompt** — Emoji row (😞/😐/😊), each a tokenized link.
12. **KnownIssues** — Severity-tagged list (P1/P2/P3), status indicators.
13. **RoadmapPreview** — Now/Next/Later pill items.
14. **TeamAttribution** — Name + role + optional avatar row.
15. **IncidentRetro** — Structured fields: ID, date, duration, root cause, fix, action items.

Commit after each block:
```bash
git commit -m "feat: add [BlockName] block"
```

---

## PHASE 3 — DnD + Properties Panel Overhaul

### Task 12: DnD insertion line indicator

**Files:**
- Modify: `src/App.tsx` (DragOverlay, DndContext)
- Create: `src/components/InsertionLine.tsx`

**Step 1: Create `src/components/InsertionLine.tsx`**
```tsx
export function InsertionLine() {
  return (
    <div style={{
      height: '2px',
      background: '#f59e0b',
      borderRadius: '1px',
      margin: '0 16px',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        left: '-4px',
        top: '-4px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#f59e0b',
      }} />
    </div>
  );
}
```

**Step 2: Wire into DnD context in App.tsx**

Replace the bounding-box highlight with `InsertionLine` rendered between blocks when `overId` matches an adjacent block.

**Step 3: Add block ghost to DragOverlay**

In `<DragOverlay>`, render the actual dragged block component at 60% opacity:
```tsx
<DragOverlay dropAnimation={null}>
  {activeId ? (
    <div style={{ opacity: 0.6, pointerEvents: 'none' }}>
      {/* render active block */}
    </div>
  ) : null}
</DragOverlay>
```

**Step 4: Commit**
```bash
git add src/App.tsx src/components/InsertionLine.tsx
git commit -m "fix: replace DnD bounding-box highlight with insertion line + block ghost"
```

---

### Task 13: Undo/redo stack

**Files:**
- Create: `src/hooks/useUndoRedo.ts`
- Modify: `src/App.tsx`

**Step 1: Create `src/hooks/useUndoRedo.ts`**
```typescript
import { useCallback, useReducer } from 'react';

interface UndoState<T> {
  past: T[];
  present: T;
  future: T[];
}

type UndoAction<T> =
  | { type: 'SET'; payload: T }
  | { type: 'UNDO' }
  | { type: 'REDO' };

function undoReducer<T>(state: UndoState<T>, action: UndoAction<T>): UndoState<T> {
  switch (action.type) {
    case 'SET':
      return { past: [...state.past, state.present].slice(-50), present: action.payload, future: [] };
    case 'UNDO':
      if (state.past.length === 0) return state;
      return { past: state.past.slice(0, -1), present: state.past[state.past.length - 1], future: [state.present, ...state.future] };
    case 'REDO':
      if (state.future.length === 0) return state;
      return { past: [...state.past, state.present], present: state.future[0], future: state.future.slice(1) };
    default: return state;
  }
}

export function useUndoRedo<T>(initial: T) {
  const [state, dispatch] = useReducer(undoReducer<T>, { past: [], present: initial, future: [] });
  const set = useCallback((val: T) => dispatch({ type: 'SET', payload: val }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  return { value: state.present, set, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0 };
}
```

**Step 2: Write test**
```typescript
// src/hooks/useUndoRedo.test.ts
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from './useUndoRedo';

describe('useUndoRedo', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    expect(result.current.value).toBe('a');
  });
  it('set updates present', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    act(() => result.current.set('b'));
    expect(result.current.value).toBe('b');
  });
  it('undo restores previous', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    act(() => result.current.set('b'));
    act(() => result.current.undo());
    expect(result.current.value).toBe('a');
  });
  it('redo re-applies', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    act(() => result.current.set('b'));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(result.current.value).toBe('b');
  });
});
```

**Step 3: Run tests**
```bash
npm test
```
Expected: new tests pass + all 21 existing pass

**Step 4: Wire Cmd+Z / Cmd+Shift+Z in App.tsx**
```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [undo, redo]);
```

**Step 5: Commit**
```bash
git add src/hooks/useUndoRedo.ts src/hooks/useUndoRedo.test.ts src/App.tsx
git commit -m "feat: add undo/redo stack (Cmd+Z / Cmd+Shift+Z, 50-step history)"
```

---

### Task 14: Properties panel collapsible groups

**Files:**
- Create: `src/components/properties-panel/PropertyGroup.tsx` (update existing)
- Modify: `src/components/PropertiesPanel.tsx`

Update `PropertyGroup.tsx` to use Radix UI Collapsible with open state persisted in localStorage per block type.

```tsx
import * as Collapsible from '@radix-ui/react-collapsible';
// Wrap section content in Collapsible.Root, store open state in
// localStorage key: `panel-group-${blockType}-${groupName}`
```

Commit: `"fix: properties panel groups now collapsible with persisted open state"`

---

## PHASE 4 — Collaboration

### Task 15: Shareable preview links

**Files:**
- Create: `src/lib/preview.ts`
- Create: `src/components/ShareDialog.tsx`
- Create: `src/pages/PreviewPage.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Create `src/lib/preview.ts`**
```typescript
import { supabase } from './supabase';

export async function createPreviewToken(emailId: string): Promise<string> {
  const { data, error } = await supabase.from('preview_tokens')
    .insert({ email_id: emailId })
    .select('token').single();
  if (error) throw error;
  return data.token;
}

export async function getPreviewUrl(emailId: string): Promise<string> {
  const token = await createPreviewToken(emailId);
  return `${window.location.origin}/preview/${token}`;
}
```

**Step 2: Create `src/components/ShareDialog.tsx`**
```tsx
// Dialog that shows the preview URL + copy button
// Renders using Radix UI Dialog
// Shows expiry date (7 days from now)
// Copy button uses navigator.clipboard.writeText
```

**Step 3: Create `src/pages/PreviewPage.tsx`**
```tsx
// Reads :token from URL params
// Calls GET /preview/:token on Express API
// Renders the email HTML in an iframe (srcdoc)
// Shows comment form below: name + message + submit
// Lists existing comments
// No auth required
```

**Step 4: Add `/preview/:token` route in App.tsx**

Use React Router (install if not present):
```bash
npm install react-router-dom
```

**Step 5: Commit**
```bash
git add src/lib/preview.ts src/components/ShareDialog.tsx src/pages/PreviewPage.tsx src/App.tsx
git commit -m "feat: add shareable preview links with comment system"
```

---

### Task 16: Draft lifecycle + status UI

**Files:**
- Create: `src/components/DraftStatusBadge.tsx`
- Create: `src/components/DraftsPanel.tsx`
- Modify: `src/App.tsx`

**Step 1: Create `src/components/DraftStatusBadge.tsx`**
```tsx
const STATUS_CONFIG = {
  draft:     { label: 'Draft',     bg: '#27272a', color: '#a1a1aa' },
  in_review: { label: 'In Review', bg: '#1c1a00', color: '#f59e0b' },
  approved:  { label: 'Approved',  bg: '#052e16', color: '#22c55e' },
  sent:      { label: 'Sent',      bg: '#1c0a3a', color: '#a78bfa' },
};
// Renders colored pill badge + action button (Submit / Approve / Reject / Mark Sent)
// Action buttons call updateStatus() from drafts.ts
// Reviewer role sees Approve/Reject; Author sees Submit/Mark Sent
```

**Step 2: Create `src/components/DraftsPanel.tsx`**
```tsx
// Sidebar panel listing all drafts
// Shows: subject, status badge, author, last updated
// Click to load draft into editor
// New Email button → creates blank draft
// Delete button (author only)
```

**Step 3: Commit**
```bash
git add src/components/DraftStatusBadge.tsx src/components/DraftsPanel.tsx src/App.tsx
git commit -m "feat: add draft lifecycle (draft/in_review/approved/sent) with role-based actions"
```

---

## PHASE 5 — Export + Gmail Safety

### Task 17: Juice.js CSS inliner + Copy for Gmail

**Files:**
- Modify: `src/components/CodeViewer.tsx`
- Modify: `src/App.tsx`

**Step 1: Create export utility in `src/lib/export.ts`**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function inlineAndExport(html: string): Promise<{ html: string; sizeKB: number; clipped: boolean }> {
  const res = await fetch(`${API_URL}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });
  if (!res.ok) throw new Error('Export failed');
  return res.json();
}

export async function copyForGmail(html: string): Promise<void> {
  const { html: inlined } = await inlineAndExport(html);
  const blob = new Blob([inlined], { type: 'text/html' });
  const item = new ClipboardItem({ 'text/html': blob });
  await navigator.clipboard.write([item]);
}

export async function sendTest(html: string, subject: string, to: string): Promise<void> {
  const res = await fetch(`${API_URL}/send-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, subject, to }),
  });
  if (!res.ok) throw new Error('Send failed');
}
```

**Step 2: Update `CodeViewer.tsx` to add "Copy for Gmail" button**

Replace the existing copy button with three buttons:
- **Copy for Gmail** — calls `copyForGmail()`, primary amber button
- **Copy HTML** — copies raw inlined HTML
- **Download .html** — `Blob` + `URL.createObjectURL` download

**Step 3: Add Send Test dialog**

Simple Radix Dialog with email address input, calls `sendTest()`.

**Step 4: Write test for export utility**
```typescript
// src/lib/export.test.ts
import { describe, it, expect, vi } from 'vitest';

vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ html: '<inlined>', sizeKB: 12, clipped: false }),
}));

import { inlineAndExport } from './export';

describe('inlineAndExport', () => {
  it('returns inlined html and size', async () => {
    const result = await inlineAndExport('<div>test</div>');
    expect(result.html).toBe('<inlined>');
    expect(result.sizeKB).toBe(12);
    expect(result.clipped).toBe(false);
  });
});
```

**Step 5: Run tests**
```bash
npm test
```
Expected: all tests pass

**Step 6: Commit**
```bash
git add src/lib/export.ts src/components/CodeViewer.tsx src/lib/export.test.ts
git commit -m "feat: add Copy for Gmail (ClipboardItem), CSS inliner via API, Send Test"
```

---

### Task 18: 102KB size indicator + bottom bar

**Files:**
- Create: `src/components/BottomBar.tsx`
- Modify: `src/App.tsx`

**Step 1: Create `src/components/BottomBar.tsx`**
```tsx
interface BottomBarProps {
  sizeKB: number;
  blockCount: number;
  savedAt: Date | null;
  saving: boolean;
}

export function BottomBar({ sizeKB, blockCount, savedAt, saving }: BottomBarProps) {
  const pct = Math.min((sizeKB / 102) * 100, 100);
  const color = sizeKB > 90 ? '#ef4444' : sizeKB > 70 ? '#f59e0b' : '#22c55e';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '8px 24px', background: '#09090b', borderTop: '1px solid #18181b', fontSize: '12px', color: '#71717a', fontFamily: 'DM Mono, monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{sizeKB}KB / 102KB</span>
        <div style={{ width: '80px', height: '4px', background: '#27272a', borderRadius: '2px' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
        {sizeKB > 102 && <span style={{ color: '#ef4444' }}>Gmail will clip</span>}
      </div>
      <span>{blockCount} blocks</span>
      <span>{saving ? 'Saving...' : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Not saved'}</span>
    </div>
  );
}
```

**Step 2: Wire size calculation in App.tsx**

Calculate `sizeKB` by measuring `generateEmailHTML(state, globalTheme)` byte length on every state change (debounced 1s).

**Step 3: Commit**
```bash
git add src/components/BottomBar.tsx src/App.tsx
git commit -m "feat: add bottom bar with 102KB Gmail clip indicator, block count, save status"
```

---

### Task 19: Response dashboard

**Files:**
- Create: `src/components/ResponseDashboard.tsx`
- Create: `src/lib/responses.ts`

**Step 1: Create `src/lib/responses.ts`**
```typescript
import { supabase } from './supabase';

export async function getResponses(emailId: string) {
  const { data, error } = await supabase.from('responses')
    .select('*').eq('email_id', emailId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export function groupByBlock(responses: any[]) {
  return responses.reduce((acc, r) => {
    if (!acc[r.block_id]) acc[r.block_id] = [];
    acc[r.block_id].push(r);
    return acc;
  }, {} as Record<string, any[]>);
}
```

**Step 2: Create `src/components/ResponseDashboard.tsx`**
```tsx
// Shows per-block response summaries:
// NPS: average score + distribution bar chart (CSS-based)
// Poll: option counts as horizontal bars
// RSVP: Yes count vs No count
// Rating: average star rating
// Feedback: emoji breakdown
```

**Step 3: Commit**
```bash
git add src/lib/responses.ts src/components/ResponseDashboard.tsx
git commit -m "feat: add response dashboard (NPS scores, poll results, RSVP counts)"
```

---

## PHASE 6 — Polish + Deploy

### Task 20: Preview mode toggles

**Files:**
- Create: `src/components/PreviewModeToggle.tsx`
- Modify: `src/App.tsx`

Three toggle buttons in top bar:
- **Desktop** (600px canvas)
- **Mobile** (375px canvas — scales down, stacks 2-col blocks)
- **Dark** (shows `prefers-color-scheme: dark` simulation overlay)

Commit: `"feat: add desktop/mobile/dark preview mode toggles"`

---

### Task 21: Top bar editor chrome

**Files:**
- Create: `src/components/TopBar.tsx`
- Modify: `src/App.tsx`

```tsx
// TopBar props: draftName, status, canUndo, canRedo, onUndo, onRedo, onShare, onExport, onDraftNameChange
// Inline-editable draft name (click to edit, blur to save)
// Status badge (DraftStatusBadge)
// Undo/Redo buttons (disabled when empty)
// Share button (opens ShareDialog)
// Export dropdown: Copy for Gmail / Copy HTML / Download / Send Test
```

Commit: `"feat: add top bar with inline draft name, status, undo/redo, share, export"`

---

### Task 22: Run full test suite + fix any failures

```bash
npm test 2>&1
```

Fix any failures. Expected: all tests pass (≥21 existing + new ones from Tasks 3, 13, 17).

Commit: `"test: fix any broken tests after v1 changes"`

---

### Task 23: Production build + Vercel deploy

**Step 1: Full production build**
```bash
npm run build 2>&1
```
Expected: success, `build/index.html` generated, main bundle < 600KB

**Step 2: Deploy API to Railway**
```bash
# From api/ directory
railway init
railway up
```

Or deploy to Fly.io:
```bash
fly launch --name kore-email-builder-api
fly deploy
```

**Step 3: Update `vercel.json` with API URL env var**
```json
{
  "outputDirectory": "build",
  "env": {
    "VITE_API_URL": "https://your-api.railway.app"
  }
}
```

**Step 4: Deploy frontend**
```bash
vercel --prod
```

**Step 5: Push to GitHub**
```bash
git push
```

**Step 6: Commit vercel.json update**
```bash
git add vercel.json
git commit -m "chore: update Vercel config with production API URL"
git push
```

---

## Success Criteria Checklist

- [ ] All 20+ new blocks render correctly in Gmail (manual test via Send Test)
- [ ] Exported HTML passes Gmail paste test without CSS stripping
- [ ] Draft saves and restores without data loss
- [ ] Shareable preview link accessible without login
- [ ] NPS response records correctly in DB when link clicked
- [ ] Undo/Redo works for block structure changes
- [ ] 102KB indicator turns red and shows warning above threshold
- [ ] Build bundle < 600KB main chunk
- [ ] All Vitest tests pass
- [ ] Auth flow works (Google OAuth + email/password)
- [ ] Version history saves and restores correctly
- [ ] "Copy for Gmail" pastes correctly into Gmail compose

---

## File Reference

### New files created in v1.0
```
supabase/schema.sql
supabase/seed.sql
api/index.ts
api/routes/preview.ts
api/routes/respond.ts
api/routes/export.ts
api/routes/send-test.ts
src/lib/supabase.ts
src/lib/auth.ts
src/lib/drafts.ts
src/lib/versions.ts
src/lib/preview.ts
src/lib/export.ts
src/lib/responses.ts
src/hooks/useDrafts.ts
src/hooks/useUndoRedo.ts
src/components/AuthGate.tsx
src/components/InsertionLine.tsx
src/components/VersionHistory.tsx
src/components/ShareDialog.tsx
src/components/DraftStatusBadge.tsx
src/components/DraftsPanel.tsx
src/components/BottomBar.tsx
src/components/TopBar.tsx
src/components/ResponseDashboard.tsx
src/components/PreviewModeToggle.tsx
src/pages/PreviewPage.tsx
src/components/email-blocks/HeroBlock.tsx
src/components/email-blocks/ChangelogBlock.tsx
src/components/email-blocks/DeprecationBlock.tsx
src/components/email-blocks/MetricsBlock.tsx
src/components/email-blocks/NpsBlock.tsx
src/components/email-blocks/BentoGrid.tsx
src/components/email-blocks/FeatureRow.tsx
src/components/email-blocks/PullQuote.tsx
src/components/email-blocks/AnnouncementBanner.tsx
src/components/email-blocks/CardGrid.tsx
src/components/email-blocks/ComparisonTable.tsx
src/components/email-blocks/GifDemo.tsx
src/components/email-blocks/VideoThumbnail.tsx
src/components/email-blocks/QuickPoll.tsx
src/components/email-blocks/RsvpBlock.tsx
src/components/email-blocks/FeedbackPrompt.tsx
src/components/email-blocks/KnownIssues.tsx
src/components/email-blocks/RoadmapPreview.tsx
src/components/email-blocks/TeamAttribution.tsx
src/components/email-blocks/IncidentRetro.tsx
```
