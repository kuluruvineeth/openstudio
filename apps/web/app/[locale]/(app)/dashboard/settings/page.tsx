import { DashboardHeader } from "@/components/header/DashboardHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Studio - Settings",
};

const Settings = async () => {
  return (
    <>
      <DashboardHeader></DashboardHeader>
      <main>
        <h1>Settings Placeholder</h1>
      </main>
    </>
  );
};

export default Settings;
