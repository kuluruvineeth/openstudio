import { approvePlanAction, rejectPlanAction } from "@/actions/AiRule";
import { isActionError } from "@/utils/error";
import { Executing } from "@/utils/types";
import { LoadingMiniSpinner } from "@openstudio/ui/components/Loading";
import { toastError, toastSuccess } from "@openstudio/ui/components/Toast";
import { Tooltip } from "@openstudio/ui/components/Tooltip";
import { cn } from "@openstudio/ui/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";

export function useExecutePlan(refetch: () => void) {
  const [executingPlan, setExecutingPlan] = useState<Executing>({});
  const [rejectingPlan, setRejectingPlan] = useState<Executing>({});

  const executePlan = useCallback(
    //TODO: be type specific
    async (comment: any) => {
      if (!comment.plan.rule) return;

      setExecutingPlan((s) => ({ ...s, [comment.id!]: true }));

      const result = await approvePlanAction(comment.plan.id, comment);
      if (isActionError(result)) {
        toastError({
          description: "Unable to execute plan. " + result.error || "",
        });
      } else {
        toastSuccess({ description: "Executed!" });
      }

      refetch();

      setExecutingPlan((s) => ({ ...s, [comment.id!]: false }));
    },
    [refetch],
  );

  const rejectPlan = useCallback(
    async (comment: any) => {
      setRejectingPlan((s) => ({ ...s, [comment.id!]: true }));

      if (comment.plan?.id) {
        const result = await rejectPlanAction(comment.plan.id);
        if (isActionError(result)) {
          toastError({
            description: "Error rejecting plan. " + result.error || "",
          });
        } else {
          toastSuccess({ description: "Plan rejected" });
        }
      } else {
        toastError({ description: "Plan not found" });
      }

      refetch();

      setRejectingPlan((s) => ({ ...s, [comment.id!]: false }));
    },
    [refetch],
  );

  return {
    executingPlan,
    rejectingPlan,
    executePlan,
    rejectPlan,
  };
}

export function PlanActions(props: {
  comment: any;
  executingPlan: boolean;
  rejectingPlan: boolean;
  executePlan: (comment: any) => Promise<void>;
  rejectPlan: (comment: any) => Promise<void>;
  className?: string;
}) {
  const { comment, executePlan, rejectPlan } = props;

  const execute = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      executePlan(comment);
    },
    [executePlan, comment],
  );

  const reject = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      rejectPlan(comment);
    },
    [rejectPlan, comment],
  );

  if (!comment.plan?.rule) return null;

  if (
    comment.plan?.status === "APPLIED" ||
    comment.plan?.status === "REJECTED"
  ) {
    return null;
  }

  return (
    <div className={cn("flex items-center space-x-1", props.className)}>
      {props.executingPlan ? (
        <LoadingMiniSpinner />
      ) : (
        <Tooltip content="Execute AI Plan">
          <button
            type="button"
            onClick={execute}
            className="rounded-full border border-gray-400 p-1 text-gray-400 hover:border-green-500 hover:text-green-500"
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
      {props.rejectingPlan ? (
        <LoadingMiniSpinner />
      ) : (
        <Tooltip content="Reject AI Plan">
          <button
            type="button"
            onClick={reject}
            className="rounded-full border border-gray-400 p-1 text-gray-400 hover:border-red-500 hover:text-red-500"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
