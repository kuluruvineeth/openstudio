"use client";

import { AlertBasic } from "@openstudio/ui/components/Alert";
import { Card } from "@openstudio/ui/components/ui/card";

//TODO: to list past run actions
export function History() {
  return (
    <Card>
      <AlertBasic
        title="No history"
        description="No AI comment assistant actions have been run yet."
      />
    </Card>
  );
}
