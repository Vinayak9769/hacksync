import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { setRoutes } from "./routes/index";
import { handleMediaStream } from "./services/mediaStreamHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - needed for ngrok and other reverse proxies
app.set("trust proxy", 1);

// CORS Configuration - Allow all origins with credentials
app.use(
    cors({
        origin: true, // This allows any origin and reflects it back
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "ngrok-skip-browser-warning",
        ],
    }),
);

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
    path: "/media-stream",
});

wss.on("connection", (ws) => {
    console.log("New WebSocket connection for media stream");
    handleMediaStream(ws);
});

// Start server
server.listen(PORT, () => {
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
});
