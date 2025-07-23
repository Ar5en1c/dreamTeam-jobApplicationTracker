import "@testing-library/jest-dom";
import { beforeEach, afterEach, vi } from "vitest";

// Make vitest globals available
declare global {
  var beforeEach: typeof import('vitest')['beforeEach'];
  var afterEach: typeof import('vitest')['afterEach'];
  var vi: typeof import('vitest')['vi'];
}

globalThis.beforeEach = beforeEach;
globalThis.afterEach = afterEach;
globalThis.vi = vi;
