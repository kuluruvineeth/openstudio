"use client";

import { ActionBar } from "@/app/[locale]/(dashboard)/dashboard/_components/ActionBar";
import { DateRange } from "@/types/app";
import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { ChannelAnalytics } from "./ChannelAnalytics";
import { SubscriberAnalytics } from "./SubscriberAnalytics";
import { CommentAnalytics } from "./CommentAnalytics";
import { AcceptanceAnalytics } from "./AcceptanceAnalytics";
import { VisitorAnalytics } from "./VisitorAnalytics";
import { LoadStatsButton } from "./LoadStatsButton";
import { useStatLoader } from "@/providers/StatLoaderProvider";
import { useLocalStorage } from "usehooks-ts";
import { Banner } from "@openstudio/ui/components/Banner";
import { LoadProgress } from "./LoadProgress";

export default function Dashboard() {
  const now = useMemo(() => new Date(), []);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(now, parseInt("7")),
    to: now,
  });

  const { isLoading, onLoad } = useStatLoader();
  const refreshInterval = isLoading ? 5_000 : 1_000_000;
  useEffect(() => {
    onLoad({ loadBefore: false, showToast: false });
  }, [onLoad]);

  const [bannerVisible, setBannerVisible] = useLocalStorage<
    boolean | undefined
  >("commentDefaultBannerVisible", true);
  return (
    <>
      {bannerVisible && typeof window !== "undefined" && (
        <Banner
          title="Limited Comments Loaded"
          description="By default, 100-200 comments are loaded. To load more, please click on the 'Load more comments' button only if needed."
          onClose={() => setBannerVisible(false)}
        />
      )}
      <div className="pb-20">
        <div className="sticky -top-7 z-10 justify-end space-x-1 border-b bg-background px-4 py-2 shadow sm:flex">
          {isLoading ? <LoadProgress /> : <div />}
          <div className="space-y-1 sm:flex sm:space-x-1 sm:space-y-0">
            <ActionBar dateRange={dateRange} onDateRangeUpdate={setDateRange} />
            <LoadStatsButton />
          </div>
        </div>

        <div className="px-4 py-4">
          <ChannelAnalytics
            query={{
              dimensions: "day",
              fromDate: format(dateRange?.from!, "yyyy-MM-dd"),
              toDate: format(dateRange?.to!, "yyyy-MM-dd"),
              type: "channel",
              metrics: ["comments", "shares", "likes", "views", "dislikes"],
            }}
            refreshInterval={1_000_000}
          />
        </div>

        <div className="mt-4 py-4">
          <SubscriberAnalytics
            query={{
              dimensions: "day",
              fromDate: format(dateRange?.from!, "yyyy-MM-dd"),
              toDate: format(dateRange?.to!, "yyyy-MM-dd"),
              type: "subscribers",
              metrics: ["subscribersGained", "subscribersLost"],
            }}
            refreshInterval={1_000_000}
          />
        </div>

        <div className="mt-4 px-4">
          <CommentAnalytics
            query={{
              limit: 10,
              fromDate: +new Date(dateRange?.from!).getTime(),
              toDate: +new Date(dateRange?.to!).getTime(),
            }}
            refreshInterval={1_000_000}
          />
        </div>

        <div className="mt-4 px-4">
          <AcceptanceAnalytics
            query={{
              dimensions: "day",
              fromDate: format(dateRange?.from!, "yyyy-MM-dd"),
              toDate: format(dateRange?.to!, "yyyy-MM-dd"),
              type: "acceptance",
              metrics: ["likes", "dislikes"],
            }}
            refreshInterval={1_000_0000}
          />
        </div>

        <div className="mt-4 px-4">
          <VisitorAnalytics
            query={{
              dimensions: "day",
              fromDate: format(dateRange?.from!, "yyyy-MM-dd"),
              toDate: format(dateRange?.to!, "yyyy-MM-dd"),
              type: "visitors",
              metrics: ["views"],
            }}
            refreshInterval={1_000_0000}
          />
        </div>
      </div>
    </>
  );
}
