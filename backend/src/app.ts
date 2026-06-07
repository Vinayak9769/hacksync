import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import session from "express-session";
import { setRoutes } from "./routes/index";
import path from "path";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MONGO_URI = process.env.MONGODB_URI || "";

export async function createApp(): Promise<express.Express> {
    // Connect to MongoDB (optional)
    if (MONGO_URI && process.env.NODE_ENV !== "test") {
        try {
            await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4,
            });
            console.log("Connected to MongoDB");
        } catch (err: any) {
            console.error(
                "MongoDB connection error (will continue without persistence):",
                err.message || err,
            );
        }
    }

    const app = express();

    // Trust proxy - needed for ngrok and other reverse proxies
    app.set("trust proxy", 1);

    // CORS Configuration - Allow specific origins with credentials
    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                const allowedOrigins = [
                    "http://localhost:8000",
                    "http://localhost:3000",
                    "https://toucan-driven-admittedly.ngrok-free.app",
                    "https://b0x456pd-3000.inc1.devtunnels.ms",
                    "https://b0x456pd-8000.inc1.devtunnels.ms",
                    "https://b0x456pd-4000.inc1.devtunnels.ms",
                    process.env.FRONTEND_URL,
                ].filter(Boolean);

                if (
                    allowedOrigins.some((allowed) =>
                        origin.startsWith(allowed!),
                    )
                ) {
                    callback(null, true);
                } else {
                    callback(null, true);
                }
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: [
                "Content-Type",
                "Authorization",
                "ngrok-skip-browser-warning",
            ],
        }),
    );

    // Session configuration for OAuth flows
    app.use(
        session({
            secret:
                process.env.SESSION_SECRET ||
                "your-secret-key-change-in-production",
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure:
                    process.env.NODE_ENV === "production" &&
                    !process.env.NGROK_URL,
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: process.env.NGROK_URL ? "none" : "lax",
            },
            name: "socialnest.sid",
        }),
    );

    // Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Serve media files with CORS headers
    app.use("/media", (req, res, next) => {
        const origin = req.headers.origin;
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');
        
        if (req.path.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
        }
        
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        
        next();
    }, express.static(path.resolve(process.cwd(), "public")));

    // Safety-net CORS headers for credentialed requests
    app.use((req, res, next) => {
        const existingOriginHeader = res.getHeader(
            "Access-Control-Allow-Origin",
        );
        if (!existingOriginHeader) {
            const configuredOrigin =
                process.env.ALLOWED_ORIGIN || req.headers.origin || "*";
            res.setHeader("Access-Control-Allow-Origin", configuredOrigin);
            if (configuredOrigin !== "*") {
                res.setHeader("Vary", "Origin");
                res.setHeader("Access-Control-Allow-Credentials", "true");
            }
        }

        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,DELETE,OPTIONS",
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, ngrok-skip-browser-warning",
        );

        if (req.method === "OPTIONS") {
            res.sendStatus(204);
            return;
        }

        const start = Date.now();
        res.on("finish", () => {
            const duration = Date.now() - start;
            if (process.env.NODE_ENV !== "test") {
                console.log(
                    `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
                );
            }
        });

        next();
    });

    // Register routes
    setRoutes(app);

    return app;
}

export async function startServer() {
    const app = await createApp();
    const server = createServer(app);
    const wss = new WebSocketServer({ server, path: "/media-stream" });

    wss.on("connection", (ws) => {
        console.log("New WebSocket connection for media stream");
        try {
            const {
                handleMediaStream,
            } = require("./services/mediaStreamHandler");
            if (handleMediaStream) handleMediaStream(ws);
        } catch {
            // ignore
        }
    });

    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
    });
}

if (require.main === module) {
    startServer().catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
}
