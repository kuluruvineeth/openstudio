"use client";

import {
  createRuleBody,
  CreateRuleBody,
} from "@/app/api/user/rules/validation";
import { ActionType, Rule, RuleType } from "@/types/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage, Input, Label } from "@openstudio/ui/components/Input";
import { TypographyH3 } from "@openstudio/ui/components/Typography";
import { Card } from "@openstudio/ui/components/Card";
import { Toggle } from "@openstudio/ui/components/Toggle";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@openstudio/ui/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  FieldError,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Select } from "@openstudio/ui/components/Select";
import { capitalCase } from "change-case";
import { Button, ButtonLoader } from "@openstudio/ui/components/ui/button";
import { actionInputs } from "@/utils/actionType";
import { TooltipExplanation } from "@openstudio/ui/components/TooltipExplanation";
import { HelpCircleIcon, PlusIcon } from "lucide-react";
import { Tooltip } from "@openstudio/ui/components/Tooltip";
import Link from "next/link";
import { useCallback } from "react";
import { createRuleAction, updateRuleAction } from "@/actions/Rule";
import { isActionError } from "@/utils/error";
import { toastError, toastSuccess } from "@openstudio/ui/components/Toast";

export function RuleForm({ rule }: { rule: CreateRuleBody & { id?: string } }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRuleBody>({
    resolver: zodResolver(createRuleBody),
    defaultValues: rule,
  });

  const { append, remove } = useFieldArray({ control, name: "actions" });

  const router = useRouter();

  const onSubmit: SubmitHandler<CreateRuleBody> = useCallback(
    async (data) => {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get("tab") || rule.type;
      const body = cleanRule(data, tab as RuleType);

      if (body.id) {
        const res = await updateRuleAction({ ...body, id: body.id });

        if (isActionError(res)) {
          console.error(res);
          toastError({ description: res.error });
        } else if (!res.success) {
          toastError({
            description: "There was an error updating the rule!",
          });
        } else {
          toastSuccess({ description: `Saved!` });
          router.push(`/dashboard/comments/automation`);
        }
      } else {
        const res = await createRuleAction(body);

        if (isActionError(res)) {
          console.error(res);
          toastError({ description: res.error });
        } else if (!res.rule) {
          toastError({
            description: `There was an error creating the rule.`,
          });
        } else {
          toastSuccess({ description: `Created!` });
          router.replace(`/dashboard/comments/automation/rule/${res.rule.id}`);
          router.push(`/dashboard/comments/automation`);
        }
      }
    },
    [rule.type, router],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-4">
        <Input
          type="text"
          name="Name"
          label="Rule name"
          registerProps={register("name")}
          error={errors.name}
          placeholder="eg. Reply To Positive Comments"
        />
      </div>

      <TypographyH3 className="mt-6">Conditions</TypographyH3>

      <Tabs defaultValue={rule.type} className="mt-2">
        <TabsList>
          <TabsTrigger value={Rule.AI}>AI</TabsTrigger>
        </TabsList>

        <TabsContent value={Rule.AI}>
          <div className="mt-4 space-y-4">
            <Input
              type="text"
              as="textarea"
              rows={3}
              name="Instructions"
              label="Instructions"
              registerProps={register("instructions")}
              error={errors.instructions}
              placeholder="eg. Apply this rule to all positive comments"
              tooltipText="The instructions that will be passed to the AI."
            />
          </div>
        </TabsContent>
      </Tabs>

      <TypographyH3 className="mt-6">Actions</TypographyH3>
      <div className="mt-4 space-y-4">
        {watch("actions")?.map((action, i) => {
          return (
            <Card key={i}>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <Select
                    name={`actions.${i}.type`}
                    label="Action type"
                    options={Object.keys(ActionType).map((action) => ({
                      label: capitalCase(action),
                      value: action,
                    }))}
                    registerProps={register(`actions.${i}.type`)}
                    error={
                      errors["actions"]?.[i]?.["type"] as FieldError | undefined
                    }
                  />

                  <Button
                    type="button"
                    variant={"ghost"}
                    className="mt-2"
                    onClick={() => remove(i)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="col-span-3 space-y-4">
                  {actionInputs[action.type].fields.map((field) => {
                    const isAiGenerated = action[field.name]?.ai;

                    return (
                      <div key={field.label}>
                        <div className="flex items-center justify-between">
                          <Label name={field.name} label={field.label} />
                          <div className="flex items-center space-x-2">
                            <TooltipExplanation text="If enabled the AI will generate this value in real time when processing your comments. If you want the same value each time then set it here and disable real-time AI generation." />
                            <Toggle
                              name={`actions.${i}.${field.name}.ai`}
                              label="AI generated"
                              enabled={isAiGenerated || false}
                              onChange={(enabled) => {
                                setValue(
                                  `actions.${i}.${field.name}`,
                                  enabled
                                    ? {
                                        value: "",
                                        ai: true,
                                      }
                                    : { value: "", ai: false },
                                );
                              }}
                            />
                            {field.textArea ? (
                              <textarea
                                className="mt-2 block w-full flex-1 whitespace-pre-wrap rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                rows={3}
                                placeholder={
                                  isAiGenerated ? "AI prompt (optional)" : ""
                                }
                                {...register(
                                  `actions.${i}.${field.name}.value`,
                                )}
                              />
                            ) : (
                              <input
                                className="mt-2 block w-full flex-1 whitespace-pre-wrap rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                type="text"
                                placeholder={
                                  isAiGenerated ? "AI prompt (optional)" : ""
                                }
                                {...register(
                                  `actions.${i}.${field.name}.value`,
                                )}
                              />
                            )}

                            {errors["actions"]?.[i]?.[field.name]?.message ? (
                              <ErrorMessage
                                message={
                                  errors["actions"]?.[i]?.[field.name]?.message!
                                }
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4">
        <Button
          type="button"
          variant={"outline"}
          className="w-full"
          onClick={() => append({ type: ActionType.REPLY })}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Action
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-end space-x-2">
        <Tooltip content="If enabled our AI will perform actions automatically. If disabled, you will have to confirm actions first.">
          <HelpCircleIcon className="h-5 w-5 cursor-pointer" />
        </Tooltip>

        <Toggle
          name="automate"
          label="Automate"
          enabled={watch("automate") || false}
          onChange={(enabled) => {
            setValue("automate", enabled);
          }}
        />
      </div>

      <div className="flex justify-end space-x-2 py-6">
        {rule.id ? (
          <>
            {rule.type !== Rule.AI && (
              <Button variant={"outline"} asChild>
                <Link href={`/automation/rule/${rule.id}/examples`}>
                  View Examples
                </Link>
              </Button>
            )}
            <Button type="submit">
              {isSubmitting && <ButtonLoader />}
              Save
            </Button>
          </>
        ) : (
          <Button type="submit">
            {isSubmitting && <ButtonLoader />} Create
          </Button>
        )}
      </div>
    </form>
  );
}

function cleanRule(rule: CreateRuleBody, type: RuleType) {
  // type === Rule.AI
  return {
    ...rule,
    type: Rule.AI,
  };
}
