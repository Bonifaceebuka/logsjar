import type { Metadata } from "next";

export const siteUrl = "https://www.oneminutelogs.com";

export const brand = "OneMinute Logs";
export const defaultDescription = "Production-ready logs in under a minute.";

const ogImage = `${siteUrl}/og.png`;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brand,
    template: `%s | ${brand}`,
  },
  applicationName: brand,
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: brand,
    siteName: brand,
    description: defaultDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: brand }],
  },
  twitter: {
    card: "summary_large_image",
    title: brand,
    description: defaultDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  keywords: [
    "log management",
    "logging SaaS",
    "nodejs logs",
    "production logs",
    "developer tools",
    "clickhouse logs",
    "observability",
    "monitoring",
  ],
};

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  images?: string[];
};

export const makePageMetadata = ({
  title,
  description = defaultDescription,
  path = "/",
  images = [ogImage],
}: PageMetaInput): Metadata => {
  const canonical = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      ...defaultMetadata.openGraph!,
      title,
      description,
      url: canonical,
      images: images.map((url) => ({ url })),
    },
    twitter: {
      ...defaultMetadata.twitter!,
      title,
      description,
      images,
    },
  };
};

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand,
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
});
