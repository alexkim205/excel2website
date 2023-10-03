import posthog from "posthog-js";

const POSTHOG_PROJECT_API_KEY = import.meta.env.VITE_POSTHOG_PUBLIC_KEY;

export function createPostHogClient(): void {
    if (!POSTHOG_PROJECT_API_KEY) {
        const message = "Error: PostHog environment variables aren't set!";
        console.error(message);
        throw new Error(message);
    }

    posthog.init(POSTHOG_PROJECT_API_KEY, {
        api_host: "https://d4p4vrmb9s9l9.cloudfront.net",
    });
}