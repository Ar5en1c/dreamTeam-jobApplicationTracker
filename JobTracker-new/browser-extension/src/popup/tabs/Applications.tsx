import React, { useState } from 'react';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  MoreVertical,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button, Card, cn } from '@jobtracker/ui';
import { WEB_APP_URL } from '@shared/config/env';
import { useJobApplications } from '../hooks/useJobApplications';
import type { JobApplication } from '../hooks/useJobApplications';

type StatusKey = JobApplication['status'];

const statusConfig: Record<StatusKey, { label: string; color: string; dot: string }> = {
  applied: {
    label: 'Applied',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  phone_screen: {
    label: 'Phone Screen',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  interview: {
    label: 'Interview',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500',
  },
  final_interview: {
    label: 'Final Interview',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
  offer: {
    label: 'Offer',
    color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    dot: 'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500',
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300',
    dot: 'bg-gray-500',
  },
};

function openWebApp(path: string = '/applications') {
  const url = `${WEB_APP_URL}${path}?source=extension`;
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}

export const Applications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusKey | null>(null);

  const { applications, loading } = useJobApplications();

  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      app.job.title.toLowerCase().includes(query) ||
      app.job.company.toLowerCase().includes(query) ||
      app.job.location.toLowerCase().includes(query);

    const matchesStatus = !statusFilter || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-borderMuted bg-surface-1 px-4 py-4">
        <h1 className="text-lg font-bold text-foreground">Applications</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {applications.length} total application{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-borderMuted bg-surface-1 px-4 py-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'h-9 w-full rounded-lg border border-borderMuted bg-surface-2 pl-9 pr-3',
                'text-sm text-foreground placeholder:text-muted-foreground',
                'focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20',
                'transition-all duration-200'
              )}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'h-9 px-3',
              showFilters && 'bg-primary-50 dark:bg-primary-600/20'
            )}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-lg border border-borderMuted bg-surface-2 p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Quick Filters</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter(null)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-all',
                  'border hover:border-primary-400',
                  statusFilter === null
                    ? 'border-primary-400 bg-primary-50 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300'
                    : 'border-borderMuted bg-surface-1 text-muted-foreground hover:text-foreground'
                )}
              >
                All
              </button>
              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key as StatusKey)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-all',
                    'border hover:border-primary-400',
                    statusFilter === key
                      ? 'border-primary-400 bg-primary-50 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300'
                      : 'border-borderMuted bg-surface-1 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card variant="outline" className="border-borderMuted">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary-200/60 bg-surface-2 text-primary-600 dark:border-primary-500/30 dark:bg-surface-3 dark:text-primary-300">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-base font-bold text-foreground">
                {searchQuery ? 'No matches found' : 'No applications yet'}
              </h3>
              <p className="mb-4 text-xs text-muted-foreground max-w-[250px] mx-auto">
                {searchQuery
                  ? 'Try adjusting your search or filters.'
                  : 'Start adding applications to track your job search progress.'}
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openWebApp('/applications')}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Add Application
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => {
              const status = statusConfig[app.status];
              return (
                <Card
                  key={app.id}
                  variant="surface"
                  hover="lift"
                  size="sm"
                  className="border-borderMuted cursor-pointer"
                  onClick={() => openWebApp(`/applications/${app.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-3 text-muted-foreground flex-shrink-0">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {app.job.title}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {app.job.company}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {app.job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{app.job.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(app.dates.applied).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                            status.color
                          )}
                        >
                          <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                          {status.label}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open actions menu
                      }}
                      className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Action */}
      {filteredApplications.length > 0 && (
        <div className="border-t border-borderMuted bg-surface-1 p-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            onClick={() => openWebApp('/applications')}
          >
            <ExternalLink className="h-4 w-4" />
            View All in Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};
