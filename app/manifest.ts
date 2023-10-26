import {MetadataRoute} from 'next';

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
                src: "/apple-icon.png",
                type: "image/png",
                sizes: "512x512",
            },
        ],
        theme_color: "#FFFFFF",
        background_color: "#FFFFFF",
        start_url: "/",
        display: "standalone",
        orientation: "portrait"
    }
}
