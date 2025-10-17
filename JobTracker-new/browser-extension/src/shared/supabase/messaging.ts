import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { persistSessionToStorage } from './sessionStorage';
import { setSupabaseSession } from './client';

type SupabaseMessage =
  | { type: 'supabase:session:get' }
  | { type: 'supabase:session:set'; payload: Session | null }
  | { type: 'supabase:session:clear' };

type MessageSender = Parameters<typeof chrome.runtime.onMessage.addListener>[1];

type SendResponse = Parameters<typeof chrome.runtime.onMessage.addListener>[2];

export function registerSupabaseMessaging(client: SupabaseClient): void {
  chrome.runtime.onMessage.addListener((message: SupabaseMessage, _sender: MessageSender, sendResponse: SendResponse) => {
    if (!message || typeof message !== 'object' || !('type' in message)) {
      return;
    }

    if (message.type === 'supabase:session:get') {
      void client.auth.getSession().then(({ data }) => {
        sendResponse({ session: data.session ?? null });
      });
      return true;
    }

    if (message.type === 'supabase:session:set') {
      const session = message.payload ?? null;
      setSupabaseSession(session);
      void persistSessionToStorage(session);
      sendResponse({ ok: true });
      return true;
    }

    if (message.type === 'supabase:session:clear') {
      void client.auth.signOut();
      void persistSessionToStorage(null);
      sendResponse({ ok: true });
      return true;
    }

    return undefined;
  });
}

export function broadcastSessionUpdate(session: Session | null) {
  if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
    return;
  }

  try {
    chrome.runtime.sendMessage({ type: 'supabase:session:updated', payload: session ?? null }, () => {
      const lastError = chrome.runtime?.lastError;
      if (!lastError) {
        return;
      }

      if (lastError.message === 'Could not establish connection. Receiving end does not exist.') {
        console.debug('[JobTracker] No receiving end for session update yet');
        return;
      }

      console.warn('[JobTracker] Unable to broadcast session update', lastError);
    });
  } catch (error) {
    console.warn('[JobTracker] Unable to broadcast session update', error);
  }
}

export async function syncSessionWithBackground(session: Session | null): Promise<boolean> {
  if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
    return false;
  }

  const message: SupabaseMessage =
    session === null
      ? { type: 'supabase:session:clear' }
      : { type: 'supabase:session:set', payload: session };

  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(message, () => {
        const lastError = chrome.runtime?.lastError;
        if (lastError) {
          if (lastError.message === 'Could not establish connection. Receiving end does not exist.') {
            console.debug('[JobTracker] Background not ready to receive session sync yet');
            resolve(false);
            return;
          }

          console.warn('[JobTracker] Failed to sync session with background', lastError);
          resolve(false);
          return;
        }

        resolve(true);
      });
    } catch (error) {
      console.warn('[JobTracker] Unable to sync session with background', error);
      resolve(false);
    }
  });
}
