import { Request, Response } from 'express';
import redditService from '../services/redditService';

interface KeywordData {
    keyword: string;
    mentions: number;
    change: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    platforms: {
        reddit: number;
        twitter: number;
        instagram: number;
    };
}

interface Mention {
    id: string;
    platform: string;
    author: string;
    content: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    timestamp: string;
    url?: string;
    engagement?: {
        score: number;
        comments: number;
    };
}

interface Alert {
    id: string;
    type: 'spike' | 'negative' | 'positive' | 'trending';
    message: string;
    severity: 'info' | 'warning' | 'alert' | 'critical';
    timestamp: string;
    keyword?: string;
}

class SocialListeningController {
    // Coffee brand specific keywords
    private readonly COFFEE_KEYWORDS = [
        'Ettara',
        '#Ettara',
        'Ettara coffee',
        'specialty coffee',
        'coffee shop',
        'artisan coffee',
        'pour over',
        'cold brew',
        'espresso',
        'coffee culture',
        'third wave coffee',
        'sustainable coffee',
        'single origin'
    ];

    private readonly COFFEE_SUBREDDITS = [
        'coffee',
        'espresso',
        'cafe',
        'barista',
        'Coffee',
        'CoffeeGoneWild',
        'coffeestations',
        'espresso',
        'pourover',
        'AeroPress'
    ];

    private readonly COMPETITOR_KEYWORDS = [
        'Starbucks',
        'Blue Tokai',
        'Third Wave Coffee',
        'Sleepy Owl',
        'Araku Coffee',
        'Cafe Coffee Day'
    ];

    /**
     * Analyze sentiment based on keywords
     */
    private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
        const lowerText = text.toLowerCase();

        const positiveKeywords = [
            'love', 'amazing', 'best', 'perfect', 'delicious', 'great', 'excellent',
            'fantastic', 'wonderful', 'awesome', 'incredible', 'favorite', 'favourite',
            'recommend', 'highly', 'quality', 'fresh', 'smooth', 'rich', 'aromatic',
            'cozy', 'beautiful', 'heaven', 'masterpiece', 'brilliant'
        ];

        const negativeKeywords = [
            'terrible', 'worst', 'bad', 'awful', 'horrible', 'disappointing', 'disappointed',
            'overpriced', 'expensive', 'bitter', 'burnt', 'stale', 'waste', 'avoid',
            'never', 'regret', 'poor', 'lacking', 'mediocre', 'underwhelming'
        ];

        let positiveScore = 0;
        let negativeScore = 0;

        positiveKeywords.forEach(keyword => {
            if (lowerText.includes(keyword)) positiveScore++;
        });

        negativeKeywords.forEach(keyword => {
            if (lowerText.includes(keyword)) negativeScore++;
        });

