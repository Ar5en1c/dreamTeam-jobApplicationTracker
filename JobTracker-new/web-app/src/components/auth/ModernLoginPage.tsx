import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, Github, Chrome, Linkedin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

type AuthMode = 'signin' | 'signup' | 'reset';

export const ModernLoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleInputChange = (field: keyof AuthFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (message) setMessage(null); // Clear message on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Account created! Please check your email to verify your account.',
        });
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Password reset link sent to your email!',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Social login failed',
      });
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        {/* Main Card */}
        <div className="bg-card rounded-lg shadow-lg border border-border">
          {/* Header */}
          <div className="p-6 pb-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-1">
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === 'signin' && 'Welcome back to your job tracker'}
              {mode === 'signup' && 'Start tracking your job applications'}
              {mode === 'reset' && 'Enter your email address'}
            </p>
          </div>

          {/* Message Display */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mx-6 mb-4 p-3 rounded-md text-sm ${
                  message.type === 'error'
                    ? 'bg-destructive/15 text-destructive border border-destructive/20'
                    : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {mode === 'signup' && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={formData.fullName || ''}
                      onChange={handleInputChange('fullName')}
                      leftIcon={<User className="w-4 h-4" />}
                      required
                    />
                  </div>
                )}

                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />
                </div>

                {mode !== 'reset' && (
                  <div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                      required
                      minLength={6}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </Button>
              </motion.form>
            </AnimatePresence>

            {/* Social Login */}
            {mode !== 'reset' && (
              <>
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-border" />
                  <span className="px-3 text-xs text-muted-foreground">or</span>
                  <div className="flex-1 border-t border-border" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialLogin('google')}
                    disabled={loading}
                  >
                    <Chrome className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialLogin('linkedin_oidc')}
                    disabled={loading}
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialLogin('github')}
                    disabled={loading}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Footer Links */}
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <div className="text-center">
              {mode === 'signin' && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              )}
              {mode === 'signup' && (
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {mode === 'reset' && (
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-sm text-primary hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};