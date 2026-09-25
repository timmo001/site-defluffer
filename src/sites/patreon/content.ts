import {
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  PATREON_SETTINGS,
  type SettingsFor
} from "../../settings.js";
import { registerExtensionToggle } from "../../toggle-extension.js";

type Settings = SettingsFor<typeof PATREON_SETTINGS>;

const DEFAULT_SETTINGS = getDefaultSettings(PATREON_SETTINGS);

const [SITE_ENABLED, HIDE_HEADER, HIDE_SIDEBAR, FILL_PAGE_HEIGHT] =
  PATREON_SETTINGS;

registerExtensionToggle(SITE_ENABLED);

const STYLE_ID = "site-defluffer-patreon-style";

const CLASSES = {
  hideHeader: "site-defluffer-patreon-hide-header",
  hideSidebar: "site-defluffer-patreon-hide-sidebar",
  floating: "site-defluffer-patreon-floating",
  fillPageHeight: "site-defluffer-patreon-fill-page-height"
};

const VIDEO_POST_SELECTOR = '[class*="__compactMediaWrapper"] video';

const VIDEO_POST = `:has(${VIDEO_POST_SELECTOR})`;

const HEADER = '[class*="__stickyNav"]';

const SIDEBAR = '[class*="__primaryNavigationWrapper"]';

// Patreon's page frame leaves 8px above and below, plus a 1px offset at the
// top, and its sticky creator nav is 56px tall. The sidebar is 72px wide.
// Filling the page removes the frame, so the video can reach every edge.
const STYLES = `
html.${CLASSES.hideHeader}${VIDEO_POST} {
  --site-defluffer-patreon-header-height: 0px;
}

html.${CLASSES.hideHeader}:not(.${CLASSES.floating})${VIDEO_POST} ${HEADER} {
  display: none !important;
}

html.${CLASSES.hideHeader}.${CLASSES.floating}${VIDEO_POST} ${HEADER} {
  position: fixed !important;
  top: 9px !important;
  left: 72px !important;
  right: 8px !important;
  width: auto !important;
}

html.${CLASSES.hideSidebar}:not(.${CLASSES.floating})${VIDEO_POST} ${SIDEBAR} {
  display: none !important;
}

html.${CLASSES.hideSidebar}.${CLASSES.floating}${VIDEO_POST} ${SIDEBAR} {
  left: 0 !important;
}

html.${CLASSES.hideSidebar}${VIDEO_POST} [class*="__hasPrimaryNavigation"] {
  padding-left: 8px !important;
}

html.${CLASSES.hideSidebar}${VIDEO_POST} [class*="__navigationOffset"] {
  margin-left: 0 !important;
}

html.${CLASSES.hideSidebar}${VIDEO_POST} [class*="__pageFrame"] {
  left: 8px !important;
}

html.${CLASSES.fillPageHeight}${VIDEO_POST} [class*="__pageFrame"] {
  display: none !important;
}

html.${CLASSES.fillPageHeight}${VIDEO_POST} [class*="__hasPrimaryNavigation"] {
  padding: 0 !important;
}

html.${CLASSES.fillPageHeight}${VIDEO_POST} [class*="__navigationOffset"] {
  margin-top: 0 !important;
}

html.${CLASSES.fillPageHeight}${VIDEO_POST} ${HEADER} {
  top: 0 !important;
}

html.${CLASSES.fillPageHeight}.${CLASSES.hideHeader}.${CLASSES.floating}${VIDEO_POST} ${HEADER} {
  top: 0 !important;
  right: 0 !important;
}

html.${CLASSES.fillPageHeight} [class*="__compactMediaWrapper"]:has(video) {
  padding-top: 0 !important;
}

html.${CLASSES.fillPageHeight} [class*="__compactMediaWrapper"]:has(video) [class*="__premiumPostContent"] {
  max-width: none !important;
  padding: 0 !important;
}

html.${CLASSES.fillPageHeight} [class*="__compactMediaWrapper"] div:has(> [class*="VideoPlayer-module__"][class*="__player"]) {
  height: calc(100svh - var(--site-defluffer-patreon-header-height, 56px)) !important;
  padding: 0 !important;
}
`;

const state: Settings = { ...DEFAULT_SETTINGS };

let hideHeaderOverride: boolean | null = null;

function applyFloating() {
  const classList = document.documentElement.classList;

  classList.toggle(
    CLASSES.floating,
    (classList.contains(CLASSES.hideHeader) ||
      classList.contains(CLASSES.hideSidebar)) &&
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
    CLASSES.hideSidebar,
    state[SITE_ENABLED.key] && state[HIDE_SIDEBAR.key]
  );
  document.documentElement.classList.toggle(
    CLASSES.fillPageHeight,
    state[SITE_ENABLED.key] && state[FILL_PAGE_HEIGHT.key]
  );
  applyFloating();

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

window.addEventListener("scroll", applyFloating, { passive: true });

document.addEventListener("keydown", (event) => {
  if (
    event.key.toLowerCase() !== "t" ||
    !event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.repeat ||
    !state[SITE_ENABLED.key] ||
    document.querySelector(VIDEO_POST_SELECTOR) === null
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
  Object.assign(state, decodeSettings(PATREON_SETTINGS, result));
  applySettings();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextState = applyStorageChanges(PATREON_SETTINGS, state, changes);

  if (!nextState) {
    return;
  }

  Object.assign(state, nextState);
  hideHeaderOverride = null;
  applySettings();
});
