/**
 * State Update Tracer
 * 
 * This utility helps trace and understand when React state updates occur
 * for selectedLogoId and selectedLogo in the ReFlow application.
 */

export interface StateUpdateEvent {
  timestamp: number;
  type: 'selectedLogoId' | 'selectedLogo' | 'both';
  trigger: string;
  oldValue: {
    selectedLogoId?: string;
    selectedLogoId?: string;
  };
  newValue: {
    selectedLogoId?: string;
    selectedLogoId?: string;
  };
  stackTrace?: string;
  metadata?: Record<string, any>;
}

class StateUpdateTracer {
  private events: StateUpdateEvent[] = [];
  private enabled = false;
  private maxEvents = 100;

  enable() {
    this.enabled = true;
    console.log('🔍 State Update Tracer ENABLED');
  }

  disable() {
    this.enabled = false;
    console.log('🔍 State Update Tracer DISABLED');
  }

  trace(event: Omit<StateUpdateEvent, 'timestamp'>) {
    if (!this.enabled) return;

    const fullEvent: StateUpdateEvent = {
      ...event,
      timestamp: Date.now(),
      stackTrace: new Error().stack
    };

    this.events.push(fullEvent);
    
    // Keep only the last N events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console with formatting
    this.logEvent(fullEvent);
  }

  private logEvent(event: StateUpdateEvent) {
    const time = new Date(event.timestamp).toLocaleTimeString();
    
    console.group(`🔄 STATE UPDATE [${time}] - ${event.type.toUpperCase()}`);
    console.log(`📍 Trigger: ${event.trigger}`);
    
    if (event.type === 'selectedLogoId' || event.type === 'both') {
      console.log(`🆔 SelectedLogoId: ${event.oldValue.selectedLogoId} → ${event.newValue.selectedLogoId}`);
    }
    
    if (event.type === 'selectedLogo' || event.type === 'both') {
      console.log(`📦 SelectedLogo.id: ${event.oldValue.selectedLogoId} → ${event.newValue.selectedLogoId}`);
    }
    
    if (event.metadata) {
      console.log('📊 Metadata:', event.metadata);
    }
    
    console.groupEnd();
  }

  getEvents() {
    return [...this.events];
  }

  getEventsByType(type: StateUpdateEvent['type']) {
    return this.events.filter(e => e.type === type);
  }

  getEventsByTrigger(trigger: string) {
    return this.events.filter(e => e.trigger.includes(trigger));
  }

  clear() {
    this.events = [];
    console.log('🧹 State Update Tracer cleared');
  }

  analyze() {
    console.group('📊 STATE UPDATE ANALYSIS');
    console.log(`Total events: ${this.events.length}`);
    
    // Count by type
    const typeCounts = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('By type:', typeCounts);
    
    // Count by trigger
    const triggerCounts = this.events.reduce((acc, event) => {
      acc[event.trigger] = (acc[event.trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('By trigger:', triggerCounts);
    
    // Find mismatches
    const mismatches = this.events.filter(event => {
      if (event.type === 'both') {
        return event.newValue.selectedLogoId !== event.newValue.selectedLogoId;
      }
      return false;
    });
    
    if (mismatches.length > 0) {
      console.warn(`⚠️ Found ${mismatches.length} state mismatches!`);
      mismatches.forEach(m => {
        console.warn(`  - ${new Date(m.timestamp).toLocaleTimeString()}: ${m.trigger}`);
      });
    }
    
    console.groupEnd();
  }

  exportToTable() {
    console.table(this.events.map(e => ({
      time: new Date(e.timestamp).toLocaleTimeString(),
      type: e.type,
      trigger: e.trigger,
      oldId: e.oldValue.selectedLogoId,
      newId: e.newValue.selectedLogoId,
      metadata: JSON.stringify(e.metadata || {})
    })));
  }
}

// Global instance
export const stateTracer = new StateUpdateTracer();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).stateTracer = stateTracer;
}