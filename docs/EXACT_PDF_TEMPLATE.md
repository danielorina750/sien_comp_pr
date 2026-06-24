# Exact PDF Template Mode

This version uses the uploaded SIEN profile PDF as the visual source of truth.

## How it works

- The 30-page reference profile is pre-rendered into `/public/pdf-template/page-01.jpg` through `/public/pdf-template/page-30.jpg`.
- Static company sections such as cover, overview, service engine, portfolio analytics, compliance, regulatory papers, and contact are inserted as exact full-page template images.
- Existing SIEN portfolio projects that match the reference profile use the exact reference profile pages.
- New projects added through the portal are inserted using a matching SIEN project-page layout: dark green/cream background, lime border, status/location pills, project image, description, and design intelligence bullets.

## Why this was added

The previous PDF generator created a similar profile, but it did not follow the exact visual format of the approved SIEN PDF. This version preserves the reference design and only generates new project pages when additional uploaded projects need to be added.

## Important note

If the approved base PDF design changes, re-render the new PDF pages into `/public/pdf-template/` and replace the existing page images.

## Dynamic project page update

Dynamic project pages now use the same SIEN portfolio page language as the approved profile:

- full-bleed architectural image on one side;
- rounded dark or light content card on the opposite side;
- status and location pills;
- category label, project title, description and design intelligence bullets;
- no empty interstitial page or blank visual gap before the next section;
- safe image fallback so PDF generation never produces a blank project page when an uploaded image is temporarily unavailable.
