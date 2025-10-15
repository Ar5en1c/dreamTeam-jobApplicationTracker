# Getting Started with Job Application Tracker

Get your local development environment running in 10 minutes.

## Prerequisites

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **Git**: Latest version
- **Supabase Account**: Free tier ([Sign up](https://supabase.com))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/JobApplicationTracker.git
cd JobApplicationTracker/JobTracker-new/web-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes).

### 3. Environment Setup

Create your local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Feature Flags
VITE_USE_MOCK_DATA=false
```

**Where to find your Supabase credentials:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings > API
4. Copy the Project URL and anon public key

### 4. Database Setup

Follow the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide to:
- Create database tables
- Set up Row-Level Security policies
- Configure authentication providers

This is a one-time setup (~5 minutes).

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at:
- **Local**: http://localhost:5173
- **Network**: http://your-ip:5173 (for testing on mobile)

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run test suite
npm run test:ui      # Run tests with UI
npm run coverage     # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Project Structure

```
web-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base components (Button, Card, etc.)
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Layout components (Header, Sidebar)
│   │   └── features/    # Feature-specific components
│   ├── pages/           # Page components (Dashboard, Profile, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── services/        # API services (database, etc.)
│   ├── lib/             # Utilities and helpers
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── dist/                # Build output (generated)
```

## Test Accounts

For development, you can create test users via Supabase Auth:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add user" → Email
4. Create test@example.com with password

**Important**: Disable email confirmation in Supabase settings for faster testing.

## Common Issues

### Port Already in Use

If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### TypeScript Errors

If you see TypeScript errors:
```bash
npm run type-check
```

Fix errors before committing.

### Database Connection Failed

Check:
1. `.env.local` file exists with correct credentials
2. Supabase project is active (not paused)
3. Database tables are created (run SQL from SUPABASE_SETUP.md)

### Authentication Not Working

Verify:
1. Supabase Auth is enabled in dashboard
2. Email provider is configured
3. Site URL is set to http://localhost:5173

## Next Steps

1. **Explore the App**: Navigate through all pages
2. **Read Documentation**: Check [STRATEGIC-MASTER-PLAN.md](./STRATEGIC-MASTER-PLAN.md)
3. **Join Discussion**: Create GitHub issues for questions
4. **Start Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Need Help?

- **Documentation**: See `STRATEGIC-MASTER-PLAN.md` for comprehensive guide
- **Issues**: Create a GitHub issue
- **Technical Lead**: Schedule a call for onboarding

---

**Welcome to the team! Let's build something amazing. 🚀**
