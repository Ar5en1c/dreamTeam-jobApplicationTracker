-- Re-enable RLS and set up proper authentication
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to use auth.uid() instead of user_id parameter
-- This ensures only authenticated users can access their own data

-- Job Applications policies
DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON job_applications;

CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON job_applications FOR DELETE USING (auth.uid() = user_id);

-- Test with some sample data (will only work when authenticated)
-- You can run this after signing in to the app
/*
INSERT INTO job_applications (
  user_id,
  job_title,
  company,
  location,
  description,
  requirements,
  salary,
  url,
  portal,
  status,
  notes,
  tags,
  applied_date
) VALUES (
  auth.uid(), -- This will use the current authenticated user's ID
  'Full Stack Developer',
  'TechCorp',
  'Remote',
  'We are looking for a full stack developer...',
  ARRAY['React', 'Node.js', 'PostgreSQL'],
  '$90,000 - $130,000',
  'https://techcorp.com/jobs/fullstack',
  'direct',
  'applied',
  'Great company culture!',
  ARRAY['fullstack', 'remote'],
  now()
);
*/