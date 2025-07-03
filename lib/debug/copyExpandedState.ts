/**
 * Utility to copy only the expanded portions of a state tree
 */

export function copyExpandedState(
  data: any,
  expandedPaths: Set<string>,
  path = '',
  hideKeys: string[] = ['code', 'handler', 'ref', '_ref']
): any {
  if (data === null || data === undefined) return data;
  
  const type = typeof data;
  
  // Primitive types - return as is
  if (type === 'boolean' || type === 'number' || type === 'string') {
    return data;
  }
  
  // Functions - return a placeholder
  if (type === 'function') {
    return `[Function: ${data.name || 'anonymous'}]`;
  }
  
  // Arrays
  if (Array.isArray(data)) {
    const result: any[] = [];
    data.forEach((item, index) => {
      const itemPath = path ? `${path}.${index}` : String(index);
      // Only include items if their parent is expanded
      if (expandedPaths.has(path) || path === '') {
        result.push(copyExpandedState(item, expandedPaths, itemPath, hideKeys));
      }
    });
    return result;
  }
  
  // Objects
  if (type === 'object') {
    const result: any = {};
    Object.entries(data).forEach(([key, value]) => {
      // Skip hidden keys
      if (hideKeys.includes(key)) {
        result[key] = '[hidden]';
        return;
      }
      
      const keyPath = path ? `${path}.${key}` : key;
      // Only include properties if their parent is expanded
      if (expandedPaths.has(path) || path === '') {
        result[key] = copyExpandedState(value, expandedPaths, keyPath, hideKeys);
      }
    });
    return result;
  }
  
  return data;
}

/**
 * Format the copied state for clipboard
 */
export function formatForClipboard(data: any): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern way
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}