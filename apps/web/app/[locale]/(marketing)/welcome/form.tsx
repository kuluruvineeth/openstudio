"use client";

import { env } from "@/env.mjs";
import { useRouter, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { survey } from "./survey";
import { useCallback } from "react";
import { Button, ButtonLoader } from "@openstudio/ui/components/ui/button";
import { Input } from "@openstudio/ui/components/Input";
import {
  completeOnboardingAction,
  saveOnboardingAnswersAction,
} from "@/actions/OnBoarding";

const surveyId = env.NEXT_PUBLIC_POSTHOG_ONBOARDING_SURVEY_ID;

type Inputs = Record<"$survey_response" | `$survey_response_${number}`, string>;

export const OnboardingForm = (props: { questionIndex: number }) => {
  const { questionIndex } = props;

  const posthog = usePostHog();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const name =
    questionIndex === 0
      ? `$survey_response`
      : (`$survey_response_${questionIndex}` as const);

  const isFinalQuestion = questionIndex === survey.questions.length - 1;

  const submitPosthog = useCallback(
    (responses: {}) => {
      posthog.capture("survey sent", { ...responses, $survey_id: surveyId });
    },
    [posthog],
  );

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("question", (questionIndex + 1).toString());
      newSearchParams.set(name, data[name]!);

      const responses = getResponses(newSearchParams);
      await saveOnboardingAnswersAction({
        surveyId,
        questions: survey.questions,
        answers: responses,
      });

      // submit on last question
      if (isFinalQuestion) {
        submitPosthog(responses);
        await completeOnboardingAction();
        router.push("/dashboard");
      } else {
        router.push(`/welcome?${newSearchParams}`);
      }
    },
    [name, questionIndex, router, searchParams, submitPosthog, isFinalQuestion],
  );

  const question = survey.questions[questionIndex]!;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center">
      <div>
        <div className="my-4 text-lg">{question?.question}</div>
        {question?.choices && (
          <div className="grid gap-2">
            {question.choices.map((answer) => (
              <Button
                key={answer}
                variant={
                  watch(name)?.includes(answer) ? "secondary" : "outline"
                }
                type="button"
                onClick={(e) => {
                  if (question.type === "multiple_choice") {
                    const values = new Set(getValues(name)?.split(","));
                    if (values.has(answer)) {
                      values.delete(answer);
                    } else {
                      values.add(answer);
                    }

                    const newValue = Array.from(values).join(",");
                    setValue(name, newValue);
                  } else {
                    setValue(name, answer);
                    handleSubmit(onSubmit)(e);
                  }
                }}
              >
                {answer}
              </Button>
            ))}
          </div>
        )}
        {question.type === "open" && (
          <div>
            <Input
              type="text"
              as="textarea"
              rows={3}
              name={name}
              registerProps={register(name)}
              error={errors[name]}
              placeholder="Optional"
            />
            <Button
              className="mt-4 w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <ButtonLoader />}
              Get Started
            </Button>
          </div>
        )}

        {question.type === "multiple_choice" && (
          <Button className="mt-4 w-full" type="submit">
            Next
          </Button>
        )}

        {!isFinalQuestion && (
          <div>
            <Button
              variant="ghost"
              className="mt-8"
              type="button"
              onClick={async () => {
                const responses = getResponses(searchParams);
                submitPosthog(responses);
                posthog.capture("survey dismissed", { $survey_id: surveyId });
                await completeOnboardingAction();
                router.push("/dashboard");
              }}
            >
              Skip Onboarding
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

function getResponses(searchParams: URLSearchParams): Record<string, string> {
  const responses = survey.questions.reduce((acc, _q, i) => {
    const name =
      i === 0 ? `$survey_response` : (`$survey_response_${i}` as const);

    return { ...acc, [name]: searchParams.get(name) };
  }, {});

  return responses;
}
