import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';
import { Button } from '@jobtracker/ui';
import { useSessionStore } from './store/session';
import { getSupabaseClient, setSupabaseSession } from '@shared/supabase/client';
import { WEB_APP_URL } from '@shared/config/env';
import { syncSessionWithBackground } from '@shared/supabase/messaging';
import { Input } from './components/ui/Input';
import { TabNavigation, type TabId } from './components/TabNavigation';
import { TabContainer, TabPanel } from './components/TabContainer';
import { Dashboard } from './tabs/Dashboard';
import { Applications } from './tabs/Applications';
import { Capture } from './tabs/Capture';
import { Settings } from './tabs/Settings';

const supabase = getSupabaseClient();

type Feedback = { type: 'success' | 'error'; text: string };
type FeedbackHandler = (feedback: Feedback | null) => void;

function openJobTrackerRoute(path: string) {
  const target = path.startsWith('http') ? path : `${WEB_APP_URL}${path}`;

  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url: target });
    return;
  }

  window.open(target, '_blank');
}

const Header: React.FC = () => (
  <header className="space-y-3 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500">
      <Sparkles className="h-6 w-6 text-white" />
    </div>
    <div className="space-y-1">
      <h1 className="text-xl font-bold text-foreground">
        Welcome to JobTracker
      </h1>
      <p className="text-xs text-muted-foreground">
        Sign in to continue
      </p>
    </div>
  </header>
);

const FeedbackAlert: React.FC<{ feedback: Feedback; onDismiss: () => void }> = ({ feedback, onDismiss }) => {
  const isError = feedback.type === 'error';
  const baseClasses = isError
    ? 'border-error-500/40 bg-error-500/10 text-error-600'
    : 'border-success-500/40 bg-success-500/10 text-success-600';
  const Icon = isError ? AlertTriangle : CheckCircle2;

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${baseClasses}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1 leading-relaxed">{feedback.text}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="text-current/70 transition hover:text-current"
        aria-label="Dismiss message"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur">
    <Loader2 className="h-5 w-5 animate-spin text-primary-400" />
    <div>
      <p className="text-sm font-medium text-foreground">Checking your session…</p>
      <p className="text-xs text-muted-foreground mt-1">Hold tight while we connect to JobTracker.</p>
    </div>
  </div>
);

const SignedInView: React.FC<{ session: Session }> = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <TabContainer>
      <TabPanel id="dashboard" activeTab={activeTab}>
        <Dashboard />
      </TabPanel>
      <TabPanel id="applications" activeTab={activeTab}>
        <Applications />
      </TabPanel>
      <TabPanel id="capture" activeTab={activeTab}>
        <Capture />
      </TabPanel>
      <TabPanel id="settings" activeTab={activeTab}>
        <Settings />
      </TabPanel>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </TabContainer>
  );
};

const LoginView: React.FC<{ onFeedback: FeedbackHandler }> = ({ onFeedback }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const setSession = useSessionStore(state => state.setSession);
  const setStatus = useSessionStore(state => state.setStatus);

  const submitCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldError(null);
    onFeedback(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error('No session returned. Please try again.');
      }

      setSession(data.session);
      setStatus('ready');

      setSupabaseSession(data.session);
      void syncSessionWithBackground(data.session);

      onFeedback({
        type: 'success',
        text: 'You are connected! The extension will now stay in sync with your JobTracker workspace.'
      });

      setEmail('');
      setPassword('');
      setShowPassword(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to sign in with these credentials.';
      setFieldError(message);
      onFeedback({ type: 'error', text: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    openJobTrackerRoute('/login?mode=reset&source=extension');
  };

  const handleOpenFullLogin = () => {
    openJobTrackerRoute('/login?source=extension');
  };

  React.useEffect(() => {
    if (fieldError) {
      const timer = setTimeout(() => setFieldError(null), 6000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [fieldError]);

  return (
    <form className="space-y-4" onSubmit={submitCredentials}>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="your@email.com"
        icon={<Mail className="h-4 w-4" />}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (fieldError) {
            setFieldError(null);
          }
        }}
        required
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="Enter your password"
        icon={<Lock className="h-4 w-4" />}
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (fieldError) {
            setFieldError(null);
          }
        }}
        required
        error={fieldError ?? undefined}
      />

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-muted-foreground transition hover:text-foreground"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-primary-600 transition hover:text-primary-500"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        size="lg"
        className="w-full justify-center"
      >
        Sign In
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleOpenFullLogin}
          className="text-xs text-muted-foreground transition hover:text-foreground"
        >
          Don't have an account? <span className="text-primary-600">Sign up</span>
        </button>
      </div>
    </form>
  );
};

const App: React.FC = () => {
  const session = useSessionStore(state => state.session);
  const status = useSessionStore(state => state.status);
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);

  const handleFeedback = React.useCallback<FeedbackHandler>(
    (next) => {
      setFeedback(next);
    },
    []
  );

  React.useEffect(() => {
    if (session) {
      setFeedback(null);
    }
  }, [session]);

  // Logged in state - full tab interface
  if (status !== 'loading' && session) {
    return (
      <div className="w-[380px] h-[600px] text-foreground">
        <SignedInView session={session} />
      </div>
    );
  }

  // Login/loading state - centered card
  return (
    <div className="w-[380px] min-h-[500px] flex items-center justify-center p-4 bg-white dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <Header />
        {feedback && <FeedbackAlert feedback={feedback} onDismiss={() => setFeedback(null)} />}
        {status === 'loading' && <LoadingState />}
        {status !== 'loading' && !session && <LoginView onFeedback={handleFeedback} />}
      </div>
    </div>
  );
};

export default App;
