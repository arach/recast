/**
 * Service for handling URL parameter synchronization
 */

import { Parameters } from '@/lib/types';

export interface URLParams {
  template?: string;
  text?: string;
  letter?: string;
  fillColor?: string;
  strokeColor?: string;
  backgroundColor?: string;
  // Add more as needed
}

export class URLService {
  /**
   * Parse URL parameters
   */
  static parseURLParams(): URLParams {
    if (typeof window === 'undefined') return {};
    
    const params = new URLSearchParams(window.location.search);
    const result: URLParams = {};
    
    // Template
    const template = params.get('template');
    if (template) result.template = template;
    
    // Content
    const text = params.get('text');
    if (text) result.text = text;
    
    const letter = params.get('letter');
    if (letter) result.letter = letter;
    
    // Colors
    const fillColor = params.get('fillColor');
    if (fillColor) result.fillColor = fillColor;
    
    const strokeColor = params.get('strokeColor');
    if (strokeColor) result.strokeColor = strokeColor;
    
    const backgroundColor = params.get('backgroundColor');
    if (backgroundColor) result.backgroundColor = backgroundColor;
    
    return result;
  }
  
  /**
   * Update URL with current parameters
   */
  static updateURL(params: {
    templateId?: string;
    parameters?: Parameters;
  }): void {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams();
    
    // Add template if not default
    if (params.templateId && params.templateId !== 'wave-bars') {
      urlParams.set('template', params.templateId);
    }
    
    // Add content parameters
    if (params.parameters?.content?.text) {
      urlParams.set('text', params.parameters.content.text);
    }
    if (params.parameters?.content?.letter) {
      urlParams.set('letter', params.parameters.content.letter);
    }
    
    // Add colors if different from defaults
    const style = params.parameters?.style;
    if (style) {
      if (style.fillColor && style.fillColor !== '#3b82f6') {
        urlParams.set('fillColor', style.fillColor);
      }
      if (style.strokeColor && style.strokeColor !== '#1e40af') {
        urlParams.set('strokeColor', style.strokeColor);
      }
      if (style.backgroundColor && style.backgroundColor !== '#ffffff') {
        urlParams.set('backgroundColor', style.backgroundColor);
      }
    }
    
    // Update URL without reload
    const newURL = `${window.location.pathname}${
      urlParams.toString() ? '?' + urlParams.toString() : ''
    }`;
    window.history.replaceState({}, '', newURL);
  }
  
  /**
   * Generate shareable URL
   */
  static generateShareURL(params: {
    templateId: string;
    parameters: Parameters;
  }): string {
    const urlParams = new URLSearchParams();
    
    // Always include template for share links
    urlParams.set('template', params.templateId);
    
    // Include all relevant parameters
    if (params.parameters.content.text) {
      urlParams.set('text', params.parameters.content.text);
    }
    if (params.parameters.content.letter) {
      urlParams.set('letter', params.parameters.content.letter);
    }
    
    // Include colors
    const style = params.parameters.style;
    if (style.fillColor) urlParams.set('fillColor', style.fillColor);
    if (style.strokeColor) urlParams.set('strokeColor', style.strokeColor);
    if (style.backgroundColor) urlParams.set('backgroundColor', style.backgroundColor);
    
    return `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
  }
  
  /**
   * Debounced URL update
   */
  private static updateTimeout: NodeJS.Timeout | null = null;
  
  static debouncedUpdateURL(params: {
    templateId?: string;
    parameters?: Parameters;
  }, delay: number = 1000): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    this.updateTimeout = setTimeout(() => {
      this.updateURL(params);
    }, delay);
  }
}