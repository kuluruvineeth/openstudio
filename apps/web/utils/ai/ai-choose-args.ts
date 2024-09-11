import { Action, ActionTypeType, User } from "@/types/app";
import { z } from "zod";
import { isDefined } from "../types";
import { ActionItem } from "./actions";
type AIGeneratedArgs = Record<
  ActionTypeType,
  Record<keyof Omit<ActionItem, "type">, string>
>;

export function getActionsWithParameters(
  actions: Omit<Action[], "created_at" | "updated_at">,
) {
  return actions
    .map((action) => {
      const fields = getParamterFieldsForAction(action);

      if (!Object.keys(fields).length) return;

      const parameters = z.object(fields);

      return {
        type: action.type,
        parameters,
      };
    })
    .filter(isDefined);
}

function getParamterFieldsForAction({ content_prompt, content }: Action) {
  const fields: Record<string, z.ZodString> = {};

  if (typeof content_prompt === "string") {
    fields.content = z.string().describe("The comment content");
  }
  if (content === null) {
    fields.content = z.string().describe("The comment content");
  }

  return fields;
}

function getToolParamtersForRule(actions: Action[]) {
  const actionsWithParamters = getActionsWithParameters(actions);

  const typeCount: Record<string, number> = {};
  const parameters: Record<string, z.ZodObject<any>> = {};

  for (const action of actionsWithParamters) {
    typeCount[action.type] = (typeCount[action.type] || 0) + 1;
    parameters[
      typeCount[action.type] === 1
        ? action.type
        : `${action.type}_${typeCount[action.type]}`
    ] = action.parameters;
  }

  return parameters;
}
export function getActionItemsFromAiArgsResponse(
  response: AIGeneratedArgs | undefined,
  ruleActions: Action[],
) {
  return ruleActions.map((ra) => {
    const a = response?.[ra.type] || ({} as any);

    return {
      type: ra.type,
      content: ra.content === null ? a.content : ra.content,
    };
  });
}
