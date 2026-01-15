# Quick Testing Guide - Twitter OAuth Flow

## Pre-Flight Checklist

### 1. Backend Setup
- [ ] Backend `.env` file configured:
  ```
  SESSION_SECRET=your-random-secret-at-least-32-characters
  TWITTER_CLIENT_ID=your_actual_client_id
  TWITTER_CLIENT_SECRET=your_actual_client_secret
  TWITTER_CALLBACK_URL=https://toucan-driven-admittedly.ngrok-free.app/api/twitter/callback
  FRONTEND_URL=http://localhost:8000
  ```

- [ ] ngrok running:
  ```bash
  ngrok http 3000
  ```

- [ ] Twitter Developer Portal callback URL matches ngrok URL:
  - Go to: https://developer.twitter.com/en/portal/projects-and-apps
  - Settings → Authentication Settings → Callback URLs
  - Add: `https://toucan-driven-admittedly.ngrok-free.app/api/twitter/callback`

### 2. Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Testing Steps

### Step 1: Verify Backend is Running
```bash
curl http://localhost:3000/api/twitter/status
# Expected: {"connected":false}
```

### Step 2: Clear Cookies (Important!)
- Open browser DevTools (F12)
- Go to Application → Cookies
- Delete all cookies for `localhost` and `ngrok-free.app` domains
- Close DevTools

### Step 3: Test Twitter Connection Flow

1. **Navigate to Settings**
   - Go to: http://localhost:8000/settings
   - Scroll to "Connected Accounts" section
   - Find Twitter/X

2. **Click "Connect"**
   - Should immediately redirect to backend
   - Then redirect to Twitter authorization page
   - URL should be: `https://twitter.com/i/oauth2/authorize?...`

3. **Check Backend Console**
   Should see:
   ```
   === TWITTER AUTH INITIATED ===
   Session ID: unWWmKlCT_G_rreVNVZnJ4A5V_9D6xmy
   Stored state: LE7nUwwfNMS1BH5Du0Zlv9nNZmI43fsy
   Stored codeVerifier: uZ8vJKR4bD...
   Auth URL: https://twitter.com/i/oauth2/authorize?...
   Session saved, redirecting to Twitter...
   ```

4. **Authorize on Twitter**
   - Click "Authorize app"
   - Should redirect back to your app

5. **Check Backend Console Again**
   Should see:
   ```
   === TWITTER CALLBACK RECEIVED ===
   Session ID: unWWmKlCT_G_rreVNVZnJ4A5V_9D6xmy  ← SAME ID!
   Received state: LE7nUwwfNMS1BH5Du0Zlv9nNZmI43fsy
   Session state: LE7nUwwfNMS1BH5Du0Zlv9nNZmI43fsy  ← MATCHES!
   Received code: present
   Session codeVerifier: present  ← FOUND!
   Session keys: [ 'cookie', 'twitterCodeVerifier', 'twitterState' ]
   ```

6. **Verify Redirect**
   - Should land on: http://localhost:8000/twitter-connected?username=YourTwitterHandle
   - Page should show success message

7. **Check Connection Status**
   - Go back to Settings or Dashboard
   - Twitter/X should show as "Connected"
   - Should display your username

### Step 4: Test Posting a Tweet

1. **Navigate to Create Page**
   - Go to: http://localhost:8000/create

2. **Create a Post**
   - Select "Twitter/X" platform tab
   - Write some text (under 280 chars)
   - Optionally upload an image
   - Click "Publish"

3. **Verify Success**
   - Should see success toast
   - Check your Twitter profile - tweet should be posted!

### Step 5: Test Disconnect

1. **Go to Settings**
2. **Click "Disconnect" on Twitter**
3. **Verify**
   - Should see "Disconnected" toast
   - Status should change to disconnected
   - "Connect" button should appear

## Troubleshooting

### ❌ Session ID Changes Between Requests
**Problem:** Different session IDs in auth vs callback logs

**Solutions:**
- Clear ALL cookies (browser cache + cookies)
- Make sure `sameSite: "lax"` is set in session config
- Verify `app.set("trust proxy", 1)` is in app.ts
- Restart backend after changes

### ❌ State Mismatch Error
**Problem:** "Session state: undefined" in callback

**Solutions:**
- Verify you're redirecting directly (not using fetch)
- Check that `saveUninitialized: true` in session config
- Ensure `req.session.save()` is called before redirect
- Clear cookies and try again

### ❌ ngrok Warning Page
**Problem:** Getting HTML instead of JSON

**Solutions:**
- Add `ngrok-skip-browser-warning: true` header to fetch calls
- Or visit ngrok URL in browser once and click through warning

### ❌ "Not authenticated" Error When Posting
**Problem:** Can't post even though connected

**Solutions:**
- Check `/api/twitter/status` - should return `{"connected":true}`
- Verify session is persisting (check cookies in DevTools)
- Try disconnecting and reconnecting
- Check backend logs for token presence

### ❌ CORS Errors
**Problem:** Blocked by CORS policy

**Solutions:**
- Verify backend CORS config has `credentials: true`
- Check `origin: true` or specific origins are allowed
- Ensure `Access-Control-Allow-Credentials` header is present
- Make sure fetch includes `credentials: 'include'`

## Success Indicators

✅ Session ID stays the same between auth and callback  
✅ State matches in callback  
✅ codeVerifier is found in session  
✅ Successfully redirected to /twitter-connected  
✅ Connection shows as active in UI  
✅ Can post tweets successfully  

## Quick Commands

```bash
# Kill process on port 3000 (if backend won't start)
lsof -ti:3000 | xargs kill -9

# Check if backend is running
curl http://localhost:3000/api/health

# Check Twitter connection status
curl http://localhost:3000/api/twitter/status

# View backend logs in real-time
cd backend && npm run dev

# Restart ngrok with same URL (if you have account)
ngrok http 3000 --domain=toucan-driven-admittedly.ngrok-free.app
```

## Notes

- **Session IDs MUST match** between auth initiation and callback
- If session IDs don't match, the session cookie isn't being preserved
- The fix is: direct redirect (not fetch) + proper session config + trust proxy
- In production, use persistent session store (Redis/DB)
- Tokens stored in session are demo-only; use DB for production

---

**Expected Result:** Complete OAuth flow with no errors, connected account, ability to post tweets!