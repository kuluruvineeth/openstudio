import { ActionType, ActionTypeType, ExecutedAction } from "@/types/app";
import { Badge, Color } from "@openstudio/ui/components/Badge";
import { HoverCard } from "@openstudio/ui/components/HoverCard";
import { capitalCase } from "change-case";
import { CheckCircleIcon } from "lucide-react";

export function PlanBadge(props: { plan?: any }) {
  const { plan } = props;

  if (!plan) return null;

  if (!plan.rule) {
    const component = <Badge color={"yellow"}>No plan</Badge>;

    if (plan.reason) {
      return (
        <HoverCard
          content={
            <div className="max-w-full whitespace-pre-wrap text-sm">
              <strong>Reason:</strong> {plan.reason}
            </div>
          }
        >
          {component}
        </HoverCard>
      );
    }
    return component;
  }

  return (
    <HoverCard
      content={
        <div className="text-sm">
          {plan.rule?.instructions ? (
            <div className="max-w-full whitespace-pre-wrap">
              {plan.rule.instructions}
            </div>
          ) : null}
          <div className="mt-4 space-y-2">
            {plan.actionItems?.map((action: any, i: any) => {
              return (
                <div key={i}>
                  <Badge
                    color={getActionColor(action.type)}
                    className="whitespace-pre-wrap"
                  >
                    {getActionMessage(action)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <Badge color={getPlanColor(plan, plan.status === "APPLIED")}>
        {plan.status === "APPLIED" && (
          <CheckCircleIcon className="mr-2 h-3 w-3" />
        )}
        {plan.rule.name}
      </Badge>
    </HoverCard>
  );
}

function getPlanColor(plan: any | null, executed: boolean): Color {
  if (executed) return "green";

  const firstAction = plan?.actionItems?.[0];

  switch (firstAction?.type) {
    default:
      return "darkred";
  }
}

function getActionLabel(type: ActionTypeType) {
  switch (type) {
    case ActionType.DELETE:
      return "Delete";
    case ActionType.MARK_SPAM:
      return "Spam";
    case ActionType.PUBLISH:
      return "Publish";
    case ActionType.REJECT:
      return "Reject";
    case ActionType.REPLY:
      return "Reply";
    case ActionType.REVIEW:
      return "Review";
    default:
      return capitalCase(type);
  }
}

function getActionMessage(action: ExecutedAction): string {
  switch (action.type) {
    default:
      return getActionLabel(action.type);
  }
}

export function getActionColor(actionType: ActionTypeType): Color {
  switch (actionType) {
    case ActionType.REPLY:
      return "green";
    case ActionType.MARK_SPAM:
      return "yellow";
    case ActionType.PUBLISH:
      return "lightgreen";
    case ActionType.REJECT:
      return "orange";
    case ActionType.DELETE:
      return "red";
    case ActionType.REVIEW:
      return "purple";
    default:
      return "purple";
  }
}
