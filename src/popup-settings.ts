import { SETTING_CATALOG, type SettingKey } from "./settings.js";

export interface PopupSettingChoice {
  value: string;
  label: string;
}

export interface PopupSettingDefinition {
  key: SettingKey;
  label: string;
  hint?: string;
  // Shown as a select instead of a switch.
  choices?: readonly PopupSettingChoice[];
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
    name: "Twitter",
    settings: [
      {
        key: SETTING_CATALOG.twitterEnabled.key,
        label: "Enable on Twitter",
        hint: "Toggle on Twitter with Alt+Shift+T"
      },
      {
        key: SETTING_CATALOG.twitterFillWidth.key,
        label: "Fill the window width",
        hint: "Stretch the timeline and its media into the free space"
      },
      {
        key: SETTING_CATALOG.twitterHideSidebar.key,
        label: "Hide the sidebar"
      },
      {
        key: SETTING_CATALOG.twitterCompactNav.key,
        label: "Use the compact icon nav",
        hint: "Free up the space nav labels take on wide windows"
      },
      {
        key: SETTING_CATALOG.twitterMediaSize.key,
        label: "Media size",
        hint: "Scale images and videos down instead of filling the width",
        choices: [
          { value: "fill", label: "Fill the width" },
          { value: "window", label: "Fit the window" },
          { value: "large", label: "Large (¾ of the window)" },
          { value: "medium", label: "Medium (½ of the window)" }
        ]
      },
      {
        key: SETTING_CATALOG.twitterOpenFollowing.key,
        label: "Open Home on Following",
        hint: "Switch away from For you when the page loads"
      },
      {
        key: SETTING_CATALOG.twitterSortRecent.key,
        label: "Sort Following by Recent",
        hint: "Popular stays one click away"
      },
      {
        key: SETTING_CATALOG.twitterHideSportsTabs.key,
        label: "Hide sports tabs",
        hint: "NFL, NBA and other tabs pinned to Home for you"
      },
      {
        key: SETTING_CATALOG.twitterHideComposer.key,
        label: "Hide the post box on Home"
      },
      {
        key: SETTING_CATALOG.twitterHideAds.key,
        label: "Hide ads",
        hint: "Promoted posts and trends"
      },
      {
        key: SETTING_CATALOG.twitterHideWhoToFollow.key,
        label: "Hide Who to follow",
        hint: "In the sidebar and the timeline"
      },
      {
        key: SETTING_CATALOG.twitterHideDiscoverMore.key,
        label: "Hide Discover more under posts"
      },
      {
        key: SETTING_CATALOG.twitterHideExploreForYou.key,
        label: "Hide suggested posts on Explore",
        hint: "Keeps news and trends on the Explore page"
      },
      {
        key: SETTING_CATALOG.twitterHideSearchPrompts.key,
        label: "Hide search feedback prompts",
        hint: "Is this post relevant to your search?"
      },
      {
        key: SETTING_CATALOG.twitterHideWhatsHappening.key,
        label: "Hide What's happening",
        hint: "Trends stay on the Explore page"
      },
      {
        key: SETTING_CATALOG.twitterHideNews.key,
        label: "Hide Today's News"
      },
      {
        key: SETTING_CATALOG.twitterHidePremium.key,
        label: "Hide Premium upsells",
        hint: "Nav item, sidebar card, subscribe buttons and prompts"
      },
      {
        key: SETTING_CATALOG.twitterHideGrok.key,
        label: "Hide Grok",
        hint: "Nav item, floating button and buttons on posts"
      },
      {
        key: SETTING_CATALOG.twitterHideChatDrawer.key,
        label: "Hide the floating Chat button"
      },
      {
        key: SETTING_CATALOG.twitterHideNavExtras.key,
        label: "Hide Calls, Creator Studio and Ads in the nav"
      },
      {
        key: SETTING_CATALOG.twitterHideViews.key,
        label: "Hide view counts"
      },
      {
        key: SETTING_CATALOG.twitterNarrowScrollbars.key,
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
