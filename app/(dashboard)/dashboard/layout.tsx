import { dashboardConfig } from "@/config/dashboard";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { currentUser } from "@/lib/auth";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={user} items={dashboardConfig.mainNav} scroll={false} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
