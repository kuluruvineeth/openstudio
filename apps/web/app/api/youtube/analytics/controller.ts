import { getYoutubeAnalyticsClient } from "@/utils/youtube/client";
import { AnalyticsQuery } from "./validation";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
  format,
} from "date-fns";

type Analytics<T extends number[]> = [string, ...T];

export type SubscribersAnalytics = Analytics<[number, number]>;
export type ChannelAnalytics = Analytics<
  [number, number, number, number, number]
>;

export type TransformedSubscriberStats = {
  date: string;
  subscribersGained: number;
  subscribersLost: number;
};

export type ChannelStats = {
  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  totalShares: number;
};

// Function to adjust dates based on dimension, DID NOT WORK
//TODO: Need to Rethink to get results in optimistic way
function adjustDatesForDimension(
  fromDate: string,
  toDate: string,
  dimension: string,
) {
  const parsedFromDate = parseISO(fromDate);
  const parsedToDate = parseISO(toDate);

  switch (dimension) {
    case "week":
      return {
        adjustedFromDate: format(startOfWeek(parsedFromDate), "yyyy-MM-dd"),
        adjustedToDate: format(endOfWeek(parsedToDate), "yyyy-MM-dd"),
      };
    case "month":
      return {
        adjustedFromDate: format(startOfMonth(parsedFromDate), "yyyy-MM-dd"),
        adjustedToDate: format(endOfMonth(parsedToDate), "yyyy-MM-dd"),
      };
    case "year":
      return {
        adjustedFromDate: format(startOfYear(parsedFromDate), "yyyy-MM-dd"),
        adjustedToDate: format(endOfYear(parsedToDate), "yyyy-MM-dd"),
      };
    default:
      return { adjustedFromDate: fromDate, adjustedToDate: toDate };
  }
}

export async function getAnalytics(
  options: AnalyticsQuery & {
    session: {
      accessToken: string;
      refreshToken: string;
      ownerEmail: string;
    };
  },
) {
  const youtubeAnalyticsClient = getYoutubeAnalyticsClient(options.session);

  const { dimensions, fromDate, toDate, metrics } = options;

  const { adjustedFromDate, adjustedToDate } = adjustDatesForDimension(
    fromDate,
    toDate,
    dimensions,
  );

  const response = await youtubeAnalyticsClient.reports.query({
    ids: "channel==MINE",
    startDate: adjustedFromDate,
    endDate: adjustedToDate,
    metrics: metrics.join(","),
    dimensions: dimensions,
  });

  return response.data.rows || [];
}

export const transformSubscribersStats = (
  data: SubscribersAnalytics[],
): TransformedSubscriberStats[] => {
  return data.map(([date, subscribersGained, subscribersLost]) => ({
    date,
    subscribersGained,
    subscribersLost,
  }));
};

export const calculateChannelStats = (
  data: ChannelAnalytics[],
): ChannelStats => {
  let totalViews = 0;
  let totalLikes = 0;
  let totalDislikes = 0;
  let totalComments = 0;
  let totalShares = 0;

  data.forEach(([, comments, shares, likes, views, dislikes]) => {
    totalViews += views;
    totalLikes += likes;
    totalDislikes += dislikes;
    totalComments += comments;
    totalShares += shares;
  });

  return {
    totalViews: totalViews,
    totalLikes: totalLikes,
    totalDislikes: totalDislikes,
    totalComments: totalComments,
    totalShares: totalShares,
  };
};
