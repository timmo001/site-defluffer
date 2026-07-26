import { html, LitElement } from "lit";
import "./setting-switch.js";

export interface SettingDefinition {
  key: string;
  label: string;
  hint: string;
}

export class SiteSettings extends LitElement {
  static properties = {
    settings: { attribute: false },
    values: { attribute: false }
  };

  declare settings: readonly SettingDefinition[];
  declare values: Readonly<Record<string, boolean>>;

  constructor() {
    super();
    this.settings = [];
    this.values = {};
  }

  render() {
    return html`
      ${this.settings.map(
        (setting) => html`
          <setting-switch
            setting-key=${setting.key}
            label=${setting.label}
            hint=${setting.hint}
            .checked=${Boolean(this.values[setting.key])}
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
