"use client";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { dashboardConfig } from "@/config/dashboard";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DefaultLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={null} items={dashboardConfig.mainNav} scroll={false} />
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel
            defaultSize={200}
            className="min-w-[20px] max-w-[200px]"
          >
            <div className="h-screen bg-gray-200 p-4">Sidebar</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <div className="h-screen bg-gray-300 p-4">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <SiteFooter />
    </div>
  );
}
