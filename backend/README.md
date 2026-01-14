# Twilio Sales Conversational Agent

A TypeScript-based Express.js application that creates an intelligent **real-time conversational** sales agent using:
- **Deepgram** for speech-to-text
- **Google Gemini** for AI responses
- **Twilio Media Streams** for two-way voice communication

## Features

- 🤖 Real-time AI conversations (not pre-scripted!)
- 🎙️ Speech recognition with Deepgram
- 🧠 Intelligent responses powered by Google Gemini
- 📞 Twilio Media Streams for low-latency audio
- 🚀 Express.js REST API
- 📝 TypeScript for type safety
- ✅ Health check endpoint
- 🔊 Natural, flowing conversationss Conversational Agent

A TypeScript-based Express.js application that creates an intelligent sales conversational agent using Twilio Voice calls.

## Features

- 🤖 Automated sales conversations via voice calls
- 🎙️ Speech recognition for natural conversations
- � Twilio voice webhook integration
- 🚀 Express.js REST API
- 📝 TypeScript for type safety
- ✅ Health check endpoint
- 🔊 Text-to-speech responses

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Twilio Configuration](#twilio-configuration)
- [Conversation Flow](#conversation-flow)
- [Project Structure](#project-structure)
- [Development](#development)
- [License](#license)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Twilio account with:
  - Account SID
  - Auth Token
  - Phone Number (voice-enabled)
- **Deepgram API key** (get from https://deepgram.com/)
- **Google Gemini API key** (get from https://makersuite.google.com/app/apikey)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/twilio-sales-agent.git
   ```

2. Navigate to the project directory:
   ```bash
   cd twilio-sales-agent
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Add your Twilio credentials to `.env`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   PORT=3000
   BASE_URL=http://localhost:3000
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The application will be running on `http://localhost:3000`.

## API Routes

### GET /
Root endpoint showing available API routes

### GET /api/health
Health check endpoint
```bash
curl http://localhost:3000/api/health
```

### POST /api/webhook/voice
Twilio webhook endpoint for incoming voice calls (configured in Twilio console)

### POST /api/webhook/voice/gather
Twilio webhook endpoint for processing speech/DTMF input during calls

### POST /api/make-call
Make an outbound sales call that delivers a complete sales pitch
```bash
curl -X POST http://localhost:3000/api/make-call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890"
  }'
```

Or use the convenient script:
```bash
./make-sales-call.sh +1234567890
```

## Twilio Configuration

1. Log in to your [Twilio Console](https://console.twilio.com/)
2. Navigate to your phone number settings
3. Under "Voice & Fax", set the webhook URL to:
   ```
   https://your-domain.com/api/webhook/voice
   ```
   (Use ngrok for local testing: `ngrok http 3000`)
4. Make sure HTTP POST is selected as the method

## Conversation Flow

### Inbound Calls (Customer calls you)
The voice agent responds to various customer intents:

- **Greetings**: "hello", "hi" → Welcome message
- **Pricing**: "price", "cost", "how much" → Product pricing information
- **Products**: "product", "what do you sell", "tell me about" → Product catalog
- **Demo**: "demo", "trial", "try" → Demo scheduling
- **Purchase**: "buy", "purchase", "sign up" → Purchase guidance
- **Representative**: "speak to", "representative", "human" → Transfer to human agent
- **Ending**: "no", "nothing", "that's all", "goodbye" → End call gracefully

### Outbound Sales Pitch (You call customers)
The bot will call the number you provide and:

1. **Opening Pitch**: Introduces your company and the three main products (CRM, Analytics, Automation)
2. **Pricing Overview**: Shares pricing tiers ($99, $499, $999)
3. **Interest Check**: Asks if they want to hear more (Press 1/Yes or Press 2/No)
4. **Detailed Information**: If interested, provides detailed product features
5. **Demo Scheduling**: Offers to schedule a free demo
6. **Graceful Close**: Thanks them for their time regardless of interest level

## Project Structure

```
twilio-sales-agent/
├── src/
│   ├── app.ts                      # Main application entry
│   ├── config/
│   │   └── twilio.ts               # Twilio configuration
│   ├── controllers/
│   │   └── conversationController.ts  # Request handlers
│   ├── routes/
│   │   └── index.ts                # Route definitions
│   ├── services/
│   │   └── twilioService.ts        # Twilio business logic
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Development

### Testing with ngrok

For local development, use ngrok to expose your local server:

```bash
ngrok http 3000
```

Then update your Twilio webhook URL with the ngrok URL.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the ISC License.