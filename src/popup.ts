import { mdiBroom, mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { css, html, LitElement } from "lit";
import type { SettingChangeDetail } from "./components/setting-change.js";
import { icon, shared } from "./components/shared-styles.js";
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

class SiteDeflufferPopup extends LitElement {
  static properties = {
    settings: { state: true },
    error: { state: true },
    siteName: { state: true }
  };

  static styles = [
    shared,
    css`
      :host {
        display: block;
        max-height: var(--sd-popup-height);
        overflow-y: auto;
      }

      /* Wider than any popup can be, so the page is open in a tab. */
      @media (min-width: 801px) {
        :host {
          max-height: none;
        }

        main {
          max-width: 64rem;
          margin-inline: auto;
        }
      }

      main {
        display: flex;
        flex-direction: column;
        gap: var(--sd-space-4);
        padding: 0 var(--sd-space-5) var(--sd-space-5);
      }

      /* After System Bridge's page header: a tile, the titles, then actions
         at the top right. Stays in view while the options scroll. */
      .page-header {
        position: sticky;
        top: 0;
        z-index: 1;
        margin-inline: calc(-1 * var(--sd-space-5));
        padding: var(--sd-space-4) var(--sd-space-5);
        background: var(--sd-color-bg);
        --sd-row-gap: var(--sd-space-3);
      }

      .page-header .titles {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: var(--sd-space-0-5);
        min-width: 0;
      }

      .description {
        font-size: var(--sd-font-size-s);
      }

      .sites {
        --sd-grid-min: 18rem;
      }

      .site {
        flex-direction: row;
        align-items: center;
        gap: var(--sd-space-3);
        padding: 0 var(--sd-space-4) 0 0;
        transition: border-color var(--sd-duration-fast) var(--sd-easing);
      }

      .site:hover {
        border-color: color-mix(
          in oklab,
          var(--sd-color-accent) 50%,
          var(--sd-color-border)
        );
      }

      .open {
        display: flex;
        flex: 1;
        align-items: center;
        gap: var(--sd-space-3);
        min-width: 0;
        padding: var(--sd-space-3) 0 var(--sd-space-3) var(--sd-space-3);
        font: inherit;
        color: inherit;
        text-align: start;
        cursor: pointer;
        background: none;
        border: 0;
        border-radius: var(--sd-radius-l);
      }

      .open .titles {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--sd-space-1);
        min-width: 0;
      }

      .name {
        font-weight: var(--sd-font-weight-semibold);
      }

      .chevron {
        color: var(--sd-color-muted);
      }

      .error {
        padding: var(--sd-space-3) var(--sd-space-4);
        font-size: var(--sd-font-size-s);
        color: var(--sd-color-danger);
        background: var(--sd-color-danger-soft);
        border-radius: var(--sd-radius-m);
      }

      site-settings {
        transition: opacity var(--sd-duration-fast) var(--sd-easing);
      }

      site-settings.off {
        opacity: 0.5;
      }
    `
  ];

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

  private renderSwitch(site: PopupSiteDefinition) {
    return html`
      <input
        class="switch"
        type="checkbox"
        aria-label="Site Defluffer on ${site.name}"
        title="Turn ${site.name} on or off (Alt+Shift+T on the site)"
        .checked=${this.isOn(site)}
        @change=${(event: Event) => {
          if (event.currentTarget instanceof HTMLInputElement) {
            this.saveSettings({ [site.enabled]: event.currentTarget.checked });
          }
        }}
      />
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
      <header class="page-header row">
        <span class="tile">${icon(mdiBroom)}</span>
        <div class="titles">
          <h1>Site Defluffer</h1>
          <p class="description muted">Pick a site to tune what gets hidden.</p>
        </div>
      </header>
      <div class="grid sites">
        ${SITES.map(
          (site) => html`
            <div class="card site">
              <button
                class="open"
                type="button"
                @click=${() => {
                  this.siteName = site.name;
                }}
              >
                <span class="tile ${this.isOn(site) ? "" : "off"}">
                  ${icon(site.icon)}
                </span>
                <span class="titles">
                  <span class="name truncate">${site.name}</span>
                  <span class="chip tabular ${this.isOn(site) ? "accent" : ""}">
                    ${this.renderSummary(site)}
                  </span>
                </span>
                <span class="chevron">${icon(mdiChevronRight)}</span>
              </button>
              ${this.renderSwitch(site)}
            </div>
          `
        )}
      </div>
    `;
  }

  private renderSite(site: PopupSiteDefinition) {
    return html`
      <header class="page-header row">
        <button
          class="button plain icon-only round"
          type="button"
          title="All sites (Alt+Left)"
          aria-label="Back to all sites"
          @click=${() => {
            this.siteName = "";
          }}
        >
          ${icon(mdiChevronLeft)}
        </button>
        <span class="tile ${this.isOn(site) ? "" : "off"}">${icon(site.icon)}</span>
        <div class="titles">
          <h1>${site.name}</h1>
          <p class="description muted tabular">${this.renderSummary(site)}</p>
        </div>
        ${this.renderSwitch(site)}
      </header>
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
