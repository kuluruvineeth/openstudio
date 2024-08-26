"use client";

import { Tooltip } from "@openstudio/ui/components/Tooltip";
import { Button } from "@openstudio/ui/components/ui/button";
import { SquareSlashIcon } from "lucide-react";

export function ShortcutTooltip({
  isAuthorPage = false,
}: {
  isAuthorPage: boolean;
}) {
  return (
    <Tooltip
      contentComponent={
        <div>
          <h3 className="mb-1 font-semibold">Shortcuts:</h3>
          {isAuthorPage && (
            <>
              {" "}
              <p>B - Ban Author</p>
              <p>A - Approve Author</p>
            </>
          )}
          <p>Up/down - navigate</p>
          <p>Enter - View more</p>
        </div>
      }
    >
      <Button size={"icon"} variant={"link"}>
        <SquareSlashIcon className="h-5 w-5" />
      </Button>
    </Tooltip>
  );
}
