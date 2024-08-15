import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import {
  AcceptanceAnalytics,
  calculateChannelStats,
  ChannelAnalytics,
  getAcceptanceStats,
  getAnalytics,
  getVistorStats,
  SubscribersAnalytics,
  transformSubscribersStats,
  VisitorAnalytics,
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

  switch (query.type) {
    case "channel":
      analytics = calculateChannelStats(rawAnalytics as ChannelAnalytics[]);
      break;
    case "subscribers":
      analytics = transformSubscribersStats(
        rawAnalytics as SubscribersAnalytics[],
      );
      break;
    case "acceptance":
      analytics = getAcceptanceStats(rawAnalytics as AcceptanceAnalytics[]);
      break;
    case "visitors":
      analytics = getVistorStats(rawAnalytics as VisitorAnalytics[]);
      break;
    default:
      return NextResponse.json({ error: "Invalid Params" });
  }

  return NextResponse.json(analytics);
});
