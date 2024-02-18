"use client";
import * as React from "react";
import {
  BadgeDollarSign,
  BarChart,
  Briefcase,
  Building,
  CreditCard,
  DollarSign,
  HelpCircle,
  Layers,
  LayoutDashboard,
  PiggyBank,
  Repeat2,
  Settings,
  Sparkle,
  Sprout,
  Tag,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WorkspaceSwitcher } from "@/app/(dashboard)/dashboard/_components/workspace-switcher";
import FileUploadPage from "@/app/(dashboard)/dashboard/fileupload/page";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import Home from "@/components/fileupload/test";
import { Nav } from "@/components/dashboard/nav";
import { dashboardConfig } from "@/config/dashboard";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { currentUser } from "@/lib/auth";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // const user = await currentUser();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={null} items={dashboardConfig.mainNav} scroll={false} />
      <div className="flex-1">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes
              )}`;
            }}
            className="h-full max-h-[1200px] items-stretch"
          >
            <ResizablePanel
              defaultSize={20}
              collapsedSize={4}
              collapsible={true}
              minSize={15}
              maxSize={20}
              onCollapse={() => {
                // setIsCollapsed(collapsed);
                // document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                //   collapsed
                // )}`;
              }}
              className={cn(
                isCollapsed &&
                  "min-w-[50px] transition-all duration-300 ease-in-out"
              )}
            >
              <div
                className={cn(
                  "flex h-[52px] items-center justify-center px-2",
                  isCollapsed ? "h-[52px]" : "px-2"
                )}
              >
                <WorkspaceSwitcher isCollapsed={isCollapsed} />
              </div>
              <Separator />
              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Dashboard",
                    label: "",
                    icon: LayoutDashboard,
                    variant: "default",
                    link: "/dashboard/",
                  },
                  {
                    title: "Video Gallery",
                    label: "9",
                    icon: Layers,
                    variant: "ghost",
                    link: "/dashboard/video-gallery",
                  },
                  {
                    title: "Video Upload",
                    label: "3",
                    icon: CreditCard,
                    variant: "ghost",
                    link: "/dashboard/video-upload",
                  },
                  {
                    title: "Investments",
                    label: "",
                    icon: BarChart,
                    variant: "ghost",
                    link: "/dashboard/investments",
                  },
                  {
                    title: "Categories",
                    label: "",
                    icon: Tag,
                    variant: "ghost",
                    link: "/dashboard/categories",
                  },
                  {
                    title: "Recurring",
                    label: "",
                    icon: Repeat2,
                    variant: "ghost",
                    link: "/dashboard/recurring",
                  },
                ]}
              />
              <Separator />
              {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Ai Magic",
                label: "",
                icon: Sparkle,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Save Money",
                label: "",
                icon: Wallet,
                variant: "ghost",
                link: "/dashboard/savemoney",
              },
              {
                title: "Grow Assets",
                label: "",
                icon: Sprout,
                variant: "ghost",
                link: "/dashboard/",
              },
            ]}
          /> */}
              <Separator />
              {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Credit Card",
                label: "972",
                icon: CreditCard,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Credit Card",
                label: "342",
                icon: CreditCard,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Checking",
                label: "128",
                icon: DollarSign,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Savings",
                label: "8",
                icon: PiggyBank,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Banking",
                label: "21",
                icon: Building,
                variant: "ghost",
                link: "/dashboard/",
              },
            ]}
          /> */}
              <Separator />
              {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Funds",
                label: "483",
                icon: Briefcase,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Coinbase",
                label: "145",
                icon: BadgeDollarSign,
                variant: "ghost",
                link: "/dashboard/",
              },
            ]}
          /> */}
              <Separator />
              {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Get help",
                label: "",
                icon: HelpCircle,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Settings",
                label: "",
                icon: Settings,
                variant: "ghost",
                link: "/dashboard/settings",
              },
            ]}
          /> */}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={30}>
              <ScrollArea className="h-screen">
                <div className="flex h-[52px] items-center px-4 py-2">
                  <h1 className="text-xl font-bold">Dashboard</h1>
                </div>
                <Separator />

                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  {/* <FileUploadPage /> */}
                  {/* <UploadDropZone /> */}
                  {/* <UploadPipeline /> */}
                  <Home />
                </div>

                {/* <CardsStats /> */}
                {/* <div className="ml-6 mt-6 flex gap-4"> */}
                <div className="mx-6 mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                  {/* <TransactionsReviewTable />
              <TopCategoriesTable /> */}
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
