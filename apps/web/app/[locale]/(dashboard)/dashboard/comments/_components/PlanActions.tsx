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
