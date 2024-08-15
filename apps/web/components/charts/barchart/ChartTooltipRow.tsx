import React from "react";
import { cn } from "@openstudio/ui/lib/utils";

interface ChartTooltipRowProps {
  value: string;
  name: string;
  color: string;
}

export const ChartTooltipRow = ({
  value,
  name,
  color,
}: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-sm", color)}
      />
      <p
        className={cn(
          // common
          "whitespace-nowrap text-right",
          // text color
          "text-gray-700 dark:text-gray-300",
        )}
      >
        {name}
      </p>
    </div>
    <p
      className={cn(
        // base
        "whitespace-nowrap text-right font-medium tabular-nums",
        // text color
        "text-gray-900 dark:text-gray-50",
      )}
    >
      {value}
    </p>
  </div>
);
