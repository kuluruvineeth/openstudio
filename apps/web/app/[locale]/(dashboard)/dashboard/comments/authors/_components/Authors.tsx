"use client";

import { DateRange } from "@/types/app";
import { OnboardingModal } from "@openstudio/ui/components/OnboardingModal";
import { TextLink } from "@openstudio/ui/components/Typography";
import { subDays } from "date-fns";
import { useMemo, useState } from "react";
import { ActionBar } from "../../../_components/ActionBar";
import { AuthorSummary } from "./AuthorSummary";
import { useWindowSize } from "usehooks-ts";
import { AuthorMobile, AuthorRowMobile } from "./AuthorMobile";
import { AuthorDesktop, AuthorRowDesktop } from "./AuthorDesktop";
import { Card } from "@openstudio/ui/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { ShortcutTooltip } from "./ShortcutTooltip";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import {
  AuthorStatsQuery,
  AuthorStatsResponse,
} from "@/app/api/user/stats/comments/authors/route";
import { getDateRangeParams } from "@/utils/date";
import { useExpanded } from "@/hooks/useExpanded";
import { Author } from "./types";
import { usePremiumModal } from "../../../premium/_components/PremiumModal";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { AuthorModal } from "./AuthorModal";
import { SearchBar } from "@openstudio/ui/components/SearchBar";

export default function Authors() {
  const now = useMemo(() => new Date(), []);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(now, parseInt("7")),
    to: now,
  });

  const [search, setSearch] = useState("");

  const params: AuthorStatsQuery = {
    limit: 100,
    ...getDateRangeParams(dateRange),
  };
  const urlParams = new URLSearchParams(params as any);

  const { data, isLoading, error, refetch } = useQuery<AuthorStatsResponse>({
    queryKey: ["authors", params],
    queryFn: async () => {
      const response = await api.get<AuthorStatsResponse>(
        `/user/stats/comments/authors?${urlParams}`,
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const windowSize = useWindowSize();

  const isMobile = windowSize.width < 768;

  const RowComponent = isMobile ? AuthorRowMobile : AuthorRowDesktop;

  const { expanded, extraWithoutIndex } = useExpanded();

  const [openedAuthor, setOpenedAuthor] = useState<Author>();

  const [selectedRow, setSelectedRow] = useState<Author | undefined>(undefined);

  const { PremiumModal, openModal } = usePremiumModal();

  const tableRows = data?.authors
    .filter(
      search
        ? (item) => item.name.toLowerCase().includes(search.toLowerCase())
        : Boolean,
    )
    .slice(0, expanded ? undefined : 5)
    .map((item) => (
      <RowComponent
        key={item.name}
        item={item}
        authorDisplayName={item.name}
        setOpenedAuthor={setOpenedAuthor}
        mutate={refetch}
        selected={selectedRow?.name === item.name}
        onSelectRow={() => {
          setSelectedRow(item);
        }}
        onDoubleClick={() => setOpenedAuthor(item)}
        hasApproveorBanAccess={false}
        refetchPremium={refetch}
        openPremiumModal={openModal}
      />
    ));
  return (
    <div>
      <div className="-top-7 z-10 flex flex-col justify-between gap-1 border-b bg-white px-2 py-2 shadow sm:sticky sm:flex-row sm:px-4">
        <OnboardingModal
          title="Getting started with Authors"
          description={
            <>
              Learn how to quickly approve or ban authors from commenting. You
              can read more in our <TextLink href={""}>documention</TextLink>.
            </>
          }
          videoId="WDNwUIBpsNk"
        />

        <div className="flex flex-wrap gap-1">
          <ActionBar dateRange={dateRange} onDateRangeUpdate={setDateRange} />
        </div>
      </div>

      <div className="m-2 sm:m-4">
        <AuthorSummary />
      </div>
      <Card className="mt-2 p-0 sm:mt-4">
        <div className="items-center justify-between px-2 pt-2 sm:px-6 sm:pt-6 md:flex">
          <SectionHeader
            title="Which audiences and comments do you get the most?"
            description="A list of all your audiences and their comments. Quickly approve or block the comments from this author."
          />
          <div className="mt-2 flex flex-wrap items-center justify-end gap-1 sm:gap-2 md:mt-0 lg:flex-nowrap">
            <div className="hidden md:block">
              <ShortcutTooltip isAuthorPage={true} />
            </div>

            <SearchBar onSearch={setSearch} />
          </div>
        </div>

        <LoadingContent
          loading={isLoading}
          error={error}
          loadingComponent={
            <div className="p-4">
              <Skeleton className="h-screen rounded" />
            </div>
          }
        >
          {isMobile ? (
            <AuthorMobile tableRows={tableRows} />
          ) : (
            <AuthorDesktop tableRows={tableRows} />
          )}
          <div className="mt-2 px-6 pb-6">{extraWithoutIndex()}</div>
        </LoadingContent>
      </Card>
      <AuthorModal
        dateRange={dateRange!}
        author={openedAuthor}
        onClose={() => setOpenedAuthor(undefined)}
      />
      <PremiumModal />
    </div>
  );
}
