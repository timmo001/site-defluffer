import assert from "node:assert/strict";
import test from "node:test";
import {
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  TWITCH_SETTINGS,
  YOUTUBE_SETTINGS
} from "../src/settings.ts";

test("decodes boolean settings and restores defaults", () => {
  assert.deepEqual(
    decodeSettings(TWITCH_SETTINGS, {
      twitchMinifierEnabled: "false",
      twitchMinifierCompactInputRow: true
    }),
    {
      twitchEnabled: true,
      twitchMinifierEnabled: true,
      twitchMinifierCompactInputRow: true,
      twitchNarrowScrollbars: true
    }
  );
});

test("returns only the requested site's settings", () => {
  assert.deepEqual(getDefaultSettings(YOUTUBE_SETTINGS), {
    youtubeEnabled: true,
    youtubeHideHeader: false,
    youtubeFillPageHeight: false,
    youtubeFitChat: true,
    youtubeNarrowScrollbars: true
  });
});

test("restores the declared default when a key is removed", () => {
  assert.deepEqual(
    applyStorageChanges(
      TWITCH_SETTINGS,
      {
        twitchEnabled: true,
        twitchMinifierEnabled: false,
        twitchMinifierCompactInputRow: true,
        twitchNarrowScrollbars: true
      },
      {
        twitchMinifierEnabled: { oldValue: false, newValue: undefined }
      }
    ),
    {
      twitchEnabled: true,
      twitchMinifierEnabled: true,
      twitchMinifierCompactInputRow: true,
      twitchNarrowScrollbars: true
    }
  );
});

test("ignores unrelated storage changes", () => {
  assert.equal(
    applyStorageChanges(TWITCH_SETTINGS, getDefaultSettings(TWITCH_SETTINGS), {
      unrelated: { newValue: true }
    }),
    null
  );
});
