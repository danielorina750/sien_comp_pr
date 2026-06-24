-- SIEN Profile Builder Supabase schema
-- Run this in Supabase SQL Editor. Safe to run more than once.

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
  scope jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  cover_image_url text,
  cover_image_alt text,
  gallery jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  include_in_pdf boolean not null default true,
  display_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add/repair columns if an older version of the table already existed.
alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists title text;
alter table public.projects add column if not exists category text;
alter table public.projects add column if not exists status text;
alter table public.projects add column if not exists location text default 'Kenya';
alter table public.projects add column if not exists year text;
alter table public.projects add column if not exists short_description text default '';
alter table public.projects add column if not exists full_description text default '';
alter table public.projects add column if not exists scope jsonb default '[]'::jsonb;
alter table public.projects add column if not exists highlights jsonb default '[]'::jsonb;
alter table public.projects add column if not exists cover_image_url text;
alter table public.projects add column if not exists cover_image_alt text;
alter table public.projects add column if not exists gallery jsonb default '[]'::jsonb;
alter table public.projects add column if not exists is_featured boolean default false;
alter table public.projects add column if not exists is_published boolean default true;
alter table public.projects add column if not exists include_in_pdf boolean default true;
alter table public.projects add column if not exists display_order integer default 0;
alter table public.projects add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.projects add column if not exists created_at timestamptz default now();
alter table public.projects add column if not exists updated_at timestamptz default now();

-- Migrate old column names if they exist from an earlier portal version.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='featured') then
    execute 'update public.projects set is_featured = coalesce(is_featured, featured, false)';
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='published') then
    execute 'update public.projects set is_published = coalesce(is_published, published, false)';
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='include_in_profile') then
    execute 'update public.projects set include_in_pdf = coalesce(include_in_pdf, include_in_profile, true)';
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='gallery_images') then
    execute 'update public.projects set gallery = coalesce(gallery, to_jsonb(gallery_images), ''[]''::jsonb)';
  end if;
end $$;

update public.projects set scope = '[]'::jsonb where scope is null;
update public.projects set highlights = '[]'::jsonb where highlights is null;
update public.projects set gallery = '[]'::jsonb where gallery is null;
update public.projects set is_featured = false where is_featured is null;
update public.projects set is_published = true where is_published is null;
update public.projects set include_in_pdf = true where include_in_pdf is null;

create table if not exists public.profile_versions (
  id uuid primary key default gen_random_uuid(),
  version_name text not null,
  pdf_url text,
  generated_by uuid references auth.users(id) on delete set null,
  included_project_ids jsonb not null default '[]'::jsonb,
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

drop policy if exists "Read published projects" on public.projects;
create policy "Read published projects"
on public.projects for select
to anon, authenticated
using (is_published = true or auth.role() = 'authenticated');

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

drop policy if exists "Authenticated profile version management" on public.profile_versions;
create policy "Authenticated profile version management"
on public.profile_versions for all
to authenticated
using (true)
with check (true);

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
