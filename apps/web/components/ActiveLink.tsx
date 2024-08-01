"use client";

import { useToggleSidebar } from "@/context/ToggleSidebar";
import { Link, usePathname } from "@/utils/navigation";
import { buttonVariants } from "@openstudio/ui/components/ui/button";
import { cn } from "@openstudio/ui/lib/utils";
import React from "react";

interface ActiveLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  include?: string;
  creativespaceIcon?: boolean;
  disableActiveStateColor?: boolean;
}

const ActiveLink = React.forwardRef<HTMLAnchorElement, ActiveLinkProps>(
  (
    {
      href,
      className,
      variant = "default",
      size = "default",
      children,
      include,
      creativespaceIcon,
      disableActiveStateColor = false,
      ...props
    }: ActiveLinkProps,
    ref,
  ) => {
    const { setIsSidebarOpen } = useToggleSidebar();
    const pathname = usePathname();

    return (
      <Link
        onClick={() => {
          setIsSidebarOpen(false);
        }}
        href={href}
        className={cn(
          `${buttonVariants({
            variant: variant,
            size: size,
          })} ${
            href === (pathname || (include && pathname.includes(include)))
              ? creativespaceIcon
                ? "font-semibold border-secondary-foreground border-2 "
                : disableActiveStateColor
                  ? ""
                  : "bg-secondary font-semibold"
              : ""
          } `,
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

ActiveLink.displayName = "ActiveLink";

export default ActiveLink;
