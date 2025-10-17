/**
 * Job Portal Detection System
 *
 * Detects when user is on a job posting page across major job boards and ATS platforms.
 * Uses pattern matching and DOM analysis to determine if current page is a job listing.
 */

import type { PortalDetector, DetectionResult, JobData } from '../types';
import { linkedInDetector } from './linkedin';
import { indeedDetector } from './indeed';
import { greenhouseDetector } from './greenhouse';
import { leverDetector } from './lever';
import { workdayDetector } from './workday';
import { genericDetector } from './generic';

/**
 * All registered portal detectors
 * Order matters - more specific detectors should come first
 */
const detectors: PortalDetector[] = [
  linkedInDetector,
  indeedDetector,
  greenhouseDetector,
  leverDetector,
  workdayDetector,
  genericDetector, // Fallback - must be last
];

/**
 * Detect if current page is a job posting
 *
 * @param url - Current page URL
 * @param document - DOM document
 * @returns Detection result with portal name and confidence
 */
export function detectJobPortal(url: string, document: Document): DetectionResult | null {
  for (const detector of detectors) {
    // Quick pattern check first
    if (!detector.pattern.test(url)) {
      continue;
    }

    // Detailed page analysis
    if (detector.isJobPage(url, document)) {
      const basicData = detector.extractBasicData?.(document);

      return {
        portal: detector.name,
        isJobPage: true,
        basicData,
        confidence: calculateDetectionConfidence(detector, basicData),
      };
    }
  }

  return null;
}

/**
 * Calculate confidence score for detection
 * Higher confidence means we're more certain this is a job page
 */
function calculateDetectionConfidence(
  detector: PortalDetector,
  basicData?: Partial<JobData>
): number {
  let confidence = 0.5; // Base confidence

  // If we extracted basic data successfully, increase confidence
  if (basicData) {
    if (basicData.jobTitle) confidence += 0.2;
    if (basicData.company) confidence += 0.2;
    if (basicData.location) confidence += 0.1;
  }

  // Generic detector has lower confidence than specific ones
  if (detector.name === 'Generic') {
    confidence *= 0.7;
  }

  return Math.min(confidence, 1.0);
}

/**
 * Get all supported portal names
 */
export function getSupportedPortals(): string[] {
  return detectors.map(d => d.name).filter(name => name !== 'Generic');
}
