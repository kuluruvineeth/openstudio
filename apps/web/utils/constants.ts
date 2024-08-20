import { Home, LucideIcon, MessageCircle } from "lucide-react";

export interface TopSidebarLink {
  href: string;
  Icon: LucideIcon;
  hoverTextKey: string;
  include?: string;
}

export const TOP_SIDEBAR_LINKS: TopSidebarLink[] = [
  {
    href: "/dashboard",
    Icon: Home,
    hoverTextKey: "HOME_HOVER",
  },
  {
    href: "/dashboard/comments",
    Icon: MessageCircle,
    hoverTextKey: "COMMENTS_HOVER",
  },
];

export interface Themes {
  type: "light" | "dark" | "system";
  title: string;
  footer: string;
}

export const THEMES: Themes[] = [
  {
    type: "light",
    title: "THEME.LIGHT_TITLE",
    footer: "THEME.LIGHT_FOOTER",
  },
  {
    type: "dark",
    title: "THEME.DARK_TITLE",
    footer: "THEME.DARK_FOOTER",
  },
  {
    type: "system",
    title: "THEME.SYSTEM_TITLE",
    footer: "THEME.SYSTEM_FOOTER",
  },
];

export const DEFAULT_AI_PROVIDER = "openai";
export const DEFAULT_OPENAI_MODEL = "gpt-4o";
export const DEFAULT_ANTHROPIC_MODEL = "claude-3-haiku-20240307";
