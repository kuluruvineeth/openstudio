"use client";

import { THEMES } from "@/utils/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@openstudio/ui/components/ui/card";
import { useTranslations } from "next-intl";
import { ThemeCard } from "@/components/settings/theme/ThemeCard";
import { useTheme } from "next-themes";

export const Theme = () => {
  const t = useTranslations("SETTINGS");
  const { theme: activeTheme, setTheme } = useTheme();

  return (
    <Card className="bg-background border-none shadow-none">
      <CardHeader>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          {t("THEME.TITLE")}
        </h1>
        <CardDescription className="text-base">
          {t("THEME.DESCRIPTION")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-6">
        {THEMES.map((theme) => (
          <ThemeCard
            key={theme.type}
            theme={theme.type}
            activeTheme={activeTheme}
            onThemeChange={setTheme}
            themeTitle={t(theme.title)}
            themeFooter={t(theme.footer)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
