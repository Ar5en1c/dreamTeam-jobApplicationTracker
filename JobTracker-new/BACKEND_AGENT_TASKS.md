# Backend Architect Agent - Detailed Task Specifications

This document contains detailed task descriptions for the Backend Architect Agent to implement the Phase 1 backend infrastructure.

---

## 🎯 Agent Mission

You are the Backend Architect Agent responsible for implementing the database layer, security policies, and backend infrastructure for the Job Application Tracker Phase 1. Your focus is on:

1. **Database Design & Migrations** - Create and manage schema changes
2. **Security Implementation** - RLS policies and data protection
3. **Performance Optimization** - Indexes, queries, and caching
4. **Data Integrity** - Constraints, triggers, and validation
5. **Analytics Foundation** - Views and functions for reporting

---

## 📋 Task 1: Database Migrations Setup

### Objective
Establish a proper migration system using Supabase CLI to version control all database changes.

### Context
Currently, the database schema exists but there are no migration files. We need to:
- Capture the current schema as the initial migration
- Create a system for future schema changes
- Ensure reproducibility across environments

### Detailed Instructions

#### Step 1.1: Initialize Supabase Project Locally
```bash
cd /Users/kuldeepsingh/MyProjects/JobApplicationTracker/JobTracker-new
supabase init
```

This creates a `supabase/` directory with:
- `config.toml` - Project configuration
- `migrations/` - SQL migration files
- `seed.sql` - Seed data (optional)

#### Step 1.2: Link to Remote Supabase Project
```bash
supabase link --project-ref uyfbljkptxuncmxpafyh
```

Use the project ref from the `.env.local` file.

#### Step 1.3: Pull Current Schema
```bash
supabase db pull
```

This generates a migration file with the current database schema.

#### Step 1.4: Review Generated Migration
- Open the generated migration file
- Verify all tables are included
- Check RLS policies are captured
- Ensure indexes are documented

#### Step 1.5: Create Migration for Career Preferences

Create a new migration file:
```bash
supabase migration new add_career_preferences_table
```

Add the following SQL:

```sql
-- Migration: Add Career Preferences Table
-- Description: Stores user job search preferences for better job matching

-- Create the career_preferences table
CREATE TABLE IF NOT EXISTS public.career_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Job search preferences
    job_types TEXT[] DEFAULT '{}',
    locations TEXT[] DEFAULT '{}',
    industries TEXT[] DEFAULT '{}',
    roles TEXT[] DEFAULT '{}',

    -- Salary expectations
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',

    -- Work preferences
    work_arrangements TEXT[] DEFAULT '{}', -- ['remote', 'hybrid', 'on-site']
    company_sizes TEXT[] DEFAULT '{}', -- ['startup', 'small', 'medium', 'large', 'enterprise']
    benefits TEXT[] DEFAULT '{}',

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Constraints
    UNIQUE(user_id),
    CHECK (salary_min IS NULL OR salary_min >= 0),
    CHECK (salary_max IS NULL OR salary_max >= 0),
    CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_max >= salary_min)
);

-- Enable Row Level Security
ALTER TABLE public.career_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
    ON public.career_preferences
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.career_preferences
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.career_preferences
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
    ON public.career_preferences
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_career_preferences_updated_at
    BEFORE UPDATE ON public.career_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_career_preferences_user_id ON public.career_preferences(user_id);

-- Add comments for documentation
COMMENT ON TABLE public.career_preferences IS 'Stores user job search preferences including salary expectations, work arrangements, and other criteria';
COMMENT ON COLUMN public.career_preferences.work_arrangements IS 'Array of preferred work arrangements: remote, hybrid, on-site';
COMMENT ON COLUMN public.career_preferences.company_sizes IS 'Array of preferred company sizes: startup, small, medium, large, enterprise';
```

### Deliverables
- [ ] `supabase/` directory initialized
- [ ] Initial migration capturing current schema
- [ ] Migration for career_preferences table
- [ ] All migrations tested locally
- [ ] Migration README.md with workflow instructions

### Success Criteria
- All migrations run without errors
- Schema matches production
- RLS policies are correctly applied
- Indexes are created
- Documentation is clear

### Testing Checklist
- [ ] Run `supabase db reset` locally (applies all migrations)
- [ ] Verify all tables exist
- [ ] Verify RLS policies work (test with different users)
- [ ] Check foreign key constraints
- [ ] Verify triggers fire correctly

