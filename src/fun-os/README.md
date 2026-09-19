# Fun OS monolith

Industrial Field OS UI: paper `#F5F3EF`, ink `#0A0A0A`, safety orange `#FF5E1A`, blueprint `#0A3CFF`.

Routes owned inside `FunOS.jsx` via `history.pushState`:
`/ /platform /solutions /supply /fleet /pricing /about /contact /signup /login /credit /dashboard`

Enable:
- `src/App.jsx` re-exports this module
- `src/main.jsx` does not wrap `BrowserRouter` (Fun OS owns history)
- `lucide-react` is required

Revert to Field OS: restore `src/App.jsx` and `src/main.jsx` from `main` before this branch.
