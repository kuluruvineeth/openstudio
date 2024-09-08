import {
  Action,
  ActionType,
  ActionTypeType,
  ExecutedAction,
} from "@/types/app";

export const actionInputs: Record<
  ActionTypeType,
  {
    fields: {
      name: "content" | "to";
      label: string;
      textArea?: boolean;
    }[];
  }
> = {
  [ActionType.MARK_SPAM]: { fields: [] },
  [ActionType.DELETE]: { fields: [] },
  [ActionType.PUBLISH]: {
    fields: [
      {
        name: "content",
        label: "Content",
      },
    ],
  },
  [ActionType.REJECT]: { fields: [] },
  [ActionType.REPLY]: {
    fields: [
      {
        name: "content",
        label: "Content",
      },
    ],
  },
  [ActionType.REVIEW]: { fields: [] },
};

export function getActionFields(fields: Action | ExecutedAction | undefined) {
  const res: {
    content?: string;
  } = {};

  // only return fields with a value
  if (fields?.content) res.content = fields.content;

  return res;
}
