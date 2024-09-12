import { CommentItem } from "@/types/youtube/comment";
import { getActionColor, PlanBadge } from "./PlanBadge";
import { Badge } from "@openstudio/ui/components/Badge";
import { capitalCase } from "change-case";
import { getActionFields } from "@/utils/actionType";
import { PlanActions } from "./PlanActions";

export function PlanExplanation(props: {
  comment: CommentItem;
  executingPlan: boolean;
  rejectingPlan: boolean;
  executePlan: (comment: CommentItem) => Promise<void>;
  rejectPlan: (comment: CommentItem) => Promise<void>;
}) {
  const { comment } = props;
  if (!comment) return null;
  const { plan } = comment;
  if (!plan?.rule) return null;

  return (
    <div className="overflow-auto border-b border-b-gray-100 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 p-4 text-gray-900">
      <div className="flex">
        <div className="flex-shrink-0">
          <PlanBadge plan={plan} />
        </div>
        <div className="ml-2">{plan.rule?.instructions}</div>
      </div>
      <div className="mt-4 space-y-2">
        {plan.actionItems?.map((action: any, i: any) => {
          return (
            <div key={i}>
              <Badge color={getActionColor(action.type)}>
                {capitalCase(action.type)}
              </Badge>

              <div className="mt-1">
                {Object.entries(getActionFields(action)).map(([key, value]) => {
                  return (
                    <div key={key}>
                      <strong>{capitalCase(key)}: </strong>
                      <span className="whitespace-no-wrap">
                        {value as string}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        <PlanActions
          comment={comment}
          executePlan={props.executePlan}
          rejectPlan={props.rejectPlan}
          executingPlan={props.executingPlan}
          rejectingPlan={props.rejectingPlan}
        />
      </div>
    </div>
  );
}
