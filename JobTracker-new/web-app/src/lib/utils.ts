import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import type {
  ApplicationStatus,
  JobApplication,
  UserProfile,
  Skill,
} from "@/types";
import {
  APPLICATION_STATUSES,
  DATE_FORMATS,
  VALIDATION_PATTERNS,
} from "./constants";

// Utility for merging Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utilities
export const dateUtils = {
  format: (
    date: Date | string,
    pattern: string = DATE_FORMATS.short
  ): string => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, pattern) : "Invalid date";
  },

  formatRelative: (date: Date | string): string => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj)
      ? formatDistanceToNow(dateObj, { addSuffix: true })
      : "Invalid date";
  },

  isRecent: (date: Date | string, daysThreshold: number = 7): boolean => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    const diffInDays = (Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= daysThreshold;
  },

  daysBetween: (startDate: Date | string, endDate: Date | string): number => {
    const start =
      typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
    if (!isValid(start) || !isValid(end)) return 0;
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  },
};

// String utilities
export const stringUtils = {
  truncate: (
    text: string,
    length: number = 100,
    suffix: string = "..."
  ): string => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
  },

  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  capitalizeWords: (text: string): string => {
    return text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  },

  extractDomain: (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch {
      return url;
    }
  },

  generateId: (prefix?: string): string => {
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return prefix ? `${prefix}_${id}` : id;
  },

  getInitials: (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  },
};

// Validation utilities
export const validationUtils = {
  isEmail: (email: string): boolean => VALIDATION_PATTERNS.email.test(email),

  isPhone: (phone: string): boolean => VALIDATION_PATTERNS.phone.test(phone),

  isUrl: (url: string): boolean => VALIDATION_PATTERNS.url.test(url),

  isLinkedInProfile: (url: string): boolean =>
    VALIDATION_PATTERNS.linkedIn.test(url),

  isGitHubProfile: (url: string): boolean =>
    VALIDATION_PATTERNS.github.test(url),

  isStrongPassword: (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasNonalphas
    );
  },
};

// File utilities
export const fileUtils = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  getFileExtension: (filename: string): string => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },

  isImageFile: (file: File): boolean => {
    return file.type.startsWith("image/");
  },

  isPDFFile: (file: File): boolean => {
    return file.type === "application/pdf";
  },

  isDocumentFile: (file: File): boolean => {
    const documentTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    return documentTypes.includes(file.type);
  },
};

// Application-specific utilities
export const jobUtils = {
  getStatusColor: (status: ApplicationStatus): string => {
    const statusObj = APPLICATION_STATUSES.find((s) => s.value === status);
    return statusObj?.color || "gray";
  },

  getStatusIcon: (status: ApplicationStatus): string => {
    const statusObj = APPLICATION_STATUSES.find((s) => s.value === status);
    return statusObj?.icon || "📄";
  },

  calculateApplicationScore: (application: JobApplication): number => {
    let score = 0;

    // Base score for having applied
    score += 10;

    // Status progression score
    const statusScores: Record<ApplicationStatus, number> = {
      draft: 0,
      applied: 20,
      under_review: 30,
      phone_screen: 50,
      interview: 70,
      final_interview: 85,
      offer: 100,
      rejected: 0,
      withdrawn: 0,
      expired: 0,
    };
    score += statusScores[application.status] || 0;

    // Recent activity bonus
    if (dateUtils.isRecent(application.updatedAt, 7)) {
      score += 10;
    }

    // AI insights bonus
    if (application.aiInsights?.matchScore) {
      score += application.aiInsights.matchScore * 0.2;
    }

    return Math.min(100, Math.max(0, score));
  },

  calculateProfileCompleteness: (profile: UserProfile): number => {
    let score = 0;
    const maxScore = 100;

    // Personal info (25 points)
    const personalInfo = profile.personalInfo;
    if (personalInfo.name) score += 5;
    if (personalInfo.email) score += 5;
    if (personalInfo.phone) score += 5;
    if (personalInfo.location) score += 5;
    if (personalInfo.websites && personalInfo.websites.length > 0) score += 5;

    // Experience (30 points)
    if (profile.experience && profile.experience.length > 0) {
      score += 15;
      if (
        profile.experience.some(
          (exp) => exp.description && exp.description.length > 50
        )
      ) {
        score += 15;
      }
    }

    // Education (20 points)
    if (profile.education && profile.education.length > 0) {
      score += 10;
      if (
        profile.education.some(
          (edu) => edu.description && edu.description.length > 20
        )
      ) {
        score += 10;
      }
    }

    // Skills (15 points)
    if (profile.skills && profile.skills.length >= 5) {
      score += 10;
      if (profile.skills.length >= 10) score += 5;
    }

    // Preferences (10 points)
    const prefs = profile.preferences;
    if (prefs.jobTypes && prefs.jobTypes.length > 0) score += 2;
    if (prefs.locations && prefs.locations.length > 0) score += 2;
    if (prefs.industries && prefs.industries.length > 0) score += 2;
    if (prefs.roles && prefs.roles.length > 0) score += 2;
    if (prefs.salaryRange && prefs.salaryRange.min > 0) score += 2;

    return Math.min(maxScore, score);
  },

  getSkillsByCategory: (skills: Skill[]): Record<string, Skill[]> => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  },

  searchApplications: (
    applications: JobApplication[],
    query: string
  ): JobApplication[] => {
    if (!query.trim()) return applications;

    const searchTerm = query.toLowerCase();
    return applications.filter(
      (app) =>
        app.job.title.toLowerCase().includes(searchTerm) ||
        app.job.company.toLowerCase().includes(searchTerm) ||
        app.job.location.toLowerCase().includes(searchTerm) ||
        app.status.toLowerCase().includes(searchTerm) ||
        app.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        app.notes.toLowerCase().includes(searchTerm)
    );
  },

  sortApplications: (
    applications: JobApplication[],
    sortBy: "date" | "status" | "company" | "title"
  ): JobApplication[] => {
    return [...applications].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        case "company":
          return a.job.company.localeCompare(b.job.company);
        case "title":
          return a.job.title.localeCompare(b.job.title);
        default:
          return 0;
      }
    });
  },

  calculateTotalExperience: (experiences: any[]): number => {
    return experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      const years =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + Math.max(0, years);
    }, 0);
  },

  formatSalaryRange: (
    min: number,
    max: number,
    currency: string = "USD"
  ): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (min === max) {
      return formatter.format(min);
    }

    return `${formatter.format(min)} - ${formatter.format(max)}`;
  },

  isValidEmail: (email: string): boolean => {
    return validationUtils.isEmail(email);
  },

  getSkillRecommendations: (
    currentSkills: string[],
    targetRole: string
  ): string[] => {
    // Simple skill recommendations based on role
    const roleSkillMap: Record<string, string[]> = {
      frontend: ["React", "TypeScript", "CSS", "HTML", "JavaScript"],
      backend: ["Node.js", "Python", "SQL", "API Design", "Docker"],
      fullstack: ["React", "Node.js", "TypeScript", "SQL", "AWS"],
      default: ["Communication", "Problem Solving", "Teamwork"],
    };

    const recommendations =
      roleSkillMap[targetRole.toLowerCase()] || roleSkillMap.default;
    return recommendations.filter((skill) => !currentSkills.includes(skill));
  },
};

