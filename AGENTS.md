# Frontend Conventions

- Never use inline styles — always use SCSS classes imported from `src/assets/*.scss`. Only the truly dynamic values (positions, colors computed from JS) may be inline, and even then prefer CSS custom properties.
- Use `rem` units via SCSS (convert px with `0.0625rem` multiplier)
- Prefer CSS custom properties for theming (defined in `variables.scss`)
- Use `dv()` utility for density-aware values only when unavoidable

## Mouse Terminology

- **nibbles** — posts (a single post is a "nibble")
- **squeaks** — comments / replies
- **burrows** — boards / communities
- **hole** — the feed / front page

## API Reference

Before making changes that touch the API layer, check the backend service's `API.md` for the current spec. These live in `services/` under the monorepo root (`..` from here):

- `services/post/API.md` — Boards, posts, comments, replies, votes, feed
- `services/gateway/API.md` — Route map (which path goes to which service)
- `services/auth/API.md` — Login, signup, logout, account
- `services/social/API.md` — Friends
- `services/social-feed/API.md` — Following boards, user stats
- `services/moderation/API.md` — Reports, mod log, board management

If the API spec lacks a feature the frontend needs, add a note to that service's `API_TODO.md` in `services/<name>/API_TODO.md`, then continue assuming the endpoint exists so the frontend code can be written.
