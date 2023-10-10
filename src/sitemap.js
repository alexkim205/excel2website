import { Readable } from "stream";
import { SitemapStream, streamToPromise } from "sitemap";
import fs from "fs";

const hostname = "https://sheetstodashboard.com";

const links = [
    { url: "/", changefreq: "daily", priority: 1 },
    { url: "/signup", changefreq: "monthly", priority: 0.8 },
    { url: "/signin", changefreq: "monthly", priority: 0.8 },
    { url: "/pricing", changefreq: "monthly", priority: 0.8 },
];

// Create a stream to write to
const stream = new SitemapStream({ hostname });

// Return a promise that resolves with your XML string
streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
    fs.writeFileSync("./public/sitemap.xml", data.toString());
    console.log("Generated sitemap successfully");
});
