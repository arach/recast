export interface ListOptions {
  prefix?: string;
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
  sortBy?: string;
}

export interface StorageAdapter {
  // Basic operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  
  // Batch operations
  getMany<T>(keys: string[]): Promise<(T | null)[]>;
  setMany<T>(entries: Array<[string, T]>): Promise<void>;
  deleteMany(keys: string[]): Promise<void>;
  
  // List operations
  list<T>(prefix: string, options?: ListOptions): Promise<T[]>;
  listKeys(prefix: string, options?: ListOptions): Promise<string[]>;
  count(prefix: string): Promise<number>;
  
  // Atomic operations
  increment(key: string, amount?: number): Promise<number>;
  decrement(key: string, amount?: number): Promise<number>;
  
  // Transaction support (optional)
  transaction?<T>(fn: (tx: StorageAdapter) => Promise<T>): Promise<T>;
}

export abstract class BaseStorageAdapter implements StorageAdapter {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract exists(key: string): Promise<boolean>;
  abstract list<T>(prefix: string, options?: ListOptions): Promise<T[]>;
  abstract listKeys(prefix: string, options?: ListOptions): Promise<string[]>;
  abstract count(prefix: string): Promise<number>;
  
  // Default implementations for batch operations
  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map(key => this.get<T>(key)));
  }
  
  async setMany<T>(entries: Array<[string, T]>): Promise<void> {
    await Promise.all(entries.map(([key, value]) => this.set(key, value)));
  }
  
  async deleteMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.delete(key)));
  }
  
  // Default implementations for atomic operations
  async increment(key: string, amount = 1): Promise<number> {
    const current = await this.get<number>(key) || 0;
    const newValue = current + amount;
    await this.set(key, newValue);
    return newValue;
  }
  
  async decrement(key: string, amount = 1): Promise<number> {
    return this.increment(key, -amount);
  }
}