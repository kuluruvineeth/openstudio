import { Home, LucideIcon } from "lucide-react";

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
