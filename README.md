# Design Your Workspace — monis.rent

Interactive workspace builder for [monis.rent](https://www.monis.rent): pick a desk, a chair, and gear from their real catalogue, watch it drop into a 3D room, then rent the setup.

**Live:** https://desent-coding-test-2-beryl.vercel.app

![Founders setup in the 3D room](.github/pr-screenshots/readme-hero.jpg)

## What you can do

- Choose from 36 real monis.rent products (names, photos, and prices snapshotted from their catalogue), across desks, chairs, monitors, desk gear, tech, and room items.
- See each item appear in a sunlit 3D room: drag to look around, hover or tap any item for its name and price, and click it to jump to its card.
- Switch the desk between sitting and standing.
- Start from one of monis.rent's bundles (Essentials, Founders, Trading, Studio).
- Pick a rental length; from 1 month, monis.rent's long-term weekly rates apply.
- Check out with a per-item summary that links to each product on monis.rent.

## Approach

I wanted picking gear to feel like setting up a real room, not browsing a catalogue, so the preview is a 3D scene every choice drops into. monis.rent only has product photos on white backgrounds, so each item is a simple model built in code and matched to its photo, with real names and prices snapshotted from monis.rent's public catalogue. The selection and pricing rules (slot limits, "needs a monitor", long-term rates) are small pure functions with unit tests, kept apart from the UI.

**Tech choices:** Next.js 16 (App Router) and React 19 with plain `useState`, since the state is small and lives on one page. The 3D scene uses React Three Fiber and drei. It's lazy-loaded so three.js stays out of the first page load, and it only re-renders when something changes. Tailwind CSS 4 carries monis.rent's colours, Biome handles linting and formatting, and Node's built-in test runner avoids extra test dependencies.

**With more time I'd:**
- replace the hand-built models with real 3D scans;
- load the catalogue live, with sizes and availability, instead of from a snapshot;
- hand the setup to monis.rent's real cart;
- make setups shareable by link;
- add a low-power mode for older phones;
- add browser tests for the main flows;
- turn on automatic deploys from `main`.

## Development

```bash
pnpm install
pnpm dev
```

- `pnpm lint` — Biome check
- `pnpm test` — selection and pricing rules (Node's built-in test runner)
- `pnpm build` — production build
- `pnpm deploy:prod` — build and deploy the current working copy to Vercel production (needs `npx vercel login` once). Merging to `main` doesn't deploy automatically, so run this after each merge.

Product data lives in `src/data/products.ts` and `src/data/bundles.ts`; the selection and pricing rules are in `src/lib/selection.ts`; the 3D scene is in `src/components/workspace-builder/scene/`.
