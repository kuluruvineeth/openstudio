"use client";

import { AnalyticsQuery } from "@/app/api/youtube/analytics/validation";
import { useChannelAnalytics } from "@/hooks/youtube/useChannelAnalytics";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
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
import { TransformedSubscriberStats } from "@/app/api/youtube/analytics/controller";
import { aggregateData } from "@/utils/groupBy";
import { useTranslations } from "next-intl";

const chartConfig = {
  subscribersGained: {
    label: "Subscribers Gained",
    color: "hsl(var(--chart-1))",
  },
  subscribersLost: {
    label: "Subscribers Lost",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SubscriberAnalytics(props: {
  query: AnalyticsQuery;
  refreshInterval: number;
}) {
  const t = useTranslations("DASHBOARD");
  const [groupByPeriod, setGroupByPeriod] = React.useState<
    "day" | "week" | "month" | "year"
  >("day");

  const { data, isLoading, error } = useQuery<TransformedSubscriberStats[]>({
    queryKey: ["subscriberAnalytics", props.query],
    queryFn: async () =>
      (await useChannelAnalytics(
        props.query,
      )) as unknown as TransformedSubscriberStats[],
    refetchOnWindowFocus: false,
    // refetchInterval: props.refreshInterval, //TODO: Need to uncomment after development phase, not needed for now
  });

  const [processedData, setProcessedData] = useState(() =>
    aggregateData(data ?? [], groupByPeriod, [
      "subscribersGained",
      "subscribersLost",
    ]),
  );

  // Update processedData whenever data or groupByPeriod changes
  useEffect(() => {
    setProcessedData(
      aggregateData(data ?? [], groupByPeriod, [
        "subscribersGained",
        "subscribersLost",
      ]),
    );
  }, [data, groupByPeriod]);

  return (
    <LoadingContent
      loading={isLoading}
      error={error}
      loadingComponent={<Skeleton className="h-64 w-full rounded" />}
    >
      {data && (
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>{t("SUBSCRIBER.TITLE")}</CardTitle>
              <CardDescription>{t("SUBSCRIBER.DESCRIPTION")}</CardDescription>
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
                  {t("GROUP_BY.DAY")}
                </SelectItem>
                <SelectItem value="week" className="rounded-lg">
                  {t("GROUP_BY.WEEK")}
                </SelectItem>
                <SelectItem value="month" className="rounded-lg">
                  {t("GROUP_BY.MONTH")}
                </SelectItem>
                <SelectItem value="year" className="rounded-lg">
                  {t("GROUP_BY.YEAR")}
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
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
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
      )}
    </LoadingContent>
  );
}
