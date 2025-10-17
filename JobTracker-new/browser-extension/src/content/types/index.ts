/**
 * Types for content script and job detection
 */

export interface JobData {
  jobTitle: string;
  company: string;
  location: string;
  jobUrl?: string;
  salary?: string;
  jobType?: string; // Full-time, Part-time, Contract, Internship
  remoteType?: string; // Remote, Hybrid, On-site
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  applicationDeadline?: string;
}

export interface ExtractedField<T = string> {
  value: T;
  confidence: number; // 0.0 to 1.0
}

export interface ExtractedJobData {
  job_title: ExtractedField<string>;
  company: ExtractedField<string>;
  location: ExtractedField<string>;
  salary_range: ExtractedField<string | null>;
  job_type: ExtractedField<string>;
  remote_type: ExtractedField<string>;
  description: ExtractedField<string>;
  requirements: ExtractedField<string[]>;
  responsibilities: ExtractedField<string[]>;
  benefits: ExtractedField<string[]>;
  application_deadline: ExtractedField<string | null>;
}

export interface PortalDetector {
  name: string;
  pattern: RegExp;
  isJobPage: (url: string, document: Document) => boolean;
  extractBasicData?: (document: Document) => Partial<JobData>;
}

export interface DetectionResult {
  portal: string;
  isJobPage: boolean;
  basicData?: Partial<JobData>;
  confidence: number;
}

export interface ConfidenceMetrics {
  overall: number;
  byField: Record<string, number>;
  warnings: string[];
}
