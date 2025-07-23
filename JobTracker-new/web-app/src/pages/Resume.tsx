import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Star,
  MoreVertical,
  Download,
  Trash2,
  Settings,
  TrendingUp,
  Users,
  Target,
  Edit,
  Eye,
  StarOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { ResumeUpload } from '@/components/features/resume/ResumeUpload';
import { ResumePreview } from '@/components/features/resume/ResumePreview';

// Mock resume data
const mockResumes = [
  {
    id: 'resume_1',
    name: 'Alex_Morgan_Software_Engineer_2024.pdf',
    url: 'https://storage.example.com/resumes/alex_morgan_se_2024.pdf',
    type: 'application/pdf',
    size: 2048000, // 2MB
    uploadedAt: new Date('2024-12-20'),
    isDefault: true,
    analytics: {
      views: 47,
      downloads: 12,
      applications: 8
    }
  },
  {
    id: 'resume_2',
    name: 'Alex_Morgan_Principal_Engineer.pdf',
    url: 'https://storage.example.com/resumes/alex_morgan_pe.pdf',
    type: 'application/pdf',
    size: 1856000, // 1.8MB
    uploadedAt: new Date('2024-12-15'),
    isDefault: false,
    analytics: {
      views: 23,
      downloads: 6,
      applications: 3
    }
  }
];

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

export const Resume: React.FC = () => {
  const { addToast } = useToast();
  const [resumes, setResumes] = useState(mockResumes);
  const [showUpload, setShowUpload] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, resumeId: string | null, resumeName: string}>({
    isOpen: false,
    resumeId: null,
    resumeName: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFileUploaded = (uploadedFile: any) => {
    const newResume = {
      id: uploadedFile.id,
      name: uploadedFile.file.name,
      url: uploadedFile.preview || '#',
      type: uploadedFile.file.type,
      size: uploadedFile.file.size,
      uploadedAt: new Date(),
      isDefault: resumes.length === 0,
      analytics: {
        views: 0,
        downloads: 0,
        applications: 0
      }
    };
    setResumes(prev => [...prev, newResume]);
    setShowUpload(false);
  };

  const handleSetDefault = (resumeId: string) => {
    setResumes(prev => 
      prev.map(resume => ({
        ...resume,
        isDefault: resume.id === resumeId
      }))
    );
    addToast({
      title: 'Default resume updated',
      description: 'This resume is now set as your default.',
      type: 'success'
    });
    setOpenDropdownId(null);
  };

  const handleDelete = (resumeId: string) => {
    setResumes(prev => prev.filter(resume => resume.id !== resumeId));
    addToast({
      title: 'Resume deleted',
      description: 'Resume has been removed from your collection.',
      type: 'success'
    });
    setOpenDropdownId(null);
    setDeleteConfirm({ isOpen: false, resumeId: null, resumeName: '' });
  };

  const handleDeleteClick = (resume: any) => {
    setDeleteConfirm({
      isOpen: true,
      resumeId: resume.id,
      resumeName: resume.name
    });
    setOpenDropdownId(null);
  };

  const handleView = (resume: any) => {
    addToast({
      title: 'Opening resume',
      description: `Viewing ${resume.name}`,
      type: 'info'
    });
    setOpenDropdownId(null);
  };

  const handleEdit = (resume: any) => {
    addToast({
      title: 'Edit resume',
      description: 'Resume editing feature coming soon.',
      type: 'info'
    });
    setOpenDropdownId(null);
  };

  const handleDownload = (resume: any) => {
    addToast({
      title: 'Downloading resume',
      description: `${resume.name} download started.`,
      type: 'success'
    });
    setOpenDropdownId(null);
  };

  const toggleDropdown = (resumeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === resumeId ? null : resumeId);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalViews = resumes.reduce((sum, resume) => sum + resume.analytics.views, 0);
  const totalDownloads = resumes.reduce((sum, resume) => sum + resume.analytics.downloads, 0);
  const totalApplications = resumes.reduce((sum, resume) => sum + resume.analytics.applications, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resume Management</h1>
            <p className="text-muted-foreground mt-1">
              Upload, organize, and optimize your resumes for different opportunities
            </p>
          </div>
          <Button 
            onClick={() => setShowUpload(!showUpload)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </div>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover="lift" className="glass border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">{totalViews}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold text-green-600">{totalDownloads}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover="lift" className="glass border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold text-purple-600">{totalApplications}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Area */}
      {showUpload && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload New Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeUpload
                onFileUploaded={handleFileUploaded}
                maxFiles={1}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resume Grid */}
      <motion.div variants={itemVariants}>
        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium truncate" title={resume.name}>
                            {resume.name.length > 30 
                              ? resume.name.substring(0, 30) + '...' 
                              : resume.name
                            }
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {(resume.size / 1024 / 1024).toFixed(2)} MB • 
                            {resume.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {resume.isDefault && (
                          <Badge variant="success" size="sm">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        <div className="relative" ref={dropdownRef}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => toggleDropdown(resume.id, e)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {openDropdownId === resume.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 dropdown-background rounded-lg py-1 z-50">
                              <button
                                onClick={() => handleView(resume)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Resume
                              </button>
                              <button
                                onClick={() => handleEdit(resume)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Resume
                              </button>
                              <button
                                onClick={() => handleDownload(resume)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center transition-colors"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                              {!resume.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(resume.id)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center transition-colors"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Set as Default
                                </button>
                              )}
                              {resume.isDefault && (
                                <button
                                  onClick={() => {
                                    addToast({
                                      title: 'Default resume',
                                      description: 'Cannot unset default resume. Set another resume as default first.',
                                      type: 'info'
                                    });
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center transition-colors text-muted-foreground"
                                >
                                  <StarOff className="w-4 h-4 mr-2" />
                                  Remove Default
                                </button>
                              )}
                              <hr className="my-1 border-border" />
                              <button
                                onClick={() => handleDeleteClick(resume)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Resume
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Analytics */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-blue-600">
                          {resume.analytics.views}
                        </p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">
                          {resume.analytics.downloads}
                        </p>
                        <p className="text-xs text-muted-foreground">Downloads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600">
                          {resume.analytics.applications}
                        </p>
                        <p className="text-xs text-muted-foreground">Used</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(resume)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {!resume.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetDefault(resume.id)}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Set Default
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No resumes uploaded</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Upload your first resume to get started with tracking applications and optimizing your job search.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Resume Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Tailor for Each Role</h4>
                <p className="text-sm text-muted-foreground">
                  Customize your resume for each application by highlighting relevant skills and experience.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Use Keywords</h4>
                <p className="text-sm text-muted-foreground">
                  Include industry-specific keywords from job descriptions to pass ATS screening.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Quantify Achievements</h4>
                <p className="text-sm text-muted-foreground">
                  Use numbers and metrics to demonstrate the impact of your work.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Keep It Current</h4>
                <p className="text-sm text-muted-foreground">
                  Regularly update your resume with new skills, projects, and accomplishments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, resumeId: null, resumeName: '' })}
        onConfirm={() => deleteConfirm.resumeId && handleDelete(deleteConfirm.resumeId)}
        title="Delete Resume"
        description={`Are you sure you want to delete "${deleteConfirm.resumeName}"? This action cannot be undone.`}
        confirmText="Delete Resume"
        cancelText="Cancel"
        variant="destructive"
      />
    </motion.div>
  );
};