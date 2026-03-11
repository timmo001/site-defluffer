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

const status = document.getElementById("status");

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

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  render({
    [STORAGE_KEYS.hidePanels]: Boolean(result[STORAGE_KEYS.hidePanels]),
    [STORAGE_KEYS.compactInputRow]: Boolean(
      result[STORAGE_KEYS.compactInputRow]
    )
  });
});

for (const [key, toggle] of Object.entries(toggles)) {
  toggle.addEventListener("change", () => {
    chrome.storage.local.set({ [key]: toggle.checked }, () => {
      chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
        render({
          [STORAGE_KEYS.hidePanels]: Boolean(result[STORAGE_KEYS.hidePanels]),
          [STORAGE_KEYS.compactInputRow]: Boolean(
            result[STORAGE_KEYS.compactInputRow]
          )
        });
      });
    });
  });
}
