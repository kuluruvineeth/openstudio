import { Action, 
 } from "@/types/app";
import { z } from "zod";

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
