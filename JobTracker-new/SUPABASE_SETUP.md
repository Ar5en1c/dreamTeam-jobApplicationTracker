# Supabase Setup Guide

This guide will help you set up Supabase as the backend for your Job Application Tracker.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `job-application-tracker`
   - Database Password: Generate a strong password (save it!) v4&5H2btW_h_b27
   - Region: Choose closest to your users

## 2. Database Schema Setup

Once your project is created, go to the SQL Editor and run this schema:

```sql
-- Create custom types
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE skill_category AS ENUM ('technical', 'soft', 'language', 'certification', 'tool');
CREATE TYPE application_status AS ENUM ('draft', 'applied', 'under_review', 'phone_screen', 'interview', 'final_interview', 'offer', 'rejected', 'withdrawn', 'expired');
CREATE TYPE job_portal AS ENUM ('lever', 'greenhouse', 'workday', 'ultipro', 'smartrecruiters', 'oracle', 'jobvite', 'ashby', 'taleo', 'eightfold', 'linkedin', 'indeed', 'glassdoor', 'direct', 'other');
CREATE TYPE work_arrangement AS ENUM ('remote', 'hybrid', 'on-site');
CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');

-- User profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    websites TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Skills table
CREATE TABLE skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    level skill_level NOT NULL,
    category skill_category NOT NULL,
    years_of_experience INTEGER,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Experiences table
CREATE TABLE experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    achievements TEXT[],
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Education table
CREATE TABLE education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT NOT NULL,
    gpa DECIMAL(3,2),
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Job applications table
CREATE TABLE job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    salary TEXT NOT NULL,
    url TEXT NOT NULL,
    portal job_portal NOT NULL,
    benefits TEXT[],
    company_size company_size,
    work_arrangement work_arrangement,
    industry TEXT,
    status application_status NOT NULL,
    notes TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    applied_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own skills" ON skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own skills" ON skills FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own experiences" ON experiences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experiences" ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiences" ON experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiences" ON experiences FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own education" ON education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own education" ON education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education" ON education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own education" ON education FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON job_applications FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Get Your Supabase Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL: https://supabase.com/dashboard/project/uyfbljkptxuncmxpafyh
   - Anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5ZmJsamtwdHh1bmNteHBhZnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzU0OTQsImV4cCI6MjA2ODkxMTQ5NH0.\_VP3EEBe0WStxycg9gXyolpyTKKiV1cbkbWbLnP4-38

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_USE_MOCK_DATA=false
   ```

## 5. Install Dependencies

```bash
npm install
```

## 6. Test the Connection

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The app should now connect to your Supabase database
3. You should see "Demo Mode" badge disappear from the Applications page
4. Try creating, editing, and deleting applications to test the functionality

## 7. Authentication Setup (Optional)

To add user authentication:

1. Go to Authentication > Settings in Supabase
2. Configure your site URL: `http://localhost:5173`
3. Add authentication providers (email, Google, GitHub, etc.)
4. Update the app to use Supabase Auth

## Troubleshooting

### Common Issues:

1. **Connection Errors**: Check your environment variables are correct
2. **RLS Policy Errors**: Ensure you're authenticated and policies are set up correctly
3. **Type Errors**: Make sure all enum types are created in the database

### Demo Mode Fallback

If there are any issues with Supabase, the app will automatically fall back to mock data and show "Demo Mode" badge.

## Next Steps

Once Supabase is working:

1. Add user authentication
2. Set up real-time subscriptions
3. Add file storage for resumes
4. Implement advanced features like AI insights

## Support

If you need help:

1. Check the Supabase documentation
2. Review the console for error messages
3. Ensure all SQL schema is applied correctly
