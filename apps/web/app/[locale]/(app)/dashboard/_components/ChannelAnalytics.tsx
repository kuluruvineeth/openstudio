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
import { useTranslations } from "next-intl";

export function ChannelAnalytics(props: {
  query: AnalyticsQuery;
  refreshInterval: number;
}) {
  const t = useTranslations("DASHBOARD.CHANNEL");
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
                name: `${t("TOTAL_COMMENTS")}`,
                value: dataAnalytics.totalComments,
                subValue: `${t("COMMENTS")}`,
                icon: <MessageCircleIcon className="text-yellow-600" />,
              },
              {
                name: `${t("TOTAL_SHARES")}`,
                value: dataAnalytics.totalShares,
                subValue: `${t("SHARES")}`,
                icon: <Share2 className="text-blue-600" />,
              },
              {
                name: `${t("TOTAL_LIKES")}`,
                value: dataAnalytics.totalLikes,
                subValue: `${t("LIKES")}`,
                icon: <ThumbsUp className="text-green-600" />,
              },
              {
                name: `${t("TOTAL_VIEWS")}`,
                value: dataAnalytics.totalViews,
                subValue: `${t("VIEWS")}`,
                icon: <Eye className="text-violet-500" />,
              },
              {
                name: `${t("TOTAL_DISLIKES")}`,
                value: dataAnalytics.totalDislikes,
                subValue: `${t("DISLIKES")}`,
                icon: <ThumbsDown className="text-red-600" />,
              },
            ]}
          />
        </div>
      )}
    </LoadingContent>
  );
}
