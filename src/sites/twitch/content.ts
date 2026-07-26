const STORAGE_KEYS = {
  // Keep legacy keys so existing installations retain their settings.
  hidePanels: "twitchMinifierEnabled",
  compactInputRow: "twitchMinifierCompactInputRow"
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
type Settings = Record<StorageKey, boolean>;

interface XPathClassTarget {
  xpath: string;
  className: string;
}

interface CompactTargets {
  root: HTMLElement;
  row: HTMLElement;
  inputContainer: HTMLElement;
  buttons: HTMLElement;
}

const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.hidePanels]: true,
  [STORAGE_KEYS.compactInputRow]: false
};

const TARGET_XPATHS = [
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/div",
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[1]"
];

const COMPACT_CONTAINER_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]";
const COMPACT_OPTIONAL_BUTTON_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[1]/div[2]/div/div/div[3]/div/div[1]/div/button";
const COMPACT_SPACER_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]/div[1]/div/div/div/div[2]";
const COMPACT_BITS_INDICATOR_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]/div[1]/div/div/div/div[1]/div[2]/button/div/div/div/div[1]";
const COMPACT_POINTS_BUTTON_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]/div[1]/div/div/div/div[1]/div[2]/button";
const COMPACT_POINTS_ICON_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]/div[1]/div/div/div/div[1]/div[2]/button/div/div/div/div[3]/div[1]/div/div";
const COMPACT_POINTS_OPEN_SELECTOR =
  '[data-test-selector="community-points-summary"] button[aria-expanded="true"]';
const COMPACT_POINTS_POPUP_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]/div[1]/div/div/div[2]";
const COMPACT_POINTS_EXTRA_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]/div[1]/div/div/div/div[1]/div[2]/button/div/div/div/div[3]/div[2]";
const COMPACT_ADDITIONAL_HIDE_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]/div[2]/div[1]";
const COMPACT_BUTTONS_OUTER_WRAPPER_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]";
const COMPACT_ALIGN_CENTER_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[3]/section/div/div[6]/div[2]/div[2]";

const STYLE_ID = "site-defluffer-twitch-style";
const LEGACY_STYLE_IDS = [
  "twitch-minifier-style",
  "twitch-minifier-compact-style"
];
const NULL_STYLE_VALUE = "__NULL__";

const CLASSES = {
  hideEnabled: "tm-hide-enabled",
  compactEnabled: "tm-compact-enabled",
  hideTarget: "tm-hide-target",
  compactRoot: "tm-compact-root",
  compactRow: "tm-compact-row",
  compactInput: "tm-compact-input",
  compactButtons: "tm-compact-buttons",
  compactHide: "tm-compact-hide",
  compactOuterWrapper: "tm-compact-outer-wrapper",
  compactAlignCenter: "tm-compact-align-center",
  pointsButton: "tm-points-button",
  pointsKeep: "tm-points-keep",
  pointsIcon: "tm-points-icon"
};

const COMPACT_XPATH_CLASS_MAP: XPathClassTarget[] = [
  { xpath: COMPACT_OPTIONAL_BUTTON_XPATH, className: CLASSES.compactHide },
  { xpath: COMPACT_SPACER_XPATH, className: CLASSES.compactHide },
  { xpath: COMPACT_BITS_INDICATOR_XPATH, className: CLASSES.compactHide },
  { xpath: COMPACT_POINTS_EXTRA_XPATH, className: CLASSES.compactHide },
  { xpath: COMPACT_ADDITIONAL_HIDE_XPATH, className: CLASSES.compactHide },
  {
    xpath: COMPACT_BUTTONS_OUTER_WRAPPER_XPATH,
    className: CLASSES.compactOuterWrapper
  },
  { xpath: COMPACT_ALIGN_CENTER_XPATH, className: CLASSES.compactAlignCenter }
];

