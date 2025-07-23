import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

// Mock the data
vi.mock('@/lib/mockData', () => ({
  mockUserProfile: {
    personalInfo: {
      name: 'John Doe',
    },
    skills: [],
    experience: [
      {
        title: 'Software Engineer',
        company: 'Tech Corp',
      }
    ],
  },
  mockJobApplications: [
    {
      id: '1',
      job: {
        title: 'Senior Developer',
        company: 'Test Company',
        location: 'San Francisco',
      },
      status: 'applied',
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      job: {
        title: 'Frontend Engineer',
        company: 'Another Company',
        location: 'New York',
      },
      status: 'interview',
      updatedAt: new Date('2024-01-02'),
    },
  ],
  mockDashboardMetrics: {
    totalApplications: 2,
    activeApplications: 2,
    interviewRate: 50,
    averageResponseTime: 5,
    recentActivity: [
      {
        id: '1',
        type: 'application_submitted',
        description: 'Applied to Test Company',
        date: new Date('2024-01-01'),
      },
    ],
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  jobUtils: {
    calculateProfileCompleteness: vi.fn(() => 85),
  },
  dateUtils: {
    formatRelative: vi.fn((date) => '2 days ago'),
  },
}));

describe('Dashboard', () => {
  it('renders welcome message with user name', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/Welcome back, John!/)).toBeInTheDocument();
  });

  it('displays key metrics cards', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Total Applications')).toBeInTheDocument();
    expect(screen.getByText('Active Applications')).toBeInTheDocument();
    expect(screen.getByText('Interview Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    
    // Check metric values
    expect(screen.getByText('2')).toBeInTheDocument(); // Total applications
    expect(screen.getByText('50%')).toBeInTheDocument(); // Interview rate
    expect(screen.getByText('5 days')).toBeInTheDocument(); // Response time
  });

  it('shows profile completeness section', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Profile Completeness')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('displays recent applications section', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Recent Applications')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('shows recent activity section', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Applied to Test Company')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('New Application')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
    expect(screen.getByText('View All')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<Dashboard />);
    
    const mainContainer = screen.getByText(/Welcome back, John!/).closest('div');
    expect(mainContainer).toHaveClass('space-y-8');
  });

  it('shows completion status indicators', () => {
    render(<Dashboard />);
    
    // All sections should show as complete
    const completeIndicators = screen.getAllByText('✓ Complete');
    expect(completeIndicators).toHaveLength(4); // Personal Info, Experience, Skills, Education
  });

  it('renders with proper accessibility', () => {
    render(<Dashboard />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for proper button roles
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});