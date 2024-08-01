import { useToggleSidebar } from "@/context/ToggleSidebar";
import { Button } from "@openstudio/ui/components/ui/button";
import { PanelLeftClose } from "lucide-react";

export const CloseSidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useToggleSidebar();

  return (
    <Button
      onClick={() => {
        setIsSidebarOpen(false);
      }}
      className={`absolute right-[-2.5rem] top-10 z-40 rounded-tl-none rounded-bl-none lg:hidden ${
        !isSidebarOpen ? "hidden" : ""
      }`}
      size={"icon"}
      variant={"secondary"}
    >
      <PanelLeftClose />
    </Button>
  );
};
