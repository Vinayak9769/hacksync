
import { Express, Router } from 'express';
import conversationController from '../controllers/conversationController';
import conversationalAIController from '../controllers/conversationalAIController';
import redditController from '../controllers/redditController';
import socialMediaController from '../controllers/socialMediaController';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and videos
        if (
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed"));
        }
    },
});
const router = Router();

// Health check
router.get("/health", conversationalAIController.healthCheck);

// Twitter OAuth endpoints
router.get("/twitter/auth", twitterController.initiateAuth);
router.get("/twitter/callback", twitterController.handleCallback);
router.get("/twitter/status", twitterController.checkConnection);
router.post("/twitter/disconnect", twitterController.disconnect);
router.post(
    "/twitter/post",
    upload.array("media", 4),
    twitterController.postTweet,
);

// Social Media Integration endpoints
router.post("/social/post", socialMediaController.createPost);
router.get(
    "/social/facebook/validate",
    socialMediaController.validateFacebookToken,
);
router.get(
    "/social/facebook/page-info",
    socialMediaController.getFacebookPageInfo,
);
router.get("/social/health", socialMediaController.healthCheck);

// NEW: Conversational AI endpoints (Deepgram + Gemini)
router.post(
    "/webhook/conversational",
    conversationalAIController.handleIncomingCall,
);
router.post("/make-call", conversationalAIController.makeCall);

// Reddit API endpoints
router.get('/reddit/health', redditController.healthCheck);
router.get('/reddit/test-auth', redditController.testAuth);
router.post('/reddit/post', redditController.submitPost);
router.get('/reddit/posts/:subreddit', redditController.getSubredditPosts);
router.get('/reddit/comments/:postId', redditController.getPostComments);

// Legacy: Twilio webhook endpoints for voice calls (TwiML-based)
router.post("/webhook/voice", conversationController.handleIncomingCall);
router.post("/webhook/voice/gather", conversationController.handleGather);

// Legacy: Twilio webhook endpoints for outbound sales pitch
router.post("/webhook/sales-pitch", conversationController.handleSalesPitch);
router.post(
    "/webhook/pitch/response",
    conversationController.handlePitchResponse,
);
router.post("/webhook/pitch/demo", conversationController.handleDemoRequest);

export const setRoutes = (app: Express): void => {
    // Session middleware
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
            resave: false,
            saveUninitialized: true, // Changed to true to ensure session is created
            cookie: {
                secure: false, // Set to false to work with both HTTP and HTTPS during development
                httpOnly: true,
                sameSite: "lax", // Allow cookie to be sent on redirects from Twitter
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            },
            proxy: true, // Trust the reverse proxy (ngrok)
        }),
    );

    app.use("/api", router);

    // Root endpoint
    app.get("/", (req, res) => {
        res.json({            message: 'SocialNest API - Conversational AI & Social Media Platform',
            features: {
                conversational_ai: "Real-time AI Conversation",
                social_media:
                    "Multi-platform posting (Facebook, Instagram, Twitter, LinkedIn)",
            },
            tech_stack: {
                speech_to_text: 'Deepgram',
                ai_model: 'Google Gemini',
                voice_platform: 'Twilio Media Streams',
                social_media: 'Reddit Integration',
                social_platforms: 'Facebook Graph API (+ more coming)'
            },
            endpoints: {
                health: 'GET /api/health',
                social_health: 'GET /api/social/health',
                create_post: 'POST /api/social/post',
                validate_facebook: 'GET /api/social/facebook/validate',
                facebook_page_info: 'GET /api/social/facebook/page-info',
                makeCall: 'POST /api/make-call { "to": "+1234567890" }',
                conversationalWebhook: 'POST /api/webhook/conversational (for Twilio)',
                mediaStream: 'WS /media-stream (WebSocket for audio)',
                redditHealth: 'GET /api/reddit/health',
                submitPost: 'POST /api/reddit/post { "subreddit": "test", "title": "...", "text": "...", "type": "text" }',
                getPosts: 'GET /api/reddit/posts/:subreddit?limit=25&sort=hot',
                getComments: 'GET /api/reddit/comments/:postId?limit=50'
            }
            },
            endpoints: {
                health: "GET /api/health",
                social_health: "GET /api/social/health",
                create_post: "POST /api/social/post",
                validate_facebook: "GET /api/social/facebook/validate",
                facebook_page_info: "GET /api/social/facebook/page-info",
                makeCall: 'POST /api/make-call { "to": "+1234567890" }',
                conversationalWebhook:
                    "POST /api/webhook/conversational (for Twilio)",
                mediaStream: "WS /media-stream (WebSocket for audio)",
            },
            version: "1.0.0",
        });
    });
};
