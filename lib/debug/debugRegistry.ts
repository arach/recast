/**
 * Debug Actions Registry
 * Allows any component to register debug actions dynamically
 */

export interface DebugAction {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: string; // emoji or icon name
  handler: () => void | Promise<void>;
  dangerous?: boolean; // for destructive actions
}

class DebugActionsRegistry {
  private actions: Map<string, DebugAction> = new Map();
  private listeners: Set<() => void> = new Set();

  /**
   * Register a debug action
   */
  register(action: DebugAction) {
    this.actions.set(action.id, action);
    this.notifyListeners();
  }

  /**
   * Register multiple actions at once
   */
  registerMultiple(actions: DebugAction[]) {
    actions.forEach(action => this.actions.set(action.id, action));
    this.notifyListeners();
  }

  /**
   * Unregister a debug action
   */
  unregister(actionId: string) {
    this.actions.delete(actionId);
    this.notifyListeners();
  }

  /**
   * Unregister multiple actions
   */
  unregisterMultiple(actionIds: string[]) {
    actionIds.forEach(id => this.actions.delete(id));
    this.notifyListeners();
  }

  /**
   * Get all registered actions
   */
  getActions(): DebugAction[] {
    return Array.from(this.actions.values());
  }

  /**
   * Get actions by category
   */
  getActionsByCategory(category: string): DebugAction[] {
    return this.getActions().filter(action => action.category === category);
  }

  /**
   * Get unique categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.actions.forEach(action => {
      if (action.category) categories.add(action.category);
    });
    return Array.from(categories);
  }

  /**
   * Clear all actions
   */
  clear() {
    this.actions.clear();
    this.notifyListeners();
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

// Singleton instance
export const debugRegistry = new DebugActionsRegistry();

// React hook for using the debug registry
import { useEffect, useState } from 'react';

export function useDebugActions() {
  const [actions, setActions] = useState<DebugAction[]>([]);

  useEffect(() => {
    // Get initial actions
    setActions(debugRegistry.getActions());

    // Subscribe to changes
    const unsubscribe = debugRegistry.subscribe(() => {
      setActions(debugRegistry.getActions());
    });

    return unsubscribe;
  }, []);

  return {
    actions,
    categories: debugRegistry.getCategories(),
    register: (action: DebugAction) => debugRegistry.register(action),
    unregister: (actionId: string) => debugRegistry.unregister(actionId),
    registerMultiple: (actions: DebugAction[]) => debugRegistry.registerMultiple(actions),
    unregisterMultiple: (actionIds: string[]) => debugRegistry.unregisterMultiple(actionIds),
  };
}