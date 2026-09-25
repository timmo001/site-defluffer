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

const [SITE_ENABLED, FILL_PAGE_HEIGHT] = PATREON_SETTINGS;

registerExtensionToggle(SITE_ENABLED);

const STYLE_ID = "site-defluffer-patreon-style";

const CLASSES = {
  fillPageHeight: "site-defluffer-patreon-fill-page-height"
};

// Patreon's page frame leaves 8px above and below, and its sticky creator
// nav takes 57px at the top.
const STYLES = `
html.${CLASSES.fillPageHeight} [class*="__compactMediaWrapper"]:has(video) {
  padding-top: 0 !important;
}

html.${CLASSES.fillPageHeight} [class*="__compactMediaWrapper"]:has(video) [class*="__premiumPostContent"] {
  max-width: none !important;
  padding: 0 !important;
}

html.${CLASSES.fillPageHeight} [class*="__compactMediaWrapper"] div:has(> [class*="VideoPlayer-module__"][class*="__player"]) {
  height: calc(100svh - 73px) !important;
  padding: 0 !important;
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
    CLASSES.fillPageHeight,
    state[SITE_ENABLED.key] && state[FILL_PAGE_HEIGHT.key]
  );

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

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
  applySettings();
});
