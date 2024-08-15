"use server";
import { OpenSidebar } from "@/components/header/OpenSidebar";
import { cn } from "@openstudio/ui/lib/utils";
import { ReactNode } from "react";
import { User as UserComponent } from "@/components/header/User";
import { getUserData } from "@/actions/GetUserData";
import { redirect } from "next/navigation";

interface DashboardHeaderProps {
  className?: string;
  children?: ReactNode;
}

export const DashboardHeader = async ({
  className,
  children,
}: DashboardHeaderProps) => {
  const user = await getUserData();
  if (!user) redirect("/login"); //TODO: Is it really needed here
  return (
    <header
      className={cn(
        "w-full flex justify-between items-center mb-4 py-2 gap-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <OpenSidebar />
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {children}
        </div>
        <UserComponent
          profileImage={user?.avatar_url}
          username={user?.name}
          email={user?.email}
        />
      </div>
    </header>
  );
};
