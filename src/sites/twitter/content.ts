import {
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  TWITTER_SETTINGS,
  type SettingsFor
} from "../../settings.js";
import { registerExtensionToggle } from "../../toggle-extension.js";
import {
  NARROW_SCROLLBAR_CLASS,
  WINDOW_SCROLLBAR_STYLES
} from "../window-scrollbar.js";
import { ENTRY_ATTRIBUTE, TIMELINE_ATTRIBUTE } from "./attributes.js";

type Settings = SettingsFor<typeof TWITTER_SETTINGS>;

const DEFAULT_SETTINGS = getDefaultSettings(TWITTER_SETTINGS);

const [
  SITE_ENABLED,
  FILL_WIDTH,
  HIDE_SIDEBAR,
  COMPACT_NAV,
  MEDIA_SIZE,
  OPEN_FOLLOWING,
  SORT_RECENT,
  HIDE_SPORTS_TABS,
  HIDE_COMPOSER,
  HIDE_ADS,
  HIDE_WHO_TO_FOLLOW,
  HIDE_DISCOVER_MORE,
  HIDE_EXPLORE_FOR_YOU,
  HIDE_SEARCH_PROMPTS,
  HIDE_WHATS_HAPPENING,
  HIDE_NEWS,
  HIDE_PREMIUM,
  HIDE_GROK,
  HIDE_CHAT_DRAWER,
  HIDE_NAV_EXTRAS,
  HIDE_VIEWS,
  NARROW_SCROLLBARS
] = TWITTER_SETTINGS;

registerExtensionToggle(SITE_ENABLED);

const STYLE_ID = "site-defluffer-twitter-style";

// Give up on a tab or menu Twitter hasn't rendered by then.
const WAIT_TIMEOUT_MS = 3000;

const CLASSES = {
  fillWidth: "site-defluffer-twitter-fill-width",
  hideSidebar: "site-defluffer-twitter-hide-sidebar",
  compactNav: "site-defluffer-twitter-compact-nav",
  fitMedia: "site-defluffer-twitter-fit-media",
  hideSportsTabs: "site-defluffer-twitter-hide-sports-tabs",
  hideComposer: "site-defluffer-twitter-hide-composer",
  hideAds: "site-defluffer-twitter-hide-ads",
  hideWhoToFollow: "site-defluffer-twitter-hide-who-to-follow",
  hideDiscoverMore: "site-defluffer-twitter-hide-discover-more",
  hideExploreForYou: "site-defluffer-twitter-hide-explore-for-you",
  hideSearchPrompts: "site-defluffer-twitter-hide-search-prompts",
  hideWhatsHappening: "site-defluffer-twitter-hide-whats-happening",
  hideNews: "site-defluffer-twitter-hide-news",
  hidePremium: "site-defluffer-twitter-hide-premium",
  hideGrok: "site-defluffer-twitter-hide-grok",
  hideChatDrawer: "site-defluffer-twitter-hide-chat-drawer",
  hideNavExtras: "site-defluffer-twitter-hide-nav-extras",
  hideViews: "site-defluffer-twitter-hide-views",
  homePage: "site-defluffer-twitter-home-page",
  explorePage: "site-defluffer-twitter-explore-page",
  postPage: "site-defluffer-twitter-post-page",
  pickingSort: "site-defluffer-twitter-picking-sort"
};

const CLASS_SETTINGS = [
  [CLASSES.fillWidth, FILL_WIDTH],
  [CLASSES.hideSidebar, HIDE_SIDEBAR],
  [CLASSES.compactNav, COMPACT_NAV],
  [CLASSES.hideSportsTabs, HIDE_SPORTS_TABS],
  [CLASSES.hideComposer, HIDE_COMPOSER],
  [CLASSES.hideAds, HIDE_ADS],
  [CLASSES.hideWhoToFollow, HIDE_WHO_TO_FOLLOW],
  [CLASSES.hideDiscoverMore, HIDE_DISCOVER_MORE],
  [CLASSES.hideExploreForYou, HIDE_EXPLORE_FOR_YOU],
  [CLASSES.hideSearchPrompts, HIDE_SEARCH_PROMPTS],
  [CLASSES.hideWhatsHappening, HIDE_WHATS_HAPPENING],
  [CLASSES.hideNews, HIDE_NEWS],
  [CLASSES.hidePremium, HIDE_PREMIUM],
  [CLASSES.hideGrok, HIDE_GROK],
  [CLASSES.hideChatDrawer, HIDE_CHAT_DRAWER],
  [CLASSES.hideNavExtras, HIDE_NAV_EXTRAS],
  [CLASSES.hideViews, HIDE_VIEWS],
  [NARROW_SCROLLBAR_CLASS, NARROW_SCROLLBARS]
] as const;

