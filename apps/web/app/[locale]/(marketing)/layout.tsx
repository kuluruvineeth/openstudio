import React from "react";
import Banner from "./_components/Banner";
import { SiteHeader } from "./_components/SiteHeader";
import GridPattern from "@openstudio/ui/components/GridPattern";
import { cn } from "@openstudio/ui/lib/utils";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <Banner />
      <SiteHeader />
      <main className="flex-1 container">{children}</main>
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "-z-10 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
        )}
      />
    </>
  );
}
