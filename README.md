# Site Defluffer

Site Defluffer hides and compacts distracting interface elements on supported sites.

## Supported sites

### Twitch

- Hide extra sidebar and chat panels.
- Keep chat input controls on one line.

## Install

1. Open `chrome://extensions` in Chromium.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this repository.

## Add a site

Site-specific content scripts live under `sites/<site>/`. Add the site's script and URL match to `manifest.json`, then group its controls in the popup. Site Defluffer currently requests access only to Twitch; YouTube support will be added separately.

## Icons

Edit `icons/icon.svg`, then regenerate the PNG sizes with:

```sh
./scripts/render-icons.sh
```
