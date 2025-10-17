import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

interface SessionState {
  session: Session | null;
  status: 'loading' | 'ready';
  setSession: (session: Session | null) => void;
  setStatus: (status: SessionState['status']) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  status: 'loading',
  setSession: (session) => set({ session }),
  setStatus: (status) => set({ status })
}));
