import React from "react";
import Banner from "./_components/Banner";
import { SiteHeader } from "./_components/SiteHeader";

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
    </>
  );
}
