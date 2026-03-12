const STORAGE_KEYS = {
  hidePanels: "twitchMinifierEnabled",
  compactInputRow: "twitchMinifierCompactInputRow"
};

const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.hidePanels]: true,
  [STORAGE_KEYS.compactInputRow]: false
};

const toggles = {
  [STORAGE_KEYS.hidePanels]: document.getElementById("enabled-toggle"),
  [STORAGE_KEYS.compactInputRow]: document.getElementById("compact-input-toggle")
};

const SETTING_KEYS = Object.values(STORAGE_KEYS);
const status = document.getElementById("status");

function setStatus(message, state = "ready") {
  status.textContent = message;

  if (state === "ready") {
    delete status.dataset.state;
    return;
  }

  status.dataset.state = state;
}

function normalizeSettings(settings) {
  return {
    [STORAGE_KEYS.hidePanels]: Boolean(settings[STORAGE_KEYS.hidePanels]),
    [STORAGE_KEYS.compactInputRow]: Boolean(
      settings[STORAGE_KEYS.compactInputRow]
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

function render(settings) {
  toggles[STORAGE_KEYS.hidePanels].checked = settings[STORAGE_KEYS.hidePanels];
  toggles[STORAGE_KEYS.compactInputRow].checked =
    settings[STORAGE_KEYS.compactInputRow];

  setStatus("");
}

loadSettings();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextSettings = normalizeSettings({
    [STORAGE_KEYS.hidePanels]: toggles[STORAGE_KEYS.hidePanels].checked,
    [STORAGE_KEYS.compactInputRow]:
      toggles[STORAGE_KEYS.compactInputRow].checked
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
            [STORAGE_KEYS.hidePanels]: toggles[STORAGE_KEYS.hidePanels].checked,
            [STORAGE_KEYS.compactInputRow]:
              toggles[STORAGE_KEYS.compactInputRow].checked
          })
        );
        return;
      }

      toggle.checked = !nextValue;
      setStatus(chrome.runtime.lastError.message || "Failed to save setting.", "error");
    });
  });
}
