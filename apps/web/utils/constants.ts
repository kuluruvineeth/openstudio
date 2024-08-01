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