---

## 📋 Task 2: Enhance Job Applications Table

### Objective
Add missing fields and improve the job_applications table to support all Phase 1 features including status tracking, interview scheduling, and application prioritization.

### Context
The current job_applications table is basic. We need to add:
- Status history tracking (JSONB)
- Interview and response dates
- Application source tracking
- Priority and favorite flags
- Better indexing for search and filtering

### Detailed Instructions

#### Step 2.1: Create Enhancement Migration

```bash
supabase migration new enhance_job_applications_table
```

#### Step 2.2: Add Migration SQL

```sql
-- Migration: Enhance Job Applications Table
-- Description: Add status history, dates tracking, and application metadata

-- Add new columns to job_applications
ALTER TABLE public.job_applications
    ADD COLUMN IF NOT EXISTS application_source VARCHAR(20) DEFAULT 'manual'
        CHECK (application_source IN ('manual', 'extension', 'imported', 'api')),
    ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS interview_dates JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS response_dates JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high'));

-- Add column comments
COMMENT ON COLUMN public.job_applications.application_source IS 'Source of the application: manual, extension, imported, or api';
COMMENT ON COLUMN public.job_applications.status_history IS 'Array of status changes with timestamps: [{"status": "applied", "changed_at": "2024-01-01T00:00:00Z", "notes": "..."}]';
COMMENT ON COLUMN public.job_applications.interview_dates IS 'Array of interview dates: [{"date": "2024-01-15T10:00:00Z", "type": "phone_screen", "notes": "..."}]';
COMMENT ON COLUMN public.job_applications.response_dates IS 'Array of response dates from company: [{"date": "2024-01-10T00:00:00Z", "type": "acknowledgment", "notes": "..."}]';
COMMENT ON COLUMN public.job_applications.is_favorite IS 'Flag to mark favorite/important applications';
COMMENT ON COLUMN public.job_applications.priority IS 'Application priority: low, medium, or high';

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id
    ON public.job_applications(user_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_status
    ON public.job_applications(status);

CREATE INDEX IF NOT EXISTS idx_job_applications_company
    ON public.job_applications(company);

CREATE INDEX IF NOT EXISTS idx_job_applications_applied_date
    ON public.job_applications(applied_date DESC);

CREATE INDEX IF NOT EXISTS idx_job_applications_updated_at
    ON public.job_applications(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_job_applications_is_favorite
    ON public.job_applications(is_favorite)
    WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_job_applications_priority
    ON public.job_applications(priority)
    WHERE priority = 'high';

-- Composite index for common filtered queries
CREATE INDEX IF NOT EXISTS idx_job_applications_user_status_date
    ON public.job_applications(user_id, status, applied_date DESC);

-- Full-text search index using GIN
CREATE INDEX IF NOT EXISTS idx_job_applications_search
    ON public.job_applications
    USING gin(
        to_tsvector('english',
            coalesce(job_title, '') || ' ' ||
            coalesce(company, '') || ' ' ||
            coalesce(description, '') || ' ' ||
            coalesce(location, '')
        )
    );

-- Add search function for easier querying
CREATE OR REPLACE FUNCTION public.search_job_applications(
    p_user_id UUID,
    p_search_term TEXT
)
RETURNS SETOF public.job_applications
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT *
    FROM public.job_applications
    WHERE user_id = p_user_id
        AND to_tsvector('english',
            coalesce(job_title, '') || ' ' ||
            coalesce(company, '') || ' ' ||
            coalesce(description, '') || ' ' ||
            coalesce(location, '')
        ) @@ plainto_tsquery('english', p_search_term)
    ORDER BY updated_at DESC;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.search_job_applications TO authenticated;
```

### Deliverables
- [ ] Migration file created and tested
- [ ] All new columns added with appropriate defaults
- [ ] Check constraints implemented
- [ ] Indexes created and verified
- [ ] Full-text search function working
- [ ] Documentation updated

### Success Criteria
- Migration runs without errors on fresh database
- Existing data is preserved
- All indexes improve query performance
- Search function returns accurate results
- RLS policies still work correctly

