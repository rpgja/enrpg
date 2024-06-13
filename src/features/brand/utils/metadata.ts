import type { Metadata } from "next";

export const SITE_NAME = "ENRPG";

export const SITE_DESCRIPTION = "Enhanced RPGEN editing.";

export const generateDefaultMetadata = (): Metadata => {
  return {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    twitter: {
      card: "summary_large_image",
    },
    icons: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/favicons/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicons/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "194x194",
        url: "/favicons/favicon-194x194.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/favicons/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicons/favicon-16x16.png",
      },
      {
        rel: "shortcut icon",
        url: "/favicons/favicon.ico",
      },
    ],
    manifest: "/favicons/site.webmanifest",
    other: {
      "msapplication-TileColor": "#2d89ef",
      "msapplication-TileImage": "/favicons/mstile-144x144.png",
      "msapplication-config": "/favicons/browserconfig.xml",
    },
  };
};
