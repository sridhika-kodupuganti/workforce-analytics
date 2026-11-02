import '@testing-library/jest-dom/vitest';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock getBoundingClientRect for chart containers in jsdom
HTMLElement.prototype.getBoundingClientRect = function () {
  return {
    width: 800,
    height: 400,
    top: 0,
    left: 0,
    bottom: 400,
    right: 800,
    x: 0,
    y: 0,
    toJSON: () => {},
  };
};

// Mock ResizeObserver for Recharts ResponsiveContainer
globalThis.ResizeObserver = class ResizeObserver {
  private callback: any;
  constructor(cb: any) {
    this.callback = cb;
  }
  observe(target: any) {
    if (this.callback) {
      this.callback([{ target, contentRect: { width: 800, height: 400 } }]);
    }
  }
  unobserve() {}
  disconnect() {}
};
