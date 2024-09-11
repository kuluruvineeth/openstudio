import { Action, ActionTypeType, User } from "@/types/app";
import { z } from "zod";
import { isDefined } from "../types";
import { CommentForLLM, stringifyComment } from "./stringify-comment";
import { UserAIFields } from "../llms/types";
import { RulesResponse } from "@/app/api/user/rules/route";
import { chatCompletionTools } from "../llms";
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

export async function getArgsAiResponse({
  comment,
  user,
  selectedRule,
}: {
  comment: CommentForLLM;
  user: Pick<User, "email" | "prompt"> & UserAIFields;
  selectedRule: RulesResponse[0];
}) {
  console.log(
    `Generating args for rule ${selectedRule.name} (${selectedRule.id})`,
  );

  const paramters = getToolParamtersForRule(selectedRule.action as any);

  if (!Object.keys(paramters).length) {
    console.log(
      `Skipping. No parameters for rule ${selectedRule.name} (${selectedRule.id})`,
    );
    return;
  }

  const system = `You are an AI assistant that helps people manage their youtube comments.
  Never put placeholders in your comment responses.
  Do not mention you are an AI assistant when responding to people.
  ${
    user.prompt
      ? `\nSome additional information the user has provided about themselves:\n\n${user.prompt}`
      : ""
  }`;

  const prompt = `A Comment was received for processing and the following rule was selected to process it:
  ###
  ${selectedRule.instructions}
  ###
  
  Handle the comment.
  
  The comment:
  ${stringifyComment(comment, 3000)}`;

  console.log("Calling chat completion tools");

  const aiResponse = await chatCompletionTools({
    userAi: user,
    prompt,
    system,
    tools: {
      apply_rule: {
        description: `Apply the rule with given arguments`,
        parameters: z.object(paramters),
      },
    },
    label: "Args for rule",
    userEmail: user.email || "",
  });

  const toolCall = aiResponse.toolCalls[0];

  if (!toolCall) return;
  if (!toolCall.toolName) return;

  return toolCall.args;
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
