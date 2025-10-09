import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { cn, dateUtils } from "@/lib/utils";
import type { JobApplication } from "@/types";

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
  className,
}) => {
  const { addToast } = useToast();
  const [showActions, setShowActions] = useState(false);

  const daysSinceLastUpdate = dateUtils.daysBetween(
    application.updatedAt,
    new Date()
  );
  const isRecent = daysSinceLastUpdate <= 7;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card
        variant="surface"
        className={cn(
          "border-borderMuted shadow-sm transition-colors",
          isRecent && "ring-1 ring-info-300/50 dark:ring-info-500/30",
          className
        )}
      >
        <CardContent className="space-y-5">
          <div className="flex items-start gap-4">
            <Avatar
              fallback={application.job.company.substring(0, 2)}
              size="lg"
              className="flex-shrink-0 bg-surface-3 text-foreground"
            />

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <button
                    className="group flex min-w-0 flex-1 text-left"
                    onClick={() => onViewDetails?.(application)}
                  >
                    <h3 className="truncate text-lg font-semibold text-foreground transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-300">
                      {application.job.title}
                    </h3>
                  </button>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {application.job.company}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {isRecent && (
                    <Badge variant="info" size="sm">
                      New
                    </Badge>
                  )}
                  <StatusBadge status={application.status} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground/80" />
                  <span className="truncate">{application.job.location}</span>
                </span>
                {application.job.salary && (
                  <span className="flex items-center gap-1.5 min-w-0">
                    <DollarSign className="h-4 w-4 flex-shrink-0 text-muted-foreground/80" />
                    <span className="truncate">{application.job.salary}</span>
                  </span>
                )}
                <Badge variant="secondary" size="sm">
                  {application.job.workArrangement}
                </Badge>
              </div>

              <div className="flex items-center justify-between border-t border-borderMuted/80 pt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground/80" />
                  <span>
                    Applied {dateUtils.formatRelative(application.dates.applied)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(application)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  {application.job.url && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(application.job.url, "_blank", "noopener");
                      }}
                      title="Open job posting"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions((prev) => !prev);
                      }}
                      aria-haspopup="menu"
                      aria-expanded={showActions}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {showActions && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-lg border border-borderMuted bg-surface-1 shadow-level-2"
                        >
                          <div className="py-1">
                            <button
                              className="flex w-full items-center px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onArchive?.(application.id);
                                setShowActions(false);
                              }}
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </button>
                            <button
                              className="flex w-full items-center px-4 py-2 text-left text-sm text-error-600 transition-colors hover:bg-error-50 dark:hover:bg-error-900/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(application.id);
                                setShowActions(false);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </motion.div>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActions(false)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
