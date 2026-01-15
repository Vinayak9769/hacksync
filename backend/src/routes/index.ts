import { Express, Router } from 'express';
import conversationController from '../controllers/conversationController';
import conversationalAIController from '../controllers/conversationalAIController';
import redditController from '../controllers/redditController';

const router = Router();

// Health check
router.get('/health', conversationalAIController.healthCheck);

// NEW: Conversational AI endpoints (Deepgram + Gemini)
router.post('/webhook/conversational', conversationalAIController.handleIncomingCall);
router.post('/make-call', conversationalAIController.makeCall);

// Reddit API endpoints
router.get('/reddit/health', redditController.healthCheck);
router.get('/reddit/test-auth', redditController.testAuth);
router.post('/reddit/post', redditController.submitPost);
router.get('/reddit/posts/:subreddit', redditController.getSubredditPosts);
router.get('/reddit/comments/:postId', redditController.getPostComments);

// Legacy: Twilio webhook endpoints for voice calls (TwiML-based)
router.post('/webhook/voice', conversationController.handleIncomingCall);
router.post('/webhook/voice/gather', conversationController.handleGather);

// Legacy: Twilio webhook endpoints for outbound sales pitch
router.post('/webhook/sales-pitch', conversationController.handleSalesPitch);
router.post('/webhook/pitch/response', conversationController.handlePitchResponse);
router.post('/webhook/pitch/demo', conversationController.handleDemoRequest);

export const setRoutes = (app: Express): void => {
    app.use('/api', router);
    
    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            message: 'Twilio Conversational AI Sales Agent',
            mode: 'Real-time AI Conversation',
            tech_stack: {
                speech_to_text: 'Deepgram',
                ai_model: 'Google Gemini',
                voice_platform: 'Twilio Media Streams',
                social_media: 'Reddit Integration'
            },
            endpoints: {
                health: 'GET /api/health',
                makeCall: 'POST /api/make-call { "to": "+1234567890" }',
                conversationalWebhook: 'POST /api/webhook/conversational (for Twilio)',
                mediaStream: 'WS /media-stream (WebSocket for audio)',
                redditHealth: 'GET /api/reddit/health',
                submitPost: 'POST /api/reddit/post { "subreddit": "test", "title": "...", "text": "...", "type": "text" }',
                getPosts: 'GET /api/reddit/posts/:subreddit?limit=25&sort=hot',
                getComments: 'GET /api/reddit/comments/:postId?limit=50'
            }
        });
    });
};