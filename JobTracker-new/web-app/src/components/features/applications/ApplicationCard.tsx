import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  FileText,
  MessageSquare,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { cn, dateUtils } from '@/lib/utils';
import type { JobApplication } from '@/types';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit?: (application: JobApplication) => void;
  onDelete?: (applicationId: string) => void;
  onArchive?: (applicationId: string) => void;
  onViewDetails?: (application: JobApplication) => void;
  className?: string;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onArchive,
  onViewDetails,
  className
}) => {
  const { addToast } = useToast();
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offer': return 'text-green-600 bg-green-50';
      case 'final_interview': return 'text-purple-600 bg-purple-50';
      case 'interview': return 'text-orange-600 bg-orange-50';
      case 'phone_screen': return 'text-blue-600 bg-blue-50';
      case 'under_review': return 'text-yellow-600 bg-yellow-50';
      case 'applied': return 'text-blue-600 bg-blue-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'withdrawn': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'applied': return 15;
      case 'under_review': return 30;
      case 'phone_screen': return 45;
      case 'interview': return 60;
      case 'final_interview': return 80;
      case 'offer': return 100;
      case 'rejected': return 0;
      case 'withdrawn': return 0;
      default: return 10;
    }
  };

  const daysSinceLastUpdate = dateUtils.daysBetween(application.updatedAt, new Date());
  const isRecent = daysSinceLastUpdate <= 7;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-lg h-full flex flex-col",
          isRecent && "ring-2 ring-blue-200"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <Avatar
                fallback={application.job.company.substring(0, 2)}
                size="lg"
                className="bg-gradient-to-br from-blue-500 to-purple-500 text-white flex-shrink-0"
              />
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <button 
                    className="text-left flex-1 min-w-0 mr-2"
                    onClick={() => onViewDetails?.(application)}
                  >
                    <h3 className="font-semibold text-base sm:text-lg text-foreground truncate hover:text-primary transition-colors">
                      {application.job.title}
                    </h3>
                  </button>
                  {isRecent && (
                    <Badge variant="secondary" size="sm">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col space-y-1 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center min-w-0">
                    <Building2 className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="font-medium truncate">{application.job.company}</span>
                  </div>
                  <div className="flex items-center min-w-0">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{application.job.location}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={application.status} className="shrink-0" />
                  </div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    {application.job.salary && (
                      <Badge variant="outline" size="sm" className="shrink-0">
                        <DollarSign className="w-3 h-3 mr-1" />
                        <span className="text-xs truncate">{application.job.salary}</span>
                      </Badge>
                    )}
                    <Badge variant="outline" size="sm" className="shrink-0">
                      {application.job.workArrangement}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative flex-shrink-0">
              <Button
                variant="ghost"
                size="touch"
                className="h-10 w-10 sm:h-8 sm:w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-1 w-48 dropdown-background rounded-lg shadow-xl z-20"
                >
                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-muted text-left transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(application);
                        setShowActions(false);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Application
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-muted text-left transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive?.(application.id);
                        setShowActions(false);
                      }}
                    >
                      <Archive className="w-4 h-4 mr-3" />
                      Archive
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-muted hover:text-red-700 text-left transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(application.id);
                        setShowActions(false);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-grow">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Application Progress</span>
              <span className="font-medium">{getProgressPercentage(application.status)}%</span>
            </div>
            <Progress 
              value={getProgressPercentage(application.status)} 
              variant={application.status === 'rejected' ? 'destructive' : 'default'}
              className="h-2"
            />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-3 bg-muted/20 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Applied</p>
              <p className="text-xs sm:text-sm font-medium truncate">
                {dateUtils.formatRelative(application.dates.applied)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground">Last Update</p>
              <p className="text-xs sm:text-sm font-medium truncate">
                {dateUtils.formatRelative(application.updatedAt)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Match Score</p>
              <p className="text-xs sm:text-sm font-medium">
                {application.aiInsights?.matchScore || 0}%
              </p>
            </div>
          </div>

          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {application.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
              {application.tags.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{application.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {application.documents.resume && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (application.documents.resume?.url) {
                      window.open(application.documents.resume.url, '_blank');
                    } else {
                      addToast({
                        title: 'Resume not available',
                        description: 'No resume file has been uploaded for this application.',
                        type: 'warning'
                      });
                    }
                  }}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Resume
                </Button>
              )}
              {application.dates.interviews && application.dates.interviews.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToast({
                      title: 'Interview details',
                      description: `Viewing ${application.dates.interviews.length} interview(s) for ${application.job.title}`,
                      type: 'info'
                    });
                  }}
                >
                  <Users className="w-4 h-4 mr-1" />
                  Interviews ({application.dates.interviews.length})
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {application.notes && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToast({
                      title: 'Application notes',
                      description: `Viewing notes for ${application.job.title} at ${application.job.company}`,
                      type: 'info'
                    });
                  }}
                  title="View Notes"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  if (application.job.url) {
                    window.open(application.job.url, '_blank');
                  } else {
                    addToast({
                      title: 'Job posting unavailable',
                      description: 'No job posting URL is available for this application.',
                      type: 'warning'
                    });
                  }
                }}
                title="Open Job Posting"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          {application.statusHistory && application.statusHistory.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Recent Activity</p>
              <div className="space-y-1">
                {application.statusHistory.slice(-2).reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-muted-foreground truncate">
                      {entry.notes || `Status changed to ${entry.status}`}
                    </span>
                    <span className="text-muted-foreground">
                      {dateUtils.formatRelative(entry.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowActions(false)}
        />
      )}
    </motion.div>
  );
};