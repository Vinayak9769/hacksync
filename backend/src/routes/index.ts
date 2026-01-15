import { Express, Router } from 'express';
import conversationController from '../controllers/conversationController';
import conversationalAIController from '../controllers/conversationalAIController';
import strategistController from '../controllers/strategistController';
import chatController from '../controllers/chatController';
import nestgptController from '../controllers/nestgptController';

const router = Router();

// Health check
router.get('/health', conversationalAIController.healthCheck);

// NEW: Conversational AI endpoints (Deepgram + Gemini)
router.post('/webhook/conversational', conversationalAIController.handleIncomingCall);
router.post('/make-call', conversationalAIController.makeCall);

// BRANDPULSE strategist endpoints
// router.get('/strategist/metrics', strategistController.getMetrics);
router.post('/strategist/generate', strategistController.generateStrategy);
router.post('/strategist/chat', chatController.chat);
// Dedicated NestGPT strategist chat (separate from Twilio sales flows)
router.post('/nestgpt/chat', nestgptController.chat);

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
                voice_platform: 'Twilio Media Streams'
            },
            endpoints: {
                health: 'GET /api/health',
                makeCall: 'POST /api/make-call { "to": "+1234567890" }',
                conversationalWebhook: 'POST /api/webhook/conversational (for Twilio)',
                mediaStream: 'WS /media-stream (WebSocket for audio)'
            }
        });
    });
};