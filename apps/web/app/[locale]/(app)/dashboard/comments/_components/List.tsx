import { CommentItem } from "@/types/youtube/comment";
import { CommentList } from "./CommentList";
import { useMemo } from "react";
import countBy from "lodash/countBy";
import { useSearchParams } from "next/navigation";
import { capitalCase } from "change-case";
import { GroupHeading } from "@openstudio/ui/components/GroupHeading";
import { Tabs } from "@openstudio/ui/components/Tabs";

export function List(props: {
  comments: CommentItem[];
  type?: string;
  refetch: (removedCommentIds?: string[]) => void;
}) {
  const { comments, type, refetch } = props;
  const params = useSearchParams();
  const selectedTab = params.get("tab") || "all";
  const categories = useMemo(() => {
    return countBy(
      comments,
      (comments) => comments.category?.category || "Uncategorized",
    );
  }, [comments]);

  const tabs = useMemo(
    () => [
      {
        label: "All",
        value: "all",
        href: "/dashboard/comments?tab=all",
      },
      ...Object.entries(categories).map(([category, count]) => ({
        label: `${capitalCase(category)} (${count})`,
        value: category,
        href: `/dashboard/comments?tab=${category}`,
      })),
    ],
    [categories],
  );

  // only show tabs if there are categorized comments
  const showTabs = !!comments.find((comment) => comment.category);

  const filteredComments = useMemo(() => {
    if (selectedTab === "all") return comments;

    if (selectedTab === "Uncategorized") {
      return comments.filter((comment) => !comment.category?.category);
    }

    return comments.filter(
      (comment) => comment.category?.category === selectedTab,
    );
  }, [comments, selectedTab]);

  return (
    <>
      {showTabs && (
        <div className="border-b border-gray-200">
          <GroupHeading
            leftContent={
              <div className="overflow-x-auto py-2 md:max-w-lg lg:max-w-xl xl:max-w-3xl 2xl:max-w-4xl">
                <Tabs selected={selectedTab} tabs={tabs} breakpoint="xs" />
              </div>
            }
          />
        </div>
      )}
      {comments.length ? (
        <CommentList
          comments={filteredComments}
          refetch={refetch ?? (() => {})}
        />
      ) : (
        <></>
      )}
    </>
  );
}
