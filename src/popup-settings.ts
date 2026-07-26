import { SETTING_CATALOG, type SettingKey } from "./settings.js";

export interface PopupSettingDefinition {
  key: SettingKey;
  label: string;
  hint: string;
}

export const SITE_SETTINGS = [
  {
    name: "Twitch",
    settings: [
      {
        key: SETTING_CATALOG.twitchHidePanels.key,
        label: "Hide extra panels",
        hint: "Enabled by default"
      },
      {
        key: SETTING_CATALOG.twitchCompactInputRow.key,
        label: "Keep chat input and bits on one line",
        hint: "Disabled by default"
      }
    ]
  },
  {
    name: "YouTube",
    settings: [
      {
        key: SETTING_CATALOG.youtubeHideHeader.key,
        label: "Hide header",
        hint: "Disabled by default"
      },
      {
        key: SETTING_CATALOG.youtubeFillPageHeight.key,
        label: "Fill page height",
        hint: "Disabled by default"
      }
    ]
  }
] as const satisfies readonly {
  name: string;
  settings: readonly PopupSettingDefinition[];
}[];
