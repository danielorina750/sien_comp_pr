-- SIEN Profile Builder Supabase schema
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  status text not null,
  location text not null default 'Kenya',
  year text,
  short_description text not null default '',
  full_description text not null default '',
  scope text[] not null default '{}',
  highlights text[] not null default '{}',
  cover_image_url text not null,
  gallery_images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  include_in_profile boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_versions (
  id uuid primary key default gen_random_uuid(),
  version_name text not null,
  pdf_url text,
  generated_by uuid,
  included_project_ids uuid[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

alter table public.projects enable row level security;
alter table public.profile_versions enable row level security;

-- Public/website can read only published projects; authenticated admins can read all.
drop policy if exists "Read published projects" on public.projects;
create policy "Read published projects"
on public.projects for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

-- Authenticated admins can manage projects.
drop policy if exists "Authenticated project management" on public.projects;
create policy "Authenticated project management"
on public.projects for all
to authenticated
using (true)
with check (true);

-- Temporary test mode for the Vercel portal while you are not using login yet.
-- For production: delete this policy and require Supabase Auth.
drop policy if exists "Temporary anon project management" on public.projects;
create policy "Temporary anon project management"
on public.projects for all
to anon
using (true)
with check (true);

-- Profile versions can be managed by authenticated admins.
drop policy if exists "Authenticated profile version management" on public.profile_versions;
create policy "Authenticated profile version management"
on public.profile_versions for all
to authenticated
using (true)
with check (true);

-- Storage policies for project images.
drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'project-images');

drop policy if exists "Upload project images" on storage.objects;
create policy "Upload project images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'project-images');

drop policy if exists "Update project images" on storage.objects;
create policy "Update project images"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

drop policy if exists "Delete project images" on storage.objects;
create policy "Delete project images"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'project-images');
