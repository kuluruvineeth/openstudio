"use client";

import {
  PageHeading,
  SectionDescription,
  TypographyH3,
} from "@openstudio/ui/components/Typography";
import { RULES_EXAMPLES } from "./examples";
import Link from "next/link";
import { AlertBasic } from "@openstudio/ui/components/Alert";
import { Button } from "@openstudio/ui/components/ui/button";

//TODO: onSubmit is empty placeholder for now

export default function AutomationSettingsPage() {
  return (
    <div className="mb-16 mt-6 md:mt-10">
      <PageHeading className="text-center">
        Get Started with AI Automation
      </PageHeading>
      <SectionDescription className="text-center">
        Automate your comment with AI.
      </SectionDescription>

      <div className="mx-auto mt-6 max-w-xl px-4 md:mt-16">
        <form onSubmit={() => {}} className="space-y-4">
          <>
            <TypographyH3>Start from an example</TypographyH3>
            <div className="mt-2 space-y-1 text-sm leading-6 text-gray-700">
              {RULES_EXAMPLES.map((example, i) => {
                return (
                  <Link
                    key={example.title}
                    className="block w-full text-left"
                    href={`/dashboard/comments/automation/rule/create?example=${i}`}
                  >
                    <AlertBasic
                      title={example.title}
                      description={example.rule.instructions}
                      icon={example.icon}
                      className="cursor-pointer hover:bg-gray-100"
                    />
                  </Link>
                );
              })}
            </div>

            <TypographyH3 className="pt-8">
              Or set up a rule yourself
            </TypographyH3>
            <div className="flex space-x-2">
              <Button variant={"outline"} asChild>
                <Link href={""}>Create rule</Link>
              </Button>
              <Button variant={"outline"} onClick={() => {}}>
                Generate rule with AI
              </Button>
            </div>
          </>
        </form>
      </div>
    </div>
  );
}
