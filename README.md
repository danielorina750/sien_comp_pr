# SIEN Profile Builder - Vercel Ready

This is a standalone Next.js portal for SIEN Group. It lets an admin add projects, upload project images, choose which projects should appear in the company profile, and generate an updated PDF using the same premium architectural design direction.

The project is intentionally **not a monorepo** so it is easy to upload directly to Vercel without workspace dependency issues.

## Features

- Project entry portal
- Image upload to Supabase Storage
- Local fallback mode if Supabase is not configured
- Include/exclude projects from PDF
- Featured project toggle
- Profile builder with selectable sections
- Server-side PDF generation using `@react-pdf/renderer`
- Vercel-compatible API route for PDF download
- Seed SIEN project content and images
- Supabase SQL schema included

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Use these settings:

```txt
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: leave empty
Root Directory: repository root
```

4. Add environment variables in Vercel:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

5. Redeploy.

## Supabase setup

1. Open Supabase Dashboard.
2. Go to SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Confirm there is a `projects` table.
5. Confirm there is a `project-media` storage bucket.

## Production security note

The included SQL allows anon writes temporarily so the portal works fast during testing. For production, remove the policy named:

```sql
Temporary anon project management
```

Then use Supabase Authentication and restrict project creation to authenticated admin users only.

## How it works

```txt
Admin adds project -> Image stored in Supabase -> Project saved in database -> PDF Builder selects projects -> API route generates company profile PDF -> Admin downloads latest PDF
```

## PDF generation

The PDF is generated in:

```txt
app/api/generate-profile/route.ts
```

The template is in:

```txt
lib/pdf/ProfileDocument.tsx
```

You can tune colors, page layout, project-page designs, compliance pages, and typography from that file.
