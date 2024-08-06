"use client";

import { ChannelStats } from "@/app/api/youtube/analytics/controller";
import { AnalyticsQuery } from "@/app/api/youtube/analytics/validation";
import { StatsCards } from "@/components/stats/StatsCards";
import { useChannelAnalytics } from "@/hooks/youtube/useChannelAnalytics";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  MessageCircleIcon,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

export function ChannelAnalytics(props: {
  query: AnalyticsQuery;
  refreshInterval: number;
}) {
  const {
    data: dataAnalytics,
    isLoading: isLoadingAnalytics,
    error: errorAnalytics,
  } = useQuery<ChannelStats>({
    queryKey: ["channelAnalytics", props.query],
    queryFn: async () =>
      (await useChannelAnalytics(props.query)) as ChannelStats,
    refetchOnWindowFocus: false,
    // refetchInterval: props.refreshInterval,
  });

  return (
    <LoadingContent
      loading={isLoadingAnalytics}
      error={errorAnalytics}
      loadingComponent={<Skeleton className="h-64 w-full rounded" />}
    >
      {dataAnalytics && (
        <div>
          <StatsCards
            stats={[
              {
                name: "Total Comments", //TODO: Should Localize Values
                value: dataAnalytics.totalComments,
                subValue: "comments",
                icon: <MessageCircleIcon className="text-yellow-600" />,
              },
              {
                name: "Total Shares",
                value: dataAnalytics.totalShares,
                subValue: "shares",
                icon: <Share2 className="text-blue-600" />,
              },
              {
                name: "Total Likes",
                value: dataAnalytics.totalLikes,
                subValue: "likes",
                icon: <ThumbsUp className="text-green-600" />,
              },
              {
                name: "Total Views",
                value: dataAnalytics.totalViews,
                subValue: "views",
                icon: <Eye className="text-violet-500" />,
              },
              {
                name: "Total Dislikes",
                value: dataAnalytics.totalDislikes,
                subValue: "dislikes",
                icon: <ThumbsDown className="text-red-600" />,
              },
            ]}
          />
        </div>
      )}
    </LoadingContent>
  );
}
