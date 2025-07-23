import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Share2,
  ExternalLink,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface ResumeFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  isDefault?: boolean;
}

interface ResumePreviewProps {
  resume: ResumeFile;
  className?: string;
  showActions?: boolean;
  onEdit?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onSetDefault?: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  className,
  showActions = true,
  onEdit,
  onDownload,
  onShare,
  onSetDefault
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    // In a real app, this would download the actual file
    const link = document.createElement('a');
    link.href = resume.url;
    link.download = resume.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload?.();
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: resume.name,
        url: resume.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(resume.url);
    }
    onShare?.();
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const resetZoom = () => setZoom(100);

  return (
    <>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span className="truncate">{resume.name}</span>
              {resume.isDefault && (
                <Badge variant="success" size="sm">Default</Badge>
              )}
            </CardTitle>
            
            {showActions && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(true)}
                  className="h-8 w-8"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="h-8 w-8"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="h-8 w-8"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{(resume.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>Uploaded {resume.uploadedAt.toLocaleDateString()}</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Preview Area */}
          <div className="relative bg-muted/20 min-h-[400px] flex items-center justify-center">
            {resume.type === 'application/pdf' ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium">PDF Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    Click to view full document
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View PDF</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Document Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {resume.type.includes('word') ? 'Word Document' : 'Document'} preview
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="p-4 border-t bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {!resume.isDefault && (
                    <Button variant="outline" size="sm" onClick={onSetDefault}>
                      Set as Default
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Button variant="ghost" size="icon" onClick={zoomOut} disabled={zoom <= 50}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="min-w-[3rem] text-center">{zoom}%</span>
                  <Button variant="ghost" size="icon" onClick={zoomIn} disabled={zoom >= 200}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={resetZoom}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <h3 className="font-medium truncate">{resume.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Button variant="ghost" size="icon" onClick={zoomOut} disabled={zoom <= 50}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="min-w-[3rem] text-center">{zoom}%</span>
                  <Button variant="ghost" size="icon" onClick={zoomIn} disabled={zoom >= 200}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={resetZoom}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsFullscreen(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>

            {/* Fullscreen Content */}
            <div className="h-full bg-gray-100 flex items-center justify-center">
              {resume.type === 'application/pdf' ? (
                <iframe
                  src={`${resume.url}#zoom=${zoom}`}
                  className="w-full h-full"
                  title={resume.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Document Preview</h3>
                    <p className="text-muted-foreground">
                      Full preview not available for this file type
                    </p>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};