export class DataSourceCache {
  constructor(config) {
    this.cache = {};
    this.ttl = config?.ttl ?? 300000;
  }
  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache[key] = {
      value,
      expiry
    };
  }
  get(key) {
    const entry = this.cache[key];
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiry) {
      delete this.cache[key];
      return undefined;
    }
    return entry.value;
  }
  clear() {
    this.cache = {};
  }
}