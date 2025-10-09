import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/Card';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Job Application Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to track your job applications
          </p>
        </div>
        
        <Card className="mt-8 border-border bg-card">
          <CardContent className="p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                      inputBackground: 'hsl(var(--background))',
                      inputText: 'hsl(var(--foreground))',
                      inputBorder: 'hsl(var(--border))',
                      inputLabelText: 'hsl(var(--foreground))',
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '0.375rem',
                      buttonBorderRadius: '0.375rem',
                      inputBorderRadius: '0.375rem',
                    },
                  },
                },
                className: {
                  container: 'supabase-auth-container',
                  button: 'supabase-auth-button',
                  input: 'supabase-auth-input',
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
              onlyThirdPartyProviders={false}
              magicLink={false}
              showLinks={true}
            />
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};