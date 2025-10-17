import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useSessionStore } from './store/session';
import { getSupabaseClient, setSupabaseSession } from '@shared/supabase/client';
import { loadSessionFromStorage, persistSessionToStorage } from '@shared/supabase/sessionStorage';
import '../styles/index.css';

async function bootstrap() {
  const supabase = getSupabaseClient();

  // Try to load session from local storage first
  const storedSession = await loadSessionFromStorage();

  if (storedSession) {
    setSupabaseSession(storedSession);
    useSessionStore.getState().setSession(storedSession);
  }

  useSessionStore.getState().setStatus('ready');

  // Listen for auth state changes and persist to storage
  supabase.auth.onAuthStateChange(async (event, nextSession) => {
    if (nextSession) {
      useSessionStore.getState().setSession(nextSession);
      await persistSessionToStorage(nextSession);
      setSupabaseSession(nextSession);
    } else if (event === 'SIGNED_OUT') {
      useSessionStore.getState().setSession(null);
      await persistSessionToStorage(null);
    }
  });

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Popup root element not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

void bootstrap();
