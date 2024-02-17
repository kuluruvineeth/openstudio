/** @type {import('next').NextConfig} */
import("./env.mjs");
const nextConfig = {
  images: {
    domains: ["aceternity.com"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.cloudfront_url}`, // replace this with your cloudfront_url
      },
      {
        protocol: "https",
        hostname: "aceternity.com",
      },
      { protocol: "https", hostname: "flowbite.s3.amazonaws.com" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
