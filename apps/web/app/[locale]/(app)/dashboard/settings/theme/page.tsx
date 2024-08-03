import { DashboardHeader } from "@/components/header/DashboardHeader";
import { Theme } from "@/components/settings/theme/Theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Studio - Theme Settings",
};

const ThemeSettings = async () => {
  return (
    <>
      <DashboardHeader></DashboardHeader>
      <Theme />
    </>
  );
};

export default ThemeSettings;
