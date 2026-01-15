# Social Listening Strategy for Coffee Brand (Ettara)

## Overview
This document outlines the strategy and implementation for making the Social Listening feature dynamic, specifically tailored for a coffee brand like Ettara.

---

## 🎯 Strategy Summary

### Phase 1: Reddit Integration (✅ IMPLEMENTED)
- **Status**: Complete
- **Data Source**: Reddit API via Snoowrap
- **Real-time Monitoring**: Coffee-related subreddits and keywords
- **Sentiment Analysis**: Keyword-based sentiment detection
- **Fallback**: Mock data when Reddit is not configured

### Phase 2: Enhanced Analytics (Planned)
- Time-series data storage
- Advanced sentiment analysis using AI/ML
- Alert system based on custom rules
- Trend detection algorithms

### Phase 3: Multi-Platform (Future)
- Twitter/X integration
- Instagram mentions (via hashtag scraping or official API)
- Facebook/Meta business insights
- Unified cross-platform dashboard

### Phase 4: Advanced Features (Future)
- Predictive analytics
- Automated response suggestions
- Influencer outreach automation
- Crisis detection and management

---

## 📊 Current Implementation

### Backend Architecture

#### 1. Controller: `socialListeningController.ts`
Located at: `backend/src/controllers/socialListeningController.ts`

**Endpoints:**
```
GET /api/social-listening/keywords
GET /api/social-listening/mentions
GET /api/social-listening/trends
GET /api/social-listening/alerts
GET /api/social-listening/competitors
```

**Features:**
- Coffee-specific keyword tracking
- Real-time Reddit data aggregation
- Sentiment analysis using keyword matching
- Alert generation based on thresholds
- Competitor analysis

#### 2. Service: `redditService.ts`
Enhanced with new `searchPosts()` method for keyword searching across Reddit.

**Methods:**
- `searchPosts(query, options)` - Search Reddit by keyword
- `getSubredditPosts(subreddit, options)` - Get posts from specific subreddit
- `getSubredditEngagement(subreddit, options)` - Get engagement timeline

### Frontend Implementation

#### Page: `app/(dashboard)/listening/page.tsx`
- Real-time data fetching from backend APIs
- Auto-refresh capability
- Tab-based navigation (Keywords, Mentions, Trends)
- Sentiment visualization
- Alert management

#### API Configuration: `lib/api-config.ts`
Added social listening endpoints:
```typescript
socialListening: {
  keywords: "/social-listening/keywords",
  mentions: "/social-listening/mentions",
  trends: "/social-listening/trends",
  alerts: "/social-listening/alerts",
  competitors: "/social-listening/competitors",
}
```

---

## ☕ Coffee Brand Specific Keywords

### Brand Keywords
- `"Ettara"`
- `"#Ettara"`
- `"Ettara coffee"`
- `"Ettara blend"`

### Product Keywords
- `"specialty coffee"`
- `"third wave coffee"`
- `"artisan coffee"`
- `"pour over"`
- `"cold brew"`
- `"espresso"`
- `"single origin"`
- `"coffee blend"`

### Category Terms
- `"coffee shop"`
- `"cafe"`
- `"coffeehouse"`
- `"coffee culture"`
- `"barista"`

### Location-Based
- `"coffee in [Mumbai/Bangalore/etc]"`
- `"best cafe in [location]"`
- `"[city] coffee scene"`

### Trend Keywords
- `"sustainable coffee"`
- `"ethical sourcing"`
- `"nitro cold brew"`
- `"oat milk"`
- `"coffee trends 2024"`

### Competitors
- `"Starbucks"`
- `"Blue Tokai"`
- `"Third Wave Coffee"`
- `"Sleepy Owl"`
- `"Araku Coffee"`
- `"Cafe Coffee Day"`

---

## 🔍 Monitored Subreddits

### Primary Coffee Subreddits
- `r/coffee` - General coffee discussion
- `r/espresso` - Espresso enthusiasts
- `r/cafe` - Cafe culture
- `r/barista` - Barista community
- `r/CoffeeGoneWild` - Coffee photography
- `r/coffeestations` - Home coffee setups
- `r/pourover` - Pour over techniques
- `r/AeroPress` - AeroPress brewing

### Local/Regional
- City-specific subreddits (e.g., r/mumbai, r/bangalore, r/delhi)
- Regional food subreddits

---

## 🧠 Sentiment Analysis

