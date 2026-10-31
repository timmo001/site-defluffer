import { mdiCheckCircle, mdiCircleOutline } from "@mdi/js";
import { css, html, LitElement } from "lit";
import type { SettingKey } from "../settings.js";
import { dispatchSettingChange } from "./setting-change.js";
import { icon, shared } from "./shared-styles.js";

/** A toggle button for one setting, pressed while it's on. */
export class SettingTile extends LitElement {
  static properties = {
    settingKey: { attribute: "setting-key" },
    label: {},
    hint: {},
    checked: { type: Boolean }
  };

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }

      button {
        display: flex;
        align-items: center;
        gap: var(--sd-space-2);
        width: 100%;
        height: 100%;
        min-height: 2.5rem;
        padding: var(--sd-space-1-5) var(--sd-space-3);
        font: inherit;
        font-size: var(--sd-font-size-s);
        font-weight: var(--sd-font-weight-medium);
        line-height: var(--sd-line-height-condensed);
        color: var(--sd-color-muted);
        text-align: start;
        cursor: pointer;
        background: var(--sd-color-raised);
        border: 1px solid var(--sd-color-border);
        border-radius: var(--sd-radius-m);
        transition:
          background var(--sd-duration-fast) var(--sd-easing),
          border-color var(--sd-duration-fast) var(--sd-easing),
          color var(--sd-duration-fast) var(--sd-easing);
        --sd-icon-size: 1.125rem;
      }

      button:hover {
        background: color-mix(
          in oklab,
          var(--sd-color-raised),
          var(--sd-color-text) 6%
        );
      }

      button[aria-pressed="true"] {
        color: var(--sd-color-text);
        background: var(--sd-color-accent-soft);
        border-color: color-mix(
          in oklab,
          var(--sd-color-accent) 40%,
          transparent
        );
      }

      button[aria-pressed="true"] .icon {
        color: var(--sd-color-accent);
      }
    `
  ];

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
        ${icon(this.checked ? mdiCheckCircle : mdiCircleOutline)}
        <span>${this.label}</span>
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
