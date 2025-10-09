import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  File
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { FILE_UPLOAD } from '@/lib/constants';

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface ResumeUploadProps {
  onFileUploaded?: (file: UploadedFile) => void;
  onFileRemoved?: (fileId: string) => void;
  maxFiles?: number;
  className?: string;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onFileUploaded,
  onFileRemoved,
  maxFiles = 3,
  className
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Simulate file upload with progress
  const simulateUpload = useCallback((file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 100);

      // Complete upload after 1 second
      setTimeout(() => {
        clearInterval(interval);
        const completedFile = {
          ...uploadedFile,
          status: 'success' as const,
          progress: 100,
          preview: `https://storage.example.com/resumes/${file.name}`
        };

        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id ? completedFile : f
          )
        );

        onFileUploaded?.(completedFile);
        resolve(completedFile);
      }, 1000);
    });
  }, [onFileUploaded]);

  // Haptic feedback utility
  const triggerHapticFeedback = (type: 'success' | 'error' | 'warning' = 'success') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'success':
          navigator.vibrate([50, 30, 50]); // Short-pause-short pattern
          break;
        case 'error':
          navigator.vibrate([200, 50, 200]); // Long-pause-long pattern
          break;
        case 'warning':
          navigator.vibrate([100]); // Single medium vibration
          break;
      }
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsDragActive(false);
    triggerHapticFeedback('warning'); // Feedback for file drop
    
    for (const file of acceptedFiles.slice(0, maxFiles - uploadedFiles.length)) {
      // Validate file type
      if (!FILE_UPLOAD.allowedTypes.resume.includes(file.type)) {
        const errorFile: UploadedFile = {
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          status: 'error',
          progress: 0,
          error: 'Invalid file type. Please upload PDF, DOC, or DOCX files.'
        };
        setUploadedFiles(prev => [...prev, errorFile]);
        triggerHapticFeedback('error');
        continue;
      }

      // Validate file size
      if (file.size > FILE_UPLOAD.maxSize) {
        const errorFile: UploadedFile = {
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          status: 'error',
          progress: 0,
          error: 'File too large. Maximum size is 10MB.'
        };
        setUploadedFiles(prev => [...prev, errorFile]);
        triggerHapticFeedback('error');
        continue;
      }

      try {
        await simulateUpload(file);
        triggerHapticFeedback('success');
      } catch (error) {
        triggerHapticFeedback('error');
      }
    }
  }, [maxFiles, uploadedFiles.length, simulateUpload]);

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled: uploadedFiles.length >= maxFiles
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    triggerHapticFeedback('warning');
    onFileRemoved?.(fileId);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return <FileText className="w-6 h-6 text-red-500" />;
    return <File className="w-6 h-6 text-blue-500" />;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Area */}
      <Card 
        className={cn(
          "transition-all duration-300 border-2 border-dashed cursor-pointer",
          (isDragActive || dropzoneActive) 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/30 hover:border-primary/50",
          uploadedFiles.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <CardContent 
          {...getRootProps()}
          className="p-8 text-center"
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              isDragActive ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Upload className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive ? "Drop your resume here" : "Upload your resume"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {uploadedFiles.length >= maxFiles 
                  ? `Maximum ${maxFiles} files allowed`
                  : "Drag & drop your resume or click to browse"
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOC, DOCX • Max 10MB per file
              </p>
            </div>

            {uploadedFiles.length < maxFiles && (
              <Button variant="outline" size="sm" type="button">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-foreground">
              Uploaded Files ({uploadedFiles.length}/{maxFiles})
            </h4>
            
            {uploadedFiles.map((uploadedFile) => (
              <motion.div
                key={uploadedFile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(uploadedFile.file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {uploadedFile.status === 'uploading' && (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      )}
                      {uploadedFile.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {uploadedFile.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <Badge variant={
                        uploadedFile.status === 'success' ? 'success' :
                        uploadedFile.status === 'error' ? 'destructive' : 'secondary'
                      }>
                        {uploadedFile.status === 'uploading' ? 'Uploading...' :
                         uploadedFile.status === 'success' ? 'Ready' : 'Error'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    {uploadedFile.status === 'uploading' && (
                      <span>{uploadedFile.progress}%</span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {uploadedFile.status === 'uploading' && (
                    <Progress 
                      value={uploadedFile.progress} 
                      className="mt-2 h-1"
                      variant="default"
                    />
                  )}

                  {/* Error Message */}
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <p className="mt-1 text-xs text-red-500">{uploadedFile.error}</p>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(uploadedFile.id)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