### Testing Checklist
- [ ] Add test data and verify indexes are used (`EXPLAIN ANALYZE`)
- [ ] Test full-text search with various queries
- [ ] Verify check constraints reject invalid data
- [ ] Test composite index performance on filtered queries
- [ ] Ensure backward compatibility with existing code

---

## 📋 Task 3: Database Triggers and Functions

### Objective
Implement database triggers and utility functions for automation and data integrity.

### Context
We need automated tracking of status changes and utility functions for common operations like calculating statistics and updating timestamps.

### Detailed Instructions

#### Step 3.1: Create Triggers Migration

```bash
supabase migration new add_database_triggers_and_functions
```

#### Step 3.2: Add Trigger SQL

```sql
-- Migration: Database Triggers and Utility Functions
-- Description: Automated status tracking and helper functions

-- Function: Automatically update status_history when status changes
CREATE OR REPLACE FUNCTION public.track_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only track if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_history = jsonb_insert(
            COALESCE(NEW.status_history, '[]'::jsonb),
            '{0}',
            jsonb_build_object(
                'status', NEW.status,
                'previous_status', OLD.status,
                'changed_at', now(),
                'changed_by', auth.uid()
            ),
            true
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Track status changes
DROP TRIGGER IF EXISTS track_status_change ON public.job_applications;
CREATE TRIGGER track_status_change
    BEFORE UPDATE OF status ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.track_application_status_change();

-- Function: Get application statistics for a user
CREATE OR REPLACE FUNCTION public.get_application_statistics(p_user_id UUID)
RETURNS TABLE(
    total_applications BIGINT,
    applied_count BIGINT,
    under_review_count BIGINT,
    phone_screen_count BIGINT,
    interview_count BIGINT,
    final_interview_count BIGINT,
    offer_count BIGINT,
    rejected_count BIGINT,
    withdrawn_count BIGINT,
    success_rate NUMERIC,
    avg_response_time_days NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_applications,
        COUNT(*) FILTER (WHERE status = 'applied')::BIGINT as applied_count,
        COUNT(*) FILTER (WHERE status = 'under_review')::BIGINT as under_review_count,
        COUNT(*) FILTER (WHERE status = 'phone_screen')::BIGINT as phone_screen_count,
        COUNT(*) FILTER (WHERE status = 'interview')::BIGINT as interview_count,
        COUNT(*) FILTER (WHERE status = 'final_interview')::BIGINT as final_interview_count,
        COUNT(*) FILTER (WHERE status = 'offer')::BIGINT as offer_count,
        COUNT(*) FILTER (WHERE status = 'rejected')::BIGINT as rejected_count,
        COUNT(*) FILTER (WHERE status = 'withdrawn')::BIGINT as withdrawn_count,
        ROUND(
            CASE
                WHEN COUNT(*) FILTER (WHERE status IN ('offer', 'rejected')) > 0
                THEN (COUNT(*) FILTER (WHERE status = 'offer')::NUMERIC /
                      COUNT(*) FILTER (WHERE status IN ('offer', 'rejected'))::NUMERIC * 100)
                ELSE 0
            END,
            2
        ) as success_rate,
        ROUND(
            AVG(
                EXTRACT(EPOCH FROM (updated_at - applied_date)) / 86400
            ) FILTER (WHERE status != 'applied'),
            1
        ) as avg_response_time_days
    FROM public.job_applications
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_application_statistics TO authenticated;

-- Function: Get applications timeline
CREATE OR REPLACE FUNCTION public.get_applications_timeline(
    p_user_id UUID,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    date DATE,
    applications_count BIGINT,
    status_breakdown JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        applied_date::DATE as date,
        COUNT(*)::BIGINT as applications_count,
        jsonb_object_agg(status, status_count) as status_breakdown
    FROM (
        SELECT
            applied_date,
            status,
            COUNT(*) as status_count
        FROM public.job_applications
        WHERE user_id = p_user_id
            AND applied_date >= CURRENT_DATE - p_days_back
        GROUP BY applied_date::DATE, status
    ) subquery
    GROUP BY applied_date::DATE
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_applications_timeline TO authenticated;

-- Function: Get top companies by application count
CREATE OR REPLACE FUNCTION public.get_top_companies(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    company TEXT,
    application_count BIGINT,
    latest_status TEXT,
    latest_application_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ja.company,
        COUNT(*)::BIGINT as application_count,
        (array_agg(ja.status ORDER BY ja.applied_date DESC))[1] as latest_status,
        MAX(ja.applied_date) as latest_application_date
    FROM public.job_applications ja
    WHERE ja.user_id = p_user_id
    GROUP BY ja.company
    ORDER BY application_count DESC, latest_application_date DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_top_companies TO authenticated;

-- Function: Safely fix the update_updated_at_column search_path issue
-- This addresses the security warning from Supabase advisors
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public, pg_temp;

-- Recreate triggers with the fixed function
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON public.skills;
CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_experiences_updated_at ON public.experiences;
CREATE TRIGGER update_experiences_updated_at
    BEFORE UPDATE ON public.experiences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_updated_at ON public.education;
CREATE TRIGGER update_education_updated_at
    BEFORE UPDATE ON public.education
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON FUNCTION public.track_application_status_change() IS 'Automatically tracks status changes in status_history JSONB field';
COMMENT ON FUNCTION public.get_application_statistics(UUID) IS 'Returns comprehensive statistics for user applications';
COMMENT ON FUNCTION public.get_applications_timeline(UUID, INTEGER) IS 'Returns daily application counts and status breakdown';
COMMENT ON FUNCTION public.get_top_companies(UUID, INTEGER) IS 'Returns most applied-to companies with stats';
```

