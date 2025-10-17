import { getSupabaseClient } from '@shared/supabase/client';
import { detectJobPortal } from './detectors';
import { showDetectionBadge, hideDetectionBadge } from './components/DetectionBadge';

const supabase = getSupabaseClient();

console.debug('[JobTracker] Content script loaded', window.location.hostname);

// Job detection state
let currentDetection: ReturnType<typeof detectJobPortal> = null;
let badgeVisible = false;

/**
 * Check if current page is a job posting
 */
function checkForJobPage(): void {
  try {
    const detection = detectJobPortal(window.location.href, document);

    if (detection && detection.isJobPage) {
      console.debug('[JobTracker] Job page detected:', detection);
      currentDetection = detection;

      // Show badge notification
      if (!badgeVisible) {
        showDetectionBadge(detection);
        badgeVisible = true;
      }
    } else {
      // Hide badge if previously shown
      if (badgeVisible) {
        hideDetectionBadge();
        badgeVisible = false;
        currentDetection = null;
      }
    }
  } catch (error) {
    console.error('[JobTracker] Error detecting job page:', error);
  }
}

/**
 * Initialize detection on page load
 */
function init(): void {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkForJobPage);
  } else {
    // DOM already loaded
    setTimeout(checkForJobPage, 1000); // Wait 1s for dynamic content
  }

  // Re-check when URL changes (for SPAs)
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.debug('[JobTracker] URL changed, re-checking...');
      setTimeout(checkForJobPage, 1500); // Wait for SPA to render
    }
  }).observe(document, { subtree: true, childList: true });
}

// Bootstrap
init();
