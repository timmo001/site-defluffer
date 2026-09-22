import { TOGGLE_EXTENSION_MESSAGE } from "./toggle-extension.js";

const TOGGLE_COMMAND = "toggle-extension";

chrome.commands.onCommand.addListener((command) => {
  if (command !== TOGGLE_COMMAND) {
    return;
  }

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;

    if (tabId === undefined) {
      return;
    }

    chrome.tabs.sendMessage(tabId, { type: TOGGLE_EXTENSION_MESSAGE }, () => {
      void chrome.runtime.lastError;
    });
  });
});
