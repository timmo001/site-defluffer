import { css, html, LitElement } from "lit";
import type { SettingChangeDetail } from "./components/setting-change.js";
import "./components/site-settings.js";
import {
  countOn,
  getSwitchKeys,
  SITE_SETTINGS,
  type PopupSiteDefinition
} from "./popup-settings.js";
import "./popup.css";
import {
  ALL_SETTINGS,
  applyStorageChanges,
  decodeSettings,
  getDefaultSettings,
  type Settings
} from "./settings.js";

const DEFAULT_SETTINGS = getDefaultSettings(ALL_SETTINGS);

const SITES: readonly PopupSiteDefinition[] = SITE_SETTINGS;

const BACK_ICON = html`<svg viewBox="0 0 16 16" aria-hidden="true">
  <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

class SiteDeflufferPopup extends LitElement {
  static properties = {
    settings: { state: true },
    error: { state: true },
    siteName: { state: true }
  };

  static styles = css`
    :host {
      display: block;
      max-height: 600px;
      overflow-y: auto;
    }

    /* Wider than any popup can be, so the page is open in a tab. */
    @media (min-width: 801px) {
      :host {
        max-height: none;
      }

      main {
        max-width: 1000px;
        margin-inline: auto;
      }
    }

    main {
      padding: 0 20px 20px;
    }

    .bar {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-inline: -20px;
      padding: 16px 20px 14px;
      background: var(--sd-bg);
    }

    .titles {
      flex: 1;
      min-width: 0;
    }

    h1,
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 650;
      letter-spacing: -0.01em;
    }

    .subtitle {
      margin: 1px 0 0;
      color: var(--sd-text-quiet);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    button {
      color: inherit;
      font: inherit;
      background: none;
      border: 0;
      cursor: pointer;
    }

    button:focus-visible {
      outline: 2px solid var(--sd-accent);
      outline-offset: 2px;
    }

    svg {
      display: block;
      width: 16px;
      height: 16px;
    }

    .back {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      margin-left: -6px;
      border-radius: 10px;
    }

    .back:hover {
      background: var(--sd-surface);
    }

    .power {
      position: relative;
      flex: none;
      width: 36px;
      height: 20px;
      background: var(--sd-border-strong);
      border-radius: 10px;
      transition: background 120ms;
    }

    .power::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 14px;
      height: 14px;
      background: var(--sd-bg);
      border-radius: 50%;
      transition: transform 120ms;
    }

    .power[aria-pressed="true"] {
      background: var(--sd-accent);
    }

    .power[aria-pressed="true"]::after {
      transform: translateX(16px);
    }

    .sites {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
      margin-top: 4px;
    }

    .site {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 14px;
      background: var(--sd-surface);
      border: 1px solid var(--sd-border);
      border-radius: 12px;
      transition: border-color 120ms;
    }

    .site:hover {
      border-color: var(--sd-border-strong);
    }

    .site .open {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
      padding: 12px 0 12px 14px;
      text-align: start;
    }

    .site .name {
      font-weight: 600;
    }

    .site .summary {
      color: var(--sd-text-quiet);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .site:not(.on) .name {
      color: var(--sd-text-quiet);
    }

    site-settings {
      margin-top: 6px;
      transition: opacity 120ms;
    }

    site-settings.off {
      opacity: 0.45;
    }

    .error {
      margin: 16px 0 0;
      padding: 10px 12px;
      color: var(--sd-danger);
      border: 1px solid currentColor;
      border-radius: 10px;
    }

    @media (prefers-reduced-motion: reduce) {
      .power,
      .power::after,
      .site,
      site-settings {
        transition: none;
      }
    }
  `;

  declare private settings: Settings;
  declare private error: string;
  declare private siteName: string;

  constructor() {
    super();
    this.settings = DEFAULT_SETTINGS;
    this.error = "";
    this.siteName = "";
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

  private readonly handleKeydown = (event: KeyboardEvent) => {
    if (this.siteName && event.altKey && event.key === "ArrowLeft") {
      event.preventDefault();
      this.siteName = "";
    }
  };

  connectedCallback() {
    super.connectedCallback();
    chrome.storage.onChanged.addListener(this.handleStorageChange);
    this.addEventListener("keydown", this.handleKeydown);
    this.loadSettings();
    this.openCurrentSite();
  }

  disconnectedCallback() {
    chrome.storage.onChanged.removeListener(this.handleStorageChange);
    this.removeEventListener("keydown", this.handleKeydown);
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

  // activeTab exposes the tab's URL only once the popup is opened from it.
  private openCurrentSite() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;

      if (!url || chrome.runtime.lastError) {
        return;
      }

      const { hostname } = new URL(url);
      const site = SITES.find((candidate) => candidate.hosts.includes(hostname));

      if (site) {
        this.siteName = site.name;
      }
    });
  }

  private saveSettings(values: SettingChangeDetail["values"]) {
    const previousSettings = this.settings;
    this.settings = decodeSettings(ALL_SETTINGS, { ...this.settings, ...values });
    this.error = "";

    chrome.storage.local.set(values, () => {
      if (!chrome.runtime.lastError) {
        return;
      }

      this.settings = previousSettings;
      this.error =
        chrome.runtime.lastError.message || "Failed to save settings.";
    });
  }

  private handleSettingChange(event: CustomEvent<SettingChangeDetail>) {
    this.saveSettings(event.detail.values);
  }

  private isOn(site: PopupSiteDefinition) {
    return this.settings[site.enabled] === true;
  }

  private renderPowerButton(site: PopupSiteDefinition) {
    const on = this.isOn(site);

    return html`
      <button
        class="power"
        type="button"
        aria-pressed=${on ? "true" : "false"}
        aria-label="Site Defluffer on ${site.name}"
        title="${on ? "Turn off" : "Turn on"} for ${site.name} (Alt+Shift+T)"
        @click=${() => {
          this.saveSettings({ [site.enabled]: !on });
        }}
      >
</button>
    `;
  }

  private renderSummary(site: PopupSiteDefinition) {
    if (!this.isOn(site)) {
      return "Off";
    }

    const switchKeys = getSwitchKeys(site.settings);

    return `${countOn(switchKeys, this.settings)} of ${switchKeys.length} on`;
  }

  private renderHome() {
    return html`
      <div class="bar">
        <div class="titles">
          <h1>Site Defluffer</h1>
          <p class="subtitle">Pick a site to tune what gets hidden.</p>
        </div>
      </div>
      <div class="sites">
        ${SITES.map(
          (site) => html`
            <div class="site ${this.isOn(site) ? "on" : ""}">
              <button
                class="open"
                type="button"
                @click=${() => {
                  this.siteName = site.name;
                }}
              >
                <span class="name">${site.name}</span>
                <span class="summary">${this.renderSummary(site)}</span>
              </button>
              ${this.renderPowerButton(site)}
            </div>
          `
        )}
      </div>
    `;
  }

  private renderSite(site: PopupSiteDefinition) {
    return html`
      <div class="bar">
        <button
          class="back"
          type="button"
          title="All sites (Alt+Left)"
          aria-label="Back to all sites"
          @click=${() => {
            this.siteName = "";
          }}
        >
          ${BACK_ICON}
        </button>
        <div class="titles">
          <h2>${site.name}</h2>
          <p class="subtitle">${this.renderSummary(site)}</p>
        </div>
        ${this.renderPowerButton(site)}
      </div>
      <site-settings
        class=${this.isOn(site) ? "" : "off"}
        .settings=${site.settings}
        .values=${this.settings}
        @setting-change=${
          // oxlint-disable-next-line typescript/unbound-method -- Lit calls event handlers with the host as this.
          this.handleSettingChange
        }
      ></site-settings>
    `;
  }

  render() {
    const site = SITES.find((candidate) => candidate.name === this.siteName);

    return html`
      <main>
        ${site ? this.renderSite(site) : this.renderHome()}
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : null}
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
