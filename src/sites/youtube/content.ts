import {
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  YOUTUBE_SETTINGS,
  type SettingsFor
} from "../../settings.js";

type Settings = SettingsFor<typeof YOUTUBE_SETTINGS>;

const DEFAULT_SETTINGS = getDefaultSettings(YOUTUBE_SETTINGS);
const [HIDE_HEADER, FILL_PAGE_HEIGHT] = YOUTUBE_SETTINGS;

const STYLE_ID = "site-defluffer-youtube-style";
const CLASSES = {
  hideHeader: "site-defluffer-youtube-hide-header",
  fillPageHeight: "site-defluffer-youtube-fill-page-height"
};

const STYLES = `
html.${CLASSES.hideHeader} ytd-app #masthead-container,
html.${CLASSES.hideHeader} ytd-app #masthead-placeholder {
  display: none !important;
}

html.${CLASSES.hideHeader} ytd-app #page-manager {
  margin-top: 0 !important;
}

html.${CLASSES.fillPageHeight} ytd-watch-flexy[full-bleed-player] #full-bleed-container,
html.${CLASSES.fillPageHeight} ytd-watch-flexy[full-bleed-player] #player-full-bleed-container,
html.${CLASSES.fillPageHeight} ytd-watch-flexy[full-bleed-player] #player-container,
html.${CLASSES.fillPageHeight} ytd-watch-flexy[full-bleed-player] ytd-player,
html.${CLASSES.fillPageHeight} ytd-watch-flexy[full-bleed-player] #movie_player {
  height: calc(100svh - var(--site-defluffer-youtube-header-height, 56px)) !important;
  min-height: calc(100svh - var(--site-defluffer-youtube-header-height, 56px)) !important;
}

html.${CLASSES.fillPageHeight} ytd-watch-flexy:not([full-bleed-player]) #player,
html.${CLASSES.fillPageHeight} ytd-watch-flexy:not([full-bleed-player]) #player-container-outer,
html.${CLASSES.fillPageHeight} ytd-watch-flexy:not([full-bleed-player]) #player-container-inner,
html.${CLASSES.fillPageHeight} ytd-watch-flexy:not([full-bleed-player]) #player-container,
html.${CLASSES.fillPageHeight} ytd-watch-flexy:not([full-bleed-player]) ytd-player,
html.${CLASSES.fillPageHeight} ytd-watch-flexy:not([full-bleed-player]) #movie_player {
  height: calc(100svh - var(--site-defluffer-youtube-header-height, 56px) - var(--ytd-watch-flexy-top-padding, 12px)) !important;
  min-height: calc(100svh - var(--site-defluffer-youtube-header-height, 56px) - var(--ytd-watch-flexy-top-padding, 12px)) !important;
}

html.${CLASSES.hideHeader}.${CLASSES.fillPageHeight} {
  --site-defluffer-youtube-header-height: 0px;
}
`;

const state: Settings = { ...DEFAULT_SETTINGS };

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.documentElement.appendChild(style);
}

function applySettings() {
  ensureStyle();
  document.documentElement.classList.toggle(
    CLASSES.hideHeader,
    state[HIDE_HEADER.key]
  );
  document.documentElement.classList.toggle(
    CLASSES.fillPageHeight,
    state[FILL_PAGE_HEIGHT.key]
  );
}

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  Object.assign(state, decodeSettings(YOUTUBE_SETTINGS, result));
  applySettings();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextState = applyStorageChanges(YOUTUBE_SETTINGS, state, changes);

  if (!nextState) {
    return;
  }

  Object.assign(state, nextState);
  applySettings();
});
