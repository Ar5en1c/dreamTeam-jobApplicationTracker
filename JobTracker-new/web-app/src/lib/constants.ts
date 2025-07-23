import type { SkillCategory, JobPortal, ApplicationStatus, JobType, WorkArrangement, CompanySize } from '@/types';

// Application-wide constants
export const APP_NAME = 'Job Application Tracker';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Modern job search companion with AI-powered insights';

// Skill Categories
export const SKILL_CATEGORIES: { value: SkillCategory; label: string; icon: string }[] = [
  { value: 'technical', label: 'Technical Skills', icon: '💻' },
  { value: 'soft', label: 'Soft Skills', icon: '🤝' },
  { value: 'language', label: 'Languages', icon: '🌍' },
  { value: 'certification', label: 'Certifications', icon: '🏆' },
  { value: 'tool', label: 'Tools & Software', icon: '🛠️' },
];

// Job Portals
export const JOB_PORTALS: { value: JobPortal; label: string; icon: string }[] = [
  { value: 'lever', label: 'Lever', icon: '🎯' },
  { value: 'greenhouse', label: 'Greenhouse', icon: '🌱' },
  { value: 'workday', label: 'Workday', icon: '⭐' },
  { value: 'ultipro', label: 'UltiPro', icon: '🏢' },
  { value: 'smartrecruiters', label: 'SmartRecruiters', icon: '🧠' },
  { value: 'oracle', label: 'Oracle Cloud', icon: '☁️' },
  { value: 'jobvite', label: 'Jobvite', icon: '📋' },
  { value: 'ashby', label: 'Ashby HQ', icon: '🚀' },
  { value: 'taleo', label: 'Taleo', icon: '📊' },
  { value: 'eightfold', label: 'Eightfold', icon: '🔮' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'indeed', label: 'Indeed', icon: '🔍' },
  { value: 'glassdoor', label: 'Glassdoor', icon: '🏢' },
  { value: 'other', label: 'Other', icon: '📄' },
];

// Application Statuses
export const APPLICATION_STATUSES: { value: ApplicationStatus; label: string; color: string; icon: string }[] = [
  { value: 'draft', label: 'Draft', color: 'gray', icon: '📝' },
  { value: 'applied', label: 'Applied', color: 'blue', icon: '📨' },
  { value: 'under_review', label: 'Under Review', color: 'yellow', icon: '👀' },
  { value: 'phone_screen', label: 'Phone Screen', color: 'purple', icon: '📞' },
  { value: 'interview', label: 'Interview', color: 'orange', icon: '🎤' },
  { value: 'final_interview', label: 'Final Interview', color: 'indigo', icon: '🎯' },
  { value: 'offer', label: 'Offer', color: 'green', icon: '🎉' },
  { value: 'rejected', label: 'Rejected', color: 'red', icon: '❌' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'gray', icon: '⏪' },
  { value: 'expired', label: 'Expired', color: 'gray', icon: '⏰' },
];

// Job Types
export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

// Work Arrangements
export const WORK_ARRANGEMENTS: { value: WorkArrangement; label: string; icon: string }[] = [
  { value: 'remote', label: 'Remote', icon: '🏠' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
  { value: 'on-site', label: 'On-site', icon: '🏢' },
];

// Company Sizes
export const COMPANY_SIZES: { value: CompanySize; label: string; description: string }[] = [
  { value: 'startup', label: 'Startup', description: '1-50 employees' },
  { value: 'small', label: 'Small', description: '51-200 employees' },
  { value: 'medium', label: 'Medium', description: '201-1000 employees' },
  { value: 'large', label: 'Large', description: '1001-5000 employees' },
  { value: 'enterprise', label: 'Enterprise', description: '5000+ employees' },
];

// Common Industries
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Media & Entertainment',
  'Non-profit',
  'Government',
  'Real Estate',
  'Transportation',
  'Energy',
  'Agriculture',
  'Tourism',
  'Other',
];

// Common Job Roles
export const JOB_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'Designer',
  'Marketing Manager',
  'Sales Representative',
  'Business Analyst',
  'Project Manager',
  'DevOps Engineer',
  'Quality Assurance',
  'Customer Success',
  'Human Resources',
  'Financial Analyst',
  'Operations Manager',
  'Research Scientist',
  'Consultant',
  'Other',
];

// Common Skills
export const COMMON_SKILLS = {
  technical: [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'React', 'Node.js',
    'SQL', 'Git', 'Docker', 'AWS', 'Kubernetes', 'GraphQL',
    'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch',
  ],
  soft: [
    'Communication', 'Leadership', 'Problem Solving', 'Team Collaboration',
    'Project Management', 'Critical Thinking', 'Adaptability',
    'Time Management', 'Creativity', 'Analytical Thinking',
  ],
  tool: [
    'Jira', 'Slack', 'Figma', 'Adobe Creative Suite', 'Microsoft Office',
    'Google Workspace', 'Notion', 'Trello', 'Asana', 'Confluence',
  ],
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  linkedIn: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
  github: /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
};

// File upload constraints
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: {
    resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  },
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Default date formats
export const DATE_FORMATS = {
  short: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  dateTime: 'MMM dd, yyyy HH:mm',
  time: 'HH:mm',
  api: 'yyyy-MM-dd',
};

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'jobtracker_theme',
  userProfile: 'jobtracker_profile',
  preferences: 'jobtracker_preferences',
  drafts: 'jobtracker_drafts',
  recentSearches: 'jobtracker_recent_searches',
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  base: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  auth: '/auth',
  profile: '/profile',
  applications: '/applications',
  analytics: '/analytics',
  documents: '/documents',
  ai: '/ai',
};

// Feature flags (for progressive rollout)
export const FEATURE_FLAGS = {
  aiInsights: true,
  resumeAnalysis: true,
  interviewCoach: false, // Phase 2
  formFilling: false, // Phase 3
  teamFeatures: false, // Phase 4
  mobileApp: false, // Phase 4
};