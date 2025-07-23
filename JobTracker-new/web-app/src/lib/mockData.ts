import type { 
  UserProfile, 
  JobApplication, 
  DashboardMetrics, 
  ApplicationStatus,
  DocumentReference,
  StatusHistoryEntry,
  AIInsights
} from '@/types';
import { stringUtils } from './utils';

// Mock User Profile
export const mockUserProfile: UserProfile = {
  userId: stringUtils.generateId('user'),
  personalInfo: {
    name: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    websites: [
      'https://linkedin.com/in/alexmorgan',
      'https://github.com/alexmorgan',
      'https://alexmorgan.dev',
      'https://medium.com/@alexmorgan'
    ]
  },
  education: [
    {
      id: stringUtils.generateId('edu'),
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2020-05-15'),
      description: 'Specialized in Machine Learning and Distributed Systems. Thesis on "Real-time Data Processing for Large-scale Applications". GPA: 3.8/4.0',
      gpa: 3.8,
      achievements: [
        'Dean\'s List for 3 consecutive semesters',
        'Graduate Research Assistant',
        'Published 2 papers in top-tier conferences'
      ]
    },
    {
      id: stringUtils.generateId('edu'),
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science',
      field: 'Electrical Engineering and Computer Science',
      startDate: new Date('2014-08-01'),
      endDate: new Date('2018-05-15'),
      description: 'Focus on software engineering and computer systems. Senior project on distributed database optimization.',
      gpa: 3.6,
      achievements: [
        'Cum Laude',
        'ACM Student Chapter President',
        'Hackathon Winner - Cal Hacks 2017'
      ]
    }
  ],
  experience: [
    {
      id: stringUtils.generateId('exp'),
      company: 'Meta',
      title: 'Senior Software Engineer',
      startDate: new Date('2022-03-01'),
      endDate: undefined,
      current: true,
      description: 'Lead backend development for Instagram Stories infrastructure, serving 500M+ daily active users. Designed and implemented microservices architecture that improved system reliability by 40% and reduced latency by 25%.',
      skills: ['Python', 'Go', 'Kubernetes', 'GraphQL', 'PostgreSQL', 'Redis', 'AWS'],
      achievements: [
        'Led team of 5 engineers in successful migration to microservices',
        'Reduced infrastructure costs by 30% through optimization',
        'Mentored 3 junior engineers, 2 received promotions'
      ],
      location: 'Menlo Park, CA'
    },
    {
      id: stringUtils.generateId('exp'),
      company: 'Stripe',
      title: 'Software Engineer',
      startDate: new Date('2020-06-01'),
      endDate: new Date('2022-02-28'),
      current: false,
      description: 'Developed payment processing systems handling $100B+ in annual volume. Built real-time fraud detection system that reduced fraudulent transactions by 35%.',
      skills: ['Ruby', 'JavaScript', 'React', 'MySQL', 'Docker', 'Terraform'],
      achievements: [
        'Implemented ML-based fraud detection system',
        'Improved API response times by 50%',
        'Led integration with 5 major payment providers'
      ],
      location: 'San Francisco, CA'
    },
    {
      id: stringUtils.generateId('exp'),
      company: 'Google',
      title: 'Software Engineer Intern',
      startDate: new Date('2019-06-01'),
      endDate: new Date('2019-08-31'),
      current: false,
      description: 'Worked on Google Search infrastructure team. Developed features for the search indexing pipeline that improved crawling efficiency by 20%.',
      skills: ['Java', 'C++', 'Protocol Buffers', 'MapReduce', 'Bigtable'],
      achievements: [
        'Intern project adopted by production team',
        'Presented to senior leadership',
        'Received full-time offer'
      ],
      location: 'Mountain View, CA'
    }
  ],
  skills: [
    // Technical Skills
    { id: stringUtils.generateId('skill'), name: 'Python', level: 'expert', category: 'technical', yearsOfExperience: 6, verified: true },
    { id: stringUtils.generateId('skill'), name: 'JavaScript', level: 'expert', category: 'technical', yearsOfExperience: 5, verified: true },
    { id: stringUtils.generateId('skill'), name: 'TypeScript', level: 'advanced', category: 'technical', yearsOfExperience: 4, verified: true },
    { id: stringUtils.generateId('skill'), name: 'React', level: 'expert', category: 'technical', yearsOfExperience: 4, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Node.js', level: 'advanced', category: 'technical', yearsOfExperience: 4, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Go', level: 'advanced', category: 'technical', yearsOfExperience: 3, verified: true },
    { id: stringUtils.generateId('skill'), name: 'SQL', level: 'expert', category: 'technical', yearsOfExperience: 6, verified: true },
    { id: stringUtils.generateId('skill'), name: 'GraphQL', level: 'advanced', category: 'technical', yearsOfExperience: 3, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Docker', level: 'advanced', category: 'technical', yearsOfExperience: 4, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Kubernetes', level: 'intermediate', category: 'technical', yearsOfExperience: 2, verified: true },
    { id: stringUtils.generateId('skill'), name: 'AWS', level: 'advanced', category: 'technical', yearsOfExperience: 4, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Machine Learning', level: 'intermediate', category: 'technical', yearsOfExperience: 3, verified: false },
    
    // Tools
    { id: stringUtils.generateId('skill'), name: 'Git', level: 'expert', category: 'tool', yearsOfExperience: 6, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Jira', level: 'advanced', category: 'tool', yearsOfExperience: 4, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Figma', level: 'intermediate', category: 'tool', yearsOfExperience: 2, verified: false },
    { id: stringUtils.generateId('skill'), name: 'Terraform', level: 'intermediate', category: 'tool', yearsOfExperience: 2, verified: true },
    
    // Soft Skills
    { id: stringUtils.generateId('skill'), name: 'Leadership', level: 'advanced', category: 'soft', yearsOfExperience: 3, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Communication', level: 'expert', category: 'soft', yearsOfExperience: 6, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Problem Solving', level: 'expert', category: 'soft', yearsOfExperience: 6, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Team Collaboration', level: 'expert', category: 'soft', yearsOfExperience: 6, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Project Management', level: 'advanced', category: 'soft', yearsOfExperience: 3, verified: true },
    
    // Languages
    { id: stringUtils.generateId('skill'), name: 'English', level: 'expert', category: 'language', yearsOfExperience: 25, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Spanish', level: 'intermediate', category: 'language', yearsOfExperience: 8, verified: false },
    
    // Certifications
    { id: stringUtils.generateId('skill'), name: 'AWS Solutions Architect', level: 'advanced', category: 'certification', yearsOfExperience: 2, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Google Cloud Professional', level: 'intermediate', category: 'certification', yearsOfExperience: 1, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Kubernetes Administrator', level: 'intermediate', category: 'certification', yearsOfExperience: 1, verified: true },
    
    // Additional Technical Skills
    { id: stringUtils.generateId('skill'), name: 'PostgreSQL', level: 'advanced', category: 'technical', yearsOfExperience: 5, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Redis', level: 'advanced', category: 'technical', yearsOfExperience: 3, verified: true },
    { id: stringUtils.generateId('skill'), name: 'MongoDB', level: 'intermediate', category: 'technical', yearsOfExperience: 2, verified: true },
    { id: stringUtils.generateId('skill'), name: 'Rust', level: 'beginner', category: 'technical', yearsOfExperience: 1, verified: false },
    { id: stringUtils.generateId('skill'), name: 'Swift', level: 'beginner', category: 'technical', yearsOfExperience: 1, verified: false }
  ],
  preferences: {
    jobTypes: ['full-time'],
    locations: ['San Francisco, CA', 'Seattle, WA', 'New York, NY', 'Remote'],
    industries: ['Technology', 'Fintech', 'Healthcare', 'E-commerce'],
    roles: ['Senior Software Engineer', 'Staff Software Engineer', 'Principal Engineer', 'Engineering Manager'],
    salaryRange: {
      min: 180000,
      max: 280000,
      currency: 'USD'
    },
    workArrangement: ['remote', 'hybrid'],
    companySize: ['medium', 'large', 'enterprise'],
    benefits: ['Health Insurance', 'Stock Options', '401k Matching', 'Flexible PTO', 'Learning Budget']
  },
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2024-12-20')
};

// Helper function to create mock documents
const createMockDocument = (name: string, type: DocumentReference['type']): DocumentReference => ({
  id: stringUtils.generateId('doc'),
  name,
  type,
  url: `https://storage.example.com/documents/${stringUtils.slugify(name)}.pdf`,
  size: Math.floor(Math.random() * 2000000) + 100000, // 100KB - 2MB
  uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
});

// Helper function to create status history
const createStatusHistory = (statuses: ApplicationStatus[]): StatusHistoryEntry[] => {
  const history: StatusHistoryEntry[] = [];
  let currentDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Last 60 days
  
  statuses.forEach((status, index) => {
    history.push({
      id: stringUtils.generateId('status'),
      status,
      date: new Date(currentDate),
      notes: index === 0 ? 'Application submitted successfully' : 
             status === 'rejected' ? 'Unfortunately, we have decided to move forward with other candidates' :
             status === 'interview' ? 'Scheduled for technical interview' :
             status === 'offer' ? 'Congratulations! We would like to extend an offer' :
             `Status updated to ${status}`,
      source: index === 0 ? 'automatic' : 'manual'
    });
    
    // Move date forward by 3-10 days
    currentDate = new Date(currentDate.getTime() + (Math.random() * 7 + 3) * 24 * 60 * 60 * 1000);
  });
  
  return history;
};

// Helper function to create AI insights
const createAIInsights = (matchScore: number): AIInsights => ({
  matchScore,
  skillGaps: matchScore < 70 ? ['Docker', 'Kubernetes', 'System Design'] : 
             matchScore < 85 ? ['GraphQL', 'Redis'] : [],
  suggestions: [
    'Emphasize your experience with large-scale systems',
    'Highlight your leadership experience',
    'Mention specific performance improvements you\'ve achieved'
  ],
  resumeOptimization: {
    keywordsToAdd: ['microservices', 'scalability', 'performance optimization'],
    sectionsToImprove: ['Work Experience', 'Technical Skills'],
    overallScore: Math.max(70, matchScore - 10),
    recommendations: [
      'Add more quantifiable achievements',
      'Include relevant technologies mentioned in job description',
      'Emphasize leadership and mentoring experience'
    ]
  },
  interviewTips: [
    'Prepare examples of system design challenges you\'ve solved',
    'Be ready to discuss trade-offs in your technical decisions',
    'Highlight your collaboration with cross-functional teams'
  ],
  lastAnalyzed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
});

// Mock Job Applications with enhanced diversity
export const mockJobApplications: JobApplication[] = [
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Senior Software Engineer - Infrastructure',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      description: 'We are looking for a Senior Software Engineer to join our Infrastructure team. You will be responsible for building and maintaining the systems that power our platform, serving millions of users worldwide.',
      requirements: [
        '5+ years of experience in software engineering',
        'Experience with distributed systems and microservices',
        'Proficiency in Python, Go, or Java',
        'Experience with cloud platforms (AWS, GCP, Azure)',
        'Strong problem-solving and communication skills'
      ],
      salary: '$180,000 - $220,000',
      url: 'https://careers.airbnb.com/positions/12345',
      portal: 'greenhouse',
      benefits: ['Health Insurance', 'Stock Options', 'Flexible PTO', 'Learning Budget'],
      companySize: 'large',
      workArrangement: 'hybrid',
      industry: 'Technology'
    },
    status: 'interview',
    statusHistory: createStatusHistory(['applied', 'under_review', 'phone_screen', 'interview']),
    dates: {
      applied: new Date('2024-12-01'),
      lastUpdated: new Date('2024-12-18'),
      interviews: [new Date('2024-12-15'), new Date('2024-12-22')],
      responses: [new Date('2024-12-05'), new Date('2024-12-12')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Airbnb', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Airbnb', 'cover_letter'),
      others: []
    },
    notes: 'Really excited about this opportunity. The infrastructure challenges at Airbnb scale would be perfect for my background. Interview went well, waiting for next steps.',
    tags: ['high-priority', 'infrastructure', 'microservices'],
    aiInsights: createAIInsights(88),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-18')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Staff Software Engineer',
      company: 'Coinbase',
      location: 'Remote',
      description: 'Join our team to build the future of finance. We are looking for a Staff Software Engineer to lead technical initiatives and mentor junior engineers.',
      requirements: [
        '7+ years of software engineering experience',
        'Experience leading technical projects',
        'Strong background in financial systems or fintech',
        'Experience with high-throughput, low-latency systems',
        'Leadership and mentoring experience'
      ],
      salary: '$220,000 - $280,000',
      url: 'https://www.coinbase.com/careers/positions/54321',
      portal: 'lever',
      benefits: ['Competitive Salary', 'Crypto Benefits', 'Remote Work', 'Health Insurance'],
      companySize: 'large',
      workArrangement: 'remote',
      industry: 'Fintech'
    },
    status: 'final_interview',
    statusHistory: createStatusHistory(['applied', 'under_review', 'phone_screen', 'interview', 'final_interview']),
    dates: {
      applied: new Date('2024-11-15'),
      lastUpdated: new Date('2024-12-20'),
      interviews: [
        new Date('2024-11-28'),
        new Date('2024-12-05'),
        new Date('2024-12-12'),
        new Date('2024-12-19')
      ],
      responses: [new Date('2024-11-20'), new Date('2024-11-25'), new Date('2024-12-02')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Coinbase', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Coinbase', 'cover_letter'),
      others: [createMockDocument('Technical_Portfolio', 'portfolio')]
    },
    notes: 'Final round interview scheduled. Team seems great and the technical challenges are exactly what I\'m looking for. Compensation package looks very competitive.',
    tags: ['high-priority', 'fintech', 'remote', 'staff-level'],
    aiInsights: createAIInsights(92),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Principal Engineer - Backend',
      company: 'Uber',
      location: 'Seattle, WA',
      description: 'Lead the architecture and development of Uber\'s core backend systems. Drive technical vision and mentor engineering teams.',
      requirements: [
        '8+ years of backend engineering experience',
        'Experience with large-scale distributed systems',
        'Strong architectural and system design skills',
        'Experience leading and mentoring engineering teams',
        'Track record of delivering complex technical projects'
      ],
      salary: '$250,000 - $320,000',
      url: 'https://www.uber.com/careers/list/67890',
      portal: 'workday',
      benefits: ['Stock Options', 'Health Insurance', 'Relocation Assistance', 'Learning Budget'],
      companySize: 'enterprise',
      workArrangement: 'hybrid',
      industry: 'Technology'
    },
    status: 'offer',
    statusHistory: createStatusHistory(['applied', 'under_review', 'phone_screen', 'interview', 'final_interview', 'offer']),
    dates: {
      applied: new Date('2024-10-20'),
      lastUpdated: new Date('2024-12-22'),
      interviews: [
        new Date('2024-11-05'),
        new Date('2024-11-12'),
        new Date('2024-11-19'),
        new Date('2024-11-26'),
        new Date('2024-12-03')
      ],
      responses: [
        new Date('2024-10-25'),
        new Date('2024-11-01'),
        new Date('2024-11-08'),
        new Date('2024-12-22')
      ]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Uber', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Uber', 'cover_letter'),
      others: [
        createMockDocument('System_Design_Portfolio', 'portfolio'),
        createMockDocument('Leadership_Examples', 'other')
      ]
    },
    notes: 'Received offer! Very strong compensation package and excited about the technical challenges. Need to make decision by end of December.',
    tags: ['offer', 'principal-level', 'urgent', 'high-comp'],
    aiInsights: createAIInsights(95),
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-12-22')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Senior Software Engineer - Platform',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      description: 'Help build the platform that powers Netflix streaming for 230+ million subscribers worldwide.',
      requirements: [
        '5+ years of software engineering experience',
        'Experience with streaming or media platforms',
        'Strong knowledge of Java or Python',
        'Experience with microservices and cloud platforms',
        'Understanding of video streaming technologies'
      ],
      salary: '$170,000 - $210,000',
      url: 'https://jobs.netflix.com/jobs/13579',
      portal: 'greenhouse',
      benefits: ['Unlimited PTO', 'Stock Options', 'Health Insurance', 'Content Budget'],
      companySize: 'large',
      workArrangement: 'hybrid',
      industry: 'Media & Entertainment'
    },
    status: 'rejected',
    statusHistory: createStatusHistory(['applied', 'under_review', 'phone_screen', 'rejected']),
    dates: {
      applied: new Date('2024-11-01'),
      lastUpdated: new Date('2024-11-25'),
      interviews: [new Date('2024-11-15')],
      responses: [new Date('2024-11-08'), new Date('2024-11-25')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Netflix', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Netflix', 'cover_letter'),
      others: []
    },
    notes: 'Unfortunately didn\'t move forward after phone screen. Feedback was that they were looking for more specific streaming/media experience.',
    tags: ['rejected', 'media', 'feedback-received'],
    aiInsights: createAIInsights(75),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-25')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Engineering Manager - Infrastructure',
      company: 'Slack',
      location: 'San Francisco, CA',
      description: 'Lead a team of engineers building the infrastructure that powers Slack for millions of users worldwide.',
      requirements: [
        '6+ years of software engineering experience',
        '2+ years of engineering management experience',
        'Experience with distributed systems and cloud platforms',
        'Strong leadership and communication skills',
        'Experience with team building and mentoring'
      ],
      salary: '$190,000 - $240,000',
      url: 'https://slack.com/careers/24680',
      portal: 'lever',
      benefits: ['Stock Options', 'Health Insurance', 'Flexible PTO', 'Wellness Budget'],
      companySize: 'large',
      workArrangement: 'hybrid',
      industry: 'Technology'
    },
    status: 'phone_screen',
    statusHistory: createStatusHistory(['applied', 'under_review', 'phone_screen']),
    dates: {
      applied: new Date('2024-12-10'),
      lastUpdated: new Date('2024-12-20'),
      interviews: [new Date('2024-12-18')],
      responses: [new Date('2024-12-15')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Slack_EM', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Slack', 'cover_letter'),
      others: [createMockDocument('Management_Philosophy', 'other')]
    },
    notes: 'Exploring management track. Phone screen went well, discussing my leadership experience at Meta. Next round scheduled for next week.',
    tags: ['management', 'leadership', 'infrastructure'],
    aiInsights: createAIInsights(82),
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Senior Full Stack Engineer',
      company: 'Discord',
      location: 'Remote',
      description: 'Build features that connect millions of users in gaming communities worldwide. Work across our entire stack.',
      requirements: [
        '4+ years of full stack development experience',
        'Experience with React and Node.js',
        'Understanding of real-time systems and WebRTC',
        'Experience with gaming or social platforms preferred',
        'Strong collaboration skills'
      ],
      salary: '$160,000 - $200,000',
      url: 'https://discord.com/jobs/97531',
      portal: 'greenhouse',
      benefits: ['Remote Work', 'Stock Options', 'Health Insurance', 'Gaming Budget'],
      companySize: 'medium',
      workArrangement: 'remote',
      industry: 'Technology'
    },
    status: 'applied',
    statusHistory: createStatusHistory(['applied']),
    dates: {
      applied: new Date('2024-12-15'),
      lastUpdated: new Date('2024-12-15'),
      interviews: [],
      responses: []
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Discord', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Discord', 'cover_letter'),
      others: []
    },
    notes: 'Just applied. Interested in the gaming/community aspect and the fully remote nature. Waiting for initial response.',
    tags: ['recent', 'remote', 'gaming', 'full-stack'],
    aiInsights: createAIInsights(79),
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Principal Software Engineer',
      company: 'Apple',
      location: 'Cupertino, CA',
      description: 'Join Apple\'s Core Services team to build the next generation of cloud infrastructure powering billions of devices worldwide.',
      requirements: [
        '8+ years of distributed systems experience',
        'Experience with Swift or Objective-C preferred',
        'Strong background in large-scale system architecture',
        'Experience with privacy-focused engineering',
        'Track record of technical leadership'
      ],
      salary: '$260,000 - $350,000',
      url: 'https://jobs.apple.com/en-us/details/200123456',
      portal: 'workday',
      benefits: ['Stock Options', 'Health Insurance', 'Product Discounts', 'Learning Budget'],
      companySize: 'enterprise',
      workArrangement: 'hybrid',
      industry: 'Technology'
    },
    status: 'under_review',
    statusHistory: createStatusHistory(['applied', 'under_review']),
    dates: {
      applied: new Date('2024-12-18'),
      lastUpdated: new Date('2024-12-20'),
      interviews: [],
      responses: [new Date('2024-12-19')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Apple', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Apple', 'cover_letter'),
      others: []
    },
    notes: 'Dream company opportunity. Love Apple\'s focus on privacy and user experience. Hoping to hear back soon.',
    tags: ['dream-job', 'privacy', 'principal-level'],
    aiInsights: createAIInsights(85),
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Senior Backend Engineer - Payments',
      company: 'Square',
      location: 'San Francisco, CA',
      description: 'Build the payment infrastructure that powers millions of small businesses. Work on real-time payment processing, fraud detection, and financial APIs.',
      requirements: [
        '5+ years backend development experience',
        'Experience with payment systems or fintech',
        'Strong knowledge of Java, Go, or Python',
        'Understanding of financial regulations and security',
        'Experience with high-volume transaction processing'
      ],
      salary: '$175,000 - $215,000',
      url: 'https://careers.squareup.com/us/en/jobs/456789',
      portal: 'greenhouse',
      benefits: ['Stock Options', 'Health Insurance', 'Wellness Budget', 'Commuter Benefits'],
      companySize: 'large',
      workArrangement: 'hybrid',
      industry: 'Fintech'
    },
    status: 'rejected',
    statusHistory: createStatusHistory(['applied', 'under_review', 'phone_screen', 'rejected']),
    dates: {
      applied: new Date('2024-11-20'),
      lastUpdated: new Date('2024-12-10'),
      interviews: [new Date('2024-12-05')],
      responses: [new Date('2024-11-25'), new Date('2024-12-10')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Square', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Square', 'cover_letter'),
      others: []
    },
    notes: 'Good interview but they wanted more direct fintech/payments experience. Valuable feedback for future applications.',
    tags: ['rejected', 'payments', 'fintech', 'feedback'],
    aiInsights: createAIInsights(72),
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Staff Software Engineer - ML Infrastructure',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      description: 'Build the infrastructure that powers ChatGPT and GPT models. Work on large-scale ML training, inference optimization, and distributed systems.',
      requirements: [
        '6+ years of infrastructure engineering experience',
        'Experience with ML/AI systems and GPU computing',
        'Strong background in distributed systems',
        'Experience with PyTorch, TensorFlow, or similar',
        'Understanding of CUDA and high-performance computing'
      ],
      salary: '$240,000 - $320,000',
      url: 'https://openai.com/careers/staff-software-engineer-ml-infrastructure',
      portal: 'lever',
      benefits: ['Equity', 'Health Insurance', 'Unlimited PTO', 'AI Research Access'],
      companySize: 'medium',
      workArrangement: 'hybrid',
      industry: 'AI/ML'
    },
    status: 'phone_screen',
    statusHistory: createStatusHistory(['applied', 'under_review', 'phone_screen']),
    dates: {
      applied: new Date('2024-12-05'),
      lastUpdated: new Date('2024-12-16'),
      interviews: [new Date('2024-12-14')],
      responses: [new Date('2024-12-10')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_OpenAI', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_OpenAI', 'cover_letter'),
      others: [createMockDocument('ML_Projects_Portfolio', 'portfolio')]
    },
    notes: 'Incredible opportunity to work on cutting-edge AI infrastructure. Phone screen went well, discussed my ML coursework and interest in AI systems.',
    tags: ['ai', 'ml', 'cutting-edge', 'high-growth'],
    aiInsights: createAIInsights(78),
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: stringUtils.generateId('app'),
    userId: mockUserProfile.userId,
    job: {
      title: 'Senior Full Stack Engineer',
      company: 'Figma',
      location: 'San Francisco, CA',
      description: 'Help build the collaborative design platform used by millions of designers and developers worldwide. Work across our entire stack.',
      requirements: [
        '4+ years of full stack development experience',
        'Strong React and TypeScript skills',
        'Experience with real-time collaborative features',
        'Understanding of design tools and workflows',
        'Experience with WebGL or Canvas preferred'
      ],
      salary: '$170,000 - $210,000',
      url: 'https://www.figma.com/careers/job/987654',
      portal: 'greenhouse',
      benefits: ['Stock Options', 'Health Insurance', 'Design Tools Budget', 'Flexible PTO'],
      companySize: 'medium',
      workArrangement: 'hybrid',
      industry: 'Design Tech'
    },
    status: 'withdrawn',
    statusHistory: createStatusHistory(['applied', 'under_review', 'withdrawn']),
    dates: {
      applied: new Date('2024-11-25'),
      lastUpdated: new Date('2024-12-08'),
      interviews: [],
      responses: [new Date('2024-12-01')]
    },
    documents: {
      resume: createMockDocument('Alex_Morgan_Resume_Figma', 'resume'),
      coverLetter: createMockDocument('Alex_Morgan_Cover_Letter_Figma', 'cover_letter'),
      others: []
    },
    notes: 'Withdrew application after receiving Uber offer. Would love to work here in the future - amazing product and team.',
    tags: ['withdrawn', 'design', 'collaboration', 'future-interest'],
    aiInsights: createAIInsights(81),
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-08')
  }
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalApplications: mockJobApplications.length,
  activeApplications: mockJobApplications.filter(app => 
    !['rejected', 'withdrawn', 'expired'].includes(app.status)
  ).length,
  interviewRate: 72, // 8 out of 11 applications got interviews
  responseRate: 91, // 10 out of 11 applications got responses
  averageResponseTime: 5, // Average 5 days
  topCompanies: ['Apple', 'OpenAI', 'Coinbase', 'Uber', 'Airbnb', 'Meta', 'Slack'],
  topSkills: ['Python', 'JavaScript', 'React', 'AWS', 'Docker', 'TypeScript', 'Go'],
  recentActivity: [
    {
      id: stringUtils.generateId('activity'),
      type: 'status_changed',
      description: 'Uber application status changed to Offer',
      date: new Date('2024-12-22'),
      applicationId: mockJobApplications[2].id
    },
    {
      id: stringUtils.generateId('activity'),
      type: 'application_submitted',
      description: 'Applied to Apple - Principal Software Engineer',
      date: new Date('2024-12-20'),
      applicationId: mockJobApplications[6].id
    },
    {
      id: stringUtils.generateId('activity'),
      type: 'interview_scheduled',
      description: 'Interview scheduled with Slack for Dec 25',
      date: new Date('2024-12-20'),
      applicationId: mockJobApplications[4].id
    },
    {
      id: stringUtils.generateId('activity'),
      type: 'status_changed',
      description: 'Airbnb application moved to Interview stage',
      date: new Date('2024-12-18'),
      applicationId: mockJobApplications[0].id
    },
    {
      id: stringUtils.generateId('activity'),
      type: 'status_changed',
      description: 'OpenAI phone screen completed successfully',
      date: new Date('2024-12-16'),
      applicationId: mockJobApplications[8].id
    },
    {
      id: stringUtils.generateId('activity'),
      type: 'application_submitted',
      description: 'Applied to Discord - Senior Full Stack Engineer',
      date: new Date('2024-12-15'),
      applicationId: mockJobApplications[5].id
    },
    {
      id: stringUtils.generateId('activity'),
      type: 'status_changed',
      description: 'Square application unfortunately rejected',
      date: new Date('2024-12-10'),
      applicationId: mockJobApplications[7].id
    },
    {
      id: stringUtils.generateId('activity'),
      type: 'status_changed',
      description: 'Withdrew Figma application after Uber offer',
      date: new Date('2024-12-08'),
      applicationId: mockJobApplications[9].id
    }
  ]
};

// Export all mock data for easy access
export const mockData = {
  userProfile: mockUserProfile,
  jobApplications: mockJobApplications,
  dashboardMetrics: mockDashboardMetrics
};