"use client";

import { useState } from "react";
import { usePathname } from "@/utils/navigation";
import { ScrollArea } from "@openstudio/ui/components/ui/scroll-area";
import { Settings } from "@/components/sidebar/optionsSidebar/settingsOptions/Settings";
import { CommentsSidebar } from "./commentsOptions/Comments";

interface OptionsSidebarProps {}

export const OptionsSidebar = ({}: OptionsSidebarProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (pathname.includes("/dashboard/premium") || pathname === "/dashboard") {
    return null;
  }

  return (
    <>
      <div
        className={`h-full ${
          isOpen ? "border-r w-52 sm:w-64 p-4 sm:py-6" : "w-0 border-r-0"
        } flex flex-col justify-between gap-2 transition-width duration-300`}
      >
        {isOpen && (
          <ScrollArea className="h-full">
            {pathname.includes("/dashboard/settings") && <Settings />}
            {pathname.startsWith("/dashboard/comments") && <CommentsSidebar />}
          </ScrollArea>
        )}
      </div>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-14 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-r-md"
        >
          &gt;
        </button>
      )}
      {isOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-l-md"
        >
          &lt;
        </button>
      )}
    </>
  );
};
