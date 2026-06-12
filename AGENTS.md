# Frontend Conventions

- Never use inline styles — always use SCSS classes imported from `src/assets/*.scss`
- Use `rem` units via SCSS (convert px with `0.0625rem` multiplier)
- Prefer CSS custom properties for theming (defined in `variables.scss`)
- Use `dv()` utility for density-aware values only when unavoidable

## API Reference

Always read each service's `API.md` to check the current API spec before making changes that touch the API layer:
- `services/post/API.md` — Boards, posts, comments, replies, votes, feed
- `services/gateway/API.md` — Route map (which path goes to which service)
- `services/auth/API.md` — Login, signup, logout, account
- `services/social/API.md` — Friends
- `services/social-feed/API.md` — Following boards, user stats
- `services/moderation/API.md` — Reports, mod log, board management

If the API spec does not have a feature I need, write a note to the service's `API_TODO.md` listing what is missing, then continue assuming the endpoint exists so the frontend code can be written. When the backend is ready, `API_TODO.md` serves as a checklist of endpoints to implement.
