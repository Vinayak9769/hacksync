# 📞 Twilio Outbound Sales Agent - Ready to Use!

## ✅ What's Been Built

Your Twilio sales agent can now **call YOU** (or any phone number) and deliver a complete sales pitch automatically!

## 🎯 How It Works

1. **You trigger a call** via API endpoint
2. **Twilio calls the number** you specified  
3. **The bot delivers the pitch**:
   - Introduces your company
   - Describes 3 products (CRM, Analytics, Automation)
   - Shares pricing ($99, $499, $999)
   - Asks if they want more info
   - Offers to schedule a demo
4. **Interactive responses** - Customer can say "yes/no" or press 1/2
5. **Graceful ending** - Thanks them regardless of interest

## 🚀 Quick Start (3 Steps)

### 1. Set up ngrok and update .env
```bash
# Start ngrok
ngrok http 3000

# Copy the https URL and update .env
BASE_URL=https://abc123.ngrok.io
```

### 2. Start the server
```bash
npm start
```

### 3. Make a call to yourself
```bash
./make-sales-call.sh +YOUR_PHONE_NUMBER
```

That's it! You'll receive a call with the full sales pitch!

## 📋 Files Created/Modified

- ✅ `src/controllers/conversationController.ts` - Added outbound pitch handlers
- ✅ `src/services/twilioService.ts` - Added `makeSalesPitchCall()` method
- ✅ `src/routes/index.ts` - Added sales pitch webhook routes
- ✅ `make-sales-call.sh` - Convenient script to trigger calls
- ✅ `QUICKSTART.md` - Detailed usage guide
- ✅ `README.md` - Updated documentation

## 🎙️ The Sales Pitch Flow

```
📞 Call initiated → Customer answers
    ↓
👋 Opening pitch (company intro + 3 products)
    ↓
💰 Pricing overview ($99-$999)
    ↓
❓ "Want to hear more?" (Yes/No)
    ↓
    ├─ YES → Detailed product features
    │         ↓
    │         ❓ "Want a demo?" (Yes/No)
    │            ↓
    │            ├─ YES → "We'll call you back!"
    │            └─ NO → "No problem, we'll send info!"
    │
    └─ NO → "No problem, we'll send a brochure!"
    ↓
👋 Thank you and goodbye
```

## 🧪 Test It Now!

```bash
# Make sure server is running
npm start

# In another terminal, make a call
./make-sales-call.sh +1234567890
```

Replace `+1234567890` with your actual phone number (include country code)!

## ⚠️ Important Notes

1. **BASE_URL must be set** - This is critical for webhooks to work
2. **Twilio trial accounts** - Can only call verified numbers
3. **ngrok required for local testing** - Twilio needs a public URL
4. **Phone format** - Always include country code: `+1234567890`

## 📝 Customization

Want to change the pitch? Edit these functions in `conversationController.ts`:

- `handleSalesPitch()` - The main sales pitch
- `handlePitchResponse()` - Detailed product info
- `handleDemoRequest()` - Demo scheduling message

Then rebuild: `npm run build`

## 🎉 You're All Set!

Your outbound sales agent is ready to make calls and deliver pitches automatically. Just run the script with any phone number and watch it work!

For detailed instructions, see `QUICKSTART.md`.
For testing tips, see `TESTING.md`.
For full documentation, see `README.md`.

Happy selling! 🚀
