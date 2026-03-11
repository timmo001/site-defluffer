const STORAGE_KEYS = {
  hidePanels: "twitchMinifierEnabled",
  compactInputRow: "twitchMinifierCompactInputRow"
};

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
const COMPACT_BUTTONS_OUTER_WRAPPER_XPATH =
  "/html/body/div/div[1]/div[1]/div/div[2]/div/div[2]/aside/div/div/div[2]/div/div[2]/section/div/div[6]/div[2]/div[2]";

const ORIGINAL_STYLE_ATTR = "data-twitch-minifier-original-style";
const HIDDEN_ATTR = "data-twitch-minifier-hidden";
const NULL_STYLE_VALUE = "__NULL__";

const COMPACT_STYLE_ID = "twitch-minifier-compact-style";
const COMPACT_ROOT_ATTR = "data-twitch-minifier-compact-root";
const COMPACT_ROW_ATTR = "data-twitch-minifier-compact-row";
const COMPACT_INPUT_ATTR = "data-twitch-minifier-compact-input";
const COMPACT_BUTTONS_ATTR = "data-twitch-minifier-compact-buttons";
const COMPACT_INLINE_STYLE_ATTR = "data-twitch-minifier-compact-inline-style";
const COMPACT_INLINE_STYLE_ORIGINAL_ATTR =
  "data-twitch-minifier-compact-inline-style-original";

const COMPACT_CHAT_CSS = `
[${COMPACT_ROOT_ATTR}="true"] {
  padding-top: 8px !important;
}

[${COMPACT_ROW_ATTR}="true"] {
  display: flex !important;
  align-items: flex-end !important;
  gap: 8px !important;
  width: 100% !important;
}

[${COMPACT_INPUT_ATTR}="true"] {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  width: auto !important;
}

[${COMPACT_INPUT_ATTR}="true"] > * {
  width: 100% !important;
}

[${COMPACT_INPUT_ATTR}="true"] .chat-input__textarea,
[${COMPACT_INPUT_ATTR}="true"] .chat-wysiwyg-input-box,
[${COMPACT_INPUT_ATTR}="true"] .chat-wysiwyg-input-box > div:first-child {
  min-width: 0 !important;
  width: 100% !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] {
  flex: 0 0 auto !important;
  align-self: flex-end !important;
  justify-content: flex-start !important;
  width: auto !important;
  max-width: 112px !important;
  overflow: hidden !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] > div {
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 2px !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] > div > div {
  display: flex !important;
  align-items: center !important;
  gap: 2px !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [data-test-selector="community-points-summary"] {
  margin-right: 2px !important;
  max-width: 28px !important;
  min-width: 28px !important;
  height: 28px !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [data-test-selector="community-points-summary"] > div,
[${COMPACT_BUTTONS_ATTR}="true"] [data-test-selector="community-points-summary"] button {
  max-width: 28px !important;
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
  border-radius: 6px !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [data-test-selector="bits-balance-string"],
[${COMPACT_BUTTONS_ATTR}="true"] [data-test-selector="copo-balance-string"] {
  display: none !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [aria-label="Chat settings"],
[${COMPACT_BUTTONS_ATTR}="true"] [aria-label="Emote picker"] {
  width: 28px !important;
  min-width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [aria-label="Chat settings"] {
  margin-left: 0 !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [aria-label="Chat settings"] svg,
[${COMPACT_BUTTONS_ATTR}="true"] [aria-label="Emote picker"] svg {
  width: 18px !important;
  height: 18px !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [aria-label="Send Chat"] {
  display: none !important;
}
`;

const state = { ...DEFAULT_SETTINGS };

let observer = null;
let applyQueued = false;

function getNodeByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function hideElement(element) {
  if (!(element instanceof HTMLElement) || element.hasAttribute(HIDDEN_ATTR)) {
    return;
  }

  const currentStyle = element.getAttribute("style");
  element.setAttribute(
    ORIGINAL_STYLE_ATTR,
    currentStyle === null ? NULL_STYLE_VALUE : currentStyle
  );
  element.style.setProperty("display", "none", "important");
  element.setAttribute(HIDDEN_ATTR, "true");
}

