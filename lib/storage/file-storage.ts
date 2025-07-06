import fs from 'fs/promises';
import path from 'path';
import { BaseStorageAdapter, ListOptions } from './base';

export class FileStorage extends BaseStorageAdapter {
  private dataDir: string;
  
  constructor(dataDir: string) {
    super();
    this.dataDir = dataDir;
    this.ensureDirectory();
  }
  
  private async ensureDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create data directory:', error);
    }
  }
  
  private getFilePath(key: string): string {
    // Replace path separators to avoid directory traversal
    const safeKey = key.replace(/[\/\\]/g, '_');
    return path.join(this.dataDir, `${safeKey}.json`);
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const filePath = this.getFilePath(key);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    const filePath = this.getFilePath(key);
    const data = JSON.stringify(value, null, 2);
    await fs.writeFile(filePath, data, 'utf-8');
  }
  
  async delete(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
  
  async exists(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  
  async list<T>(prefix: string, options?: ListOptions): Promise<T[]> {
    const keys = await this.listKeys(prefix, options);
    const items = await this.getMany<T>(keys);
    return items.filter((item): item is T => item !== null);
  }
  
  async listKeys(prefix: string, options?: ListOptions): Promise<string[]> {
    const files = await fs.readdir(this.dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    let keys = jsonFiles
      .map(file => file.slice(0, -5)) // Remove .json extension
      .filter(key => key.startsWith(prefix));
    
    // Sort
    if (options?.sort) {
      keys.sort();
      if (options.sort === 'desc') {
        keys.reverse();
      }
    }
    
    // Pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || keys.length;
    keys = keys.slice(offset, offset + limit);
    
    return keys;
  }
  
  async count(prefix: string): Promise<number> {
    const keys = await this.listKeys(prefix);
    return keys.length;
  }
  
  // File storage doesn't support transactions
  // Operations are atomic at the file level
}