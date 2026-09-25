import { SETTING_CATALOG, type SettingKey } from "./settings.js";

export interface PopupSettingDefinition {
  key: SettingKey;
  label: string;
  hint?: string;
}

export const SITE_SETTINGS = [
  {
    name: "Patreon",
    settings: [
      {
        key: SETTING_CATALOG.patreonEnabled.key,
        label: "Enable on Patreon",
        hint: "Toggle on Patreon with Alt+Shift+T"
      },
      {
        key: SETTING_CATALOG.patreonHideHeader.key,
        label: "Hide header",
        hint: "Temporarily toggle with Alt+T"
      },
      {
        key: SETTING_CATALOG.patreonHideSidebar.key,
        label: "Hide sidebar"
      },
      {
        key: SETTING_CATALOG.patreonFillPageHeight.key,
        label: "Fill page height",
        hint: "Resize post videos to fill the page"
      }
    ]
  },
  {
    name: "Twitch",
    settings: [
      {
        key: SETTING_CATALOG.twitchEnabled.key,
        label: "Enable on Twitch",
        hint: "Toggle on Twitch with Alt+Shift+T"
      },
      {
        key: SETTING_CATALOG.twitchHidePanels.key,
        label: "Hide extra panels"
      },
      {
        key: SETTING_CATALOG.twitchCompactInputRow.key,
        label: "Keep chat input and bits on one line"
      },
      {
        key: SETTING_CATALOG.twitchNarrowScrollbars.key,
        label: "Use narrow scrollbars"
      }
    ]
  },
  {
    name: "YouTube",
    settings: [
      {
        key: SETTING_CATALOG.youtubeEnabled.key,
        label: "Enable on YouTube",
        hint: "Toggle on YouTube with Alt+Shift+T"
      },
      {
        key: SETTING_CATALOG.youtubeHideHeader.key,
        label: "Hide header",
        hint: "Temporarily toggle with Alt+T"
      },
      {
        key: SETTING_CATALOG.youtubeFillPageHeight.key,
        label: "Fill page height"
      },
      {
        key: SETTING_CATALOG.youtubeFitChat.key,
        label: "Fit chat to sidebar",
        hint: "Use Twitch-style width and fill the page height"
      },
      {
        key: SETTING_CATALOG.youtubeNarrowScrollbars.key,
        label: "Use narrow scrollbars"
      }
    ]
  }
] as const satisfies readonly {
  name: string;
  settings: readonly PopupSettingDefinition[];
}[];
