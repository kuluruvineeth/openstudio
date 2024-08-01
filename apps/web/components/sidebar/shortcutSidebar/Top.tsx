import { TOP_SIDEBAR_LINKS } from "@/utils/constants";
import { SidebarLink } from "@/components/sidebar/shortcutSidebar/SidebarLink";

export const Top = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      {TOP_SIDEBAR_LINKS.map((link, i) => (
        <SidebarLink
          key={`link_${i}`}
          href={link.href}
          Icon={link.Icon}
          hoverTextKey={link.hoverTextKey}
          include={link?.include}
        />
      ))}
    </div>
  );
};
