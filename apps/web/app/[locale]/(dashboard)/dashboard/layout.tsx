import { DashboardHeader } from "@/components/header/DashboardHeader";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ToggleSidebarProvider } from "@/context/ToggleSidebar";
import { PostHogIdentify } from "@/providers/PostHogProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Studio - Dashboard",
  description: "Manage your Youtube Studio with AI.",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToggleSidebarProvider>
      <PostHogIdentify />
      <div className="flex h-0 min-h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="relative p-4 md:p-6 lg:px-10 flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background ">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </ToggleSidebarProvider>
  );
};

export default DashboardLayout;
