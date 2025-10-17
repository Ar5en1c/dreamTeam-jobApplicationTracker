import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, setSupabaseSession } from '@shared/supabase/client';
import { loadSessionFromStorage, persistSessionToStorage } from '@shared/supabase/sessionStorage';
import { broadcastSessionUpdate, registerSupabaseMessaging } from '@shared/supabase/messaging';

const supabase = getSupabaseClient();
registerSupabaseMessaging(supabase);

async function bootstrap() {
  const storedSession = await loadSessionFromStorage();
  if (storedSession) {
    setSupabaseSession(storedSession);
  }

  const { data } = await supabase.auth.getSession();
  if (data.session) {
    await persistSessionToStorage(data.session);
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    await persistSessionToStorage(session);

    if (session || event === 'SIGNED_OUT') {
      broadcastSessionUpdate(session);
    }
  });
}

void bootstrap();

chrome.runtime.onInstalled.addListener(() => {
  console.info('[JobTracker] Extension installed');
});
