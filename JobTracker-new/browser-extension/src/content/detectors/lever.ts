/**
 * Lever ATS Detector
 *
 * Detects and extracts data from Lever-powered job postings
 * URL Pattern: jobs.lever.co
 */

import type { PortalDetector, JobData } from '../types';

export const leverDetector: PortalDetector = {
  name: 'Lever',
  pattern: /jobs\.lever\.co/,

  isJobPage(url: string, document: Document): boolean {
    // Check URL pattern
    if (!url.includes('jobs.lever.co')) {
      return false;
    }

    // Verify Lever-specific elements
    const hasPostingHeader = document.querySelector('.posting-header, [class*="posting"]') !== null;
    const hasJobTitle = document.querySelector('.posting-headline, h2[class*="posting"]') !== null;

    return hasPostingHeader || hasJobTitle;
  },

  extractBasicData(document: Document): Partial<JobData> {
    const data: Partial<JobData> = {};

    // Job Title
    const titleSelectors = [
      '.posting-headline h2',
      'h2.posting-headline',
      '[data-qa="posting-name"]',
      '.posting-header h2',
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        data.jobTitle = element.textContent.trim();
        break;
      }
    }

    // Company Name - Extract from URL or page
    const companySelectors = [
      '.main-header-text-colum h3',
      '[class*="company-name"]',
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

    // If company not found, extract from URL path
    if (!data.company) {
      const pathMatch = window.location.pathname.match(/^\/([^/]+)/);
      if (pathMatch) {
        // Convert slug to readable name
        data.company = pathMatch[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    // Location & Job Type - usually in categories
    const categories = document.querySelectorAll('.posting-categories .posting-category');
    categories.forEach(category => {
      const label = category.querySelector('.sort-by-time')?.textContent?.trim();
      const value = category.querySelector('.posting-category-value')?.textContent?.trim();

      if (label && value) {
        if (label.toLowerCase().includes('location')) {
          data.location = value;
        } else if (label.toLowerCase().includes('type') || label.toLowerCase().includes('commitment')) {
          data.jobType = value;
        }
      }
    });

    // Alternative location selector
    if (!data.location) {
      const locationElement = document.querySelector('.location, [class*="location"]');
      if (locationElement?.textContent) {
        data.location = locationElement.textContent.trim();
      }
    }

    // Department/Team
    const teamElement = document.querySelector('.posting-categories .posting-category .posting-category-value');
    if (teamElement?.textContent && !data.jobType) {
      const text = teamElement.textContent.trim();
      // Check if it's a department/team name
      if (!text.includes(',')) { // Location usually has comma
        data.description = `Team: ${text}`;
      }
    }

    // Job URL
    data.jobUrl = window.location.href;

    return data;
  },
};
