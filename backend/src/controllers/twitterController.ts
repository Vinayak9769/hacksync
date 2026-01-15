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

// In-memory store as fallback for OAuth state
// This solves the session cookie not persisting issue during Twitter redirects
interface OAuthStateData {
    codeVerifier: string;
    timestamp: number;
}

const oauthStateStore = new Map<string, OAuthStateData>();

// Clean up old states (older than 10 minutes)
setInterval(
    () => {
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        for (const [state, data] of oauthStateStore.entries()) {
            if (data.timestamp < tenMinutesAgo) {
                oauthStateStore.delete(state);
            }
        }
    },
    5 * 60 * 1000,
); // Clean every 5 minutes

class TwitterController {
    constructor() {
        console.log("=== TWITTER CONTROLLER INITIALIZED ===");
        console.log("FRONTEND_URL from env:", process.env.FRONTEND_URL);
        console.log(
            "TWITTER_CALLBACK_URL from env:",
            process.env.TWITTER_CALLBACK_URL,
        );
    }

    // Step 1: Initiate OAuth flow - now redirects directly instead of returning JSON
    async initiateAuth(req: RequestWithSession, res: Response): Promise<void> {
        try {
            const { url, codeVerifier, state } =
                await twitterService.generateAuthUrl();

            // Store in BOTH session AND in-memory store for redundancy
            req.session.twitterCodeVerifier = codeVerifier;
            req.session.twitterState = state;

            // Store in memory as backup (solves cookie persistence issues)
            oauthStateStore.set(state, {
                codeVerifier,
                timestamp: Date.now(),
            });

            console.log("=== TWITTER AUTH INITIATED ===");
            console.log("Session ID:", req.sessionID);
            console.log("State:", state);
            console.log(
                "CodeVerifier:",
                codeVerifier?.substring(0, 10) + "...",
            );
            console.log("Stored in both session and memory");
            console.log("Auth URL:", url);

            // Save the session before redirecting
            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error("Session save error:", saveErr);
                    // Continue anyway since we have in-memory backup
                }

                console.log("Redirecting to Twitter...\n");
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

            console.log("\n=== TWITTER CALLBACK RECEIVED ===");
            console.log("Session ID:", req.sessionID);
            console.log("Received state:", state);
            console.log("Received code:", code ? "present" : "missing");
            console.log("Session keys:", Object.keys(req.session));

            if (!code || !state) {
                console.error("\n❌ Missing code or state from Twitter!");
                res.redirect(
                    `${process.env.FRONTEND_URL}/twitter-error?error=missing_params`,
                );
                return;
            }

            // Try to get codeVerifier from session first, then from memory store
            let codeVerifier = req.session.twitterCodeVerifier;
            const stateFromSession = req.session.twitterState;

            console.log(
                "Session codeVerifier:",
                codeVerifier ? "present" : "missing",
            );
            console.log(
                "Session state:",
                stateFromSession ? "present" : "missing",
            );

            // If session data is missing, try in-memory store
            if (!codeVerifier) {
                console.log(
                    "⚠️  Session data not found, checking in-memory store...",
                );
                const storedData = oauthStateStore.get(state as string);

                if (storedData) {
                    console.log("✅ Found data in memory store!");
                    codeVerifier = storedData.codeVerifier;
                    // Clean up
                    oauthStateStore.delete(state as string);
                } else {
                    console.error("❌ Data not found in memory store either!");
                    console.error(
                        "Available states in store:",
                        Array.from(oauthStateStore.keys()),
                    );
                    res.redirect(
                        `${process.env.FRONTEND_URL}/twitter-error?error=session_expired`,
                    );
                    return;
                }
            } else {
                console.log("✅ Using session data");
                // Clean up memory store if it exists
                oauthStateStore.delete(state as string);
            }

            // Verify state if it was in session
            if (stateFromSession && state !== stateFromSession) {
                console.error("\n❌ STATE MISMATCH!");
                console.error("Expected:", stateFromSession);
                console.error("Received:", state);
                res.status(400).send("State mismatch. Possible CSRF attack.");
                return;
            }

            // Exchange code for tokens
            console.log("Exchanging code for tokens...");
            const tokens = await twitterService.getAccessToken(
                code as string,
                codeVerifier,
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

            console.log("=== BEFORE REDIRECT - SAVING SESSION ===");
            console.log("Session ID:", req.sessionID);
            console.log(
                "Access Token:",
                tokens.accessToken ? "SET" : "NOT SET",
            );
            console.log("Username:", userInfo.username);
            console.log("Session data:", {
                hasAccessToken: !!req.session.twitterAccessToken,
                hasRefreshToken: !!req.session.twitterRefreshToken,
                username: req.session.twitterUsername,
            });

            // Save session explicitly before redirect
            req.session.save((err) => {
                if (err) {
                    console.error("=== SESSION SAVE ERROR ===", err);
                    res.redirect(
                        `${process.env.FRONTEND_URL}/twitter-error?error=session_save_failed`,
                    );
                    return;
                }

                console.log("=== SESSION SAVED SUCCESSFULLY ===");
                console.log("FRONTEND_URL env var:", process.env.FRONTEND_URL);
                const redirectUrl = `${process.env.FRONTEND_URL}/twitter-connected?username=${userInfo.username}`;
                console.log("Redirecting to:", redirectUrl);
                console.log("Cookie header:", res.getHeader("set-cookie"));

                // Redirect to frontend success page
                res.redirect(redirectUrl);
            });
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
            console.log("\n=== CHECKING TWITTER CONNECTION ===");
            console.log("Session ID:", req.sessionID);
            console.log("Session keys:", Object.keys(req.session));
            console.log("Session cookie:", req.headers.cookie);
            console.log(
                "Full session data:",
                JSON.stringify(req.session, null, 2),
            );
            console.log("Has access token:", !!req.session.twitterAccessToken);
            console.log("Username:", req.session.twitterUsername);
            console.log("Request origin:", req.headers.origin);
            console.log("Request referer:", req.headers.referer);

            const accessToken = req.session.twitterAccessToken;
            const username = req.session.twitterUsername;

            if (!accessToken) {
                console.log(
                    "❌ No access token found - returning not connected",
                );
                console.log("Session appears empty or not persisted\n");
                res.json({
                    connected: false,
                });
                return;
            }

            console.log("✅ Access token found - returning connected");
            console.log(`User: ${username}\n`);
            res.json({
                connected: true,
                username: username,
                platform: "Twitter/X",
            });
        } catch (error: any) {
            console.error("Error checking connection:", error);
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

    // Debug endpoint to inspect session
    async debugSession(req: RequestWithSession, res: Response): Promise<void> {
        console.log("\n=== DEBUG SESSION ENDPOINT ===");
        console.log("Session ID:", req.sessionID);
        console.log("Session cookie from header:", req.headers.cookie);
        console.log("Session keys:", Object.keys(req.session));
        console.log("Full session:", JSON.stringify(req.session, null, 2));

        res.json({
            sessionId: req.sessionID,
            hasCookie: !!req.headers.cookie,
            cookie: req.headers.cookie,
            sessionKeys: Object.keys(req.session),
            twitterData: {
                hasAccessToken: !!req.session.twitterAccessToken,
                hasRefreshToken: !!req.session.twitterRefreshToken,
                username: req.session.twitterUsername,
            },
            headers: {
                origin: req.headers.origin,
                referer: req.headers.referer,
                userAgent: req.headers["user-agent"],
            },
        });
    }

    // Test endpoint to manually set Twitter session (for debugging only)
    async setTestSession(
        req: RequestWithSession,
        res: Response,
    ): Promise<void> {
        console.log("\n=== SETTING TEST SESSION ===");

        // Set dummy data
        req.session.twitterAccessToken = "test_access_token_" + Date.now();
        req.session.twitterRefreshToken = "test_refresh_token_" + Date.now();
        req.session.twitterUsername = "TestUser";

        req.session.save((err) => {
            if (err) {
                console.error("Error saving test session:", err);
                res.status(500).json({
                    success: false,
                    error: "Failed to save test session",
                });
                return;
            }

            console.log("Test session saved successfully");
            console.log("Session ID:", req.sessionID);
            console.log("Cookie:", res.getHeader("set-cookie"));

            res.json({
                success: true,
                message: "Test session set successfully",
                sessionId: req.sessionID,
                data: {
                    hasAccessToken: !!req.session.twitterAccessToken,
                    hasRefreshToken: !!req.session.twitterRefreshToken,
                    username: req.session.twitterUsername,
                },
            });
        });
    }
}

export default new TwitterController();
