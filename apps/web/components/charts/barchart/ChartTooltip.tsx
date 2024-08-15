"use client";

import { cn } from "@openstudio/ui/lib/utils";
import React from "react";
import { ChartTooltipRow } from "./ChartTooltipRow";

interface ChartTooltipProps {
  active: boolean | undefined;
  payload: any; //TODO: be type specific
  label: string;
  valueFormatter: (value: number) => string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) => {
  if (active && payload) {
    const filteredPayload = payload.filter((item: any) => item.type !== "none");

    return (
      <div
        className={cn(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950",
        )}
      >
        <div
          className={cn(
            // base
            "border-b border-inherit px-4 py-2",
          )}
        >
          <p
            className={cn(
              // base
              "font-medium",
              // text color
              "text-gray-900 dark:text-gray-50",
            )}
          >
            {label}
          </p>
        </div>

        <div className={cn("space-y-1 px-4 py-2")}>
          {filteredPayload.map(
            (
              { value, name }: { value: number; name: string },
              index: number,
            ) => (
              <ChartTooltipRow
                key={`id-${index}`}
                value={valueFormatter(value)}
                name={name}
                color={cn(value >= 0 ? "bg-emerald-600" : "bg-rose-500")}
              />
            ),
          )}
        </div>
      </div>
    );
  }

  return null;
};
