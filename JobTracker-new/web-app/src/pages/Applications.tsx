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
import { mockJobApplications } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import type { JobApplication, ApplicationStatus, WorkArrangement, CompanySize } from '@/types';

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'company' | 'status' | 'match';

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
  const [applications, setApplications] = useState<JobApplication[]>(mockJobApplications);
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
        case 'match':
          comparison = (a.aiInsights?.matchScore || 0) - (b.aiInsights?.matchScore || 0);
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

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  const handleDelete = (applicationId: string) => {
    setDeleteModal({ isOpen: true, applicationId });
  };

  const confirmDelete = () => {
    if (deleteModal.applicationId) {
      setApplications(prev => prev.filter(app => app.id !== deleteModal.applicationId));
      setDeleteModal({ isOpen: false, applicationId: null });
      addToast({
        title: 'Application deleted',
        description: 'The job application has been permanently removed.',
        type: 'success'
      });
    }
  };

  const handleArchive = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'withdrawn' as ApplicationStatus, updatedAt: new Date() }
        : app
    ));
    addToast({
      title: 'Application archived',
      description: 'The job application has been moved to withdrawn status.',
      type: 'info'
    });
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

  const handleSaveApplication = (applicationData: Partial<JobApplication>) => {
    if (modalMode === 'create') {
      const newApplication: JobApplication = {
        ...applicationData as JobApplication,
        id: `app-${Date.now()}`,
        userId: 'current-user',
        dates: {
          applied: new Date(),
          lastUpdated: new Date(),
          interviews: [],
          responses: []
        },
        documents: {
          resume: undefined,
          coverLetter: undefined,
          others: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setApplications(prev => [newApplication, ...prev]);
      addToast({
        title: 'Application created',
        description: `Successfully added application for ${applicationData.job?.title} at ${applicationData.job?.company}.`,
        type: 'success'
      });
    } else {
      setApplications(prev => prev.map(app => 
        app.id === selectedApplication?.id 
          ? { ...app, ...applicationData, updatedAt: new Date() }
          : app
      ));
      addToast({
        title: 'Application updated',
        description: 'Your changes have been saved successfully.',
        type: 'success'
      });
    }
    setIsModalOpen(false);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Job Applications</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your job search progress
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="outline" 
              size="default"
              onClick={handleExportData}
              disabled={filteredAndSortedApplications.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleCreateNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hover="lift" className="glass border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold text-purple-600">{stats.interviews}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offers</p>
                <p className="text-2xl font-bold text-orange-600">{stats.offers}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
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
                className={cn(sortBy === 'date' && "bg-muted", "h-9 px-3")}
              >
                <Calendar className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Date</span>
                {sortBy === 'date' && <ArrowUpDown className="w-3 h-3 ml-1" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('company')}
                className={cn(sortBy === 'company' && "bg-muted", "h-9 px-3")}
              >
                <Building2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Company</span>
                {sortBy === 'company' && <ArrowUpDown className="w-3 h-3 ml-1" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('match')}
                className={cn(sortBy === 'match' && "bg-muted", "h-9 px-3")}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Match</span>
                {sortBy === 'match' && <ArrowUpDown className="w-3 h-3 ml-1" />}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="touch"
                onClick={() => setViewMode('grid')}
                className="h-10 w-10 sm:h-8 sm:w-8"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="touch"
                onClick={() => setViewMode('list')}
                className="h-10 w-10 sm:h-8 sm:w-8"
              >
                <List className="w-4 h-4" />
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
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {applications.length === 0 
                      ? 'Start tracking your job applications to monitor your progress and optimize your search.'
                      : 'Try adjusting your filters to see more results.'
                    }
                  </p>
                </div>
                {applications.length === 0 && (
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={handleCreateNew}
                  >
                    <Plus className="w-4 h-4 mr-2" />
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