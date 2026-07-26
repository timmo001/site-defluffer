const STORAGE_KEYS = {
  hideHeader: "youtubeHideHeader",
  fillPageHeight: "youtubeFillPageHeight"
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
type Settings = Record<StorageKey, boolean>;

const DEFAULT_SETTINGS: Settings = {
  [STORAGE_KEYS.hideHeader]: false,
  [STORAGE_KEYS.fillPageHeight]: false
};

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
    state[STORAGE_KEYS.hideHeader]
  );
  document.documentElement.classList.toggle(
    CLASSES.fillPageHeight,
    state[STORAGE_KEYS.fillPageHeight]
  );
}

function normalizeSettings(settings: Record<string, unknown>): Settings {
  return {
    [STORAGE_KEYS.hideHeader]: Boolean(settings[STORAGE_KEYS.hideHeader]),
    [STORAGE_KEYS.fillPageHeight]: Boolean(
      settings[STORAGE_KEYS.fillPageHeight]
    )
  };
}

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  Object.assign(state, normalizeSettings(result));
  applySettings();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  let didChange = false;

  for (const key of Object.values(STORAGE_KEYS)) {
    if (!changes[key]) {
      continue;
    }

    state[key] = Boolean(changes[key].newValue);
    didChange = true;
  }

  if (didChange) {
    applySettings();
  }
});
