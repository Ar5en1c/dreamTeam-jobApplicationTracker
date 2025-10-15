-- Remove foreign key constraint temporarily for testing
ALTER TABLE job_applications DROP CONSTRAINT job_applications_user_id_fkey;

-- Now insert test data
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

-- Insert another test application
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
  'Backend Developer',
  'Another Company',
  'New York, NY',
  'We need a skilled Backend Developer...',
  ARRAY['Node.js', 'Python', 'SQL'],
  '$90,000 - $130,000',
  'https://anothercompany.com/jobs/backend',
  'linkedin',
  'under_review',
  'Looks promising!',
  ARRAY['backend', 'nodejs'],
  now() - interval '3 days'
);