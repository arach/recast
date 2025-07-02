/**
 * Logo ID Manager
 * Handles generation and persistence of logo instance IDs
 */

export class LogoIdManager {
  private static readonly STORAGE_KEY = 'recast-logo-instances';
  private static readonly ID_PREFIX = 'logo';
  
  /**
   * Generate a unique ID using timestamp + random component
   * Format: logo-timestamp-random (e.g., logo-1701234567890-a3f2)
   */
  static generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    return `${this.ID_PREFIX}-${timestamp}-${random}`;
  }
  
  /**
   * Save logo instances to localStorage
   */
  static saveInstances(instances: Array<{ id: string; position: { x: number; y: number }; templateId?: string }>) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(instances));
    } catch (error) {
      console.error('Failed to save logo instances:', error);
    }
  }
  
  /**
   * Load logo instances from localStorage
   */
  static loadInstances(): Array<{ id: string; position: { x: number; y: number }; templateId?: string }> {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load logo instances:', error);
      return [];
    }
  }
  
  /**
   * Add or update an instance in localStorage
   */
  static upsertInstance(instance: { id: string; position: { x: number; y: number }; templateId?: string }) {
    const instances = this.loadInstances();
    const index = instances.findIndex(i => i.id === instance.id);
    
    if (index >= 0) {
      instances[index] = instance;
    } else {
      instances.push(instance);
    }
    
    this.saveInstances(instances);
  }
  
  /**
   * Remove an instance from localStorage
   */
  static removeInstance(id: string) {
    const instances = this.loadInstances();
    const filtered = instances.filter(i => i.id !== id);
    this.saveInstances(filtered);
  }
  
  /**
   * Clear all instances from localStorage
   */
  static clearInstances() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  /**
   * Check if an ID exists
   */
  static idExists(id: string): boolean {
    const instances = this.loadInstances();
    return instances.some(i => i.id === id);
  }
}