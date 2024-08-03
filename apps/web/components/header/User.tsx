"use client";
import { useChangeLocale } from "@/hooks/useChangeLocale";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { useRouter } from "@/utils/navigation";
import { toastSuccess } from "@openstudio/ui/components/Toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@openstudio/ui/components/ui/dropdown-menu";
import {
  Check,
  ChevronDownIcon,
  Globe,
  LogOut,
  Moon,
  Settings2,
  Sun,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface UserProps {
  profileImage?: string;
  username?: string | null;
  email?: string;
}

export const User = ({ profileImage, username, email }: UserProps) => {
  const t = useTranslations("COMMON");
  const { setTheme, theme } = useTheme();
  const lang = useLocale();
  const { onSelectChange } = useChangeLocale();
  const router = useRouter();

  const logOutHandler = async () => {
    await supabaseBrowserClient.auth.signOut();
    toastSuccess({
      title: "Logout",
      description: "You have been logged out",
    });
    router.push(`${window.location.origin}/${lang}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {profileImage ? (
          <div className="flex items-center">
            <Image
              src={profileImage}
              alt="Profile Image"
              width={300}
              height={300}
              className="rounded-full w-10 h-10 object-cover"
            />
            <span className="hidden lg:flex lg:items-center">
              <span
                className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-[#FAFAFA]"
                aria-hidden="true"
              >
                {username || "Account"}
              </span>
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-red-500" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" align="end" sideOffset={10}>
        <div className="flex items-center gap-1 px-2">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile Image"
              width={300}
              height={300}
              className="rounded-full w-8 h-8 object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-red-500" />
          )}
          <div>
            <DropdownMenuLabel className="py-0 pt-1.5">
              {username}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="py-0 pb-1.5 pt-0.5 text-xs text-muted-foreground leading-none peer-disabled::cursor-not-allowed peer-disabled:opacity-70">
              {email}
            </DropdownMenuLabel>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer gap-2">
              <Moon size={16} className="hidden dark:inline-block" />
              <Sun size={16} className="dark:hidden" />

              <span>{t("THEME_HOVER")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={10}>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>{t("DARK")}</span>
                  {theme === "dark" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>{t("LIGHT")}</span>
                  {theme === "light" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>{t("SYSTEM")}</span>
                  {theme === "system" && <Check size={14} />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer gap-2">
              <Globe size={16} />
              <span>{t("LANG_HOVER")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={10}>
                <DropdownMenuItem
                  onClick={() => onSelectChange("en")}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>English</span>
                  {lang === "en" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectChange("te")}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>Telugu</span>
                  {lang === "te" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectChange("ka")}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>Kannada</span>
                  {lang === "ka" && <Check size={14} />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem className="cursor-pointer gap-2" asChild>
            <Link href={"/dashboard/settings"}>
              <Settings2 size={16} /> {t("SETTINGS")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logOutHandler}
          className="cursor-pointer gap-2"
        >
          <LogOut size={16} /> {t("LOG_OUT")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
