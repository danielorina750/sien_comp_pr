# SIEN Profile Builder - Vercel Exact Template Edition

A Vercel-ready Next.js portal for adding SIEN projects and generating an updated company profile PDF.

This edition uses the approved SIEN profile PDF design as the visual source of truth. The generated PDF preserves the exact cover, overview, portfolio intelligence, compliance, regulatory, and contact page design while allowing new uploaded projects to be added using matching SIEN-style project pages.

## Deploy on Vercel

Use these settings:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: leave empty
Root Directory: repository root
```

## Environment variables

Add these in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Supabase

Run:

```text
supabase/schema.sql
```

This creates:

- `projects` table
- `profile_versions` table
- public `project-images` storage bucket
- RLS policies for test/admin usage

## PDF generation

The API route is:

```text
/api/generate-profile
```

It generates a PDF using:

- exact page templates from `/public/pdf-template/`
- dynamic SIEN-styled project pages for new uploaded projects

## Important

For production, remove the temporary anon project-management policy in `supabase/schema.sql` and require Supabase Auth for project creation/editing.
