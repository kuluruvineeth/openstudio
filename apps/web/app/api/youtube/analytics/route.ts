import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import {
  calculateChannelStats,
  ChannelAnalytics,
  getAnalytics,
  SubscribersAnalytics,
  transformSubscribersStats,
} from "./controller";
import { auth } from "@/utils/auth";
import { analyticsQuery } from "./validation";

export const GET = withError(async (request: Request) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" });
  }

  const { searchParams } = new URL(request.url);

  const query = analyticsQuery.parse({
    dimensions: searchParams.get("dimensions"),
    fromDate: searchParams.get("fromDate"),
    toDate: searchParams.get("toDate"),
    metrics: searchParams.getAll("metrics[]"),
    type: searchParams.get("type"),
  });
  let analytics;

  const rawAnalytics = await getAnalytics({
    session,
    ...query,
  });

  if (query.type === "channel") {
    analytics = calculateChannelStats(rawAnalytics as ChannelAnalytics[]);
  } else if (query.type === "subscribers") {
    analytics = transformSubscribersStats(
      rawAnalytics as SubscribersAnalytics[],
    );
  } else {
    return NextResponse.json({ error: "Invalid Params" });
  }

  return NextResponse.json(analytics);
});
