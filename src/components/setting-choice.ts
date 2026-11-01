import { GwSegmented } from "@timmo001/groundwork-ui/gw-segmented.ts";
import "@timmo001/groundwork-ui/gw-setting-row.ts";
import { css, html, LitElement } from "lit";
import type { PopupSettingChoice } from "../popup-settings.js";
import type { SettingKey } from "../settings.js";
import { dispatchSettingChange } from "./setting-change.js";
import { shared } from "./shared-styles.js";

/**
 * A setting with a few choices, as Groundwork's setting row and segmented
 * control. Arrow keys move between the choices and choose as they go.
 */
export class SettingChoice extends LitElement {
  static properties = {
    settingKey: { attribute: "setting-key" },
    label: {},
    value: {},
    choices: { attribute: false }
  };

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
    `
  ];

  declare settingKey: SettingKey;
  declare label: string;
  declare value: string;
  declare choices: readonly PopupSettingChoice[];

  constructor() {
    super();
    this.settingKey = "twitterMediaSize";
    this.label = "";
    this.value = "";
    this.choices = [];
  }

  render() {
    return html`
      <gw-setting-row heading=${this.label} size="small">
        <gw-segmented
          label=${this.label}
          size="small"
          .value=${this.value}
          .options=${this.choices}
          @change=${(event: Event) => {
            if (
              event.currentTarget instanceof GwSegmented &&
              event.currentTarget.value !== this.value
            ) {
              dispatchSettingChange(this, {
                [this.settingKey]: event.currentTarget.value
              });
            }
          }}
          @keydown=${(event: KeyboardEvent) => {
            // Arrow keys, Alt+Left too, move between the choices here rather than going back to every site.
            if (event.key.startsWith("Arrow")) {
              event.stopPropagation();
            }
          }}
        ></gw-segmented>
      </gw-setting-row>
    `;
  }
}

customElements.define("setting-choice", SettingChoice);

declare global {
  interface HTMLElementTagNameMap {
    "setting-choice": SettingChoice;
  }
}
