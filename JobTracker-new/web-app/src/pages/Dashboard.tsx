import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Clock,
  MapPin,
  Building2,
  CheckCircle,
  Clock3
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/Progress';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockUserProfile, mockJobApplications, mockDashboardMetrics } from '@/lib/mockData';
import { jobUtils, dateUtils } from '@/lib/utils';

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
  const profileCompleteness = jobUtils.calculateProfileCompleteness(mockUserProfile);
  const recentApplications = mockJobApplications.slice(0, 3);
  const stats = mockDashboardMetrics;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, {mockUserProfile.personalInfo.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your job search
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto h-11 sm:h-10"
            onClick={() => navigate('/applications')}
          >
            <Target className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hover="lift" className="glass border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeApplications}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interview Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.interviewRate}%</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-600">{stats.averageResponseTime} days</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Completeness */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Completeness
                <Badge variant="success">{profileCompleteness}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <CircularProgress
                value={profileCompleteness}
                showValue
                variant="success"
                size="lg"
              />
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Personal Info</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Experience</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Skills</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Education</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-11 sm:h-10"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Applications */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Applications
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-3"
                  onClick={() => navigate('/applications')}
                >
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <Avatar
                    fallback={application.job.company.substring(0, 2)}
                    size="default"
                    className="bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {application.job.title}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 space-y-1 sm:space-y-0">
                      <p className="text-sm text-muted-foreground">{application.job.company}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {application.job.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <StatusBadge status={application.status} />
                    <div className="text-xs text-muted-foreground">
                      {dateUtils.formatRelative(application.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock3 className="w-5 h-5 mr-2" />
                Recent Activity
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3"
                onClick={() => navigate('/analytics')}
              >
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">All</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dateUtils.formatRelative(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};