const PRIMARY_COLUMN = '[data-testid="primaryColumn"]';

const SIDEBAR = '[data-testid="sidebarColumn"]';

const SIDEBAR_SECTION = `${SIDEBAR} > div > div > div > div > div > div`;

const HOME_TABS = `${PRIMARY_COLUMN} [role="tablist"]`;

// Grok's logo is the only icon Twitter draws with this viewBox, which keeps
// the selector working in every language.
const GROK_ICON = 'svg[viewBox="0 0 33 32"]';

// The block under a post's text that holds its photos, video or card.
const MEDIA_BOX =
  '[data-testid="tweet"] div[aria-labelledby]:has(:is([data-testid="tweetPhoto"], [data-testid="videoPlayer"]))';

// Width over height of each media box, measured once so CSS can cap its width
// to keep the height within the window.
const MEDIA_RATIO_PROPERTY = "--site-defluffer-twitter-media-ratio";

// Share of the window height media can take for each size.
const MEDIA_SCALE_PROPERTY = "--site-defluffer-twitter-media-scale";

const MEDIA_SCALES = {
  window: "1",
  large: "0.75",
  medium: "0.5"
};

// Room left above and below fitted media for the post's name and actions.
const MEDIA_WINDOW_MARGIN = "160px";

const STYLES = `
${WINDOW_SCROLLBAR_STYLES}
html.${CLASSES.fillWidth} header[role="banner"] {
  flex-grow: 0 !important;
}

html.${CLASSES.fillWidth} main[role="main"] > div:has(${PRIMARY_COLUMN}),
html.${CLASSES.fillWidth} main[role="main"] > div:has(${PRIMARY_COLUMN}) > div {
  width: 100% !important;
  max-width: none !important;
}

html.${CLASSES.fillWidth} ${PRIMARY_COLUMN} {
  flex: 1 1 auto !important;
  width: auto !important;
  max-width: none !important;
}

html.${CLASSES.fillWidth} ${PRIMARY_COLUMN} > div > div:last-child,
html.${CLASSES.fillWidth} ${PRIMARY_COLUMN} > div > div:last-child div {
  max-width: none !important;
}

html.${CLASSES.hideSidebar} ${SIDEBAR} {
  display: none !important;
}

html.${CLASSES.compactNav} header[role="banner"] > div,
html.${CLASSES.compactNav} header[role="banner"] > div > div,
html.${CLASSES.compactNav} header[role="banner"] > div > div > div {
  width: 88px !important;
  min-width: 0 !important;
}

html.${CLASSES.compactNav} header[role="banner"] > div > div > div > div {
  width: 72px !important;
  align-items: center !important;
  padding: 0 !important;
}

html.${CLASSES.compactNav} header nav :is(a, [data-testid="AppTabBar_More_Menu"]) div[dir],
html.${CLASSES.compactNav} [data-testid="SideNav_AccountSwitcher_Button"] > div:not(:first-child) {
  display: none !important;
}

html.${CLASSES.compactNav} header nav :is(a, [data-testid="AppTabBar_More_Menu"]) > div {
  padding: 12px !important;
}

html.${CLASSES.fitMedia} ${MEDIA_BOX} {
  max-width: calc((100svh - ${MEDIA_WINDOW_MARGIN}) * var(${MEDIA_SCALE_PROPERTY}) * var(${MEDIA_RATIO_PROPERTY}, 100)) !important;
}

html.${CLASSES.hideSportsTabs} ${HOME_TABS} > [role="presentation"]:has(> [${TIMELINE_ATTRIBUTE}="Tag"]) {
  display: none !important;
}

html.${CLASSES.hideComposer}.${CLASSES.homePage} ${PRIMARY_COLUMN} > div > div:has([data-testid="tweetTextarea_0_label"]):not(:has(section)) {
  display: none !important;
}

html.${CLASSES.hideAds} [${ENTRY_ATTRIBUTE}="promoted-tweet"] {
  display: none !important;
}

html.${CLASSES.hideWhoToFollow} [${ENTRY_ATTRIBUTE}*="who-to-follow"],
html.${CLASSES.hideWhoToFollow}:not(.${CLASSES.postPage}) ${SIDEBAR_SECTION}:has(aside [data-testid="UserCell"]) {
  display: none !important;
}

html.${CLASSES.hideDiscoverMore} [${ENTRY_ATTRIBUTE}*="tweetdetailrelatedtweets"] {
  display: none !important;
}

html.${CLASSES.hideExploreForYou}.${CLASSES.explorePage} [${ENTRY_ATTRIBUTE}$="tweet"] {
  display: none !important;
}

html.${CLASSES.hideSearchPrompts} [${ENTRY_ATTRIBUTE}="relevanceprompt"] {
  display: none !important;
}

html.${CLASSES.hideWhatsHappening} ${SIDEBAR_SECTION}:has(section [data-testid="trend"]):not(:has(form[role="search"])) {
  display: none !important;
}

html.${CLASSES.hideNews} ${SIDEBAR_SECTION}:has([data-testid="news_sidebar"]) {
  display: none !important;
}

html.${CLASSES.hidePremium} ${SIDEBAR_SECTION}:has(aside a[href^="/i/premium"]),
html.${CLASSES.hidePremium} ${SIDEBAR_SECTION}:has([data-testid="super-upsell-UpsellCardRenderProperties"]),
html.${CLASSES.hidePremium} header nav a:is([href^="/i/premium"], [href^="/i/verified"]),
html.${CLASSES.hidePremium} [role="menu"] a:is([href^="/i/premium"], [href^="/i/verified"]),
html.${CLASSES.hidePremium} [data-testid="tweet"] [data-testid$="-subscribe"],
html.${CLASSES.hidePremium} [data-testid="verified_profile_upsell"],
html.${CLASSES.hidePremium} ${PRIMARY_COLUMN} div:has(> a[href^="/i/premium_sign_up"]),
html.${CLASSES.hidePremium} [data-testid="cellInnerDiv"]:has([data-testid="inlinePrompt"]) {
  display: none !important;
}

html.${CLASSES.hideGrok} header nav a[href="/i/grok"],
html.${CLASSES.hideGrok} [role="menu"] a[href="/i/grok"],
html.${CLASSES.hideGrok} [data-testid="GrokDrawer"],
html.${CLASSES.hideGrok} [data-testid="tweet"] button:has(${GROK_ICON}),
html.${CLASSES.hideGrok} [data-testid="tweet"] a[href="/i/grok"],
html.${CLASSES.hideGrok} button[data-testid="grokImgGen"] {
  display: none !important;
}

html.${CLASSES.hideChatDrawer} [data-testid="chat-drawer-root"] {
  visibility: hidden !important;
}

html.${CLASSES.hideNavExtras} header nav a:is([href="/i/calls"], [href^="/i/jf/creators"]),
html.${CLASSES.hideNavExtras} [role="menu"] a:is([href*="ads.x.com"], [href*="ads.twitter.com"]) {
  display: none !important;
}

html.${CLASSES.hideViews} [data-testid="tweet"] [role="group"] > div:has(> a[href$="/analytics"]) {
  display: none !important;
}

html.${CLASSES.pickingSort} [role="menu"] {
  opacity: 0 !important;
}
`;