        if (positiveScore > negativeScore) return 'positive';
        if (negativeScore > positiveScore) return 'negative';
        return 'neutral';
    }

    /**
     * GET /api/social-listening/keywords
     * Get tracked keywords with real-time metrics from Reddit
     */
    public async getTrackedKeywords(req: Request, res: Response): Promise<void> {
        try {
            const keywords: KeywordData[] = [];
            const limit = 25; // Posts per keyword to analyze

            // Check if Reddit is available
            if (!redditService.isClientAvailable()) {
                // Return mock data if Reddit not configured
                res.json({
                    success: true,
                    keywords: this.getMockKeywords(),
                    source: 'mock',
                    message: 'Using mock data - Reddit not configured'
                });
                return;
            }

            // Search Reddit for each keyword
            for (const keyword of this.COFFEE_KEYWORDS.slice(0, 6)) { // Limit to avoid rate limits
                try {
                    const searchResults = await redditService.searchPosts(keyword, {
                        limit,
                        sort: 'relevance',
                        time: 'week'
                    });

                    if (searchResults.success && searchResults.posts) {
                        const mentions = searchResults.posts.length;
                        let positiveCount = 0;
                        let negativeCount = 0;

                        searchResults.posts.forEach((post: any) => {
                            const sentiment = this.analyzeSentiment(post.title + ' ' + (post.selftext || ''));
                            if (sentiment === 'positive') positiveCount++;
                            if (sentiment === 'negative') negativeCount++;
                        });

                        const overallSentiment: 'positive' | 'negative' | 'neutral' =
                            positiveCount > negativeCount ? 'positive' :
                            negativeCount > positiveCount ? 'negative' : 'neutral';

                        keywords.push({
                            keyword,
                            mentions,
                            change: Math.floor(Math.random() * 40) - 10, // TODO: Calculate real change from historical data
                            sentiment: overallSentiment,
                            platforms: {
                                reddit: mentions,
                                twitter: 0,
                                instagram: 0
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error searching for keyword "${keyword}":`, error);
                }
            }

            res.json({
                success: true,
                keywords,
                source: 'reddit',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('Error in getTrackedKeywords:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch tracked keywords',
                keywords: this.getMockKeywords()
            });
        }
    }

    /**
     * GET /api/social-listening/mentions
     * Get recent mentions from social media
     */
    public async getRecentMentions(req: Request, res: Response): Promise<void> {
        try {
            const { keyword, limit = 20, platform, sentiment } = req.query;
            const mentions: Mention[] = [];

            if (!redditService.isClientAvailable()) {
                res.json({
                    success: true,
                    mentions: this.getMockMentions(),
                    source: 'mock'
                });
                return;
            }

            // Search across coffee subreddits
            const searchKeyword = (keyword as string) || 'coffee';

            for (const subreddit of this.COFFEE_SUBREDDITS.slice(0, 5)) {
                try {
                    const result = await redditService.getSubredditPosts(subreddit, {
                        limit: 5,
                        sort: 'new'
                    });

                    if (result.success && result.posts) {
                        result.posts.forEach((post: any) => {
                            const postText = (post.title + ' ' + (post.selftext || '')).toLowerCase();

                            // Filter by keyword if specified
                            if (searchKeyword && !postText.includes(searchKeyword.toLowerCase())) {
                                return;
                            }

                            const postSentiment = this.analyzeSentiment(post.title + ' ' + (post.selftext || ''));

                            // Filter by sentiment if specified
                            if (sentiment && postSentiment !== sentiment) {
                                return;
                            }

                            mentions.push({
                                id: post.id,
                                platform: 'reddit',
                                author: post.author,
                                content: post.title,
                                sentiment: postSentiment,
                                timestamp: this.getRelativeTime(post.created * 1000),
                                url: `https://reddit.com${post.permalink}`,
                                engagement: {
                                    score: post.score,
                                    comments: post.num_comments
                                }
                            });
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching from r/${subreddit}:`, error);
                }
            }

            // Sort by most recent and limit
            mentions.sort((a, b) => {
                const timeA = this.parseRelativeTime(a.timestamp);
                const timeB = this.parseRelativeTime(b.timestamp);
                return timeA - timeB;
            });

            res.json({
                success: true,
                mentions: mentions.slice(0, Number(limit)),
                total: mentions.length,
                source: 'reddit',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('Error in getRecentMentions:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch mentions',
                mentions: this.getMockMentions()
            });
        }
    }

    /**
     * GET /api/social-listening/trends
     * Get mention trends over time
     */
    public async getMentionTrends(req: Request, res: Response): Promise<void> {
        try {
            const { days = 7 } = req.query;

            if (!redditService.isClientAvailable()) {
                res.json({
                    success: true,
                    trends: this.getMockTrends(),
                    source: 'mock'
                });
                return;
            }

            // Aggregate data from multiple subreddits
            const engagementData = [];

            for (const subreddit of this.COFFEE_SUBREDDITS.slice(0, 3)) {
                try {
                    const result = await redditService.getSubredditEngagement(subreddit, {
                        limit: 100,
                        days: Number(days),
                        sort: 'new'
                    });

                    if (result.success && result.timeline) {
                        engagementData.push(result.timeline);
                    }
                } catch (error) {
                    console.error(`Error fetching engagement from r/${subreddit}:`, error);
                }
            }

            res.json({
                success: true,
                trends: engagementData.length > 0 ? engagementData[0] : this.getMockTrends(),
                source: engagementData.length > 0 ? 'reddit' : 'mock',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('Error in getMentionTrends:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch trends',
                trends: this.getMockTrends()
            });
        }
    }

    /**
     * GET /api/social-listening/alerts
     * Get generated alerts based on monitoring rules
     */
    public async getAlerts(req: Request, res: Response): Promise<void> {
        try {
            const alerts: Alert[] = [];

            if (!redditService.isClientAvailable()) {
                res.json({
                    success: true,
                    alerts: this.getMockAlerts(),
                    source: 'mock'
                });
                return;
            }

            // Analyze recent mentions for alert-worthy events
            const recentPosts = await redditService.searchPosts('coffee', {
                limit: 50,
                sort: 'new',
                time: 'day'
            });

            if (recentPosts.success && recentPosts.posts) {
                let negativeCount = 0;
                let positiveCount = 0;

                recentPosts.posts.forEach((post: any) => {
                    const sentiment = this.analyzeSentiment(post.title + ' ' + (post.selftext || ''));
                    if (sentiment === 'negative') negativeCount++;
                    if (sentiment === 'positive') positiveCount++;
                });

                // Generate alerts based on thresholds
                if (negativeCount > 10) {
                    alerts.push({
                        id: Date.now().toString(),
                        type: 'negative',
                        message: `High negative sentiment detected - ${negativeCount} negative mentions in the last 24 hours`,
                        severity: 'warning',
                        timestamp: new Date().toISOString()
                    });
                }

                if (recentPosts.posts.length > 100) {
                    alerts.push({
                        id: (Date.now() + 1).toString(),
                        type: 'spike',
                        message: `Unusual spike in mentions detected - ${recentPosts.posts.length} posts in the last 24 hours`,
                        severity: 'info',
                        timestamp: new Date().toISOString()
                    });
                }

                if (positiveCount > 20) {
                    alerts.push({
                        id: (Date.now() + 2).toString(),
                        type: 'positive',
                        message: `Positive sentiment trending - ${positiveCount} positive mentions today`,
                        severity: 'info',
                        timestamp: new Date().toISOString()
                    });
                }
            }

            res.json({
                success: true,
                alerts: alerts.length > 0 ? alerts : this.getMockAlerts(),
                source: alerts.length > 0 ? 'reddit' : 'mock',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('Error in getAlerts:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch alerts',
                alerts: this.getMockAlerts()
            });
        }
    }

    /**
     * GET /api/social-listening/competitors
     * Track competitor mentions and share of voice
     */
    public async getCompetitorAnalysis(req: Request, res: Response): Promise<void> {
        try {
            const competitorData = [];

            if (!redditService.isClientAvailable()) {
                res.json({
                    success: true,
                    competitors: this.getMockCompetitors(),
                    source: 'mock'
                });
                return;
            }

            for (const competitor of this.COMPETITOR_KEYWORDS.slice(0, 4)) {
                try {
                    const result = await redditService.searchPosts(competitor, {
                        limit: 20,
                        sort: 'relevance',
                        time: 'week'
                    });

                    if (result.success && result.posts) {
                        let positiveCount = 0;
                        let negativeCount = 0;

                        result.posts.forEach((post: any) => {
                            const sentiment = this.analyzeSentiment(post.title + ' ' + (post.selftext || ''));
                            if (sentiment === 'positive') positiveCount++;
                            if (sentiment === 'negative') negativeCount++;
                        });

                        competitorData.push({
                            name: competitor,
                            mentions: result.posts.length,
                            sentiment: {
                                positive: positiveCount,
                                negative: negativeCount,
                                neutral: result.posts.length - positiveCount - negativeCount
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error analyzing competitor "${competitor}":`, error);
                }
            }

            res.json({
                success: true,
                competitors: competitorData.length > 0 ? competitorData : this.getMockCompetitors(),
                source: competitorData.length > 0 ? 'reddit' : 'mock',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('Error in getCompetitorAnalysis:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch competitor analysis',
                competitors: this.getMockCompetitors()
            });
        }
    }

    // Helper methods
    private getRelativeTime(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    private parseRelativeTime(relativeTime: string): number {
        const match = relativeTime.match(/(\d+)\s+(hour|day|minute)/);
        if (!match) return 0;
        const value = parseInt(match[1]);
        const unit = match[2];
        if (unit === 'day') return value * 24;
        if (unit === 'hour') return value;
        return 0;
    }

    // Mock data methods
    private getMockKeywords(): KeywordData[] {
        return [
            { keyword: "Ettara", mentions: 234, change: 23, sentiment: "positive", platforms: { reddit: 234, twitter: 0, instagram: 0 } },
            { keyword: "#Ettara", mentions: 156, change: 12, sentiment: "positive", platforms: { reddit: 156, twitter: 0, instagram: 0 } },
            { keyword: "specialty coffee", mentions: 543, change: -5, sentiment: "neutral", platforms: { reddit: 543, twitter: 0, instagram: 0 } },
            { keyword: "cold brew", mentions: 321, change: 18, sentiment: "positive", platforms: { reddit: 321, twitter: 0, instagram: 0 } },
        ];
    }

    private getMockMentions(): Mention[] {
        return [
            {
                id: '1',
                platform: 'reddit',
                author: 'coffee_enthusiast',
                content: 'Just discovered this amazing coffee blend at Ettara! The single origin Ethiopian is absolutely incredible.',
                sentiment: 'positive',
                timestamp: '2 hours ago',
                engagement: { score: 45, comments: 12 }
            },
            {
                id: '2',
                platform: 'reddit',
                author: 'barista_pro',
                content: 'Been comparing specialty coffee roasters. The attention to detail in pour over preparation is what sets great cafes apart.',
                sentiment: 'positive',
                timestamp: '4 hours ago',
                engagement: { score: 32, comments: 8 }
            },
            {
                id: '3',
                platform: 'reddit',
                author: 'coffee_critic',
                content: 'Tried the cold brew today. Not bad, but I expected more depth of flavor for the price point.',
                sentiment: 'neutral',
                timestamp: '6 hours ago',
                engagement: { score: 15, comments: 5 }
            }
        ];
    }

    private getMockTrends() {
        return [
            { name: "Mon", mentions: 120, positive: 80, negative: 20, neutral: 20 },
            { name: "Tue", mentions: 180, positive: 120, negative: 30, neutral: 30 },
            { name: "Wed", mentions: 250, positive: 150, negative: 50, neutral: 50 },
            { name: "Thu", mentions: 320, positive: 200, negative: 60, neutral: 60 },
            { name: "Fri", mentions: 280, positive: 180, negative: 50, neutral: 50 },
            { name: "Sat", mentions: 150, positive: 100, negative: 25, neutral: 25 },
            { name: "Sun", mentions: 100, positive: 70, negative: 15, neutral: 15 },
        ];
    }

    private getMockAlerts(): Alert[] {
        return [
            {
                id: '1',
                type: 'spike',
                message: 'Unusual spike in mentions detected - 150% increase in the last hour',
                severity: 'warning',
                timestamp: '30 min ago'
            },
            {
                id: '2',
                type: 'positive',
                message: 'Positive sentiment trending for "specialty coffee" - great engagement!',
                severity: 'info',
                timestamp: '2 hours ago'
            }
        ];
    }

    private getMockCompetitors() {
        return [
            { name: 'Starbucks', mentions: 456, sentiment: { positive: 200, negative: 100, neutral: 156 } },
            { name: 'Blue Tokai', mentions: 234, sentiment: { positive: 150, negative: 40, neutral: 44 } },
            { name: 'Third Wave Coffee', mentions: 189, sentiment: { positive: 120, negative: 30, neutral: 39 } },
        ];
    }
}

export default new SocialListeningController();
