import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Eye, EyeOff, Mail, Lock, Briefcase, TrendingUp, Users, BarChart3, Chrome, Github, Linkedin, User } from 'lucide-react';

interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

type AuthMode = 'signin' | 'signup' | 'reset';

export const PremiumLoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const features = [
    {
      icon: Briefcase,
      title: 'Smart Tracking',
      description: 'Track applications across all major job platforms'
    },
    {
      icon: TrendingUp,
      title: 'Success Analytics',
      description: 'Get insights into your application success rate'
    },
    {
      icon: Users,
      title: 'Network Building',
      description: 'Connect with recruiters and hiring managers'
    },
    {
      icon: BarChart3,
      title: 'Progress Reports',
      description: 'Detailed reports on your job search progress'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Features */}
        <div className="text-white space-y-8 order-2 lg:order-1">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Job Application Tracker
            </h1>
            <p className="text-lg lg:text-xl text-purple-200 mt-4">
              Transform your job search with intelligent tracking and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-purple-200 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-8 text-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10k+</div>
              <div className="text-sm">Applications Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm">Companies</div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full max-w-md mx-auto order-1 lg:order-2">
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {mode === 'signin' && 'Welcome Back'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Reset Password'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {mode === 'signin' && 'Continue your job search journey'}
                  {mode === 'signup' && 'Start tracking your dream job applications'}
                  {mode === 'reset' && 'Enter your email address'}
                </p>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${
                  message.type === 'error' 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={formData.fullName || ''}
                      onChange={handleInputChange('fullName')}
                      leftIcon={<User className="w-4 h-4" />}
                      placeholder="Your full name"
                      required
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    leftIcon={<Mail className="w-4 h-4" />}
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>

                {mode !== 'reset' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        leftIcon={<Lock className="w-4 h-4" />}
                        placeholder="Enter your password"
                        required
                        minLength={6}
                        className="w-full pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  loading={loading}
                >
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </Button>
              </form>

              {/* Social Login */}
              {mode !== 'reset' && (
                <>
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300" />
                    <span className="px-3 text-sm text-gray-500">or continue with</span>
                    <div className="flex-1 border-t border-gray-300" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                      className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Chrome className="w-5 h-5 text-red-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('linkedin_oidc')}
                      disabled={loading}
                      className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('github')}
                      disabled={loading}
                      className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Github className="w-5 h-5 text-gray-800" />
                    </Button>
                  </div>
                </>
              )}

              {/* Footer Links */}
              <div className="mt-8 text-center space-y-3">
                {mode === 'signin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-sm text-purple-600 hover:text-purple-700 transition-colors block"
                    >
                      Forgot your password?
                    </button>
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}
                {mode === 'signup' && (
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                )}
                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Back to sign in
                  </button>
                )}
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};