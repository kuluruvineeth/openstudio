"use client";
import React from "react";
import { cn } from "@openstudio/ui/lib/utils";

//#region shape
export function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export const RenderShape = (
  props: any, //TODO: be type specific
  activeBar: any | undefined,
  activeLegend: string | undefined,
  layout: string,
  positiveFillColor: string,
  negativeFillColor: string,
) => {
  const { fillOpacity, name, payload, value } = props;

  let { x, width, y, height } = props;

  if (layout === "horizontal" && height < 0) {
    y += height;
    height = Math.abs(height); // height must be a positive number
  } else if (layout === "vertical" && width < 0) {
    x += width;
    width = Math.abs(width); //width must be a positive number
  }

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className={cn(value >= 0 ? positiveFillColor : negativeFillColor)}
      opacity={
        activeBar || (activeLegend && activeLegend !== name)
          ? deepEqual(activeBar, { ...payload, value })
            ? fillOpacity
            : 0.3
          : fillOpacity
      }
    />
  );
};
