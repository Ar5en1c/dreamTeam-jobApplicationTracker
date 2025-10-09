import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Session = any; // Use any for now to avoid import issues
type User = any;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const enableMockAuth =
    import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

  useEffect(() => {
    if (!enableMockAuth) {
      return;
    }

    const mockUser = {
      id: 'mock-user',
      email: 'demo@jobtracker.ai',
      user_metadata: {
        avatar_url: 'https://avatars.dicebear.com/api/initials/JT.svg'
      }
    };

    setSession({ user: mockUser });
    setUser(mockUser);
    setLoading(false);

    return () => {
      setSession(null);
      setUser(null);
    };
  }, [enableMockAuth]);

  useEffect(() => {
    if (enableMockAuth) {
      return;
    }
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (enableMockAuth) {
      setSession(null);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
