import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 m-6 flex flex-col space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 150);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : 300,
        scale: isVisible ? 1 : 0.3,
      }}
      exit={{ opacity: 0, x: 300, scale: 0.3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`relative overflow-hidden rounded-lg dropdown-background ${getBorderColor()} border-l-4 p-4 shadow-lg`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{toast.title}</p>
          {toast.description && (
            <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
          )}
          {toast.action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toast.action.onClick}
                className="h-8"
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// Helper functions for common toast types
export const toast = {
  success: (title: string, description?: string, options?: Partial<Toast>) => ({
    title,
    description,
    type: 'success' as const,
    ...options,
  }),
  error: (title: string, description?: string, options?: Partial<Toast>) => ({
    title,
    description,
    type: 'error' as const,
    ...options,
  }),
  warning: (title: string, description?: string, options?: Partial<Toast>) => ({
    title,
    description,
    type: 'warning' as const,
    ...options,
  }),
  info: (title: string, description?: string, options?: Partial<Toast>) => ({
    title,
    description,
    type: 'info' as const,
    ...options,
  }),
};