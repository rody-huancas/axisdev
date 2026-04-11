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
<!-- END:project-notes -->
