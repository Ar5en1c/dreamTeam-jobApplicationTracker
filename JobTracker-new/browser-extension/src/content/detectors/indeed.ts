/**
 * Indeed Jobs Detector
 *
 * Detects and extracts data from Indeed job postings
 * URL Pattern: indeed.com/viewjob or indeed.com/rc/clk
 */

import type { PortalDetector, JobData } from '../types';

export const indeedDetector: PortalDetector = {
  name: 'Indeed',
  pattern: /indeed\.com\/(viewjob|rc\/clk|m\/jobs)/,

  isJobPage(url: string, document: Document): boolean {
    // Check URL pattern
    if (!url.match(/indeed\.com\/(viewjob|rc\/clk|m\/jobs)/)) {
      return false;
    }

    // Verify job page elements
    const hasJobDescription = document.querySelector('#jobDescriptionText, [id*="jobDesc"], .jobsearch-jobDescriptionText') !== null;
    const hasJobTitle = document.querySelector('.jobsearch-JobInfoHeader-title, h1[class*="jobTitle"]') !== null;

    return hasJobDescription || hasJobTitle;
  },

  extractBasicData(document: Document): Partial<JobData> {
    const data: Partial<JobData> = {};

    // Job Title
    const titleSelectors = [
      '.jobsearch-JobInfoHeader-title',
      'h1[class*="jobTitle"]',
      'h1.jobsearch-JobInfoHeader-title-container',
      '[data-testid="jobsearch-JobInfoHeader-title"]',
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
      '[data-company-name="true"]',
      '.jobsearch-InlineCompanyRating-companyHeader a',
      '[data-testid="inlineHeader-companyName"]',
      '.jobsearch-CompanyInfoContainer a',
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
      '[data-testid="inlineHeader-companyLocation"]',
      '.jobsearch-JobInfoHeader-subtitle div',
      '[class*="location"]',
    ];

    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      const text = element?.textContent?.trim();
      // Filter out salary info if present
      if (text && !text.includes('$') && !text.includes('hour')) {
        data.location = text;
        break;
      }
    }

    // Salary
    const salarySelectors = [
      '#salaryInfoAndJobType',
      '[class*="salary"]',
      '.jobsearch-JobMetadataHeader-item',
    ];

    for (const selector of salarySelectors) {
      const element = document.querySelector(selector);
      const text = element?.textContent?.trim();
      if (text && (text.includes('$') || text.includes('hour') || text.includes('year'))) {
        data.salary = text;
        break;
      }
    }

    // Job Type
    const jobTypeElement = document.querySelector('.jobsearch-JobMetadataHeader-item');
    if (jobTypeElement?.textContent) {
      const text = jobTypeElement.textContent.trim();
      if (text.includes('time') || text.includes('Contract') || text.includes('Temporary')) {
        data.jobType = text;
      }
    }

    // Job URL
    data.jobUrl = window.location.href;

    return data;
  },
};