### Deliverables
- [ ] All trigger functions created
- [ ] Triggers attached to appropriate tables
- [ ] Utility functions for analytics implemented
- [ ] Security definer properly configured
- [ ] Search_path security issue resolved
- [ ] All functions granted to authenticated users

### Success Criteria
- Status changes automatically tracked
- Updated_at timestamps automatically update
- Statistics functions return accurate data
- No security warnings in Supabase advisor
- Functions perform well (< 100ms)

### Testing Checklist
- [ ] Update an application status and verify status_history
- [ ] Call get_application_statistics and verify accuracy
- [ ] Test timeline function with various date ranges
- [ ] Verify top_companies returns correct data
- [ ] Run Supabase security advisor and confirm no warnings

---

## 📋 Task 4: Create Analytics Views

### Objective
Create materialized views and regular views for efficient analytics queries.

### Context
Analytics queries can be expensive. We'll create optimized views that can be easily queried from the frontend without complex joins.

### Detailed Instructions

#### Step 4.1: Create Views Migration

```bash
supabase migration new create_analytics_views
```

#### Step 4.2: Add Views SQL

```sql
-- Migration: Analytics Views
-- Description: Create optimized views for dashboard analytics

-- View: User application summary
CREATE OR REPLACE VIEW public.v_user_application_summary AS
SELECT
    ja.user_id,
    COUNT(*) as total_applications,
    COUNT(DISTINCT ja.company) as unique_companies,
    COUNT(*) FILTER (WHERE ja.status = 'applied') as applied,
    COUNT(*) FILTER (WHERE ja.status = 'under_review') as under_review,
    COUNT(*) FILTER (WHERE ja.status IN ('phone_screen', 'interview', 'final_interview')) as in_interview,
    COUNT(*) FILTER (WHERE ja.status = 'offer') as offers,
    COUNT(*) FILTER (WHERE ja.status = 'rejected') as rejected,
    COUNT(*) FILTER (WHERE ja.is_favorite = true) as favorites,
    MAX(ja.applied_date) as last_application_date,
    MIN(ja.applied_date) as first_application_date
FROM public.job_applications ja
GROUP BY ja.user_id;

-- Grant select to authenticated users
GRANT SELECT ON public.v_user_application_summary TO authenticated;

-- RLS policy for the view
ALTER VIEW public.v_user_application_summary SET (security_invoker = on);

-- View: Monthly application trends
CREATE OR REPLACE VIEW public.v_monthly_application_trends AS
SELECT
    ja.user_id,
    DATE_TRUNC('month', ja.applied_date) as month,
    COUNT(*) as application_count,
    COUNT(DISTINCT ja.company) as unique_companies,
    jsonb_object_agg(ja.status, status_count) as status_breakdown
FROM public.job_applications ja
CROSS JOIN LATERAL (
    SELECT COUNT(*) as status_count
    FROM public.job_applications ja2
    WHERE ja2.user_id = ja.user_id
        AND DATE_TRUNC('month', ja2.applied_date) = DATE_TRUNC('month', ja.applied_date)
        AND ja2.status = ja.status
) status_counts
GROUP BY ja.user_id, DATE_TRUNC('month', ja.applied_date)
ORDER BY month DESC;

-- Grant select to authenticated users
GRANT SELECT ON public.v_monthly_application_trends TO authenticated;
ALTER VIEW public.v_monthly_application_trends SET (security_invoker = on);

-- View: Application success funnel
CREATE OR REPLACE VIEW public.v_application_funnel AS
WITH status_order AS (
    SELECT
        user_id,
        status,
        COUNT(*) as count,
        CASE status
            WHEN 'applied' THEN 1
            WHEN 'under_review' THEN 2
            WHEN 'phone_screen' THEN 3
            WHEN 'interview' THEN 4
            WHEN 'final_interview' THEN 5
            WHEN 'offer' THEN 6
            WHEN 'rejected' THEN 7
            WHEN 'withdrawn' THEN 8
            ELSE 9
        END as stage_order
    FROM public.job_applications
    GROUP BY user_id, status
)
SELECT
    user_id,
    status,
    count,
    stage_order,
    ROUND(
        100.0 * count / SUM(count) FILTER (WHERE stage_order = 1) OVER (PARTITION BY user_id),
        2
    ) as percentage_of_applied
FROM status_order
ORDER BY user_id, stage_order;

-- Grant select to authenticated users
GRANT SELECT ON public.v_application_funnel TO authenticated;
ALTER VIEW public.v_application_funnel SET (security_invoker = on);

-- Add helpful comments
COMMENT ON VIEW public.v_user_application_summary IS 'Summary statistics per user for quick dashboard loading';
COMMENT ON VIEW public.v_monthly_application_trends IS 'Monthly application trends with status breakdown';
COMMENT ON VIEW public.v_application_funnel IS 'Application funnel analysis showing conversion rates';
```

