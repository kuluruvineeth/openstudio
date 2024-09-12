import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@openstudio/ui", "@t3-oss/env-nextjs"],
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      {
        protocol: "https",
        hostname: "hileqdqqjnijldutjsyu.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/affiliates",
        destination: "https://openstudio.lemonsqueezy.com/affiliates",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/en/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
