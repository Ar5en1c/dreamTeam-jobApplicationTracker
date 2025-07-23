import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationProps {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardNavigation = ({
  onEnter,
  onEscape,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onTab,
  onShiftTab,
  enabled = true,
  preventDefault = true
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          if (preventDefault) event.preventDefault();
          onEnter();
        }
        break;
      case 'Escape':
        if (onEscape) {
          if (preventDefault) event.preventDefault();
          onEscape();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          if (preventDefault) event.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          if (preventDefault) event.preventDefault();
          onArrowDown();
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          if (preventDefault) event.preventDefault();
          onArrowLeft();
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          if (preventDefault) event.preventDefault();
          onArrowRight();
        }
        break;
      case 'Tab':
        if (event.shiftKey && onShiftTab) {
          if (preventDefault) event.preventDefault();
          onShiftTab();
        } else if (!event.shiftKey && onTab) {
          if (preventDefault) event.preventDefault();
          onTab();
        }
        break;
    }
  }, [
    enabled,
    preventDefault,
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab
  ]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
};

// Hook for managing focus within a container
export const useFocusManagement = () => {
  const containerRef = useRef<HTMLElement>(null);

  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = containerRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0] as HTMLElement;
    first?.focus();
  }, []);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = containerRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const last = focusableElements[focusableElements.length - 1] as HTMLElement;
    last?.focus();
  }, []);

  const focusNext = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = Array.from(containerRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];
    
    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  }, []);

  const focusPrevious = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = Array.from(containerRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];
    
    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
    const previousIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[previousIndex]?.focus();
  }, []);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious
  };
};