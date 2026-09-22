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

      const enabled: unknown = result[setting.key];

      void chrome.storage.local.set({
        [setting.key]: enabled === true || enabled === false ? !enabled : !setting.default
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
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- Chrome messages enter here as untrusted values and are validated below.
  chrome.runtime.onMessage.addListener((message: unknown) => {
    if (
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Check the message object before reading its command discriminator.
      typeof message === "object" &&
      message !== null &&
      "type" in message &&
      message.type === TOGGLE_EXTENSION_MESSAGE
    ) {
      toggleExtension(setting);
    }
  });
}
