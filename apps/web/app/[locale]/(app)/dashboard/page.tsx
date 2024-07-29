"use client";
import { Alert } from "@openstudio/ui/components/ui/alert";
import { Button } from "@openstudio/ui/components/ui/button";
import { Badge } from "@openstudio/ui/components/ui/badge";
import { useTranslations } from "next-intl";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { toastSuccess } from "@openstudio/ui/components/Toast";

export default function Page() {
  const t = useTranslations("Index");
  const router = useRouter();

  const onLogout = async () => {
    await supabaseBrowserClient.auth.signOut();
    toastSuccess({
      title: "Logout",
      description: "You have been logged out",
    });
    router.push("/");
  };

  return (
    <main>
      <h1>{t("title")}</h1>;<Button onClick={onLogout}>Log Out</Button>
      <Alert>Dashboard</Alert>
      <Badge variant="outline">Dashboard</Badge>
    </main>
  );
}
