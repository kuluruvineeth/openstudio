import { CommentItem } from "@/types/youtube/comment";
import { Tooltip } from "@openstudio/ui/components/Tooltip";
import { XIcon } from "lucide-react";
import { ActionButtons } from "./ActionButtons";
import { PlanExplanation } from "./PlanExplanation";

export function CommentPanel(props: {
  row: CommentItem;
  isCategorizing: boolean;
  onPlanAiAction: (comment: CommentItem) => void;
  onAiCategorize: (comment: CommentItem) => void;
  onDelete: (comment: CommentItem) => void;

  executingPlan: boolean;
  rejectingPlan: boolean;
  executePlan: (comment: CommentItem) => Promise<void>;
  rejectPlan: (comment: CommentItem) => Promise<void>;
  refetch: () => void;
  close: () => void;
}) {
  const { row, close } = props;

  const plan = props.row.plan;

  return (
    <div className="flex h-full flex-col overflow-y-hidden border-l border-l-gray-100">
      <div className="sticky md:flex md:items-center md:justify-between border-b border-b-gray-100 p-4">
        <div className="md:w-0 md:flex-1">
          <h1 id="comment-text" className="text-lg font-medium text-gray-900">
            {row.commentedText}
          </h1>
          <p className="mt-1 truncate text-sm text-gray-500">
            {row.authorDisplayName}
          </p>
        </div>

        <div className="mt-3 md:ml-2 flex items-center md:mt-0">
          <ActionButtons
            commentId={props.row.commentId!}
            isPlanning={false}
            isCategorizing={props.isCategorizing}
            onPlanAiAction={() => props.onPlanAiAction(props.row)}
            onAiCategorize={() => props.onAiCategorize(props.row)}
            refetch={props.refetch}
          />
          <Tooltip content="Close">
            <button
              onClick={close}
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {plan?.rule && (
          <PlanExplanation
            comment={props.row}
            executePlan={props.executePlan}
            rejectPlan={props.rejectPlan}
            executingPlan={props.executingPlan}
            rejectingPlan={props.rejectingPlan}
          />
        )}
      </div>
    </div>
  );
}
