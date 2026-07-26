export const NARROW_SCROLLBAR_CLASS = "site-defluffer-narrow-scrollbar";

export const WINDOW_SCROLLBAR_STYLES = `
html.${NARROW_SCROLLBAR_CLASS} {
  scrollbar-color: #444 transparent !important;
  scrollbar-width: thin !important;
}

html.${NARROW_SCROLLBAR_CLASS}::-webkit-scrollbar {
  width: 8px !important;
}

html.${NARROW_SCROLLBAR_CLASS}::-webkit-scrollbar-thumb {
  background: #444 !important;
  border-radius: 4px !important;
}
`;
