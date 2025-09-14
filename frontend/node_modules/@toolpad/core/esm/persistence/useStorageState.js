'use client';

import * as React from 'react';
import { CODEC_STRING } from "./codec.js";

// storage events only work across tabs, we'll use an event emitter to announce within the current tab
const currentTabChangeListeners = new Map();
function onCurrentTabStorageChange(key, handler) {
  let listeners = currentTabChangeListeners.get(key);
  if (!listeners) {
    listeners = new Set();
    currentTabChangeListeners.set(key, listeners);
  }
  listeners.add(handler);
}
function offCurrentTabStorageChange(key, handler) {
  const listeners = currentTabChangeListeners.get(key);
  if (!listeners) {
    return;
  }
  listeners.delete(handler);
  if (listeners.size === 0) {
    currentTabChangeListeners.delete(key);
  }
}
function emitCurrentTabStorageChange(key) {
  const listeners = currentTabChangeListeners.get(key);
  if (listeners) {
    listeners.forEach(listener => listener());
  }
}
if (typeof window !== 'undefined') {
  const origSetItem = window.localStorage.setItem;
  window.localStorage.setItem = function setItem(key, value) {
    const result = origSetItem.call(this, key, value);
    emitCurrentTabStorageChange(key);
    return result;
  };
}
function subscribe(area, key, callback) {
  if (!key) {
    return () => {};
  }
  const storageHandler = event => {
    if (event.storageArea === area && event.key === key) {
      callback();
    }
  };
  window.addEventListener('storage', storageHandler);
  onCurrentTabStorageChange(key, callback);
  return () => {
    window.removeEventListener('storage', storageHandler);
    offCurrentTabStorageChange(key, callback);
  };
}
function getSnapshot(area, key) {
  if (!key) {
    return null;
  }
  try {
    return area.getItem(key);
  } catch {
    // ignore
    // See https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
    return null;
  }
}
function setValue(area, key, value) {
  if (!key) {
    return;
  }
  try {
    if (value === null) {
      area.removeItem(key);
    } else {
      area.setItem(key, String(value));
    }
  } catch {
    // ignore
    // See https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
    return;
  }
  emitCurrentTabStorageChange(key);
}
const serverValue = [null, () => {}];
export function useStorageStateServer() {
  return serverValue;
}
function encode(codec, value) {
  return value === null ? null : codec.stringify(value);
}
function decode(codec, value) {
  return value === null ? null : codec.parse(value);
}

// Start with null for the hydration, and then switch to the actual value.
const getKeyServerSnapshot = () => null;

/**
 * Sync state to local storage so that it persists through a page refresh. Usage is
 * similar to useState except we pass in a storage key so that we can default
 * to that value on page load instead of the specified initial value.
 *
 * Since the storage API isn't available in server-rendering environments, we
 * return null during SSR and hydration.
 */

export function useStorageState(area, key, initializer = null, options) {
  const codec = options?.codec ?? CODEC_STRING;
  const [initialValue] = React.useState(initializer);
  const encodedInitialValue = React.useMemo(() => encode(codec, initialValue), [codec, initialValue]);
  const subscribeKey = React.useCallback(callback => subscribe(area, key, callback), [area, key]);
  const getKeySnapshot = React.useCallback(() => getSnapshot(area, key) ?? encodedInitialValue, [area, encodedInitialValue, key]);
  const encodedStoredValue = React.useSyncExternalStore(subscribeKey, getKeySnapshot, getKeyServerSnapshot);
  const storedValue = React.useMemo(() => decode(codec, encodedStoredValue), [codec, encodedStoredValue]);
  const setStoredValue = React.useCallback(value => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    const encodedValueToStore = encode(codec, valueToStore);
    setValue(area, key, encodedValueToStore);
  }, [area, codec, storedValue, key]);
  const [nonStoredValue, setNonStoredValue] = React.useState(initialValue);
  if (!key) {
    return [nonStoredValue, setNonStoredValue];
  }
  return [storedValue, setStoredValue];
}