"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@openstudio/ui/components/ui/navigation-menu";
import { cn } from "@openstudio/ui/lib/utils";
import Link from "next/link";
import { Icons } from "@openstudio/ui/components/Icons";

const components: {
  title: string;
  href: string;
  description: string;
  video?: string;
}[] = [
  {
    title: "Channel and Comment Analytics",
    href: "",
    description: "Checkout your youtube channel analytics in dashboard",
    video: "",
  },
];

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  video?: string;
  title: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "flex flex-col h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-4 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
            <div className="flex-1" />
            {props.video && (
              <video
                src={props.video}
                autoPlay
                loop
                muted
                className="rounded-xl border"
              />
            )}
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = "ListItem";

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href={"/"} className="mr-6 flex items-center gap-2">
        <Icons.logo className="h-4 w-6" />
        <span className="hidden font-bold sm:inline-block">Open Studio</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Open Studio
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        An Ultimate AI Assistant for your Youtube Channel
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/" title="Documentation">
                  How to get started with Open Studio
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent data-state="open">
              <ul className="grid w-[400px] grid-cols-1 gap-3 p-4 md:w-[300px] lg:grid-cols-3 lg:w-[900px]">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                    video={component.video}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={""} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Docs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={"/pricing"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
