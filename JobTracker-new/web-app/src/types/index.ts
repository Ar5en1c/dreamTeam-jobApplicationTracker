// Core data types matching ProjectDoc.md schemas

export interface UserProfile {
  userId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio?: string;
    websites: string[];
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  gpa?: number;
  achievements?: string[];
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  skills: string[];
  achievements?: string[];
  location?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  yearsOfExperience?: number;
  verified?: boolean;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type SkillCategory =
  | "technical"
  | "soft"
  | "language"
  | "certification"
  | "tool";

export interface UserPreferences {
  jobTypes: JobType[];
  locations: string[];
  industries: string[];
  roles: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  workArrangement: WorkArrangement[];
  companySize: CompanySize[];
  benefits: string[];
}

export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship";
export type WorkArrangement = "remote" | "hybrid" | "on-site";
export type CompanySize =
  | "startup"
  | "small"
  | "medium"
  | "large"
  | "enterprise";

export interface JobApplication {
  id: string;
  userId: string;
  job: Job;
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  dates: ApplicationDates;
  documents: ApplicationDocuments;
  notes: string;
  tags: string[];
  aiInsights: AIInsights;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  url: string;
  portal: JobPortal;
  benefits?: string[];
  companySize?: CompanySize;
  workArrangement?: WorkArrangement;
  industry?: string;
}

export type JobPortal =
  | "lever"
  | "greenhouse"
  | "workday"
  | "ultipro"
  | "smartrecruiters"
  | "oracle"
  | "jobvite"
  | "ashby"
  | "taleo"
  | "eightfold"
  | "linkedin"
  | "indeed"
  | "glassdoor"
  | "direct"
  | "other";

export type ApplicationStatus =
  | "draft"
  | "applied"
  | "under_review"
  | "phone_screen"
  | "interview"
  | "final_interview"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "expired";

export interface StatusHistoryEntry {
  id: string;
  status: ApplicationStatus;
  date: Date;
  notes?: string;
  source?: string; // manual, automatic, etc.
}

export interface ApplicationDates {
  applied: Date;
  lastUpdated: Date;
  interviews: Date[];
  responses: Date[];
  deadline?: Date;
}

export interface ApplicationDocuments {
  resume?: DocumentReference;
  coverLetter?: DocumentReference;
  others: DocumentReference[];
}

export interface DocumentReference {
  id: string;
  name: string;
  type: DocumentType;
  url?: string;
  content?: string; // base64 or text content
  size?: number;
  uploadedAt: Date;
}

export type DocumentType =
  | "resume"
  | "cover_letter"
  | "portfolio"
  | "certificate"
  | "transcript"
  | "other";

export interface AIInsights {
  matchScore: number; // 0-100
  skillGaps: string[];
  suggestions: string[];
  resumeOptimization?: ResumeOptimization;
  interviewTips?: string[];
  lastAnalyzed: Date;
}

export interface ResumeOptimization {
  keywordsToAdd: string[];
  sectionsToImprove: string[];
  overallScore: number;
  recommendations: string[];
}

// Analytics and Dashboard Types
export interface DashboardMetrics {
  totalApplications: number;
  activeApplications: number;
  interviewRate: number;
  responseRate: number;
  averageResponseTime: number; // in days
  topCompanies: string[];
  topSkills: string[];
  recentActivity: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  description: string;
  date: Date;
  applicationId?: string;
}

export type ActivityType =
  | "application_submitted"
  | "status_changed"
  | "interview_scheduled"
  | "response_received"
  | "document_uploaded"
  | "profile_updated";

// Component Props Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Types
export interface FormField {
  id: string;
  name: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "multiselect"
    | "date"
    | "number";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: "required" | "email" | "url" | "min" | "max" | "pattern";
  value?: string | number;
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Theme and UI Types
export type Theme = "light" | "dark" | "system";

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  animations: boolean;
  reducedMotion: boolean;
}
