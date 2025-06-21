import { pathToRegexp } from 'path-to-regexp';
import invariant from 'invariant';
export const getItemKind = item => item.kind ?? 'page';
export const isPageItem = item => getItemKind(item) === 'page';
export const getItemTitle = item => {
  return isPageItem(item) ? item.title ?? item.segment ?? '' : item.title;
};

/**
 * Builds a map of navigation page items to their respective paths. This map is used to quickly
 * lookup the path of a navigation item. It will be cached for the lifetime of the navigation.
 */
function buildItemToPathMap(navigation) {
  const map = new Map();
  const visit = (item, base) => {
    if (isPageItem(item)) {
      // Append segment to base path. Make sure to always have an initial slash, and slashes between segments.
      const path = `${base.startsWith('/') ? base : `/${base}`}${base && base !== '/' && item.segment ? '/' : ''}${item.segment || ''}` || '/';
      map.set(item, path);
      if (item.children) {
        for (const child of item.children) {
          visit(child, path);
        }
      }
    }
  };
  for (const item of navigation) {
    visit(item, '');
  }
  return map;
}
const itemToPathMapCache = new WeakMap();

/**
 * Gets the cached map of navigation page items to their respective paths.
 */
function getItemToPathMap(navigation) {
  let map = itemToPathMapCache.get(navigation);
  if (!map) {
    map = buildItemToPathMap(navigation);
    itemToPathMapCache.set(navigation, map);
  }
  return map;
}

/**
 * Build a lookup map of paths to navigation items. This map is used to match paths against
 * to find the active page.
 */
function buildItemLookup(navigation) {
  const map = new Map();
  const visit = item => {
    if (isPageItem(item)) {
      const path = getItemPath(navigation, item);
      if (map.has(path)) {
        console.warn(`Duplicate path in navigation: ${path}`);
      }
      map.set(path, item);
      if (item.pattern) {
        const basePath = item.segment ? path.slice(0, -item.segment.length) : path;
        map.set(pathToRegexp(basePath + item.pattern), item);
      }
      if (item.children) {
        for (const child of item.children) {
          visit(child);
        }
      }
    }
  };
  for (const item of navigation) {
    visit(item);
  }
  return map;
}
const itemLookupMapCache = new WeakMap();
function getItemLookup(navigation) {
  let map = itemLookupMapCache.get(navigation);
  if (!map) {
    map = buildItemLookup(navigation);
    itemLookupMapCache.set(navigation, map);
  }
  return map;
}

/**
 * Matches a path against the navigation to find the active page. i.e. the page that should be
 * marked as selected in the navigation.
 */
export function matchPath(navigation, path) {
  const lookup = getItemLookup(navigation);
  for (const [key, item] of lookup.entries()) {
    if (typeof key === 'string' && key === path) {
      return item;
    }
    if (key instanceof RegExp && key.test(path)) {
      return item;
    }
  }
  return null;
}

/**
 * Gets the path for a specific navigation page item.
 */
export function getItemPath(navigation, item) {
  const map = getItemToPathMap(navigation);
  const path = map.get(item);
  invariant(path, `Item not found in navigation: ${item.title}`);
  return path;
}

/**
 * Checks if a specific navigation page item has the active page as a child item.
 */
export function hasSelectedNavigationChildren(navigation, item, activePagePath) {
  if (item.children) {
    return item.children.some(nestedItem => {
      if (!isPageItem(nestedItem)) {
        return false;
      }
      if (nestedItem.children) {
        return hasSelectedNavigationChildren(navigation, nestedItem, activePagePath);
      }
      return activePagePath === getItemPath(navigation, nestedItem);
    });
  }
  return false;
}