import { css, html, LitElement } from "lit";
import type { SettingKey } from "../settings.js";
import { dispatchSettingChange } from "./setting-change.js";

export class SettingTile extends LitElement {
  static properties = {
    settingKey: { attribute: "setting-key" },
    label: {},
    hint: {},
    checked: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
      height: 100%;
      min-height: 46px;
      padding: 8px 12px;
      color: var(--sd-text-quiet);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
      text-align: start;
      background: transparent;
      border: 1px solid var(--sd-border);
      border-radius: 10px;
      cursor: pointer;
      transition:
        background 120ms,
        border-color 120ms,
        color 120ms;
    }

    button:hover {
      border-color: var(--sd-border-strong);
    }

    button:focus-visible {
      outline: 2px solid var(--sd-accent);
      outline-offset: 2px;
    }

    button[aria-pressed="true"] {
      color: var(--sd-text);
      background: var(--sd-surface-raised);
      border-color: var(--sd-surface-raised);
    }

    .state {
      flex: none;
      width: 22px;
      height: 12px;
      border-radius: 6px;
      background: var(--sd-border-strong);
      position: relative;
      transition: background 120ms;
    }

    .state::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--sd-bg);
      transition: transform 120ms;
    }

    [aria-pressed="true"] .state {
      background: var(--sd-accent);
    }

    [aria-pressed="true"] .state::after {
      transform: translateX(10px);
    }

    @media (prefers-reduced-motion: reduce) {
      button,
      .state,
      .state::after {
        transition: none;
      }
    }
  `;

  declare settingKey: SettingKey;
  declare label: string;
  declare hint: string;
  declare checked: boolean;

  constructor() {
    super();
    this.settingKey = "twitterHideAds";
    this.label = "";
    this.hint = "";
    this.checked = false;
  }

  private toggle() {
    dispatchSettingChange(this, { [this.settingKey]: !this.checked });
  }

  render() {
    return html`
      <button
        type="button"
        aria-pressed=${this.checked ? "true" : "false"}
        title=${this.hint || this.label}
        @click=${
          // oxlint-disable-next-line typescript/unbound-method -- Lit calls event handlers with the host as this.
          this.toggle
        }
      >
        <span>${this.label}</span>
        <span class="state" aria-hidden="true"></span>
      </button>
    `;
  }
}

customElements.define("setting-tile", SettingTile);

declare global {
  interface HTMLElementTagNameMap {
    "setting-tile": SettingTile;
  }
}
