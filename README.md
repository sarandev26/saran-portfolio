# Saran SM — Portfolio

Personal portfolio of **Saran SM**, UI/UX & AI Web and Product Designer (Coimbatore, India).
A single-page cinematic experience: full-screen scenes stacked on top of each other,
each one rising over the last as you scroll, with scroll-driven set pieces inside them.

**Profiles:** [LinkedIn](https://www.linkedin.com/in/saran-sm-3b297725a) ·
[Behance](https://www.behance.net/saransm) ·
[Notion Portfolio](https://smsaran03.notion.site/Saran-s-Portfolio-18521427cebf8006a32df96c28f119c9) ·
[Email](mailto:smsaranx03@gmail.com)

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis (single rAF loop, see `lib/lenis.ts`) |
| 3D | Three.js (intro tunnel, journey light cables) |
| Styling | CSS Modules + design tokens in `app/globals.css` |
| Content | Typed local files in `content/` |

## The scenes

1. **Intro** — Three.js perspective tunnel travelled through the "SARAN" mask
2. **Hero** — headline, stats, CTAs, portrait
3. **About** — identity, philosophy cards, velocity marquee
4. **Journey** — 4 milestones inside a light-cable tunnel
5. **Design Stack** — tool spiral (Design, AI prototyping, Vibe coding)
6. **Work** — 20 selected projects on a perspective card arc with segmented filter (All / TFrenzy / Brillium), each with a case-study route at `/work/[slug]`
7. **Experience** — 3 roles as a stacked panel deck
8. **Credentials** — 3 certification records with issuer marks
9. **Connect** — contact channels, socials, resume download, footer

## Scroll architecture

The page is a stack, not a column. Each scene is a sticky `100svh` hold plus a
runway sibling rendered directly under `<main>` (`components/layout/Scene.tsx`):
the outgoing frame stays pinned while the next one physically rises from the
bottom of the viewport and covers it. Scroll-driven interiors read their
progress off the runway (`lib/scene.ts`) rather than pinning themselves, so
every transition is scrubbable and reverses exactly.

## Structure

```
app/            layout, the scene stack (page.tsx), /work/[slug] case studies,
                sitemap, robots, 404, /tunnel lab route
components/
  layout/       Nav, Scene, SmoothScroll
  sections/     one folder per scene (component + module.css)
  ui/           Button (the site-wide CTA standard), VelocityMarquee
content/        typed content: projects, journey, experience, certifications, stack
lib/            gsap/lenis integration, scene scrub helper, site meta
public/images/  covers, issuer + company marks
```

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes statically generated)
```

Set `NEXT_PUBLIC_SITE_URL` once a domain exists — sitemap, robots, OG and
JSON-LD follow automatically (`lib/site.ts`).
