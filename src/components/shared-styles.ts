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
 * Styles the popup's own components share: type, icons, tiles and the site
 * cards. Buttons, switches, chips and the other controls are Groundwork's.
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
`;
