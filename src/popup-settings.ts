import { SETTING_CATALOG, type SettingKey } from "./settings.js";

export interface PopupSettingDefinition {
  key: SettingKey;
  label: string;
  hint?: string;
}

export const GLOBAL_SETTING = {
  key: SETTING_CATALOG.extensionEnabled.key,
  label: "Enable Site Defluffer",
  hint: "Toggle anywhere with Alt+Shift+T"
} as const satisfies PopupSettingDefinition;

export const SITE_SETTINGS = [
  {
    name: "Twitch",
    settings: [
      {
        key: SETTING_CATALOG.twitchHidePanels.key,
        label: "Hide extra panels"
      },
      {
        key: SETTING_CATALOG.twitchCompactInputRow.key,
        label: "Keep chat input and bits on one line"
      }
    ]
  },
  {
    name: "YouTube",
    settings: [
      {
        key: SETTING_CATALOG.youtubeHideHeader.key,
        label: "Hide header",
        hint: "Temporarily toggle with Alt+T"
      },
      {
        key: SETTING_CATALOG.youtubeFillPageHeight.key,
        label: "Fill page height"
      }
    ]
  }
] as const satisfies readonly {
  name: string;
  settings: readonly PopupSettingDefinition[];
}[];
