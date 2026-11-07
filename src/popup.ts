import { mdiBroom, mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import "@timmo001/groundwork-ui/define/gw-alert.ts";
import "@timmo001/groundwork-ui/define/gw-button.ts";
import "@timmo001/groundwork-ui/define/gw-checkbox.ts";
import { GwSwitch } from "@timmo001/groundwork-ui/gw-checkbox.ts";
import "@timmo001/groundwork-ui/define/gw-chip.ts";
import "@timmo001/groundwork-ui/define/gw-page-header.ts";
import "@timmo001/groundwork-ui/define/gw-theme-picker.ts";
import { GwThemePicker } from "@timmo001/groundwork-ui/gw-theme-picker.ts";
import { css, html, LitElement, nothing } from "lit";
import { ref } from "lit/directives/ref.js";
import type { SettingChangeDetail } from "./components/setting-change.js";
import { icon, shared } from "./components/shared-styles.js";
import "./components/site-settings.js";
import {
  countOn,
  getDefaultChanges,
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
import { bindThemePicker } from "./theme.js";

const DEFAULT_SETTINGS = getDefaultSettings(ALL_SETTINGS);

const SITES: readonly PopupSiteDefinition[] = SITE_SETTINGS;

class SiteDeflufferPopup extends LitElement {
  static properties = {
    settings: { state: true },
    error: { state: true },
    siteName: { state: true },
    confirmReset: { state: true }
  };

  static styles = [
    shared,
    css`
      :host {
        display: block;
        max-height: var(--sd-popup-height);
        overflow-y: auto;
        /* Groundwork's scrollbar edges, so the thumb squares off at the ends */
        animation: gw-scrollbar-edges-y linear both;
        animation-timeline: scroll(self y);
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

      /* Stays in view while the options scroll */
      .page-header {
        position: sticky;
        top: 0;
        z-index: 1;
        margin-inline: calc(-1 * var(--sd-space-5));
        padding: var(--sd-space-4) var(--sd-space-5);
        background: var(--sd-color-bg);
      }

      .page-header.off::part(tile) {
        color: var(--gw-color-text-secondary);
        background: var(--gw-color-fill-neutral-resting);
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
  declare private confirmReset: boolean;

  constructor() {
    super();
    this.settings = DEFAULT_SETTINGS;
    this.error = "";
    this.siteName = "";
    this.confirmReset = false;
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

  // Unbinds the header's theme picker when the view changes
  private unbindTheme: (() => void) | undefined;

  private readonly bindPicker = (element: Element | undefined) => {
    this.unbindTheme?.();
    this.unbindTheme = undefined;

    if (element instanceof GwThemePicker) {
      this.unbindTheme = bindThemePicker(element);
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

  private renderSwitch(site: PopupSiteDefinition, slot?: string) {
    return html`
      <gw-switch
        slot=${slot ?? nothing}
        label="Site Defluffer on ${site.name}"
        label-hidden
        title="Turn ${site.name} on or off (Alt+Shift+T on the site)"
        .checked=${this.isOn(site)}
        @change=${(event: Event) => {
          if (event.currentTarget instanceof GwSwitch) {
            this.saveSettings({ [site.enabled]: event.currentTarget.checked });
          }
        }}
      ></gw-switch>
    `;
  }

  private renderSummary(site: PopupSiteDefinition) {
    if (!this.isOn(site)) {
      return "Off";
    }

    const switchKeys = getSwitchKeys(site.settings);

    return `${countOn(switchKeys, this.settings)} of ${switchKeys.length} on`;
  }

  // Resets every site, so the first click only asks to be sure.
  private renderResetAllButton() {
    const changes = getDefaultChanges(
      ALL_SETTINGS.map((setting) => setting.key),
      this.settings
    );

    const count = Object.keys(changes).length;

    return html`
      <gw-button
        slot="actions"
        size="small"
        variant=${this.confirmReset ? "danger" : "neutral"}
        appearance=${this.confirmReset ? "filled" : "plain"}
        title="Reset every site to its defaults"
        ?disabled=${count === 0}
        @click=${() => {
          if (this.confirmReset) {
            this.confirmReset = false;
            this.saveSettings(changes);
          } else {
            this.confirmReset = true;
          }
        }}
        @blur=${() => {
          this.confirmReset = false;
        }}
      >
        ${this.confirmReset
          ? `Reset ${count} ${count === 1 ? "change" : "changes"}?`
          : "Reset to default"}
      </gw-button>
    `;
  }

  private renderHome() {
    return html`
      <gw-page-header
        class="page-header"
        heading="Site Defluffer"
        description="Pick a site to tune what gets hidden."
        icon=${mdiBroom}
      >
        ${this.renderResetAllButton()}
        <gw-theme-picker slot="actions" ${ref(this.bindPicker)}></gw-theme-picker>
      </gw-page-header>
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
                  <gw-chip
                    class="tabular"
                    size="small"
                    tone=${this.isOn(site) ? "accent" : "neutral"}
                  >
                    ${this.renderSummary(site)}
                  </gw-chip>
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
      <gw-page-header
        class="page-header tabular ${this.isOn(site) ? "" : "off"}"
        heading=${site.name}
        description=${this.renderSummary(site)}
        icon=${site.icon}
      >
        <gw-button
          slot="start"
          variant="neutral"
          appearance="plain"
          labels="hide"
          icon=${mdiChevronLeft}
          title="All sites (Alt+Left)"
          @click=${() => {
            this.siteName = "";
          }}
        >
          Back to all sites
        </gw-button>
        ${this.renderSwitch(site, "actions")}
      </gw-page-header>
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
        ${this.error
          ? html`<gw-alert tone="danger" urgent>${this.error}</gw-alert>`
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
