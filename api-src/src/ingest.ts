import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createProxyMiddleware } from "http-proxy-middleware";

const apiProxy = createProxyMiddleware({
    target: "https://app.posthog.com",
    changeOrigin: true,
    pathRewrite: {
        "^/ingest": "", // strip "/api" from the URL
    },
    onProxyRes(proxyRes) {
        proxyRes.headers["Host"] = "app.posthog.com"; // add new header to response
    },
});

async function handler(req: VercelRequest, res: VercelResponse): Promise<any> {
    req.headers["host"] = "app.posthog.com";
    // @ts-expect-error
    return apiProxy(req, res);
}

module.exports = handler;
