"use client";

import { TransformedSubscriberStats } from "@/app/api/youtube/analytics/controller";
import { AnalyticsQuery } from "@/app/api/youtube/analytics/validation";
import { AreaChartInteractive } from "@/components/charts/AreaChartInteractive";
import { useChannelAnalytics } from "@/hooks/youtube/useChannelAnalytics";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export function SubscriberAnalytics(props: {
  query: AnalyticsQuery;
  refreshInterval: number;
}) {
  const { data, isLoading, error } = useQuery<TransformedSubscriberStats[]>({
    queryKey: ["subscriberAnalytics", props.query],
    queryFn: async () =>
      (await useChannelAnalytics(
        props.query,
      )) as unknown as TransformedSubscriberStats[],
    refetchOnWindowFocus: false,
    // refetchInterval: props.refreshInterval, //TODO: Need to uncomment after development phase, not needed for now
  });

  return (
    <LoadingContent
      loading={isLoading}
      error={error}
      loadingComponent={<Skeleton className="h-64 w-full rounded" />}
    >
      {data && (
        <div>
          <AreaChartInteractive data={data} />
        </div>
      )}
    </LoadingContent>
  );
}
