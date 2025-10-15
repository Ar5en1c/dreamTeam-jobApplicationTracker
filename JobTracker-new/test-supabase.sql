-- Temporarily disable RLS for testing (RUN THIS IN SUPABASE SQL EDITOR)
-- You can re-enable it later with: ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE education DISABLE ROW LEVEL SECURITY;

-- Insert test data with proper UUID
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
  gen_random_uuid(),
  'Frontend Developer',
  'Test Company',
  'San Francisco, CA',
  'We are looking for a talented Frontend Developer...',
  ARRAY['React', 'TypeScript', 'CSS'],
  '$80,000 - $120,000',
  'https://testcompany.com/jobs/frontend',
  'direct',
  'applied',
  'This is a test application',
  ARRAY['frontend', 'react'],
  now()
);