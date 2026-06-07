import { NextRequest, NextResponse } from "next/server";
import sessionStore from "@/lib/services/sessionStore";

export async function POST(request: NextRequest) {
    try {
        const sessionId = request.cookies.get("session-id")?.value;
        console.log("[Twitter Disconnect] Session ID from cookie:", sessionId || "NONE");

        if (sessionId) {
            const session = sessionStore.get(sessionId);
            if (session) {
                delete session.twitterTokens;
                delete session.twitterUser;
                sessionStore.save(session);
                console.log("[Twitter Disconnect] Stored tokens deleted for session:", sessionId);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Twitter account disconnected successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to disconnect Twitter account",
            },
            { status: 500 },
        );
    }
}
