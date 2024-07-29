import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/app/[locale]/(landing)/login/_components/LoginForm";
import LoginHeader from "@/app/[locale]/(landing)/login/_components/LoginHeader";
import LoginFooter from "./_components/LoginFooter";

export const metadata: Metadata = {
  title: "Log in | Open Studio",
  description: "Log in to Open Studio.",
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage() {
  return (
    <Suspense>
      <div className="flex h-screen flex-col justify-center text-gray-900">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <LoginHeader />
          <div className="mt-4">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <LoginFooter />
        </div>
      </div>
    </Suspense>
  );
}
