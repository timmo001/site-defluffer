export const SETTING_CATALOG = {
  corridorEnabled: {
    key: "corridorEnabled",
    default: true
  },
  corridorHideHeader: {
    key: "corridorHideHeader",
    default: false
  },
  corridorFillPageHeight: {
    key: "corridorFillPageHeight",
    default: true
  },
  corridorNarrowScrollbars: {
    key: "corridorNarrowScrollbars",
    default: true
  },
  patreonEnabled: {
    key: "patreonEnabled",
    default: true
  },
  patreonHideHeader: {
    key: "patreonHideHeader",
    default: false
  },
  patreonHideSidebar: {
    key: "patreonHideSidebar",
    default: false
  },
  patreonFillPageHeight: {
    key: "patreonFillPageHeight",
    default: true
  },
  twitchEnabled: {
    key: "twitchEnabled",
    default: true
  },
  twitchHidePanels: {
    key: "twitchMinifierEnabled",
    default: true
  },
  twitchCompactInputRow: {
    key: "twitchMinifierCompactInputRow",
    default: false
  },
  twitchNarrowScrollbars: {
    key: "twitchNarrowScrollbars",
    default: true
  },
  vivaplusEnabled: {
    key: "vivaplusEnabled",
    default: true
  },
  vivaplusHideHeader: {
    key: "vivaplusHideHeader",
    default: false
  },
  vivaplusFillPageHeight: {
    key: "vivaplusFillPageHeight",
    default: true
  },
  vivaplusNarrowScrollbars: {
    key: "vivaplusNarrowScrollbars",
    default: true
  },
  youtubeEnabled: {
    key: "youtubeEnabled",
    default: true
  },
  youtubeHideHeader: {
    key: "youtubeHideHeader",
    default: false
  },
  youtubeFillPageHeight: {
    key: "youtubeFillPageHeight",
    default: false
  },
  youtubeFitChat: {
    key: "youtubeFitChat",
    default: true
  },
  youtubeNarrowScrollbars: {
    key: "youtubeNarrowScrollbars",
    default: true
  }
} as const;

interface StorageSettingDefinition {
  key: string;
  default: boolean;
}

export type SettingDefinition =
  (typeof SETTING_CATALOG)[keyof typeof SETTING_CATALOG];

export type SettingKey = SettingDefinition["key"];

export type Settings = Record<SettingKey, boolean>;

export const ALL_SETTINGS: readonly SettingDefinition[] =
  Object.values(SETTING_CATALOG);

export const CORRIDOR_SETTINGS = [
  SETTING_CATALOG.corridorEnabled,
  SETTING_CATALOG.corridorHideHeader,
  SETTING_CATALOG.corridorFillPageHeight,
  SETTING_CATALOG.corridorNarrowScrollbars
] as const;

export const PATREON_SETTINGS = [
  SETTING_CATALOG.patreonEnabled,
  SETTING_CATALOG.patreonHideHeader,
  SETTING_CATALOG.patreonHideSidebar,
  SETTING_CATALOG.patreonFillPageHeight
] as const;

export const TWITCH_SETTINGS = [
  SETTING_CATALOG.twitchEnabled,
  SETTING_CATALOG.twitchHidePanels,
  SETTING_CATALOG.twitchCompactInputRow,
  SETTING_CATALOG.twitchNarrowScrollbars
] as const;

export const VIVAPLUS_SETTINGS = [
  SETTING_CATALOG.vivaplusEnabled,
  SETTING_CATALOG.vivaplusHideHeader,
  SETTING_CATALOG.vivaplusFillPageHeight,
  SETTING_CATALOG.vivaplusNarrowScrollbars
] as const;

export const YOUTUBE_SETTINGS = [
  SETTING_CATALOG.youtubeEnabled,
  SETTING_CATALOG.youtubeHideHeader,
  SETTING_CATALOG.youtubeFillPageHeight,
  SETTING_CATALOG.youtubeFitChat,
  SETTING_CATALOG.youtubeNarrowScrollbars
] as const;

export type SettingsFor<
  Definitions extends readonly StorageSettingDefinition[]
> =
  Record<Definitions[number]["key"], boolean>;

function hasSettingsFor<Definitions extends readonly StorageSettingDefinition[]>(
  definitions: Definitions,
  value: Record<string, boolean>
): value is SettingsFor<Definitions> {
  return definitions.every((setting) => Object.hasOwn(value, setting.key));
}

export function getDefaultSettings<
  const Definitions extends readonly StorageSettingDefinition[]
>(definitions: Definitions): SettingsFor<Definitions> {
  const settings = Object.fromEntries<boolean>(
    definitions.map((setting) => [setting.key, setting.default])
  );

  if (!hasSettingsFor(definitions, settings)) {
    throw new Error("Invalid default settings");
  }

  return settings;
}

export function decodeSettings<
  const Definitions extends readonly StorageSettingDefinition[]
>(
  definitions: Definitions,
  // oxlint-disable-next-line anti-slop/no-unsafe-dictionary-type -- This parser validates raw Chrome storage values before returning settings.
  values: Readonly<Record<string, unknown>>
): SettingsFor<Definitions> {
  const settings = Object.fromEntries<boolean>(
    definitions.map((setting) => {
      const value = values[setting.key];

      return [
        setting.key,
        value === true || value === false ? value : setting.default
      ];
    })
  );

  if (!hasSettingsFor(definitions, settings)) {
    throw new Error("Invalid stored settings");
  }

  return settings;
}

export function applyStorageChanges<
  const Definitions extends readonly StorageSettingDefinition[]
>(
  definitions: Definitions,
  current: SettingsFor<Definitions>,
  changes: Readonly<Record<string, chrome.storage.StorageChange>>
): SettingsFor<Definitions> | null {
  let next: SettingsFor<Definitions> | null = null;

  for (const setting of definitions) {
    const change = changes[setting.key];

    if (!change) {
      continue;
    }

    next ??= { ...current };
    Object.assign(next, {
      [setting.key]:
        change.newValue === true || change.newValue === false
          ? change.newValue
          : setting.default
    });
  }

  return next;
}
