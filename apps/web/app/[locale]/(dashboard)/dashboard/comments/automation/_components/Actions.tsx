"use client";

import { RulesResponse } from "@/app/api/user/rules/route";
import { getActionColor } from "@/components/PlanBadge";
import { Badge } from "@openstudio/ui/components/Badge";
import { capitalCase } from "change-case";

export function Actions({
  actions,
}: {
  actions: RulesResponse[number]["action"];
}) {
  return (
    <div className="flex flex-1 space-x-2">
      {actions?.map((action) => {
        return (
          <Badge key={action.id} color={getActionColor(action.type)}>
            {capitalCase(action.type)}
          </Badge>
        );
      })}
    </div>
  );
}
