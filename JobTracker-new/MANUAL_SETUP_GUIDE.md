# Manual Setup Guide - Steps You Need to Complete

This guide contains all the steps that cannot be automated via MCP/API and must be done manually through the Supabase Dashboard.

---

## 🔐 Part 1: Auth Security Configuration (5 minutes)

### Step 1: Enable Leaked Password Protection

**Why:** Prevents users from using compromised passwords found in data breaches.

**Steps:**
1. Go to https://supabase.com/dashboard/project/uyfbljkptxuncmxpafyh
2. Click on **Authentication** in the left sidebar
3. Click on **Providers** tab
4. Scroll down to **Email** provider
5. Click **Edit** on the Email provider
6. Scroll to **Security Settings**
7. Toggle ON: **"Enable leaked password protection"**
8. Click **Save**

### Step 2: Configure Password Strength Requirements

**Why:** Ensures users create strong passwords.

**Steps:**
1. Still in **Authentication** → **Providers** → **Email** settings
2. Find **Password Requirements** section
3. Set the following:
   - Minimum password length: **12 characters**
   - ✅ Require at least one uppercase letter
   - ✅ Require at least one lowercase letter
   - ✅ Require at least one number
4. Click **Save**

### Step 3: Enable Email Verification

**Why:** Confirms user email addresses are valid.

**Steps:**
1. Still in **Authentication** → **Providers** → **Email** settings
2. Find **Email Verification** section
3. Toggle ON: **"Confirm email"**
4. Toggle ON: **"Secure email change"** (requires re-authentication)
5. Toggle ON: **"Double confirm email changes"**
6. Click **Save**

### Step 4: Enable MFA (Multi-Factor Authentication)

**Why:** Adds an extra layer of security for user accounts.

**Steps:**
1. Go to **Authentication** → **MFA**
2. Toggle ON: **"Enable TOTP (Time-based One-Time Password)"**
3. You can optionally enable SMS MFA if you have Twilio configured
4. Click **Save**

**✅ Auth Security Complete!** The 2 security warnings will now be resolved.

---

## 📁 Part 2: Storage Buckets Setup (10 minutes)

### Why We Need Storage
Users need to upload resumes, cover letters, and other documents for their job applications.

### Step 1: Create Resumes Bucket

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Configure:
   - **Name:** `resumes`
   - **Public bucket:** ❌ **OFF** (private)
   - **File size limit:** `10 MB`
   - **Allowed MIME types:**
     ```
     application/pdf
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     application/msword
     text/plain
     ```
4. Click **Create bucket**

### Step 2: Set RLS Policies for Resumes

After creating the bucket:

1. Click on the `resumes` bucket
2. Click **Policies** tab
3. Click **New policy**

**Policy 1: Users can upload their own resumes**
```sql
-- Policy name: Users can upload own resumes
CREATE POLICY "Users can upload own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: Users can view their own resumes**
```sql
-- Policy name: Users can view own resumes
CREATE POLICY "Users can view own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Users can delete their own resumes**
```sql
-- Policy name: Users can delete own resumes
CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4: Users can update their own resumes**
```sql
-- Policy name: Users can update own resumes
CREATE POLICY "Users can update own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 3: Create Cover Letters Bucket

1. Click **New bucket** again
2. Configure:
   - **Name:** `cover-letters`
   - **Public bucket:** ❌ **OFF** (private)
   - **File size limit:** `5 MB`
   - **Allowed MIME types:**
     ```
     application/pdf
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     application/msword
     text/plain
     ```
3. Click **Create bucket**

### Step 4: Set RLS Policies for Cover Letters

Repeat the same 4 policies as resumes, but replace `'resumes'` with `'cover-letters'`:

```sql
CREATE POLICY "Users can upload own cover letters"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'cover-letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own cover letters"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'cover-letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own cover letters"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'cover-letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own cover letters"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'cover-letters' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 5: Create Documents Bucket

1. Click **New bucket** again
2. Configure:
   - **Name:** `documents`
   - **Public bucket:** ❌ **OFF** (private)
   - **File size limit:** `10 MB`
   - **Allowed MIME types:**
     ```
     application/pdf
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     application/msword
     text/plain
     image/png
     image/jpeg
     ```
3. Click **Create bucket**

### Step 6: Set RLS Policies for Documents

Same 4 policies, replace with `'documents'`:

```sql
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**✅ Storage Buckets Complete!** Users can now upload files.

