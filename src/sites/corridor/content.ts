import {
  applyStorageChanges,
  CORRIDOR_SETTINGS,
  decodeSettings,
  getDefaultSettings,
  type SettingsFor
} from "../../settings.js";
import { registerExtensionToggle } from "../../toggle-extension.js";
import {
  NARROW_SCROLLBAR_CLASS,
  WINDOW_SCROLLBAR_STYLES
} from "../window-scrollbar.js";

type Settings = SettingsFor<typeof CORRIDOR_SETTINGS>;

const DEFAULT_SETTINGS = getDefaultSettings(CORRIDOR_SETTINGS);

const [SITE_ENABLED, HIDE_HEADER, FILL_PAGE_HEIGHT, NARROW_SCROLLBARS] =
  CORRIDOR_SETTINGS;

registerExtensionToggle(SITE_ENABLED);

const STYLE_ID = "site-defluffer-corridor-style";

const CLASSES = {
  hideHeader: "site-defluffer-corridor-hide-header",
  fillPageHeight: "site-defluffer-corridor-fill-page-height"
};

const THEATRE_PLAYER =
  "app-video-player .theatre-placeholder .shaka-container:not(.player-pip)";

const STYLES = `
${WINDOW_SCROLLBAR_STYLES}
html.${CLASSES.hideHeader}:has(${THEATRE_PLAYER}) body {
  padding-top: 0 !important;
}

html.${CLASSES.hideHeader}:has(${THEATRE_PLAYER}) app-root header {
  display: none !important;
}

html.${CLASSES.fillPageHeight}:has(${THEATRE_PLAYER}) app-video-player .theatre-placeholder {
  width: 100% !important;
  max-width: none !important;
  height: calc(100svh - 68px) !important;
  max-height: none !important;
  aspect-ratio: auto !important;
  margin: 0 auto !important;
}

html.${CLASSES.fillPageHeight}.${CLASSES.hideHeader}:has(${THEATRE_PLAYER}) app-video-player .theatre-placeholder {
  height: 100svh !important;
}

html.${CLASSES.fillPageHeight}:has(${THEATRE_PLAYER}) app-video-player shaka-player,
html.${CLASSES.fillPageHeight}:has(${THEATRE_PLAYER}) app-video-player .shaka-container,
html.${CLASSES.fillPageHeight}:has(${THEATRE_PLAYER}) app-video-player .shaka-video-container {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-height: none !important;
}

html.${CLASSES.fillPageHeight}:has(${THEATRE_PLAYER}) app-video-player video {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}
`;

const state: Settings = { ...DEFAULT_SETTINGS };

function applySettings() {
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLES;
    document.documentElement.appendChild(style);
  }

  const videoPage = /^\/video\/[^/]+\/?$/.test(location.pathname);
  document.documentElement.classList.toggle(
    CLASSES.hideHeader,
    videoPage && state[SITE_ENABLED.key] && state[HIDE_HEADER.key]
  );
  document.documentElement.classList.toggle(
    CLASSES.fillPageHeight,
    videoPage && state[SITE_ENABLED.key] && state[FILL_PAGE_HEIGHT.key]
  );
  document.documentElement.classList.toggle(
    NARROW_SCROLLBAR_CLASS,
    state[SITE_ENABLED.key] && state[NARROW_SCROLLBARS.key]
  );
}

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  Object.assign(state, decodeSettings(CORRIDOR_SETTINGS, result));
  applySettings();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextState = applyStorageChanges(CORRIDOR_SETTINGS, state, changes);

  if (!nextState) {
    return;
  }

  Object.assign(state, nextState);
  applySettings();
});

window.addEventListener("popstate", applySettings);

const main = document.getElementById("main-content");

if (main) {
  new MutationObserver(applySettings).observe(main, { childList: true });
}
