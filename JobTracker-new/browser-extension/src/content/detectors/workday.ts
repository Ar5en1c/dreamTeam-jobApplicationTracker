/**
 * Workday ATS Detector
 *
 * Detects and extracts data from Workday-powered job postings
 * URL Pattern: myworkdayjobs.com or wd5.myworkdayjobs.com
 */

import type { PortalDetector, JobData } from '../types';

export const workdayDetector: PortalDetector = {
  name: 'Workday',
  pattern: /myworkdayjobs\.com/,

  isJobPage(url: string, document: Document): boolean {
    // Check URL pattern
    if (!url.includes('myworkdayjobs.com')) {
      return false;
    }

    // Verify Workday-specific elements
    const hasJobTitle = document.querySelector('[data-automation-id="jobPostingHeader"]') !== null ||
                       document.querySelector('h2[class*="job"], h3[class*="title"]') !== null;
    const hasWorkdayApp = document.querySelector('[class*="workday"]') !== null ||
                         document.querySelector('[data-automation-id]') !== null;

    return hasJobTitle || hasWorkdayApp;
  },

  extractBasicData(document: Document): Partial<JobData> {
    const data: Partial<JobData> = {};

    // Job Title - Workday uses data-automation-id attributes
    const titleSelectors = [
      '[data-automation-id="jobPostingHeader"]',
      'h2[data-automation-id="jobTitle"]',
      'h3[class*="title"]',
      '.jobPostingHeader h2',
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        data.jobTitle = element.textContent.trim();
        break;
      }
    }

    // Company Name - Extract from URL or header
    const companySelectors = [
      '[data-automation-id="companyName"]',
      '.companyName',
      'meta[property="og:site_name"]',
    ];

    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element instanceof HTMLMetaElement
          ? element.content
          : element.textContent;
        if (text) {
          data.company = text.trim();
          break;
        }
      }
    }

    // If company not found, extract from subdomain
    if (!data.company) {
      const hostname = window.location.hostname;
      // Extract from patterns like "acme.wd5.myworkdayjobs.com"
      const match = hostname.match(/^([^.]+)\./);
      if (match && match[1] !== 'www' && match[1] !== 'wd1' && match[1] !== 'wd5') {
        data.company = match[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    // Location - Workday often has structured location data
    const locationSelectors = [
      '[data-automation-id="locations"]',
      '[data-automation-id="location"]',
      '.jobPostingInfo dd', // Definition list data
    ];

    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        const text = element.textContent.trim();
        // Workday locations can have multiple, take the first one
        if (text) {
          data.location = text.split(',')[0].trim();
          break;
        }
      }
    }

    // Job Type & Other Details - Workday uses definition lists
    const detailsList = document.querySelectorAll('.jobPostingInfo dt');
    detailsList.forEach((dt, index) => {
      const label = dt.textContent?.trim().toLowerCase();
      const dd = dt.nextElementSibling;
      const value = dd?.textContent?.trim();

      if (label && value) {
        if (label.includes('time') || label.includes('schedule')) {
          data.jobType = value;
        } else if (label.includes('remote') || label.includes('work type')) {
          data.remoteType = value;
        }
      }
    });

    // Posted Date - can be useful
    const postedElement = document.querySelector('[data-automation-id="postedOn"]');
    if (postedElement?.textContent) {
      // Store in description temporarily
      data.description = `Posted: ${postedElement.textContent.trim()}`;
    }

    // Job URL
    data.jobUrl = window.location.href;

    return data;
  },
};
