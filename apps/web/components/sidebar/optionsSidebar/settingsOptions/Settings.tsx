"use client";

import ActiveLink from "@/components/ActiveLink";
import { SunMoon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

interface SettingsProps {}

export interface SettingsField {
  href: string;
  icon: ReactNode;
  title: string;
}

export const SETTINGS_FIELDS: SettingsField[] = [
  {
    href: "/dashboard/settings/theme",
    icon: <SunMoon size={20} />,
    title: "SETTINGS.THEME",
  },
];

export const Settings = ({}: SettingsProps) => {
  const t = useTranslations("SIDEBAR");
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <p className="text-xs sm:text-sm uppercase text-muted-foreground">
          {t("SETTINGS.GENERAL")}
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          {SETTINGS_FIELDS.map((settingField, i) => (
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
