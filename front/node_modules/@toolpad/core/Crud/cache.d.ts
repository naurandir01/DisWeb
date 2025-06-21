export type DataSourceCacheConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300000 (5 minutes)
   */
  ttl?: number;
};
export declare class DataSourceCache {
  private cache;
  private ttl;
  constructor(config?: DataSourceCacheConfig);
  set(key: string, value: unknown): void;
  get(key: string): unknown | undefined;
  clear(): void;
}