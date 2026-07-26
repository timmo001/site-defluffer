import { html, LitElement } from "lit";
import {
  ALL_SETTINGS,
  getDefaultSettings,
  type Settings
} from "../settings.js";
import type { PopupSettingDefinition } from "../popup-settings.js";
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
      ${this.settings.map(
        (setting) => html`
          <setting-switch
            setting-key=${setting.key}
            label=${setting.label}
            hint=${setting.hint}
            .checked=${this.values[setting.key]}
          ></setting-switch>
        `
      )}
    `;
  }
}

customElements.define("site-settings", SiteSettings);

declare global {
  interface HTMLElementTagNameMap {
    "site-settings": SiteSettings;
  }
}
