import { Alert } from "@openstudio/ui/components/ui/alert";
import { Button } from "@openstudio/ui/components/ui/button";
import { Badge } from "@openstudio/ui/components/ui/badge";

export default function Page() {
  return (
    <main>
      <Button>Click me</Button>
      <Alert>Hello</Alert>
      <Badge variant="outline">Badge</Badge>
    </main>
  );
}
