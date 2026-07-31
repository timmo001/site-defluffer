# Site Defluffer

Site Defluffer hides and compacts distracting interface elements on supported sites.

Press `Alt+Shift+T` on a supported site to enable or disable Site Defluffer for
that site without altering its individual settings.

## Supported sites

### Twitch

- Changes only apply on pages with the full player and chat layout.
- Hide extra sidebar and chat panels.
- Keep chat input controls on one line.

### YouTube

- Changes only apply on full watch players, not the mini-player.
- Hide the page header.
- Resize the watch player to fill the page height.
- Press `Alt+T` to temporarily toggle the header on the current page.

## Install

1. Run `mise run build`.
2. Open `chrome://extensions` in Chromium.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the `extension` directory.

## Add a site

Site-specific content scripts live under `src/sites/<site>/`. Add the site's
generated script path and URL match to `extension/manifest.json`, then group its
controls in the settings catalog.

## Develop

Install dependencies and run the full check with:

```sh
mise run check
```

TypeScript and popup CSS source live under `src/`. `pnpm build` generates the
extension assets; rebuild before reloading the unpacked extension in Chromium.

## Icons

Edit `extension/icons/icon.svg`, then regenerate the PNG sizes with:

```sh
./scripts/render-icons.sh
```
