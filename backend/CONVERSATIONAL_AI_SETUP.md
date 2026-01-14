# 🎙️ Real-Time Conversational AI Setup Guide

## ✨ What's New

Your sales agent now uses:
- **Deepgram** for real-time speech-to-text
- **Google Gemini** for intelligent AI responses  
- **Twilio Media Streams** for two-way audio streaming

This means the AI can have **natural, flowing conversations** instead of waiting for you to finish speaking!

## 🔑 API Keys You Need

### 1. Deepgram API Key
1. Go to https://deepgram.com/
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Google Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy it

### 3. Update Your `.env` File

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Deepgram Configuration
DEEPGRAM_API_KEY=your_deepgram_key_here

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_key_here

# Server Configuration
PORT=3000
BASE_URL=https://your-ngrok-url.ngrok.io
```

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set up ngrok
```bash
ngrok http 3000
```

Copy the **HTTPS** URL (e.g., `https://abc123.ngrok.io`)

### Step 3: Update .env
```bash
BASE_URL=https://abc123.ngrok.io
```

### Step 4: Start the Server
```bash
npx ts-node src/app.ts
```

You should see:
```
🚀 Twilio Conversational AI Sales Agent server is running on port 3000
📞 Voice Webhook URL: http://localhost:3000/api/webhook/conversational
🌊 Media Stream WebSocket: ws://localhost:3000/media-stream
💚 Health check: http://localhost:3000/api/health

⚡ Features:
   - Real-time speech-to-text (Deepgram)
   - AI conversation (Google Gemini)
   - Twilio Media Streams
```

### Step 5: Make a Call
```bash
./make-sales-call.sh +YOUR_PHONE_NUMBER
```

## 🎯 How It Works

```
1. You trigger the call via API
     ↓
2. Twilio calls the number
     ↓
3. When answered, Twilio opens a WebSocket connection
     ↓
4. Audio streams in real-time:
   - Your voice → Twilio → Deepgram → Text
   - Text → Gemini → AI Response → Text
   - Text → Twilio TTS → Audio → You
     ↓
5. Natural conversation flows back and forth
```

## 💬 Conversation Example

**AI**: "Hello! Thanks so much for taking my call. I'm excited to tell you about our amazing software solutions that can transform your business. How are you doing today?"

**You**: "I'm doing well, thanks. What do you have?"

**AI**: "Fantastic! We offer three powerful products: our CRM tool helps manage customer relationships effortlessly, our analytics platform provides real-time insights for smarter decisions, and our automation software eliminates repetitive tasks. Which one sounds most interesting to you?"

**You**: "Tell me more about the CRM"

**AI**: "Great choice! Our CRM tool lets you track all customer interactions in one place, automate follow-ups so you never miss an opportunity, and provides detailed reports on your sales pipeline. It starts at just $99 per month. Would you like to see a demo?"

## 🔧 Troubleshooting

### Deepgram not connecting
- Check your API key is correct
- Ensure you have credits in your Deepgram account
- Check server logs for connection errors

### Gemini not responding
- Verify your GEMINI_API_KEY is set correctly
- Check you're not rate-limited (free tier has limits)
- Look for errors in console output

### WebSocket issues
- Make sure BASE_URL uses HTTPS (wss:// for WebSocket)
- ngrok must be running
- Check firewall isn't blocking WebSocket connections

### No audio streaming
- Verify Twilio webhook points to `/api/webhook/conversational`
- Check WebSocket path is `/media-stream`
- Look for WebSocket connection logs in console

## 📝 Customizing the AI

Edit `src/services/conversationalAIService.ts`:

```typescript
this.systemPrompt = `You are a professional sales agent...
// Modify this to change the AI's personality and knowledge
`;
```

Then rebuild:
```bash
npm run build
```

## 🎨 Key Files

- `src/services/conversationalAIService.ts` - Deepgram + Gemini logic
- `src/services/mediaStreamHandler.ts` - WebSocket audio streaming
- `src/controllers/conversationalAIController.ts` - API endpoints
- `src/app.ts` - WebSocket server setup

## ⚡ Performance Tips

1. **Keep responses concise** - AI is configured for 2-3 sentence responses
2. **Low latency** - Deepgram Nova-2 model is optimized for speed
3. **Conversation history** - Limited to last 20 messages for efficiency

## 🎉 You're Ready!

Start the server and make a call. The AI will have a natural, flowing conversation with you in real-time!

For more details, see `README.md` and `QUICKSTART.md`.
