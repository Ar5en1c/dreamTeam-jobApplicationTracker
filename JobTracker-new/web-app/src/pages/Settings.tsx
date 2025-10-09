import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Save,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Mail,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account',
    icon: <User className="w-5 h-5" />,
    description: 'Manage your account details and preferences'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    description: 'Configure notification preferences'
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: <Palette className="w-5 h-5" />,
    description: 'Customize the look and feel'
  }
];

const initialSettings = {
  notifications: {
    email: true,
    push: true,
    applicationUpdates: true,
    deadlineReminders: true,
    weeklyDigest: false
  },
  appearance: {
    theme: 'system' as 'light' | 'dark' | 'system',
    compactMode: false,
    animationsEnabled: true
  }
};

type SettingsState = typeof initialSettings;

export const Settings: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { theme: activeTheme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('account');
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load real user data from profile
  const [accountInfo, setAccountInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  const [settings, setSettings] = useState<SettingsState>(() => ({
    ...initialSettings,
    appearance: {
      ...initialSettings.appearance,
      theme: activeTheme,
    },
  }));
  const surfaceCardClass =
    "rounded-xl border border-borderMuted bg-surface-1 shadow-sm transition-colors";

  // Load profile data when available
  useEffect(() => {
    if (profile && user) {
      setAccountInfo({
        fullName: profile.personalInfo.name || '',
        email: user.email || '',
        phone: profile.personalInfo.phone || '',
        location: profile.personalInfo.location || '',
        bio: profile.personalInfo.bio || ''
      });
    }
  }, [profile, user]);

  useEffect(() => {
    setSettings(prev => {
      if (prev.appearance.theme === activeTheme) {
        return prev;
      }
      return {
        ...prev,
        appearance: {
          ...prev.appearance,
          theme: activeTheme,
        },
      };
    });
  }, [activeTheme]);

  const updateSetting = <Section extends keyof SettingsState, Key extends keyof SettingsState[Section]>(
    section: Section,
    key: Key,
    value: SettingsState[Section][Key]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateAccountInfo = (key: string, value: string) => {
    setAccountInfo(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!profile) return;

    try {
      setSaving(true);

      // Update profile in database
      const success = await updateProfile({
        personalInfo: {
          ...profile.personalInfo,
          name: accountInfo.fullName,
          phone: accountInfo.phone,
          location: accountInfo.location,
          bio: accountInfo.bio
        }
      });

      if (success) {
        setHasUnsavedChanges(false);
        addToast({
          title: 'Settings saved',
          description: 'Your preferences have been updated successfully.',
          type: 'success'
        });
      } else {
        addToast({
          title: 'Save failed',
          description: 'Failed to save settings. Please try again.',
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Failed to save settings', err);
      addToast({
        title: 'Error',
        description: 'An error occurred while saving settings.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (profile && user) {
      setAccountInfo({
        fullName: profile.personalInfo.name || '',
        email: user.email || '',
        phone: profile.personalInfo.phone || '',
        location: profile.personalInfo.location || '',
        bio: profile.personalInfo.bio || ''
      });
      setHasUnsavedChanges(false);
      addToast({
        title: 'Changes discarded',
        description: 'All unsaved changes have been discarded.',
        type: 'info'
      });
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme,
      },
    }));
    setTheme(theme);
  };

  const renderAccountSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className={surfaceCardClass}>
        <CardHeader className="border-b border-borderMuted/70 pb-4">
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          {profileLoading ? (
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    placeholder="Your full name"
                    value={accountInfo.fullName}
                    onChange={(e) => updateAccountInfo('fullName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    value={accountInfo.email}
                    disabled
                    className="opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={accountInfo.phone}
                    onChange={(e) => updateAccountInfo('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="City, State/Country"
                    value={accountInfo.location}
                    onChange={(e) => updateAccountInfo('location', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bio</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  value={accountInfo.bio}
                  onChange={(e) => updateAccountInfo('bio', e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className={surfaceCardClass}>
        <CardHeader className="border-b border-borderMuted/70 pb-4">
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Application Updates</p>
                  <p className="text-sm text-muted-foreground">Status changes and responses</p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications.applicationUpdates}
                onCheckedChange={(checked) => updateSetting('notifications', 'applicationUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Deadline Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders for application deadlines</p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications.deadlineReminders}
                onCheckedChange={(checked) => updateSetting('notifications', 'deadlineReminders', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications.weeklyDigest}
                onCheckedChange={(checked) => updateSetting('notifications', 'weeklyDigest', checked)}
              />
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Note: Notification preferences are saved locally and will take effect immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );


  const renderAppearanceSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className={surfaceCardClass}>
        <CardHeader className="border-b border-borderMuted/70 pb-4">
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div>
            <h3 className="font-medium mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value as 'light' | 'dark' | 'system')}
                  className={cn(
                    "p-3 border rounded-lg transition-colors flex flex-col items-center space-y-2",
                    settings.appearance.theme === theme.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {theme.icon}
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
              </div>
              <Switch 
                checked={settings.appearance.compactMode}
                onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Animations</p>
                <p className="text-sm text-muted-foreground">Enable smooth animations</p>
              </div>
              <Switch 
                checked={settings.appearance.animationsEnabled}
                onCheckedChange={(checked) => updateSetting('appearance', 'animationsEnabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );


  const renderActiveSection = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className={surfaceCardClass}>
            <CardContent className="p-0">
              <nav className="space-y-1 p-4">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                      activeSection === section.id
                        ? "bg-primary-600 text-white shadow-level-1"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )}
                    aria-pressed={activeSection === section.id}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {renderActiveSection()}
        </div>
      </div>

      {/* Save/Reset Actions */}
      {hasUnsavedChanges && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className={cn(surfaceCardClass, "border-primary-300/50 shadow-level-1")}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <p className="text-sm text-muted-foreground">You have unsaved changes</p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleResetSettings}
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveSettings}
                    disabled={saving}
                    loading={saving}
                    variant="primary"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
