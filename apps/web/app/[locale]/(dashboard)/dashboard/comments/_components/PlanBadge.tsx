import { ActionType, ActionTypeType, ExecutedAction } from "@/types/app";
import { Badge, Color } from "@openstudio/ui/components/Badge";
import { HoverCard } from "@openstudio/ui/components/HoverCard";
import { capitalCase } from "change-case";
import { CheckCircleIcon } from "lucide-react";
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
