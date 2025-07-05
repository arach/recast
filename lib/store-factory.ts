import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { StateCreator } from 'zustand';

// Debounce function for storage writes
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

interface StoreOptions {
  name: string;
  persist?: boolean;
  persistOptions?: {
    storage?: 'localStorage' | 'sessionStorage';
    partialize?: (state: any) => any;
    debounceDelay?: number; // Debounce delay in milliseconds
  };
  debug?: boolean;
}

// Create a debounced storage wrapper
function createDebouncedStorage(storage: Storage, delay: number = 1000) {
  const debouncedSetItem = debounce((key: string, value: string) => {
    storage.setItem(key, value);
  }, delay);
  
  return {
    getItem: (name: string) => storage.getItem(name),
    setItem: debouncedSetItem,
    removeItem: (name: string) => storage.removeItem(name),
  };
}

/**
 * Creates a standardized Zustand store with common middleware
 * 
 * Features:
 * - Immer for immutable updates
 * - DevTools integration in development
 * - Optional persistence with customizable storage
 * - Debug logging
 * 
 * @param stateCreator - Zustand state creator function
 * @param options - Store configuration options
 */
export function createStore<T extends object>(
  stateCreator: StateCreator<
    T,
    [['zustand/devtools', never], ['zustand/persist', T], ['zustand/immer', never]],
    [],
    T
  >,
  options: StoreOptions
) {
  // Create the base store with immer
  let store = immer(stateCreator);

  // Add persistence if enabled
  if (options.persist && typeof window !== 'undefined') {
    const baseStorage = options.persistOptions?.storage === 'sessionStorage' 
      ? sessionStorage 
      : localStorage;
    
    // Use debounced storage if delay is specified
    const storage = options.persistOptions?.debounceDelay
      ? createDebouncedStorage(baseStorage, options.persistOptions.debounceDelay)
      : baseStorage;
    
    store = persist(store, {
      name: options.name,
      storage: createJSONStorage(() => storage),
      partialize: options.persistOptions?.partialize
    }) as any;
  }

  // Add devtools in development
  if (process.env.NODE_ENV === 'development') {
    store = devtools(store, {
      name: options.name,
      trace: true,
      traceLimit: 25
    }) as any;
  }

  // Create the final store
  const finalStore = create<T>()(store);

  // Add debug logging if enabled
  if (options.debug && process.env.NODE_ENV === 'development') {
    finalStore.subscribe((state, prevState) => {
      console.groupCollapsed(`[${options.name}] State Update`);
      console.log('Previous:', prevState);
      console.log('Current:', state);
      console.groupEnd();
    });
  }

  // Expose store in development for debugging
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      window.__REFLOW_STORES__ = window.__REFLOW_STORES__ || {};
      window.__REFLOW_STORES__[options.name] = finalStore;
    }
  }

  return finalStore;
}

// Helper type for store with standard actions
export interface StoreWithActions<T> extends T {
  // Standard actions that all stores should have
  reset: () => void;
  hydrate: (state: Partial<T>) => void;
}

// Helper to create standard actions
export function createStandardActions<T extends object>() {
  return {
    reset: () => (set: any, get: any, initialState: T) => {
      set(() => initialState);
    },
    hydrate: (newState: Partial<T>) => (set: any) => {
      set((state: T) => ({ ...state, ...newState }));
    }
  };
}

// TypeScript helpers for better type inference
export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;
export type ExtractActions<S> = S extends { getState: () => infer T } 
  ? { [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K] } 
  : never;

// Declare global types for debugging
declare global {
  interface Window {
    __REFLOW_STORES__?: Record<string, any>;
  }
}