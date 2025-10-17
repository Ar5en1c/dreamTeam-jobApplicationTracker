import React from 'react';
import { ArrowUpRight, Building2, Clock, Target, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@jobtracker/ui';
import { Card, CardContent } from '@jobtracker/ui';
import { useSessionStore } from '../store/session';
import { WEB_APP_URL } from '@shared/config/env';
import { useJobApplications } from '../hooks/useJobApplications';

interface QuickStat {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'success' | 'info' | 'warning';
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200',
  success: 'bg-success-100 text-success-600 dark:bg-success-600/20 dark:text-success-300',
  info: 'bg-info-100 text-info-600 dark:bg-info-500/20 dark:text-info-300',
  warning: 'bg-warning-100 text-warning-600 dark:bg-warning-600/20 dark:text-warning-300',
};

function openWebApp(path: string = '/dashboard') {
  const url = `${WEB_APP_URL}${path}?source=extension`;
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}

export const Dashboard: React.FC = () => {
  const session = useSessionStore((state) => state.session);
  const { applications, loading } = useJobApplications();

  // Calculate stats from real data
  const totalApplications = applications.length;
  const activeApplications = applications.filter(
    (app) => !['rejected', 'withdrawn', 'offer'].includes(app.status)
  ).length;
  const interviewApplications = applications.filter(
    (app) => ['phone_screen', 'interview', 'final_interview'].includes(app.status)
  ).length;
  const offerApplications = applications.filter((app) => app.status === 'offer').length;

  const stats: QuickStat[] = [
    { label: 'Total', value: totalApplications, icon: Building2, color: 'primary' },
    { label: 'Active', value: activeApplications, icon: TrendingUp, color: 'success' },
    { label: 'Interviews', value: interviewApplications, icon: Clock, color: 'info' },
    { label: 'Offers', value: offerApplications, icon: Target, color: 'warning' },
  ];

  const displayName = session?.user?.email?.split('@')[0] || 'there';

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-borderMuted bg-gradient-to-br from-primary-600/10 via-primary-500/5 to-secondary-500/10 px-4 py-5">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your job search progress
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        )}

        {!loading && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                variant="surface"
                hover="lift"
                size="sm"
                className="border-borderMuted"
              >
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[stat.color]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card variant="surface" className="border-borderMuted">
          <CardContent className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => openWebApp('/dashboard')}
              >
                <ArrowUpRight className="h-4 w-4" />
                Open Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => openWebApp('/applications')}
              >
                <Building2 className="h-4 w-4" />
                View All Applications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications - Empty State */}
        {totalApplications === 0 && (
          <Card variant="outline" className="border-borderMuted">
            <CardContent className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary-200/60 bg-surface-2 text-primary-600 dark:border-primary-500/30 dark:bg-surface-3 dark:text-primary-300">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-base font-bold text-foreground">
                No applications yet
              </h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Start tracking your job search to see your progress here.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openWebApp('/applications')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tips Card */}
        <Card variant="glass" className="border-borderMuted/60">
          <CardContent className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">💡 Pro Tip</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Use the extension to quickly capture jobs while browsing. We'll auto-detect
              postings on popular job boards and save them to your workspace.
            </p>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
  );
};
