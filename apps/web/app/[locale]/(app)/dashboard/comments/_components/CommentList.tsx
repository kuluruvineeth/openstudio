import { CommentItem } from "@/types/youtube/comment";
import { Checkbox } from "@openstudio/ui/components/Checkbox";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActionButtonsBulk } from "./ActionButtonsBulk";
import { MessageText } from "@openstudio/ui/components/Typography";
import { ResizeGroup } from "./ResizeGroup";
import { CommentListItem } from "./CommentListItem";
import { toast } from "sonner";
import { categorizeAction } from "@/actions/Categorize";
import { isActionError } from "@/utils/error";
import { capitalCase } from "change-case";

export function CommentList(props: {
  comments: CommentItem[];
  emptyMessage?: React.ReactNode;
  hideActionBarWhenEmpty?: boolean;
  refetch?: (removedCommentIds?: string[]) => void;
}) {
  const {
    comments,
    hideActionBarWhenEmpty,
    emptyMessage,
    refetch = () => {},
  } = props;

  const isEmpty = comments.length === 0;

  const listRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<Map<string, HTMLLIElement> | null>(null);

  // https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  const [isCategorizing, setIsCategorizing] = useState<Record<string, boolean>>(
    {},
  );
  // if checkbox for a row has been checked
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const onSetSelectedRow = useCallback(
    (id: string) => {
      setSelectedRows((s) => ({ ...s, [id]: !s[id] }));
    },
    [setSelectedRows],
  );

  const isAllSelected = useMemo(() => {
    return comments.every((comment) => selectedRows[comment.commentId!]);
  }, [comments, selectedRows]);

  const onToggleSelectAll = useCallback(() => {
    comments.forEach((comment) => {
      setSelectedRows((s) => ({ ...s, [comment.commentId!]: !isAllSelected }));
    });
  }, [comments, isAllSelected]);

  const onApplyAction = useCallback(
    async (action: (comment: CommentItem) => void) => {
      for (const [commentId, selected] of Object.entries(selectedRows)) {
        if (!selected) continue;
        const comment = comments.find((c) => c.commentId === commentId);
        if (comment) action(comment);
      }
      refetch();
    },
    [comments, selectedRows, refetch],
  );

  const onAiCategorize = useCallback(
    (comment: CommentItem) => {
      toast.promise(
        async () => {
          setIsCategorizing((s) => ({ ...s, [comment.commentId!]: true }));

          // categorizing by commented text
          const commentText = comment.commentedText;

          if (!commentText) return;

          const result = await categorizeAction({
            commentId: comment.commentId!,
            videoId: comment.videoId,
            commentedText: commentText,
          });

          if (isActionError(result)) {
            setIsCategorizing((s) => ({ ...s, [comment.commentId!]: false }));
            throw new Error(`There was an error categorizing the comment.`);
          } else {
            //refetch to show updated results
            refetch();
          }
          setIsCategorizing((s) => ({ ...s, [comment.commentId!]: false }));
          return result?.category;
        },
        {
          loading: "Categorizing...",
          success: (category) =>
            `Categorized as ${capitalCase(category || "unknown")}!`,
          error: "There was an error categorizing the comment :(",
        },
      );
    },
    [refetch],
  );

  const onCategorizeAiBulk = useCallback(async () => {
    onApplyAction(onAiCategorize);
  }, [onAiCategorize, onApplyAction]);

  return (
    <>
      {!(isEmpty && hideActionBarWhenEmpty) && (
        <div className="flex items-center divide-gray-100 border-b border-l-0 bg-white px-2 py-1">
          <div className="pl-1">
            <Checkbox checked={isAllSelected} onChange={onToggleSelectAll} />
          </div>
          <div className="ml-2">
            <ActionButtonsBulk
              isCategorizing={false}
              onAiCategorize={onCategorizeAiBulk}
            />
          </div>
        </div>
      )}

      {isEmpty ? (
        <div className="py-2">
          {typeof emptyMessage === "string" ? (
            <MessageText>{emptyMessage}</MessageText>
          ) : (
            emptyMessage
          )}
        </div>
      ) : (
        <ResizeGroup
          left={
            <ul
              role="list"
              className="divide-y divide-gray-100 overflow-y-auto scroll-smooth"
              ref={listRef}
            >
              {comments.map((comment) => {
                return (
                  <CommentListItem
                    ref={(node) => {
                      const map = getMap();
                      if (node) {
                        map.set(comment.commentId!, node);
                      } else {
                        map.delete(comment.commentId!);
                      }
                    }}
                    key={comment.commentId}
                    comment={comment}
                    splitView={false}
                    selected={selectedRows[comment.commentId!]!}
                    onSelected={onSetSelectedRow}
                    isCategorizing={isCategorizing[comment.commentId!]!}
                    onAiCategorize={onAiCategorize}
                    refetch={refetch}
                  />
                );
              })}
            </ul>
          }
        />
      )}
    </>
  );
}