function restoreElement(element) {
  if (!(element instanceof HTMLElement) || !element.hasAttribute(HIDDEN_ATTR)) {
    return;
  }

  const originalStyle = element.getAttribute(ORIGINAL_STYLE_ATTR);

  if (originalStyle === NULL_STYLE_VALUE) {
    element.removeAttribute("style");
  } else if (originalStyle !== null) {
    element.setAttribute("style", originalStyle);
  }

  element.removeAttribute(ORIGINAL_STYLE_ATTR);
  element.removeAttribute(HIDDEN_ATTR);
}

function applyVisibility() {
  for (const xpath of TARGET_XPATHS) {
    const element = getNodeByXPath(xpath);
    if (!element) {
      continue;
    }

    if (state[STORAGE_KEYS.hidePanels]) {
      hideElement(element);
    } else {
      restoreElement(element);
    }
  }
}

function getCompactStyleElement() {
  return document.getElementById(COMPACT_STYLE_ID);
}

function ensureCompactStyle() {
  let style = getCompactStyleElement();

  if (!style) {
    style = document.createElement("style");
    style.id = COMPACT_STYLE_ID;
    style.textContent = COMPACT_CHAT_CSS;
    document.documentElement.appendChild(style);
  }
}

function removeCompactStyle() {
  getCompactStyleElement()?.remove();
}

function clearCompactMarkers() {
  const selector = [
    `[${COMPACT_ROOT_ATTR}]`,
    `[${COMPACT_ROW_ATTR}]`,
    `[${COMPACT_INPUT_ATTR}]`,
    `[${COMPACT_BUTTONS_ATTR}]`
  ].join(", ");

  for (const element of document.querySelectorAll(selector)) {
    element.removeAttribute(COMPACT_ROOT_ATTR);
    element.removeAttribute(COMPACT_ROW_ATTR);
    element.removeAttribute(COMPACT_INPUT_ATTR);
    element.removeAttribute(COMPACT_BUTTONS_ATTR);
  }
}

function applyCompactInlineStyles(element, styles) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  if (!element.hasAttribute(COMPACT_INLINE_STYLE_ATTR)) {
    const currentStyle = element.getAttribute("style");
    element.setAttribute(
      COMPACT_INLINE_STYLE_ORIGINAL_ATTR,
      currentStyle === null ? NULL_STYLE_VALUE : currentStyle
    );
  }

  for (const [property, value] of styles) {
    element.style.setProperty(property, value, "important");
  }

  element.setAttribute(COMPACT_INLINE_STYLE_ATTR, "true");
}

function restoreCompactInlineStyles() {
  for (const element of document.querySelectorAll(
    `[${COMPACT_INLINE_STYLE_ATTR}="true"]`
  )) {
    if (!(element instanceof HTMLElement)) {
      continue;
    }

    const originalStyle = element.getAttribute(COMPACT_INLINE_STYLE_ORIGINAL_ATTR);

    if (originalStyle === NULL_STYLE_VALUE) {
      element.removeAttribute("style");
    } else if (originalStyle !== null) {
      element.setAttribute("style", originalStyle);
    }

    element.removeAttribute(COMPACT_INLINE_STYLE_ATTR);
    element.removeAttribute(COMPACT_INLINE_STYLE_ORIGINAL_ATTR);
  }
}

