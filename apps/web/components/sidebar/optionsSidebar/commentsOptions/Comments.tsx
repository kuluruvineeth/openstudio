"use client";

import ActiveLink from "@/components/ActiveLink";
import {
  BookIcon,
  MessageCircleDashedIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

interface CommentsSidebarProps {}

export interface CommentsSidebarField {
  href: string;
  icon: ReactNode;
  title: string;
}

export const COMMENTS_SIDEBAR_FIELDS: CommentsSidebarField[] = [
  {
    href: "/dashboard/comments",
    icon: <MessageCircleDashedIcon size={20} />,
    title: "ALL_COMMENTS",
  },
  {
    href: "/dashboard/comments/new-senders",
    icon: <UsersRoundIcon size={20} />,
    title: "NEW_SENDERS",
  },
  {
    href: "/dashboard/comments/authors",
    icon: <BookIcon size={20} />,
    title: "AUTHORS",
  },
];

export const CommentsSidebar = ({}: CommentsSidebarProps) => {
  const t = useTranslations("DASHBOARD.COMMENT.OPTIONS");
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <p className="text-xs sm:text-sm uppercase text-muted-foreground">
          COMMENTS
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          {COMMENTS_SIDEBAR_FIELDS.map((settingField, i) => (
            <ActiveLink
              key={i}
              href={settingField.href}
              variant={"ghost"}
              size={"sm"}
              className="w-full flex justify-start items-center gap-2"
            >
              {settingField.icon}
              {t(settingField.title)}
            </ActiveLink>
          ))}
        </div>
      </div>
    </div>
  );
};
