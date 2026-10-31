import { mdiTuneVariant } from "@mdi/js";
import { css, html, LitElement } from "lit";
import {
  countOn,
  getDefaultChanges,
  getSwitchKeys,
  type PopupSettingDefinition
} from "../popup-settings.js";
import {
  ALL_SETTINGS,
  getDefaultSettings,
  type SettingKey,
  type Settings
} from "../settings.js";
import { dispatchSettingChange } from "./setting-change.js";
import "./setting-choice.js";
import "./setting-tile.js";
import { icon, shared } from "./shared-styles.js";

interface SettingGroup {
  name: string;
  icon: string;
  settings: PopupSettingDefinition[];
}

// Settings before the first named group go under this heading.
const DEFAULT_GROUP = { name: "Options", icon: mdiTuneVariant };

function groupSettings(settings: readonly PopupSettingDefinition[]) {
  const groups: SettingGroup[] = [];

  for (const setting of settings) {
    const current = groups.at(-1);

    if (!current || setting.group) {
      groups.push({
        name: setting.group ?? DEFAULT_GROUP.name,
        icon: setting.groupIcon ?? DEFAULT_GROUP.icon,
        settings: [setting]
      });
    } else {
      current.settings.push(setting);
    }
  }

  return groups;
}

/** A site's settings, as cards of toggle tiles after System Bridge's `sb-card`. */
export class SiteSettings extends LitElement {
  static properties = {
    settings: { attribute: false },
    values: { attribute: false }
  };

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--sd-space-3);
      }

      .card {
        gap: var(--sd-space-2);
        padding: var(--sd-space-3);
      }

      header {
        --sd-row-gap: var(--sd-space-3);
      }

      .titles {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
      }

      .subheading {
        font-size: var(--sd-font-size-xs);
      }

      .tiles {
        --sd-grid-min: 9.5rem;
        --sd-grid-gap: var(--sd-space-2);
      }

      setting-choice {
        grid-column: 1 / -1;
        padding-top: var(--sd-space-1);
      }
    `
  ];

  declare settings: readonly PopupSettingDefinition[];
  declare values: Readonly<Settings>;

  constructor() {
    super();
    this.settings = [];
    this.values = getDefaultSettings(ALL_SETTINGS);
  }

  private renderSetting(setting: PopupSettingDefinition) {
    const value = this.values[setting.key];

    return setting.choices
      ? html`
          <setting-choice
            setting-key=${setting.key}
            label=${setting.label}
            .value=${String(value)}
            .choices=${setting.choices}
          ></setting-choice>
        `
      : html`
          <setting-tile
            setting-key=${setting.key}
            label=${setting.label}
            hint=${setting.hint ?? ""}
            .checked=${value === true}
          ></setting-tile>
        `;
  }

  private renderAllButton(keys: readonly SettingKey[], allOn: boolean) {
    return html`
      <button
        class="button plain small"
        type="button"
        @click=${() => {
          dispatchSettingChange(
            this,
            Object.fromEntries(keys.map((key) => [key, !allOn]))
          );
        }}
      >
        ${allOn ? "All off" : "All on"}
      </button>
    `;
  }

  private renderDefaultsButton(group: SettingGroup) {
    const changes = getDefaultChanges(
      group.settings.map((setting) => setting.key),
      this.values
    );

    return html`
      <button
        class="button plain small"
        type="button"
        title="Reset ${group.name} to its defaults"
        ?disabled=${Object.keys(changes).length === 0}
        @click=${() => {
          dispatchSettingChange(this, changes);
        }}
      >
        Reset to default
      </button>
    `;
  }

  private renderGroup(group: SettingGroup) {
    const switchKeys = getSwitchKeys(group.settings);
    const onCount = countOn(switchKeys, this.values);

    return html`
      <section class="card">
        <header class="row">
          <span class="tile small">${icon(group.icon)}</span>
          <span class="titles">
            <h3>${group.name}</h3>
            <span class="subheading muted tabular">
              ${onCount} of ${switchKeys.length} on
            </span>
          </span>
          ${this.renderDefaultsButton(group)}
          ${switchKeys.length > 1
            ? this.renderAllButton(switchKeys, onCount === switchKeys.length)
            : null}
        </header>
        <div class="grid tiles">
          ${group.settings.map((setting) => this.renderSetting(setting))}
        </div>
      </section>
    `;
  }

  render() {
    return groupSettings(this.settings).map((group) => this.renderGroup(group));
  }
}

customElements.define("site-settings", SiteSettings);

declare global {
  interface HTMLElementTagNameMap {
    "site-settings": SiteSettings;
  }
}
