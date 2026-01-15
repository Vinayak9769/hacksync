import { Request, Response } from "express";
import { Session } from "express-session";
import twitterService from "../services/twitterService";

// Extend Request to include session with our custom properties
interface RequestWithSession extends Request {
    session: Session & {
        twitterCodeVerifier?: string;
        twitterState?: string;
        twitterAccessToken?: string;
        twitterRefreshToken?: string;
        twitterUsername?: string;
    };
}

class TwitterController {
    // Step 1: Initiate OAuth flow - now redirects directly instead of returning JSON
    async initiateAuth(req: RequestWithSession, res: Response): Promise<void> {
        try {
            const { url, codeVerifier, state } =
                await twitterService.generateAuthUrl();

            // Store codeVerifier and state in session
            req.session.twitterCodeVerifier = codeVerifier;
            req.session.twitterState = state;

            // Save the session before redirecting
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                    res.status(500).send("Failed to initialize authentication");
                    return;
                }

                console.log("=== TWITTER AUTH INITIATED ===");
                console.log("Session ID:", req.sessionID);
                console.log("Stored state:", state);
                console.log(
                    "Stored codeVerifier:",
                    codeVerifier?.substring(0, 10) + "...",
                );
                console.log("Auth URL:", url);
                console.log("Session saved, redirecting to Twitter...");

                // Redirect directly to Twitter OAuth page
                res.redirect(url);
            });
        } catch (error: any) {
            console.error("Error initiating auth:", error);
            res.status(500).send(`Authentication error: ${error.message}`);
        }
    }

    // Step 2: Handle OAuth callback
    async handleCallback(
        req: RequestWithSession,
        res: Response,
    ): Promise<void> {
        try {
            const { code, state } = req.query;
            const { twitterCodeVerifier, twitterState } = req.session;

            console.log("=== TWITTER CALLBACK RECEIVED ===");
            console.log("Session ID:", req.sessionID);
            console.log("Received state:", state);
            console.log("Session state:", twitterState);
            console.log("Received code:", code ? "present" : "missing");
            console.log(
                "Session codeVerifier:",
                twitterCodeVerifier ? "present" : "missing",
            );
            console.log("Session keys:", Object.keys(req.session));

            // Verify state to prevent CSRF
            if (state !== twitterState) {
                console.error("STATE MISMATCH!");
                console.error("Expected:", twitterState);
                console.error("Received:", state);
                res.status(400).send("State mismatch. Possible CSRF attack.");
                return;
            }

            // Exchange code for tokens
            const tokens = await twitterService.getAccessToken(
                code as string,
                twitterCodeVerifier as string,
            );

            // Store tokens in session (in production, store in database)
            req.session.twitterAccessToken = tokens.accessToken;
            req.session.twitterRefreshToken = tokens.refreshToken;

            // Get user info
            const userInfo = await twitterService.getUserInfo(
                tokens.accessToken,
            );
            req.session.twitterUsername = userInfo.username;

            // Clean up
            delete req.session.twitterCodeVerifier;
            delete req.session.twitterState;

            // Redirect to frontend success page
            res.redirect(
                `${process.env.FRONTEND_URL}/twitter-connected?username=${userInfo.username}`,
            );
        } catch (error: any) {
            console.error("Error in callback:", error);
            res.redirect(
                `${process.env.FRONTEND_URL}/twitter-error?error=${encodeURIComponent(error.message)}`,
            );
        }
    }

    // Post tweet
    async postTweet(req: RequestWithSession, res: Response): Promise<void> {
        try {
            const { text } = req.body;
            const accessToken = req.session.twitterAccessToken;

            if (!accessToken) {
                res.status(401).json({
                    success: false,
                    error: "Not authenticated. Please connect your Twitter account first.",
                });
                return;
            }

            if (!text || text.trim().length === 0) {
                res.status(400).json({
                    success: false,
                    error: "Tweet text is required",
                });
                return;
            }

            if (text.length > 280) {
                res.status(400).json({
                    success: false,
                    error: "Tweet exceeds 280 character limit",
                });
                return;
            }

            let mediaIds: string[] = [];

            // Handle media uploads
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                for (const file of req.files) {
                    try {
                        const mediaId = await twitterService.uploadMedia(
                            accessToken,
                            file.buffer,
                            file.mimetype,
                        );
                        mediaIds.push(mediaId);
                    } catch (error: any) {
                        console.error("Media upload failed:", error);
                        res.status(500).json({
                            success: false,
                            error: `Media upload failed: ${error.message}`,
                        });
                        return;
                    }
                }
            }

            // Post the tweet
            const result = await twitterService.postTweet(
                accessToken,
                text,
                mediaIds,
            );
            res.status(result.success ? 200 : 500).json(result);
        } catch (error: any) {
            console.error("Error posting tweet:", error);
            res.status(500).json({
                success: false,
                error: "Internal server error",
                message: error.message,
            });
        }
    }

    // Check connection status
    async checkConnection(
        req: RequestWithSession,
        res: Response,
    ): Promise<void> {
        try {
            const accessToken = req.session.twitterAccessToken;
            const username = req.session.twitterUsername;

            if (!accessToken) {
                res.json({
                    connected: false,
                });
                return;
            }

            res.json({
                connected: true,
                username: username,
                platform: "Twitter/X",
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    // Disconnect
    async disconnect(req: RequestWithSession, res: Response): Promise<void> {
        delete req.session.twitterAccessToken;
        delete req.session.twitterRefreshToken;
        delete req.session.twitterUsername;

        res.json({
            success: true,
            message: "Disconnected from Twitter",
        });
    }
}

export default new TwitterController();
