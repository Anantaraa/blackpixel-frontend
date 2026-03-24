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

**Backend:** Supabase (PostgreSQL + auth). All data access is via direct Supabase client calls inside custom hooks — there is no API abstraction layer. Cloudinary is used for image uploads/delivery.

**Key environment variables** (Vite-prefixed):
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — required
- `VITE_CLOUDINARY_CLOUD_NAME` / `VITE_CLOUDINARY_PRESET` — required for image uploads
- `VITE_STRAPI_URL` / `VITE_API_TOKEN` — legacy, not actively used

## Routing

```
/          → Home (hero slider, featured projects, services)
/services  → Services page
/about     → About page
/contact   → Contact page
/login     → Supabase email/password auth
/admin     → Protected CMS dashboard (Projects + Hero Slides tabs)
```

`ProtectedRoute` (`src/components/common/ProtectedRoute.tsx`) wraps `/admin` — checks `supabase.auth.getSession()` and redirects unauthenticated users to `/login`.

## Data Layer

Custom hooks in `src/hooks/` handle all Supabase CRUD:
- `useProjects.ts` — projects table with categories join, gallery image management
- `useHeroSlides.ts` — hero_slides table for carousel management

Database tables: `projects`, `hero_slides`, `categories`. Gallery images are stored as JSON objects `{url, featured}` within the projects table.

## Styling & Theming

- Tailwind CSS with custom CSS variables for theming (`--color-primary`, `--color-neutral`, etc.)
- Dark/light mode uses `ThemeContext` (`src/context/ThemeContext.tsx`) which toggles a `.dark` class on `<html>` and uses the **View Transition API** for smooth theme switching animations
- Utility: `src/utils/cn.ts` wraps `clsx` + `tailwind-merge` for conditional class names — use this instead of string concatenation

## Animations

- **Framer Motion** for component animations and scroll-driven parallax (via `useScroll` transforms)
- **Lenis** (`src/index.css`) for smooth scrolling behavior
- **Swiper** for the hero carousel (5-second auto-advance)

## Admin CMS

`/admin` contains a tab-based CMS:
- **Projects tab**: full CRUD with Cloudinary image uploads, gallery management (main image + gallery with featured flags), display order, and category assignment
- **Hero Slides tab**: managed via `HeroSlidesManager` component

## Notable Patterns

- `src/utils/cloudinary.ts` — handles image uploads to Cloudinary before saving URLs to Supabase
- `src/data/mockData.ts` — mock project data (used as fallback/dev reference)
- `src/services/api.ts` — legacy Strapi client, not actively used
- No Redux/Zustand — React Context + hooks only
