import "@awesome.me/webawesome/dist/components/option/option.js";
import "@awesome.me/webawesome/dist/components/select/select.js";
import WaSelect from "@awesome.me/webawesome/dist/components/select/select.js";
import { css, html, LitElement } from "lit";
import type { PopupSettingChoice } from "../popup-settings.js";
import type { SettingKey } from "../settings.js";
import type { SettingChangeDetail } from "./setting-switch.js";

export class SettingSelect extends LitElement {
  static properties = {
    settingKey: { attribute: "setting-key" },
    label: {},
    hint: {},
    value: {},
    choices: { attribute: false }
  };

  static styles = css`
    :host {
      display: block;
      padding: 14px 0;
      border-top: 1px solid var(--wa-color-surface-border);
    }

    wa-select::part(form-control-label) {
      font-weight: 600;
    }

    wa-select::part(hint) {
      font-size: 12px;
    }
  `;

  declare settingKey: SettingKey;
  declare label: string;
  declare hint: string;
  declare value: string;
  declare choices: readonly PopupSettingChoice[];

  constructor() {
    super();
    this.settingKey = "twitterMediaSize";
    this.label = "";
    this.hint = "";
    this.value = "";
    this.choices = [];
  }

  private handleChange(event: Event) {
    const select = event.currentTarget;

    if (
      !(select instanceof WaSelect) ||
      select.value === null ||
      Array.isArray(select.value)
    ) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<SettingChangeDetail>("setting-change", {
        bubbles: true,
        composed: true,
        detail: { key: this.settingKey, value: select.value }
      })
    );
  }

  render() {
    return html`
      <wa-select
        label=${this.label}
        hint=${this.hint}
        size="small"
        .value=${this.value}
        @change=${
          // oxlint-disable-next-line typescript/unbound-method -- Lit calls event handlers with the host as this.
          this.handleChange
        }
      >
        ${this.choices.map(
          (choice) => html`<wa-option value=${choice.value}>${choice.label}</wa-option>`
        )}
      </wa-select>
    `;
  }
}

customElements.define("setting-select", SettingSelect);

declare global {
  interface HTMLElementTagNameMap {
    "setting-select": SettingSelect;
  }
}
