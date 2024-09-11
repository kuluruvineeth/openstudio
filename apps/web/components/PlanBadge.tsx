import { ActionType, ActionTypeType } from "@/types/app";
import { Color } from "@openstudio/ui/components/Badge";

export function getActionColor(type: ActionTypeType): Color {
  switch (type) {
    case ActionType.REPLY:
      return "lightblue";
    case ActionType.PUBLISH:
      return "green";
    case ActionType.REJECT:
      return "red";
    case ActionType.REVIEW:
      return "orange";
    case ActionType.MARK_SPAM:
      return "darkred";
    case ActionType.DELETE:
      return "gray";
    default:
      return "purple";
  }
}
