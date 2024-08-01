"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@openstudio/ui/components/ui/dropdown-menu";
import { Loading } from "@openstudio/ui/components/Loading";
import { Button } from "@openstudio/ui/components/ui/button";
import { usePathname, useRouter } from "@/utils/navigation";

export const LocaleSwitcher = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(nextLocale: "en" | "te" | "ka") {
    setIsLoading(true);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isPending} variant="outline" size="icon">
          {isLoading ? <Loading size="xs" /> : locale.toUpperCase()}
          <span className="sr-only">Chnage language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            onSelectChange("en");
          }}
          className="cursor-pointer"
        >
          EN
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelectChange("te");
          }}
          className="cursor-pointer"
        >
          TE
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelectChange("ka");
          }}
          className="cursor-pointer"
        >
          KA
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
