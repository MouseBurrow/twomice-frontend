# Frontend Conventions

- Never use inline styles — always use SCSS classes imported from `src/assets/*.scss`
- Use `rem` units via SCSS (convert px with `0.0625rem` multiplier)
- Prefer CSS custom properties for theming (defined in `variables.scss`)
- Use `dv()` utility for density-aware values only when unavoidable
