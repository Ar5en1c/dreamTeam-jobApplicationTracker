/**
 * Detection Badge Component
 *
 * Shows a floating badge when a job page is detected
 * Clicking the badge opens the capture overlay
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Sparkles, X } from 'lucide-react';
import type { DetectionResult } from '../types';

const BADGE_ID = 'jobtracker-detection-badge';
const BADGE_CONTAINER_ID = 'jobtracker-badge-container';

interface BadgeProps {
  detection: DetectionResult;
  onCapture: () => void;
  onDismiss: () => void;
}

const Badge: React.FC<BadgeProps> = ({ detection, onCapture, onDismiss }) => {
  const [isMinimized, setIsMinimized] = React.useState(false);

  return (
    <div
      id={BADGE_ID}
      style={{
        position: 'fixed',
        bottom: isMinimized ? '20px' : '24px',
        right: isMinimized ? '20px' : '24px',
        zIndex: 999998,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {isMinimized ? (
        // Minimized state - just an icon
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
          }}
        >
          <Sparkles size={24} color="white" />
        </button>
      ) : (
        // Expanded state - full badge
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            padding: '16px 20px',
            minWidth: '280px',
            maxWidth: '320px',
            animation: 'slideInUp 0.3s ease-out',
          }}
        >
          <style>{`
            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="white" />
            </div>

            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: '1.4',
                }}
              >
                Job Detected! ✨
              </h3>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '13px',
                  color: '#6b7280',
                  lineHeight: '1.4',
                }}
              >
                Found on {detection.portal}
              </p>
            </div>

            <button
              onClick={onDismiss}
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <X size={16} color="#6b7280" />
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onCapture}
              style={{
                flex: 1,
                height: '40px',
                border: 'none',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
              }}
            >
              Capture Job
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                background: 'white',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              −
            </button>
          </div>

          {/* Confidence Indicator */}
          {detection.confidence && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: detection.confidence > 0.7 ? '#f0fdf4' : '#fef3c7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: detection.confidence > 0.7 ? '#10b981' : '#f59e0b',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: detection.confidence > 0.7 ? '#065f46' : '#92400e',
                  fontWeight: 500,
                }}
              >
                {Math.round(detection.confidence * 100)}% confident
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Show the detection badge
 */
export function showDetectionBadge(detection: DetectionResult): void {
  // Don't show badge if container already exists
  if (document.getElementById(BADGE_CONTAINER_ID)) {
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = BADGE_CONTAINER_ID;
  document.body.appendChild(container);

  // Render badge
  const root = ReactDOM.createRoot(container);
  root.render(
    <Badge
      detection={detection}
      onCapture={() => {
        console.log('[JobTracker] Opening capture overlay...');
        // TODO: Show capture overlay
        // For now, just open the extension popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          chrome.runtime.sendMessage({ type: 'OPEN_CAPTURE_OVERLAY', detection });
        }
      }}
      onDismiss={() => {
        hideDetectionBadge();
      }}
    />
  );
}

/**
 * Hide the detection badge
 */
export function hideDetectionBadge(): void {
  const container = document.getElementById(BADGE_CONTAINER_ID);
  if (container) {
    container.remove();
  }
}
