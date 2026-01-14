import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setRoutes } from './routes/index';
import { handleMediaStream } from './services/mediaStreamHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup routes
setRoutes(app);

// Create HTTP server
const server = createServer(app);

// Create WebSocket server for Twilio Media Streams
const wss = new WebSocketServer({ 
    server,
    path: '/media-stream'
});

wss.on('connection', (ws) => {
    console.log('New WebSocket connection for media stream');
    handleMediaStream(ws);
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Twilio Conversational AI Sales Agent server is running on port ${PORT}`);
    console.log(`📞 Voice Webhook URL: http://localhost:${PORT}/api/webhook/conversational`);
    console.log(`🌊 Media Stream WebSocket: ws://localhost:${PORT}/media-stream`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`\n⚡ Features:`);
    console.log(`   - Real-time speech-to-text (Deepgram)`);
    console.log(`   - AI conversation (Google Gemini)`);
    console.log(`   - Twilio Media Streams`);
});
