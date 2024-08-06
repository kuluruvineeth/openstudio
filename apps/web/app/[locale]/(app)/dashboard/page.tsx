import { DashboardHeader } from "@/components/header/DashboardHeader";
import Dashboard from "@/app/[locale]/(app)/dashboard/_components/Dashboard";

export default async function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <main className="h-full w-full">
        <Dashboard />
      </main>
    </>
  );
}
