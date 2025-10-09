import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  Star,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  StarOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { ResumeUpload, type UploadedFile } from '@/components/features/resume/ResumeUpload';
import { cn } from '@/lib/utils';

// Resume type definition
interface Resume {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  isDefault: boolean;
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

export const Resume: React.FC = () => {
  const { addToast } = useToast();
  const surfaceCardBase =
    "rounded-xl border border-borderMuted bg-surface-1 shadow-sm transition-colors";
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, resumeId: string | null, resumeName: string}>({
    isOpen: false,
    resumeId: null,
    resumeName: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFileUploaded = (uploadedFile: UploadedFile) => {
    const newResume: Resume = {
      id: uploadedFile.id,
      name: uploadedFile.file.name,
      url: uploadedFile.preview || '#',
      type: uploadedFile.file.type,
      size: uploadedFile.file.size,
      uploadedAt: new Date(),
      isDefault: resumes.length === 0
    };
    setResumes(prev => [...prev, newResume]);
    setShowUpload(false);
    addToast({
      title: 'Resume uploaded',
      description: `${uploadedFile.file.name} has been added to your collection.`,
      type: 'success'
    });
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
    const resumeToDelete = resumes.find(r => r.id === resumeId);
    if (resumeToDelete?.isDefault && resumes.length > 1) {
      // Set a new default if we're deleting the default resume
      const newDefault = resumes.find(r => r.id !== resumeId);
      if (newDefault) {
        setResumes(prev => prev.map(r => ({
          ...r,
          isDefault: r.id === newDefault.id
        })).filter(r => r.id !== resumeId));
      }
    } else {
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
    }

    addToast({
      title: 'Resume deleted',
      description: 'Resume has been removed from your collection.',
      type: 'success'
    });
    setOpenDropdownId(null);
    setDeleteConfirm({ isOpen: false, resumeId: null, resumeName: '' });
  };

  const handleDeleteClick = (resume: Resume) => {
    setDeleteConfirm({
      isOpen: true,
      resumeId: resume.id,
      resumeName: resume.name
    });
    setOpenDropdownId(null);
  };

  const handleView = (resume: Resume) => {
    if (resume.url && resume.url !== '#') {
      window.open(resume.url, '_blank');
    } else {
      addToast({
        title: 'Unable to view',
        description: 'Resume preview is not available.',
        type: 'error'
      });
    }
    setOpenDropdownId(null);
  };

  const handleDownload = (resume: Resume) => {
    if (resume.url && resume.url !== '#') {
      const link = document.createElement('a');
      link.href = resume.url;
      link.download = resume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'Downloading resume',
        description: `${resume.name} download started.`,
        type: 'success'
      });
    } else {
      addToast({
        title: 'Unable to download',
        description: 'Resume file is not available.',
        type: 'error'
      });
    }
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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Resume Management</h1>
            <p className="mt-1 text-muted-foreground">
              Upload and manage your resume versions
            </p>
          </div>
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:w-auto"
            onClick={() => setShowUpload(true)}
          >
            <Plus className="h-4 w-4" />
            Upload Resume
          </Button>
        </div>
      </motion.div>

      {/* Resume List */}
      <motion.div variants={itemVariants}>
        {resumes.length > 0 ? (
          <div className="grid gap-4">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                hover="lift"
                className={cn(surfaceCardBase, "transition-transform duration-200 hover:-translate-y-0.5 shadow-level-1")}
              >
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 ring-1 ring-primary-200/60 dark:bg-primary-500/15 dark:text-primary-200 dark:ring-primary-500/20">
                          <FileText className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center space-x-2">
                          <h3 className="truncate text-lg font-semibold text-foreground">
                            {resume.name}
                          </h3>
                          {resume.isDefault && (
                            <Star className="h-4 w-4 flex-shrink-0 text-warning-500" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>Uploaded {formatDate(resume.uploadedAt)}</span>
                          <span>{formatFileSize(resume.size)}</span>
                          {resume.isDefault && (
                            <span className="font-medium text-warning-600 dark:text-warning-400">
                              Default Resume
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => toggleDropdown(resume.id, e)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {openDropdownId === resume.id && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-borderMuted bg-surface-1 shadow-level-2">
                          <div className="py-1">
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
                              onClick={() => handleView(resume)}
                            >
                              <Eye className="h-4 w-4 text-primary-500" />
                              View
                            </button>
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
                              onClick={() => handleDownload(resume)}
                            >
                              <Download className="h-4 w-4 text-success-500" />
                              Download
                            </button>
                            {!resume.isDefault && (
                              <button
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
                                onClick={() => handleSetDefault(resume.id)}
                              >
                                <Star className="h-4 w-4" />
                                Set as Default
                              </button>
                            )}
                            {resume.isDefault && resumes.length > 1 && (
                              <button
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
                                onClick={() => handleSetDefault(resume.id)}
                              >
                                <StarOff className="h-4 w-4" />
                                Remove Default
                              </button>
                            )}
                            <div className="my-1 border-t border-borderMuted/70" />
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-error-600 transition-colors hover:bg-error-50 dark:hover:bg-error-900/30"
                              onClick={() => handleDeleteClick(resume)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card
            variant="surface"
            className={cn(surfaceCardBase, "mt-4")}
          >
            <CardContent className="relative z-10 py-14 sm:py-16">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-borderMuted bg-surface-2 text-muted-foreground">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No resumes yet</h3>
                <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
                  Upload your resume to start applying for jobs. You can manage multiple versions.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowUpload(true)}
                >
                  <Plus className="h-4 w-4" />
                  Upload Your First Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Resume"
        size="lg"
      >
        <ResumeUpload onFileUploaded={handleFileUploaded} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, resumeId: null, resumeName: '' })}
        onConfirm={() => {
          if (deleteConfirm.resumeId) {
            handleDelete(deleteConfirm.resumeId);
          }
          setDeleteConfirm({ isOpen: false, resumeId: null, resumeName: '' });
        }}
        title="Delete Resume"
        description={`Are you sure you want to delete "${deleteConfirm.resumeName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </motion.div>
  );
};
