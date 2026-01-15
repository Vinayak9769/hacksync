import { NextRequest, NextResponse } from "next/server";
import twitterService from "@/lib/services/twitterService";
import sessionStore from "@/lib/services/sessionStore";

export async function GET(request: NextRequest) {
    try {
        // Get session from cookie
        const sessionId = request.cookies.get("session-id")?.value;
        if (!sessionId) {
            return NextResponse.json({
                connected: false,
                message: "No session found",
            });
        }

        // Get session data
        const session = sessionStore.get(sessionId);
        if (!session) {
            return NextResponse.json({
                connected: false,
                message: "Session expired",
            });
        }
        // Check if Twitter tokens exist
        const twitterTokens = session.twitterTokens;
        if (!twitterTokens || !twitterTokens.accessToken) {
            return NextResponse.json({
                connected: false,
                message: "Twitter account not connected",
            });
        }

        try {
            // Try to get user info to verify token is still valid
            const userInfo = await twitterService.getUserInfo(
                twitterTokens.accessToken,
            );

            return NextResponse.json({
                connected: true,
                user: {
                    id: userInfo.id,
                    username: userInfo.username,
                    name: userInfo.name,
                },
                message: "Twitter account connected successfully",
                connectedAt: session.updatedAt,
            });
        } catch (tokenError: any) {
            // Token is invalid, clear it from session
            delete session.twitterTokens;
            delete session.twitterUser;
            sessionStore.save(session);

            return NextResponse.json({
                connected: false,
                message: "Twitter token expired or invalid",
                error: tokenError.message,
            });
        }
    } catch (error: any) {
        return NextResponse.json(
            {
                connected: false,
                error: error.message || "Failed to check Twitter status",
            },
            { status: 500 },
        );
    }
}
