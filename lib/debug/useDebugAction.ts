import { useEffect } from 'react';
import { debugRegistry, DebugAction } from './debugRegistry';

/**
 * Hook to register debug actions for a component
 * Actions are automatically unregistered when the component unmounts
 */
export function useDebugAction(action: DebugAction | DebugAction[]) {
  useEffect(() => {
    const actions = Array.isArray(action) ? action : [action];
    const actionIds = actions.map(a => a.id);
    
    // Register actions
    debugRegistry.registerMultiple(actions);
    
    // Cleanup: unregister on unmount
    return () => {
      debugRegistry.unregisterMultiple(actionIds);
    };
  }, []); // Empty deps - only register once on mount
}

/**
 * Hook to conditionally register debug actions
 */
export function useConditionalDebugAction(
  condition: boolean,
  action: DebugAction | DebugAction[]
) {
  useEffect(() => {
    if (!condition) return;
    
    const actions = Array.isArray(action) ? action : [action];
    const actionIds = actions.map(a => a.id);
    
    debugRegistry.registerMultiple(actions);
    
    return () => {
      debugRegistry.unregisterMultiple(actionIds);
    };
  }, [condition]); // Re-run when condition changes
}