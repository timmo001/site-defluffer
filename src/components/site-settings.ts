import { html, LitElement } from "lit";
import {
  ALL_SETTINGS,
  getDefaultSettings,
  type Settings
} from "../settings.js";
import type { PopupSettingDefinition } from "../popup-settings.js";
import "./setting-select.js";
import "./setting-switch.js";

export class SiteSettings extends LitElement {
  static properties = {
    settings: { attribute: false },
    values: { attribute: false }
  };

  declare settings: readonly PopupSettingDefinition[];
  declare values: Readonly<Settings>;

  constructor() {
    super();
    this.settings = [];
    this.values = getDefaultSettings(ALL_SETTINGS);
  }

  render() {
    return html`
      ${this.settings.map((setting) => {
        const value = this.values[setting.key];

        return setting.choices
          ? html`
              <setting-select
                setting-key=${setting.key}
                label=${setting.label}
                hint=${setting.hint ?? ""}
                .value=${String(value)}
                .choices=${setting.choices}
              ></setting-select>
            `
          : html`
              <setting-switch
                setting-key=${setting.key}
                label=${setting.label}
                hint=${setting.hint ?? ""}
                .checked=${value === true}
              ></setting-switch>
            `;
      })}
    `;
  }
}

customElements.define("site-settings", SiteSettings);

declare global {
  interface HTMLElementTagNameMap {
    "site-settings": SiteSettings;
  }
}