function applyCompactButtonIconOnly(button, icon) {
  if (!(button instanceof HTMLElement) || !(icon instanceof HTMLElement)) {
    return;
  }

  for (const element of button.querySelectorAll("*")) {
    if (element === icon || element.contains(icon) || icon.contains(element)) {
      continue;
    }

    applyCompactInlineStyles(element, [
      ["display", "none"],
      ["width", "0"],
      ["min-width", "0"],
      ["max-width", "0"],
      ["height", "0"],
      ["margin", "0"],
      ["padding", "0"],
      ["overflow", "hidden"]
    ]);
  }

  let current = icon;
  while (current instanceof HTMLElement) {
    if (current === button) {
      applyCompactInlineStyles(current, [
        ["display", "flex"],
        ["align-items", "center"],
        ["justify-content", "center"],
        ["width", "28px"],
        ["min-width", "28px"],
        ["max-width", "28px"],
        ["height", "28px"],
        ["padding", "0"],
        ["margin", "0"],
        ["overflow", "hidden"]
      ]);
      break;
    }

    applyCompactInlineStyles(current, [
      ["display", "flex"],
      ["align-items", "center"],
      ["justify-content", "center"],
      ["margin", "0"],
      ["padding", "0"],
      ["min-width", "0"],
      ["gap", "0"]
    ]);

    current = current.parentElement;
  }

  applyCompactInlineStyles(icon, [
    ["display", "flex"],
    ["align-items", "center"],
    ["justify-content", "center"],
    ["width", "18px"],
    ["min-width", "18px"],
    ["max-width", "18px"],
    ["height", "18px"],
    ["margin", "0"],
    ["padding", "0"]
  ]);
}

function getCompactTargets(root) {
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

function getCompactRoots() {
  const roots = new Set();
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

function applyCompactInputRow() {
  restoreCompactInlineStyles();
  clearCompactMarkers();

  if (!state[STORAGE_KEYS.compactInputRow]) {
    removeCompactStyle();
    return;
  }

  ensureCompactStyle();

  for (const root of getCompactRoots()) {
    const targets = getCompactTargets(root);

    if (!targets) {
      continue;
    }

    targets.root.setAttribute(COMPACT_ROOT_ATTR, "true");
    targets.row.setAttribute(COMPACT_ROW_ATTR, "true");
    targets.inputContainer.setAttribute(COMPACT_INPUT_ATTR, "true");
    targets.buttons.setAttribute(COMPACT_BUTTONS_ATTR, "true");
  }

  applyCompactInlineStyles(getNodeByXPath(COMPACT_OPTIONAL_BUTTON_XPATH), [
    ["display", "none"]
  ]);

  applyCompactInlineStyles(getNodeByXPath(COMPACT_SPACER_XPATH), [
    ["display", "none"],
    ["width", "0"],
    ["min-width", "0"],
    ["max-width", "0"],
    ["margin", "0"],
    ["padding", "0"],
    ["flex", "0 0 0"],
    ["overflow", "hidden"]
  ]);

  applyCompactInlineStyles(getNodeByXPath(COMPACT_BITS_INDICATOR_XPATH), [
    ["display", "none"],
    ["width", "0"],
    ["min-width", "0"],
    ["max-width", "0"],
    ["margin", "0"],
    ["padding", "0"],
    ["overflow", "hidden"]
  ]);

  applyCompactButtonIconOnly(
    getNodeByXPath(COMPACT_POINTS_BUTTON_XPATH),
    getNodeByXPath(COMPACT_POINTS_ICON_XPATH)
  );

  applyCompactInlineStyles(getNodeByXPath(COMPACT_BUTTONS_OUTER_WRAPPER_XPATH), [
    ["margin", "0"],
    ["margin-left", "0"],
    ["margin-right", "0"],
    ["padding", "0"]
  ]);
}

function applyFeatures() {
  applyVisibility();
  applyCompactInputRow();
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

function startObserver() {
  if (observer) {
    return;
  }

  observer = new MutationObserver(() => {
    scheduleApply();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

function stopObserver() {
  if (!observer) {
    return;
  }

  observer.disconnect();
  observer = null;
}

function updateObserver() {
  if (shouldObserve()) {
    startObserver();
  } else {
    stopObserver();
  }
}

function normalizeSettings(settings) {
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
  updateObserver();
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
  updateObserver();
});
