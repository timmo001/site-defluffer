import {
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  YOUTUBE_SETTINGS,
  type SettingsFor
} from "../../settings.js";
import { registerExtensionToggle } from "../../toggle-extension.js";
import {
  NARROW_SCROLLBAR_CLASS,
  WINDOW_SCROLLBAR_STYLES
} from "../window-scrollbar.js";

type Settings = SettingsFor<typeof YOUTUBE_SETTINGS>;

const DEFAULT_SETTINGS = getDefaultSettings(YOUTUBE_SETTINGS);
const [SITE_ENABLED, HIDE_HEADER, FILL_PAGE_HEIGHT, NARROW_SCROLLBARS] =
  YOUTUBE_SETTINGS;

registerExtensionToggle(SITE_ENABLED);

const STYLE_ID = "site-defluffer-youtube-style";
const CLASSES = {
  hideHeader: "site-defluffer-youtube-hide-header",
  floatingHeader: "site-defluffer-youtube-floating-header",
  fillPageHeight: "site-defluffer-youtube-fill-page-height"
};

const STYLES = `
${WINDOW_SCROLLBAR_STYLES}
html.${CLASSES.hideHeader} ytd-app #masthead-container,
html.${CLASSES.hideHeader} ytd-app #masthead-placeholder {
  display: none !important;
}

html.${CLASSES.hideHeader} ytd-app #page-manager {
  margin-top: 0 !important;
}

html.${CLASSES.hideHeader}.${CLASSES.floatingHeader} ytd-app #masthead-container {
  display: block !important;
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
let hideHeaderOverride: boolean | null = null;
let playerObserver: MutationObserver | null = null;
let playerObserverTimeout: number | null = null;

function stopWaitingForMainPlayer() {
  playerObserver?.disconnect();
  playerObserver = null;

  if (playerObserverTimeout !== null) {
    window.clearTimeout(playerObserverTimeout);
    playerObserverTimeout = null;
  }
}

function waitForMainPlayer() {
  if (playerObserver) {
    return;
  }

  playerObserver = new MutationObserver(() => {
    if (
      document.querySelector("ytd-watch-flexy:not([hidden]) #movie_player") ===
      null
    ) {
      return;
    }

    stopWaitingForMainPlayer();
    applySettings();
  });
  playerObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  playerObserverTimeout = window.setTimeout(stopWaitingForMainPlayer, 10_000);
}

function applyFloatingHeader() {
  document.documentElement.classList.toggle(
    CLASSES.floatingHeader,
    document.documentElement.classList.contains(CLASSES.hideHeader) &&
      window.scrollY > 200
  );
}

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
  const hasMainPlayer =
    document.querySelector("ytd-watch-flexy:not([hidden]) #movie_player") !== null;

  if (hasMainPlayer) {
    stopWaitingForMainPlayer();
  } else if (
    state[SITE_ENABLED.key] &&
    ((hideHeaderOverride ?? state[HIDE_HEADER.key]) ||
      state[FILL_PAGE_HEIGHT.key])
  ) {
    waitForMainPlayer();
  } else {
    stopWaitingForMainPlayer();
  }

  document.documentElement.classList.toggle(
    CLASSES.hideHeader,
    hasMainPlayer &&
      state[SITE_ENABLED.key] &&
      (hideHeaderOverride ?? state[HIDE_HEADER.key])
  );
  document.documentElement.classList.toggle(
    CLASSES.fillPageHeight,
    hasMainPlayer &&
      state[SITE_ENABLED.key] &&
      state[FILL_PAGE_HEIGHT.key]
  );
  document.documentElement.classList.toggle(
    NARROW_SCROLLBAR_CLASS,
    state[SITE_ENABLED.key] && state[NARROW_SCROLLBARS.key]
  );
  applyFloatingHeader();

  requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
}

document.addEventListener("yt-navigate-finish", applySettings);
window.addEventListener("scroll", applyFloatingHeader, { passive: true });

document.addEventListener("keydown", (event) => {
  if (
    event.key.toLowerCase() !== "t" ||
    !event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.repeat ||
    document.querySelector("ytd-watch-flexy:not([hidden]) #movie_player") === null
  ) {
    return;
  }

  event.preventDefault();
  hideHeaderOverride = !document.documentElement.classList.contains(
    CLASSES.hideHeader
  );
  applySettings();
});

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
  hideHeaderOverride = null;
  applySettings();
});
