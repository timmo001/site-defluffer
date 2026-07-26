const STORAGE_KEYS = {
  // Keep legacy keys so existing installations retain their settings.
  twitchHidePanels: "twitchMinifierEnabled",
  twitchCompactInputRow: "twitchMinifierCompactInputRow",
  youtubeHideHeader: "youtubeHideHeader",
  youtubeFillPageHeight: "youtubeFillPageHeight"
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
type Settings = Record<StorageKey, boolean>;
type StatusState = "ready" | "error";

const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.twitchHidePanels]: true,
  [STORAGE_KEYS.twitchCompactInputRow]: false,
  [STORAGE_KEYS.youtubeHideHeader]: false,
  [STORAGE_KEYS.youtubeFillPageHeight]: false
};

function getRequiredElement<T extends HTMLElement>(
  id: string,
  elementType: { new (): T }
): T {
  const element = document.getElementById(id);

  if (!(element instanceof elementType)) {
    throw new Error(`Missing #${id}`);
  }

  return element;
}

const toggles: Record<StorageKey, HTMLInputElement> = {
  [STORAGE_KEYS.twitchHidePanels]: getRequiredElement(
    "enabled-toggle",
    HTMLInputElement
  ),
  [STORAGE_KEYS.twitchCompactInputRow]: getRequiredElement(
    "compact-input-toggle",
    HTMLInputElement
  ),
  [STORAGE_KEYS.youtubeHideHeader]: getRequiredElement(
    "youtube-hide-header-toggle",
    HTMLInputElement
  ),
  [STORAGE_KEYS.youtubeFillPageHeight]: getRequiredElement(
    "youtube-fill-page-height-toggle",
    HTMLInputElement
  )
};

const SETTING_KEYS = Object.values(STORAGE_KEYS);
const status = getRequiredElement("status", HTMLParagraphElement);

function setStatus(message: string, state: StatusState = "ready") {
  status.textContent = message;

  if (state === "ready") {
    delete status.dataset.state;
    return;
  }

  status.dataset.state = state;
}

function normalizeSettings(settings: Record<string, unknown>): Settings {
  return {
    [STORAGE_KEYS.twitchHidePanels]: Boolean(
      settings[STORAGE_KEYS.twitchHidePanels]
    ),
    [STORAGE_KEYS.twitchCompactInputRow]: Boolean(
      settings[STORAGE_KEYS.twitchCompactInputRow]
    ),
    [STORAGE_KEYS.youtubeHideHeader]: Boolean(
      settings[STORAGE_KEYS.youtubeHideHeader]
    ),
    [STORAGE_KEYS.youtubeFillPageHeight]: Boolean(
      settings[STORAGE_KEYS.youtubeFillPageHeight]
    )
  };
}

function loadSettings() {
  chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
    if (chrome.runtime.lastError) {
      setStatus(chrome.runtime.lastError.message || "Failed to load settings.", "error");
      return;
    }

    render(normalizeSettings(result));
  });
}

function render(settings: Settings) {
  for (const key of SETTING_KEYS) {
    toggles[key].checked = settings[key];
  }

  setStatus("");
}

loadSettings();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextSettings: Settings = normalizeSettings({
    [STORAGE_KEYS.twitchHidePanels]:
      toggles[STORAGE_KEYS.twitchHidePanels].checked,
    [STORAGE_KEYS.twitchCompactInputRow]:
      toggles[STORAGE_KEYS.twitchCompactInputRow].checked,
    [STORAGE_KEYS.youtubeHideHeader]:
      toggles[STORAGE_KEYS.youtubeHideHeader].checked,
    [STORAGE_KEYS.youtubeFillPageHeight]:
      toggles[STORAGE_KEYS.youtubeFillPageHeight].checked
  });

  let didChange = false;

  for (const key of SETTING_KEYS) {
    if (!changes[key]) {
      continue;
    }

    nextSettings[key] = Boolean(changes[key].newValue);
    didChange = true;
  }

  if (didChange) {
    render(nextSettings);
  }
});

for (const [key, toggle] of Object.entries(toggles)) {
  toggle.addEventListener("change", () => {
    const nextValue = toggle.checked;
    setStatus("");

    chrome.storage.local.set({ [key]: nextValue }, () => {
      if (!chrome.runtime.lastError) {
        render(
          normalizeSettings({
            [STORAGE_KEYS.twitchHidePanels]:
              toggles[STORAGE_KEYS.twitchHidePanels].checked,
            [STORAGE_KEYS.twitchCompactInputRow]:
              toggles[STORAGE_KEYS.twitchCompactInputRow].checked,
            [STORAGE_KEYS.youtubeHideHeader]:
              toggles[STORAGE_KEYS.youtubeHideHeader].checked,
            [STORAGE_KEYS.youtubeFillPageHeight]:
              toggles[STORAGE_KEYS.youtubeFillPageHeight].checked
          })
        );
        return;
      }

      toggle.checked = !nextValue;
      setStatus(chrome.runtime.lastError.message || "Failed to save setting.", "error");
    });
  });
}
