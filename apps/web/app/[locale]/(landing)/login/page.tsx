import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/app/[locale]/(landing)/login/_components/LoginForm";

export const metadata: Metadata = {
  title: "Log in | Open Studio",
  description: "Log in to Open Studio.",
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  return (
    <Suspense>
      <div className="flex h-screen flex-col justify-center text-gray-900">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col text-center">
            <h1 className="font-cal text-2xl">Sign In</h1>
            <p className="mt-4">
              Your AI personal assistant for youtube studio.
            </p>
          </div>
          <div className="mt-4">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <p className="px-8 pt-10 text-center text-sm text-gray-500">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-gray-900"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-gray-900"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <p className="px-4 pt-4 text-center text-sm text-gray-500">
            Open Studio{"'"}s use and transfer of information received from
            Google APIs to any other app will adhere to{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              className="underline underline-offset-4 hover:text-gray-900"
            >
              Google API Services User Data
            </a>{" "}
            Policy, including the Limited Use requirements.
          </p>
        </div>
      </div>
    </Suspense>
  );
}
