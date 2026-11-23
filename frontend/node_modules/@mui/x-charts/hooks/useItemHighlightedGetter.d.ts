/**
 * A hook to check the highlighted state of multiple items.
 * If you're interested by a single one, consider using `useItemHighlighted`.
 *
 * Warning: highlighted and faded can both be true at the same time.
 * We recommend to first test if item is highlighted: `const faded = !highlighted && isFaded(item)`
 * @returns {{ isHighlighted, isFaded }} callbacks to get the state of the item.
 */
export declare function useItemHighlightedGetter(): {
  isHighlighted: (item: import("../index.js").HighlightItemData | null) => boolean;
  isFaded: (item: import("../index.js").HighlightItemData | null) => boolean;
};