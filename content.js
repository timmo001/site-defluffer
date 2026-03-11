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

const ORIGINAL_STYLE_ATTR = "data-twitch-minifier-original-style";
const HIDDEN_ATTR = "data-twitch-minifier-hidden";
const NULL_STYLE_VALUE = "__NULL__";

const COMPACT_STYLE_ID = "twitch-minifier-compact-style";
const COMPACT_ROW_ATTR = "data-twitch-minifier-compact-row";
const COMPACT_INPUT_ATTR = "data-twitch-minifier-compact-input";
const COMPACT_BUTTONS_ATTR = "data-twitch-minifier-compact-buttons";

const COMPACT_CHAT_CSS = `
[${COMPACT_ROW_ATTR}="true"] {
  display: flex !important;
  align-items: flex-end !important;
  gap: 8px !important;
}

[${COMPACT_INPUT_ATTR}="true"] {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  width: auto !important;
}

[${COMPACT_INPUT_ATTR}="true"] .chat-input__textarea,
[${COMPACT_INPUT_ATTR}="true"] .chat-wysiwyg-input-box {
  min-width: 0 !important;
  width: auto !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] {
  flex: 0 0 auto !important;
  align-self: flex-end !important;
  justify-content: flex-start !important;
  width: auto !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] > div {
  flex-wrap: nowrap !important;
}

[${COMPACT_BUTTONS_ATTR}="true"] [data-test-selector="community-points-summary"] {
  margin-right: 8px !important;
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
    `[${COMPACT_ROW_ATTR}]`,
    `[${COMPACT_INPUT_ATTR}]`,
    `[${COMPACT_BUTTONS_ATTR}]`
  ].join(", ");

  for (const element of document.querySelectorAll(selector)) {
    element.removeAttribute(COMPACT_ROW_ATTR);
    element.removeAttribute(COMPACT_INPUT_ATTR);
    element.removeAttribute(COMPACT_BUTTONS_ATTR);
  }
}

function applyCompactInputRow() {
  clearCompactMarkers();

  if (!state[STORAGE_KEYS.compactInputRow]) {
    removeCompactStyle();
    return;
  }

  ensureCompactStyle();

  for (const element of document.querySelectorAll(
    '[data-test-selector="chat-input-buttons-container"]'
  )) {
    if (!(element instanceof HTMLElement)) {
      continue;
    }

    const row = element.parentElement;
    if (!(row instanceof HTMLElement)) {
      continue;
    }

    const inputContainer = Array.from(row.children).find(
      (child) => child !== element
    );

    if (!(inputContainer instanceof HTMLElement)) {
      continue;
    }

    row.setAttribute(COMPACT_ROW_ATTR, "true");
    inputContainer.setAttribute(COMPACT_INPUT_ATTR, "true");
    element.setAttribute(COMPACT_BUTTONS_ATTR, "true");
  }
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
