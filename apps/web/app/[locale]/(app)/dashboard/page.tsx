import { DashboardHeader } from "@/components/header/DashboardHeader";

export default async function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <main className="h-full w-full">
        <h1>Dashboard</h1>
      </main>
    </>
  );
}
