import { SETTING_CATALOG, type SettingKey, type Settings } from "./settings.js";

// Choices have no on or off state, so only switches count and group switches
// leave choices alone.
export function getSwitchKeys(settings: readonly PopupSettingDefinition[]) {
  return settings.flatMap((setting) => (setting.choices ? [] : [setting.key]));
}

export function countOn(keys: readonly SettingKey[], values: Readonly<Settings>) {
  return keys.filter((key) => values[key] === true).length;
}

export interface PopupSettingChoice {
  value: string;
  label: string;
  hint?: string;
}

export interface PopupSettingDefinition {
  key: SettingKey;
  label: string;
  hint?: string;
  // Shown as a segmented control instead of a toggle tile.
  choices?: readonly PopupSettingChoice[];
  // Starts a new section under this heading.
  group?: string;
}

export interface PopupSiteDefinition {
  name: string;
  // Opens this site's view when the popup opens on one of these hosts.
  hosts: readonly string[];
  // Turns every change on the site on or off; Alt+Shift+T flips it too.
  enabled: SettingKey;
  settings: readonly PopupSettingDefinition[];
}

export const SITE_SETTINGS = [
  {
    name: "Corridor Digital",
    hosts: ["www.corridordigital.com"],
    enabled: SETTING_CATALOG.corridorEnabled.key,
    settings: [
      {
        key: SETTING_CATALOG.corridorHideHeader.key,
        label: "Hide header",
        hint: "In theatre mode"
      },
      {
        key: SETTING_CATALOG.corridorFillPageHeight.key,
        label: "Fill height",
        hint: "Fill the page height in theatre mode"
      },
      {
        key: SETTING_CATALOG.corridorNarrowScrollbars.key,
        label: "Thin scrollbars"
      }
    ]
  },
  {
    name: "Patreon",
    hosts: ["www.patreon.com"],
    enabled: SETTING_CATALOG.patreonEnabled.key,
    settings: [
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
        label: "Fill height",
        hint: "Resize post videos to fill the page"
      }
    ]
  },
  {
    name: "Twitch",
    hosts: ["www.twitch.tv"],
    enabled: SETTING_CATALOG.twitchEnabled.key,
    settings: [
      {
        key: SETTING_CATALOG.twitchHidePanels.key,
        label: "Hide extra panels"
      },
      {
        key: SETTING_CATALOG.twitchCompactInputRow.key,
        label: "Compact chat input",
        hint: "Keep chat input and bits on one line"
      },
      {
        key: SETTING_CATALOG.twitchNarrowScrollbars.key,
        label: "Thin scrollbars"
      }
    ]
  },
  {
    name: "Twitter",
    hosts: ["x.com", "twitter.com"],
    enabled: SETTING_CATALOG.twitterEnabled.key,
    settings: [
      {
        key: SETTING_CATALOG.twitterFillWidth.key,
        label: "Fill width",
        hint: "Stretch the timeline into the free space",
        group: "Layout"
      },
      {
        key: SETTING_CATALOG.twitterHideSidebar.key,
        label: "Hide sidebar"
      },
      {
        key: SETTING_CATALOG.twitterCompactNav.key,
        label: "Compact nav",
        hint: "Icon-only nav that frees up space on wide windows"
      },
      {
        key: SETTING_CATALOG.twitterNarrowScrollbars.key,
        label: "Thin scrollbars"
      },
      {
        key: SETTING_CATALOG.twitterMediaSize.key,
        label: "Media size",
        choices: [
          { value: "fill", label: "Fill", hint: "Fill the timeline width" },
          { value: "window", label: "Window", hint: "Fit within the window height" },
          { value: "large", label: "¾", hint: "Up to ¾ of the window height" },
          { value: "medium", label: "½", hint: "Up to ½ of the window height" }
        ]
      },
      {
        key: SETTING_CATALOG.twitterOpenFollowing.key,
        label: "Open on Following",
        hint: "Switch away from For you when the page loads",
        group: "Home timeline"
      },
      {
        key: SETTING_CATALOG.twitterSortRecent.key,
        label: "Recent first",
        hint: "Sort Following by Recent; Popular stays one click away"
      },
      {
        key: SETTING_CATALOG.twitterHideSportsTabs.key,
        label: "Hide sports tabs",
        hint: "NFL, NBA and other tabs pinned for you"
      },
      {
        key: SETTING_CATALOG.twitterHideComposer.key,
        label: "Hide post box"
      },
      {
        key: SETTING_CATALOG.twitterHideAds.key,
        label: "Ads",
        hint: "Promoted posts and trends",
        group: "Hide"
      },
      {
        key: SETTING_CATALOG.twitterHideWhoToFollow.key,
        label: "Who to follow"
      },
      {
        key: SETTING_CATALOG.twitterHideDiscoverMore.key,
        label: "Discover more",
        hint: "Suggested posts under a post's replies"
      },
      {
        key: SETTING_CATALOG.twitterHideExploreForYou.key,
        label: "Explore suggestions",
        hint: "Suggested posts on Explore; news and trends stay"
      },
      {
        key: SETTING_CATALOG.twitterHideSearchPrompts.key,
        label: "Search prompts",
        hint: "Is this post relevant to your search?"
      },
      {
        key: SETTING_CATALOG.twitterHideWhatsHappening.key,
        label: "What's happening"
      },
      {
        key: SETTING_CATALOG.twitterHideNews.key,
        label: "Today's News"
      },
      {
        key: SETTING_CATALOG.twitterHidePremium.key,
        label: "Premium",
        hint: "Nav item, sidebar card, subscribe buttons and prompts"
      },
      {
        key: SETTING_CATALOG.twitterHideGrok.key,
        label: "Grok",
        hint: "Nav item, floating button and buttons on posts"
      },
      {
        key: SETTING_CATALOG.twitterHideChatDrawer.key,
        label: "Chat button",
        hint: "The floating Chat button"
      },
      {
        key: SETTING_CATALOG.twitterHideNavExtras.key,
        label: "Extra nav links",
        hint: "Calls, Creator Studio and Ads"
      },
      {
        key: SETTING_CATALOG.twitterHideViews.key,
        label: "View counts"
      }
    ]
  },
  {
    name: "Viva+",
    hosts: ["vivaplus.tv"],
    enabled: SETTING_CATALOG.vivaplusEnabled.key,
    settings: [
      {
        key: SETTING_CATALOG.vivaplusHideHeader.key,
        label: "Hide header",
        hint: "Temporarily toggle with Alt+T"
      },
      {
        key: SETTING_CATALOG.vivaplusFillPageHeight.key,
        label: "Fill height"
      },
      {
        key: SETTING_CATALOG.vivaplusNarrowScrollbars.key,
        label: "Thin scrollbars"
      }
    ]
  },
  {
    name: "YouTube",
    hosts: ["www.youtube.com"],
    enabled: SETTING_CATALOG.youtubeEnabled.key,
    settings: [
      {
        key: SETTING_CATALOG.youtubeHideHeader.key,
        label: "Hide header",
        hint: "Temporarily toggle with Alt+T"
      },
      {
        key: SETTING_CATALOG.youtubeFillPageHeight.key,
        label: "Fill height"
      },
      {
        key: SETTING_CATALOG.youtubeFitChat.key,
        label: "Fit chat",
        hint: "Use Twitch-style width and fill the page height"
      },
      {
        key: SETTING_CATALOG.youtubeNarrowScrollbars.key,
        label: "Thin scrollbars"
      }
    ]
  }
] as const satisfies readonly PopupSiteDefinition[];
