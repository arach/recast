import { nanoid } from 'nanoid';
import { StorageAdapter } from '../storage/base';

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FindOptions {
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
  sortBy?: string;
}

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(
    protected storage: StorageAdapter,
    protected prefix: string
  ) {}
  
  protected getKey(id: string): string {
    return `${this.prefix}:${id}`;
  }
  
  protected generateId(): string {
    return `${this.prefix}-${nanoid(8)}`;
  }
  
  protected addTimestamps(entity: Partial<T>, isUpdate = false): T {
    const now = new Date().toISOString();
    
    if (isUpdate) {
      return {
        ...entity,
        updatedAt: now,
      } as T;
    }
    
    return {
      ...entity,
      id: entity.id || this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;
  }
  
  async findById(id: string): Promise<T | null> {
    return this.storage.get<T>(this.getKey(id));
  }
  
  async findMany(ids: string[]): Promise<T[]> {
    const keys = ids.map(id => this.getKey(id));
    const items = await this.storage.getMany<T>(keys);
    return items.filter((item): item is T => item !== null);
  }
  
  async findAll(options?: FindOptions): Promise<T[]> {
    return this.storage.list<T>(this.prefix + ':', options);
  }
  
  async create(data: Partial<T>): Promise<T> {
    const entity = this.addTimestamps(data);
    await this.storage.set(this.getKey(entity.id), entity);
    return entity;
  }
  
  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    
    const updated = this.addTimestamps({ ...existing, ...updates }, true);
    await this.storage.set(this.getKey(id), updated);
    return updated;
  }
  
  async delete(id: string): Promise<boolean> {
    const exists = await this.storage.exists(this.getKey(id));
    if (!exists) {
      return false;
    }
    
    await this.storage.delete(this.getKey(id));
    return true;
  }
  
  async count(): Promise<number> {
    return this.storage.count(this.prefix + ':');
  }
  
  async exists(id: string): Promise<boolean> {
    return this.storage.exists(this.getKey(id));
  }
}