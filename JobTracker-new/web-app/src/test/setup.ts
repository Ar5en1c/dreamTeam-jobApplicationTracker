import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';

// Make vitest globals available
declare global {
  var beforeEach: typeof beforeEach;
  var afterEach: typeof afterEach;
  var vi: typeof vi;
}

globalThis.beforeEach = beforeEach;
globalThis.afterEach = afterEach;
globalThis.vi = vi;