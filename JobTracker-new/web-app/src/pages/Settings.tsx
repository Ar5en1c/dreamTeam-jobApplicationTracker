import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { User, Save, Info, Shield } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/lib/supabase';

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

const sectionVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 210, damping: 26 }
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: 'blur(6px)',
    transition: { duration: 0.18, ease: 'easeInOut' }
  }
} satisfies Variants;

type SectionId = 'profile' | 'security';

const settingsSections: Array<{
  id: SectionId;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'profile',
    title: 'Account',
    description: 'Basic details for your JobTracker account.',
    icon: <User className="w-5 h-5" />
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Passwords and sign-in preferences.',
    icon: <Shield className="w-5 h-5" />
  }
];

const defaultAccountInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: ''
};

type AccountInfoKey = keyof typeof defaultAccountInfo;

export const Settings: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [accountInfo, setAccountInfo] = useState(() => ({ ...defaultAccountInfo }));
  const enableMockAuth = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  useEffect(() => {
    if (profile && user) {
      setAccountInfo({
        fullName: profile.personalInfo.name || '',
        email: user.email || '',
        phone: profile.personalInfo.phone || '',
        location: profile.personalInfo.location || ''
      });
      setHasUnsavedChanges(false);
    }
  }, [profile, user]);

  const updateAccountInfo = (key: AccountInfoKey, value: string) => {
    setAccountInfo(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!profile) {
      return;
    }

    try {
      setSaving(true);

      const success = await updateProfile({
        personalInfo: {
          ...profile.personalInfo,
          name: accountInfo.fullName,
          phone: accountInfo.phone,
          location: accountInfo.location
        }
      });

      if (success) {
        setHasUnsavedChanges(false);
        addToast({
          title: 'Personal details updated',
          description: 'Your profile information has been saved.',
          type: 'success'
        });
      } else {
        addToast({
          title: 'Could not save changes',
          description: 'Please try again in a moment.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Failed to save settings', error);
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred while saving.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (!profile || !user) {
      return;
    }

    setAccountInfo({
      fullName: profile.personalInfo.name || '',
      email: user.email || '',
      phone: profile.personalInfo.phone || '',
      location: profile.personalInfo.location || ''
    });
    if (hasUnsavedChanges) {
      setHasUnsavedChanges(false);
      addToast({
        title: 'Changes discarded',
        description: 'We restored your last saved details.',
        type: 'info'
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasUnsavedChanges || saving) {
      return;
    }
    await handleSaveSettings();
  };

  const disableInputs = saving || profileLoading;
  const passwordDirty = Object.values(passwordForm).some(Boolean);

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.email) {
      addToast({
        title: 'Unable to change password',
        description: 'You must be signed in with an email account to update your password.',
        type: 'error'
      });
      return;
    }

    if (enableMockAuth) {
      addToast({
        title: 'Password updates disabled',
        description: 'Mock authentication is enabled, so password changes are unavailable in this environment.',
        type: 'info'
      });
      resetPasswordForm();
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      addToast({
        title: 'Missing details',
        description: 'Please enter your current password and a new password.',
        type: 'error'
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      addToast({
        title: 'Choose a longer password',
        description: 'New passwords need to be at least 8 characters.',
        type: 'error'
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast({
        title: 'Passwords do not match',
        description: 'Double-check the confirmation field.',
        type: 'error'
      });
      return;
    }

    try {
      setSavingPassword(true);
      const signInResult = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword
      });

      if (signInResult.error) {
        throw new Error('Incorrect current password.');
      }

      const updateResult = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (updateResult.error) {
        throw updateResult.error;
      }

      addToast({
        title: 'Password updated',
        description: 'Use your new password next time you sign in.',
        type: 'success'
      });
      resetPasswordForm();
    } catch (error) {
      console.error('Failed to update password', error);
      addToast({
        title: 'Could not update password',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Sign in to manage your account settings.
        </p>
      </div>
    );
  }

  const renderProfileSection = () => (
    <motion.form
      key="profile-settings"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card variant="surface" className="border-borderMuted overflow-hidden p-0">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-xl font-semibold">
            Account Info
          </CardTitle>
          <CardDescription>
            These details appear on your profile and across job applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          {profileLoading && !profile ? (
            <div className="space-y-4" aria-hidden="true">
              <div className="h-4 w-1/4 rounded bg-muted/50 animate-pulse" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-11 rounded-lg bg-muted/40 animate-pulse" />
                <div className="h-11 rounded-lg bg-muted/40 animate-pulse" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-11 rounded-lg bg-muted/40 animate-pulse" />
                <div className="h-11 rounded-lg bg-muted/40 animate-pulse" />
              </div>
              <div className="h-24 rounded-lg bg-muted/40 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={accountInfo.fullName}
                  onChange={event => updateAccountInfo('fullName', event.target.value)}
                  disabled={disableInputs}
                />
                <Input
                  label="Email address"
                  value={accountInfo.email}
                  disabled
                  description="Email is managed through your login provider."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Phone number"
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  autoComplete="tel"
                  value={accountInfo.phone}
                  onChange={event => updateAccountInfo('phone', event.target.value)}
                  disabled={disableInputs}
                />
                <Input
                  label="Location"
                  placeholder="City, State / Country"
                  autoComplete="address-level2"
                  value={accountInfo.location}
                  onChange={event => updateAccountInfo('location', event.target.value)}
                  disabled={disableInputs}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="sticky bottom-0 left-0 right-0 flex flex-col-reverse gap-3 border-t border-borderMuted/60 bg-surface-1/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-surface-1/75 sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex items-center gap-2 text-sm ${hasUnsavedChanges ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
            <Info className="h-4 w-4" />
            <span>{hasUnsavedChanges ? 'You have unsaved changes' : 'All changes saved'}</span>
          </div>
          <div className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetSettings}
              disabled={!hasUnsavedChanges || disableInputs}
            >
              Discard
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              loading={saving}
              disabled={!hasUnsavedChanges}
            >
              Save changes
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.form>
  );

  const renderSecuritySection = () => (
    <motion.form
      key="security-settings"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handlePasswordChange}
      className="space-y-6"
    >
      <Card variant="surface" className="border-borderMuted overflow-hidden p-0">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-foreground/80 dark:bg-surface-1 dark:text-foreground">
              <Shield className="h-5 w-5" />
            </span>
            Sign-in & Security
          </CardTitle>
          <CardDescription>
            Update your password and keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={event =>
                setPasswordForm(prev => ({
                  ...prev,
                  currentPassword: event.target.value
                }))
              }
              disabled={savingPassword}
              placeholder="Enter current password"
              required
            />
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              value={passwordForm.newPassword}
              onChange={event =>
                setPasswordForm(prev => ({
                  ...prev,
                  newPassword: event.target.value
                }))
              }
              disabled={savingPassword}
              placeholder="Minimum 8 characters"
              required
            />
          </div>
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={passwordForm.confirmPassword}
            onChange={event =>
              setPasswordForm(prev => ({
                ...prev,
                confirmPassword: event.target.value
              }))
            }
            disabled={savingPassword}
            placeholder="Re-enter new password"
            required
          />
          <p className="text-xs text-muted-foreground">
            Strong passwords use a mix of uppercase letters, lowercase letters, numbers, and symbols.
          </p>
        </CardContent>
        <CardFooter className="sticky bottom-0 left-0 right-0 flex flex-col-reverse gap-3 border-t border-borderMuted/60 bg-surface-1/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-surface-1/75 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Need to rotate credentials regularly for shared devices.</span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetPasswordForm}
              disabled={savingPassword || !passwordDirty}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              loading={savingPassword}
              disabled={!passwordDirty || savingPassword}
            >
              Update password
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.form>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'security':
        return renderSecuritySection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Keep your core account details lightweight while we build out the rest.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        <motion.nav variants={itemVariants} className="lg:col-span-1">
          <Card variant="surface" className="border-borderMuted p-0">
            <CardContent className="p-0">
              <nav className="p-3">
                <div className="space-y-1">
                  {settingsSections.map(section => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-500/10 text-foreground shadow-level-1 border border-primary-500/20'
                          : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                      }`}
                      aria-pressed={activeSection === section.id}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-md ${
                          activeSection === section.id
                            ? 'bg-primary-500/15 text-foreground'
                            : 'bg-surface-2 text-muted-foreground dark:bg-surface-1'
                        }`}
                      >
                        {section.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className={activeSection === section.id ? 'font-semibold' : ''}>{section.title}</span>
                        <span className="text-xs font-normal text-muted-foreground/80">
                          {section.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </nav>
            </CardContent>
          </Card>
        </motion.nav>

        <div className="space-y-6 lg:col-span-3">
          <AnimatePresence mode="wait" initial={false}>
            {renderActiveSection()}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
