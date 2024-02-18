"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DefaultLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel
          defaultSize={20}
          className="min-w-[200px] max-w-[400px]"
        >
          <div className="h-full bg-gray-200 p-4">Sidebar</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className="h-full bg-gray-300 p-4">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
