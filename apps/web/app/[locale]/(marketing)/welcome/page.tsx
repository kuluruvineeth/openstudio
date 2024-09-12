import { Card } from "@openstudio/ui/components/Card";
import { PageHeading, TypographyP } from "@openstudio/ui/components/Typography";
import { Metadata } from "next";
import { Suspense } from "react";
import { OnboardingForm } from "./form";
import { SquaresPattern } from "@openstudio/ui/components/SquaresPattern";
import { getUserData } from "@/actions/GetUserData";
import { redirect } from "next/navigation";
import { env } from "@/env.mjs";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Get Started with Open Studio",
  alternates: { canonical: "/welcome" },
};

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: { question?: string; force?: boolean };
}) {
  const user = await getUserData();
  if (!user?.email) redirect("/login");
  if (!env.NEXT_PUBLIC_POSTHOG_ONBOARDING_SURVEY_ID) redirect("/dashboard");

  if (!searchParams.force && user.completed_onboarding) redirect("/dashboard");

  const questionIndex = searchParams.question
    ? Number.parseInt(searchParams.question)
    : 0;

  return (
    <div className="flex flex-col justify-center px-6 py-20 text-gray-900">
      <SquaresPattern />
      <Card className="mx-auto flex max-w-2xl flex-col justify-center space-y-6 p-10 duration-500 animate-in fade-in">
        <div className="flex flex-col text-center">
          <PageHeading>Welcome to Open Studio</PageHeading>
          <TypographyP className="mt-2">Let{"'"}s get you set up!</TypographyP>
          <div className="mt-4">
            <Suspense>
              <OnboardingForm questionIndex={questionIndex} />
            </Suspense>
          </div>
        </div>
      </Card>
    </div>
  );
}
