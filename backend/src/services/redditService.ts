import Snoowrap from 'snoowrap';
import { createRedditClient } from '../config/reddit';

interface PostData {
    title: string;
    text?: string;
    url?: string;
}

// Convert Reddit timestamps to ISO safely to avoid Invalid Date errors
const toIsoDate = (value?: number | string): string => {
    if (typeof value === 'string') {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            value = parsed;
        }
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        const ms = value > 1e12 ? value : value * 1000;
        const date = new Date(ms);
        if (!Number.isNaN(date.getTime())) {
            return date.toISOString();
        }
    }

    return new Date().toISOString();
};

class RedditService {
    private client: Snoowrap | null;

    constructor() {
        this.client = createRedditClient();
    }

    /**
     * Check if Reddit client is available
     */
    public isClientAvailable(): boolean {
        return this.client !== null;
    }

    /**
     * Test Reddit authentication by fetching user info
     */
    public testAuthentication(): Promise<any> {
        if (!this.client) {
            throw new Error('Reddit client not initialized. Please check your credentials.');
        }

        try {
            // Try to get the authenticated user's info
            return this.client.getMe().then((me: any) => {
                return {
                    success: true,
                    authenticated: true,
                    username: me.name,
                    linkKarma: me.link_karma,
                    commentKarma: me.comment_karma,
                    accountCreated: toIsoDate(me.created_utc)
                };
            }).catch((error: any) => {
                console.error('❌ Authentication test failed:', {
                    message: error.message,
                    statusCode: error.statusCode,
                    response: error.response?.body || error.response
                });
                return {
                    success: false,
                    authenticated: false,
                    error: error.message,
                    statusCode: error.statusCode,
                    details: error.response?.body || null
                };
            });
        } catch (error: any) {
            console.error('❌ Authentication error:', error);
            return Promise.resolve({
                success: false,
                authenticated: false,
                error: error.message
            });
        }
    }

    /**
     * Submit a text post to a subreddit
     */
    public submitTextPost(subredditName: string, postData: PostData): Promise<any> {
        if (!this.client) {
            throw new Error('Reddit client not initialized. Please check your credentials.');
        }

        try {
            if (!postData.title) {
                throw new Error('Post title is required');
            }

            console.log(`📤 Submitting text post to r/${subredditName}:`, postData.title);

            return this.client.submitSelfpost({
                subredditName: subredditName,
                title: postData.title,
                text: postData.text || ''
            }).then((submission: any) => {
                console.log(`✅ Post submitted successfully: ${submission.id}`);
                return {
                    success: true,
                    postId: submission.id,
                    postUrl: `https://reddit.com${submission.permalink}`,
                    data: {
                        id: submission.id,
                        title: submission.title,
                        url: submission.url,
                        permalink: submission.permalink,
                        author: submission.author?.name || 'unknown',
                        created: toIsoDate(submission.created_utc)
                    }
                };
            }).catch((error: any) => {
                console.error('❌ Reddit API Error:', {
                    message: error.message,
                    statusCode: error.statusCode,
                    response: error.response?.body || error.response,
                    fullError: error
                });
                const errorMsg = error.response?.body?.message || error.response?.body || error.message || 'Unknown error';
                throw new Error(`Failed to submit post: ${error.statusCode || 'Error'} - ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
            });
        } catch (error: any) {
            console.error('Error submitting post to Reddit:', error);
            throw new Error(`Failed to submit post: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Submit a link post to a subreddit
     */
    public submitLinkPost(subredditName: string, postData: PostData): Promise<any> {
        if (!this.client) {
            throw new Error('Reddit client not initialized. Please check your credentials.');
        }

        try {
            if (!postData.title || !postData.url) {
                throw new Error('Post title and URL are required for link posts');
            }

            return this.client.submitLink({
                subredditName: subredditName,
                title: postData.title,
                url: postData.url
            }).then((submission: any) => {
                return {
                    success: true,
                    postId: submission.id,
                    postUrl: `https://reddit.com${submission.permalink}`,
                    data: {
                        id: submission.id,
                        title: submission.title,
                        url: submission.url,
                        permalink: submission.permalink,
                        author: submission.author?.name || 'unknown',
                        created: toIsoDate(submission.created_utc)
                    }
                };
            }).catch((error: any) => {
                console.error('Error submitting link to Reddit:', error);
                throw new Error(`Failed to submit link: ${error.message}`);
            });
        } catch (error: any) {
            console.error('Error submitting link to Reddit:', error);
            throw new Error(`Failed to submit link: ${error.message}`);
        }
    }

    /**
     * Get posts from a subreddit (hot posts by default)
     */
    public async getSubredditPosts(
        subredditName: string, 
        options: { limit?: number; sort?: 'hot' | 'new' | 'top' | 'rising' } = {}
    ): Promise<any> {
        if (!this.client) {
            throw new Error('Reddit client not initialized. Please check your credentials.');
        }

        try {
            const subreddit = this.client.getSubreddit(subredditName);
            const { limit = 25, sort = 'hot' } = options;

            let posts;
            switch (sort) {
                case 'new':
                    posts = await subreddit.getNew({ limit });
                    break;
                case 'top':
                    posts = await subreddit.getTop({ limit, time: 'day' });
                    break;
                case 'rising':
                    posts = await subreddit.getRising({ limit });
                    break;
                case 'hot':
                default:
                    posts = await subreddit.getHot({ limit });
                    break;
            }

            const formattedPosts = posts.map((post: any) => ({
                id: post.id,
                title: post.title,
                author: post.author.name,
                subreddit: post.subreddit.display_name,
                score: post.score,
                upvoteRatio: post.upvote_ratio,
                numComments: post.num_comments,
                url: post.url,
                permalink: `https://reddit.com${post.permalink}`,
                created: toIsoDate(post.created_utc),
                selftext: post.selftext || '',
                isVideo: post.is_video,
                thumbnail: post.thumbnail
            }));

            return {
                success: true,
                subreddit: subredditName,
                count: formattedPosts.length,
                sort,
                posts: formattedPosts
            };
        } catch (error: any) {
            console.error('Error fetching posts from Reddit:', error);
            throw new Error(`Failed to fetch posts: ${error.message}`);
        }
    }

    /**
     * Get comments from a specific post
     */getPostComments(postId: string, options: { limit?: number } = {}): Promise<any> {
        if (!this.client) {
            throw new Error('Reddit client not initialized. Please check your credentials.');
        }

        try {
            const submission = this.client.getSubmission(postId);
            const { limit = 50 } = options;

            // Expand comment replies
            return submission.expandReplies({ limit, depth: 2 }).then((expandedSubmission: any) => {
                const comments = expandedSubmission.comments;

                const formattedComments = comments.map((comment: any) => ({
                    id: comment.id,
                    author: comment.author?.name || '[deleted]',
                    body: comment.body,
                    score: comment.score,
                    created: toIsoDate(comment.created_utc),
                    permalink: `https://reddit.com${comment.permalink}`,
                    parentId: comment.parent_id,
                    depth: comment.depth
                }));

                return {
                    success: true,
                    postId,
                    count: formattedComments.length,
                    comments: formattedComments
                };
            }).catch((error: any) => {
                console.error('Error fetching comments from Reddit:', error);
                throw new Error(`Failed to fetch comments: ${error.message}`);
            });
        } catch (error: any) {
            console.error('Error fetching comments from Reddit:', error);
            throw new Error(`Failed to fetch comments: ${error.message}`);
        }
    }
}

export default new RedditService();
