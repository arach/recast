# Google OAuth Setup for Better Auth

## Step 1: Create Google OAuth Application

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" for user type
     - Fill in app name (e.g., "ReCast")
     - Add your email as support email
     - Add authorized domains: `localhost` for development
     - Save and continue through scopes (you can skip optional scopes)

4. **Configure OAuth Client**
   - Application type: "Web application"
   - Name: "ReCast Development" (or similar)
   - Authorized JavaScript origins:
     ```
     http://localhost:3002
     http://localhost:3000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3002/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```
   - Click "Create"

5. **Copy Credentials**
   - You'll see your Client ID and Client Secret
   - Keep this window open or download the JSON

## Step 2: Add to Your Environment

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Step 3: Test It Out

1. Restart your dev server: `pnpm dev`
2. Visit http://localhost:3002/sign-in
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth flow

## Production Setup

When deploying to production:

1. Add your production domain to authorized origins and redirect URIs
2. Update redirect URIs to use your production domain:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
3. Add production environment variables

## Troubleshooting

- **Redirect URI mismatch**: Make sure the redirect URI exactly matches what's in Google Console
- **401 errors**: Check that Google+ API is enabled
- **Invalid client**: Verify client ID and secret are correctly copied

## Security Note

- Never commit your client secret to git
- Keep `.env.local` in your `.gitignore`
- In production, use proper secret management