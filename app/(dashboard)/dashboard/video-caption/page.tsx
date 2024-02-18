import { fetchVideos } from "@/actions/get-videos";
import { Dashboard } from "@/components/dashboard/dashboard";
import Home from "@/components/fileupload/test";
import { VideosDashboard } from "@/components/videos/components/videos-caption-dashboard";
import { cookies } from "next/headers";

// import { Dashboard } from "@/components/new-dashboard/components/dashboard-1";
// import { accounts, mails } from "@/components/new-dashboard/data";

export const metadata = {
  title: "Dasboard",
  description: "Dashboard description",
};

export default async function DashboardPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  const videos = await fetchVideos();

  return (
    <>
      <div className="flex flex-col">
        <VideosDashboard
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
          videos={videos}
        />
      </div>
    </>
  );
}
