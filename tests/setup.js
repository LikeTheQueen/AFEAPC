import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import * as matchers from '@testing-library/jest-dom/matchers';
import "../src/app.css"


expect.extend(matchers);
// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    
  });