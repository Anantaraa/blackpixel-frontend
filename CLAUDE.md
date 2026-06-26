# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Type-check (tsc -b) then Vite build → dist/
npm run lint      # ESLint with TypeScript + React rules
npm run preview   # Serve built dist/ locally
```

No test infrastructure is present.

## Architecture

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS 3 + React Router v7

**Backend:** Supabase (PostgreSQL + auth). All data access is via direct Supabase client calls inside custom hooks — there is no API abstraction layer.

**Image uploads:** `src/lib/storage.ts` calls a Supabase Edge Function (`/functions/v1/upload`) which returns a pre-signed S3 URL. The client PUTs directly to S3; served via CloudFront CDN. Some legacy project data still contains Cloudinary URLs — `Admin.tsx` detects these by checking for `cloudinary.com` in the URL.

**Deployment:** Vercel with a catch-all SPA rewrite (`vercel.json`).

**Key environment variables:**
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — required for all Supabase access
- `CLOUDFRONT_DOMAIN` — CloudFront CDN domain for image delivery (used in edge function, not exposed to frontend)
- `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_S3_BUCKET` — used only by the Supabase Edge Function, not by frontend code
- `VITE_CLOUDINARY_CLOUD_NAME` / `VITE_CLOUDINARY_PRESET` — legacy, kept for backward compatibility with existing Cloudinary URLs in the DB

## Routing

```
/          → Home (hero slider, featured projects, services)
/services  → Services page
/about     → About page
/contact   → Contact page
/login     → Supabase email/password auth
/admin     → Protected CMS dashboard (Projects + Hero Slides tabs)
/me/:slug  → MeCard — public digital business card for a team member
```

`ProtectedRoute` (`src/components/common/ProtectedRoute.tsx`) wraps `/admin` — checks `supabase.auth.getSession()` and redirects unauthenticated users to `/login`.

`MeCard` is completely standalone (own design tokens, no shared theme) and reads from the `team` table via `src/utils/actions.ts:getTeamMemberBySlug`.

## Data Layer

Custom hooks in `src/hooks/` handle all Supabase CRUD:
- `useProjects.ts` — projects table with categories join, gallery image management
- `useHeroSlides.ts` — hero_slides table for carousel management

Database tables: `projects`, `hero_slides`, `categories`, `team`. Gallery images are stored as JSON objects `{url, featured}` within the projects table.

SQL schema files in the repo root: `schema.sql`, `hero_slides.sql`, `fix_rls.sql`.

Supabase Edge Functions in `supabase/functions/`:
- `upload/` — generates pre-signed S3 PUT URL, returns CloudFront public URL
- `send-contact-email/` — handles contact form submissions

## Styling & Theming

- Tailwind CSS with custom CSS variables for theming. The config maps CSS variables to Tailwind color tokens:
  - `primary`, `primaryDark`, `secondary` — brand colors
  - `neutral` / `neutral-card` / `neutral-border` — backgrounds and borders
  - `text` / `text-muted` — typography
  - `surface` — elevated surface color
- Font families: `font-sans` → Inter, `font-display` → Outfit. Custom `text-display-{1,2,3}` sizes for large headings.
- Dark/light mode uses `ThemeContext` (`src/context/ThemeContext.tsx`) which toggles a `.dark` class on `<html>` and uses the **View Transition API** for a radial-clip-path animation originating from the click point
- Utility: `src/utils/cn.ts` wraps `clsx` + `tailwind-merge` for conditional class names — use this instead of string concatenation
- Icons: **Lucide React** (`lucide-react`) is used throughout

## Animations

- **Framer Motion** for component animations and scroll-driven parallax (via `useScroll` transforms)
- **Lenis** (`src/index.css`) for smooth scrolling behavior
- **Swiper** for the hero carousel (5-second auto-advance)

## Admin CMS

`/admin` contains a tab-based CMS:
- **Projects tab**: full CRUD with S3 image uploads (via `src/lib/storage.ts`), gallery management (main image + gallery with featured flags), display order, and category assignment
- **Hero Slides tab**: managed via `HeroSlidesManager` component

## Notable Patterns

- `src/lib/storage.ts` — image upload to S3 via Supabase Edge Function; includes retry logic and validates MIME type + 10 MB max size
- `src/utils/actions.ts` — direct Supabase queries not tied to a hook (currently: `getTeamMemberBySlug`)
- `src/data/mockData.ts` — mock project data (used as fallback/dev reference)
- `src/services/api.ts` — legacy Strapi client, not actively used
- No Redux/Zustand — React Context + hooks only
- `ProjectLightbox` deduplicates images by combining `project.image` (main) with `project.gallery[].url`, de-duped via `Set`
- `useProjects` normalizes gallery data on fetch — handles legacy `string[]` rows, stringified JSON objects, and current `{url, featured}` objects
