import {
  ChannelStats,
  TransformedSubscriberStats,
} from "@/app/api/youtube/analytics/controller";
import { AnalyticsQuery } from "@/app/api/youtube/analytics/validation";
import { api } from "@/utils/api";

export type AnalyticsResponse =
  | TransformedSubscriberStats
  | ChannelStats
  | { error: string };

export const useChannelAnalytics = async (query: AnalyticsQuery) => {
  try {
    const { data } = await api.get<AnalyticsResponse>("/youtube/analytics", {
      params: {
        ...query,
      },
    });

    return data;
  } catch (error) {
    // Handle error appropriately
    console.error("Error fetching channel analytics:", error);
    return { error: "An error occurred while fetching analytics data" };
  }
};
