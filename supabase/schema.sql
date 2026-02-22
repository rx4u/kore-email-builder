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

-- RLS Policies
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
