import {
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  VIVAPLUS_SETTINGS,
  type SettingsFor
} from "../../settings.js";
import { registerExtensionToggle } from "../../toggle-extension.js";
import {
  NARROW_SCROLLBAR_CLASS,
  WINDOW_SCROLLBAR_STYLES
} from "../window-scrollbar.js";

type Settings = SettingsFor<typeof VIVAPLUS_SETTINGS>;

const DEFAULT_SETTINGS = getDefaultSettings(VIVAPLUS_SETTINGS);

const [SITE_ENABLED, HIDE_HEADER, FILL_PAGE_HEIGHT, NARROW_SCROLLBARS] =
  VIVAPLUS_SETTINGS;

registerExtensionToggle(SITE_ENABLED);

const STYLE_ID = "site-defluffer-vivaplus-style";

const CLASSES = {
  hideHeader: "site-defluffer-vivaplus-hide-header",
  floatingHeader: "site-defluffer-vivaplus-floating-header",
  fillPageHeight: "site-defluffer-vivaplus-fill-page-height"
};

const VIDEO_CONTAINER = ".video-page__video-container--mux";

const VIDEO_PAGE = `:has(${VIDEO_CONTAINER} mux-player)`;

// Below 640px Viva+ hides the page header and uses its own sticky mobile
// player, so only the desktop layout is changed. The header is 80px tall.
const STYLES = `
${WINDOW_SCROLLBAR_STYLES}
@media (min-width: 640px) {
  html.${CLASSES.hideHeader}${VIDEO_PAGE} {
    --site-defluffer-vivaplus-header-height: 0px;
  }

  html.${CLASSES.hideHeader}:not(.${CLASSES.floatingHeader})${VIDEO_PAGE} .page__header {
    display: none !important;
  }

  html.${CLASSES.hideHeader}.${CLASSES.floatingHeader}${VIDEO_PAGE} .page__header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
  }

  html.${CLASSES.fillPageHeight}${VIDEO_PAGE} ${VIDEO_CONTAINER} {
    padding-top: calc(100svh - var(--site-defluffer-vivaplus-header-height, 80px)) !important;
  }
}
`;

const state: Settings = { ...DEFAULT_SETTINGS };

let hideHeaderOverride: boolean | null = null;

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

  document.documentElement.classList.toggle(
    CLASSES.hideHeader,
    state[SITE_ENABLED.key] && (hideHeaderOverride ?? state[HIDE_HEADER.key])
  );
  document.documentElement.classList.toggle(
    CLASSES.fillPageHeight,
    state[SITE_ENABLED.key] && state[FILL_PAGE_HEIGHT.key]
  );
  document.documentElement.classList.toggle(
    NARROW_SCROLLBAR_CLASS,
    state[SITE_ENABLED.key] && state[NARROW_SCROLLBARS.key]
  );
  applyFloatingHeader();
}

window.addEventListener("scroll", applyFloatingHeader, { passive: true });

document.addEventListener("keydown", (event) => {
  if (
    event.key.toLowerCase() !== "t" ||
    !event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.repeat ||
    !state[SITE_ENABLED.key] ||
    document.querySelector(`${VIDEO_CONTAINER} mux-player`) === null
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
  Object.assign(state, decodeSettings(VIVAPLUS_SETTINGS, result));
  applySettings();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextState = applyStorageChanges(VIVAPLUS_SETTINGS, state, changes);

  if (!nextState) {
    return;
  }

  Object.assign(state, nextState);
  hideHeaderOverride = null;
  applySettings();
});
