/**
 * Event Handler Utility
 *
 * Provides centralized event management with automatic cleanup:
 * - Event listener registration with unique keys
 * - Individual event removal
 * - Bulk event cleanup
 * - Memory leak prevention
 *
 * Used by:
 * - Navigation component
 * - Course list component
 * - My page component
 *
 * @module eventHandler
 */

export const eventHandler = {
  listeners: new Map(),

  on(element, eventType, callback, options = {}) {
    if (!element) return;

    const handler = (event) => callback(event);
    element.addEventListener(eventType, handler, options);

    // Store for cleanup
    const key = `${eventType}-${Date.now()}`;
    this.listeners.set(key, { element, eventType, handler });
    return key;
  },

  off(key) {
    const listener = this.listeners.get(key);
    if (!listener) return;

    const { element, eventType, handler } = listener;
    element.removeEventListener(eventType, handler);
    this.listeners.delete(key);
  },

  removeAll() {
    this.listeners.forEach(({ element, eventType, handler }) => {
      element.removeEventListener(eventType, handler);
    });
    this.listeners.clear();
  },
};
