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
    render(normalizeSettings(result));
  });
}

function render(settings) {
  toggles[STORAGE_KEYS.hidePanels].checked = settings[STORAGE_KEYS.hidePanels];
  toggles[STORAGE_KEYS.compactInputRow].checked =
    settings[STORAGE_KEYS.compactInputRow];

  const parts = [];

  parts.push(
    settings[STORAGE_KEYS.hidePanels]
      ? "Panel hiding is on."
      : "Panel hiding is off."
  );

  parts.push(
    settings[STORAGE_KEYS.compactInputRow]
      ? "Compact chat row is on."
      : "Compact chat row is off."
  );

  status.textContent = parts.join(" ");
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
    chrome.storage.local.set({ [key]: toggle.checked });
  });
}
