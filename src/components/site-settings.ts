import { css, html, LitElement } from "lit";
import {
  countOn,
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

interface SettingGroup {
  name: string;
  settings: PopupSettingDefinition[];
}

// Settings before the first named group go under this heading.
const DEFAULT_GROUP_NAME = "Options";

function groupSettings(settings: readonly PopupSettingDefinition[]) {
  const groups: SettingGroup[] = [];

  for (const setting of settings) {
    const current = groups.at(-1);

    if (!current || setting.group) {
      groups.push({ name: setting.group ?? DEFAULT_GROUP_NAME, settings: [setting] });
    } else {
      current.settings.push(setting);
    }
  }

  return groups;
}

export class SiteSettings extends LitElement {
  static properties = {
    settings: { attribute: false },
    values: { attribute: false }
  };

  static styles = css`
    :host {
      display: grid;
      gap: 18px;
    }

    header {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 10px;
    }

    h3 {
      margin: 0;
      color: var(--sd-text);
      font-size: 14px;
      font-weight: 600;
    }

    .count {
      flex: 1;
      color: var(--sd-text-quiet);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .all {
      padding: 2px 4px;
      color: var(--sd-accent);
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      background: none;
      border: 0;
      border-radius: 6px;
      cursor: pointer;
    }

    .all:hover {
      text-decoration: underline;
    }

    .all:focus-visible {
      outline: 2px solid var(--sd-accent);
    }

    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
      gap: 8px;
    }

    setting-choice {
      grid-column: 1 / -1;
    }
  `;

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
        class="all"
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

  private renderGroup(group: SettingGroup) {
    const switchKeys = getSwitchKeys(group.settings);
    const onCount = countOn(switchKeys, this.values);

    return html`
      <section>
        <header>
          <h3>${group.name}</h3>
          <span class="count">
            ${switchKeys.length > 0 ? `${onCount}/${switchKeys.length}` : ""}
          </span>
          ${switchKeys.length > 1
            ? this.renderAllButton(switchKeys, onCount === switchKeys.length)
            : null}
        </header>
        <div class="tiles">
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
