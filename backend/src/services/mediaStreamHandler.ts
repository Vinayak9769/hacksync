import WebSocket from 'ws';
import { ConversationalAIService } from '../services/conversationalAIService';

interface CallSession {
    callSid: string;
    streamSid: string;
    aiService: ConversationalAIService;
    isActive: boolean;
}

const activeSessions = new Map<string, CallSession>();

export function handleMediaStream(ws: WebSocket) {
    console.log('New WebSocket connection established');
    
    let callSid: string;
    let streamSid: string;
    let aiService: ConversationalAIService;

    ws.on('message', async (message: string) => {
        try {
            const data = JSON.parse(message);

            switch (data.event) {
                case 'start':
                    callSid = data.start.callSid;
                    streamSid = data.start.streamSid;
                    
                    console.log(`Media stream started for call ${callSid}`);
                    
                    // Initialize AI service
                    aiService = new ConversationalAIService();
                    aiService.setTwilioWebSocket(ws, streamSid);
                    await aiService.startDeepgramConnection();
                    
                    // Store session
                    activeSessions.set(callSid, {
                        callSid,
                        streamSid,
                        aiService,
                        isActive: true
                    });

                    // Send initial greeting
                    const greeting = "Hello! Thanks so much for taking my call. I'm excited to tell you about our amazing software solutions that can transform your business. How are you doing today?";
                    await aiService.generateAndSendTTS(greeting);

                    break;

                case 'media':
                    // Forward audio to Deepgram (already in mulaw format from Twilio)
                    if (aiService && data.media.payload) {
                        const audioBuffer = Buffer.from(data.media.payload, 'base64');
                        aiService.sendAudioToDeepgram(audioBuffer);
                    }
                    break;

                case 'stop':
                    console.log(`Media stream stopped for call ${callSid}`);
                    if (aiService) {
                        aiService.close();
                    }
                    activeSessions.delete(callSid);
                    break;

                default:
                    // Handle other events if needed
                    break;
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        if (aiService) {
            aiService.close();
        }
        if (callSid) {
            activeSessions.delete(callSid);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
}

export { activeSessions };
