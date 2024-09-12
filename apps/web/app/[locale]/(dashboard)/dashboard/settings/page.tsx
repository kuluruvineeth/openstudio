import { Metadata } from "next";
import { Separator } from "@openstudio/ui/components/ui/separator";
import { Account } from "./_components/Account";

export const metadata: Metadata = {
  title: "Open Studio - Settings",
};

const Settings = async () => {
  return (
    <>
      <main>
        <div className="p-4 sm:p-6">
          <Separator />
        </div>
        <Account />
      </main>
    </>
  );
};

export default Settings;
