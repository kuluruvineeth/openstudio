import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import {
  getYoutubeAnalyticsClient,
  getYoutubeDataClient,
} from "@/utils/youtube/client";
import { youtube_v3, youtubeAnalytics_v2 } from "googleapis";
import { NextResponse } from "next/server";

async function getStats(options: {
  youtubeData: youtube_v3.Youtube;
  youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics;
}) {
  const { youtubeData, youtubeAnalytics } = options;

  const now = new Date();
  const thirtyDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 30,
  );

  const sevenDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7,
  );

  const channel = await youtubeData.channels.list({ part: ["id"], mine: true });

  const channelId = channel?.data?.items?.[0]?.id;
  const startDate = thirtyDaysAgo.toISOString().split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];

  const [comments30days, comments7days] = await Promise.all([
    youtubeAnalytics.reports.query({
      ids: `channel==${channelId}`,
      startDate: startDate,
      endDate: endDate,
      metrics: "comments",
    }),
    youtubeAnalytics.reports.query({
      ids: `channel==${channelId}`,
      startDate: sevenDaysAgo.toISOString().split("T")[0],
      endDate: endDate,
      metrics: "comments",
    }),
  ]);
  return {
    commentsIn30days: comments30days?.data?.rows?.[0]?.[0] ?? 0,
    commentsIn7days: comments7days?.data?.rows?.[0]?.[0] ?? 0,
  };
}

export const GET = withError(async () => {
  const session = await auth();

  if (!session) {
    return NextResponse.json({
      error: "Not authenticated",
    });
  }

  const accessToken = session.accessToken;
  const refreshToken = session.refreshToken;

  const youtubeData = getYoutubeDataClient({
    accessToken,
    refreshToken,
  });

  const youtubeAnalytics = getYoutubeAnalyticsClient({
    accessToken,
    refreshToken,
  });

  const result = await getStats({
    youtubeData,
    youtubeAnalytics,
  });

  return NextResponse.json(result);
});
