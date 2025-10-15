# Social Authentication Setup Guide

This guide will help you configure social authentication providers (Google, LinkedIn, GitHub) for your Job Application Tracker.

## Prerequisites

- Supabase project is already set up
- You have admin access to your Supabase dashboard

## 1. Google OAuth Setup

### Step 1: Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the consent screen first if prompted
6. Choose **Web application** as application type
7. Add authorized redirect URIs:
   ```
   https://uyfbljkptxuncmxpafyh.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** and toggle it **ON**
4. Enter your Google **Client ID** and **Client Secret**
5. Click **Save**

## 2. GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to your [GitHub Settings](https://github.com/settings/profile)
2. Navigate to **Developer settings** > **OAuth Apps**
3. Click **New OAuth App**
4. Fill in the details:
   - **Application name**: Job Application Tracker
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: 
     ```
     https://uyfbljkptxuncmxpafyh.supabase.co/auth/v1/callback
     ```
5. Click **Register application**
6. Copy the **Client ID** and generate a **Client Secret**

### Step 2: Configure in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **GitHub** and toggle it **ON**
4. Enter your GitHub **Client ID** and **Client Secret**
5. Click **Save**

## 3. LinkedIn OAuth Setup

### Step 1: Create LinkedIn OAuth Application

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Click **Create App**
3. Fill in the required details:
   - **App name**: Job Application Tracker
   - **LinkedIn Page**: Your company page (or personal)
   - **App use**: Select appropriate use case
4. Go to **Auth** tab
5. Add authorized redirect URLs:
   ```
   https://uyfbljkptxuncmxpafyh.supabase.co/auth/v1/callback
   ```
6. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **LinkedIn (OIDC)** and toggle it **ON**
4. Enter your LinkedIn **Client ID** and **Client Secret**
5. Click **Save**

## 4. Update Redirect URLs

After configuring all providers, make sure to update your application's redirect URLs:

### For Development:
```
http://localhost:5174/dashboard
```

### For Production:
```
https://your-domain.com/dashboard
```

Add these URLs to each OAuth provider's authorized redirect URIs.

## 5. Test Social Authentication

1. Start your development server
2. Navigate to the login page
3. Try logging in with each social provider
4. Verify that users are redirected to the dashboard after successful authentication

## 6. Environment Variables

Update your `.env.local` file if needed:

```env
VITE_SUPABASE_URL=https://uyfbljkptxuncmxpafyh.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

### Common Issues:

1. **Redirect URI Mismatch**: Ensure all redirect URIs match exactly in both the provider and Supabase
2. **Invalid Client Credentials**: Double-check Client ID and Client Secret are correctly copied
3. **Scope Issues**: Some providers require specific scopes - Supabase handles this automatically
4. **CORS Errors**: Make sure your domain is properly configured in the OAuth provider settings

### Debug Tips:

1. Check browser network tab for error messages
2. Look at Supabase Auth logs in the dashboard
3. Verify that the provider is enabled in Supabase
4. Test with different browsers/incognito mode

## Security Best Practices

1. **Never expose Client Secrets** in frontend code
2. **Use HTTPS** in production for all redirect URIs
3. **Regularly rotate** OAuth credentials
4. **Monitor authentication logs** for suspicious activity
5. **Implement rate limiting** for authentication endpoints

## Next Steps

After setting up social authentication:

1. Test all authentication flows thoroughly
2. Update your user onboarding flow to handle social login data
3. Consider implementing account linking for users with multiple auth methods
4. Add user profile completion flow for social login users

Your Job Application Tracker now supports professional social authentication flows! 🚀

---

**Note**: The current implementation includes all the necessary frontend code for social authentication. You only need to configure the providers in your Supabase dashboard following this guide.