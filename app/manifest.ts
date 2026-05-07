import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harrison King",
    short_name: "Harry",
    description: "Harry's world — featuring Super Dog World!",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFB088",
    theme_color: "#E94B4B",
    categories: ["games", "kids", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
