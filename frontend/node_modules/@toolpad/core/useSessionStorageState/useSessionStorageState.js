"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSessionStorageState = void 0;
var _persistence = require("../persistence");
/**
 * Sync state to session storage so that it persists through a page refresh. Usage is
 * similar to useState except we pass in a storage key so that we can default
 * to that value on page load instead of the specified initial value.
 *
 * Since the storage API isn't available in server-rendering environments, we
 * return null during SSR and hydration.
 */
const useSessionStorageStateBrowser = (...args) => (0, _persistence.useStorageState)(window.sessionStorage, ...args);
const useSessionStorageState = exports.useSessionStorageState = typeof window === 'undefined' ? _persistence.useStorageStateServer : useSessionStorageStateBrowser;