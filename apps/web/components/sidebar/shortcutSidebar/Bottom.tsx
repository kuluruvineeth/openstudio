"use client";

import ActiveLink from "@/components/ActiveLink";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { useRouter } from "@/utils/navigation";
import { toastSuccess } from "@openstudio/ui/components/Toast";
import { Button } from "@openstudio/ui/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@openstudio/ui/components/ui/hover-card";
import { LogOutIcon, Settings2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export const Bottom = () => {
  const router = useRouter();
  const lang = useLocale();
  const t = useTranslations("SIDEBAR");

  const logOutHandler = async () => {
    await supabaseBrowserClient.auth.signOut();
    toastSuccess({
      title: "Logout",
      description: "You have been logged out",
    });
    router.push(`${window.location.origin}/${lang}`);
  };
  return (
    <div className="flex flex-col gap-3">
      <HoverCard openDelay={250} closeDelay={250}>
        <HoverCardTrigger tabIndex={-1}>
          <Button onClick={logOutHandler} variant={"ghost"} size={"icon"}>
            <LogOutIcon />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          <span>{t("MAIN.LOG_OUT_HOVER")}</span>
        </HoverCardContent>
      </HoverCard>

      <HoverCard openDelay={250} closeDelay={250}>
        <HoverCardTrigger asChild>
          <ActiveLink
            include="settings"
            variant={"ghost"}
            size={"icon"}
            href={`/dashboard/settings`}
          >
            <Settings2 />
          </ActiveLink>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          <span>{t("MAIN.SETTINGS_HOVER")}</span>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
