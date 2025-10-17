import type { Session } from '@supabase/supabase-js';
import { SESSION_STORAGE_KEY } from '../config/env';

function isChromeRuntimeAvailable(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local;
}

export async function loadSessionFromStorage(): Promise<Session | null> {
  if (isChromeRuntimeAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(SESSION_STORAGE_KEY, (result) => {
        const raw = result?.[SESSION_STORAGE_KEY];
        if (!raw) {
          resolve(null);
          return;
        }

        try {
          resolve(raw as Session);
        } catch (error) {
          console.error('[JobTracker] Failed to parse stored session', error);
          resolve(null);
        }
      });
    });
  }

  // Fallback for local development (non-extension context)
  const fallback = globalThis.localStorage?.getItem?.(SESSION_STORAGE_KEY);
  if (!fallback) return null;

  try {
    return JSON.parse(fallback) as Session;
  } catch (error) {
    console.error('[JobTracker] Failed to parse fallback session', error);
    return null;
  }
}

export async function persistSessionToStorage(session: Session | null): Promise<void> {
  if (isChromeRuntimeAvailable()) {
    return new Promise((resolve) => {
      if (session) {
        chrome.storage.local.set({ [SESSION_STORAGE_KEY]: session }, () => resolve());
      } else {
        chrome.storage.local.remove(SESSION_STORAGE_KEY, () => resolve());
      }
    });
  }

  // Fallback for local development
  if (session) {
    globalThis.localStorage?.setItem?.(SESSION_STORAGE_KEY, JSON.stringify(session));
  } else {
    globalThis.localStorage?.removeItem?.(SESSION_STORAGE_KEY);
  }
}
