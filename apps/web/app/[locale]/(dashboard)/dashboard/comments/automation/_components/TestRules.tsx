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
