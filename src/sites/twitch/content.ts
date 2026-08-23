import {
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  TWITCH_SETTINGS,
  type SettingsFor
} from "../../settings.js";
import { registerExtensionToggle } from "../../toggle-extension.js";
import {
  NARROW_SCROLLBAR_CLASS,
  WINDOW_SCROLLBAR_STYLES
} from "../window-scrollbar.js";

type Settings = SettingsFor<typeof TWITCH_SETTINGS>;

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

const DEFAULT_SETTINGS = getDefaultSettings(TWITCH_SETTINGS);
const [SITE_ENABLED, HIDE_PANELS, COMPACT_INPUT_ROW, NARROW_SCROLLBARS] =
  TWITCH_SETTINGS;

registerExtensionToggle(SITE_ENABLED);

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
${WINDOW_SCROLLBAR_STYLES}
html.${NARROW_SCROLLBAR_CLASS} .chat-room .scrollable-area {
  scrollbar-color: #444 transparent !important;
  scrollbar-width: thin !important;
}

html.${NARROW_SCROLLBAR_CLASS} .chat-room .scrollable-area::-webkit-scrollbar {
  width: 8px !important;
}

html.${NARROW_SCROLLBAR_CLASS} .chat-room .scrollable-area::-webkit-scrollbar-thumb {
  background: #444 !important;
  border-radius: 4px !important;
}

html.${CLASSES.hideEnabled} .${CLASSES.hideTarget} {
  display: none !important;
}

html.${CLASSES.hideEnabled} .video-chat__header,
html.${CLASSES.hideEnabled} [data-test-selector="channel-skins-shared-above-chat-v3"] {
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

html.${CLASSES.compactEnabled} .chat-scrollable-area__message-container {
  padding-bottom: 0.5rem !important;
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

html.${CLASSES.compactEnabled} .${CLASSES.compactInput} .chat-wysiwyg-input__editor,
html.${CLASSES.compactEnabled} .${CLASSES.compactInput} .chat-wysiwyg-input__placeholder {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

html.${CLASSES.compactEnabled} .${CLASSES.compactButtons} {
  display: flex !important;
  flex-wrap: nowrap !important;
  flex: 0 0 auto !important;
  align-self: center !important;
  justify-content: flex-start !important;
  width: auto !important;
  max-width: none !important;
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

html.${CLASSES.compactEnabled} .reward-center__content__with-bits-rewards {
  height: min(90svh, 37rem) !important;
  max-height: min(90svh, 37rem) !important;
  overflow-y: auto !important;
}

html.${CLASSES.compactEnabled} [role="dialog"]:has(.reward-center__content) {
  right: 0 !important;
  left: auto !important;
}
`;

const state: Settings = { ...DEFAULT_SETTINGS };

let observer: MutationObserver | null = null;
let observerRoot: Node | null = null;
let applyQueued = false;

function getElementByXPath(xpath: string): HTMLElement | null {
  const node = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  return node instanceof HTMLElement ? node : null;
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

function addClass(element: HTMLElement | null, className: string) {
  element?.classList.add(className);
}

function markXPathTargets(targets: XPathClassTarget[]) {
  for (const { xpath, className } of targets) {
    addClass(getElementByXPath(xpath), className);
  }
}

function isVodChatReplay(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  return (
    element.closest(".video-chat") !== null ||
    element.querySelector(".video-chat") !== null
  );
}

function markHideTargets() {
  for (const xpath of TARGET_XPATHS) {
    const node = getElementByXPath(xpath);

    if (isVodChatReplay(node)) {
      continue;
    }

    addClass(node, CLASSES.hideTarget);
  }
}

function getCompactTargets(root: HTMLElement | null): CompactTargets | null {
  if (!root) {
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
  const xpathRoot = getElementByXPath(COMPACT_CONTAINER_XPATH);

  if (xpathRoot) {
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

function markCompactPointsButton(
  button: HTMLElement | null,
  icon: HTMLElement | null
) {
  if (!button || !icon) {
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
    getElementByXPath(COMPACT_POINTS_BUTTON_XPATH),
    getElementByXPath(COMPACT_POINTS_ICON_XPATH)
  );
}

function isPointsPopupOpen() {
  return (
    document.querySelector(COMPACT_POINTS_OPEN_SELECTOR) instanceof HTMLElement ||
    getElementByXPath(COMPACT_POINTS_POPUP_XPATH) !== null
  );
}

function applyRootClasses() {
  const root = document.documentElement;
  const hasMainPlayer =
    document.querySelector('[data-a-target="video-player"] video') !== null &&
    document.querySelector(".chat-room, .video-chat") !== null;
  root.classList.toggle(
    CLASSES.hideEnabled,
    hasMainPlayer &&
      state[SITE_ENABLED.key] &&
      state[HIDE_PANELS.key]
  );
  root.classList.toggle(
    CLASSES.compactEnabled,
    hasMainPlayer &&
      state[SITE_ENABLED.key] &&
      state[COMPACT_INPUT_ROW.key] &&
      !isPointsPopupOpen()
  );
  root.classList.toggle(
    NARROW_SCROLLBAR_CLASS,
    state[SITE_ENABLED.key] && state[NARROW_SCROLLBARS.key]
  );
}

function reconcileDom() {
  markHideTargets();

  if (state[SITE_ENABLED.key] && state[COMPACT_INPUT_ROW.key]) {
    markCompactTargets();
  }

  applyRootClasses();
}

function getObserverRoot(): Node {
  return document.body || document.documentElement;
}

function scheduleApply() {
  if (applyQueued) {
    return;
  }

  applyQueued = true;
  requestAnimationFrame(() => {
    applyQueued = false;
    reconcileDom();
    updateObserver();
  });
}

function shouldObserve() {
  return (
    state[SITE_ENABLED.key] &&
    (state[HIDE_PANELS.key] || state[COMPACT_INPUT_ROW.key])
  );
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

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  Object.assign(state, decodeSettings(TWITCH_SETTINGS, result));
  cleanupLegacyArtifacts();
  ensureStyle();
  reconcileDom();
  updateObserver();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextState = applyStorageChanges(TWITCH_SETTINGS, state, changes);

  if (!nextState) {
    return;
  }

  Object.assign(state, nextState);
  reconcileDom();
  updateObserver();
});
