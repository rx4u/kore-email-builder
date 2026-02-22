-- Insert default workspace
insert into public.workspace (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Kore Workspace')
on conflict (id) do nothing;
