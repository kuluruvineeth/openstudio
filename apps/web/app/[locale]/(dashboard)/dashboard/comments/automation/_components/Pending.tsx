"use client";

import { AlertBasic } from "@openstudio/ui/components/Alert";
import { Card } from "@openstudio/ui/components/ui/card";

//TODO: Later showing pending table
export function Pending() {
  return (
    <Card>
      <AlertBasic
        title="No pending actions"
        description="Set automations for our AI to handle incoming comments for you."
      />
    </Card>
  );
}
