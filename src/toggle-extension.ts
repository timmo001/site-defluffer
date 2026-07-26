import type { SettingDefinition } from "./settings.js";

export const TOGGLE_EXTENSION_MESSAGE = "toggle-extension";

export function toggleExtension(setting: SettingDefinition) {
  chrome.storage.local.get(
    { [setting.key]: setting.default },
    (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      const enabled = result[setting.key];
      chrome.storage.local.set({
        [setting.key]: typeof enabled === "boolean" ? !enabled : !setting.default
      });
    }
  );
}

function handleToggleShortcut(event: KeyboardEvent, setting: SettingDefinition) {
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
  toggleExtension(setting);
}

export function registerExtensionToggle(setting: SettingDefinition) {
  document.addEventListener("keydown", (event) => {
    handleToggleShortcut(event, setting);
  });
  chrome.runtime.onMessage.addListener((message: unknown) => {
    if (
      typeof message === "object" &&
      message !== null &&
      "type" in message &&
      message.type === TOGGLE_EXTENSION_MESSAGE
    ) {
      toggleExtension(setting);
    }
  });
}