const state: Settings = { ...DEFAULT_SETTINGS };

let observer: MutationObserver | null = null;

let updateQueued = false;

// Twitter drops back to For you on a fresh load, so only steer the first set
// of Home tabs: picking For you or Popular later should stick.
let homeTabsHandled = false;

async function waitFor<T>(find: () => T | null) {
  const deadline = performance.now() + WAIT_TIMEOUT_MS;

  for (;;) {
    const found = find();

    if (found !== null || performance.now() > deadline) {
      return found;
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

function getFollowingTab() {
  const tab = document.querySelector(
    `${HOME_TABS} [${TIMELINE_ATTRIBUTE}="home_latest"]`
  );

  return tab instanceof HTMLElement ? tab : null;
}

async function pickRecent(following: HTMLElement) {
  // The sort menu only opens from the Following tab once it's selected.
  const ready = await waitFor(() =>
    following.isConnected &&
    following.getAttribute("aria-selected") === "true" &&
    following.getAttribute("aria-haspopup") === "menu"
      ? following
      : null
  );

  if (!ready) {
    return;
  }

  document.documentElement.classList.add(CLASSES.pickingSort);

  try {
    following.click();

    // Popular is listed first and Recent second; the active one has a tick.
    const recent = await waitFor(() => {
      const item = document.querySelectorAll('[role="menu"] [role="menuitem"]')[1];

      return item instanceof HTMLElement ? item : null;
    });

    if (!recent) {
      return;
    }

    if (recent.querySelector("svg")) {
      recent.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      );
    } else {
      recent.click();
    }
  } finally {
    document.documentElement.classList.remove(CLASSES.pickingSort);
  }
}

function steerHomeTabs() {
  if (
    homeTabsHandled ||
    location.pathname !== "/home" ||
    !(state[OPEN_FOLLOWING.key] || state[SORT_RECENT.key])
  ) {
    return;
  }

  const following = getFollowingTab();

  if (!following) {
    return;
  }

  homeTabsHandled = true;

  if (state[OPEN_FOLLOWING.key] && following.getAttribute("aria-selected") !== "true") {
    following.click();
  }

  if (
    state[SORT_RECENT.key] &&
    (state[OPEN_FOLLOWING.key] || following.getAttribute("aria-selected") === "true")
  ) {
    void pickRecent(following);
  }
}

function applyPageClasses() {
  const root = document.documentElement;
  const enabled = state[SITE_ENABLED.key];

  root.classList.toggle(CLASSES.homePage, enabled && location.pathname === "/home");
  root.classList.toggle(
    CLASSES.explorePage,
    enabled && location.pathname.startsWith("/explore")
  );
  root.classList.toggle(
    CLASSES.postPage,
    enabled && location.pathname.includes("/status/")
  );
}

function measureMedia() {
  for (const box of document.querySelectorAll(MEDIA_BOX)) {
    if (!(box instanceof HTMLElement) || box.style.getPropertyValue(MEDIA_RATIO_PROPERTY)) {
      continue;
    }

    const { width, height } = box.getBoundingClientRect();

    if (width > 0 && height > 0) {
      box.style.setProperty(MEDIA_RATIO_PROPERTY, String(width / height));
    }
  }
}

function update() {
  updateQueued = false;
  applyPageClasses();

  if (!state[SITE_ENABLED.key]) {
    return;
  }

  steerHomeTabs();

  if (state[MEDIA_SIZE.key] !== "fill") {
    measureMedia();
  }
}

function scheduleUpdate() {
  if (updateQueued) {
    return;
  }

  updateQueued = true;
  requestAnimationFrame(update);
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

  const root = document.documentElement;
  const enabled = state[SITE_ENABLED.key];

  for (const [className, setting] of CLASS_SETTINGS) {
    root.classList.toggle(className, enabled && state[setting.key]);
  }

  const mediaSize = state[MEDIA_SIZE.key];

  root.classList.toggle(CLASSES.fitMedia, enabled && mediaSize !== "fill");

  if (mediaSize === "fill") {
    root.style.removeProperty(MEDIA_SCALE_PROPERTY);
  } else {
    root.style.setProperty(MEDIA_SCALE_PROPERTY, MEDIA_SCALES[mediaSize]);
  }

  applyPageClasses();

  if (enabled && !observer) {
    observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [TIMELINE_ATTRIBUTE],
      childList: true,
      subtree: true
    });
    scheduleUpdate();
  } else if (!enabled) {
    observer?.disconnect();
    observer = null;
  }
}

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  Object.assign(state, decodeSettings(TWITTER_SETTINGS, result));
  applySettings();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextState = applyStorageChanges(TWITTER_SETTINGS, state, changes);

  if (!nextState) {
    return;
  }

  Object.assign(state, nextState);
  applySettings();
});
