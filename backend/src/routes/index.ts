import { Express, Router } from "express";
import multer from "multer";
import conversationController from "../controllers/conversationController";
import conversationalAIController from "../controllers/conversationalAIController";
import redditController from "../controllers/redditController";
import socialMediaController from "../controllers/socialMediaController";
import socialListeningController from "../controllers/socialListeningController";

import canvasController from "../controllers/canvasController";
import veoController from "../controllers/veoController";
import strategistController from "../controllers/strategistController";
import chatController from "../controllers/chatController";
import nestgptController from "../controllers/nestgptController";
import marketingPlanController from "../controllers/marketingPlanController";
import antiCampaignController from "../controllers/antiCampaignController";

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

// Sales pitch call endpoint (Etarra Coffee Shop)
router.post("/sales-call", conversationController.makeCall);

// Reddit API endpoints
router.get("/reddit/health", redditController.healthCheck);
router.get("/reddit/test-auth", redditController.testAuth);
router.post("/reddit/post", redditController.submitPost);
router.get("/reddit/posts/:subreddit", redditController.getSubredditPosts);
router.get("/reddit/comments/:postId", redditController.getPostComments);
router.get("/reddit/inbox", redditController.getInbox);
router.post("/reddit/inbox/reply", redditController.replyToInbox);
router.get(
    "/reddit/subreddits/:subreddit/engagement",
    redditController.getSubredditEngagement,
);

// Social Listening endpoints (Coffee brand monitoring)
router.get(
    "/social-listening/keywords",
    socialListeningController.getTrackedKeywords,
);
router.get(
    "/social-listening/mentions",
    socialListeningController.getRecentMentions,
);
router.get(
    "/social-listening/trends",
    socialListeningController.getMentionTrends,
);
router.get("/social-listening/alerts", socialListeningController.getAlerts);
router.get(
    "/social-listening/competitors",
    socialListeningController.getCompetitorAnalysis,
);

// BRANDPULSE strategist endpoints
// router.get('/strategist/metrics', strategistController.getMetrics);
router.post("/strategist/generate", strategistController.generateStrategy);
router.post("/strategist/chat", chatController.chat);

// Dedicated NestGPT Agent chat (separate from Twilio sales flows)
router.post("/nestgpt/chat", nestgptController.chat);
router.get("/nestgpt/session/:sessionId", nestgptController.getSession);
router.delete("/nestgpt/session/:sessionId", nestgptController.resetSession);

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

// Canvas endpoints - Structured visual canvas system for brand posters
router.post("/canvas/create", canvasController.createCanvas);
router.post(
    "/canvas/create-with-image",
    upload.single("image"),
    canvasController.createCanvasWithImage,
);
router.get("/canvas/list", canvasController.listCanvases);
router.get("/canvas/:id", canvasController.getCanvas);
router.put("/canvas/:canvasId/layer/:layerId", canvasController.updateLayer);
router.post("/canvas/:canvasId/add-layer", canvasController.addLayer);
router.delete("/canvas/:canvasId/layer/:layerId", canvasController.deleteLayer);
router.post(
    "/canvas/:canvasId/layer/:layerId/generate",
    canvasController.generateLayerImage,
);
router.post("/canvas/regenerate-layer", canvasController.regenerateLayer);
router.post("/canvas/generate-text", canvasController.generateText);
router.post(
    "/canvas/:canvasId/generate-element",
    canvasController.generateElement,
);
router.get("/canvas/:id/export", canvasController.exportCanvas);
router.post("/canvas/import", canvasController.importCanvas);
router.delete("/canvas/:id", canvasController.deleteCanvas);
// Veo 3 video generation endpoints
router.post("/veo/tune", veoController.tunePrompt);
router.post("/veo/generate", veoController.generateVideo);

// Marketing Plans endpoints
router.post("/marketing-plans", marketingPlanController.savePlan);
router.get("/marketing-plans", marketingPlanController.getAllPlans);
router.get("/marketing-plans/:id", marketingPlanController.getPlan);
router.delete("/marketing-plans/:id", marketingPlanController.deletePlan);

// Anti-Campaign Generator endpoints
router.post("/anti-campaign/analyze", antiCampaignController.analyzeCampaign);
export const setRoutes = (app: Express): void => {
    // Session middleware is now configured in app.ts before routes
    app.use("/api", router);

    // Root endpoint
    app.get("/", (req, res) => {
        res.json({
            message:
                "SocialNest API - Conversational AI & Social Media Platform",
            features: {
                conversational_ai: "Real-time AI Conversation",
                social_media:
                    "Multi-platform posting (Facebook, Instagram, LinkedIn)",
            },
            tech_stack: {
                speech_to_text: "Deepgram",
                ai_model: "Google Gemini",
                voice_platform: "Twilio Media Streams",
                social_media: "Reddit Integration",
                social_platforms: "Facebook Graph API (+ more coming)",
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