const LEGACY_ATTRIBUTES = [
  "data-twitch-minifier-original-style",
  "data-twitch-minifier-hidden",
  "data-twitch-minifier-compact-root",
  "data-twitch-minifier-compact-row",
  "data-twitch-minifier-compact-input",
  "data-twitch-minifier-compact-buttons",
  "data-twitch-minifier-compact-inline-style",
  "data-twitch-minifier-compact-inline-style-original"
];

const STYLES = `
html.${CLASSES.hideEnabled} .${CLASSES.hideTarget} {
  display: none !important;
}

html.${CLASSES.hideEnabled} .video-chat__header {
  display: none !important;
}

html.${CLASSES.hideEnabled} .chat-room__content > button[aria-label="Charity details"] {
  display: none !important;
}

html.${CLASSES.hideEnabled} [data-test-selector="community-points-summary"] [data-test-selector="bits-balance-string"],
html.${CLASSES.hideEnabled} [data-test-selector="community-points-summary"] :has(+ [data-test-selector="bits-balance-string"]) {
  display: none !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactRoot} {
  padding-top: 8px !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactRow} {
  display: flex !important;
  align-items: flex-end !important;
  gap: 4px !important;
  width: 100% !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactInput} {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  width: auto !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactInput} > * {
  width: 100% !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactInput} .chat-input__textarea,
html.${CLASSES.compactEnabled} .${CLASSES.compactInput} .chat-wysiwyg-input-box,
html.${CLASSES.compactEnabled} .${CLASSES.compactInput} .chat-wysiwyg-input-box > div:first-child {
  min-width: 0 !important;
  width: 100% !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} {
  display: flex !important;
  flex: 0 0 auto !important;
  align-self: center !important;
  justify-content: flex-start !important;
  width: auto !important;
  max-width: 112px !important;
  margin: 0 !important;
  overflow: visible !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} > div {
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 0 !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} > div > div {
  display: flex !important;
  align-items: center !important;
  gap: 2px !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} div:has(> p:empty):has(+ div [aria-label="Chat settings"]) {
  display: none !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [data-test-selector="community-points-summary"] {
  margin-right: 4px !important;
  max-width: 28px !important;
  min-width: 28px !important;
  height: 28px !important;
  overflow: visible !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [data-test-selector="community-points-summary"] > div,
html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [data-test-selector="community-points-summary"] button {
  max-width: 28px !important;
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
  border-radius: 6px !important;
  overflow: visible !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [data-test-selector="community-points-summary"]:has([aria-label="Claim Bonus"]) {
  width: 60px !important;
  min-width: 60px !important;
  max-width: 60px !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [data-test-selector="community-points-summary"]:has([aria-label="Claim Bonus"]) > div {
  width: 28px !important;
  min-width: 28px !important;
  max-width: 28px !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [data-test-selector="bits-balance-string"],
html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [data-test-selector="copo-balance-string"],
html.${CLASSES.compactEnabled} .${CLASSES.compactHide} {
  display: none !important;
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  flex: 0 0 0 !important;
  overflow: hidden !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} :has(> [data-test-selector="copo-balance-string"]) > :first-child {
  padding-right: 0 !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [aria-label="Chat settings"],
html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [aria-label="Emote picker"] {
  width: 28px !important;
  min-width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [aria-label="Chat settings"] {
  margin-left: 0 !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [aria-label="Chat settings"] .tw-svg {
  justify-content: center !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [aria-label="Chat settings"] svg,
html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [aria-label="Emote picker"] svg {
  width: 18px !important;
  height: 18px !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} [aria-label="Send Chat"] {
  display: none !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactOuterWrapper} {
  margin: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 0 !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactAlignCenter} {
  align-self: center !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.pointsButton} {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 28px !important;
  min-width: 28px !important;
  max-width: 28px !important;
  height: 28px !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.pointsButton} * {
  display: none !important;
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.pointsButton} .${CLASSES.pointsKeep} {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  height: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  gap: 0 !important;
  overflow: visible !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.pointsIcon},
html.${CLASSES.compactEnabled} .${CLASSES.pointsIcon} svg,
html.${CLASSES.compactEnabled} .${CLASSES.pointsIcon} path {
  display: block !important;
  width: 18px !important;
  min-width: 18px !important;
  max-width: 18px !important;
  height: 18px !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.pointsButton} .${CLASSES.compactHide},
html.${CLASSES.compactEnabled} .${CLASSES.pointsButton} .${CLASSES.compactHide} * {
  display: none !important;
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.reward-center__content__with-bits-rewards {
  height: min(90svh, 37rem) !important;
  max-height: min(90svh, 37rem) !important;
  overflow-y: auto !important;
}

[role="dialog"]:has(.reward-center__content) {
  right: 0 !important;
  left: auto !important;
}
`;

