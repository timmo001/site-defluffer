import { css, html, LitElement } from "lit";
import type { PopupSettingChoice } from "../popup-settings.js";
import type { SettingKey } from "../settings.js";
import { dispatchSettingChange } from "./setting-change.js";

// A segmented control: every choice is visible and one click away.
export class SettingChoice extends LitElement {
  static properties = {
    settingKey: { attribute: "setting-key" },
    label: {},
    value: {},
    choices: { attribute: false }
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: var(--sd-surface);
      border: 1px solid var(--sd-border);
      border-radius: 10px;
    }

    .label {
      flex: 1;
      color: var(--sd-text);
      font-size: 13px;
      font-weight: 500;
    }

    [role="radiogroup"] {
      display: flex;
      gap: 2px;
      padding: 3px;
      background: var(--sd-bg);
      border-radius: 9px;
    }

    button {
      min-width: 44px;
      padding: 5px 10px;
      color: var(--sd-text-quiet);
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      background: none;
      border: 0;
      border-radius: 7px;
      cursor: pointer;
    }

    button:hover {
      color: var(--sd-text);
    }

    button:focus-visible {
      outline: 2px solid var(--sd-accent);
    }

    button[aria-checked="true"] {
      color: var(--sd-bg);
      background: var(--sd-accent);
    }
  `;

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
      <span class="label" id="label">${this.label}</span>
      <div role="radiogroup" aria-labelledby="label">
        ${this.choices.map(
          (choice) => html`
            <button
              type="button"
              role="radio"
              aria-checked=${choice.value === this.value ? "true" : "false"}
              title=${choice.hint ?? choice.label}
              @click=${() => {
                dispatchSettingChange(this, { [this.settingKey]: choice.value });
              }}
            >
              ${choice.label}
            </button>
          `
        )}
      </div>
    `;
  }
}

customElements.define("setting-choice", SettingChoice);

declare global {
  interface HTMLElementTagNameMap {
    "setting-choice": SettingChoice;
  }
}
