import "@awesome.me/webawesome/dist/components/switch/switch.js";
import WaSwitch from "@awesome.me/webawesome/dist/components/switch/switch.js";
import { css, html, LitElement } from "lit";
import type { SettingKey } from "../settings.js";

export interface SettingChangeDetail {
  key: SettingKey;
  checked: boolean;
}

export class SettingSwitch extends LitElement {
  static properties = {
    settingKey: { attribute: "setting-key" },
    label: {},
    hint: {},
    checked: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      padding: 14px 0;
    }

    :host + :host {
      border-top: 1px solid var(--wa-color-surface-border);
    }

    wa-switch {
      display: block;
      --width: 48px;
      --height: 28px;
      --thumb-size: 20px;
    }

    wa-switch::part(base) {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      gap: 14px;
      width: 100%;
      cursor: pointer;
    }

    wa-switch::part(control) {
      align-self: center;
    }

    wa-switch::part(label) {
      margin-inline: 0;
      font-weight: 600;
    }

    wa-switch::part(hint) {
      font-size: 12px;
    }
  `;

  declare settingKey: SettingKey;
  declare label: string;
  declare hint: string;
  declare checked: boolean;

  constructor() {
    super();
    this.settingKey = "twitchMinifierEnabled";
    this.label = "";
    this.hint = "";
    this.checked = false;
  }

  private handleChange(event: Event) {
    if (!(event.currentTarget instanceof WaSwitch)) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<SettingChangeDetail>("setting-change", {
        bubbles: true,
        composed: true,
        detail: {
          key: this.settingKey,
          checked: event.currentTarget.checked
        }
      })
    );
  }

  render() {
    return html`
      <wa-switch
        .checked=${this.checked}
        hint=${this.hint}
        @change=${
          // oxlint-disable-next-line typescript/unbound-method -- Lit calls event handlers with the host as this.
          this.handleChange
        }
      >
        ${this.label}
      </wa-switch>
    `;
  }
}

customElements.define("setting-switch", SettingSwitch);

declare global {
  interface HTMLElementTagNameMap {
    "setting-switch": SettingSwitch;
  }
}
