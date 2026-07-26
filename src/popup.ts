import "@awesome.me/webawesome/dist/components/callout/callout.js";
import "@awesome.me/webawesome/dist/components/accordion/accordion.js";
import { css, html, LitElement } from "lit";
import "./components/site-settings.js";
import type { SettingChangeDetail } from "./components/setting-switch.js";
import { SITE_SETTINGS } from "./popup-settings.js";
import "./popup.css";
import {
  ALL_SETTINGS,
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  type Settings
} from "./settings.js";

const DEFAULT_SETTINGS = getDefaultSettings(
  ALL_SETTINGS
);

class SiteDeflufferPopup extends LitElement {
  static properties = {
    settings: { state: true },
    error: { state: true },
    openSite: { state: true }
  };

  static styles = css`
    :host {
      display: block;
      min-width: 360px;
      max-height: 600px;
      overflow-y: auto;
    }

    main {
      padding: 18px;
    }

    h1 {
      margin: 2px 0 0;
      font-size: 22px;
      font-weight: 600;
    }

    .intro {
      margin: 8px 0 0;
      color: var(--wa-color-text-quiet);
    }

    .sites {
      margin-top: 14px;
    }

    wa-accordion {
      display: grid;
      gap: 14px;
    }

    wa-accordion-item {
      --spacing: 14px;
      --show-duration: 180ms;
      --hide-duration: 180ms;
      background: var(--wa-color-neutral-fill-quiet);
      border: var(--wa-panel-border-width) var(--wa-panel-border-style)
        var(--wa-color-neutral-border-quiet);
      border-radius: var(--wa-border-radius-l);
      overflow: hidden;
    }

    wa-accordion-item::part(label) {
      color: var(--wa-color-text-quiet);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    wa-accordion-item::part(content) {
      padding-block: 0;
    }

    wa-callout {
      margin-top: 14px;
    }

    @media (prefers-reduced-motion: reduce) {
      wa-accordion-item {
        --show-duration: 0ms;
        --hide-duration: 0ms;
      }
    }
  `;

  declare private settings: Settings;
  declare private error: string;
  declare private openSite: string;

  constructor() {
    super();
    this.settings = DEFAULT_SETTINGS;
    this.error = "";
    this.openSite = "";
  }

  private readonly handleStorageChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ) => {
    if (areaName !== "local") {
      return;
    }

    const nextSettings = applyStorageChanges(
      ALL_SETTINGS,
      this.settings,
      changes
    );

    if (nextSettings) {
      this.settings = nextSettings;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    chrome.storage.onChanged.addListener(this.handleStorageChange);
    this.loadSettings();
  }

  disconnectedCallback() {
    chrome.storage.onChanged.removeListener(this.handleStorageChange);
    super.disconnectedCallback();
  }

  private loadSettings() {
    chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
      if (chrome.runtime.lastError) {
        this.error =
          chrome.runtime.lastError.message || "Failed to load settings.";
        return;
      }

      this.settings = decodeSettings(ALL_SETTINGS, result);
      this.error = "";
    });
  }

  private handleSettingChange(event: CustomEvent<SettingChangeDetail>) {
    const { key, checked } = event.detail;

    const previousValue = this.settings[key];
    this.settings = { ...this.settings, [key]: checked };
    this.error = "";

    chrome.storage.local.set({ [key]: checked }, () => {
      if (!chrome.runtime.lastError) {
        return;
      }

      this.settings = { ...this.settings, [key]: previousValue };
      this.error =
        chrome.runtime.lastError.message || "Failed to save setting.";
    });
  }

  private handleAccordionExpand(
    event: CustomEvent<{ item: HTMLElement & { label: string } }>
  ) {
    this.openSite = event.detail.item.label;
  }

  private handleAccordionCollapse(
    event: CustomEvent<{ item: HTMLElement & { label: string } }>
  ) {
    if (event.detail.item.label === this.openSite) {
      this.openSite = "";
    }
  }

  render() {
    return html`
      <main>
        <h1>Site Defluffer</h1>
        <p class="intro">Remove the fluff from supported sites.</p>

        <wa-accordion
          class="sites"
          mode="single-collapsible"
          heading-level="2"
          appearance="plain"
          @wa-expand=${this.handleAccordionExpand}
          @wa-collapse=${this.handleAccordionCollapse}
        >
          ${SITE_SETTINGS.map(
            (site) => html`
              <wa-accordion-item
                label=${site.name}
                ?expanded=${this.openSite === site.name}
              >
                <site-settings
                  .settings=${site.settings}
                  .values=${this.settings}
                  @setting-change=${this.handleSettingChange}
                ></site-settings>
              </wa-accordion-item>
            `
          )}
        </wa-accordion>

        ${this.error
          ? html`<wa-callout variant="danger" appearance="outlined">
              ${this.error}
            </wa-callout>`
          : null}
      </main>
    `;
  }
}

customElements.define("site-defluffer-popup", SiteDeflufferPopup);

declare global {
  interface HTMLElementTagNameMap {
    "site-defluffer-popup": SiteDeflufferPopup;
  }
}
