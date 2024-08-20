"use client";

import { usePathname } from "@/utils/navigation";
import { ScrollArea } from "@openstudio/ui/components/ui/scroll-area";
import { Settings } from "@/components/sidebar/optionsSidebar/settingsOptions/Settings";

interface OptionsSidebarProps {}

export const OptionsSidebar = ({}: OptionsSidebarProps) => {
  const pathname = usePathname();

  if (pathname === "/dashboard" || pathname === "/dashboard/comments") {
    return null;
  }

  return (
    <div className="h-full p-4 sm:py-6 border-r w-52 sm:w-64 flex flex-col justify-between gap-2">
      <ScrollArea className="h-full">
        {pathname.includes("/dashboard/settings") && <Settings />}
      </ScrollArea>
    </div>
  );
};