---

## 🧪 Part 3: Testing the Setup (5 minutes)

### Test Auth Security

1. Try to create a test account with weak password (should fail)
2. Create account with strong password (12+ chars, uppercase, lowercase, number)
3. Check email for verification link
4. Verify you can enable MFA in account settings

### Test Storage

1. Log into your app
2. Try to upload a PDF file (should work)
3. Try to upload a file > 10MB (should fail)
4. Try to upload an .exe file (should fail - not in allowed types)
5. Verify file appears in Supabase Storage dashboard
6. Verify file is in correct folder structure: `bucket-name/user-id/filename.pdf`

### Test Database

1. Try to create a job application (should work)
2. Try to edit the application (should work now!)
3. Check Supabase Table Editor - verify new fields:
   - `application_source` = 'manual'
   - `is_favorite` = false
   - `priority` = 'medium'
   - `status_history` = []
4. Update application status - verify `status_history` gets populated automatically

---

## 📊 Part 4: Verify Security Advisor (2 minutes)

1. Go to **Database** → **Advisors**
2. Run security check
3. Verify all critical issues are resolved
4. Should only see 0-2 warnings (if any)

**Expected Result:** ✅ Green checkmark or "No issues found"

---

## 🎯 Quick Checklist

Use this checklist to track your progress:

### Auth Security
- [ ] Leaked password protection enabled
- [ ] Password strength requirements set (12 chars minimum)
- [ ] Email verification enabled
- [ ] MFA (TOTP) enabled
- [ ] Tested account creation with strong password

### Storage Buckets
- [ ] Created `resumes` bucket (private, 10MB limit)
- [ ] Set 4 RLS policies for resumes
- [ ] Created `cover-letters` bucket (private, 5MB limit)
- [ ] Set 4 RLS policies for cover-letters
- [ ] Created `documents` bucket (private, 10MB limit)
- [ ] Set 4 RLS policies for documents
- [ ] Tested file upload

### Verification
- [ ] Security advisor shows no critical issues
- [ ] Can create and edit job applications
- [ ] Can upload files to storage
- [ ] Status history tracks changes automatically

---

## ❓ Troubleshooting

### "Policy violates row-level security" error

**Problem:** RLS policies not working correctly.

**Solution:**
1. Double-check the policy SQL syntax
2. Ensure bucket_id matches exactly (case-sensitive)
3. Test with: `SELECT auth.uid()` in SQL Editor (should return your user ID)

### "File type not allowed" error

**Problem:** MIME type not in allowed list.

**Solution:**
1. Go to bucket settings
2. Add the MIME type to allowed list
3. Common types:
   - PDF: `application/pdf`
   - Word: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
   - Images: `image/png`, `image/jpeg`

### "File too large" error

**Problem:** File exceeds bucket size limit.

**Solution:**
1. Go to bucket settings
2. Increase file size limit (recommend 10MB for resumes)
3. Or compress the file before uploading

### Application edits not saving

**Problem:** Database permissions or field mismatch.

**Solution:**
1. Check browser console for errors
2. Verify RLS policies allow UPDATE on job_applications table
3. Check that all required fields are being sent
4. Verify `updated_at` trigger is working: `SELECT * FROM pg_trigger WHERE tgname LIKE '%updated_at%';`

---

## 🎉 Completion

Once all checkboxes are checked, your Phase 1 backend setup is **100% complete**!

You can now:
- ✅ Users can securely register and login
- ✅ Upload and manage resumes/documents
- ✅ Create and edit job applications
- ✅ Track application status history automatically
- ✅ View analytics and statistics
- ✅ Search applications with full-text search

**Estimated Total Time:** 20-25 minutes

**Next Steps:** Integrate storage upload UI in the frontend and add analytics dashboard components.

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Storage Guide: https://supabase.com/docs/guides/storage
- Auth Guide: https://supabase.com/docs/guides/auth
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
