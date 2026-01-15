import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setRoutes } from './routes/index';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MONGO_URI = process.env.MONGODB_URI || '';

async function startServer() {
  // Connect to MongoDB (optional)
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      });
      console.log('Connected to MongoDB');
    } catch (err: any) {
      console.error('MongoDB connection error (will continue without persistence):', err.message || err);
    }
  } else {
    console.warn('MONGO_URI not set — persistence disabled. Set MONGO_URI to enable campaign persistence.');
  }

  const app = express();

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Simple request logger + CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
  });

  // Register routes
  setRoutes(app);

  // Create HTTP server & WS server
  const server = createServer(app);
  const wss = new WebSocketServer({ server, path: '/media-stream' });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection for media stream');
    // Optional: If you have a media stream handler file, call it; otherwise ignore.
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { handleMediaStream } = require('./services/mediaStreamHandler');
      if (handleMediaStream) handleMediaStream(ws);
    } catch {
      // no media stream handler found — that's fine
    }
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
