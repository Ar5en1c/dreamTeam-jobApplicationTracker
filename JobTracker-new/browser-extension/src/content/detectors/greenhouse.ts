/**
 * Greenhouse ATS Detector
 *
 * Detects and extracts data from Greenhouse-powered job postings
 * URL Pattern: boards.greenhouse.io or company.greenhouse.io
 */

import type { PortalDetector, JobData } from '../types';

export const greenhouseDetector: PortalDetector = {
  name: 'Greenhouse',
  pattern: /greenhouse\.io/,

  isJobPage(url: string, document: Document): boolean {
    // Check URL pattern
    if (!url.includes('greenhouse.io')) {
      return false;
    }

    // Verify Greenhouse-specific elements
    const hasGreenhouseApp = document.querySelector('#application, [id*="greenhouse"]') !== null;
    const hasJobContent = document.querySelector('#content, .app-wrapper') !== null;
    const hasJobTitle = document.querySelector('.app-title, h1[class*="job"]') !== null;

    return hasGreenhouseApp || hasJobContent || hasJobTitle;
  },

  extractBasicData(document: Document): Partial<JobData> {
    const data: Partial<JobData> = {};

    // Job Title
    const titleSelectors = [
      '.app-title',
      'h1.app-title',
      '[class*="job-title"]',
      'header h1',
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        data.jobTitle = element.textContent.trim();
        break;
      }
    }

    // Company Name - often in the header or meta tags
    const companySelectors = [
      '.company-name',
      'header [class*="company"]',
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

    // If company not found in DOM, try extracting from hostname
    if (!data.company) {
      const hostname = window.location.hostname;
      // Extract from patterns like "acme.greenhouse.io" or "boards.greenhouse.io/acme"
      const match = hostname.match(/^([^.]+)\.greenhouse\.io/) ||
                   window.location.pathname.match(/^\/([^/]+)/);
      if (match && match[1] !== 'boards') {
        // Convert slug to readable name (e.g., "acme-corp" -> "Acme Corp")
        data.company = match[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    // Location
    const locationSelectors = [
      '.location',
      '[class*="location"]',
      '.app-title + div',
    ];

    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        const text = element.textContent.trim();
        // Greenhouse locations are usually clean, but filter out department if present
        if (!text.toLowerCase().includes('department')) {
          data.location = text;
          break;
        }
      }
    }

    // Department (sometimes useful for context)
    const deptElement = document.querySelector('.department, [class*="department"]');
    if (deptElement?.textContent) {
      // Store in description for now, can be parsed later
      const dept = deptElement.textContent.trim();
      data.description = `Department: ${dept}`;
    }

    // Job URL
    data.jobUrl = window.location.href;

    return data;
  },
};
