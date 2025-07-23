import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Save,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Mail,
  MessageSquare,
  Calendar,
  Archive,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/components/ui/Toast';
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
    id: 'privacy',
    title: 'Privacy & Security',
    icon: <Shield className="w-5 h-5" />,
    description: 'Control your privacy and security settings'
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: <Palette className="w-5 h-5" />,
    description: 'Customize the look and feel'
  },
  {
    id: 'data',
    title: 'Data & Storage',
    icon: <Archive className="w-5 h-5" />,
    description: 'Manage your data and export options'
  }
];

export const Settings: React.FC = () => {
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState('account');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced software developer passionate about creating innovative solutions.'
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      applicationUpdates: true,
      deadlineReminders: true,
      weeklyDigest: false,
      marketingEmails: false
    },
    privacy: {
      profileVisible: true,
      shareAnalytics: false,
      twoFactorAuth: false
    },
    appearance: {
      theme: (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'system' : 'system') as 'light' | 'dark' | 'system',
      compactMode: false,
      animationsEnabled: true
    }
  });

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
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

  const handleSaveSettings = () => {
    // Simulate saving settings
    setTimeout(() => {
      setHasUnsavedChanges(false);
      addToast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
        type: 'success'
      });
    }, 500);
  };

  const handleResetSettings = () => {
    setAccountInfo({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Experienced software developer passionate about creating innovative solutions.'
    });
    setSettings({
      notifications: {
        email: true,
        push: true,
        applicationUpdates: true,
        deadlineReminders: true,
        weeklyDigest: false,
        marketingEmails: false
      },
      privacy: {
        profileVisible: true,
        shareAnalytics: false,
        twoFactorAuth: false
      },
      appearance: {
        theme: 'system' as 'light' | 'dark' | 'system',
        compactMode: false,
        animationsEnabled: true
      }
    });
    setHasUnsavedChanges(false);
    addToast({
      title: 'Settings reset',
      description: 'All settings have been restored to their default values.',
      type: 'info'
    });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSetting('appearance', 'theme', theme);
    
    // Apply theme immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      // System theme
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    }
  };

  const renderAccountSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input 
                placeholder="John Doe" 
                value={accountInfo.fullName}
                onChange={(e) => updateAccountInfo('fullName', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <Input 
                type="email" 
                placeholder="john@example.com" 
                value={accountInfo.email}
                onChange={(e) => updateAccountInfo('email', e.target.value)}
              />
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
                placeholder="San Francisco, CA" 
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
          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPrivacySettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Make your profile visible to recruiters</p>
                </div>
              </div>
              <Switch 
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) => updateSetting('privacy', 'profileVisible', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch 
                checked={settings.privacy.twoFactorAuth}
                onCheckedChange={(checked) => updateSetting('privacy', 'twoFactorAuth', checked)}
              />
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Change Password</h3>
            <div className="space-y-3">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
              <Input type="password" placeholder="Confirm new password" />
              <Button variant="outline" size="sm">Update Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAppearanceSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

  const renderDataSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Archive className="w-5 h-5 mr-2" />
            Data & Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium mb-2">Export Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download all your application data in CSV or JSON format
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'Export started',
                      description: 'Your CSV export will be ready shortly.',
                      type: 'info'
                    });
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'Export started',
                      description: 'Your JSON export will be ready shortly.',
                      type: 'info'
                    });
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These actions are irreversible. Please be careful.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'Clear data',
                      description: 'This feature requires additional confirmation. Contact support for assistance.',
                      type: 'warning'
                    });
                  }}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'Account deletion',
                      description: 'This feature requires additional verification. Contact support to proceed.',
                      type: 'error'
                    });
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
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
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
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
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1 p-4">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    )}
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
          <Card className="shadow-lg border-primary/20">
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
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