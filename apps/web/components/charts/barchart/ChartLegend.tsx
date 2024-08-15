"use client";

import { useOnWindowResize } from "@/hooks/useOnWindowResize";
import { Dispatch, SetStateAction, useRef } from "react";
import { Legend } from "./Legend";
import { cn } from "@openstudio/ui/lib/utils";

export const ChartLegend = (
  { payload }: any,
  setLegendHeight: Dispatch<SetStateAction<number>>,
  activeLegend: string | undefined,
  onClick?: (category: string, color: string) => void,
  enableLegendSlider?: boolean,
  legendPosition?: "left" | "center" | "right",
  yAxisWidth?: number,
) => {
  const legendRef = useRef<HTMLDivElement>(null);

  useOnWindowResize(() => {
    const calculateHeight = (height: number | undefined) =>
      height ? Number(height) + 15 : 60;
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
  });

  const filteredPayload = payload.filter((item: any) => item.type !== "none");

  const paddingLeft =
    legendPosition === "left" && yAxisWidth ? yAxisWidth - 8 : 0;

  return (
    <div
      style={{ paddingLeft: paddingLeft }}
      ref={legendRef}
      className={cn(
        "flex items-center",
        {
          "justify-center": legendPosition === "center",
        },
        {
          "justify-start": legendPosition === "left",
        },
        {
          "justify-end": legendPosition === "right",
        },
      )}
    >
      <Legend
        categories={filteredPayload.map((entry: any) => entry.value)}
        onClickLegendItem={onClick}
        activeLegend={activeLegend}
        enableLegendSlider={enableLegendSlider}
      />
    </div>
  );
};
