/**
 * Generic Job Page Detector (Fallback)
 *
 * Detects job pages on any website using heuristics
 * This is a fallback when no specific portal detector matches
 */

import type { PortalDetector, JobData } from '../types';

export const genericDetector: PortalDetector = {
  name: 'Generic',
  pattern: /.*/,  // Matches any URL

  isJobPage(url: string, document: Document): boolean {
    // Don't run on obvious non-job pages
    const excludedDomains = [
      'google.com',
      'facebook.com',
      'twitter.com',
      'youtube.com',
      'amazon.com',
      'reddit.com',
    ];

    const hostname = new URL(url).hostname;
    if (excludedDomains.some(domain => hostname.includes(domain))) {
      return false;
    }

    // Score based on job-related keywords in URL
    const urlScore = this.scoreUrl(url);

    // Score based on page content
    const contentScore = this.scoreContent(document);

    // Combine scores (both must be above threshold)
    return urlScore > 0.3 && contentScore > 0.5;
  },

  scoreUrl(url: string): number {
    const jobKeywords = [
      'job', 'career', 'careers', 'position', 'opening', 'opportunity',
      'hiring', 'apply', 'application', 'vacancy', 'recruit'
    ];

    const lowerUrl = url.toLowerCase();
    let score = 0;

    jobKeywords.forEach(keyword => {
      if (lowerUrl.includes(keyword)) {
        score += 0.2;
      }
    });

    return Math.min(score, 1.0);
  },

  scoreContent(document: Document): number {
    let score = 0;

    // Check for job-related headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
    const hasJobHeading = headings.some(h => {
      const text = h.textContent?.toLowerCase() || '';
      return text.includes('position') || text.includes('role') ||
             text.includes('engineer') || text.includes('manager') ||
             text.includes('designer') || text.includes('developer');
    });

    if (hasJobHeading) score += 0.3;

    // Check for common job description patterns
    const bodyText = document.body.textContent?.toLowerCase() || '';

    const jobPhrases = [
      'responsibilities',
      'qualifications',
      'requirements',
      'experience required',
      'full-time',
      'part-time',
      'apply now',
      'submit application',
      'salary range',
    ];

    let phrasesFound = 0;
    jobPhrases.forEach(phrase => {
      if (bodyText.includes(phrase)) {
        phrasesFound++;
      }
    });

    score += (phrasesFound / jobPhrases.length) * 0.5;

    // Check for application forms or buttons
    const hasApplyButton = document.querySelector(
      'button[class*="apply"], a[class*="apply"], button:contains("Apply")'
    ) !== null;

    if (hasApplyButton) score += 0.2;

    return Math.min(score, 1.0);
  },

  extractBasicData(document: Document): Partial<JobData> {
    const data: Partial<JobData> = {};

    // Try to extract job title from h1 or h2
    const titleElement = document.querySelector('h1') ||
                        document.querySelector('h2[class*="title"], h2[class*="job"]');

    if (titleElement?.textContent) {
      data.jobTitle = titleElement.textContent.trim();
    }

    // Try to find company name in meta tags or headers
    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (ogSiteName instanceof HTMLMetaElement) {
      data.company = ogSiteName.content.trim();
    }

    // Alternative: look for company in header or breadcrumbs
    if (!data.company) {
      const companyElement = document.querySelector(
        '[class*="company-name"], .company, [itemprop="hiringOrganization"]'
      );
      if (companyElement?.textContent) {
        data.company = companyElement.textContent.trim();
      }
    }

    // Try to find location
    const locationElement = document.querySelector(
      '[class*="location"], [itemprop="jobLocation"]'
    );
    if (locationElement?.textContent) {
      data.location = locationElement.textContent.trim();
    }

    // Job URL
    data.jobUrl = window.location.href;

    return data;
  },
};
