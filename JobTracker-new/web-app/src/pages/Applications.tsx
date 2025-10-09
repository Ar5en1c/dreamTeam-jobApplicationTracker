import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  ArrowUpDown,
  Calendar,
  Building2,
  TrendingUp,
  Clock,
  Target,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ApplicationCard } from '@/components/features/applications/ApplicationCard';
import { ApplicationFilters } from '@/components/features/applications/ApplicationFilters';
import { ApplicationModal } from '@/components/features/applications/ApplicationModal';
import { ConfirmModal } from '@/components/ui/Modal';
import { useJobApplications } from '@/hooks/useJobApplications';
import { cn } from '@/lib/utils';
import type { JobApplication, ApplicationStatus, WorkArrangement, CompanySize } from '@/types';

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'company' | 'status';

interface FilterOptions {
  search: string;
  statuses: ApplicationStatus[];
  companies: string[];
  locations: string[];
  workArrangements: WorkArrangement[];
  companySizes: CompanySize[];
  salaryRange: { min: number; max: number };
  dateRange: { start: Date | null; end: Date | null };
  tags: string[];
}

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

export const Applications: React.FC = () => {
  const { addToast } = useToast();
  const { 
    applications, 
    loading, 
    error, 
    createApplication, 
    updateApplication, 
    deleteApplication,
    isUsingMockData 
  } = useJobApplications();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; applicationId: string | null }>({ isOpen: false, applicationId: null });
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    statuses: [],
    companies: [],
    locations: [],
    workArrangements: [],
    companySizes: [],
    salaryRange: { min: 0, max: 500000 },
    dateRange: { start: null, end: null },
    tags: []
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => ({
    companies: [...new Set(applications.map(app => app.job.company))],
    locations: [...new Set(applications.map(app => app.job.location))],
    tags: [...new Set(applications.flatMap(app => app.tags || []))]
  }), [applications]);

  // Apply filters and sorting
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter(app => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          app.job.title,
          app.job.company,
          app.job.location,
          app.job.description,
          ...(app.tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(app.status)) {
        return false;
      }

      // Company filter
      if (filters.companies.length > 0 && !filters.companies.includes(app.job.company)) {
        return false;
      }

      // Location filter
      if (filters.locations.length > 0 && !filters.locations.includes(app.job.location)) {
        return false;
      }

      // Work arrangement filter
      if (filters.workArrangements.length > 0 && app.job.workArrangement && !filters.workArrangements.includes(app.job.workArrangement)) {
        return false;
      }

      // Company size filter
      if (filters.companySizes.length > 0 && app.job.companySize && !filters.companySizes.includes(app.job.companySize)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => app.tags?.includes(tag));
        if (!hasTag) return false;
      }

      // Date range filter
      if (filters.dateRange.start && app.dates.applied < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && app.dates.applied > filters.dateRange.end) {
        return false;
      }

      return true;
    });

    // Sort applications
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'company':
          comparison = a.job.company.localeCompare(b.job.company);
          break;
        case 'status':
          const statusOrder = ['offer', 'final_interview', 'interview', 'phone_screen', 'under_review', 'applied', 'rejected', 'withdrawn'];
          comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [applications, filters, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredAndSortedApplications.length;
    const active = filteredAndSortedApplications.filter(app => 
      !['rejected', 'withdrawn', 'expired'].includes(app.status)
    ).length;
    const interviews = filteredAndSortedApplications.filter(app => 
      ['interview', 'final_interview', 'phone_screen'].includes(app.status)
    ).length;
    const offers = filteredAndSortedApplications.filter(app => 
      app.status === 'offer'
    ).length;

    return { total, active, interviews, offers };
  }, [filteredAndSortedApplications]);

  const handleSort = (sortOption: SortOption) => {
    if (sortBy === sortOption) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortOption);
      setSortOrder('desc');
    }
  };

  const handleDelete = (applicationId: string) => {
    setDeleteModal({ isOpen: true, applicationId });
  };

  const confirmDelete = async () => {
    if (deleteModal.applicationId) {
      const success = await deleteApplication(deleteModal.applicationId);
      if (success) {
        addToast({
          title: 'Application deleted',
          description: 'The application has been successfully removed.',
          type: 'success'
        });
      } else {
        addToast({
          title: 'Delete failed',
          description: 'Failed to delete the application. Please try again.',
          type: 'error'
        });
      }
    }
    setDeleteModal({ isOpen: false, applicationId: null });
  };

  const handleArchive = async (applicationId: string) => {
    const success = await updateApplication(applicationId, { status: 'withdrawn' });
    if (success) {
      addToast({
        title: 'Application archived',
        description: 'The application has been marked as withdrawn.',
        type: 'success'
      });
    } else {
      addToast({
        title: 'Archive failed',
        description: 'Failed to archive the application. Please try again.',
        type: 'error'
      });
    }
  };

  const handleEdit = (application: JobApplication) => {
    setSelectedApplication(application);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedApplication(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    const exportData = filteredAndSortedApplications.map(app => ({
      'Job Title': app.job.title,
      'Company': app.job.company,
      'Location': app.job.location,
      'Status': app.status,
      'Applied Date': app.dates.applied.toLocaleDateString(),
      'Last Updated': app.updatedAt.toLocaleDateString(),
      'Salary': app.job.salary || 'Not specified',
      'Work Arrangement': app.job.workArrangement,
      'Company Size': app.job.companySize || 'Not specified',
      'Application Link': app.job.url || 'Not provided',
      'Notes': app.notes || 'No notes'
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = (row as any)[header] || '';
          // Escape quotes and wrap in quotes if contains comma
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Export completed',
      description: `Successfully exported ${exportData.length} applications to CSV file.`,
      type: 'success'
    });
  };

  const handleSaveApplication = async (applicationData: Partial<JobApplication>) => {
    if (modalMode === 'create') {
      const success = await createApplication(applicationData);
      if (success) {
        addToast({
          title: 'Application created',
          description: `Successfully added application for ${applicationData.job?.title} at ${applicationData.job?.company}.`,
          type: 'success'
        });
      } else {
        addToast({
          title: 'Creation failed',
          description: 'Failed to create application. Please try again.',
          type: 'error'
        });
      }
    } else if (selectedApplication) {
      const success = await updateApplication(selectedApplication.id, applicationData);
      if (success) {
        addToast({
          title: 'Application updated',
          description: 'Your changes have been saved successfully.',
          type: 'success'
        });
      } else {
        addToast({
          title: 'Update failed',
          description: 'Failed to update application. Please try again.',
          type: 'error'
        });
      }
    }
    setIsModalOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <Building2 className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Failed to load applications</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">{error}</p>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Job Applications</h1>
            <p className="mt-1 text-muted-foreground">
              Track and manage your job search progress
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleExportData}
              disabled={filteredAndSortedApplications.length === 0}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateNew}
            >
              <Plus className="h-4 w-4" />
              Add Application
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5"
      >
        <Card variant="surface" hover="lift" className="border-borderMuted">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stats.total}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stats.active}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-600/20 dark:text-success-300">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="surface" hover="lift" className="border-borderMuted">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stats.interviews}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info-100 text-info-600 dark:bg-info-500/20 dark:text-info-300">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="surface" hover="lift" className="border-borderMuted">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offers</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stats.offers}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-100 text-warning-600 dark:bg-warning-600/20 dark:text-warning-300">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <ApplicationFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableCompanies={filterOptions.companies}
          availableLocations={filterOptions.locations}
          availableTags={filterOptions.tags}
        />
      </motion.div>

      {/* Controls */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedApplications.length} of {applications.length} applications
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Sort Controls */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('date')}
                className={cn(
                  "h-9 px-3 text-sm",
                  sortBy === 'date'
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-600/20 dark:text-primary-200"
                    : "text-muted-foreground"
                )}
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Date</span>
                {sortBy === 'date' && <ArrowUpDown className="ml-1 h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('company')}
                className={cn(
                  "h-9 px-3 text-sm",
                  sortBy === 'company'
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-600/20 dark:text-primary-200"
                    : "text-muted-foreground"
                )}
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Company</span>
                {sortBy === 'company' && <ArrowUpDown className="ml-1 h-3 w-3" />}
              </Button>
              {/* AI Match sorting removed - feature not yet implemented */}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-borderMuted bg-surface-1 p-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={cn(
                  viewMode === 'grid'
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-600/20 dark:text-primary-200"
                    : "text-muted-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={cn(
                  viewMode === 'list'
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-600/20 dark:text-primary-200"
                    : "text-muted-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Applications Grid/List */}
      <motion.div variants={itemVariants}>
        {filteredAndSortedApplications.length > 0 ? (
          <div className={cn(
            "gap-4 sm:gap-6",
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr" 
              : "space-y-3 sm:space-y-4"
          )}>
            {filteredAndSortedApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card variant="premium" className="text-center py-12">
            <CardContent className="pt-0">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary-200/60 bg-surface-2 text-primary-600 dark:border-primary-500/30 dark:bg-surface-3 dark:text-primary-300">
                  <Building2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {applications.length === 0
                      ? 'Start tracking your job applications to monitor your progress and optimize your search.'
                      : 'Try adjusting your filters to see more results.'
                    }
                  </p>
                </div>
                {applications.length === 0 && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleCreateNew}
                    leftIcon={<Plus className="w-5 h-5" />}
                  >
                    Add Your First Application
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApplication}
        application={selectedApplication}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, applicationId: null })}
        onConfirm={confirmDelete}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </motion.div>
  );
};
