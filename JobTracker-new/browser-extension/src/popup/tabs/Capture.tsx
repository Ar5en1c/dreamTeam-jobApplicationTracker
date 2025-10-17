import React, { useState } from 'react';
import { PlusCircle, Sparkles, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button, Card, CardContent, cn } from '@jobtracker/ui';
import { Input } from '../components/ui/Input';
import { WEB_APP_URL } from '@shared/config/env';
import { useJobApplications } from '../hooks/useJobApplications';

function openWebApp(path: string = '/applications') {
  const url = `${WEB_APP_URL}${path}?source=extension&action=create`;
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}

export const Capture: React.FC = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createApplication } = useJobApplications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setShowSuccess(false);

    try {
      const result = await createApplication({
        job: {
          title: formData.jobTitle,
          company: formData.company,
          location: formData.location || '',
          url: formData.jobUrl || undefined,
        },
        status: 'applied',
      });

      if (result) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          jobTitle: '',
          company: '',
          location: '',
          jobUrl: '',
        });

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError('Failed to create application. Please try again.');
      }
    } catch (err) {
      console.error('Error creating application:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.jobTitle.trim() !== '' && formData.company.trim() !== '';

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-borderMuted bg-gradient-to-br from-primary-600/10 via-primary-500/5 to-secondary-500/10 px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Add Application</h1>
            <p className="text-xs text-muted-foreground">
              Quickly capture a job opportunity
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Success Message */}
        {showSuccess && (
          <Card variant="surface" className="border-success-200 bg-success-50 dark:bg-success-600/10 dark:border-success-500/30">
            <CardContent className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-400" />
              <p className="text-sm font-medium text-success-700 dark:text-success-300">
                Application added successfully!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card variant="surface" className="border-error-200 bg-error-50 dark:bg-error-600/10 dark:border-error-500/30">
            <CardContent className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-error-600 dark:text-error-400" />
              <p className="text-sm font-medium text-error-700 dark:text-error-300">
                {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Detection Card */}
        <Card variant="premium" className="border-primary-200/50">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-sm font-semibold text-foreground">AI Auto-Detection</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Browse to a job posting and we'll automatically detect and fill in the details
              for you. Supported on 40+ job boards.
            </p>
          </CardContent>
        </Card>

        {/* Quick Add Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card variant="surface" className="border-borderMuted">
            <CardContent className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Manual Entry</h3>

              <Input
                label="Job Title *"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                required
              />

              <Input
                label="Company *"
                type="text"
                placeholder="e.g. Stripe"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />

              <Input
                label="Location"
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />

              <Input
                label="Job URL"
                type="url"
                placeholder="https://..."
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
              />

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  disabled={!isFormValid}
                  loading={isSubmitting}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Application
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => openWebApp('/applications')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Full Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Help Card */}
        <Card variant="glass" className="border-borderMuted/60">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-info-600 dark:text-info-400">
              <AlertCircle className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Quick Tip</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              For the best experience, use the full dashboard to add applications with all
              details including resume, cover letter, and notes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
