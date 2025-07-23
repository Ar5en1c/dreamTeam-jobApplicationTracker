import { describe, it, expect } from 'vitest';
import { cn, dateUtils, stringUtils, jobUtils } from '../utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
    });

    it('resolves Tailwind conflicts', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });
  });

  describe('dateUtils', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');
    
    it('formats dates correctly', () => {
      expect(dateUtils.format(testDate)).toBe('Jan 15, 2024');
      expect(dateUtils.format(testDate, 'MMMM dd, yyyy')).toBe('January 15, 2024');
    });

    it('handles string dates', () => {
      expect(dateUtils.format('2024-01-15')).toBe('Jan 15, 2024');
    });

    it('handles invalid dates', () => {
      expect(dateUtils.format('invalid-date')).toBe('Invalid date');
    });

    it('formats relative dates', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const result = dateUtils.formatRelative(yesterday);
      expect(result).toContain('ago');
    });

    it('checks if date is recent', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      const oldDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      
      expect(dateUtils.isRecent(recentDate)).toBe(true);
      expect(dateUtils.isRecent(oldDate)).toBe(false);
    });

    it('calculates days between dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-05');
      
      expect(dateUtils.daysBetween(date1, date2)).toBe(4);
    });
  });

  describe('stringUtils', () => {
    it('truncates text correctly', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(stringUtils.truncate(longText, 20)).toBe('This is a very long...');
    });

    it('does not truncate short text', () => {
      const shortText = 'Short text';
      expect(stringUtils.truncate(shortText, 20)).toBe('Short text');
    });

    it('creates slugs correctly', () => {
      expect(stringUtils.slugify('Hello World!')).toBe('hello-world');
      expect(stringUtils.slugify('Test@Email#123')).toBe('test-email-123');
    });

    it('capitalizes words', () => {
      expect(stringUtils.capitalize('hello world')).toBe('Hello world');
      expect(stringUtils.capitalize('HELLO WORLD')).toBe('Hello world');
    });

    it('creates initials', () => {
      expect(stringUtils.getInitials('John Doe')).toBe('JD');
      expect(stringUtils.getInitials('John')).toBe('J');
      expect(stringUtils.getInitials('John Michael Doe')).toBe('JD');
    });

    it('generates random IDs', () => {
      const id1 = stringUtils.generateId('test');
      const id2 = stringUtils.generateId('test');
      
      expect(id1).toMatch(/^test_/);
      expect(id2).toMatch(/^test_/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('jobUtils', () => {
    const mockProfile = {
      userId: 'user-1',
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        location: '',
        websites: []
      },
      skills: [
        { id: '1', name: 'React', level: 'advanced' as const, category: 'technical' as const },
        { id: '2', name: 'Node.js', level: 'intermediate' as const, category: 'technical' as const },
      ],
      experience: [
        { 
          id: '1', 
          title: 'Developer', 
          company: 'Tech Corp',
          startDate: new Date('2020-01-01'),
          current: true,
          description: '',
          skills: []
        }
      ],
      education: [
        {
          id: '1',
          degree: 'Bachelor of Science',
          institution: 'University',
          startDate: new Date('2016-01-01'),
          endDate: new Date('2020-01-01'),
          field: '',
          description: ''
        }
      ],
      preferences: {
        jobTypes: [],
        locations: [],
        industries: [],
        roles: [],
        salaryRange: { min: 0, max: 0, currency: 'USD' },
        workArrangement: [],
        companySize: [],
        benefits: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('calculates profile completeness', () => {
      const completeness = jobUtils.calculateProfileCompleteness(mockProfile);
      expect(completeness).toBeGreaterThan(0);
      expect(completeness).toBeLessThanOrEqual(100);
    });

    it('groups skills by category', () => {
      const skillsByCategory = jobUtils.getSkillsByCategory(mockProfile.skills);
      expect(skillsByCategory.technical).toHaveLength(2);
      expect(skillsByCategory.technical[0].name).toBe('React');
    });

    it('calculates experience years', () => {
      const years = jobUtils.calculateTotalExperience(mockProfile.experience);
      expect(years).toBeGreaterThan(0);
    });

    it('formats salary ranges', () => {
      expect(jobUtils.formatSalaryRange(80000, 120000, 'USD')).toBe('$80,000 - $120,000');
      expect(jobUtils.formatSalaryRange(50000, 70000, 'EUR')).toBe('€50,000 - €70,000');
    });

    it('validates email addresses', () => {
      expect(jobUtils.isValidEmail('test@example.com')).toBe(true);
      expect(jobUtils.isValidEmail('invalid-email')).toBe(false);
      expect(jobUtils.isValidEmail('test@')).toBe(false);
    });

    it('generates skill recommendations', () => {
      const recommendations = jobUtils.getSkillRecommendations(mockProfile.skills.map(s => s.name), 'technical');
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});