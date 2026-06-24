# SIEN Company Profile Builder - Exact PDF Template

A Vercel-ready Next.js portal for managing SIEN project data and generating updated company profile PDFs.

This version uses the approved `Sien Updated 2.pdf` as the exact design template. The generator copies the approved PDF page-for-page and appends new portal projects after the original profile, preserving the official design and formatting exactly.

## Vercel Settings

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: leave empty
Root Directory: repository root
```

## Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## Supabase

Run:

```text
supabase/schema.sql
```

This creates/updates the `projects` table and the public `project-images` storage bucket.

## PDF Generation

The approved PDF is stored at:

```text
public/pdf-template/sien-updated-2.pdf
```

New projects added in the portal and marked for profile inclusion are appended after page 30.
