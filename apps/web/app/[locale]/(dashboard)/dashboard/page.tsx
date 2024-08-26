import Dashboard from "@/app/[locale]/(dashboard)/dashboard/_components/Dashboard";

export default async function DashboardPage() {
  return (
    <>
      <main className="h-full w-full">
        <Dashboard />
      </main>
    </>
  );
}
