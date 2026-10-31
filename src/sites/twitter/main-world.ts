import { ENTRY_ATTRIBUTE, TIMELINE_ATTRIBUTE } from "./attributes.js";

interface Fiber {
  key: string | null;
  return: Fiber | null;
}

// Timeline cells and Home tabs carry their React key within a few fibers of
// the DOM node; anything further up belongs to the surrounding list.
const MAX_FIBER_DEPTH = 10;

let tagQueued = false;

function isFiber(value: unknown): value is Fiber {
  return value instanceof Object && "key" in value && "return" in value;
}

function getReactKey(element: Element) {
  let fiber: unknown = Object.entries(element).find(([property]) =>
    property.startsWith("__reactFiber$")
  )?.[1];

  for (let depth = 0; depth < MAX_FIBER_DEPTH && isFiber(fiber); depth++) {
    if (fiber.key !== null) {
      return fiber.key;
    }

    fiber = fiber.return;
  }

  return null;
}

// Drop the IDs so "promoted-tweet-123-abc" becomes "promoted-tweet" and
// "Tag:123" becomes "Tag".
function getKind(element: Element) {
  return getReactKey(element)?.replace(/[-:]\d.*$/, "") ?? null;
}

function tag(elements: Iterable<Element>, attribute: string) {
  for (const element of elements) {
    const kind = getKind(element);

    if (kind !== null && element.getAttribute(attribute) !== kind) {
      element.setAttribute(attribute, kind);
    }
  }
}

function tagAll() {
  tagQueued = false;
  tag(document.querySelectorAll('[data-testid="cellInnerDiv"]'), ENTRY_ATTRIBUTE);
  tag(
    document.querySelectorAll(
      '[data-testid="primaryColumn"] [role="tablist"] [role="tab"]'
    ),
    TIMELINE_ATTRIBUTE
  );
}

new MutationObserver(() => {
  if (tagQueued) {
    return;
  }

  tagQueued = true;
  requestAnimationFrame(tagAll);
}).observe(document, { childList: true, subtree: true });
