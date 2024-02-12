import { SiteConfig } from "@/types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "OpenStudio",
  description:
    "Open Source Alternative to Youtube Studio Intially. Plan to expand to all Content Platforms",
  url: site_url,
  ogImage: ``,
  links: {
    twitter: "https://twitter.com/kuluruvineeth",
    github: "https://github.com/kuluruvineeth",
  },
  mailSupport: "kuluruvineeth@gmail.com",
};
