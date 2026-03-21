# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm run lint      # Run ESLint
npx convex dev    # Start Convex backend (run alongside Next.js dev)
npx convex deploy # Deploy Convex functions to production
```

There are no tests configured yet.

## Required Environment Variables

- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL (client-side)
- `CLERK_JWT_ISSUER_DOMAIN` — Clerk JWT issuer domain for Convex auth

## Architecture

This is a Next.js 16 + Convex + Clerk application.

**Auth flow:** Clerk handles user authentication. The provider hierarchy in `app/layout.tsx` is `ClerkProvider` > `ConvexProviderWithClerk` (in `components/ConvexClientProvider.tsx`). Convex uses Clerk's JWT tokens for server-side identity verification, configured in `convex/auth.config.ts`.

**Convex backend:** All backend logic lives in `convex/`. Functions are defined there and auto-generated types appear in `convex/_generated/`. Queries/mutations require checking `ctx.auth.getUserIdentity()` to enforce authentication. The schema is defined in `convex/schema.ts`.

**Middleware:** `proxy.ts` (at the root, used as `middleware.ts`) runs Clerk's middleware on all routes except static assets.

**Routing:** Standard Next.js App Router. Pages use `<Authenticated>` / `<Unauthenticated>` components from `convex/react` to conditionally render based on auth state.

**Styling:** Tailwind CSS v4 with PostCSS. Geist fonts loaded via `next/font/google`.
