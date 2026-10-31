import { css, html, svg } from "lit";

/** A Material Design icon, from one of `@mdi/js`'s paths. */
export const icon = (path: string, label?: string) =>
  html`<svg
    class="icon"
    viewBox="0 0 24 24"
    role=${label === undefined ? "presentation" : "img"}
    aria-hidden=${label === undefined ? "true" : "false"}
    aria-label=${label ?? ""}
  >
    ${svg`<path d=${path}></path>`}
  </svg>`;

/**
 * Styles every component shares, after System Bridge's web client: type,
 * icons, buttons, switches, cards and chips. Buttons and switches are native
 * elements with classes, so focus and keyboard behaviour work as the browser
 * intends.
 */
export const shared = css`
  :host {
    font-family: var(--sd-font-body);
    color: var(--sd-color-text);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  [hidden] {
    display: none !important;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  h1 {
    font-size: var(--sd-font-size-xl);
    font-weight: var(--sd-font-weight-semibold);
    line-height: var(--sd-line-height-condensed);
  }

  h2 {
    font-size: var(--sd-font-size-l);
    font-weight: var(--sd-font-weight-semibold);
    line-height: var(--sd-line-height-condensed);
  }

  h3 {
    font-size: var(--sd-font-size-m);
    font-weight: var(--sd-font-weight-semibold);
    line-height: var(--sd-line-height-condensed);
  }

  .muted {
    color: var(--sd-color-muted);
  }

  .tabular {
    font-variant-numeric: tabular-nums;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row {
    display: flex;
    align-items: center;
    gap: var(--sd-row-gap, var(--sd-space-2));
  }

  .grid {
    display: grid;
    gap: var(--sd-grid-gap, var(--sd-space-3));
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(100%, var(--sd-grid-min, 13rem)), 1fr)
    );
  }

  .icon {
    flex: none;
    width: var(--sd-icon-size, 1.25rem);
    height: var(--sd-icon-size, 1.25rem);
    fill: currentColor;
  }

  :focus-visible {
    outline: 2px solid var(--sd-color-focus);
    outline-offset: 2px;
  }

  /* An icon in a tinted square, beside a heading */
  .tile {
    display: grid;
    flex: none;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    color: var(--sd-tile-color, var(--sd-color-accent));
    background: color-mix(
      in oklab,
      var(--sd-tile-color, var(--sd-color-accent)) 14%,
      transparent
    );
    border-radius: var(--sd-radius-m);
    --sd-icon-size: 1.375rem;
  }

  .tile.small {
    width: 2rem;
    height: 2rem;
    --sd-icon-size: 1.125rem;
  }

  .tile.off {
    --sd-tile-color: var(--sd-color-muted);
  }

  /* Buttons */
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--sd-space-2);
    min-height: 2.25rem;
    padding: 0 var(--sd-space-4);
    font: inherit;
    font-size: var(--sd-font-size-s);
    font-weight: var(--sd-font-weight-medium);
    line-height: 1;
    color: var(--sd-color-text);
    white-space: nowrap;
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

  .button:hover {
    background: color-mix(in oklab, var(--sd-color-raised), var(--sd-color-text) 6%);
  }

  .button.plain {
    background: transparent;
    border-color: transparent;
  }

  .button.plain:hover {
    background: var(--sd-color-hover);
  }

  .button.small {
    min-height: 1.875rem;
    padding: 0 var(--sd-space-3);
    font-size: var(--sd-font-size-xs);
    --sd-icon-size: 1rem;
  }

  /* Always square, so a round one is a circle */
  .button.icon-only {
    width: 2.25rem;
    min-height: 0;
    aspect-ratio: 1;
    padding: 0;
  }

  .button.round {
    border-radius: var(--sd-radius-pill);
  }

  /* A checkbox drawn as a switch */
  .switch {
    appearance: none;
    position: relative;
    flex: none;
    width: 2.5rem;
    height: 1.5rem;
    margin: 0;
    cursor: pointer;
    background: var(--sd-color-sunken);
    border: 1px solid var(--sd-color-border);
    border-radius: var(--sd-radius-pill);
    transition: background var(--sd-duration-fast) var(--sd-easing);
  }

  .switch::after {
    content: "";
    position: absolute;
    top: 0.1875rem;
    left: 0.1875rem;
    width: 1rem;
    height: 1rem;
    background: var(--sd-color-muted);
    border-radius: 50%;
    transition:
      translate var(--sd-duration-fast) var(--sd-easing),
      background var(--sd-duration-fast) var(--sd-easing);
  }

  .switch:checked {
    background: var(--sd-color-accent);
    border-color: transparent;
  }

  .switch:checked::after {
    translate: 1rem 0;
    background: var(--sd-color-on-accent);
  }

  /* Cards */
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--sd-space-3);
    padding: var(--sd-space-4);
    background: var(--sd-color-surface);
    border: 1px solid var(--sd-color-border);
    border-radius: var(--sd-radius-l);
  }

  /* Chips */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--sd-space-1-5);
    min-height: 1.5rem;
    padding: 0 var(--sd-space-2);
    font-size: var(--sd-font-size-xs);
    font-weight: var(--sd-font-weight-medium);
    white-space: nowrap;
    color: var(--sd-chip-color, var(--sd-color-text));
    background: color-mix(
      in oklab,
      var(--sd-chip-color, var(--sd-color-muted)) 14%,
      transparent
    );
    border-radius: var(--sd-radius-pill);
  }

  .chip.accent {
    --sd-chip-color: var(--sd-color-accent);
  }

  .section-title {
    font-size: var(--sd-font-size-xs);
    font-weight: var(--sd-font-weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--sd-color-muted);
  }
`;
