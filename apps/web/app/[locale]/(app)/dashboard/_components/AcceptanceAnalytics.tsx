"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@openstudio/ui/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@openstudio/ui/components/ui/select";
import { AnalyticsQuery } from "@/app/api/youtube/analytics/validation";
import { useChannelAnalytics } from "@/hooks/youtube/useChannelAnalytics";
import { useQuery } from "@tanstack/react-query";
import { AcceptanceStats } from "@/app/api/youtube/analytics/controller";
import {
  BarChart,
  BarChartEventProps,
} from "../../../../../components/charts/barchart/BarChart";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { aggregateData } from "@/utils/groupBy";
import { useTranslations } from "next-intl";

export const AcceptanceAnalytics = (props: {
  query: AnalyticsQuery;
  refreshInterval: number;
}) => {
  const t = useTranslations("DASHBOARD");
  const [groupByPeriod, setGroupByPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("day");
  const [value, setValue] = React.useState<BarChartEventProps>(null);

  const { data, isLoading, error } = useQuery<AcceptanceStats[]>({
    queryKey: ["acceptanceAnalytics", props.query],
    queryFn: async () =>
      (await useChannelAnalytics(props.query)) as unknown as AcceptanceStats[],
    refetchOnWindowFocus: false,
    // refetchInterval: props.refreshInterval, //TODO: Need to uncomment after development phase, not needed for now
  });

  const [processedData, setProcessedData] = useState(() =>
    aggregateData(data ?? [], groupByPeriod, ["likes", "dislikes"]),
  );
  // Update processedData whenever data or groupByPeriod changes
  useEffect(() => {
    setProcessedData(
      aggregateData(data ?? [], groupByPeriod, ["likes", "dislikes"]),
    );
  }, [data, groupByPeriod]);

  return (
    <LoadingContent
      loading={isLoading}
      error={error}
      loadingComponent={<Skeleton className="h-64 w-full rounded" />}
    >
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>{t("ACCEPTANCE.TITLE")}</CardTitle>
            <CardDescription>{t("ACCEPTANCE.DESCRIPTION")}</CardDescription>
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
          <BarChart
            className="h-72"
            data={processedData}
            index="date"
            categories={["likes", "dislikes"]}
            yAxisWidth={60}
            onValueChange={(v) => setValue(v)}
            valueFormatter={(number: number) => number.toString()}
          />
        </CardContent>
      </Card>
    </LoadingContent>
  );
};
