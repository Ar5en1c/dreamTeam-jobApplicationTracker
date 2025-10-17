import React from 'react';
import {
  LogOut,
  ExternalLink,
  User,
  Bell,
  Palette,
  Shield,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { Button, Card, CardContent, cn } from '@jobtracker/ui';
import { useSessionStore } from '../store/session';
import { getSupabaseClient } from '@shared/supabase/client';
import { syncSessionWithBackground } from '@shared/supabase/messaging';
import { WEB_APP_URL } from '@shared/config/env';

const supabase = getSupabaseClient();

function openWebApp(path: string = '/settings') {
  const url = `${WEB_APP_URL}${path}?source=extension`;
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}

interface SettingItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  onClick?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  label,
  description,
  onClick,
  showChevron = true,
  destructive = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        'hover:bg-surface-2',
        destructive
          ? 'text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10'
          : 'text-foreground'
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          destructive
            ? 'bg-error-100 text-error-600 dark:bg-error-500/20'
            : 'bg-surface-3 text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', destructive && 'text-error-600')}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {showChevron && (
        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
    </button>
  );
};

export const Settings: React.FC = () => {
  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);
  const [signingOut, setSigningOut] = React.useState(false);

  const email = session?.user?.email ?? 'Not signed in';

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      await syncSessionWithBackground(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-borderMuted bg-surface-1 px-4 py-4">
        <h1 className="text-lg font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Account Section */}
        <Card variant="surface" className="border-borderMuted">
          <CardContent className="space-y-1">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Account</h2>

            <div className="mb-4 flex items-center gap-3 rounded-lg bg-surface-2 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                {email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{email}</p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
            </div>

            <SettingItem
              icon={User}
              label="Manage Account"
              description="Update profile and preferences"
              onClick={() => openWebApp('/profile')}
            />
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card variant="surface" className="border-borderMuted">
          <CardContent className="space-y-1">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Preferences</h2>

            <SettingItem
              icon={Bell}
              label="Notifications"
              description="Manage notification settings"
              onClick={() => openWebApp('/settings')}
            />

            <SettingItem
              icon={Palette}
              label="Appearance"
              description="Theme and display options"
              onClick={() => openWebApp('/settings')}
            />

            <SettingItem
              icon={Zap}
              label="Auto-Capture"
              description="Configure job detection"
              onClick={() => openWebApp('/settings')}
            />
          </CardContent>
        </Card>

        {/* Privacy & Support Section */}
        <Card variant="surface" className="border-borderMuted">
          <CardContent className="space-y-1">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Privacy & Support
            </h2>

            <SettingItem
              icon={Shield}
              label="Privacy Policy"
              onClick={() => openWebApp('/privacy')}
            />

            <SettingItem
              icon={HelpCircle}
              label="Help Center"
              onClick={() => openWebApp('/help')}
            />
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="rounded-lg border border-borderMuted bg-surface-2 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground">
            JobTracker Extension v2.0.0
          </p>
        </div>

        {/* Sign Out Button */}
        <Card variant="outline" className="border-borderMuted">
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center border-error-200 text-error-600 hover:bg-error-50 hover:border-error-300 dark:border-error-500/30 dark:hover:bg-error-500/10"
              onClick={handleSignOut}
              loading={signingOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
