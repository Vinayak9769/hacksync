import { Request, Response } from "express";
import facebookService from "../services/facebookService";
import twitterService from "../services/twitterService";
import { Session } from "express-session";

interface PostRequest {
    platform: string;
    content: {
        caption?: string;
        mediaUrl?: string;
        message?: string;
    };
    pageId?: string;
}

interface RequestWithSession extends Request {
    session: Session & {
        twitterAccessToken?: string;
        twitterRefreshToken?: string;
        twitterUsername?: string;
    };
}

class SocialMediaController {
    /**
     * Handle posting to social media platforms
     */
    createPost = async (
        req: RequestWithSession,
        res: Response,
    ): Promise<void> => {
        try {
            const { platform, content, pageId }: PostRequest = req.body;

            if (!platform) {
                res.status(400).json({
                    success: false,
                    error: "Platform is required",
                });
                return;
            }

            if (!content) {
                res.status(400).json({
                    success: false,
                    error: "Content is required",
                });
                return;
            }

            let result;

            switch (platform.toLowerCase()) {
                case "facebook":
                    result = await this.handleFacebookPost(content, pageId);
                    break;

                case "twitter":
                    result = await this.handleTwitterPost(req, content);
                    break;

                // Add more platforms here in the future
                case "instagram":
                case "linkedin":
                    res.status(501).json({
                        success: false,
                        error: `${platform} integration coming soon`,
                    });
                    return;

                default:
                    res.status(400).json({
                        success: false,
                        error: `Unsupported platform: ${platform}`,
                    });
                    return;
            }

            res.status(200).json({
                success: true,
                platform,
                data: result,
                message: `Successfully posted to ${platform}`,
            });
        } catch (error: any) {
            console.error("Error in createPost:", error);
            res.status(500).json({
                success: false,
                error: error.message || "Failed to create post",
            });
        }
    };

    /**
     * Handle Facebook-specific posting logic
     */
    private async handleFacebookPost(
        content: { caption?: string; mediaUrl?: string; message?: string },
        pageId?: string,
    ) {
        // If media URL is provided, post as photo
        if (content.mediaUrl) {
            return await facebookService.postPhoto({
                url: content.mediaUrl,
                caption: content.caption || content.message,
                pageId,
            });
        }

        // Otherwise post as text status
        if (content.message || content.caption) {
            return await facebookService.postText(
                content.message || content.caption || "",
                pageId,
            );
        }

        throw new Error("Either mediaUrl or message/caption is required");
    }

    /**
     * Handle Twitter-specific posting logic
     */
    private async handleTwitterPost(
        req: RequestWithSession,
        content: { caption?: string; mediaUrl?: string; message?: string },
    ) {
        const accessToken = req.session.twitterAccessToken;

        if (!accessToken) {
            throw new Error(
                "Not authenticated with Twitter. Please connect your Twitter account first.",
            );
        }

        const text = content.caption || content.message || "";

        if (!text || text.trim().length === 0) {
            throw new Error("Tweet text is required");
        }

        if (text.length > 280) {
            throw new Error("Tweet exceeds 280 character limit");
        }

        // Post the tweet (without media for now via this endpoint)
        const result = await twitterService.postTweet(accessToken, text, []);

        if (!result.success) {
            throw new Error(result.error || "Failed to post tweet");
        }

        return result;
    }

    /**
     * Validate Facebook access token
     */
    validateFacebookToken = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const isValid = await facebookService.validateAccessToken();

            res.status(200).json({
                success: true,
                valid: isValid,
                message: isValid
                    ? "Facebook token is valid"
                    : "Facebook token is invalid or expired",
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "Failed to validate token",
            });
        }
    };

    /**
     * Get Facebook page information
     */
    getFacebookPageInfo = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const { pageId } = req.query;
            const pageInfo = await facebookService.getPageInfo(
                pageId as string,
            );

            res.status(200).json({
                success: true,
                data: pageInfo,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "Failed to fetch page information",
            });
        }
    };

    /**
     * Health check for social media integrations
     */
    healthCheck = async (
        req: RequestWithSession,
        res: Response,
    ): Promise<void> => {
        const facebookConfigured = !!(
            process.env.FACEBOOK_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID
        );

        const twitterConnected = !!req.session.twitterAccessToken;

        res.status(200).json({
            success: true,
            integrations: {
                facebook: {
                    configured: facebookConfigured,
                    status: facebookConfigured ? "ready" : "not configured",
                },
                instagram: {
                    configured: false,
                    status: "coming soon",
                },
                twitter: {
                    configured: twitterConnected,
                    status: twitterConnected ? "ready" : "not configured",
                },
                linkedin: {
                    configured: false,
                    status: "coming soon",
                },
            },
        });
    };
}

export default new SocialMediaController();