const state: Settings = { ...DEFAULT_SETTINGS };

let observer: MutationObserver | null = null;
let observerRoot: Node | null = null;
let applyQueued = false;

function getNodeByXPath(xpath: string): Node | null {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function ensureStyle() {
  let style = document.getElementById(STYLE_ID);

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLES;
    document.documentElement.appendChild(style);
  }
}

function restoreLegacyStyle(element: Element, attributeName: string) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const originalStyle = element.getAttribute(attributeName);

  if (originalStyle === NULL_STYLE_VALUE) {
    element.removeAttribute("style");
  } else if (originalStyle !== null) {
    element.setAttribute("style", originalStyle);
  }
}

function cleanupLegacyArtifacts() {
  for (const styleId of LEGACY_STYLE_IDS) {
    document.getElementById(styleId)?.remove();
  }

  const selector = LEGACY_ATTRIBUTES.map((attribute) => `[${attribute}]`).join(", ");
  const elements = new Set(document.querySelectorAll(selector));

  for (const element of elements) {
    restoreLegacyStyle(element, "data-twitch-minifier-compact-inline-style-original");
    restoreLegacyStyle(element, "data-twitch-minifier-original-style");

    for (const attribute of LEGACY_ATTRIBUTES) {
      element.removeAttribute(attribute);
    }
  }
}

function addClass(node: Node | null, className: string) {
  if (node instanceof HTMLElement) {
    node.classList.add(className);
  }
}

function markXPathTargets(targets: XPathClassTarget[]) {
  for (const { xpath, className } of targets) {
    addClass(getNodeByXPath(xpath), className);
  }
}

function isVodChatReplay(node: Node | null): boolean {
  if (!(node instanceof HTMLElement)) {
    return false;
  }

  return (
    node.closest(".video-chat") !== null ||
    node.querySelector(".video-chat") !== null
  );
}

function markHideTargets() {
  for (const xpath of TARGET_XPATHS) {
    const node = getNodeByXPath(xpath);

    if (isVodChatReplay(node)) {
      continue;
    }

    addClass(node, CLASSES.hideTarget);
  }
}

function getCompactTargets(root: Node | null): CompactTargets | null {
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  const row = Array.from(root.children)
    .reverse()
    .find(
      (child) =>
        child instanceof HTMLElement &&
        child.querySelector('[data-test-selector="chat-input-buttons-container"]')
    );

  if (!(row instanceof HTMLElement)) {
    return null;
  }

  const buttons = row.querySelector(
    '[data-test-selector="chat-input-buttons-container"]'
  );

  if (!(buttons instanceof HTMLElement)) {
    return null;
  }

  const inputContainer = Array.from(row.children).find((child) => child !== buttons);

  if (!(inputContainer instanceof HTMLElement)) {
    return null;
  }

  return { root, row, inputContainer, buttons };
}

function getCompactRoots(): HTMLElement[] {
  const roots = new Set<HTMLElement>();
  const xpathRoot = getNodeByXPath(COMPACT_CONTAINER_XPATH);

  if (xpathRoot instanceof HTMLElement) {
    roots.add(xpathRoot);
  }

  for (const element of document.querySelectorAll(
    '[data-test-selector="chat-input-buttons-container"]'
  )) {
    const root = element.closest(".chat-input");
    if (root instanceof HTMLElement) {
      roots.add(root);
    }
  }

  return Array.from(roots);
}