### Current Implementation: Keyword-Based

**Positive Keywords:**
- love, amazing, best, perfect, delicious, great, excellent
- fantastic, wonderful, awesome, incredible, favorite
- recommend, highly, quality, fresh, smooth, rich, aromatic
- cozy, beautiful, heaven, masterpiece, brilliant

**Negative Keywords:**
- terrible, worst, bad, awful, horrible, disappointing
- overpriced, expensive, bitter, burnt, stale, waste
- avoid, never, regret, poor, lacking, mediocre, underwhelming

**Neutral:**
- Everything else (no strong positive or negative indicators)

### Future Enhancement: AI-Based Sentiment
- OpenAI GPT-4 for context-aware sentiment
- Hugging Face transformers for local sentiment analysis
- Azure Cognitive Services Text Analytics
- Google Natural Language API

---

## 🚨 Alert System

### Alert Types

#### 1. Spike Detection
- **Trigger**: >50% increase in mentions vs 24h average
- **Severity**: Info/Warning
- **Example**: "Unusual spike in mentions detected - 150% increase in the last hour"

#### 2. Negative Sentiment Alert
- **Trigger**: >60% negative sentiment in last hour
- **Severity**: Warning/Alert
- **Example**: "High negative sentiment detected - 15 negative mentions in the last 24 hours"

#### 3. Positive Trending
- **Trigger**: >20 positive mentions in short period
- **Severity**: Info
- **Example**: "Positive sentiment trending - 25 positive mentions today"

#### 4. Competitor Mention
- **Trigger**: Competitor mentioned with your brand
- **Severity**: Info
- **Example**: "Your brand mentioned alongside Starbucks - 5 comparison posts"

### Custom Alert Rules (Future)
- Threshold-based alerts (customize per keyword)
- Geographic alerts (mentions in specific locations)
- Influencer alerts (high-follower accounts mentioning brand)
- Crisis detection (rapid negative sentiment surge)

---

## 📈 Metrics & KPIs

### Core Metrics
1. **Total Mentions** - Volume of brand mentions across all platforms
2. **Sentiment Distribution** - Positive/Neutral/Negative breakdown
3. **Mention Velocity** - Rate of mentions over time
4. **Engagement Rate** - Likes, comments, shares per mention
5. **Reach** - Estimated audience size

### Advanced Metrics (Future)
- **Share of Voice** - % of mentions vs competitors
- **Sentiment Trend** - Change in sentiment over time
- **Response Time** - Time to respond to mentions
- **Conversion Rate** - Mentions leading to actions (visits, purchases)
- **Influencer Impact** - Mentions from high-reach accounts

---

## 🔄 Data Refresh Strategy

### Current Implementation
- **Manual Refresh**: User-triggered via "Refresh" button
- **Initial Load**: Data fetched on page load
- **Caching**: None (direct API calls)

### Recommended Enhancement
```typescript
// Auto-refresh every 5 minutes
useEffect(() => {
  const interval = setInterval(() => {
    fetchListeningData()
  }, 300000) // 5 minutes
  
  return () => clearInterval(interval)
}, [])
```

### Backend Optimization
- **Redis Cache**: Cache Reddit API responses for 15 minutes
- **Rate Limiting**: Respect Reddit API limits (60 requests/minute)
- **Background Jobs**: Scheduled data collection (cron jobs)
- **WebSockets**: Real-time updates for critical alerts

---

## 🛠️ Setup Instructions

### 1. Configure Reddit API

Create a Reddit app at https://www.reddit.com/prefs/apps

**Environment Variables:**
```bash
# Password-based auth (for script apps)
REDDIT_AUTH_METHOD=password
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password

# OR Token-based auth (for web apps)
REDDIT_AUTH_METHOD=token
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_REFRESH_TOKEN=your_refresh_token
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Test Integration
Navigate to: `http://localhost:3001/listening`

**Without Reddit configured:**
- You'll see mock data
- Badge shows "Mock Data (Reddit not configured)"

