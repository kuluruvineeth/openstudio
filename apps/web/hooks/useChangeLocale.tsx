"use client";

import { usePathname, useRouter } from "@/utils/navigation";
import { useState, useTransition } from "react";

export const useChangeLocale = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (nextLocale: "en" | "te" | "ka") => {
    setIsLoading(true);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return {
    onSelectChange,
    isLoading,
    isPending,
  };
};
