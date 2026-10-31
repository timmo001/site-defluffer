import { css, html, LitElement } from "lit";
import type { PopupSettingChoice } from "../popup-settings.js";
import type { SettingKey } from "../settings.js";
import { dispatchSettingChange } from "./setting-change.js";
import { shared } from "./shared-styles.js";

/**
 * A group of pill segments with one chosen, after System Bridge's
 * `sb-segmented`. Arrow keys move between segments and choose as they go.
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
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: var(--sd-space-2) var(--sd-space-4);
      }

      .label {
        font-size: var(--sd-font-size-s);
        font-weight: var(--sd-font-weight-medium);
      }

      .group {
        display: inline-flex;
        gap: var(--sd-space-0-5);
        padding: var(--sd-space-0-5);
        background: var(--sd-color-sunken);
        border: 1px solid var(--sd-color-border);
        border-radius: var(--sd-radius-pill);
      }

      .segment {
        min-height: 1.875rem;
        min-width: 2.5rem;
        padding: 0 var(--sd-space-3);
        font: inherit;
        font-size: var(--sd-font-size-xs);
        font-weight: var(--sd-font-weight-medium);
        color: var(--sd-color-muted);
        white-space: nowrap;
        cursor: pointer;
        background: none;
        border: 0;
        border-radius: var(--sd-radius-pill);
        transition:
          background var(--sd-duration-fast) var(--sd-easing),
          color var(--sd-duration-fast) var(--sd-easing);
      }

      .segment:hover {
        color: var(--sd-color-text);
      }

      .segment[aria-checked="true"] {
        color: var(--sd-color-on-accent);
        background: var(--sd-color-accent);
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

  private choose(value: string) {
    if (value !== this.value) {
      dispatchSettingChange(this, { [this.settingKey]: value });
    }
  }

  private readonly handleKeydown = (event: KeyboardEvent) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;

    if (step === 0) {
      return;
    }

    event.preventDefault();
    // Keep Alt+Left for going back to every site.
    event.stopPropagation();

    const index = this.choices.findIndex((choice) => choice.value === this.value);
    const next = this.choices.at((index + step) % this.choices.length);

    if (!next) {
      return;
    }

    this.choose(next.value);
    void this.updateComplete.then(() => {
      const segment = this.renderRoot.querySelector(
        `[data-value="${CSS.escape(next.value)}"]`
      );

      if (segment instanceof HTMLElement) {
        segment.focus();
      }
    });
  };

  render() {
    return html`
      <span class="label" id="label">${this.label}</span>
      <div
        class="group"
        role="radiogroup"
        aria-labelledby="label"
        @keydown=${this.handleKeydown}
      >
        ${this.choices.map((choice) => {
          const chosen = choice.value === this.value;

          return html`
            <button
              class="segment"
              type="button"
              role="radio"
              data-value=${choice.value}
              aria-checked=${chosen ? "true" : "false"}
              tabindex=${chosen ? 0 : -1}
              title=${choice.hint ?? choice.label}
              @click=${() => {
                this.choose(choice.value);
              }}
            >
              ${choice.label}
            </button>
          `;
        })}
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
