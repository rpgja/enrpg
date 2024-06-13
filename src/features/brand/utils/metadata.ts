import type { Metadata } from "next";

export const SITE_NAME = "ENRPG";

export const SITE_DESCRIPTION = "Enhanced RPGEN editing.";

/**
 * @see {@link https://github.com/vercel/next.js/discussions/50189#discussioncomment-9224262}
 */
// biome-ignore lint/suspicious/noExplicitAny: no reason
export const getPathnameFromMetadata = (state: any): string => {
  const res = Object.getOwnPropertySymbols(state || {})
    .map((p) => state[p])
    .find((state) =>
      Object.prototype.hasOwnProperty.call(state, "urlPathname"),
    );

  return res?.urlPathname.replace(/\?.+/, "") ?? "";
};

// biome-ignore lint/suspicious/noExplicitAny: no reason
export const generateDefaultMetadata = (_: any, state: any): Metadata => {
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

export const generateNotFoundMetadata = (): Metadata => {
  const title = "ページが見つかりませんでした";
  const description = "ページが見つかりませんでした";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
};
