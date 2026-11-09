import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest { return { name: "BloodyCoTech", short_name: "BloodyCoTech", description: "Draw Something. Discover Something.", start_url: "/", display: "standalone", background_color: "#faf8f3", theme_color: "#a76545", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] }; }
