<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-notes -->
## Project notes
- Tailwind v4 var syntax: use `bg-(--axis-...)`, `text-(--axis-...)`, `border-(--axis-...)`, `ring-(--axis-...)`.
- Avoid running linters/formatters unless explicitly requested.
- Auth routing: `/` redirects to `/dashboard` when session exists; admin layout redirects to `/` when no session.
- Login UI assets live in `public/axisdev.webp` and `public/image-1.jpeg`.
- Use `pnpm` (see `package.json` scripts). Prefer `pnpm dev`, `pnpm build`, `pnpm start`.
- Env source of truth: `.env.example` and `lib/env.ts`. Do not commit `.env.local`.
- Supabase service role key should be server-only (`SUPABASE_SERVICE_ROLE_KEY`); code also supports `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` for compatibility.
- When documenting or adding examples, keep them aligned with current env keys and Next/Auth (Auth.js / NextAuth v5).
<!-- END:project-notes -->
