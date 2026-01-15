import { NextRequest, NextResponse } from "next/server";
import twitterService from "@/lib/services/twitterService";
import sessionStore from "@/lib/services/sessionStore";

export async function GET(request: NextRequest) {
    try {
        const url = request.nextUrl;
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        // Check for OAuth errors
        if (error) {
            const baseUrl =
                process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
            const errorUrl = new URL("/twitter-error", baseUrl);
            errorUrl.searchParams.set("error", "oauth_error");
            errorUrl.searchParams.set(
                "message",
                `Twitter OAuth error: ${error}`,
            );
            return NextResponse.redirect(errorUrl.toString());
        }

        // Validate required parameters
        if (!code || !state) {
            const baseUrl =
                process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
            const errorUrl = new URL("/twitter-error", baseUrl);
            errorUrl.searchParams.set("error", "invalid_callback");
            errorUrl.searchParams.set(
                "message",
                "Missing authorization code or state parameter",
            );
            return NextResponse.redirect(errorUrl.toString());
        }

        // Get session from cookie
        const sessionId = request.cookies.get("session-id")?.value;
        if (!sessionId) {
            const baseUrl =
                process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
            const errorUrl = new URL("/twitter-error", baseUrl);
            errorUrl.searchParams.set("error", "no_session");
            errorUrl.searchParams.set(
                "message",
                "Session not found. Please try connecting again.",
            );
            return NextResponse.redirect(errorUrl.toString());
        }

        // Get OAuth state from session
        const oauthState = sessionStore.getOAuthState(sessionId);
        if (!oauthState) {
            const baseUrl =
                process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
            const errorUrl = new URL("/twitter-error", baseUrl);
            errorUrl.searchParams.set("error", "invalid_state");
            errorUrl.searchParams.set(
                "message",
                "OAuth state not found. Please try connecting again.",
            );
            return NextResponse.redirect(errorUrl.toString());
        }

        // Validate state parameter
        if (oauthState.state !== state) {
            const baseUrl =
                process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
            const errorUrl = new URL("/twitter-error", baseUrl);
            errorUrl.searchParams.set("error", "state_mismatch");
            errorUrl.searchParams.set(
                "message",
                "Invalid OAuth state. Possible security issue.",
            );
            return NextResponse.redirect(errorUrl.toString());
        }

        // Check if OAuth state is expired (10 minutes)
        const stateAge = Date.now() - oauthState.createdAt;
        if (stateAge > 10 * 60 * 1000) {
            const baseUrl =
                process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
            const errorUrl = new URL("/twitter-error", baseUrl);
            errorUrl.searchParams.set("error", "state_expired");
            errorUrl.searchParams.set(
                "message",
                "OAuth session expired. Please try connecting again.",
            );
            return NextResponse.redirect(errorUrl.toString());
        }

        // Exchange code for access token
        const tokens = await twitterService.getAccessToken(
            code,
            oauthState.codeVerifier,
        );

        // Get user info
        const userInfo = await twitterService.getUserInfo(tokens.accessToken);

        // Store tokens and user info in session
        sessionStore.setTwitterTokens(sessionId, tokens);
        sessionStore.setTwitterUser(sessionId, {
            id: userInfo.id,
            username: userInfo.username,
            name: userInfo.name,
        });

        // Clear OAuth state as it's no longer needed
        sessionStore.clearOAuthState(sessionId);

        // Redirect to success page
        const baseUrl =
            process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
        const successUrl = new URL("/twitter-connected", baseUrl);
        successUrl.searchParams.set("success", "true");
        successUrl.searchParams.set("username", userInfo.username);

        return NextResponse.redirect(successUrl.toString());
    } catch (error: any) {
        // Redirect to error page with generic message
        const baseUrl =
            process.env.NEXT_PUBLIC_FRONTEND_URL || request.nextUrl.origin;
        const errorUrl = new URL("/twitter-error", baseUrl);
        errorUrl.searchParams.set("error", "callback_processing_failed");
        errorUrl.searchParams.set(
            "message",
            error.message ||
                "Failed to process Twitter authentication. Please try again.",
        );

        return NextResponse.redirect(errorUrl.toString());
    }
}
