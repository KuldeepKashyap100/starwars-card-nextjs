// cache adaptor
class Cache {
  private cacheInstance: any;

  constructor() {
    if (!this.cacheInstance) {
      console.log("\nCreating Cache Instance.....");
      this.cacheInstance = this.getInstance();
    }
  }

  private getInstance() {
    return {};
  }

  has(key: string): boolean {
    return key in this.cacheInstance;
  }

  set(key: string, value: any, ttl = process.env.CACHE_TIMEOUT_IN_SECS) {
    // will configure ttl later
    this.cacheInstance[key] = value;
  }

  get(key: string) {
    return this.cacheInstance[key];
  }
}

export default new Cache();
