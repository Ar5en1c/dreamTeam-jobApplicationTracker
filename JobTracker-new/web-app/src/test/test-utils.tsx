import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock data for testing
export const mockUserProfile = {
  userId: 'test-user-123',
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    websites: ['https://johndoe.dev', 'https://linkedin.com/in/johndoe']
  },
  skills: [
    {
      id: 'skill-1',
      name: 'React',
      level: 'advanced' as const,
      category: 'technical' as const,
      yearsOfExperience: 3,
      verified: true
    },
    {
      id: 'skill-2',
      name: 'TypeScript',
      level: 'intermediate' as const,
      category: 'technical' as const,
      yearsOfExperience: 2,
      verified: false
    }
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      startDate: new Date('2022-01-01'),
      current: true,
      description: 'Leading frontend development',
      skills: ['React', 'TypeScript', 'Node.js'],
      achievements: ['Improved performance by 40%'],
      location: 'San Francisco, CA'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'University of California',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2022-05-15'),
      description: 'Computer Science major',
      gpa: 3.8,
      achievements: ['Dean\'s List', 'Cum Laude']
    }
  ],
  preferences: {
    jobTypes: ['full-time'] as const,
    locations: ['San Francisco, CA', 'Remote'],
    industries: ['Technology', 'Fintech'],
    roles: ['Software Engineer', 'Frontend Developer'],
    salaryRange: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    workArrangement: ['remote', 'hybrid'] as const,
    companySize: ['medium', 'large'] as const,
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work']
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const mockJobApplication = {
  id: 'app-123',
  userId: 'test-user-123',
  job: {
    title: 'Senior Frontend Engineer',
    company: 'Test Company',
    location: 'San Francisco, CA',
    description: 'Join our frontend team to build amazing user experiences',
    requirements: ['React', 'TypeScript', '3+ years experience'],
    salary: '$150,000 - $200,000',
    url: 'https://testcompany.com/careers/123',
    portal: 'lever' as const,
    benefits: ['Health Insurance', 'Stock Options'],
    companySize: 'medium' as const,
    workArrangement: 'hybrid' as const,
    industry: 'Technology'
  },
  status: 'applied' as const,
  dates: {
    applied: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-20'),
    interviews: [],
    responses: []
  },
  documents: {
    resume: {
      id: 'resume-1',
      name: 'John_Doe_Resume.pdf',
      type: 'resume' as const,
      url: 'https://storage.example.com/resume.pdf',
      size: 1024000,
      uploadedAt: new Date('2024-01-15')
    },
    coverLetter: null,
    others: []
  },
  notes: 'Great opportunity, excited about the tech stack',
  tags: ['frontend', 'react', 'high-priority'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20')
};

// Custom render function that includes router context
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

export function renderWithRouter(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { route = '/', ...renderOptions } = options;

  // Set the initial route
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithRouter as render };

// Common test utilities
export const waitForLoadingToFinish = async () => {
  const { waitForElementToBeRemoved } = await import('@testing-library/react');
  await waitForElementToBeRemoved(() => document.querySelector('[data-testid="loading-spinner"]'));
};

export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

export const createMockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

// Form testing utilities
export const fillForm = async (formData: Record<string, string>) => {
  const { screen, fireEvent } = await import('@testing-library/react');
  
  for (const [fieldName, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i')) ||
                  screen.getByPlaceholderText(new RegExp(fieldName, 'i')) ||
                  screen.getByRole('textbox', { name: new RegExp(fieldName, 'i') });
    
    fireEvent.change(field, { target: { value } });
  }
};

export const submitForm = async () => {
  const { screen, fireEvent } = await import('@testing-library/react');
  const submitButton = screen.getByRole('button', { name: /submit|save|create/i });
  fireEvent.click(submitButton);
};

// Mock functions for common use cases
export const createMockHandlers = () => ({
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onArchive: vi.fn(),
  onViewDetails: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn(),
  onChange: vi.fn(),
  onClick: vi.fn(),
  onSubmit: vi.fn(),
});

// Date utilities for testing
export const createDateRange = (startDaysAgo: number, endDaysAgo: number = 0) => {
  const now = new Date();
  const start = new Date(now.getTime() - startDaysAgo * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() - endDaysAgo * 24 * 60 * 60 * 1000);
  return { start, end };
};

// Mock API responses
export const createMockApiResponse = <T,>(data: T, success = true) => ({
  data,
  success,
  message: success ? 'Success' : 'Error',
  errors: success ? [] : ['Something went wrong']
});

// Local storage mocking
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }),
    length: Object.keys(storage).length,
    key: vi.fn((index: number) => Object.keys(storage)[index] || null),
  };
};