function markCompactPointsButton(button: Node | null, icon: Node | null) {
  if (!(button instanceof HTMLElement) || !(icon instanceof HTMLElement)) {
    return;
  }

  button.classList.add(CLASSES.pointsButton);
  icon.classList.add(CLASSES.pointsIcon);

  let current: HTMLElement | null = icon;
  while (current instanceof HTMLElement && current !== button) {
    current.classList.add(CLASSES.pointsKeep);
    current = current.parentElement;
  }
}

function markCompactTargets() {
  for (const root of getCompactRoots()) {
    const targets = getCompactTargets(root);

    if (!targets) {
      continue;
    }

    targets.root.classList.add(CLASSES.compactRoot);
    targets.row.classList.add(CLASSES.compactRow);
    targets.inputContainer.classList.add(CLASSES.compactInput);
    targets.buttons.classList.add(CLASSES.compactButtons);
  }

  markXPathTargets(COMPACT_XPATH_CLASS_MAP);

  markCompactPointsButton(
    getNodeByXPath(COMPACT_POINTS_BUTTON_XPATH),
    getNodeByXPath(COMPACT_POINTS_ICON_XPATH)
  );
}

function isPointsPopupOpen() {
  return (
    document.querySelector(COMPACT_POINTS_OPEN_SELECTOR) instanceof HTMLElement ||
    getNodeByXPath(COMPACT_POINTS_POPUP_XPATH) instanceof HTMLElement
  );
}

function applyRootClasses() {
  const root = document.documentElement;
  root.classList.toggle(CLASSES.hideEnabled, state[STORAGE_KEYS.hidePanels]);
  root.classList.toggle(
    CLASSES.compactEnabled,
    state[STORAGE_KEYS.compactInputRow] && !isPointsPopupOpen()
  );
}

function applyFeatures() {
  stopObserver();
  cleanupLegacyArtifacts();
  ensureStyle();
  markHideTargets();

  if (state[STORAGE_KEYS.compactInputRow]) {
    markCompactTargets();
  }

  applyRootClasses();
  updateObserver();
}

function getObserverRoot(): Node {
  return (
    document.querySelector('[data-a-target="right-column-chat-bar"]') ||
    document.body ||
    document.documentElement
  );
}

function scheduleApply() {
  if (applyQueued) {
    return;
  }

  applyQueued = true;
  requestAnimationFrame(() => {
    applyQueued = false;
    applyFeatures();
  });
}

function shouldObserve() {
  return state[STORAGE_KEYS.hidePanels] || state[STORAGE_KEYS.compactInputRow];
}

function stopObserver() {
  if (!observer) {
    return;
  }

  observer.disconnect();
  observer = null;
  observerRoot = null;
}

function startObserver() {
  const nextRoot = getObserverRoot();

  if (observer && observerRoot === nextRoot) {
    return;
  }

  stopObserver();
  observerRoot = nextRoot;
  observer = new MutationObserver(() => {
    scheduleApply();
  });

  observer.observe(observerRoot, {
    attributes: true,
    attributeFilter: ["aria-expanded"],
    childList: true,
    subtree: true
  });
}

function updateObserver() {
  if (shouldObserve()) {
    startObserver();
  } else {
    stopObserver();
  }
}

function normalizeSettings(settings: Record<string, unknown>): Settings {
  return {
    [STORAGE_KEYS.hidePanels]: Boolean(settings[STORAGE_KEYS.hidePanels]),
    [STORAGE_KEYS.compactInputRow]: Boolean(
      settings[STORAGE_KEYS.compactInputRow]
    )
  };
}

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  Object.assign(state, normalizeSettings(result));
  applyFeatures();
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

  if (!didChange) {
    return;
  }

  applyFeatures();
});
