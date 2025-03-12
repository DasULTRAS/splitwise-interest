import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Splitwise interest calculator",
    short_name: "Splitwise interest",
    description: "A website that automatically collects interest for Splitwise.",
    icons: [
      {
        src: "/favicon.ico",
        type: "image/icon",
        sizes: "256x256",
      },
      {
        src: "/icon.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
      {
        src: "/icons/favicon-light.png",
        type: "image/icon",
        sizes: "256x256",
      },
      {
        src: "/icons/icon-light.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    theme_color: "#000000",
    background_color: "#000000",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
  };
}
