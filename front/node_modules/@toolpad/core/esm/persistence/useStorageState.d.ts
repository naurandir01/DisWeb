import * as React from 'react';
import { Codec } from "./codec.js";
export type StorageStateInitializer<T> = () => T | null;
export type UseStorageStateHookResult<T> = [T | null, React.Dispatch<React.SetStateAction<T | null>>];
export declare function useStorageStateServer<T = string>(): UseStorageStateHookResult<T>;
export interface DefaultStorageStateoptions<T = string> {
  codec?: Codec<T>;
}
export interface StorageStateOptions<T> extends DefaultStorageStateoptions<T> {
  codec: Codec<T>;
}
/**
 * Sync state to local storage so that it persists through a page refresh. Usage is
 * similar to useState except we pass in a storage key so that we can default
 * to that value on page load instead of the specified initial value.
 *
 * Since the storage API isn't available in server-rendering environments, we
 * return null during SSR and hydration.
 */
export declare function useStorageState(area: Storage, key: string | null, initializer?: string | null | StorageStateInitializer<string>, options?: DefaultStorageStateoptions): UseStorageStateHookResult<string>;
export declare function useStorageState<T>(area: Storage, key: string | null, initializer: T | null | StorageStateInitializer<T>, options: StorageStateOptions<T>): UseStorageStateHookResult<T>;
export interface UseStorageState {
  /**
   * Sync state to local or session storage so that it persists through a page refresh. Usage is
   * similar to useState except we pass in a storage key that uniquely identifies the value.
   * @param key The key to use for storing the value in local or session storage.
   * @param initializer The initial value to use if the key is not present in storage.
   * @param options Additional options for the storage state.
   */
  (key: string | null, initializer?: string | null | StorageStateInitializer<string>, options?: DefaultStorageStateoptions): UseStorageStateHookResult<string>;
  /**
   * Sync state to local or session storage so that it persists through a page refresh. Usage is
   * similar to useState except we pass in a storage key that uniquely identifies the value.
   * @param key The key to use for storing the value in local or session storage.
   * @param initializer The initial value to use if the key is not present in storage.
   * @param options Additional options for the storage state.
   */
  <T>(key: string | null, initializer: T | null | StorageStateInitializer<T>, options: StorageStateOptions<T>): UseStorageStateHookResult<T>;
  /**
   * Sync state to local or session storage so that it persists through a page refresh. Usage is
   * similar to useState except we pass in a storage key that uniquely identifies the value.
   * @param key The key to use for storing the value in local or session storage.
   * @param initializer The initial value to use if the key is not present in storage.
   * @param options Additional options for the storage state.
   */
  <T>(key: string | null, initializer?: T | null | StorageStateInitializer<T>, options?: StorageStateOptions<T>): UseStorageStateHookResult<T>;
}