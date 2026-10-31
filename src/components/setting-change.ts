import type { SettingKey } from "../settings.js";

// One tile sends a single value; a section's "All" button sends one per tile.
export interface SettingChangeDetail {
  values: Partial<Record<SettingKey, boolean | string>>;
}

export function dispatchSettingChange(
  target: EventTarget,
  values: SettingChangeDetail["values"]
) {
  target.dispatchEvent(
    new CustomEvent<SettingChangeDetail>("setting-change", {
      bubbles: true,
      composed: true,
      detail: { values }
    })
  );
}
