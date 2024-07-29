import { Alert } from "@openstudio/ui/components/ui/alert";
import { Button } from "@openstudio/ui/components/ui/button";
import { Badge } from "@openstudio/ui/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Index");

  return (
    <main>
      <h1>{t("title")}</h1>;
      <ModeToggle />
      <Button>Dashboard</Button>
      <Alert>Dashboard</Alert>
      <Badge variant="outline">Dashboard</Badge>
    </main>
  );
}
