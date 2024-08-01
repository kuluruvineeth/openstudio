"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@openstudio/ui/components/ui/hover-card";
import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ActiveLink from "@/components/ActiveLink";

interface SidebarLinkProps {
  href: string;
  Icon: LucideIcon;
  hoverTextKey: string;
  include?: string;
}

export const SidebarLink = ({
  href,
  Icon,
  hoverTextKey,
  include,
}: SidebarLinkProps) => {
  const t = useTranslations("SIDEBAR.MAIN");
  return (
    <HoverCard openDelay={250} closeDelay={250}>
      <HoverCardTrigger asChild>
        <ActiveLink
          include={include}
          href={href}
          variant={"ghost"}
          size={"icon"}
        >
          <Icon />
        </ActiveLink>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        <span>{t(hoverTextKey)}</span>
      </HoverCardContent>
    </HoverCard>
  );
};