### Deliverables
- [ ] All analytics views created
- [ ] Views properly secured with RLS
- [ ] Performance tested with sample data
- [ ] Documentation updated with view usage

### Success Criteria
- Views return accurate data
- Query performance is acceptable (< 200ms)
- RLS properly restricts data by user
- Views can be queried from frontend

### Testing Checklist
- [ ] Query each view with test user data
- [ ] Verify RLS prevents cross-user data access
- [ ] Check performance with EXPLAIN ANALYZE
- [ ] Validate calculations match raw queries

---

## 📋 Task 5: Security Configuration

### Objective
Address all security warnings from Supabase advisors and implement best practices.

### Context
The Supabase security advisor identified several issues:
1. Leaked password protection disabled
2. Insufficient MFA options
3. Function search_path mutable (already fixed in Task 3)

### Detailed Instructions

#### Step 5.1: Enable Security Features in Supabase Dashboard

Navigate to Supabase Dashboard → Authentication → Settings

**Security Tab:**
- [x] Enable "Leaked Password Protection"
- [x] Set minimum password length: 12 characters
- [x] Require at least one uppercase letter
- [x] Require at least one lowercase letter
- [x] Require at least one number

**Email Tab:**
- [x] Enable "Confirm email"
- [x] Double confirm email changes
- [x] Secure email change (requires re-authentication)

**Multi-Factor Authentication:**
- [x] Enable TOTP (Time-based One-Time Password)
- [x] Add setup instructions to UI

#### Step 5.2: Create Security Policy Documentation

Create `JobTracker-new/docs/SECURITY.md`:

```markdown
# Security Policy

## Authentication

### Password Requirements
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Checked against HaveIBeenPwned database

### Email Verification
- Email verification required for all new accounts
- Email changes require re-authentication
- Double confirmation for email changes

### Multi-Factor Authentication
- TOTP-based MFA available
- Recommended for all users
- Required for users with sensitive data

## Row Level Security

All tables implement RLS policies:
- Users can only access their own data
- No cross-user data leakage
- Policies tested and verified

## API Security

- Anon key used for client-side access
- Service role key never exposed to client
- All API calls authenticated
- Rate limiting through Supabase

## Data Protection

- All data encrypted at rest (Supabase default)
- All connections use SSL/TLS
- Passwords hashed with bcrypt
- JWT tokens have 1-hour expiry

## Reporting Security Issues

Please report security issues to: [security email]
```

