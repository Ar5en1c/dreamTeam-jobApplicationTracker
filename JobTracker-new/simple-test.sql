-- Step 1: Temporarily disable RLS for testing
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;

-- Step 2: Test query (should return empty array)
SELECT * FROM job_applications LIMIT 5;