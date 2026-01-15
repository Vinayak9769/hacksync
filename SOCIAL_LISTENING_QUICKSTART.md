# Social Listening - Quick Start Guide

## 🚀 What We Built

A **dynamic social listening feature** for coffee brand monitoring that tracks:
- ☕ Coffee-related keywords and brand mentions
- 📊 Real-time Reddit data aggregation
- 😊 Sentiment analysis (positive/negative/neutral)
- 🔔 Automated alerts for important events
- 📈 Trend visualization over time
- 🏆 Competitor analysis

---

## ✅ Features Implemented

### Backend (`/backend/src`)
1. **Social Listening Controller** (`controllers/socialListeningController.ts`)
   - 5 API endpoints for keywords, mentions, trends, alerts, competitors
   - Coffee-specific keyword tracking (Ettara, specialty coffee, etc.)
   - Reddit integration with real-time data
   - Keyword-based sentiment analysis
   - Alert generation based on thresholds

2. **Enhanced Reddit Service** (`services/redditService.ts`)
   - New `searchPosts()` method for keyword searching
   - Search across multiple coffee subreddits
   - Configurable time ranges and sorting options

3. **API Routes** (`routes/index.ts`)
   - `/api/social-listening/keywords` - Get tracked keywords with metrics
   - `/api/social-listening/mentions` - Get recent social media mentions
   - `/api/social-listening/trends` - Get time-series trend data
   - `/api/social-listening/alerts` - Get generated alerts
   - `/api/social-listening/competitors` - Get competitor analysis

### Frontend (`/frontend/app`)
1. **Social Listening Page** (`(dashboard)/listening/page.tsx`)
   - Real-time data fetching from backend APIs
   - Tabbed interface: Keywords, Mentions, Trends
   - Overview dashboard with sentiment metrics
   - Manual refresh capability
   - Alert management system
   - Visual trend charts using Recharts

2. **API Configuration** (`lib/api-config.ts`)
   - Added social listening endpoints to API configuration

---

## 🎯 How It Works

```
User opens /listening page
        ↓
Frontend fetches data from 5 endpoints
        ↓
Backend checks if Reddit is configured
        ↓
   ┌────────────────┐
   │ Reddit Config? │
   └───────┬────────┘
           │
    ┌──────┴──────┐
    │             │
   YES           NO
    │             │
    ↓             ↓
Search Reddit   Return Mock
for keywords    Data
    │             │
    ↓             ↓
Analyze         Display
Sentiment       to User
    │             │
    ↓             │
Return Real   ←───┘
Data
    │
    ↓
Display to User
with "Live" badge
```

---

## 📝 Setup Instructions

### 1. Backend Setup

**Install dependencies:**
```bash
cd backend
npm install
```

**Configure Reddit API (Optional but Recommended):**

Create a Reddit app at: https://www.reddit.com/prefs/apps

Add to `.env`:
```bash
# For script-based auth
REDDIT_AUTH_METHOD=password
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

**Start backend:**
```bash
npm run dev
```

Backend runs on: `http://localhost:3000`

### 2. Frontend Setup

**Install dependencies:**
```bash
cd frontend
npm install
```

**Configure API URL (if needed):**

In `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Start frontend:**
```bash
npm run dev
```

Frontend runs on: `http://localhost:3001`

### 3. Access Social Listening

Navigate to: `http://localhost:3001/listening`

---

## 🔍 Coffee Keywords Being Tracked

### Brand Keywords
- Ettara
- #Ettara
- Ettara coffee

### Product Keywords
- specialty coffee
- coffee shop
- artisan coffee
- pour over
- cold brew
- espresso
- coffee culture
- third wave coffee
- sustainable coffee
- single origin

### Competitors
- Starbucks
- Blue Tokai
- Third Wave Coffee
- Sleepy Owl
- Araku Coffee

### Monitored Subreddits
- r/coffee
- r/espresso
- r/cafe
- r/barista
- r/CoffeeGoneWild
- r/coffeestations
- r/pourover
- r/AeroPress

---

## 📊 What You'll See

### Without Reddit Configured
- Mock data displayed
- Badge: "Mock Data (Reddit not configured)"
- Sample keywords, mentions, and trends
- Fully functional UI for testing

### With Reddit Configured
- Real-time Reddit data
- Badge: "🔴 Live Reddit Data"
- Actual mentions from coffee subreddits
- Real sentiment analysis
- Live trends and alerts

---

## 🎨 UI Features

### Overview Dashboard
- Total mentions across all keywords
- Sentiment breakdown (Positive/Neutral/Negative %)
- Visual progress bars for each sentiment

### Tracked Keywords Tab
- Add/remove keywords dynamically
- View mention count per keyword
- See change percentage (trending up/down)
- Sentiment badge for each keyword
- Platform breakdown (Reddit, Twitter, Instagram)

### Recent Mentions Tab
- See actual posts from Reddit
- Author, content, timestamp
- Engagement metrics (upvotes, comments)
- Direct links to original posts
- Sentiment badge per mention

### Trends Tab
- Stacked area chart showing mentions over time
- Color-coded by sentiment (green=positive, blue=neutral, red=negative)
- Interactive tooltips
- Time-based analysis

### Alerts Section
- Spike detection alerts
- Negative sentiment warnings
- Positive trending notifications
- Dismissible alert cards

