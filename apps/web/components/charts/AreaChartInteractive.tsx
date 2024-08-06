"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@openstudio/ui/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@openstudio/ui/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@openstudio/ui/components/ui/select";
import { endOfWeek, format, parseISO, startOfWeek } from "date-fns";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  subscribersGained: {
    label: "Subscribers Gained",
    color: "hsl(var(--chart-1))",
  },
  subscribersLost: {
    label: "Subscribers Lost",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function groupBy<T>(
  data: T[],
  keyGetter: (item: T) => string,
): Map<string, T[]> {
  const map = new Map();
  data.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function aggregateData(
  data: { date: string; subscribersGained: number; subscribersLost: number }[],
  period: "day" | "week" | "month" | "year",
): { date: string; subscribersGained: number; subscribersLost: number }[] {
  const formatOptions = {
    day: "yyyy-MM-dd",
    week: "yyyy-ww",
    month: "yyyy-MM",
    year: "yyyy",
  };

  const groupedData = groupBy(data, (item) => {
    if (period === "week") {
      const date = new Date(item.date);
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(start, "yyyy-MM-dd")} to ${format(end, "yyyy-MM-dd")}`;
    } else {
      return format(new Date(item.date), formatOptions[period]);
    }
  });

  return Array.from(groupedData, ([date, items]) => {
    return {
      date,
      subscribersGained: items.reduce(
        (acc, item) => acc + item.subscribersGained,
        0,
      ),
      subscribersLost: items.reduce(
        (acc, item) => acc + item.subscribersLost,
        0,
      ),
    };
  });
}

export function AreaChartInteractive(props: {
  data: { date: string; subscribersGained: number; subscribersLost: number }[];
}) {
  const [groupByPeriod, setGroupByPeriod] = React.useState<
    "day" | "week" | "month" | "year"
  >("day");

  const processedData = aggregateData(props.data, groupByPeriod);

  const getTickFormatter = (period: "day" | "week" | "month" | "year") => {
    const formatOptions = {
      day: "LLL d",
      week: "LLL d",
      month: "LLL yyyy",
      year: "yyyy",
    };
    return (value: string) => {
      if (period === "week") {
        const [start, end] = value.split(" to ");
        return `${format(parseISO(start!), "LLL d")} - ${format(parseISO(end!), "LLL d")}`;
      } else {
        const date = parseISO(value);
        return format(date, formatOptions[period]);
      }
    };
  };

  //TODO: All hard coded texts should be moved to localized messages arrays
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Subscribers Gained Vs Subscribers Lost</CardTitle>
          <CardDescription>
            Showing total count for the selected date range
          </CardDescription>
        </div>
        <Select
          value={groupByPeriod}
          onValueChange={(value) =>
            setGroupByPeriod(value as "day" | "week" | "month" | "year")
          }
        >
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Select grouping period"
          >
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="day" className="rounded-lg">
              Day
            </SelectItem>
            <SelectItem value="week" className="rounded-lg">
              Week
            </SelectItem>
            <SelectItem value="month" className="rounded-lg">
              Month
            </SelectItem>
            <SelectItem value="year" className="rounded-lg">
              Year
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={processedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={getTickFormatter(groupByPeriod)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return getTickFormatter(groupByPeriod)(value);
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="subscribersLost"
              type="natural"
              fill="#fa1605"
              stroke="#fa1605"
              stackId="a"
            />
            <Area
              dataKey="subscribersGained"
              type="natural"
              fill="#06f512"
              stroke="#06f512"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
