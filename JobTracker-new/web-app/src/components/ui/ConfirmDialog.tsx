import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  isLoading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && !isLoading) {
      handleConfirm();
    }
  };

  const variantConfig = {
    destructive: {
      iconColor: 'text-red-500',
      confirmVariant: 'destructive' as const
    },
    warning: {
      iconColor: 'text-yellow-500',
      confirmVariant: 'outline' as const
    },
    info: {
      iconColor: 'text-blue-500',
      confirmVariant: 'default' as const
    }
  };

  const config = variantConfig[variant];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{
              duration: 0.3,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className={cn(
              "overflow-hidden rounded-2xl border border-borderMuted/50",
              "bg-gradient-to-b from-surface-1/95 via-surface-1/90 to-surface-1/85",
              "backdrop-blur-2xl shadow-[0_32px_82px_-46px_rgba(15,23,42,0.7)]",
              "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]",
              "before:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_60%)]",
              "before:opacity-80"
            )}>
              {/* Top gradient line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

              <CardHeader className="pb-4 border-b border-borderMuted/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br shadow-lg",
                      config.iconColor === 'text-red-500' && "from-error-500/20 to-error-600/10 text-error-500",
                      config.iconColor === 'text-yellow-500' && "from-warning-500/20 to-warning-600/10 text-warning-500",
                      config.iconColor === 'text-blue-500' && "from-info-500/20 to-info-600/10 text-info-500"
                    )}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-9 w-9 rounded-xl hover:bg-surface-2/60"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto rounded-xl"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={config.confirmVariant}
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full sm:w-auto rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      confirmText
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};