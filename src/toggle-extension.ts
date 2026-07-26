import { SETTING_CATALOG } from "./settings.js";

const EXTENSION_ENABLED = SETTING_CATALOG.extensionEnabled;

export function toggleExtension() {
  chrome.storage.local.get(
    { [EXTENSION_ENABLED.key]: EXTENSION_ENABLED.default },
    (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      const enabled = result[EXTENSION_ENABLED.key];
      chrome.storage.local.set({
        [EXTENSION_ENABLED.key]:
          typeof enabled === "boolean" ? !enabled : !EXTENSION_ENABLED.default
      });
    }
  );
}

export function handleToggleShortcut(event: KeyboardEvent) {
  if (
    event.key.toLowerCase() !== "t" ||
    !event.altKey ||
    !event.shiftKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.repeat
  ) {
    return;
  }

  event.preventDefault();
  toggleExtension();
}
