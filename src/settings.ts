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
  twitterEnabled: {
    key: "twitterEnabled",
    default: true
  },
  twitterFillWidth: {
    key: "twitterFillWidth",
    default: true
  },
  twitterHideSidebar: {
    key: "twitterHideSidebar",
    default: true
  },
  twitterCompactNav: {
    key: "twitterCompactNav",
    default: true
  },
  twitterMediaSize: {
    key: "twitterMediaSize",
    default: "large",
    options: ["fill", "window", "large", "medium"]
  },
  twitterOpenFollowing: {
    key: "twitterOpenFollowing",
    default: true
  },
  twitterSortRecent: {
    key: "twitterSortRecent",
    default: true
  },
  twitterHideSportsTabs: {
    key: "twitterHideSportsTabs",
    default: true
  },
  twitterHideComposer: {
    key: "twitterHideComposer",
    default: false
  },
  twitterHideAds: {
    key: "twitterHideAds",
    default: true
  },
  twitterHideWhoToFollow: {
    key: "twitterHideWhoToFollow",
    default: true
  },
  twitterHideDiscoverMore: {
    key: "twitterHideDiscoverMore",
    default: true
  },
  twitterHideExploreForYou: {
    key: "twitterHideExploreForYou",
    default: false
  },
  twitterHideSearchPrompts: {
    key: "twitterHideSearchPrompts",
    default: true
  },
  twitterHideWhatsHappening: {
    key: "twitterHideWhatsHappening",
    default: true
  },
  twitterHideNews: {
    key: "twitterHideNews",
    default: false
  },
  twitterHidePremium: {
    key: "twitterHidePremium",
    default: true
  },
  twitterHideGrok: {
    key: "twitterHideGrok",
    default: true
  },
  twitterHideChatDrawer: {
    key: "twitterHideChatDrawer",
    default: true
  },
  twitterHideNavExtras: {
    key: "twitterHideNavExtras",
    default: true
  },
  twitterHideViews: {
    key: "twitterHideViews",
    default: false
  },
  twitterNarrowScrollbars: {
    key: "twitterNarrowScrollbars",
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

export interface BooleanSettingDefinition {
  key: string;
  default: boolean;
}

interface ChoiceSettingDefinition {
  key: string;
  default: string;
  options: readonly string[];
}

type StorageSettingDefinition = BooleanSettingDefinition | ChoiceSettingDefinition;

type SettingValue<Definition> = Definition extends {
  options: readonly (infer Option)[];
}
  ? Option
  : boolean;

export type SettingDefinition =
  (typeof SETTING_CATALOG)[keyof typeof SETTING_CATALOG];

export type SettingKey = SettingDefinition["key"];

export type SettingsFor<
  Definitions extends readonly StorageSettingDefinition[]
> = {
  [Definition in Definitions[number] as Definition["key"]]: SettingValue<Definition>;
};

export type Settings = SettingsFor<readonly SettingDefinition[]>;

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

export const TWITTER_SETTINGS = [
  SETTING_CATALOG.twitterEnabled,
  SETTING_CATALOG.twitterFillWidth,
  SETTING_CATALOG.twitterHideSidebar,
  SETTING_CATALOG.twitterCompactNav,
  SETTING_CATALOG.twitterMediaSize,
  SETTING_CATALOG.twitterOpenFollowing,
  SETTING_CATALOG.twitterSortRecent,
  SETTING_CATALOG.twitterHideSportsTabs,
  SETTING_CATALOG.twitterHideComposer,
  SETTING_CATALOG.twitterHideAds,
  SETTING_CATALOG.twitterHideWhoToFollow,
  SETTING_CATALOG.twitterHideDiscoverMore,
  SETTING_CATALOG.twitterHideExploreForYou,
  SETTING_CATALOG.twitterHideSearchPrompts,
  SETTING_CATALOG.twitterHideWhatsHappening,
  SETTING_CATALOG.twitterHideNews,
  SETTING_CATALOG.twitterHidePremium,
  SETTING_CATALOG.twitterHideGrok,
  SETTING_CATALOG.twitterHideChatDrawer,
  SETTING_CATALOG.twitterHideNavExtras,
  SETTING_CATALOG.twitterHideViews,
  SETTING_CATALOG.twitterNarrowScrollbars
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

function hasSettingsFor<Definitions extends readonly StorageSettingDefinition[]>(
  definitions: Definitions,
  value: Record<string, boolean | string>
): value is SettingsFor<Definitions> {
  return definitions.every((setting) => Object.hasOwn(value, setting.key));
}

// Stored values from older versions or other code fall back to the default.
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- This parser validates raw Chrome storage values.
function decodeValue(setting: StorageSettingDefinition, value: unknown) {
  if ("options" in setting) {
    return setting.options.find((option) => option === value) ?? setting.default;
  }

  return value === true || value === false ? value : setting.default;
}

export function getDefaultSettings<
  const Definitions extends readonly StorageSettingDefinition[]
>(definitions: Definitions): SettingsFor<Definitions> {
  const settings = Object.fromEntries<boolean | string>(
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
  const settings = Object.fromEntries<boolean | string>(
    definitions.map((setting) => [
      setting.key,
      decodeValue(setting, values[setting.key])
    ])
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
      [setting.key]: decodeValue(setting, change.newValue)
    });
  }

  return next;
}
