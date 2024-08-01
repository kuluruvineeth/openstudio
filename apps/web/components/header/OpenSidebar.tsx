"use client";

import { useToggleSidebar } from "@/context/ToggleSidebar";
import { Button } from "@openstudio/ui/components/ui/button";
import { PanelLeftOpen } from "lucide-react";

export const OpenSidebar = () => {
  const { setIsSidebarOpen } = useToggleSidebar();

  return (
    <Button
      onClick={() => {
        setIsSidebarOpen(true);
      }}
      className="text-muted-foreground lg:hidden"
      variant={"ghost"}
      size={"icon"}
    >
      <PanelLeftOpen />
    </Button>
  );
};
