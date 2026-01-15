import "express-session";

declare module "express-session" {
    interface SessionData {
        twitterCodeVerifier?: string;
        twitterState?: string;
        twitterAccessToken?: string;
        twitterRefreshToken?: string;
        twitterUsername?: string;
    }
}

export {};
