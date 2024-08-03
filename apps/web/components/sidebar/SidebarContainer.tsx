"use client";

import { useToggleSidebar } from "@/context/ToggleSidebar";
import { ShortcutSidebar } from "@/components/sidebar/shortcutSidebar/ShortcutSidebar";
import { CloseSidebar } from "@/components/sidebar/CloseSidebar";
import { OptionsSidebar } from "@/components/sidebar/optionsSidebar/OptionsSidebar";

interface SidebarContainerProps {}

export const SidebarContainer = ({}: SidebarContainerProps) => {
  const { isSidebarOpen, setIsSidebarOpen } = useToggleSidebar();

  return (
    <>
      <aside
        className={`fixed z-50 top-0 left-0 lg:static h-full bg-background border-r flex lg:translate-x-0 transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0 shadow-sm" : "translate-x-[-100%]"
        }`}
      >
        <ShortcutSidebar />
        <OptionsSidebar />
        <CloseSidebar />
      </aside>
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed h-screen w-full top-0 left-0 bg-black/80 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
};
