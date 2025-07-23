import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Building2,
  Calendar,
  Award,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Area,
  AreaChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Line, 
  Bar,
  Cell,
  Pie,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { mockJobApplications, mockDashboardMetrics } from '@/lib/mockData';
import { dateUtils } from '@/lib/utils';

// Generate analytics data
const generateAnalyticsData = () => {
  const applications = mockJobApplications;
  
  // Monthly application trend
  const monthlyTrend: { month: string; applications: number; interviews: number; offers: number }[] = [];
  const months = ['Oct', 'Nov', 'Dec'];
  months.forEach((month, index) => {
    const count = Math.floor(Math.random() * 8) + 2;
    monthlyTrend.push({
      month,
      applications: count,
      interviews: Math.floor(count * 0.6),
      offers: Math.floor(count * 0.2)
    });
  });

  // Status distribution
  const statusDistribution = [
    { name: 'Applied', value: 3, color: '#3b82f6' },
    { name: 'Under Review', value: 2, color: '#f59e0b' },
    { name: 'Interview', value: 3, color: '#8b5cf6' },
    { name: 'Offer', value: 1, color: '#10b981' },
    { name: 'Rejected', value: 2, color: '#ef4444' }
  ];

  // Response time data
  const responseTimeData = [
    { range: '0-3 days', count: 4, percentage: 36 },
    { range: '4-7 days', count: 3, percentage: 27 },
    { range: '8-14 days', count: 2, percentage: 18 },
    { range: '15+ days', count: 2, percentage: 18 }
  ];

  // Company performance
  const companyPerformance = [
    { company: 'Apple', applications: 1, interviews: 0, offers: 0, rate: 0 },
    { company: 'Uber', applications: 1, interviews: 1, offers: 1, rate: 100 },
    { company: 'Coinbase', applications: 1, interviews: 1, offers: 0, rate: 100 },
    { company: 'OpenAI', applications: 1, interviews: 1, offers: 0, rate: 100 },
    { company: 'Airbnb', applications: 1, interviews: 1, offers: 0, rate: 100 }
  ];

  // Weekly activity
  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    weeklyActivity.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      applications: Math.floor(Math.random() * 3),
      interviews: Math.floor(Math.random() * 2)
    });
  }

  return {
    monthlyTrend,
    statusDistribution,
    responseTimeData,
    companyPerformance,
    weeklyActivity
  };
};

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

export const Analytics: React.FC = () => {
  const { addToast } = useToast();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'applications' | 'interviews' | 'offers'>('applications');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const analyticsData = useMemo(() => generateAnalyticsData(), [timeRange]);
  const stats = mockDashboardMetrics;

  const chartColors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    purple: '#8b5cf6'
  };

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(range);
    addToast({
      title: 'Time range updated',
      description: `Analytics data filtered for ${range === '7d' ? 'last 7 days' : range === '30d' ? 'last 30 days' : range === '90d' ? 'last 90 days' : 'last year'}`,
      type: 'info'
    });
  };

  const handleExportData = () => {
    addToast({
      title: 'Export started',
      description: 'Your analytics data will be ready for download shortly.',
      type: 'info'
    });
    // Simulate export process
    setTimeout(() => {
      addToast({
        title: 'Export complete',
        description: 'Analytics data has been exported successfully.',
        type: 'success'
      });
    }, 2000);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    addToast({
      title: 'Refreshing data',
      description: 'Updating analytics with latest information...',
      type: 'info'
    });
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        title: 'Data refreshed',
        description: 'Analytics have been updated with the latest data.',
        type: 'success'
      });
    }, 1500);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Track your job search performance and identify improvement opportunities
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center border rounded-lg p-1 w-full sm:w-auto">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleTimeRangeChange(range)}
                  className="h-10 sm:h-8 flex-1 sm:flex-none"
                >
                  {range}
                </Button>
              ))}
            </div>
            <div className="flex space-x-2 sm:space-x-3">
              <Button 
                variant="outline" 
                className="h-10 sm:h-9 flex-1 sm:flex-none"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                className="h-10 sm:h-9 flex-1 sm:flex-none"
                onClick={handleRefreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hover="lift" className="glass border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.interviewRate}%</p>
                <p className="text-xs text-green-600 mt-1">↑ +12% from last month</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.responseRate}%</p>
                <p className="text-xs text-green-600 mt-1">↑ +8% from last month</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.averageResponseTime}d</p>
                <p className="text-xs text-red-600 mt-1">↑ +1d from last month</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.activeApplications}</p>
                <p className="text-xs text-green-600 mt-1">↑ +3 from last month</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Monthly Trend */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <LineChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-base sm:text-lg">Application Trend</span>
                </div>
                <Badge variant="secondary" className="self-start">Last 3 months</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <AreaChart data={analyticsData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#666" 
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    tickMargin={8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    stroke={chartColors.primary}
                    fill={chartColors.primary}
                    fillOpacity={0.1}
                    name="Applications"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interviews" 
                    stroke={chartColors.success}
                    fill={chartColors.success}
                    fillOpacity={0.1}
                    name="Interviews"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="offers" 
                    stroke={chartColors.warning}
                    fill={chartColors.warning}
                    fillOpacity={0.1}
                    name="Offers"
                    strokeWidth={2}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-base sm:text-lg">Application Status</span>
                </div>
                <Badge variant="secondary" className="self-start">Current</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <RechartsPieChart>
                  <Pie
                    data={analyticsData.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    className="sm:inner-radius-[60] sm:outer-radius-[120]"
                  >
                    {analyticsData.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Response Time Analysis */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-base sm:text-lg">Response Time Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <RechartsBarChart data={analyticsData.responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="range" 
                    stroke="#666"
                    fontSize={12}
                    tickMargin={8}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickMargin={8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill={chartColors.primary} 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {analyticsData.responseTimeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-xs sm:text-sm">{item.range}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={item.percentage} className="w-16 sm:w-20 h-2" />
                      <span className="text-muted-foreground text-xs sm:text-sm w-8 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-base sm:text-lg">Weekly Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <RechartsBarChart data={analyticsData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666"
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickMargin={8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="applications" 
                    fill={chartColors.primary} 
                    radius={[4, 4, 0, 0]} 
                    name="Applications"
                    maxBarSize={40}
                  />
                  <Bar 
                    dataKey="interviews" 
                    fill={chartColors.success} 
                    radius={[4, 4, 0, 0]} 
                    name="Interviews"
                    maxBarSize={40}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Company Performance */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Company Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.companyPerformance.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {company.company.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{company.company}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.applications} applications • {company.interviews} interviews
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Interview Rate</p>
                      <p className="text-lg font-bold" style={{ color: company.rate > 50 ? chartColors.success : chartColors.error }}>
                        {company.rate}%
                      </p>
                    </div>
                    <Progress value={company.rate} className="w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights & Recommendations */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900">🎯 Best Performing Strategy</h4>
                  <p className="text-sm text-blue-700 mt-2">
                    Applications to fintech companies have a 100% interview rate. Consider focusing more on this sector.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900">📈 Improvement Opportunity</h4>
                  <p className="text-sm text-green-700 mt-2">
                    Your response rate is 91% - significantly above average. Keep up the quality applications!
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900">⏰ Timing Insight</h4>
                  <p className="text-sm text-purple-700 mt-2">
                    Applications submitted on Tuesday-Thursday get 40% faster responses than weekend applications.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-900">🔧 Resume Optimization</h4>
                  <p className="text-sm text-orange-700 mt-2">
                    Your AI-powered resume matches are averaging 85%. Consider adding more keywords from job descriptions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};