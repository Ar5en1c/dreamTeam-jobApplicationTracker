import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  Clock,
  MapPin,
  Building2,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { cn, dateUtils } from '@/lib/utils';

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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications, loading, error } = useJobApplications();
  const { profile } = useUserProfile();

  const displayName = useMemo(() => {
    const profileName = profile?.personalInfo.name?.trim();
    if (profileName) return profileName;
    const metadataName = user?.user_metadata?.full_name?.trim();
    if (metadataName) return metadataName;
    return user?.email?.split('@')[0] || 'there';
  }, [profile?.personalInfo.name, user?.user_metadata?.full_name, user?.email]);

  const stats = useMemo(() => {
    if (!applications.length) {
      return {
        totalApplications: 0,
        activeApplications: 0,
        interviewRate: 0,
        averageResponseTime: 'N/A'
      };
    }

    const totalApplications = applications.length;
    const activeApplications = applications.filter(app =>
      !['rejected', 'withdrawn', 'expired'].includes(app.status)
    ).length;

    const interviewStatuses = ['phone_screen', 'interview', 'final_interview'];
    const interviewCount = applications.filter(app =>
      interviewStatuses.includes(app.status)
    ).length;
    const interviewRate = totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0;

    // Calculate real average response time
    const applicationsWithResponse = applications.filter(app => {
      const responseStatuses = ['phone_screen', 'interview', 'final_interview', 'offer', 'rejected'];
      return responseStatuses.includes(app.status) && app.dates.applied;
    });

    let avgDays: string | number = 'N/A';
    if (applicationsWithResponse.length > 0) {
      const totalDays = applicationsWithResponse.reduce((sum, app) => {
        const appliedDate = new Date(app.dates.applied);
        const updatedDate = new Date(app.updatedAt);
        const daysDiff = Math.floor((updatedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + daysDiff;
      }, 0);
      avgDays = Math.round(totalDays / applicationsWithResponse.length);
    }

    return {
      totalApplications,
      activeApplications,
      interviewRate,
      averageResponseTime: avgDays
    };
  }, [applications]);

  const recentApplications = useMemo(() => {
    return applications
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [applications]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, {displayName}! 👋
        </h1>
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <Building2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Unable to load dashboard</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8 max-w-6xl mx-auto"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's what's happening with your job search
            </p>
          </div>
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:w-auto"
            leftIcon={<Target className="h-4 w-4" />}
            onClick={() => navigate('/applications')}
          >
            New Application
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5"
      >
        <Card variant="surface" hover="lift" className="border-borderMuted">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stats.totalApplications}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="surface" hover="lift" className="border-borderMuted">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stats.activeApplications}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-600/20 dark:text-success-300">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="surface" hover="lift" className="border-borderMuted">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interview Rate</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stats.interviewRate}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info-100 text-info-600 dark:bg-info-500/20 dark:text-info-300">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="surface" hover="lift" className="border-borderMuted">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">
                  {typeof stats.averageResponseTime === 'number'
                    ? `${stats.averageResponseTime}d`
                    : stats.averageResponseTime}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-100 text-warning-600 dark:bg-warning-600/20 dark:text-warning-300">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Applications */}
      <motion.div variants={itemVariants}>
        <Card
          className="border-borderMuted/35 bg-surface-1/95 shadow-level-1 backdrop-blur supports-[backdrop-filter]:bg-surface-1/85"
        >
          <CardHeader className="pb-4 border-b border-borderMuted/30">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold">Recent Applications</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/applications')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl border border-borderMuted/45 bg-surface-1 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300/60 hover:bg-surface-2/90 hover:shadow-level-1 sm:gap-4"
                  onClick={() => navigate('/applications')}
                >
                  <Avatar
                    fallback={application.job.company.substring(0, 2)}
                    size="default"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {application.job.title}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{application.job.company}</p>
                      {application.job.location && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {application.job.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                    <StatusBadge status={application.status} />
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {dateUtils.formatRelative(application.updatedAt)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary-200/45 bg-surface-2 text-primary-600 dark:border-primary-500/30 dark:bg-surface-3 dark:text-primary-300">
                  <Building2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No applications yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start tracking your job applications to monitor your progress and stay organized.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/applications')}
                  leftIcon={<Target className="w-5 h-5" />}
                >
                  Add Your First Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
