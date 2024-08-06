import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@openstudio/ui", "@t3-oss/env-nextjs"],
  images: {
    remotePatterns: [
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
};

export default withNextIntl(nextConfig);
