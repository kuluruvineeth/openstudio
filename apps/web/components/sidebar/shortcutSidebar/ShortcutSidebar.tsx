import { ScrollArea } from "@openstudio/ui/components/ui/scroll-area";
import { Top } from "@/components/sidebar/shortcutSidebar/Top";
import { Bottom } from "@/components/sidebar/shortcutSidebar/Bottom";

interface ShortcutSidebarProps {}

export const ShortcutSidebar = ({}: ShortcutSidebarProps) => {
  return (
    <div className="flex flex-col justify-between items-center h-full p-1 sm:py-6 border-r gap-2">
      <ScrollArea className="max-h-[35rem]">
        <div className="w-full space-y-3 p-1">
          <Top />
        </div>
      </ScrollArea>
      <Bottom />
    </div>
  );
};
