"use client";

import { RulesResponse } from "@/app/api/user/rules/route";
import { Rule } from "@/types/app";
import { TestResult } from "@/utils/ai/run-rules";
import { api } from "@/utils/api";
import { AlertBasic } from "@openstudio/ui/components/Alert";
import { Button } from "@openstudio/ui/components/Button";
import { Input } from "@openstudio/ui/components/Input";
import { CardContent } from "@openstudio/ui/components/ui/card";
import { Separator } from "@openstudio/ui/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { capitalCase } from "change-case";
import {
  BookOpenCheckIcon,
  CheckCircle2Icon,
  SparklesIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SlideOverSheet } from "@openstudio/ui/components/SlideOverSheet";
type TestRulesInputs = { comment: string };
export function TestRulesContent() {
  const {
    data: rules,
    isLoading,
    error,
    refetch,
  } = useQuery<RulesResponse>({
    queryKey: ["rules"],
    queryFn: async () => {
      const response = await api.get<RulesResponse>(`/user/rules`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
  return (
    <div>
      {rules?.some((rule) => rule.type === Rule.AI) && (
        <>
          <CardContent>
            <TestRulesForm />
          </CardContent>
          <Separator />
        </>
      )}
    </div>
  );
}
const TestRulesForm = () => {
  const [testResult, setTestResult] = useState<TestResult | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestRulesInputs>();

  const onSubmit: SubmitHandler<TestRulesInputs> = useCallback(() => {}, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Input
          type="text"
          as={"textarea"}
          rows={3}
          name="comment"
          placeholder="Paste in comment content or write your own. eg. I love your content"
          registerProps={register("comment", { required: true })}
          error={errors.comment}
        />
        <Button type="submit" loading={isSubmitting}>
          <SparklesIcon className="mr-2 h-4 w-4" />
          Test Rules
        </Button>
      </form>
      {testResult && (
        <div className="mt-4">
          <TestResultComponent result={testResult}></TestResultComponent>
        </div>
      )}
    </div>
  );
};
function TestResultComponent({ result }: { result: TestResult }) {
  if (!result) return null;

  if (!result.rule) {
    return (
      <AlertBasic
        variant="destructive"
        title="No rule found"
        description={
          <div className="space-y-2">
            <div>
              This comment does not match any of the rules you have set.
            </div>
            {!!result.reason && (
              <div>
                <strong>AI reason:</strong> {result.reason}
              </div>
            )}
          </div>
        }
      />
    );
  }

  if (result.actionItems) {
    const MAX_LENGTH = 280;

    const aiGeneratedContent = result.actionItems.map((action, i) => {
      return (
        <div key={i}>
          <strong>{capitalCase(action.type)}</strong>
          {Object.entries(action).map(([key, value]) => {
            if (key === "type" || !value) return null;
            return (
              <div key={key}>
                <strong>{capitalCase(key)}: </strong>
                {value}
              </div>
            );
          })}
        </div>
      );
    });

    return (
      <AlertBasic
        title={`Rule found: "${result.rule[0]?.name}`}
        variant="red"
        description={
          <div className="mt-4 space-y-4">
            {!!aiGeneratedContent.length && (
              <div>
                <strong>Content: </strong>
                {aiGeneratedContent}
              </div>
            )}
            {!!result.reason && (
              <div>
                <strong>AI reason: </strong>
                {result.reason}
              </div>
            )}
            {result.rule[0]?.type === Rule.AI && (
              <div>
                <strong>Instructions: </strong>
                {result.rule[0]?.instructions.substring(0, MAX_LENGTH) +
                  (result.rule[0]?.instructions.length < MAX_LENGTH
                    ? ""
                    : "...")}
              </div>
            )}
          </div>
        }
        icon={<CheckCircle2Icon className="h-4 w-4" />}
      />
    );
  }
}
