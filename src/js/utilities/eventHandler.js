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
    if (listener) {
      const { element, eventType, handler } = listener;
      element.removeEventListener(eventType, handler);
      this.listeners.delete(key);
    }
  },

  removeAll() {
    this.listeners.forEach(({ element, eventType, handler }) => {
      element.removeEventListener(eventType, handler);
    });
    this.listeners.clear();
  },
};
