import { cn } from "@openstudio/ui/lib/utils";
import { Checkbox } from "@openstudio/ui/components/Checkbox";
import {
  ForwardedRef,
  forwardRef,
  MouseEventHandler,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { CommentItem } from "@/types/youtube/comment";
import { ActionButtons } from "./ActionButtons";
import { CommentDate } from "./CommentDate";
import { CategoryBadge } from "./CategoryBadge";
import { useAiQueueStore } from "@/store/queue";
import { PlanBadge } from "./PlanBadge";
import { PlanActions } from "./PlanActions";

export const CommentListItem = forwardRef(
  (
    props: {
      comment: CommentItem;
      splitView: boolean;
      opened: boolean;
      onClick: MouseEventHandler<HTMLLIElement>;
      closePanel: () => void;
      selected: boolean;
      onSelected: (id: string) => void;
      isCategorizing: boolean;
      onAiCategorize: (comment: CommentItem) => void;
      onPlanAiAction: (comment: CommentItem) => void;
      executingPlan: boolean;
      rejectingPlan: boolean;
      executePlan: (comment: CommentItem) => Promise<void>;
      rejectPlan: (comment: CommentItem) => Promise<void>;
      refetch: () => void;
    },
    ref: ForwardedRef<HTMLLIElement>,
  ) => {
    const {
      comment,
      splitView,
      selected,
      onAiCategorize,
      onSelected,
      isCategorizing,
      refetch,
      opened,
      onClick,
      closePanel,
    } = props;
    const preventPropagation: MouseEventHandler<HTMLSpanElement> = useCallback(
      (e) => e.stopPropagation(),
      [],
    );

    const onRowSelected = useCallback(
      () => onSelected(comment.commentId!),
      [onSelected, comment.commentId!],
    );

    const isInAiQueue = useAiQueueStore((state) => state.isInAiQueue);
    const isPlanning = useMemo(
      () => isInAiQueue(props.comment.commentId!),
      [props.comment.commentId, isInAiQueue],
    );

    return (
      <li
        ref={ref}
        className={cn("group relative cursor-pointer border-l-0 py-3 ", {
          "hover:bg-gray-50 dark:hover:bg-red-50": !selected && !opened,
          "bg-red-50": selected,
          "bg-red-100": opened,
        })}
        onClick={onClick}
      >
        <div className="px-4">
          <div className="mx-auto flex">
            {/* left */}
            <div className="flex flex-1 flex-col overflow-hidden whitespace-nowrap text-sm leading-6">
              <div>
                <div className="w-40 min-w-0 overflow-hidden truncate font-semibold text-gray-900">
                  <div className="flex">
                    <div
                      className="mr-3 flex items-center pl-1"
                      onClick={preventPropagation}
                    >
                      <Checkbox checked={selected} onChange={onRowSelected} />
                    </div>
                    <Image
                      src={comment.authorProfileImageUrl!}
                      alt="Author Image"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />

                    <span className="ml-4 font-normal text-gray-500">
                      {comment.authorDisplayName}
                    </span>
                  </div>
                </div>

                {!splitView && (
                  <div className="min-w-0 overflow-hidden pl-1 font-normal text-gray-700">
                    {comment.commentedText}
                  </div>
                )}
              </div>
              {!splitView && (
                <div className="mt-2 flex flex-1 items-center overflow-hidden truncate font-normal leading-5 text-gray-500">
                  <Image
                    src={comment.videoThumbnail!}
                    width={150}
                    height={150}
                    alt="Video Thumbnail"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-bold">{comment.videoTitle}</h1>
                  </div>
                </div>
              )}
            </div>
            {/* right */}
            <div className="flex items-center justify-between">
              <div className="relative flex items-center">
                <div
                  className="absolute right-0 z-20 hidden group-hover:block"
                  // prevent comment panel being opened when clicking on action buttons
                  onClick={preventPropagation}
                >
                  <ActionButtons
                    commentId={comment.commentId!}
                    shadow
                    isCategorizing={isCategorizing}
                    isPlanning={isPlanning}
                    onPlanAiAction={() => props.onPlanAiAction(comment)}
                    onAiCategorize={() => onAiCategorize(comment)}
                    refetch={refetch}
                  />
                </div>
                <CommentDate date={new Date(comment.commentedAt!)} />

                {!!(comment.category?.category || comment.plan) && (
                  <div className="ml-3 flex items-center whitespace-nowrap">
                    {comment.category?.category ? (
                      <CategoryBadge category={comment.category.category} />
                    ) : null}
                    <PlanBadge plan={comment.plan} />

                    <PlanActions
                      comment={comment}
                      executePlan={props.executePlan}
                      rejectPlan={props.rejectPlan}
                      executingPlan={props.executingPlan}
                      rejectingPlan={props.rejectingPlan}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  },
);

CommentListItem.displayName = "CommentListItem";