### Deliverables
- [ ] All security features enabled in dashboard
- [ ] Security documentation created
- [ ] MFA setup instructions added to UI
- [ ] Security advisor shows no critical warnings

### Success Criteria
- All Supabase security advisor warnings resolved
- Password policy enforced
- Email verification working
- MFA available to users

### Testing Checklist
- [ ] Try to create account with weak password (should fail)
- [ ] Verify email verification email is sent
- [ ] Test MFA enrollment flow
- [ ] Run security advisor and verify green status

---

## 📋 Task 6: Performance Optimization

### Objective
Optimize database queries and add appropriate indexes for production performance.

### Context
With proper indexing and query optimization, we can ensure fast response times even as data grows.

### Detailed Instructions

#### Step 6.1: Analyze Current Query Performance

Run EXPLAIN ANALYZE on common queries:

```sql
-- Test query performance
EXPLAIN ANALYZE
SELECT * FROM public.job_applications
WHERE user_id = '[test-user-id]'
ORDER BY applied_date DESC
LIMIT 20;

-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

#### Step 6.2: Add Missing Indexes

If analysis shows missing indexes, create migration:

```bash
supabase migration new add_performance_indexes
```

```sql
-- Migration: Performance Optimization Indexes

-- Covering index for common application queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_covering
    ON public.job_applications (user_id, status, applied_date DESC)
    INCLUDE (job_title, company, location);

-- Index for JSONB queries on status_history
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_status_history_gin
    ON public.job_applications USING gin(status_history);

-- Partial index for active applications
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_active
    ON public.job_applications (user_id, updated_at DESC)
    WHERE status NOT IN ('rejected', 'withdrawn', 'expired');

-- Index for analytics queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_analytics
    ON public.job_applications (user_id, applied_date, status)
    WHERE applied_date >= CURRENT_DATE - INTERVAL '1 year';
```

#### Step 6.3: Connection Pooling Configuration

Update `supabase/config.toml`:

```toml
[db]
pool_size = 15
pool_timeout = 10
```

### Deliverables
- [ ] Query performance analysis document
- [ ] Additional indexes added if needed
- [ ] Connection pooling configured
- [ ] Performance benchmarks documented

### Success Criteria
- Common queries execute in < 50ms
- Indexes are being used (check with EXPLAIN)
- No table scans on large tables
- Connection pool not exhausted under load

### Testing Checklist
- [ ] Run EXPLAIN ANALYZE on all common queries
- [ ] Verify indexes are used
- [ ] Load test with 1000+ applications per user
- [ ] Monitor connection pool usage

---

## 🎯 Agent Success Metrics

### Completion Criteria

#### Database Layer
- [ ] All migrations created and tested
- [ ] Career preferences table implemented
- [ ] Job applications table enhanced
- [ ] All indexes created and verified
- [ ] All triggers and functions working

#### Security
- [ ] All RLS policies implemented and tested
- [ ] Security advisor shows green
- [ ] Function search_path issue resolved
- [ ] Password policy configured
- [ ] MFA enabled

#### Analytics
- [ ] All analytics views created
- [ ] Statistics functions working
- [ ] Timeline function implemented
- [ ] Performance is acceptable

#### Performance
- [ ] Query performance optimized
- [ ] Appropriate indexes added
- [ ] Connection pooling configured
- [ ] No performance bottlenecks

#### Documentation
- [ ] Migration workflow documented
- [ ] Security policy documented
- [ ] API functions documented
- [ ] Testing procedures documented

---

## 🔄 Communication Protocol

### Daily Updates
Provide daily status updates including:
- Tasks completed
- Tasks in progress
- Blockers or questions
- Performance metrics
- Test results

### When to Ask Questions
Ask questions when:
- Requirements are unclear
- Multiple valid approaches exist
- Security implications are uncertain
- Performance trade-offs need to be made
- Integration with frontend is needed

### Handoff Points
Coordinate with main developer when:
- Migrations are ready to apply
- New functions/views are available
- TypeScript types need updating
- Frontend integration is needed
- Testing assistance is required

---

## 📚 Resources

### Supabase Documentation
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Indexes](https://supabase.com/docs/guides/database/indexes)

### PostgreSQL Documentation
- [Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Full-text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Performance Tips](https://www.postgresql.org/docs/current/performance-tips.html)

---

**Ready to begin? Start with Task 1: Database Migrations Setup**
