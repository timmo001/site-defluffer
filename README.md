# Site Defluffer

Site Defluffer hides and compacts distracting interface elements on supported sites.

## Supported sites

### Twitch

- Hide extra sidebar and chat panels.
- Keep chat input controls on one line.

### YouTube

- Hide the page header.
- Resize the watch player to fill the page height.

## Install

1. Run `pnpm install` and `pnpm build`.
2. Open `chrome://extensions` in Chromium.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the `extension` directory.

## Add a site

Site-specific content scripts live under `src/sites/<site>/`. Add the site's
generated script path and URL match to `extension/manifest.json`, then group its
controls in the settings catalog.

## Develop

Install dependencies and check the typed source with:

```sh
pnpm install
pnpm check
```

TypeScript and popup CSS source live under `src/`. `pnpm build` generates the
extension assets; rebuild before reloading the unpacked extension in Chromium.

## Icons

Edit `extension/icons/icon.svg`, then regenerate the PNG sizes with:

```sh
./scripts/render-icons.sh
```
