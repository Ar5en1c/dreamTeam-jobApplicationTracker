/**
 * LinkedIn Jobs Detector
 *
 * Detects and extracts data from LinkedIn job postings
 * URL Pattern: linkedin.com/jobs/view/{job_id}
 */

import type { PortalDetector, JobData } from '../types';

export const linkedInDetector: PortalDetector = {
  name: 'LinkedIn',
  pattern: /linkedin\.com\/jobs\/view/,

  isJobPage(url: string, document: Document): boolean {
    // Check URL pattern
    if (!url.includes('linkedin.com/jobs/view')) {
      return false;
    }

    // Verify job page elements exist
    const hasJobDetails = document.querySelector('.job-details, .jobs-details, [class*="job-details"]') !== null;
    const hasJobTitle = document.querySelector('h1[class*="job"], h1[class*="title"]') !== null;

    return hasJobDetails || hasJobTitle;
  },

  extractBasicData(document: Document): Partial<JobData> {
    const data: Partial<JobData> = {};

    // Job Title
    const titleSelectors = [
      'h1.job-details-jobs-unified-top-card__job-title',
      'h1[class*="job-title"]',
      '.job-details h1',
      'h1.t-24',
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        data.jobTitle = element.textContent.trim();
        break;
      }
    }

    // Company Name
    const companySelectors = [
      '.job-details-jobs-unified-top-card__company-name',
      '[class*="company-name"]',
      'a[data-tracking-control-name="public_jobs_topcard-org-name"]',
      '.topcard__org-name-link',
    ];

    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        data.company = element.textContent.trim();
        break;
      }
    }

    // Location
    const locationSelectors = [
      '.job-details-jobs-unified-top-card__primary-description .tvm__text',
      '[class*="location"]',
      '.topcard__flavor--bullet',
    ];

    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      const text = element?.textContent?.trim();
      // LinkedIn location usually has bullet point, filter it out
      if (text && !text.includes('·')) {
        data.location = text;
        break;
      }
    }

    // Job Type (Full-time, Part-time, etc.) - usually in the bullet points
    const metaInfo = document.querySelectorAll('.job-details-jobs-unified-top-card__primary-description .tvm__text');
    metaInfo.forEach(element => {
      const text = element.textContent?.trim();
      if (text && (text.includes('time') || text.includes('Contract'))) {
        data.jobType = text;
      }
    });

    // Job URL
    data.jobUrl = window.location.href;

    return data;
  },
};
