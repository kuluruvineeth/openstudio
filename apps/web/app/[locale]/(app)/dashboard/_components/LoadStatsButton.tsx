"use client";

import { useStatLoader } from "@/providers/StatLoaderProvider";
import { Button, ButtonLoader } from "@openstudio/ui/components/ui/button";
import { BarChart2Icon } from "lucide-react";

export function LoadStatsButton() {
  const { isLoading, onLoad } = useStatLoader();
  return (
    <div>
      <Button
        color="red"
        variant={"outline"}
        onClick={() => onLoad({ loadBefore: true, showToast: true })}
        disabled={isLoading}
      >
        {isLoading ? (
          <ButtonLoader />
        ) : (
          <BarChart2Icon className="mr-2 h-4 w-4" />
        )}
        Load more comments
      </Button>
    </div>
  );
}
