var e=require("http-proxy-middleware");const o=(0,e.createProxyMiddleware)({target:"https://app.posthog.com",changeOrigin:!0,pathRewrite:{"^/ingest":""},onProxyRes(e){e.headers.Host="app.posthog.com";// add new header to response
}});async function t(e,t){// @ts-expect-error
return e.headers.host="app.posthog.com",o(e,t)}module.exports=t;//# sourceMappingURL=ingest.js.map

//# sourceMappingURL=ingest.js.map