// Analytics utilities
export const analyticsUtils = {
  calculateResponseRate: (applications: JobApplication[]): number => {
    const totalApplied = applications.filter(
      (app) => app.status !== "draft"
    ).length;
    if (totalApplied === 0) return 0;

    const responded = applications.filter((app) =>
      [
        "under_review",
        "phone_screen",
        "interview",
        "final_interview",
        "offer",
        "rejected",
      ].includes(app.status)
    ).length;

    return Math.round((responded / totalApplied) * 100);
  },

  calculateInterviewRate: (applications: JobApplication[]): number => {
    const totalApplied = applications.filter(
      (app) => app.status !== "draft"
    ).length;
    if (totalApplied === 0) return 0;

    const interviewed = applications.filter((app) =>
      ["phone_screen", "interview", "final_interview", "offer"].includes(
        app.status
      )
    ).length;

    return Math.round((interviewed / totalApplied) * 100);
  },

  getAverageResponseTime: (applications: JobApplication[]): number => {
    const responseTimes = applications
      .filter((app) => app.dates.responses.length > 0)
      .map((app) => {
        const firstResponse = app.dates.responses[0];
        return dateUtils.daysBetween(app.dates.applied, firstResponse);
      })
      .filter((days) => days > 0);

    if (responseTimes.length === 0) return 0;
    return Math.round(
      responseTimes.reduce((sum, days) => sum + days, 0) / responseTimes.length
    );
  },

  getTopCompanies: (
    applications: JobApplication[],
    limit: number = 5
  ): string[] => {
    const companyCounts = applications.reduce((acc, app) => {
      acc[app.job.company] = (acc[app.job.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([company]) => company);
  },
};

// Local storage utilities
export const storageUtils = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Failed to save ${key} to localStorage`);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error(`Failed to remove ${key} from localStorage`);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      console.error("Failed to clear localStorage");
    }
  },
};

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Additional utility functions expected by tests
export const calculateTotalExperience = (experiences: any[]): number => {
  return experiences.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : new Date(exp.endDate);
    const years =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return total + Math.max(0, years);
  }, 0);
};

export const formatSalaryRange = (
  min: number,
  max: number,
  currency: string = "USD"
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (min === max) {
    return formatter.format(min);
  }

  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

export const isValidEmail = (email: string): boolean => {
  return validationUtils.isEmail(email);
};

export const getSkillRecommendations = (
  currentSkills: string[],
  targetRole: string
): string[] => {
  // Simple skill recommendations based on role
  const roleSkillMap: Record<string, string[]> = {
    frontend: ["React", "TypeScript", "CSS", "HTML", "JavaScript"],
    backend: ["Node.js", "Python", "SQL", "API Design", "Docker"],
    fullstack: ["React", "Node.js", "TypeScript", "SQL", "AWS"],
    default: ["Communication", "Problem Solving", "Teamwork"],
  };

  const recommendations =
    roleSkillMap[targetRole.toLowerCase()] || roleSkillMap.default;
  return recommendations.filter((skill) => !currentSkills.includes(skill));
};
