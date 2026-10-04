import { SETTING_CATALOG, type SettingKey } from "./settings.js";

export interface PopupSettingDefinition {
  key: SettingKey;
  label: string;
  hint?: string;
}

export const SITE_SETTINGS = [
  {
    name: "Corridor Digital",
    settings: [
      {
        key: SETTING_CATALOG.corridorEnabled.key,
        label: "Enable on Corridor Digital",
        hint: "Toggle on Corridor Digital with Alt+Shift+T"
      },
      {
        key: SETTING_CATALOG.corridorHideHeader.key,
        label: "Hide header in theatre mode"
      },
      {
        key: SETTING_CATALOG.corridorFillPageHeight.key,
        label: "Fill page height in theatre mode"
      },
      {
        key: SETTING_CATALOG.corridorNarrowScrollbars.key,
        label: "Use narrow scrollbars"
      }
    ]
  },
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
    name: "Viva+",
    settings: [
      {
        key: SETTING_CATALOG.vivaplusEnabled.key,
        label: "Enable on Viva+",
        hint: "Toggle on Viva+ with Alt+Shift+T"
      },
      {
        key: SETTING_CATALOG.vivaplusHideHeader.key,
        label: "Hide header",
        hint: "Temporarily toggle with Alt+T"
      },
      {
        key: SETTING_CATALOG.vivaplusFillPageHeight.key,
        label: "Fill page height"
      },
      {
        key: SETTING_CATALOG.vivaplusNarrowScrollbars.key,
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