**With Reddit configured:**
- Real Reddit data loads
- Badge shows "🔴 Live Reddit Data"

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   Frontend UI   │
│  (Listening)    │
└────────┬────────┘
         │
         │ HTTP GET /api/social-listening/*
         │
         ▼
┌─────────────────┐
│   Backend API   │
│  (Controller)   │
└────────┬────────┘
         │
         │ Call Service Methods
         │
         ▼
┌─────────────────┐
│ Reddit Service  │
│  (Snoowrap)     │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐
│   Reddit API    │
│  (External)     │
└─────────────────┘
```

---

## 🚀 Future Enhancements

### Short-term (1-2 weeks)
- [ ] Add keyword management (CRUD operations)
- [ ] Implement data caching with Redis
- [ ] Add export functionality (CSV, PDF reports)
- [ ] Email alerts for critical mentions
- [ ] Historical data storage in database

### Medium-term (1-2 months)
- [ ] Twitter/X API integration
- [ ] Advanced AI sentiment analysis
- [ ] Influencer identification algorithm
- [ ] Automated report generation
- [ ] Competitive benchmarking dashboard

### Long-term (3-6 months)
- [ ] Multi-brand support
- [ ] Predictive analytics (trend forecasting)
- [ ] Automated response suggestions
- [ ] Crisis management workflow
- [ ] Integration with CRM systems
- [ ] Mobile app for alerts

---

## 🔐 Security & Privacy

### Best Practices
1. **API Keys**: Store in environment variables, never commit to repo
2. **Rate Limiting**: Implement rate limits to prevent abuse
3. **Data Privacy**: Don't store personal user data without consent
4. **CORS**: Configure proper CORS policies
5. **Authentication**: Secure endpoints with auth middleware
6. **Encryption**: Encrypt sensitive data at rest and in transit

### Reddit API Compliance
- Respect rate limits (60 requests/minute)
- Include proper user agent
- Don't scrape data excessively
- Follow Reddit's API terms of service

---

## 📝 API Response Examples

### Keywords Endpoint
```json
GET /api/social-listening/keywords

{
  "success": true,
  "keywords": [
    {
      "keyword": "Ettara",
      "mentions": 234,
      "change": 23,
      "sentiment": "positive",
      "platforms": {
        "reddit": 234,
        "twitter": 0,
        "instagram": 0
      }
    }
  ],
  "source": "reddit",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Mentions Endpoint
```json
GET /api/social-listening/mentions

{
  "success": true,
  "mentions": [
    {
      "id": "abc123",
      "platform": "reddit",
      "author": "coffee_lover",
      "content": "Just tried Ettara's new blend...",
      "sentiment": "positive",
      "timestamp": "2 hours ago",
      "url": "https://reddit.com/r/coffee/...",
      "engagement": {
        "score": 45,
        "comments": 12
      }
    }
  ],
  "total": 1,
  "source": "reddit"
}
```

---

## 🤝 Contributing

### Adding New Data Sources

1. Create a new service file (e.g., `twitterService.ts`)
2. Implement search and fetch methods
3. Update `socialListeningController.ts` to aggregate data
4. Add API endpoints in routes
5. Update frontend to display new platform data

### Improving Sentiment Analysis

1. Integrate AI service (OpenAI, Hugging Face)
2. Update `analyzeSentiment()` method in controller
3. Add confidence scores to responses
4. Train custom model on coffee-specific language

---

## 📚 Resources

### Reddit API
- [Reddit API Docs](https://www.reddit.com/dev/api)
- [Snoowrap Documentation](https://not-an-aardvark.github.io/snoowrap/)
- [Reddit OAuth Guide](https://github.com/reddit-archive/reddit/wiki/OAuth2)

### Sentiment Analysis
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [VADER Sentiment](https://github.com/cjhutto/vaderSentiment)

### Social Media APIs
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api/)
- [LinkedIn API](https://docs.microsoft.com/en-us/linkedin/)

---

## 💡 Tips for Coffee Brand

### What to Monitor
1. **Product Launches**: Track reactions to new blends/products
2. **Customer Service**: Monitor complaints and respond quickly
3. **Competitors**: Track mentions alongside competitor brands
4. **Trends**: Identify emerging coffee trends (e.g., "oat milk latte")
5. **Influencers**: Find coffee bloggers mentioning your brand
6. **Local Events**: Track mentions during coffee festivals, events

### Best Practices
- Respond to negative mentions within 2 hours
- Engage with positive mentions (like, comment, share)
- Use insights to inform product development
- Share UGC (user-generated content) with permission
- Build relationships with micro-influencers
- Track sentiment before/after marketing campaigns

---

## 📞 Support

For questions or issues:
- Backend: Check `backend/README.md`
- Frontend: Check `frontend/README.md`
- Reddit Setup: See `backend/src/config/reddit.ts`

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained by**: SocialNest Team