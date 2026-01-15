# AI Copywriting Setup Guide

This guide will help you set up the AI-powered copywriting features using Google's Gemini API.

## Prerequisites

- A Google account
- Access to Google AI Studio

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Configuration

1. In the `frontend` directory, create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Save the file and restart your development server

## Features

The AI copywriting integration provides the following features:

### 1. Caption Improvement
- Enhances your caption for better engagement
- Optimizes clarity and emotional appeal
- Platform-specific optimization

### 2. Tone Adjustment
- Professional - Formal, authoritative voice
- Casual - Friendly, conversational tone
- Witty - Clever wordplay and humor
- Inspirational - Motivational and uplifting
- Urgent - Action-oriented with immediacy

### 3. Hashtag Generation
- AI-generated hashtags based on caption content
- Mix of popular and niche tags
- Platform-appropriate recommendations
- Auto-updates as you type (debounced)

### 4. Posting Time Suggestions
- Analyzes content and suggests optimal posting times
- Platform-specific best practices
- Engagement predictions

## Usage

1. Navigate to the Create Post page
2. Select your platforms
3. Enter your caption
4. Click the "AI Tools" button
5. Choose from:
   - **Improve** - Enhance your caption
   - **Tone** - Adjust the tone
   - **Tags** - View AI-generated hashtags
   - **Timing** - See suggested posting times

## Troubleshooting

### "API key not found" Error
- Ensure `.env.local` exists in the `frontend` directory
- Verify the API key is correctly set
- Restart your development server after adding the key

### API Rate Limits
- Free tier has usage limits
- Consider upgrading to a paid plan for production use

### Network Errors
- Check your internet connection
- Verify the API key is valid
- Check Google AI Studio for service status

## Security Notes

> **Important**: The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser. For production applications, consider:
> - Moving API calls to a backend API route
> - Implementing rate limiting
> - Using environment-specific keys
> - Monitoring API usage

## Support

For issues related to:
- **Gemini API**: Visit [Google AI Documentation](https://ai.google.dev/docs)
- **Application**: Check the project repository or contact support
