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
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
