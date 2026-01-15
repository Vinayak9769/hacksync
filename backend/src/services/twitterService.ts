import { TwitterApi } from "twitter-api-v2";

interface TwitterTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}

class TwitterService {
    private clientId: string;
    private clientSecret: string;
    private callbackUrl: string;

    constructor() {
        this.clientId = process.env.TWITTER_CLIENT_ID!;
        this.clientSecret = process.env.TWITTER_CLIENT_SECRET!;
        this.callbackUrl =
            process.env.TWITTER_CALLBACK_URL ||
            "http://localhost:3000/api/twitter/callback";
    }

    // Generate OAuth 2.0 authorization URL
    async generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }> {
        const client = new TwitterApi({
            clientId: this.clientId,
            clientSecret: this.clientSecret,
        });

        const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
            this.callbackUrl,
            {
                scope: [
                    "tweet.read",
                    "tweet.write",
                    "users.read",
                    "offline.access",
                ],
            },
        );

        return { url, codeVerifier, state };
    }

    // Exchange authorization code for access token
    async getAccessToken(
        code: string,
        codeVerifier: string,
    ): Promise<TwitterTokens> {
        const client = new TwitterApi({
            clientId: this.clientId,
            clientSecret: this.clientSecret,
        });

        const { accessToken, refreshToken, expiresIn } =
            await client.loginWithOAuth2({
                code,
                codeVerifier,
                redirectUri: this.callbackUrl,
            });

        return {
            accessToken,
            refreshToken,
            expiresIn,
        };
    }

    // Create client with user's access token
    getClientForUser(accessToken: string): TwitterApi {
        return new TwitterApi(accessToken);
    }

    // Post tweet on behalf of user
    async postTweet(
        accessToken: string,
        text: string,
        mediaIds?: string[],
    ): Promise<any> {
        try {
            const client = this.getClientForUser(accessToken);

            const tweetOptions: any = {
                text: text,
            };

            if (mediaIds && mediaIds.length > 0) {
                tweetOptions.media = {
                    media_ids: mediaIds,
                };
            }

            const tweet = await client.v2.tweet(tweetOptions);

            return {
                success: true,
                data: tweet.data,
                message: "Tweet posted successfully!",
            };
        } catch (error: any) {
            console.error("Twitter API Error:", error);
            return {
                success: false,
                error: error.message || "Failed to post tweet",
                details: error.data || error,
            };
        }
    }

    // Upload media
    async uploadMedia(
        accessToken: string,
        buffer: Buffer,
        mimeType: string,
    ): Promise<string> {
        try {
            const client = this.getClientForUser(accessToken);
            const mediaId = await client.v1.uploadMedia(buffer, {
                mimeType: mimeType as any,
            });
            return mediaId;
        } catch (error: any) {
            console.error("Media upload error:", error);
            throw new Error(`Failed to upload media: ${error.message}`);
        }
    }

    // Get user info
    async getUserInfo(accessToken: string): Promise<any> {
        try {
            const client = this.getClientForUser(accessToken);
            const user = await client.v2.me();
            return user.data;
        } catch (error: any) {
            console.error("Error fetching user info:", error);
            throw error;
        }
    }
}

export default new TwitterService();
