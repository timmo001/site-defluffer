export const SETTING_CATALOG = {
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

export const TWITCH_SETTINGS = [
  SETTING_CATALOG.twitchEnabled,
  SETTING_CATALOG.twitchHidePanels,
  SETTING_CATALOG.twitchCompactInputRow,
  SETTING_CATALOG.twitchNarrowScrollbars
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

export function getDefaultSettings<
  const Definitions extends readonly StorageSettingDefinition[]
>(definitions: Definitions): SettingsFor<Definitions> {
  // SAFETY: Every declared key is paired with its boolean default.
  return Object.fromEntries(
    definitions.map((setting) => [setting.key, setting.default])
  ) as SettingsFor<Definitions>;
}

export function decodeSettings<
  const Definitions extends readonly StorageSettingDefinition[]
>(
  definitions: Definitions,
  // oxlint-disable-next-line anti-slop/no-unsafe-dictionary-type -- This parser validates raw Chrome storage values before returning settings.
  values: Readonly<Record<string, unknown>>
): SettingsFor<Definitions> {
  // SAFETY: Every declared key gets a stored boolean or its boolean default.
  return Object.fromEntries(
    definitions.map((setting) => [
      setting.key,
      values[setting.key] === true || values[setting.key] === false
        ? values[setting.key]
        : setting.default
    ])
  ) as SettingsFor<Definitions>;
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
