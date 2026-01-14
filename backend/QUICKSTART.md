# Quick Start Guide - Outbound Sales Calls

## 🚀 How to Make Your First Sales Call

### Prerequisites
1. Twilio account with verified phone number
2. Your `.env` file configured with Twilio credentials
3. Server running (either locally or with ngrok)

### Step 1: Update Your .env File

Make sure your `.env` has the correct values:

```bash
TWILIO_ACCOUNT_SID=AC...  # Your Twilio Account SID
TWILIO_AUTH_TOKEN=...     # Your Twilio Auth Token
TWILIO_PHONE_NUMBER=+1... # Your Twilio phone number
PORT=3000
BASE_URL=https://your-ngrok-url.ngrok.io  # Important for outbound calls!
```

**Important**: If testing locally, you MUST use ngrok and set `BASE_URL` to your ngrok URL!

### Step 2: Start the Server

```bash
npm start
```

You should see:
```
🚀 Twilio Voice Sales Agent server is running on port 3000
📞 Voice Webhook URL: http://localhost:3000/api/webhook/voice
💚 Health check: http://localhost:3000/api/health
```

### Step 3: Start ngrok (For Local Testing)

In another terminal:

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and update your `.env`:

```bash
BASE_URL=https://abc123.ngrok.io
```

Restart your server after updating BASE_URL!

### Step 4: Make a Sales Call

#### Option A: Using the Script

```bash
./make-sales-call.sh +1234567890
```

Replace `+1234567890` with your phone number (must include country code).

#### Option B: Using curl

```bash
curl -X POST http://localhost:3000/api/make-call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890"
  }'
```

### Step 5: Answer the Call

You'll receive a call from your Twilio number. The bot will:

1. Greet you and introduce the company
2. Describe three products (CRM, Analytics, Automation)
3. Share pricing ($99, $499, $999)
4. Ask if you want more information
   - Say "Yes" or Press 1 → Get detailed product info
   - Say "No" or Press 2 → Polite exit
5. If you said yes, offer to schedule a demo
   - Say "Yes" or Press 1 → Confirm demo scheduling
   - Say "No" or Press 2 → Polite exit

## 🎯 What the Sales Pitch Says

### Opening
> "Hello! Thanks for your interest in our products. I'm calling from your favorite software company to tell you about our amazing solutions. We offer three incredible products: A powerful CRM tool to manage your customer relationships, an advanced analytics platform for data-driven insights, and cutting-edge automation software to streamline your business operations."

### Pricing
> "Our pricing is very competitive, starting at just 99 dollars for the basic package, 499 dollars for our professional tier, and 999 dollars for our full enterprise solution with all features included."

### Interest Check
> "Would you like to hear more about any of these products? Press 1 or say yes for more information. Press 2 or say no if you'd like us to call back later."

### Detailed Pitch (if interested)
> "Our CRM tool helps you track all customer interactions in one place, automate follow-ups, and never miss an opportunity. The analytics platform gives you real-time dashboards, predictive insights, and custom reports that drive smarter decisions. And our automation software eliminates repetitive tasks, saving you hours every week while reducing errors."

### Demo Offer
> "Would you like to schedule a free demo? Say yes or press 1 to schedule now. Say no or press 2 if you'd like more time to think."

## 🔧 Troubleshooting

### Call not coming through
1. Check Twilio account balance
2. Verify phone number in `.env` is correct (with + and country code)
3. Check if recipient number is verified (required for trial accounts)
4. Look at server logs for errors

### Webhook errors
1. Ensure `BASE_URL` in `.env` is set to your ngrok URL
2. Make sure ngrok is running
3. Restart server after changing BASE_URL
4. Check ngrok console for incoming webhook requests

### Response not working
1. Speak clearly and loudly
2. Background noise can interfere - try a quiet location
3. Use DTMF (keypad) as backup: Press 1 for Yes, 2 for No

## 📝 Example API Response

When you make a call, you'll get:

```json
{
  "success": true,
  "message": "Sales call initiated successfully",
  "callSid": "CA1234567890abcdef",
  "to": "+1234567890",
  "status": "queued"
}
```

The call will be made immediately and you should receive it within seconds!

## 🎨 Customizing the Pitch

Edit `src/controllers/conversationController.ts`:

- `handleSalesPitch()` - Modify the opening pitch
- `handlePitchResponse()` - Change the detailed product info
- `handleDemoRequest()` - Customize the demo scheduling message

Then rebuild:
```bash
npm run build
```

## 📞 Making Multiple Calls

You can call the `/api/make-call` endpoint as many times as you want. Each call is independent.

```bash
# Call yourself
./make-sales-call.sh +1234567890

# Call someone else (if verified on trial account)
./make-sales-call.sh +0987654321
```

**Note**: Twilio trial accounts can only call verified numbers!
