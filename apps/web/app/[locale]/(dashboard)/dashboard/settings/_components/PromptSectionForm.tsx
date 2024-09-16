"use client";

import { savePromptAction } from "@/utils/actions/user";
import { handleActionResult } from "@/utils/server-action";
import { Button } from "@openstudio/ui/components/Button";
import {
  FormSection,
  FormSectionLeft,
  FormSectionRight,
  SubmitButtonWrapper,
} from "@openstudio/ui/components/Form";
import { Input } from "@openstudio/ui/components/Input";
import { useForm } from "react-hook-form";

export const PromptSectionForm = (props: { prompt?: string }) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    defaultValues: { prompt: props.prompt },
  });

  return (
    <form
      action={async (formData: FormData) => {
        const prompt = formData.get("prompt") as string;
        const result = await savePromptAction({ prompt });
        handleActionResult(result, "Updated profile!");
      }}
    >
      <FormSection>
        <FormSectionLeft
          title="Default Prompt Settings"
          description="Provide extra information to LLM Models for better one short learning to help it write better replies for you."
        />
        <div className="md:col-span-2">
          <FormSectionRight>
            <div className="sm:col-span-full">
              <Input
                type="text"
                as="textarea"
                rows={8}
                name="prompt"
                label="Default Prompt"
                registerProps={(register("prompt"), { required: true })}
                error={errors.prompt as any}
                placeholder={`Some rules to follow:
* Be friendly, concise, and professional, but not overly formal.
* Keep responses short and to the point.`}
              />
            </div>
          </FormSectionRight>
          <SubmitButtonWrapper>
            <Button
              color={"green"}
              type="submit"
              size="lg"
              loading={isSubmitting}
            >
              Save
            </Button>
          </SubmitButtonWrapper>
        </div>
      </FormSection>
    </form>
  );
};
