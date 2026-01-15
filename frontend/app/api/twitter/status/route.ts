import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Return mock success response immediately to force connected state
        return NextResponse.json({
            connected: true,
            user: {
                id: "123456789",
                username: "socialnest",
                name: "SocialNest",
            },
            message: "Twitter account connected successfully (Mocked)",
            connectedAt: new Date().toISOString(),
        });
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