---

## 🧠 Sentiment Analysis

Currently uses **keyword-based matching**:

**Positive words:** love, amazing, best, perfect, delicious, great, excellent, fantastic, wonderful, awesome, incredible, favorite, recommend, highly, quality, fresh, smooth, rich, aromatic, cozy, beautiful, heaven, masterpiece, brilliant

**Negative words:** terrible, worst, bad, awful, horrible, disappointing, overpriced, expensive, bitter, burnt, stale, waste, avoid, never, regret, poor, lacking, mediocre, underwhelming

**Neutral:** Everything else

### Future Enhancement
Can be upgraded to use AI-based sentiment:
- OpenAI GPT-4
- Hugging Face transformers
- Azure Cognitive Services
- Google Natural Language API

---

## 🚨 Alert System

### Alert Types Generated

1. **Spike Detection**
   - Triggers when mentions increase >100% in 24h
   - Severity: Warning
   - Example: "Unusual spike in mentions detected - 150 posts in the last 24 hours"

2. **Negative Sentiment**
   - Triggers when >10 negative mentions in 24h
   - Severity: Warning
   - Example: "High negative sentiment detected - 15 negative mentions in the last 24 hours"

3. **Positive Trending**
   - Triggers when >20 positive mentions in 24h
   - Severity: Info
   - Example: "Positive sentiment trending - 25 positive mentions today"

---

## 🔄 Refresh Data

Click the **"Refresh"** button in the top right to fetch latest data from Reddit.

**Auto-refresh (Optional Enhancement):**
```typescript
// Add to listening page.tsx
useEffect(() => {
  const interval = setInterval(() => {
    fetchListeningData()
  }, 300000) // Refresh every 5 minutes
  
  return () => clearInterval(interval)
}, [])
```

---

## 📈 Next Steps

### Immediate Improvements
1. **Add Keyword Management**
   - Save custom keywords to database
   - CRUD operations for keywords
   - Keyword groups/categories

2. **Data Persistence**
   - Store mentions in PostgreSQL/MongoDB
   - Historical data analysis
   - Week-over-week comparisons

3. **Email Alerts**
   - Send email when critical alerts trigger
   - Daily/weekly digest reports
   - Configurable alert thresholds

### Medium-term Goals
1. **Twitter/X Integration**
   - Add Twitter API alongside Reddit
   - Unified cross-platform view
   - Platform comparison analytics

2. **Advanced Sentiment Analysis**
   - Integrate OpenAI or Hugging Face
   - Context-aware sentiment
   - Confidence scores

3. **Influencer Detection**
   - Identify high-engagement accounts
   - Track influencer mentions
   - Outreach recommendations

### Long-term Vision
1. **Predictive Analytics**
   - Forecast mention trends
   - Predict viral content
   - Early crisis detection

2. **Automated Responses**
   - AI-generated reply suggestions
   - Auto-response to common queries
   - Escalation workflow for issues

3. **Competitive Intelligence**
   - Deep competitor analysis
   - Share of voice metrics
   - Benchmarking reports

---

## 🐛 Troubleshooting

### "Mock Data" badge showing?
- Reddit API not configured or invalid credentials
- Check `.env` file has correct Reddit credentials
- Test auth: `GET /api/reddit/test-auth`

### No mentions showing?
- Coffee-related posts might be sparse in recent hours
- Try searching broader keywords
- Check if subreddits have recent activity

### TypeScript errors?
- Run `npm run build` in backend to recompile
- Clear `.next` folder in frontend
- Restart both servers

### API errors?
- Check backend logs for Reddit API rate limits
- Verify Reddit credentials are valid
- Ensure backend server is running on port 3000

---

## 📚 Related Documentation

- **Full Strategy Guide**: `SOCIAL_LISTENING_STRATEGY.md`
- **Backend README**: `backend/README.md`
- **Reddit Config**: `backend/src/config/reddit.ts`
- **Frontend README**: `frontend/README.md`

---

## 🎯 Key Metrics to Track

For a coffee brand, monitor:
1. **Brand Mentions** - Total Ettara mentions
2. **Sentiment Ratio** - % positive vs negative
3. **Engagement Rate** - Upvotes + comments per mention
4. **Share of Voice** - Ettara mentions vs competitors
5. **Trending Topics** - What coffee lovers are talking about
6. **Geographic Reach** - Where mentions are coming from (future)
7. **Influencer Mentions** - High-reach accounts mentioning brand

---

## 💡 Pro Tips

1. **Start with broad keywords** like "specialty coffee" to understand the conversation
2. **Monitor competitors** to see what they're doing right/wrong
3. **Respond quickly** to negative mentions (within 2 hours ideal)
4. **Engage with positive mentions** to build community
5. **Use insights** to inform product development and marketing
6. **Track trends** before launching new products
7. **Build relationships** with coffee influencers who mention you

---

## 🤝 Support

Questions or issues? Check:
- Backend controller: `backend/src/controllers/socialListeningController.ts`
- Frontend page: `frontend/app/(dashboard)/listening/page.tsx`
- API config: `frontend/lib/api-config.ts`

---

**Built for**: Ettara Coffee Brand  
**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: ✅ Production Ready (with Reddit) | ✅ Demo Ready (mock data)