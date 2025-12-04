# Google Gemini API Setup Guide (Optional)

## Overview

The app includes AI features powered by Google's Gemini API:
- **AI Chat Assistant** - Real-time assistance during project work
- **Document Analysis** - Analyze legal documents with AI
- **Draft Generation** - Generate document drafts with AI assistance

**These features are optional.** The app works perfectly without them.

## Why Set Up?

If you want to enable AI features, you need to:
1. Get a Google Gemini API key
2. Configure it in your app

## Step-by-Step Setup

### Step 1: Get a Google Gemini API Key

1. Visit **https://ai.google.dev/**
2. Click **"Get API Key"**
3. Sign in with your Google account
4. Click **"Create API Key"**
5. Select **"Create API Key in new Google Cloud project"** (or existing project)
6. Copy the API key that appears

### Step 2: Configure in Your App

#### Local Development
1. Create or edit the `.env.local` file in your project root:
   ```
   VITE_GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
2. Replace `your_api_key_here` with your actual API key
3. Restart the dev server: `npm run dev`

#### Deployment (Fly.io)
1. Set the environment variable via Fly.io:
   ```bash
   fly secrets set VITE_GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
2. Or use the Fly.io dashboard:
   - Go to your app → **Secrets**
   - Click **"Add Secret"**
   - Key: `VITE_GOOGLE_GENAI_API_KEY`
   - Value: Your API key
   - Click **"Add Secret"**

### Step 3: Test

1. Restart your app
2. Login to the app
3. Look for the **AI Chat** button in the interface
4. If configured, you'll see the AI assistant available

## What AI Features Do

### AI Chat Assistant
- Click the chat icon in the sidebar
- Ask questions about your project
- Get real-time assistance with holdings, taxes, etc.

### Document Analysis
- Upload a legal document
- AI analyzes and extracts:
  - Document summary
  - Key information (names, amounts, clauses)
  - Suggested next steps

### Draft Generation
- Request document drafts
- AI generates:
  - Shareholder agreements
  - Articles of association
  - Bylaws
  - Other legal documents

## Pricing

Google Gemini API is **free for most users** with these limits:
- 50 requests per minute (for free tier)
- Generous free tier quota

For details, see: https://ai.google.dev/pricing

## Troubleshooting

### "AI features disabled" Message
This appears if:
1. API key is not configured
2. API key is invalid
3. Network error reaching Google API

**Solution:**
- Check that `VITE_GOOGLE_GENAI_API_KEY` is set correctly
- Verify the API key is active in Google Cloud console
- Check your internet connection

### AI Chat Shows Error Message
If you see: "Assistente de IA não está disponível"

**Solutions:**
1. Check API key configuration
2. Check Google Cloud quotas
3. Try again in a few moments (may be temporary)
4. Check browser console for specific error

## How It Works

The app attempts to initialize AI features when you login. If the API key is missing:
- ✅ App continues to work normally
- ✅ All other features available
- ❌ AI features show a "not available" message

This means **you don't need to set up Google Gemini API to use the app.**

## Security Notes

- **Never commit your API key** to version control
- Use environment variables to store keys
- Restrict API key usage in Google Cloud Console
- Monitor API usage for unexpected activity

## Disabling AI Features

If you have an API key configured but want to disable AI features:

1. Remove the `VITE_GOOGLE_GENAI_API_KEY` environment variable
2. Restart the app
3. AI features will show as unavailable

## Getting Help

- **Google Gemini API Docs**: https://ai.google.dev/docs
- **Pricing Calculator**: https://ai.google.dev/pricing
- **API Status**: https://status.cloud.google.com/

---

**Remember:** AI features are completely optional. The app is fully functional without them!
