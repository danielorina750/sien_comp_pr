# Exact SIEN PDF Template Mode

This version uses `public/pdf-template/sien-updated-2.pdf` as the locked approved design template.

The PDF generator does **not** redraw the approved 30-page company profile with React-PDF. Instead, it copies the approved PDF pages directly using `pdf-lib`, so the generated profile keeps the exact visual design, alignment, typography, content formatting, and certificate pages from `Sien Updated 2.pdf`.

## How new portal projects are handled

- Existing SIEN projects that already exist in the approved profile are not redrawn.
- New projects added in the portal are appended after the approved 30-page profile.
- The appended pages use the SIEN-style project page layout and start from page 31.

This keeps the official profile identical while still allowing the company to add new project pages through the portal.

## Important files

```text
public/pdf-template/sien-updated-2.pdf
app/api/generate-profile/route.ts
lib/pdf/ProfileDocument.tsx
```

## Deployment

Deploy normally to Vercel:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: leave empty
Root Directory: repository root
```
