# Implementation Notes

## Architecture

This app is intentionally a single deployable Next.js project. It avoids `workspace:*`, pnpm monorepo resolution, Puppeteer, or headless Chromium so Vercel deployment is straightforward.

## Why React PDF

`@react-pdf/renderer` runs in the Node.js API route and produces a PDF buffer without browser automation. This is easier to host on Vercel than Playwright or Puppeteer.

## Data source strategy

The portal can run in two modes:

1. Local demo mode: projects are stored in browser localStorage.
2. Supabase mode: projects and image URLs are persisted in Supabase.

## Next step for production

Add Supabase Auth so only SIEN admins can log in. Then remove the temporary anon policies in `supabase/schema.sql`.

## Suggested future features

- Save generated PDFs back to Supabase Storage.
- Add profile version history.
- Add client-specific short profile templates.
- Add sector-specific PDF generation.
- Add drag-and-drop project ordering.
- Add image focal-point crop controls.
