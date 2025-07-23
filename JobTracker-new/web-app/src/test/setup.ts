import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';

// Make vitest globals available
declare global {
  // Remove type annotations to avoid circular reference errors
  var beforeEach;
  var afterEach;
  var vi;
}

globalThis.beforeEach = beforeEach;
globalThis.afterEach = afterEach;
globalThis.vi = vi;