@AGENTS.md

AxisDev quick context (for Claude Code):

- Package manager: use `pnpm` (`pnpm dev`, `pnpm build`, `pnpm start`).
- Do not run linters/formatters unless explicitly requested.
- Env source of truth: `.env.example` and `lib/env.ts` (never commit `.env.local`).
- Auth: Auth.js / NextAuth v5; local Google callback is `http://localhost:3000/api/auth/callback/google`.
- Tailwind v4 var syntax: `bg-(--axis-...)`, `text-(--axis-...)`, `border-(--axis-...)`, `ring-(--axis-...)`.

Next.js note:

- This project may use breaking Next.js changes. Before writing Next.js code, read `node_modules/next/dist/docs/`.
