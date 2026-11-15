# Site Defluffer

A Chromium extension that hides and compacts distracting interface elements on
supported sites (Corridor Digital, Patreon, Twitch, Twitter, Viva+ and YouTube).
Its TypeScript and Lit popup source lives in `src/`, and `scripts/build.mjs`
writes the loadable extension into `extension/`.

## Stack

- pnpm 12, pinned in `package.json` and `mise.toml`, on Node 26
- esbuild bundles `src/` into `extension/`, with the built `.js` files committed
- Oxlint with the shared `@timmo001/oxlint-rules` preset and type-aware checks
  (`oxlint.config.ts`)
- Prettier for formatting, with `.prettierignore` skipping built output and
  lockfiles
- Lit components with `@timmo001/groundwork-ui` and tokens

## Checks

- `mise run check` runs lint, typecheck, test, the format check and the build.
  Run it before a push. `mise run format` writes formatting fixes.
- `mise run lint`, `mise run typecheck`, `mise run test` and `mise run build`
  run one part at a time.
- `hk.pkl` is the pre-push hook: the shared Markdown, YAML, Actions and shell
  lints, plus Oxlint through `pnpm exec`. Run `hk check --all` to check the
  whole repository, and install the hook with `hk install` once.
- Built `extension/*.js` and `extension/popup.css` are generated, so run
  `mise run build` after a source change and never hand-edit them.

## Rollout

- Changes go straight to `main`, with a short imperative commit subject.
  Renovate opens dependency updates and automerges the ones that pass.
- CI runs Lint, Build and the shared Actions and lint workflows from
  `timmo001/workflows`, pinned to a tag.
- Don't hand-edit the generated `.opencode/opencode.jsonc`.
